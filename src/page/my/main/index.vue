<template>
    <el-col :span="24" class="normal-user-main-container">
        <el-row>
            <el-col :xs="24" :sm="24" :md="accept==='www'?18:24" :lg="accept==='www'?18:24">
                <div style="padding: 10px">
                    <el-card class="card-height-430 card-flex" style="position: relative">
                        <a href="javascript: void (0);" class="tab-more-button"  @click="handleTabMore">
                            更多
                        </a>
                        <el-tabs v-model="activeName">
                            <el-tab-pane :label="accept==='www'?'同省热团':'我的订单'" name="group">
                                <table class="table table-striped action-table">
                                    <thead>
                                        <tr>
                                            <th v-if="accept==='www'">团单名</th>
                                            <th v-else>订单名</th>
                                            <th class="mobile-no-see">组织者</th>
                                            <th>开团城市</th>
                                            <th class="mobile-no-see">供货商</th>
                                            <th>已团金额</th>
                                            <th>当前状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="group in groupList" :key="group.id">
                                            <td class="group-name-td">
                                                <a href="javascript: void (0);" @click="handleActions(group, 'buyPage')">
                                                    {{group.name}}
                                                </a>
                                            </td>
                                            <td class="mobile-no-see">{{group.contacts}}</td>
                                            <td>{{group.city}}</td>
                                            <td class="mobile-no-see">{{group.supplierName}}</td>
                                            <td>
                                                <span style="color: #d0021b">
                                                    {{`￥${group.sum.toFixed(2)}`}}
                                                </span>
                                            </td>
                                            <td>
                                                <span v-if="group.status===1" class="status-td">热团中</span>
                                                <span v-else style="color: #333">已结束</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </el-tab-pane>
                            <el-tab-pane label="最新出单" name="bill" v-if="accept==='www'">
                                <table class="table table-striped action-table">
                                    <thead>
                                        <tr>
                                            <th>出单名</th>
                                            <th class="mobile-no-see">上传人</th>
                                            <th>供货商</th>
                                            <th class="mobile-no-see">供货商手机</th>
                                            <th>当前状态</th>
                                            <th class="mobile-no-see">截止日期</th>
                                            <th class="action-th">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in billList" :key="item.id">
                                            <td class="bill-name-td">
                                                <a href="javascript: void (0)" @click="handleActions(item, 'billDetail')">
                                                    {{item.name}}
                                                </a>
                                            </td>
                                            <td class="mobile-no-see">{{item.contacts}}</td>
                                            <td>{{item.supplier_name}}</td>
                                            <td class="mobile-no-see">{{item.phone}}</td>
                                            <td>
                                                <span v-if="item.status==1" class="status-td">可开团</span>
                                                <span v-else style="color: #333">已结束</span>
                                            </td>
                                            <td class="mobile-no-see">{{item.effort_date}}</td>
                                            <td class="action-td">
                                                <el-button
                                                        type="primary" v-if="item.status===1"
                                                        @click="handleActions(item, 'groupAdd')">
                                                    我要开团
                                                </el-button>
                                                <el-button type="primary" v-if="item.status===0" :disabled="true">
                                                    已经结束
                                                </el-button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="6" :lg="6" v-if="accept==='www'">
                <div style="padding: 10px;">
                    <el-card class="card-container card-height-430 card-flex">
                        <div slot="header" class="clear-fix">
                            <span class="card-title">同省商家</span>
                            <el-button class="more-button" @click="handleMore('provinceSellerList', {type1: 'pfs', type2: 'lss', city: currentUser.city})">
                                更多
                            </el-button>
                        </div>
                        <div class="card-item" style="border-bottom: none">
                            <div class="item-container" v-for="user in usersLssAndPfsInCity" :key="user.id">
                                <div class="item-image">
                                    <img v-if="user.avatarImgPath" :src="user.avatarImgPath">
                                    <img v-else :src="require('../../../assets/svg/default_avatar.svg')">
                                </div>
                                <div class="item-text">
                                    <div>
                                        <strong>{{user.name}}</strong>
                                    </div>
                                    <div>{{user.contacts.trim() || '暂时还没添加联系人'}}</div>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        <el-row v-if="accept==='www'">
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
                <div style="padding: 10px;">
                    <el-card class="card-container">
                        <div slot="header" class="clear-fix">
                            <span class="card-title">生物百科</span>
                            <el-button class="more-button" @click="handleMore('encyList')">
                                更多
                            </el-button>
                        </div>
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="5" :lg="5" style="margin-top: 8px">
                                <el-col :xs="6" :sm="6" :md="24" :lg="24" v-for="image in imageList" :key="image.id" class="img-wrap">
                                    <el-card :body-style="{padding: '0px'}">
                                        <img :src='image.src' class="image" @click="goToEncyDetail(image.encyId)" style="cursor: pointer">
                                    </el-card>
                                </el-col>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="19" :lg="19">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>生物名</th>
                                            <th>参考价格</th>
                                            <th style="text-align: center">饲养难度</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in encyList" :key="item.id">
                                            <td>
                                                <a href="javascript: void (0);" @click="goToEncyDetail(item.id)">
                                                    {{item.name}}
                                                </a>
                                            </td>
                                            <td><span style="color: #d0021b">{{`￥${item.price.toFixed(2)}`}}</span></td>
                                            <td style="text-align: center">
                                                <el-rate
                                                    :value="item.level==='ry'?1:(item.level==='yb'?3:5)"
                                                    disabled
                                                >
                                                </el-rate>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </el-col>
                        </el-row>
                    </el-card>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
                <div style="padding: 10px;">
                    <el-card class="card-container">
                        <div slot="header" class="clear-fix">
                            <span class="card-title">最近加入商家</span>
                            <el-button class="more-button" @click="handleMore('recentSellerList', {type1: 'pfs', type2: 'lss'})">
                                更多
                            </el-button>
                        </div>
                        <div class="card-item" style="border-bottom: none">
                            <div class="item-container" v-for="user in usersLssAndPfs" :key="user.id">
                                <div class="item-image">
                                    <img v-if="user.avatarImgPath" :src="user.avatarImgPath"
                                         @click="handleActions(user, 'userDetail')" style="cursor: pointer">
                                    <img v-else :src="require('../../../assets/svg/default_avatar.svg')">
                                </div>
                                <div class="item-text">
                                    <div>
                                        <strong @click="handleActions(user, 'userDetail')" style="cursor: pointer">
                                            {{user.name}}
                                        </strong>
                                    </div>
                                    <div>{{user.description.trim() || '暂时还没添加描述'}}</div>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </el-col>
