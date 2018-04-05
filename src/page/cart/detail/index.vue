<template>
    <div class="cart-detail-container">
        <el-card class="card-container">
            <div slot="header" class="card-header">
                <div style="line-height: 36px;">
                    <el-icon class="el-icon-coral-edit"></el-icon>
                    <span class="card-title">购物车详情</span>
                </div>
            </div>
            <div>
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="详细信息" name="info">
                        <div class="details">
                            <div>
                                <span>{{ownerName}}</span>
                            </div>
                            <div>
                                <span>手机号：{{cart.phone}}</span>
                            </div>
                            <div>
                                <span>总价：{{cart.sum}}</span>
                            </div>
                            <div v-html="cart.description"></div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="团单信息" name="groupInfo">
                        <div class="">
                            <div>
                                <span>{{group.name}}</span>
                            </div>
                            <div>
                                <span>{{group.contacts}}</span>
                            </div>
                            <div>
                                <span>{{group.phone}}</span>
                            </div>
                            <div>
                                <span>{{group.end_date}}</span>
                            </div>
                            <div>
                                <span>{{group.city}}</span>
                            </div>
                            <div>
                                <span>{{group.freight}}</span>
                            </div>
                            <div>
                                <span>{{group.pickup_address}}</span>
                            </div>
                            <div>
                                <span>{{group.pickup_date}}</span>
                            </div>
                            <div>
                                <div v-html="cart.description"></div>
                            </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="明细详情" name="cartDetails">
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="24" :lg="12">
                                <div class="table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th class="name-field">名称</th>
                                                <th>尺寸</th>
                                                <th>价格</th>
                                                <th>数量</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="detail in detailsInCart.slice(0, Math.ceil(detailsInCart.length / 2))"
                                                :key="detail.id">
                                                <td>
                                                    <!--
                                                    <el-popover
                                                            placement="right-start" width="150" trigger="hover"
                                                            @show="handleDetailImageShow(detail)">
                                                        <el-button slot="reference" class="cart-name-button">
                                                            {{detail.name}}
                                                        </el-button>
                                                        <img class="popup-img" :src="imagePath" v-if="imagePath"/>
                                                        <div style="text-align: center" v-else>
                                                            <span>正在加载中...</span>
                                                        </div>
                                                    </el-popover>
                                                    -->
                                                    <el-button slot="reference" class="cart-name-button">
                                                        {{detail.name}}
                                                    </el-button>
                                                </td>
                                                <td>{{detail.size}}</td>
                                                <td>{{detail.price}}</td>
                                                <td>{{detail.count}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="24" :lg="12">
                                <div class="table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th class="name-field">名称</th>
                                                <th>尺寸</th>
                                                <th>价格</th>
                                                <th>数量</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="detail in detailsInCart.slice(Math.ceil(detailsInCart.length / 2), detailsInCart.length)"
                                                :key="detail.id">
                                                <td>
                                                    <!--
                                                    <el-popover
                                                            placement="right-start" width="150" trigger="hover"
                                                            @show="handleDetailImageShow(detail)">
                                                        <el-button slot="reference" class="cart-name-button">
                                                            {{detail.name}}
                                                        </el-button>
                                                        <img class="popup-img" :src="imagePath" v-if="imagePath"/>
                                                        <div style="text-align: center" v-else>
                                                            <span>正在加载中...</span>
                                                        </div>
                                                    </el-popover>
                                                    -->
                                                    <el-button slot="reference" class="cart-name-button">
                                                        {{detail.name}}
                                                    </el-button>
                                                </td>
                                                <td>{{detail.size}}</td>
                                                <td>{{detail.price}}</td>
                                                <td>{{detail.count}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-card>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .cart-detail-container {
        padding: 10px;
        .card-container {
            a {
                text-decoration: none;
                cursor: pointer;
                &:hover {
                    cursor: pointer;
                }
            }
            .el-card__header {
                padding: 10px 20px;
            }
            .el-card__body {
                padding: 10px;
            }
            .el-icon-coral-text {
                font-size: 16px;
            }
            .el-carousel__item {
                text-align: center;
            }
            .el-card__body {
                padding: 0;
            }
            .el-collapse {
                border: none;
            }
            .card-header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .card-title {
                    line-height: 36px;
                    font-size: 16px;
                    font-weight: bold;
                }
                .header-info {
                    display: flex;
                    flex-direction: row;
                    span, i {
                        font-size: 15px;
                    }
                    i {
                        color: #b9b9b9;
                    }
                    .el-icon-coral-phone {
                        font-size: 18px;
                        transform: translateY(2px);
                    }
                }
            }
            .details {
                padding: 10px 20px;
                //display: flex;
                //justify-content: space-between;
                //align-items: center;
                img {
                    width: 120px;
                    height: 120px;
                }
            }
            .table-responsive {
                padding-bottom: 10px;
                th, td, tr {
                    padding: 0;
                    vertical-align: middle;
                }
                .table {
                    margin: 0 5px;
                    .name-field {
                        padding-left: 10px;
                    }
                    .popup-img {
                        width: 128px;
                        cursor: pointer;
                    }
                }
                .cart-name-button {
                    border: none;
                    background: transparent;
                }
            }
        }
    }
</style>
