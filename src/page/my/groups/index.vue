<template>
    <div class="my-group-list-container">
        <el-card class="card-container">
            <div slot="header" class="clear-fix card-header">
                <div style="line-height: 36px;">
                    <el-icon class="el-icon-coral-list"></el-icon>
                    <span class="my-cart-name">我开的团单</span>
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
                            <!--
                            <th>所得积分</th>
                            -->
                            <th>私密单</th>
                            <th>截止时间</th>
                            <th class="action-th">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="group in groupList" :key="group.id">
                            <td>
                                <a href="javascript: void (0);" @click="handleActions(group, 'groupDetail')">
                                    {{group.name}}
                                </a>
                            </td>
                            <td>
                                <el-tag type="success" v-if="group.status===1">热团中</el-tag>
                                <el-tag v-else>已结束</el-tag>
                            </td>
                            <td>
                                <span style="color: #d0021b">{{`￥${group.sum.toFixed(2)}`}}</span>
                            </td>
                            <td>
                                <el-tag type="warning" v-if="group.private===0">否</el-tag>
                                <el-tag type="primary" v-else>是</el-tag>
                            </td>
                            <td>{{group.end_date}}</td>
                            <td align="center">
                                <el-button
                                        title="编辑" size="small" icon="edit"
                                        @click="handleActions(group, 'groupEdit')">
                                </el-button>
                                <el-button
                                        v-if="group.status===1"
                                        title="结束" size="small" icon="coral-close"
                                        @click="handleActions(group, 'delete')">
                                </el-button>
                                <el-button
                                        v-if="group.status===0"
                                        title="重新开始" size="small" icon="coral-check"
                                        @click="handleActions(group, 'reopen')">
                                </el-button>
                                <el-button
                                        title="导出" size="small" icon="coral-down"
                                        @click="downloadAboutGroup(group)">
                                </el-button>
                                <el-button
                                        v-if="currentUser.type==='tggly'||currentUser.type==='lss'||currentUser.type==='pfs'"
                                        :disabled="group.private!=1"
                                        title="私密单" size="small" icon="coral-attentionforbid"
                                        @click="getQrCodeInGroup(group)">
                                </el-button>
                                <el-button
                                        title="订单" size="small" icon="coral-list"
                                        @click="handleActions(group, 'cartGroup')">
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
            <span>你确定结束团单{{currentRow.name}}？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="重新开始" size="tiny" :visible.sync="reopenVisible" :before-close="handleReopenCancel">
            <el-form label-width="70px">
                <el-form-item label="截止时间">
                    <el-date-picker
                            type="datetime"
                            placeholder="请选择截止时间"
                            :editable="false"
                            :picker-options="pickerOptions"
                            v-model="endDate"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirmReopen">确定</el-button>
                <el-button @click="handleReopenCancel">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="私密单入口" size="tiny" class="private-dialog"
                :visible.sync="qrCodeVisible" :before-close="handleQrCodeCancel">
            <img :src="qrCodeUrl">
            <span>私密单路径：{{privateUrl}}</span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .my-group-list-container {
        padding: 10px;
        .el-date-editor {
            width: 100%;
        }
        .private-dialog {
            img {
                width: 300px;
                height: 300px;
            }
            .el-dialog__body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
        }
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
