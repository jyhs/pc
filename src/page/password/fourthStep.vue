<template>
    <div class="fourth-step-container">
        <i class="el-icon-circle-check"></i>
        <p class="text">修改完成，
            <a href="javascript: void (0);" @click="goToLogin">去登录</a>
        </p>
    </div>
</template>
<script>
    export default {
        methods: {
            goToLogin() {
                this.$router.push({name: 'login'});
            }
        }
    }
</script>
<style lang="less">
    .fourth-step-container {
        a {
            cursor: pointer;
            text-decoration: none;
        }
        .el-icon-circle-check {
            color: #13ce66;
            font-size: 40px;
        }
        .text {
            color: #1d90e6;
            margin-top: 10px;
        }
        .el-button {
            margin-top: 20px;
        }
    }
</style>