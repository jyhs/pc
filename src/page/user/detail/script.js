import {mapActions} from 'vuex';
import {Seawater_Provinces, AVATAR_BASE_PATH, TAOBAO_QR_BASE_PATH,
    WECHAT_QR_BASE_PATH} from '@/constants/index';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage} from '@/utils/common';

export default {
    data() {
        return {
            activeNames: ['avatar', 'qrCode', 'info', 'seller'],
            avatarImgPath: require('../../../assets/svg/default_avatar.svg'),
            qrCodeImage: require('../../../assets/svg/default_qr_code.svg'),
            currentUser: '',
            payTypes: [{
                code: 'zfb',
                name: '支付宝'
            }, {
                code: 'wx',
                name: '微信'
            }
            ],
            payType: '',
            provinces: [],
            cities: [],
        }
    },

    created() {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getUserById',
            'getUserAvatar',
            'getPayQrCode',
            'getProvinces',
            'getCitiesInProvinces'
        ]),

        async initData() {
            const {id} = this.$route.params;

            this.loading(true);
            try {
                this.currentUser = (await this.getUserById({id}))[0];
                const avatarImgPath = (await this.getUserAvatar({id: this.currentUser.id})).imgPath;
                if (avatarImgPath) {
                    this.avatarImgPath = `${AVATAR_BASE_PATH}${avatarImgPath}?${Math.random()}`
                } else {
                    this.avatarImgPath = require('../../../assets/svg/default_avatar.svg');
                }
                const result = await this.getPayQrCode({id: this.currentUser.id});
                if (result.status === 'ok' && result.type) {
                    this.payType = result.type;
                    if (result.type === 'zfb') {
                        this.qrCodeImage = `${TAOBAO_QR_BASE_PATH}${result.imgPath}?${Math.random()}`;
                    } else {
                        this.qrCodeImage = `${WECHAT_QR_BASE_PATH}${result.imgPath}?${Math.random()}`;
                    }
                } else {
                    this.qrCodeImage = require('../../../assets/svg/default_qr_code.svg');
                }

                if (localStorageHasKey(Seawater_Provinces)) {
                    this.provinces = getFromLocalStorage(Seawater_Provinces);
                } else {
                    this.provinces = await this.getProvinces();
                    saveToLocalStorage(Seawater_Provinces, this.provinces);
                }
                this.cities = await this.getCitiesInProvinces({
                    area: this.currentUser.province
                });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'userDetail') {
                this.initData();
            }
        }
    }
}