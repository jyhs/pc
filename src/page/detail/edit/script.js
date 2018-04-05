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
            editForm: {
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
                    {required: true, message: '请输入价格'},
                    {validator: validateMoney, trigger: 'blur'}
                ],
                point: [
                    {required: true, message: '请输入积分'},
                    {validator: validatePoint, trigger: 'blur'}
                ],
                numbers: [
                    {required: true, message: '请输入数量'},
                    {validator: validateNumbers, trigger: 'blur'}
                ],
                limits: [
                    {required: true, message: '请输入购买限额'},
                    {validator: validateLimits, trigger: 'blur'}
                ]
            },
            dialogVisible: false,
            detailEditing: {},
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    created () {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getDetailById',
            'updateDetailById'
        ]),

        async initData () {
            const {detailId} = this.$route.params;

            this.loading(true);
            try {
                this.detailEditing = await this.getDetailById({
                    id: detailId
                });
                this.editForm = _.extend({}, this.detailEditing, {
                    numbers: this.detailEditing.numbers.toString(),
                    limits: this.detailEditing.limits.toString(),
                });
                console.log(this.editForm);
            } catch(error) {
                console.error(error);
            }
            this.loading(false);
        },

        handleUpdate() {
            const {billId} = this.$route.params;

            if (_.isEqual(this.editForm, this.detailEditing)) {
                this.$message({
                    type: 'success',
                    message: `修改生物${this.detailEditing.name}成功`,
                    duration: 5000
                });
                this.$router.push({
                    name: 'detailList',
                    params: {
                        id: billId
                    }
                });
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
            const {billId} = this.$route.params;

            this.encyEditing = {};
            this.$router.push({
                name: 'detailList',
                params: {
                    id: billId
                }
            });
        },

        async handleConfirm () {
            const {detailId, billId} = this.$route.params;

            this.dialogVisible = false;
            this.loading(true);
            let result = {};
            try {
                const sendInfo = _.extend({}, {
                    id: detailId,
                    user_id: this.currentUser.id
                }, this.editForm);

                delete sendInfo['material_id'];
                delete sendInfo['bill_id'];

                result = await this.updateDetailById(sendInfo);
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `修改明细${this.detailEditing.name}成功`
                });
                this.$router.push({
                    name: 'detailList',
                    params: {
                        id: billId
                    }
                });
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'detailEdit') {
                this.$refs['editForm'].resetFields();
                this.initData();
            }
        }
    }
}