<template>
    <div class="second_step_container">
        <el-form :model="secondFrom" :rules="rules" ref="secondFrom" label-width="100px">
            <el-form-item prop="name" label="用户名">
                <el-input placeholder="用户名" :readonly="true" v-model="secondFrom.name"></el-input>
            </el-form-item>
            <el-form-item prop="phone" label="手机名">
                <el-input placeholder="手机号" :readonly="true" :maxlength="11" v-model="secondFrom.phone"></el-input>
            </el-form-item>
            <el-form-item prop="verifyCode" label="手机验证码" class="verify_code">
                <el-input placeholder="手机验证码" :maxlength="6" v-model="secondFrom.verifyCode"></el-input>
                <el-button type="primary" class="verify_code_btn">获取短信验证码</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="submit_btn">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                secondFrom: {
                    verifyCode: ''
                },
                rules: {
                    verifyCode: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ]
                }
            }
        },

        methods: {

        }
    }
</script>
<style lang="less">
    .second_step_container {
        padding: 0 20px;

        .el-form-item__content {
            position: relative;
            .el-button {
                position: absolute;
                left: 0;
            }
        }

        .verify_code {
            .el-form-item__content {
                position: relative;

                .el-input {
                    width: 75%;
                    position: absolute;
                    left: 0;
                }

                .verify_code_btn {
                    position: absolute;
                    left: initial;
                    right: 0;
                }
            }
        }
    }
</style>