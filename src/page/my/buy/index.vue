<template>
    <div class="normal-user-buy-container">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="19">
                <div style="padding: 10px;">
                    <el-card class="card-container">
                        <div slot="header" class="card-header">
                            <el-row style="width: 100%">
                                <el-col :xs="24" :sm="24" :md="6" :lg="6">
                                    <div style="line-height: 36px;">
                                        <el-icon class="el-icon-coral-edit"></el-icon>
                                        <span class="group-name">{{group.name}}</span>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="18" :lg="18">
                                    <div class="header-info">
                                        <el-row style="width: 100%">
                                            <el-col :xs="24" :sm="24" :md="6" :lg="6">
                                                <div style="line-height: 36px; margin-right: 10px">
                                                    <el-icon class="el-icon-coral-moneybag" style="color: #d0021b"></el-icon>
                                                    <span style="color: #d0021b">{{`￥${(groupCount || 0).toFixed(2)}`}}</span>
                                                </div>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="6" :lg="6">
                                                <div style="line-height: 36px; margin-right: 10px">
                                                    <el-icon class="el-icon-coral-people"></el-icon>
                                                    <span>{{group.contacts}}</span>
                                                </div>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="6" :lg="6">
                                                <div style="line-height: 36px; margin-right: 10px">
                                                    <el-icon class="el-icon-coral-phone"></el-icon>
                                                    <span>{{group.phone}}</span>
                                                </div>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="6" :lg="6">
                                                <div style="line-height: 36px">
                                                    <el-icon class="el-icon-coral-time"></el-icon>
                                                    <span>{{group.end_date}}</span>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div style="margin-bottom: 10px">
                            <el-row>
                                <el-col :xs="24" :sm="24" :md="18" :lg="18" style="margin-bottom: 10px">
                                    <div v-html="group.description"></div>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="6" :lg="6" class="content-center">
                                    <div>
                                        <img v-if="payQrCodePath" :src="payQrCodePath">
                                        <img v-else :src="require('../../../assets/svg/default_qr_code.svg')">
                                        <p v-if="payType">
                                            {{payType==='zfb'?'支付宝':'微信' + '扫我支付'}}
                                        </p>
                                        <p v-else>
                                            请联系组织者支付
                                        </p>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="ency-table-container clearfix">
                            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="clearfix">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th class="name-field">名称</th>
                                            <th>尺寸</th>
                                            <th>价格</th>
                                            <th>剩余数量</th>
                                            <th>购买限额</th>
                                            <th class="action-field">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="detail in detailList" :key="detail.id"
                                            :class="{'already-in-cart': cartDetailIds.includes(detail.id)}">
                                            <td width="100px">
                                                <el-popover
                                                        placement="right-start" width="150" trigger="hover"
                                                        @show="handleDetailImageShow(detail)">
                                                    <el-button
                                                            slot="reference" class="detail-name-button"
                                                            @click="handleActions(detail, 'encyDetail')">
                                                        {{detail.name}}
                                                    </el-button>
                                                    <img style="width: 128px; cursor: pointer" :src="imagePath" v-if="imagePath"/>
                                                    <div style="text-align: center" v-else>
                                                        <span>正在加载中...</span>
                                                    </div>
                                                </el-popover>
                                            </td>
                                            <td>{{detail.size}}</td>
                                            <td>{{detail.price}}</td>
                                            <td>{{detail.left_numbers}}</td>
                                            <td>{{Number(detail.limits) === 99 ? '不限' : detail.limits}}</td>
                                            <td align="center" v-if="cartDetailIds.includes(detail.id)">
                                                <el-button
                                                        class="move-cart-button"
                                                        :class="{'cart-button-disabled': group.status===0}"
                                                        icon="coral-move"
                                                        :disabled="group.status===0"
                                                        @click="handleMoveFromCart(detail)"
                                                >
                                                </el-button>
                                            </td>
                                            <td align="center" v-else>
                                                <el-button
                                                        class="add-cart-button"
                                                        :class="{'cart-button-disabled': group.status===0||detail.left_numbers<=0}"
                                                        icon="plus"
                                                        :disabled="group.status===0"
                                                        @click="handleAddToCart(detail)"
                                                >
                                                </el-button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </el-col>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="5" style="/*position: fixed; top: 60px; right: 0;*/">
                <div style="padding: 10px;">
                    <el-card class="card-container">
                        <div slot="header" class="clear-fix card-header">
                            <div style="line-height: 36px;">
                                <el-icon class="el-icon-coral-cart"></el-icon>
                                <span class="group-name">我的购物车</span>
                            </div>
                        </div>
                        <div class="one-cart-ency" v-for="detail in detailsInCart"
                             :key="detail.id">
                            <div class="one-cart-info">
                                <img :src="detail.imgPath">
                                <div class="one-cart-detail">
                                    <p class="ont-cart-items">
                                        <span>{{detail.name}}</span>
                                        <span @click="handleMoveFromCart(detail)">
                                            <el-icon class="el-icon-coral-delete" v-if="group.status===1"></el-icon>
                                        </span>
                                    </p>
                                    <p class="ont-cart-items">
                                        <span style="color: #d0021b">￥{{detail.price}}</span>
                                        <el-input-number
                                                v-model="detail.count"
                                                :min="1"
                                                :max="detail.limits"
                                                size="small"
                                                :disabled="group.status===0"
                                                @change="calculateCartCount(detail)">
                                        </el-input-number>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-if="detailsInCart.length===0&&group.status===1" style="text-align: center">
                            <p>购物车是空的哟，选择宝贝先~~~</p>
                        </div>
                        <div class="fee-info">
                            <h3>总价：<span>￥{{cartCount}}</span></h3>
                        </div>
                        <el-form
                                class="submit-form" v-if="group.status===1" :model="cartForm"
                                ref="cartForm" :rules="rules" label-width="80px">
                            <el-form-item prop="telephone" label="联系电话">
                                <el-input v-model="cartForm.telephone" :maxlength="11"></el-input>
                            </el-form-item>
                            <el-form-item prop="remark" label="再说点啥?">
                                <el-input v-model="cartForm.remark" type="textarea" :rows="3"></el-input>
                            </el-form-item>
                            <el-form-item class="submit-button">
                                <el-button type="warning" icon="coral-cart" @click="submit">提交</el-button>
                            </el-form-item>
                            <el-form-item class="warning-text">
                                <span style="color: #ee735c">*本站提供的图片仅供参考，所购生物请以实物为准</span>
                            </el-form-item>
                        </el-form>
                        <div v-if="group.status===0">
                            <p>团购已结束</p>
                            <p>
                                <a href="/" style="text-decoration: none; cursor: pointer;">
                                    戳这里查看更多团购
                                </a>
                            </p>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
            <span>您确定从购物车中删除{{currentRow.name}}？</span>
            <span slot="footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="handleConfirmDelete">确定</el-button>
            </span>
        </el-dialog>
        <!--
        <a href="#myCart" class="cart-icon-container">
            <div class="cart-icon">
                <el-icon class="el-icon-coral-cart"></el-icon>
                <div class="details-in-cart-count">{{detailsInCart.length}}</div>
            </div>
        </a>
        -->
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .normal-user-buy-container {
        .card-container {
            img {
                cursor: pointer;
            }
            .content-center {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                img {
                    width: 120px;
                    height: 120px;
                }
            }
            .el-card__header {
                padding: 10px 20px;
            }
            .el-card__body {
                padding: 10px;
            }
            .add-cart-button {
                border: none;
                color: #fff;
                background: #7ed321;
                font-size: 10px;
                padding: 3px;
                border-radius: 50%;
            }
            .move-cart-button {
                border: none;
                color: #fff;
                font-size: 10px;
                padding: 3px;
                border-radius: 50%;
                background: #d0021b;
            }
            .cart-button-disabled {
                background: #d1dbe5 !important;
            }
            .ency-table-container {
                padding-bottom: 10px;
                th, td, tr {
                    padding: 0;
                    vertical-align: middle;
                }
                .name-field {
                    padding-left: 10px;
                }
                .action-field {
                    text-align: center;
                }
                .table {
                    margin: 0 5px;
                    table-layout: fixed;
                    .detail-name-button {
                        border: none;
                        background: transparent;
                        padding-left: 0;
                        padding-right: 0;
                        white-space: normal;
                        text-align: left;
                        span {
                            color: #1d90e6;
                            user-select: text;
                        }
                    }
                }
            }
            .card-header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .el-icon-coral-edit, .el-icon-coral-cart {
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
            .card-item {
                padding: 10px 0;
                font-size: 14px;
            }
            .group-name {
                font-size: 16px;
                font-weight: bold;
            }
            .already-in-cart {
                background: #dfffbd;
            }
            .fee-info {
                padding: 15px 15px 15px 0;
                text-align: right;
                h3 {
                    font-size: 18px;
                    span {
                        font-size: 22px;
                        color: #d0021b;
                    }
                }
            }
            .one-cart-ency {
                padding: 5px 0;
                display: flex;
                flex-direction: row;
                align-items: center;
                border-bottom: 1px solid #d1dbe5;
                img {
                    width: 64px;
                    height: 64px;
                    margin-right: 5px;
                    border-radius: 50%;
                }
                .one-cart-info {
                    margin-left: 5px;
                    display: flex;
                    flex: 1;
                    .one-cart-detail {
                        padding: 5px;
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        .ont-cart-items {
                            width: 100%;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            align-items: center;
                            .el-icon-coral-delete {
                                cursor: pointer;
                            }
                        }
                    }
                }
                .el-input-number--small {
                    width: 100px;
                }
            }
            .submit-form {
                .submit-button, .warning-text {
                    .el-form-item__content {
                        margin-left: 0 !important;
                    }
                    .el-button {
                        width: 100%;
                    }
                }
            }
        }
        .cart-icon-container {
            width: 60px;
            height: 60px;
            background: #d0021b;
            border-radius: 50%;
            position: fixed;
            right: 10px;
            bottom: 10px;
            z-index: 100;
            cursor: pointer;
            &:hover {
                cursor: pointer;
            }
            .cart-icon {
                position: absolute;
                left: 15px;
                top: 15px;
                .el-icon-coral-cart {
                    font-size: 30px;
                    color: #fff;
                }
                .details-in-cart-count {
                    padding: 0 5px;
                    height: 18px;
                    line-height: 18px;
                    text-align: center;
                    background: gray;
                    border-radius: 4px;
                    position: absolute;
                    left: 15px;
                    top: 0;
                }
            }
        }
        @media screen and (max-width: 768px) {
            .el-dialog--tiny {
                width: 80%;
            }
        }
    }
</style>