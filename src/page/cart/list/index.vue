<template>
    <div class="cart-list-container">
        <el-card class="card-container">
            <div slot="header" class="card-header clear-fix">
                <div style="line-height: 36px;">
                    <el-icon class="el-icon-coral-list"></el-icon>
                    <span class="card-title">{{userName}}的订单</span>
                </div>
            </div>
            <el-row>
                <el-col :span="24">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>团单名</th>
                                    <th>团单状态</th>
                                    <th>我的金额</th>
                                    <th>所得积分</th>
                                    <th>更新时间</th>
                                    <th style="text-align: center">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="cart in cartList" :key="cart.id">
                                <td>
                                    <a href="javascript: void (0);" @click="handleActions(cart, 'cartDetail')">
                                        {{cart['group_name']}}
                                    </a>
                                </td>
                                <td>
                                    <el-tag type="success" v-if="cart['group_status']===1">热团中</el-tag>
                                    <el-tag v-else>已结束</el-tag>
                                </td>
                                <td>
                                    <span style="color: #d0021b">{{`￥${cart.sum.toFixed(2)}`}}</span>
                                </td>
                                <td>0</td>
                                <td>{{mapDate(cart['insert_date'])}}</td>
                                <td align="center">
                                    <el-button
                                            type="primary"
                                            title="编辑"
                                            size="small"
                                            icon="edit"
                                            @click="handleActions(cart, 'cartEdit')">
                                    </el-button>
                                    <el-button
                                            type="primary"
                                            title="删除"
                                            size="small"
                                            icon="delete"
                                            @click="handleActions(cart, 'delete')">
                                    </el-button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </el-col>
            </el-row>
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
            <span>你确定删除订单吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .cart-list-container {
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
            .el-button {
                background: transparent;
                border: none;
                i, span {
                    color: #20a0ff;
                }
            }
            .el-button:focus, .el-button:hover {
                background: #20a0ff;
                i, span {
                    color: #fff;
                }
            }
            .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
                background: transparent;
                i, span {
                    color: #bfcbd9;
                }
            }
            .el-icon-coral-list {
                font-size: 16px;
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
                .el-form-item {
                    margin-bottom: 0;
                }
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
