import {mapGetters, mapActions} from 'vuex';
import _ from 'lodash';
import RegExp from '@/constants/regExp';
import {Seawater_Provinces, Seawater_User_Types} from '@/constants/index';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage, isEmpty} from '@/utils/common';

export default {
    data() {
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else {
                if (/^[0-9]*$/.test(value)) {
                    callback(new Error('用户名不可以数字开头'));
                } else {
                    callback();
                }
            }
        };
        const validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^1[23456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号!'));
            } else {
                callback();
            }
        };
        const validatePoint = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入积分'));
            } else if (value === '0') {
                callback();
            } else if (!RegExp.IntegerReg.test(value)) {
                callback(new Error('请输入正确的积分'));
            } else {
                callback();
            }
        };

        return {
            editForm: {
                name: '',
                phone: '',
                province: '',
                city: '',
                point: '',
                address: '',
                description: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {validator: validateName, trigger: 'blur'}
                ],
                phone: [
                    {validator: validatePhone, trigger: 'blur'}
                ],
                province: [
                    {required: true, message: '请选择省份', trigger: 'change'},
                ],
                city: [
                    {required: true, message: '请选择城市', trigger: 'change'},
                ],
                point: [
                    {required: true, message: '请输入积分', trigger: 'blur'},
                    {validator: validatePoint, trigger: 'blur'}
                ],
                /*
                address: [
                    {required: true, message: '请输入地址', trigger: 'blur'},
                ],
                description: [
                    {required: true, message: '请输入简介', trigger: 'blur'},
                ],
                */
            },
            types: [],
            provinces: [],
            cities: [],
            userEditing: {},
            dialogVisible: false
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
            if (localStorageHasKey(Seawater_User_Types)) {
                this.types = getFromLocalStorage(Seawater_User_Types);
            } else {
                this.types = await this.getTypes();
                saveToLocalStorage(Seawater_User_Types, this.types);
            }
        } catch(error) {
            console.error(error);
        }
        this.loading(false);

        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getTypes',
            'getProvinces',
            'getCitiesInProvinces',
            'checkUsername',
            'getUserById',
            'updateUser'
        ]),

        async initData() {
            this.$refs['editForm'] && this.$refs['editForm'].resetFields();
            const {id} = this.$route.params;

            this.loading(true);
            try {
                const userEditing = (await this.getUserById({id}))[0];
                this.userEditing = _.extend({}, userEditing, {
                    point: userEditing.point ? userEditing.point : '0',
                    address: isEmpty(userEditing.address) ? '' : userEditing.address,
                    contacts: isEmpty(userEditing.contacts) ? '' : userEditing.contacts,
                    description: isEmpty(userEditing.description) ? '' : userEditing.description,
                });

                this.cities = await this.getCitiesInProvinces({
                    area: userEditing.province
                });
            } catch (error) {
                console.error(error);
            }

            this.editForm = _.extend({}, this.userEditing);
            this.handleTypeChange();
            this.loading(false);
        },

        handleTypeChange() {
            for (let type of this.types) {
                if (type.code === this.editForm.type) {
                    this.$set(this.editForm, 'typeDesc', type.desc);
                    break;
                }
            }
        },

        async handleProvinceChange(curVal) {
            if (curVal) {
                this.cities = await this.getCitiesInProvinces({
                    area: curVal
                });
            }
        },

        async handleSubmit(formName) {
            delete this.editForm['typeDesc'];
            delete this.editForm.password;

            if (_.isEqual(this.editForm, this.userEditing)) {
                this.$message({
                    type: 'success',
                    message: `修改用户${this.userEditing.name}成功`,
                    duration: 5000
                });
                this.$router.push({name: 'userList'});
            } else {
                this.$refs[formName].validate(valid => {
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
            this.$router.push({name: 'userList'});
        },

        async handleConfirm() {
            this.dialogVisible = false;

            this.loading(true);
            let result = {};
            try {
                const sendInfo = _.extend({}, this.editForm);
                !sendInfo.address && delete sendInfo.address;
                !sendInfo.contacts && delete sendInfo.contacts;
                !sendInfo.description && delete sendInfo.description;
                delete sendInfo.pay_type;
                delete sendInfo.cityName;

                result = await this.updateUser(sendInfo);
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `修改用户${this.userEditing.name}成功`,
                    duration: 5000
                });
                this.$router.push({name: 'userList'});
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'userEdit') {
                this.initData();
            }
        }
    }
}