import {mapActions} from 'vuex';
import _ from 'lodash';
import CountDown from '../../../components/countDown.vue';
import {API_BASE_PATH} from '@/constants/index';

export default {
    data() {
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else {
                if (/^[0-9]*$/.test(value)) {
                    callback(new Error('用户名不可以数字开头'));
                } else {
                    this.checkUsername({name: value}).then(data => {
                        if (data.status === 'ok') {
                            callback();
                        }
                    }).catch(error => {
                        console.error(error);
                        callback(new Error('用户名已被使用'));
                    });
                }
            }
        };

        const validatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (!/^[a-zA-Z0-9_]{8,20}$/.test(value)) {
                    callback(new Error('8-20位字母、数字的组合'));
                }
                if (this.registerForm.password2 !== '') {
                    this.$refs['registerForm'].validateField('password2');
                }
                callback();
            }
        };

        const validatePassword2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.password1) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
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

        return {
            registerForm: {
                name: '',
                password1: '',
                password2: '',
                phone: '',
                auth: '',
            },
            rules: {
                name: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {validator: validateName, trigger: 'blur'}
                ],
                password1: [
                    {validator: validatePassword, trigger: 'blur'}
                ],
                password2: [
                    {validator: validatePassword2, trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {validator: validatePhone, trigger: 'blur'}
                ],
                auth: [
                    {required: true, message: '请输入短信验证码', trigger: 'blur'}
                ],
            },
            showRegister: false,
            provinces: [],
            types: [],
            authSVG: `${API_BASE_PATH}/api/tools/verification?${Math.random()}`,
            requestId: '',
            accept: window.localStorage.getItem('SEAWATER_ACCEPT') || 'www',
            countDown: {
                isStart: false
            },
        }
    },

    components: {
        CountDown
    },

    mounted() {
        this.showRegister = true;
    },

    methods: {
        ...mapActions([
            'loading',
            'checkUsername',
            'sendVerification',
            'register'
        ]),

        goToLogin() {
            this.$router.push({name: 'login'});
        },

        updateAuth() {
            this.authSVG = this.authSVG.replace(/\?.*/ig, '') + '?' + Math.random();
        },

        handleCountEnd (isEnd) {
            if (isEnd) {
                this.countDown.isStart = false;
            }
        },

        sendVerifyCode() {
            this.rules.auth = [];

            this.$refs['registerForm'].validate(async (valid) => {
                if (valid) {
                    let result = {};
                    try {
                        result = await this.sendVerification({
                            phone: this.registerForm.phone,
                        });
                    } catch(error) {
                        console.error(error);
                    }

                    if (result.status === 'ok') {
                        this.requestId = result.requestId;
                        this.$message({
                            type: 'success',
                            message: '发送短信验证码成功，请查收'
                        });
                        this.countDown.isStart = true;
                    } else {
                        this.$message({
                            type: 'error',
                            message: '发送短信验证码失败，请稍后重试'
                        });
                        this.updateAuth();
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
        },

        async submit() {
            this.rules.auth = [
                {required: true, message: '请输入短信验证码', trigger: 'blur'}
            ];

            this.$refs['registerForm'].validate(async (valid) => {
                if (valid) {
                    this.loading(true);
                    let result = {};
                    try {
                        result = await this.register(_.extend({}, this.registerForm, {
                            requestId: this.requestId
                        }));
                    } catch(error) {
                        console.error(error);
                    }
                    this.loading(false);

                    if (result.status === 'ok') {
                        this.$message({
                            type: 'success',
                            message: '注册成功，请登录'
                        });
                        this.goToLogin();
                    } else {
                        this.updateAuth();
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
    }
}