<template>
    <div class="header_container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $route.meta.breadcrumb" :key="index">{{item}}
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown @command="handleCommand" menu-align='start'>
            <img :src="require('../assets/svg/default_avatar.svg')" class="avatar">
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="home">首页</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import {signout} from '@/api/getData';

    export default {
        methods: {
            ...mapActions(['getAdminData', 'logout']),

            async handleCommand(command) {
                if (command === 'home') {
                    this.$router.push('/home');
                } else if (command === 'logout') {
                    const res = await signout();
                    if (res.status === 1) {
                        this.$message({
                            type: 'success',
                            message: '退出成功'
                        });
                        this.$router.push('/');
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }
            },
        }
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .header_container {
        background-color: #EFF2F7;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;

        .avatar {
            .wh(36px, 36px);
            border-radius: 50%;
            margin-right: 37px;
        }

        .el-dropdown-menu__item {
            text-align: center;
        }
    }
</style>
