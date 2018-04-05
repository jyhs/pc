import {mapGetters, mapActions} from 'vuex';
import _ from 'lodash';
import {toFormData, isEmpty} from '@/utils/common';
import {Seawater_Provinces, AVATAR_BASE_PATH, TAOBAO_QR_BASE_PATH, WECHAT_QR_BASE_PATH} from '@/constants/index';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage} from '@/utils/common';

const ImageBasePath = {
    avatar: AVATAR_BASE_PATH,
    taobao: TAOBAO_QR_BASE_PATH,
    wechat: WECHAT_QR_BASE_PATH
};

export default {
    data() {
        return {
            editForm: {},
            provinces: [],
            cities: [],
            activeNames: ['avatar', 'qrCode', 'info', 'seller'],
            avatarImgPath: '',
            taobaoImgPath: '',
            wechatImgPath: '',
            percent: 0,
            payTypes: [{
                    code: 'zfb',
                    name: '支付宝'
                }, {
                    code: 'wx',
                    name: '微信'
                }
            ],
            payType: 'zfb',
            currentUserId: window.parseInt(localStorage.getItem('SEAWATER_USER_ID'))
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    async created() {
        this.loading(true);
        try {
            if (localStorageHasKey(Seawater_Provinces)) {
                this.provinces = getFromLocalStorage(Seawater_Provinces);
            } else {
                this.provinces = await this.getProvinces();
                saveToLocalStorage(Seawater_Provinces, this.provinces);
            }
            const result = await this.getPayQrCode({id: this.currentUserId});
            if (result.status === 'ok' && result.type) {
                this.payType = result.type;
                if (result.type === 'zfb') {
                    this.taobaoImgPath = `${TAOBAO_QR_BASE_PATH}${result.imgPath}?${Math.random()}`;
                } else {
                    this.wechatImgPath = `${WECHAT_QR_BASE_PATH}${result.imgPath}?${Math.random()}`;
                }
            }
        } catch (error) {
            console.error(error);
        }
        this.loading(false);

        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getUserById',
            'getProvinces',
            'getCitiesInProvinces',
            'uploadUserAvatar',
            'uploadPayQrCode',
            'updateUser',
            'updateCurrentUser',
            'getPayQrCode'
        ]),

        async initData() {
            const {address, description, contacts, avatarImgPath} = this.currentUser;
            this.editForm = _.extend({}, this.currentUser, {
                address: address ? address.trim() : '',
                description: description ? description.trim() : '',
                contacts: contacts ? contacts.trim() : '',
            });
            avatarImgPath && (this.avatarImgPath = `${ImageBasePath.avatar}${avatarImgPath}`);
        },

        async handleModifyUserInfo(type) {
            let sendInfo = {};
            let updatedUser = {};
            if (type === 'normal') {
                updatedUser = _.extend({}, this.currentUser, {
                    name: this.editForm.name,
                    phone: this.editForm.phone,
                    province: this.editForm.province,
                    city: this.editForm.city,
                    nowProvince: this.editForm.province,
                });
                sendInfo = _.extend({}, updatedUser);
                isEmpty(sendInfo.address) && delete sendInfo.address;
                isEmpty(sendInfo.description) && delete sendInfo.description;
                isEmpty(sendInfo.contacts) && delete sendInfo.contacts;
                delete sendInfo.nowProvince;
                delete sendInfo.password;
                delete sendInfo.pay_type;
                delete sendInfo.provinceFirstChange;
                delete sendInfo.avatarImgPath;
                delete sendInfo.taobaoImgPath;
                delete sendInfo.wechatImgPath;
            } else {
                updatedUser = _.extend({}, this.currentUser, {
                    address: this.editForm.address,
                    description: this.editForm.description,
                    contacts: this.editForm.contacts
                });
                sendInfo = _.extend({}, updatedUser);
                isEmpty(sendInfo.address) && delete sendInfo.address;
                isEmpty(sendInfo.description) && delete sendInfo.description;
                isEmpty(sendInfo.contacts) && delete sendInfo.contacts;

                delete sendInfo.nowProvince;
                delete sendInfo.password;
                delete sendInfo.pay_type;
                delete sendInfo.provinceFirstChange;
                delete sendInfo.avatarImgPath;
                delete sendInfo.taobaoImgPath;
                delete sendInfo.wechatImgPath;
            }

            this.loading(true);
            let result = {};
            try {
                result = await this.updateUser(sendInfo);
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.updateCurrentUser(updatedUser);
                this.$message({
                    type: 'success',
                    message: `更新用户${this.currentUser.name}成功`
                });
            }
        },

        async upload(which) {
            const file = this.$refs[`${which}ToUpload`].files[0];
            if (!file) {
                this.$message({
                    message: '请选择需要上传的图片',
                    type: 'warning'
                });
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                this.$message({
                    message: `${file.name}大小超过2M，请检查`,
                    type: 'warning'
                });
                return;
            }
            const fileType = file.type.substring(file.type.indexOf('/') + 1).toUpperCase();
            if (['BMP', 'JPG', 'JPEG', 'PNG', 'GIF'].indexOf(fileType) === -1) {
                this.$message({
                    message: `${file.name}文件不是图片，请检查`,
                    type: 'warning'
                });
                return;
            }

            this.loading(true);
            let result = {};
            try {
                if (which === 'avatar') {
                    result = await this.uploadUserAvatar({
                        formData: toFormData({
                            img: file,
                            id: this.currentUser.id
                        }),
                        progressCallback: this.uploadProgress
                    });
                } else {
                    result = await this.uploadPayQrCode({
                        formData: toFormData({
                            img: file,
                            id: this.currentUser.id,
                            pay_type: which === 'taobao' ? 'zfb' : 'wx'
                        }),
                        progressCallback: this.uploadProgress
                    });
                }
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this[`${which}ImgPath`] = `${ImageBasePath[which]}${result.imgPath}?${Math.random()}`;
                this.$set(this.currentUser, `${which}ImgPath`, `${result.imgPath}?${Math.random()}`);
                this.updateCurrentUser(this.currentUser);
                this.$message({
                    message: `上传${file.name}成功`,
                    type: 'success'
                });
            }
        },

        uploadProgress(percent) {
            this.percent = percent;
        },
    },

    watch: {
        '$route'(to) {
            if (to.name === 'mySetting') {
                this.initData();
            }
        },
        'currentUser': {
            handler: function () {
                this.initData();
            },
            deep: true
        },
        async 'editForm.province'(curVal) {
            this.cities = await this.getCitiesInProvinces({
                area: curVal
            });
        }
    }
}