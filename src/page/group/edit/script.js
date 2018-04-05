import {mapGetters, mapActions} from 'vuex';
import {quillEditor} from 'vue-quill-editor';
import _ from 'lodash';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage,
    mapKey, formatDateParam, isEmpty} from '@/utils/common';
import {Seawater_Pay_Types, Seawater_Yes_No} from '@/constants/index';

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
            editForm: {
                name: '',
                contacts: '',
                phone: '',
                city: '',
                end_date: '',
                pickup_date: new Date(),
                pickup_address: '',
                description: 'TA很懒，什么都没留下~~~',
                pay_type: '',
                pay_name: '',
                pay_count: '',
                pay_description: '',
                freight: '',
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
                city: [
                    {required: true, message: '请选择开团城市', trigger: 'change'}
                ],
                end_date: [
                    {required: true, message: '请选择截止日期'},
                ],
                description: [
                    {required: true, message: '请输入简介', trigger: 'blur'}
                ],
                /*
                pickup_date: [
                    {required: true, message: '请选择收货日期'},
                ],
                pickup_address: [
                    {required: true, message: '请输入收货地址', trigger: 'blur'}
                ],
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
                freight: [
                    {required: true, message: '请输入运费(%)'},
                    {type: 'number', message: '参考价必须为数字值'}
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
                placeholder: "请输入简介，支持html",
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{'list': 'ordered'}, { 'list': 'bullet'}],
                        [{'header': [1, 2, 3, 4, 5, 6, false]}],
                        [{'color': []}, { 'background': []}],
                        [{'font': [] }],
                        [{'align': []}],
                        ['link'],
                        ['clean']
                    ]
                }
            },
            cities: [],
            payTypes: [],
            yesOrNo: [],
            dialogVisible: false,
            groupEditing: {},
            isExpand: false
        }
    },

    components: {
        quillEditor
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    async created () {
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
        } catch(error) {
            console.error(error);
        }

        const {nowProvince} = this.currentUser;
        nowProvince && (this.cities = await this.getCitiesInProvinces({
            area: nowProvince
        }));
        this.loading(false);

        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getCitiesInProvinces',
            'getPayTypes',
            'getYesOrNo',
            'getGroupById',
            'updateGroup'
        ]),

        async initData() {
            this.loading(true);
            try {
                this.groupEditing = (await this.getGroupById({
                    id: this.$route.params.id
                }))[0];

                this.editForm = _.extend({}, this.groupEditing, {
                    city: !isEmpty(this.groupEditing.city) ? this.groupEditing.city : this.currentUser.city,
                    pickup_date: new Date(),
                    pickup_address: !isEmpty(this.groupEditing.pickup_address) ? this.groupEditing.pickup_address : '',
                    pay_count: !isEmpty(this.groupEditing.pay_count) ? this.groupEditing.pay_count : '',
                    pay_name: !isEmpty(this.groupEditing.pay_name) ? this.groupEditing.pay_name : '',
                    pay_type: !isEmpty(this.groupEditing.pay_type) ? this.groupEditing.pay_type : '',
                    pay_description: !isEmpty(this.groupEditing.pay_description) ? this.groupEditing.pay_description : '',
                    is_flash: !isEmpty(this.groupEditing.is_flash) ? this.groupEditing.is_flash.toString() : '',
                    freight: !isEmpty(this.groupEditing.freight) ? this.groupEditing.freight * 100 : '',
                    flash_desc: !isEmpty(this.groupEditing.flash_desc) ? this.groupEditing.flash_desc : '',
                });
                const {nowProvince} = this.currentUser;
                nowProvince && (this.cities = await this.getCitiesInProvinces({
                    area: nowProvince
                })['res']);
            } catch(error) {
                console.error(error);
            }
            this.loading(false);
        },

        handleUpdate() {
            if (_.isEqual(this.editForm, this.groupEditing)) {
                this.$message({
                    type: 'success',
                    message: `修改团购${this.groupEditing.name}成功`,
                    duration: 5000
                });
                this.$router.push({name: 'groupList'});
            } else {
                this.$refs['editForm'].validate(async (valid) => {
                    if (valid) {
                        this.dialogVisible = true;
                    } else {
                        this.$message({
                            type: 'error',
                            message: '请检查输入的信息'
                        });
                    }
                });
            }
        },

        handleCancelEdit() {
            this.encyEditing = {};
            this.$router.push({name: 'groupList'});
        },

        async handleConfirm() {
            this.dialogVisible = false;
            this.loading(true);
            let result = {};
            try {
                const sendInfo = _.extend({}, this.editForm, {
                    id: this.$route.params.id,
                    user_id: this.currentUser.id,
                    end_date: formatDateParam(this.editForm.end_date),
                    pickup_date: formatDateParam(this.editForm.pickup_date),
                    pickup_address: !isEmpty(this.editForm.pickup_address) ? this.editForm.pickup_address : undefined,
                    pay_type: !isEmpty(this.editForm.pay_type) ? this.editForm.pay_type : undefined,
                    pay_count: !isEmpty(this.editForm.pay_count) ? this.editForm.pay_count : undefined,
                    pay_name: !isEmpty(this.editForm.pay_name) ? this.editForm.pay_name : undefined,
                    pay_description: !isEmpty(this.editForm.pay_description) ? this.editForm.pay_description : undefined,
                    flash_desc: !isEmpty(this.editForm.flash_desc) ? this.editForm.flash_desc : undefined,
                    freight: !isEmpty(this.editForm.freight) ? this.editForm.freight * 0.01 : '',
                });
                delete sendInfo.name;
                delete sendInfo.bill_id;
                delete sendInfo.supplierName;

                result = await this.updateGroup(sendInfo);
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `修改团购${this.groupEditing.name}成功`,
                    duration: 5000
                });
                this.$router.push({name: 'groupList'});
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'groupEdit') {
                this.initData();
            }
        },
        'currentUser.nowProvince': {
            handler: async function (curValue) {
                this.cities = await this.getCitiesInProvinces({
                    area: curValue
                });
                /*
                const {provinceFirstChange} = this.currentUser;
                if (provinceFirstChange === false) {
                    this.editForm.city = '';
                }
                */
            }
        }
    }
}