<template>
    <div class="finish-container">
        <i class="el-icon-circle-check"></i>
        <p class="text">添加完成</p>
        <el-button type="primary" @click="handleEncyAdd">继续添加</el-button>
    </div>
</template>
<script>
    export default {
        methods: {
            handleEncyAdd() {
                this.$emit('on-success', 0);
            }
        }
    }
</script>
<style lang="less">
    .finish-container {
        text-align: center;
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