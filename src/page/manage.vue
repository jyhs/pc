<template>
    <div class="manage-page fill-container" v-loading="loading" element-loading-text="拼命加载中">
        <div class="avatar-container fill-container" v-if="imageInfo.show">
            <i class="el-icon-coral-close" @click="handleClose"></i>
            <img :src="imageInfo.path">
        </div>
        <el-row class="content-container">
            <el-col :md="24" :lg="24" class="nav">
                <el-col :xs="0" :sm="0" :md="3" :lg="3" class="coral-logo">
                    <img :src="require('../assets/img/coral-logo.png')" style="cursor: pointer" @click="handleGoToMainPage">
                </el-col>
                <el-col :xs=0 :sm="0" :md="16" :lg="16">
                    <el-menu :default-active="defaultActive" mode="horizontal" router>
                        <el-menu-item index="/">团购</el-menu-item>
                        <el-menu-item index="/ency/list">百科</el-menu-item>
                        <el-menu-item index="/bill/add" v-if="currentUser.type==='tggly'||currentUser.type==='cjyy'||currentUser.type==='pfs'||currentUser.type==='lss'">传单</el-menu-item>

                        <!--
                        <el-menu-item index="/main/page">主页</el-menu-item>
                        -->
                        <el-submenu index="2" v-if="currentUser.type==='yhgly'">
                            <template slot="title">用户管理</template>
                            <el-menu-item index="/user/list">列表</el-menu-item>
                            <el-menu-item index="/user/distribute">分布</el-menu-item>
                        </el-submenu>
                        <el-submenu index="3" v-if="currentUser.type==='tggly'">
                            <template slot="title">团购管理</template>
                            <el-menu-item index="/bill/list">传单列表</el-menu-item>
                            <el-menu-item index="/group/list">团购列表</el-menu-item>
                        </el-submenu>
                        <!--
                        <el-menu-item index="/ency/add" v-if="currentUser.type==='bkgly'">添加生物</el-menu-item>
                        -->
                        <el-menu-item index="/about">关于本站</el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :xs="0" :sm="0" :md="5" :lg="5" class="mine-more">
                    <el-select
                            class="select-city" v-model="userProvince" placeholder="请选择"
                            filterable @change="handleNowProvinceChange">
                        <el-option
                                v-for="item in provinces" :key="item.key" :label="item.value"
                                :value="item.key">
                        </el-option>
                    </el-select>
                    <el-dropdown @command="handleCommandChange" menu-align='start'>
                        <img v-if="avatarImgPath" :src="avatarImgPath" class="avatar">
                        <img v-else :src="require('../assets/svg/default_avatar.svg')" class="avatar">
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="mine" v-if="currentUser.name">{{currentUser.name}}</el-dropdown-item>
                            <el-dropdown-item command="logout" v-else>去登录</el-dropdown-item>
                            <!--
                            <el-dropdown-item command="point">积分:{{currentUser.point}}</el-dropdown-item>
                            -->
                            <el-dropdown-item command="setting" divided>个人设置</el-dropdown-item>
                            <el-dropdown-item command="cart">我的购物车</el-dropdown-item>
                            <el-dropdown-item
                                    command="bill"
                                    v-if="currentUser.type==='tggly'||currentUser.type==='cjyy'||currentUser.type==='lss'||currentUser.type==='pfs'">
                                我传的出单
                            </el-dropdown-item>
                            <el-dropdown-item command="group">我开的团单</el-dropdown-item>
                            <el-dropdown-item command="logout" v-if="currentUser.name">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-col>
            <el-col class="nav-mobile">
                <div class="nav-mobile-container">
                    <el-col :span="6">
                        <el-dropdown @command="handleMobileCommandChange" trigger="click" menu-align='start'>
                            <el-button type="primary">
                                <i class="el-icon-coral-sort" style="font-size: 34px"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="mainPage">团购</el-dropdown-item>
                                <el-dropdown-item command="encyList">百科</el-dropdown-item>
                                <el-dropdown-item
                                        command="billAdd"
                                        v-if="currentUser.type==='tggly'||currentUser.type==='cjyy'||currentUser.type==='lss'||currentUser.type==='pfs'">
                                    出单上传
                                </el-dropdown-item>
                                <el-dropdown-item command="about">关于本站</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                    <el-col :span="12" class="mobile-select-city-container">
                        <el-select v-model="userProvince" placeholder="请选择" filterable @change="handleNowProvinceChange">
                            <el-option
                                    v-for="item in provinces" :key="item.key" :label="item.value"
                                    :value="item.key">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" class="mine-mobile-more">
                        <el-dropdown @command="handleCommandChange" trigger="click" menu-align='start'>
                            <img v-if="avatarImgPath" :src="avatarImgPath" class="mobile-avatar">
                            <img v-else :src="require('../assets/svg/default_avatar.svg')" class="mobile-avatar">
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="mine" v-if="currentUser.name">{{currentUser.name}}</el-dropdown-item>
                                <el-dropdown-item command="logout" v-else>去登录</el-dropdown-item>
                                <!--
                                <el-dropdown-item command="point">积分:{{currentUser.point}}</el-dropdown-item>
                                -->
                                <el-dropdown-item command="setting" divided>个人设置</el-dropdown-item>
                                <el-dropdown-item command="cart">我的购物车</el-dropdown-item>
                                <el-dropdown-item command="bill">我传的出单</el-dropdown-item>
                                <el-dropdown-item command="group">我开的团单</el-dropdown-item>
                                <el-dropdown-item command="logout" v-if="currentUser.name">退出登录</el-dropdown-item>
                                <el-dropdown-item command="about" divided>关于本站</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </div>
            </el-col>
            <el-col :span="24" class="main-content">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
                <el-col :span="24" style="text-align: center; margin-bottom: 10px">
                    <span style="font-size: 16px">©</span>{{new Date().getFullYear()}} 礁岩海水(Coral123) 沪ICP备14045940号
                    <el-tooltip class="item" effect="dark" content="QQ号：45895" placement="top">
                        <el-button class="contact-button">联系我们</el-button>
                    </el-tooltip>
                </el-col>
            </el-col>
            <el-dialog title="鱼友你好！" :visible.sync="firstDialogVisible" :show-close="false">
                <p>Nice to meet u！New coral123.com !</p>
                <p>欢迎大家来到礁岩海水2.0。</p>
                <br>
                <p>希望你能喜欢全新改版的礁岩海水为你带来的：</p>
                <ul>
                    <li style="text-indent: 2em">1、“可视化”团购体验，自动匹配团单生物到我们的“生物百科”去看看团购单里的生物你认识多少？</li>
                    <li style="text-indent: 2em">2、最接地气的“生物百科”，由Frank老师亲自编写。</li>
                    <li style="text-indent: 2em">3、更方便的团购控制，结束单re-open，参团人员编辑，全由团长自由操作。</li>
                    <li style="text-indent: 2em">4、最快速的传单、开单设定，自动识别商家联系信息，自动上传团长收款二维码。</li>
                    <li style="text-indent: 2em">5、当然，还有更安全的网站信息，更快速的运行速度，这都是我们的基本要求。</li>
                </ul>
                <br>
                <p>还有更多功能，未来会随着app逐步上线，我们和你一起期待。</p>
                <p>联系我们：45895。</p>
                <p>祝你在礁岩海水玩的愉快。</p>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleFirstDialog">确 定</el-button>
                </div>
            </el-dialog>

        </el-row>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import {Seawater_Provinces, Seawater_Now_Province, Seawater_Seller_Types, AVATAR_BASE_PATH} from '@/constants/index';
    import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage} from '@/utils/common';

    export default {
        data () {
            return {
                provinces: [],
                userProvince: '',
                currentUserId: window.parseInt(localStorage.getItem('SEAWATER_USER_ID')),
                currentUser: {},
                avatarImgPath: '',
                //firstDialogVisible: !localStorage.getItem('SEAWATER_FIRST_LOGIN')
                firstDialogVisible: false
            }
        },

        computed: {
            ...mapGetters(['loading', 'imageInfo']),

            defaultActive: function () {
                return this.$route.path;
            }
        },

        async created () {
            try {
                if (this.currentUserId) {
                    this.currentUser = (await this.getUserById({id: this.currentUserId}))[0];
                    const avatarImgPath = (await this.getUserAvatar({id: this.currentUserId})).imgPath;
                    avatarImgPath && (this.avatarImgPath = `${AVATAR_BASE_PATH}${avatarImgPath}?${Math.random()}`);
                    avatarImgPath && this.$set(this.currentUser, 'avatarImgPath', `${avatarImgPath}?${Math.random()}`);
                } else {
                    this.currentUser = {
                        province: 'sh'
                    };
                }
                this.$set(this.currentUser, 'nowProvince', this.currentUser.province);
                this.updateCurrentUser(this.currentUser);
                this.updateNowProvince();
                //remove Seawater_Provinces start
                window.localStorage.removeItem(Seawater_Provinces);
                //remove end
                if (localStorageHasKey(Seawater_Provinces)) {
                    this.provinces = getFromLocalStorage(Seawater_Provinces);
                } else {
                    this.provinces = await this.getProvinces();
                    saveToLocalStorage(Seawater_Provinces, this.provinces);
                }
            } catch (error) {
                console.error(error);
            }
        },

        methods: {
            ...mapActions([
                'getUserAvatar',
                'updateCurrentUser',
                'imageIsShowing',
                'getUserById',
                'getProvinces',
                'logout'
            ]),

            handleClose () {
                this.imageIsShowing({
                    show: false,
                    path: ''
                });
            },

            updateNowProvince() {
                const nowProvince = window.localStorage.getItem(Seawater_Now_Province);
                if (nowProvince) {
                    this.userProvince = nowProvince;
                } else if (this.currentUser.province) {
                    this.userProvince = this.currentUser.province;
                } else {
                    this.userProvince = 'sh';
                }
            },

            handleNowProvinceChange(nowProvince) {
                this.$set(this.currentUser, 'nowProvince', nowProvince);
                this.$set(this.currentUser, 'provinceFirstChange', false);
                window.localStorage.setItem(Seawater_Now_Province, nowProvince);
                this.updateCurrentUser(this.currentUser);
            },

            async handleCommandChange(command) {
                switch (command) {
                    case 'mine':
                    case 'setting':
                        this.$router.push({name: 'mySetting'});
                        break;
                    case 'point':
                        break;
                    case 'cart':
                        this.$router.push({name: 'myCarts'});
                        break;
                    case 'billAdd':
                        this.$router.push({name: 'billAdd'});
                        break;
                    case 'bill' :
                        this.$router.push({name: 'myBills'});
                        break;
                    case 'group':
                        this.$router.push({name: 'myGroups'});
                        break;
                    case 'logout':
                        if (this.currentUserId) {
                            try {
                                const result = await this.logout({
                                    id: this.currentUserId
                                });
                                if (result.status === 'ok') {
                                    this.$message({
                                        type: 'success',
                                        message: '退出成功'
                                    });
                                }
                            } catch (error) {
                                console.error(error);
                            }
                        }
                        window.localStorage.removeItem('Authorization');
                        window.localStorage.removeItem('SEAWATER_USER_ID');
                        window.sessionStorage.clear();
                        this.$router.push({name: 'login'});
                        break;
                    case 'about':
                        this.$router.push({name: 'about'});
                        break;
                    default:
                        break;
                }
            },

            handleMobileCommandChange(command) {
                this.$router.push({name: command});
            },

            handleGoToMainPage() {
                this.$router.push({name: 'mainPage'});
            },

            handleFirstDialog() {
                this.firstDialogVisible = false;
                //localStorage.setItem('SEAWATER_FIRST_LOGIN', false);
            }
        },

        watch: {
            'currentUser.avatarImgPath'(curVal) {
                this.avatarImgPath = `${AVATAR_BASE_PATH}${curVal}`;
            }
        }
    }
