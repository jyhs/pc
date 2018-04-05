<template>
    <div class="first_step_container">
        <el-form :model="firstForm" :rules="rules" ref="firstForm" label-width="140px">
            <el-form-item prop="name" label="用户名">
                <el-input v-model="firstForm.name" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="phone" label="手机号">
                <el-input class="auth_input" v-model="firstForm.phone" :maxlength="11" placeholder="请输入手机号"></el-input>
                <button
                        class="verify-code-btn right"
                        :disabled="countDown.isStart"
                        @click.prevent.stop="sendVerifyCode"
                >
                    <CountDown
                            :is-start="countDown.isStart"
                            :seconds="120"
                            initContent="获取短信验证码"
                            afterContent="重新获取验证码"
                            :on-count-end="handleCountEnd"
                    >
                    </CountDown>
                </button>
            </el-form-item>
            <!--
            <el-form-item prop="auth" label="验证码">
                <el-input class="auth_input" placeholder="验证码" :maxlength="4" v-model="firstForm.auth"></el-input>
                <img :src="authSVG" alt="" class="auth_img" @click="updateAuth">
            </el-form-item>
            -->
            <el-form-item prop="auth" label="验证码">
                <el-input placeholder="请输入验证码" :maxlength="4" v-model="firstForm.auth"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="submit_btn" @click="toNextStep">下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    import CountDown from '../../components/countDown.vue';
    import {API_BASE_PATH} from '@/constants/index';

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
                firstForm: {
                    name: '',
                    phone: '',
                    auth: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: validatePhone, trigger: 'blur'}
                    ],
                    auth: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                },
                authSVG: `${API_BASE_PATH}/api/tools/verification?${Math.random()}`,
                requestId: '',
                countDown: {
                    isStart: false
                },
            }
        },

        components: {
            CountDown
        },

        methods: {
            ...mapActions([
                'loading',
                'sendVerification',
                'verifyForgetCode'
            ]),

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

                this.$refs['firstForm'].validate(async (valid) => {
                    if (valid) {
                        this.loading(true);
                        let result = {};
                        try {
                            result = await this.sendVerification({
                                phone: this.firstForm.phone,
                            });
                        } catch(error) {
                            console.error(error);
                        }
                        this.loading(false);

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

            toNextStep() {
                this.rules.auth = [
                    {required: true, message: '请输入验证码', trigger: 'blur'}
                ];

                this.$refs['firstForm'].validate(async (valid) => {
                    if (valid) {
                        this.loading(true);
                        let result = {};
                        try {
                            result = await this.verifyForgetCode({
                                name: this.firstForm.name,
                                phone: this.firstForm.phone,
                                auth: this.firstForm.auth,
                                requestId: this.requestId
                            });
                        } catch (error) {
                            console.error(error);
                        }
                        this.loading(false);

                        if (result.status === 'ok') {
                            this.$emit('nextStep', 1, result.id, this.firstForm.phone);
                        } else {
                            this.$message({
                                type: 'error',
                                message: '验证失败，请重新输入'
                            });
                            this.$refs['firstForm'].resetFields();
                        }
                    }
                });
            }
        }
    }
</script>
<style lang="less">
    .first_step_container {
        padding: 0 20px;
        .el-form-item__content {
            position: relative;
            .el-button {
                position: absolute;
                left: 0;
            }
        }
        .auth_input {
            input {
                width: 75%;
                position: absolute;
                left: 0;
                top: -22px;
            }
        }
        .verify-code-btn {
            position: absolute;
            right: 0;
            top: 0;
            width: 110px;
            height: 38px;
            line-height: 38px;
            background-color: #20a0ff;
            color: #fff;
            padding: 0 5px;
            border-radius: 5px;
            text-decoration: none;
            cursor: pointer;
            &:disabled {
                background-color: #999;
            }
        }
        .auth_img {
            position: absolute;
            right: 0;
            top: -12px;
            width: 100px;
            height: 60px;
        }
    }
</style>