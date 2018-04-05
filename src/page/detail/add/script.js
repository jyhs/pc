import {mapGetters, mapActions} from 'vuex';
import _ from 'lodash';
import RegExp from '@/constants/regExp';

export default {
    data () {
        const validateMoney = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入价格'));
            } else if (!RegExp.MoneyReg.test(value)) {
                callback(new Error('请输入正确的价格'));
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
        const validateNumbers = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入数量'));
            } else if (value === '0') {
                callback();
            } else if (!RegExp.IntegerReg.test(value)) {
                callback(new Error('请输入正确的数量'));
            } else {
                callback();
            }
        };
        const validateLimits = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入购买限额'));
            } else if (value === '0') {
                callback();
            } else if (!RegExp.IntegerReg.test(value)) {
                callback(new Error('请输入正确的购买限额'));
            } else {
                callback();
            }
        };

        return {
            addForm: {
                name: '',
                size: '',
                price: '',
                point: '',
                numbers: '',
                limits: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入明细名', trigger: 'blur'}
                ],
                size: [
                    {required: true, message: '请输入尺寸', trigger: 'blur'}
                ],
                price: [
                    {required: true, message: '请输入价格', trigger: 'blur'},
                    {validator: validateMoney, trigger: 'blur'}
                ],
                point: [
                    {required: true, message: '请输入积分', trigger: 'blur'},
                    {validator: validatePoint, trigger: 'blur'}
                ],
                numbers: [
                    {required: true, message: '请输入数量', trigger: 'blur'},
                    {validator: validateNumbers, trigger: 'blur'}
                ],
                limits: [
                    {required: true, message: '请输入购买限额', trigger: 'blur'},
                    {validator: validateLimits, trigger: 'blur'}
                ]
            }
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    methods: {
        ...mapActions([
            'loading',
            'addDetailByBillIdAndUserId'
        ]),

        async submitAdd () {
            const {id} = this.$route.params;

            this.$refs['addForm'].validate(async (valid) => {
                if (valid) {
                    this.loading(true);
                    let result = {};
                    try {
                        result = await this.addDetailByBillIdAndUserId(_.extend({
                            bill_id: id,
                            user_id: this.currentUser.id
                        }, this.addForm));
                    } catch (error) {
                        console.error(error);
                    }
                    this.loading(false);

                    if (result.status === 'ok') {
                        this.$message({
                            type: 'success',
                            message: `添加明细${this.addForm.name}成功`
                        });
                        this.$router.push({
                            name: 'detailList',
                            params: {
                                id
                            }
                        });
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
        '$route'() {
            this.$refs['addForm'].resetFields();
        }
    }
}