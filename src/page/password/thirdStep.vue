<template>
    <div class="third_step_container">
        <el-form :model="thirdForm" :rules="rules" ref="thirdForm" label-width="140px">
            <el-form-item prop="password1" label="请输入新密码">
                <el-input
                        type="password" placeholder="请输入新密码(8-20位字母与数字的组合)"
                        v-model="thirdForm.password1">
                </el-input>
            </el-form-item>
            <el-form-item prop="password2" label="请再次输入新密码">
                <el-input
                        type="password" placeholder="请再次输入新密码"
                        v-model="thirdForm.password2">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="submit_btn" @click="toNextStep">下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';

    export default {
        props: ['userId', 'phone'],

        data() {
            const validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (!/^[a-zA-Z0-9_]{8,20}$/.test(value)) {
                        callback(new Error('8-20位字母、数字的组合'));
                    }
                    if (this.thirdForm.password2 !== '') {
                        this.$refs['thirdForm'].validateField('password2');
                    }
                    callback();
                }
            };

            const validatePassword2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.thirdForm.password1) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                thirdForm: {
                    password1: '',
                    password2: ''
                },
                rules: {
                    password1: [
                        {validator: validatePassword, trigger: 'blur'}
                    ],
                    password2: [
                        {validator: validatePassword2, trigger: 'blur'}
                    ],
                }
            }
        },

        methods: {
            ...mapActions(['changePassword']),

            toNextStep() {
                this.$refs['thirdForm'].validate(async (valid) => {
                    if (valid) {
                        let result = {};
                        try {
                            result = await this.changePassword({
                                id: this.userId,
                                password: this.thirdForm.password1
                            });
                        } catch(error) {
                            console.error(error);
                        }

                        if (result.status === 'ok') {
                            this.$message({
                                type: 'success',
                                message: `修改密码成功，请登录`,
                            });
                            this.$emit('nextStep', 3);
                        } else {
                            this.$message({
                                type: 'success',
                                message: `修改密码失败，请重新输入`,
                            });
                            this.$refs['thirdForm'].resetFields();
                        }
                    }
                });
            }
        }
    }
</script>
<style lang="less">
    .third_step_container {
        padding: 0 20px;

        .el-form-item__content {
            position: relative;
            .el-button {
                position: absolute;
                left: 0;
            }
        }
    }
</style>