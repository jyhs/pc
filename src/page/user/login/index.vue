<template>
    <div class="login-container" @keyup.enter="submit">
        <div class="manage-tip">
            <img :src="require(`../../../assets/img/${accept}-logo.png`)">
        </div>
        <section class="form-container" v-show="showLogin">
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
                <el-form-item prop="name">
                    <el-input v-model="loginForm.name" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item prop="phone" v-if="loginHasError">
                    <el-input
                            class="auth-input" placeholder="请输入手机号" :maxlength="11"
                            v-model="loginForm.phone">
                    </el-input>
                    <button class="verify-code-btn" :disabled="countDown.isStart"
                            @click.prevent.stop="sendVerifyCode">
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
                <el-form-item prop="auth" v-if="loginHasError">
                    <el-input :maxlength="4" placeholder="请输入短信验证码" v-model="loginForm.auth"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit" class="submit-btn">登陆</el-button>
                </el-form-item>
                <el-form-item>
                    <a class="other-actions margin-right" href="javascript: void (0)" @click="goToOtherActions('register')">
                        没有账号，去注册
                    </a>
                    <a class="other-actions margin-right" href="javascript: void (0)" @click="goToOtherActions('passForget')">
                        忘记密码
                    </a>
                    <a class="other-actions" href="javascript: void (0)" @click="goToOtherActions('mainPage')">
                        访客登录
                    </a>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    @import '../../../style/mixin';
    .login-container {
        background-color: #324057;
        width: 100%;
        height: 100%;
        min-height: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .manage-tip {
            width: 158px;
            transform: translateY(-15px);
            img {
                width: 100%;
                height: auto;
            }
        }
        .form-container {
            width: 360px;
            padding: 25px 25px 0;
            border-radius: 5px;
            text-align: center;
            background-color: #fff;
            .submit-btn {
                width: 100%;
                font-size: 16px;
            }
        }
        .other-actions {
            color: #20a0ff;
            text-decoration: underline;
            cursor: pointer;
        }
        .margin-right {
            margin-right: 30px;
        }
        .auth-input {
            input {
                width: 55%;
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
        .form-fade-enter-active, .form-fade-leave-active {
            transition: all 1s;
        }
        .form-fade-enter, .form-fade-leave-active {
            transform: translate3d(0, -50px, 0);
            opacity: 0;
        }
        .el-loading-mask {
            background-color: rgba(0,0,0,.5);
        }
        @media screen and (max-width: 768px) {
            .form-container {
                width: 300px;
            }
            .manage-tip {
                display: none;
            }
            .margin-right {
                margin-right: 5px;
            }
        }
    }
</style>
