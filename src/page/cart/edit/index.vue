<template>
    <div class="cart-edit-container">
        <el-card class="card-container">
            <div slot="header" class="card-header">
                <div style="line-height: 36px;">
                    <el-icon class="el-icon-coral-edit"></el-icon>
                    <span class="card-title">订单编辑</span>
                </div>
                <div class="header-info">
                    <div style="line-height: 36px; margin-right: 10px">
                        <el-icon class="el-icon-coral-people"></el-icon>
                        <span>{{user.name}}</span>
                    </div>
                    <div style="line-height: 36px; margin-right: 10px">
                        <el-icon class="el-icon-coral-phone"></el-icon>
                        <span>{{cart.phone}}</span>
                    </div>
                    <div style="line-height: 36px">
                        <el-icon class="el-icon-coral-moneybag"></el-icon>
                        <span style="color:#d0021b;">{{`￥${(cart.sum || 0).toFixed(2)}`}}</span>
                    </div>
                </div>
            </div>
            <div>
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="详细信息" name="info">
                        <div class="cart-details">
                            <div v-html="cart.description"></div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="宝贝明细" name="cartDetails">
                        <el-row>
                            <el-col :span="24">
                                <div class="table-responsive">
                                    <table class="table table-striped" ref="dataTable">
                                        <thead>
                                            <tr>
                                                <th>名称</th>
                                                <th>价格</th>
                                                <th>数量</th>
                                                <th>积分</th>
                                                <th>小计</th>
                                                <th style="text-align: center">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in detailsInCart" :key="item.id">
                                                <td>{{item.name}}</td>
                                                <td style="color:#d0021b;">
                                                    {{`￥${(item.price || 0).toFixed(2)}`}}
                                                </td>
                                                <td>{{item.count}}</td>
                                                <td>{{item.point}}</td>
                                                <td style="color:#d0021b;">
                                                    {{`￥${((item.price || 0) * (item.count || 0)).toFixed(2)}`}}
                                                </td>
                                                <td style="text-align: center">
                                                    <el-button
                                                            title="删除" type="primary" icon="coral-move"
                                                            @click="handleActions(item, 'delete')">
                                                    </el-button>
                                                    <el-popover
                                                            placement="right"
                                                            title="修改数量"
                                                            width="200"
                                                            trigger="click"
                                                            @show="handlePopoverShow(item)"
                                                    >
                                                        <div>
                                                            <el-input-number v-model="changedNumber" @change="handleNumberChange" :min="1" :max="10"></el-input-number>
                                                            <div style="text-align: right;">
                                                                <el-button type="primary" style="margin-top: 10px;" @click="handleConfirmModify">确定</el-button>
                                                            </div>
                                                        </div>
                                                        <el-button type="primary" icon="edit" slot="reference">
                                                        </el-button>
                                                    </el-popover>
                                                </td>
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
        <el-dialog title="提示" size="tiny" :visible.sync="dialogVisible" :before-close="handleCancel">
            <span>你确定删除宝贝{{currentRow.name}}？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .cart-edit-container {
        padding: 10px;
        .card-container {
            .el-card__header {
                padding: 10px 20px;
            }
            .el-card__body {
                padding: 0;
            }
            .el-carousel__item {
                text-align: center;
            }
            .el-collapse {
                border: none;
            }
            .el-button {
                background: transparent;
                border: none;
                padding: 5px;
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
                    i, span{
                        color: #bfcbd9;
                    }
                    &:focus, &:hover {
                        background: transparent;
                        i, span{
                            color: #bfcbd9;
                        }
                    }
                }
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
                        font-size: 16px;
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
            .cart-details {
                padding: 10px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .table-responsive {
                padding-bottom: 10px;
                th, td, tr {
                    padding: 0;
                    vertical-align: middle;
                }
                .table {
                    td {
                        vertical-align: middle;
                        padding: 4px;
                    }
                }
            }
        }
    }
</style>