</script>
<style lang="less">
    @import '../style/mixin';
    .manage-page {
        position: relative;
        .el-loading-mask {
            background-color: rgba(0, 0, 0, 0.5);
        }
        .content-container {
            height: 100%;
            .el-menu {
                background-color: transparent;
                border-radius: 0;
            }
            .nav {
                background-color: #324157;
                position: fixed;
                left: 0;
                top: 0;
                z-index: 50;
                .coral-logo {
                    height: 60px;
                    line-height: 60px;
                    text-indent: 20px;
                    img {
                        display: inline-block;
                        vertical-align: middle;
                        width: 80%;
                    }
                }
                .select-city {
                    height: 60px;
                    line-height: 60px;
                }
                .el-menu-item, .el-submenu__title {
                    color: #fff;
                    font-size: 16px;
                }
                .el-menu-item.is-active {
                    font-weight: bold;
                }
                .el-menu-item:hover {
                    background: #4377bb;
                }
                .el-submenu__title:hover {
                    background: #4377bb;
                }
                .el-submenu.is-opened {
                    .el-menu {
                        .el-menu-item {
                            background: #193441;
                        }
                    }
                }
                .el-menu--horizontal {
                    .is-active {
                        background: #063e59;
                    }
                }
                .el-submenu {
                    .el-menu {
                        padding: 0;
                    }
                }
                .mine-more {
                    height: 60px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-left: 20px;
                    .avatar {
                        .wh(36px, 36px);
                        border-radius: 50%;
                        margin: 0 15px;
                        cursor: pointer;
                    }
                    .el-dropdown-menu__item {
                        text-align: center;
                    }
                }
            }
            .nav-mobile {
                .nav-mobile-container {
                    height: 56px;
                    width: 100%;
                    background-color: #48576a;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 100;
                }
                .el-button {
                    background-color: transparent;
                    border-color: transparent;
                }
                .mobile-select-city-container {
                    height: 56px;
                    display: flex;
                    align-items: center;
                }
                .mine-mobile-more {
                    height: 56px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    padding-right: 15px;
                    .mobile-avatar {
                        .wh(36px, 36px);
                        border-radius: 50%;
                    }
                }
            }
            .main-content {
                height: 100%;
                overflow: auto;
                padding-top: 60px;
                margin-bottom: 10px;
            }
            .contact-button {
                border: none;
                padding: 0;
                color: #1d90e6;
            }
        }
        .avatar-container {
            position: absolute;
            left: 0;
            top: 0;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 999;
            overflow-y: auto;
            .el-icon-coral-close {
                font-size: 28px;
                color: #fff;
                position: fixed;
                top: 10px;
                right: 10px;
            }
            img {
                width: 30%;
                position: absolute;
                left: 50%;
                transform: translate(-50%, 20%);
            }
        }
        @media screen and (max-width: 992px) {
            .nav {
                display: none;
            }
        }
        @media screen and (min-width: 992px) {
            .nav-mobile {
                display: none;
            }
        }
        @media screen and (max-width: 768px) {
            .el-dialog--small {
                width: 90%;
            }
        }
    }
</style>
