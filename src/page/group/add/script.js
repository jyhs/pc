import {mapGetters, mapActions} from 'vuex';
import {quillEditor} from 'vue-quill-editor';
import _ from 'lodash';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage, formatDateTimeParam} from '../../../utils/common';
import {SMALL_IMAGE_BASE_PATH, Seawater_Pay_Types, Seawater_Yes_No} from '../../../constants/index';

export default {
    data() {
        const validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^1[23456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号!'));
            } else {
                callback();
            }
        };

        return {
            addForm: {
                name: '',
                contacts: '',
                phone: '',
                end_date: '',
                scope: '',
                city: '',
                pickup_date: '',
                pickup_address: '',
                description: 'TA很懒，什么都没留下~~~',
                pay_type: '',
                pay_name: '',
                pay_count: '',
                pay_description: '',
                freight: 13,
                hasTop: false,
                top_freight: 50,
                is_flash: '',
                flash_desc: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入团购名', trigger: 'blur'}
                ],
                contacts: [
                    {required: true, message: '请输入联系人', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {validator: validatePhone, trigger: 'blur'}
                ],
                end_date: [
                    {required: true, message: '请选择截止时间'},
                ],
                scope: [
                    {required: true, message: '请选择开团范围', trigger: 'change'},
                ],
                city: [
                    {required: true, message: '请选择城市', trigger: 'change'},
                ],
                /*
                pickup_date: [
                    {required: true, message: '请选择收货日期'},
                ],
                pickup_address: [
                    {required: true, message: '请输入收货地址', trigger: 'blur'}
                ],
                */
                freight: [
                    {required: true, message: '请输入运费(%)'},
                    {type: 'number', message: '参考价必须为数字值'}
                ],
                hasTop: [
                    {required: true, message: '请输入单品运费是否封顶'},
                ],
                top_freight: [
                    {required: true, message: '请输入单品运费封顶额(%)'},
                    {type: 'number', message: '封顶额必须为数字值'}
                ],
                description: [
                    {required: true, message: '请输入简介', trigger: 'blur'}
                ],
                /*
                pay_type: [
                    {required: true, message: '请选择支付类型', trigger: 'change'}
                ],
                pay_name: [
                    {required: true, message: '请输入支付账号名', trigger: 'blur'}
                ],
                pay_count: [
                    {required: true, message: '请输入支付账号', trigger: 'blur'}
                ],
                pay_description: [
                    {required: true, message: '请输入支付描述', trigger: 'blur'}
                ],
                is_flash: [
                    {required: true, message: '请选择是否支持闪送', trigger: 'change'}
                ],
                flash_desc: [
                    {required: true, message: '请输入闪送描述', trigger: 'blur'}
                ],
                */
            },
            pickerOptions: {
                //只能选择大于等于今天的日期
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            editorOption: {
                placeholder: "请输入其他信息，支持html",
                modules: {
                    toolbar: [
                        [{'color': []}, {'background': []}],
                    ]
                }
            },
            bill: {},
            detailList: [],
            payTypes: [],
            yesOrNo: [],
            cities: [],
            scopes: [{
                key: 'china',
                value: '全国'
            }, {
                key: 'province',
                value: '省份'
            }],
            isExpand: false,
            imagePath: '',
            activeNames: ['info', 'billDetails'],
            isPrivate: false
        }
    },

    components: {
        quillEditor
    },

    computed: {
        ...mapGetters(['currentUser', 'addedBill'])
    },

    async created() {
        this.loading(true);
        try {
            if (localStorageHasKey(Seawater_Pay_Types)) {
                this.payTypes = getFromLocalStorage(Seawater_Pay_Types);
            } else {
                this.payTypes = await this.getPayTypes();
                saveToLocalStorage(Seawater_Pay_Types, this.payTypes);
            }
            if (localStorageHasKey(Seawater_Yes_No)) {
                this.yesOrNo = getFromLocalStorage(Seawater_Yes_No);
            } else {
                this.yesOrNo = await this.getYesOrNo();
                saveToLocalStorage(Seawater_Yes_No, this.yesOrNo);
            }

            const {nowProvince} = this.currentUser;
            nowProvince && (this.cities = await this.getCitiesInProvinces({
                area: nowProvince
            }));
        } catch (error) {
            console.error(error);
        }
        this.loading(false);

        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getPayTypes',
            'getYesOrNo',
            'getCitiesInProvinces',
            'getEncyImageById',
            'getDetailsByBillId',
            'getBillById',
            'addGroupByBillIdAndUserId'
        ]),

        async initData() {
            this.addForm.name = this.addedBill.billName;
            this.addForm.end_date = this.addedBill.effortDate;
            this.addForm.contacts = this.currentUser.name;
            this.addForm.phone = this.currentUser.phone;
            if (this.currentUser.type === 'cjlss') {
                this.addForm.scope = 'china';
            }  else {
                this.addForm.scope = 'province';
            }
            const {id} = this.$route.params;

            this.loading(true);
            try {
                this.bill = await this.getBillById({id});
                this.detailList = await this.getDetailsByBillId({id});
            } catch (error) {
                console.error(error);
            }
            this.loading(false);
        },

        toggleExpand() {
            this.isExpand = !this.isExpand;
        },

        async handleDetailImageShow(detail) {
            if (!detail['material_id'] || !this.preDetail) {
                this.preDetail = detail;
                this.imagePath = require('../../../assets/svg/default_detail.svg');
                return;
            }
            if (detail.id === this.preDetail.id) {
                return;
            }

            this.preDetail = detail;
            this.imagePath = '';
            let result = {};
            try {
                result = await this.getEncyImageById({id: detail['material_id']});
            } catch (error) {
                console.error(error);
            }

            if (result.status === 'ok') {
                if (result.image) {
                    this.imagePath = `${SMALL_IMAGE_BASE_PATH}${result.image}`;
                } else {
                    this.imagePath = require('../../../assets/svg/default_detail.svg');
                }
            }
        },

        async submit() {
            this.$refs['addForm'].validate(async (valid) => {
                if (valid) {
                    this.loading(true);
                    let result = {};
                    const {id, nowProvince} = this.currentUser;
                    const sendInfo = _.extend({}, this.addForm, {
                        end_date: this.addForm.end_date ? formatDateTimeParam(this.addForm.end_date) : '',
                        pickup_date: this.addForm.pickup_date ? formatDateTimeParam(this.addForm.pickup_date) : '',
                        bill_id: this.$route.params.id,
                        user_id: id,
                        province: this.addForm.scope === 'china' ? 'china' : nowProvince,
                        city: this.addForm.scope === 'china' ? 'china' : this.addForm.city,
                        freight: this.addForm.freight / 100,
                        top_freight: this.addForm.hasTop ? this.addForm.top_freight : undefined
                    });
                    if (this.isPrivate) {
                        sendInfo.private = 1;
                    }

                    for (let key of Object.keys(sendInfo)) {
                        if (!sendInfo[key]) {
                            delete sendInfo[key];
                        }
                    }
                    delete sendInfo.scope;
                    delete sendInfo.hasTop;

                    try {
                        result = await this.addGroupByBillIdAndUserId(sendInfo);
                    } catch (error) {
                        console.error(error);
                    }
                    this.loading(false);

                    if (result.status === 'ok') {
                        this.$message({
                            type: 'success',
                            message: `开团${this.addForm.name}成功`
                        });
                        this.$router.push({name: 'myGroups'});
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '请检查输入是否正确',
                        offset: 100
                    });
                    return false;
                }
            });
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'groupAdd') {
                this.$refs['addForm'].resetFields();
                this.initData();
            }
        },
        'currentUser.nowProvince': {
            handler: async function (curValue) {
                this.cities = await this.getCitiesInProvinces({area: curValue});
                this.addForm.city = '';
            },
            deep: true
        },
        'currentUser.name'(curValue) {
            this.addForm.contacts = curValue;
        },
        'currentUser.phone'(curValue) {
            this.addForm.phone = curValue;
        }
    }
}
