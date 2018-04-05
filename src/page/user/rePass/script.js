import {mapActions} from 'vuex';
import CommonUtil from '@/utils/common';

export default {
    data() {
        const validatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.passForm.password2 !== '') {
                    this.$refs['passForm'].validateField('password2');
                }
                callback();
            }
        };
        const validatePassword2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.passForm.password1) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        return {
            passForm: {
                password1: '',
                password2: ''
            },
            rules: {
                password1: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                password2: [
                    { validator: validatePassword2, trigger: 'blur' }
                ]
            },
            userEditing: {},
            dialogVisible: false
        }
    },

    async created() {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getUserById',
            'changePassword'
        ]),

        async initData() {
            const {id} = this.$route.params;

            this.loading(true);
            try {
                this.userEditing = (await this.getUserById({id}))[0];
            } catch(error) {
                console.error(error);
            }
            this.loading(false);
        },

        handleSubmit() {
            this.dialogVisible = true;
        },

        handleCancelChange() {
            this.userEditing = {};
            this.$router.push({name: 'userList'});
        },

        async handleConfirm() {
            this.dialogVisible = false;
            const randomPassword = CommonUtil.randomString();

            this.loading(true);
            let result = {};
            try {
                result = await this.changePassword({
                    id: this.userEditing.id,
                    password: randomPassword
                });
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$notify.success({
                    type: 'success',
                    message: `成功修改用户${this.userEditing.name}密码为${randomPassword}`,
                    duration: 0,
                    showClose: true
                });
                this.$router.push({name: 'userList'});
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'userRePass') {
                this.initData();
            }
        }
    }
}