</template>
<script src="./script.js"></script>
<style lang="less">
    .normal-user-main-container {
        .el-rate__icon {
            font-size: 14px;
        }
        .tab-more-button {
            position: absolute;
            right: 20px;
            top: 20px;
            cursor: pointer;
            text-decoration: none;
            z-index: 5;
        }
        .card-height-430 {
            .el-card__body {
                padding: 10px;
            }
        }
        .card-container {
            .el-card__header {
                padding: 10px 20px;
            }
            .el-card__body {
                padding: 10px;
            }
            .card-title {
                line-height: 36px;
                font-size: 16px;
                font-weight: bold;
            }
            .el-button {
                background: transparent;
                border: none;
                i, span {
                    color: #20a0ff;
                }
                &:focus, &:hover {
                    background: #20a0ff;
                    i, span {
                        color: #fff;
                    }
                }
                &.is-disabled {
                    background: transparent;
                    i, span {
                        color: #bfcbd9;
                    }
                    &:focus, &:hover {
                        background: transparent;
                        i, span {
                            color: #bfcbd9;
                        }
                    }
                }
            }
            .img-wrap {
                padding: 0 5px 5px;
            }
            .card-item {
                padding: 10px 0;
                font-size: 14px;
                border-bottom: 1px solid #d1dbe5;
                .item-container {
                    margin-bottom: 15px;
                    display: flex;
                    flex-direction: row;
                    .item-image {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        img {
                            display: block;
                            width: 50px;
                            height: 50px;
                            margin-right: 15px;
                        }
                    }
                    .item-text {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        line-height: 25px;
                    }
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
            .image {
                width: 100%;
                display: block;
            }
        }
        .card-flex {
            display: flex;
            flex-direction: column;
            .el-card__body {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
        }
        .table {
            td {
                vertical-align: middle;
                padding: 4px;
            }
            th {
                padding-left: 4px;
            }
            .group-name-td {
                a {
                    cursor: pointer;
                    text-decoration: none;
                    color: #126187;
                    &:hover {
                        cursor: pointer;
                        color: #126187;
                    }
                }
            }
            .action-th {
                text-align: center;
            }
            .status-td {
                color: #417505;
                font-weight: bold;
            }
            .action-td {
                text-align: center;
                .el-button {
                    float: none;
                    background: #4cac4c;
                    border: none;
                    padding: 3px 10px;
                    span {
                        font-size: 12px;
                    }
                    &.is-disabled {
                        background: #999;
                        span {
                            color: #ccc;
                        }
                    }
                }
            }
        }
        .el-col {
            border-radius: 4px;
        }
        .el-tabs__item {
            font-size: 16px;
        }
        .more-button {
            float: right;
            border: none;
        }
        .clear-fix:before, .clear-fix:after {
            display: table;
            content: "";
        }
        .clear-fix:after {
            clear: both
        }
        @media screen and (min-width: 992px) {
            .card-height-430 {
                height: 430px;
            }
            .card-height-380 {
                height: 410px;
            }
        }
        @media screen and (max-width: 992px) {
            .table td {
                padding: 0;
            }
            .table th {
                padding: 0;
            }
            .bill-name-td {
                width: 75px;
                padding-right: 5px;
            }
            .group-name-td {
                width: 75px;
                padding-right: 5px;
            }
            .mobile-no-see {
                display: none;
            }
            .action-td {
                padding: 4px 0 !important;
            }
        }
    }
</style>
