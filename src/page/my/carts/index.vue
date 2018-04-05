<template>
    <div class="my-cart-list-container">
        <el-card class="card-container">
            <div slot="header" class="clear-fix card-header">
                <div style="line-height: 36px;">
                    <el-icon class="el-icon-coral-cart"></el-icon>
                    <span class="my-cart-name">我的订单</span>
                </div>
            </div>
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th>团单名</th>
                            <th>团单状态</th>
                            <th>我的金额</th>
                            <th>所得积分</th>
                            <th>更新时间</th>
                            <th class="action-th">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="cart in cartList" :key="cart.id">
                            <td>
                                <a href="javascript: void (0);" @click="handleActions(cart, 'buyPage')">
                                    {{cart['group_name']}}
                                </a>
                            <td>
                                <el-tag type="success" v-if="cart['group_status']===1">热团中</el-tag>
                                <el-tag v-else>已结束</el-tag>
                            </td>
                            <td>
                                <span style="color: #d0021b">{{cart.sum}}</span>
                            </td>
                            <td>0</td>
                            <td>{{mapDate(cart['insert_date'])}}</td>
                            <td align="center">
                                <el-button
                                        type="primary" title="编辑" size="small" icon="edit"
                                        @click="handleActions(cart, 'cartEdit')">
                                </el-button>
                                <el-button
                                        type="primary" title="删除" size="small" icon="delete"
                                        @click="handleActions(cart, 'delete')">
                                </el-button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </el-col>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog title="提示" size="tiny" :visible.sync="dialogVisible" :before-close="handleCancel">
            <span>你确定删除购物车{{currentRow.name}}？</span>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleConfirm">确定</el-button>
                    <el-button @click="handleCancel">取消</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .my-cart-list-container {
        padding: 10px;
        .card-container {
            .el-card__header {
                padding: 10px 20px;
            }
            .el-card__body {
                padding: 10px;
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
            .table {
                td {
                    vertical-align: middle;
                    padding: 4px;
                }
                .action-th {
                    text-align: center;
                }
            }
            .card-header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .el-icon-coral-cart {
                    font-size: 16px;
                }
            }
            .my-cart-name {
                font-size: 16px;
                font-weight: bold;
            }
            .cart-name-button {
                border: none;
                background: transparent;
            }
            .pagination {
                float: right;
                text-align: left;
                margin-top: 10px;
            }
            @media screen and (max-width: 992px) {
                .el-pagination__total {
                    display: none;
                }
                .el-pagination__sizes {
                    display: none;
                }
                .el-pagination__jump {
                    display: none;
                }
            }
        }
    }
</style>
