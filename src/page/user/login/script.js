import {mapActions} from 'vuex';
import _ from 'lodash';
import {API_BASE_PATH} from '@/constants/index';
import CountDown from '../../../components/countDown.vue';

const SVG_PATH = `${API_BASE_PATH}/api/tools/verification`;

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
            loginForm: {
                name: '',
                password: '',
                phone: '',
                auth: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {validator: validatePhone, trigger: 'blur'}
                ],
                auth: [
                    {required: true, message: '请输入短信验证码', trigger: 'blur'}
                ],
            },
            showLogin: false,
            key: '',
            authSVG: '',
            countDown: {
                isStart: false
            },
            loginHasError: Boolean(window.sessionStorage.getItem('SEAWATER_LOGIN_HAS_ERROR')) || false,
            requestId: ''
        }
    },

    components: {
        CountDown
    },

    created () {
        this.key = new Date().getTime();
        this.authSVG = `${SVG_PATH}?key=${this.key}`;
        this.loginHasError = Boolean(window.sessionStorage.getItem('SEAWATER_LOGIN_HAS_ERROR')) || false;
    },

    mounted() {
        this.showLogin = true;
    },

    methods: {
        ...mapActions([
            'loading',
            'login',
            'sendVerification',
            'updateUserPhone'
        ]),

        goToOtherActions(actionType) {
            this.$router.push({name: actionType});
        },

        updateAuth() {
            //this.authSVG = this.authSVG.replace(/\?.*/ig, '') + '?' + Math.random();
            this.key = new Date().getTime();
            this.authSVG = `${SVG_PATH}?key=${this.key}`;
        },

        handleCountEnd (isEnd) {
            if (isEnd) {
                this.countDown.isStart = false;
            }
        },

        sendVerifyCode() {
            this.rules.auth = [];
            this.loginForm.auth = '';

            this.$refs['loginForm'].validate(async (valid) => {
                if (valid) {
                    let result = {};
                    try {
                        result = await this.sendVerification({
                            phone: this.loginForm.phone,
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

            this.$refs['loginForm'].validate(async (valid) => {
                if (valid) {
                    this.loading(true);
                    let result = {};
                    try {
                        const sendInfo = _.extend({}, this.loginForm, {
                            requestId: this.requestId || 'defaultRequestId',
                            is_error: this.loginHasError,
                            auth: this.loginForm.auth || '1234',
                            phone: this.loginForm.phone || '00000000000'
                        });

                        result = await this.login(sendInfo);
                    } catch (error) {
                        console.error(error);
                        this.loginHasError = true;
                        window.sessionStorage.setItem('SEAWATER_LOGIN_HAS_ERROR', true);
                        this.loginForm.name = '';
                        this.loginForm.password = '';
                    }
                    this.loading(false);

                    if (result.status === 'ok') {
                        this.$message({
                            type: 'success',
                            message: '登录成功'
                        });
                        window.localStorage.setItem('Authorization', result.token);
                        window.localStorage.setItem('SEAWATER_USER_ID', result.id);
                        window.sessionStorage.removeItem('SEAWATER_LOGIN_HAS_ERROR');
                        this.loginHasError = false;

                        const groupId = window.sessionStorage.getItem('SEAWATER_TO_PRIVATE');
                        if (groupId) {
                            this.$router.push({
                                name: 'buyPage',
                                params: {
                                    groupId
                                }
                            });
                        } else {
                            this.$router.push({name: 'mainPage'});
                        }
                    } else {
                        this.updateAuth();
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: '请输入正确的用户名密码'
                    });
                }
            });
        }
    }
}