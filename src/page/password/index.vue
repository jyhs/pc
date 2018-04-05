<template>
    <div class="forget-pass-page">
        <section class="form-container">
            <el-steps :active="active" finish-status="success">
                <el-step title="身份验证"></el-step>
                <el-step title="设置新密码"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <div style="margin-top: 20px">
                <first-step v-show="active===0" @nextStep="toNextStep"></first-step>
                <third-step v-show="active===1" @nextStep="toNextStep" :userId="userId" :phone="phone"></third-step>
                <fourth-step v-show="active===3"></fourth-step>
            </div>
        </section>
    </div>
</template>
<script>
    import firstStep from './firstStep';
    import secondStep from './secondStep';
    import thirdStep from './thirdStep';
    import fourthStep from './fourthStep';

    export default {
        data() {
            return {
                active: 0,
                userId: '',
                phone: ''
            }
        },

        components: {
            firstStep,
            secondStep,
            thirdStep,
            fourthStep
        },

        methods: {
            toNextStep(activeStep, userId, phone) {
                this.active = activeStep;
                if (userId) {
                    this.userId = userId;
                }
                if (phone) {
                    this.phone = phone;
                }
            }
        }
    }
</script>
<style lang="less">
    @import '../../style/mixin';

    .forget-pass-page {
        background-color: #324057;
        height: 100%;
        .form-container {
            width: 60%;
            padding-top: 20px;
            padding-bottom: 30px;
            margin-left: 20%;
            border-radius: 5px;
            text-align: center;
            background-color: #fff;
            position: relative;
            top: 100px;
        }
        .el-steps {
            .el-step {
                transform: translateX(50%);
            }
        }
    }
</style>
