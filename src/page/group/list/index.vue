<template>
    <div class="group-list-container">
        <el-card class="card-container">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-list"></el-icon>
                            <span class="card-title">团单列表</span>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="16" :lg="16">
                        <el-form ref="searchForm" :model="searchForm" class="clear">
                            <el-form-item label="按团单名查找" label-width="100px" class="left">
                                <el-input v-model="searchForm.name" @blur="handleSearch"></el-input>
                            </el-form-item>
                            <el-form-item class="left" style="margin-left: 20px">
                                <el-button type="primary" @click="handleSearch" icon="search">查询</el-button>
                                <el-button type="primary" @click="handleReset" icon="coral-refresh">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <el-row>
                <el-col :span="24">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>团单名</th>
                                    <th>组织者</th>
                                    <th>组织者手机</th>
                                    <th>开团城市</th>
                                    <th>供货商</th>
                                    <th>已团金额</th>
                                    <th>当前状态</th>
                                    <th>私密单</th>
                                    <th>截止日期</th>
                                    <th class="action-th" v-if="currentUser.type==='tggly'">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in groupList" :key="item.id">
                                    <td style="max-width: 200px;">
                                        <a href="javascript: void (0);" @click="handleActions(item, 'groupDetail')">
                                            {{item.name}}
                                        </a>
                                    </td>
                                    <td>{{item.contacts}}</td>
                                    <td>{{item.phone}}</td>
                                    <td>{{item.city}}</td>
                                    <td>{{item.supplierName}}</td>
                                    <td><span style="color: #d0021b">{{'￥' + item.sum.toFixed(2)}}</span></td>
                                    <td>
                                        <el-tag type="success" v-if="item.status===1">热团中</el-tag>
                                        <el-tag v-else>已结束</el-tag>
                                    </td>
                                    <td>
                                        <el-tag type="warning" v-if="item.private===0">否</el-tag>
                                        <el-tag type="primary" v-else>是</el-tag>
                                    </td>
                                    <td>{{item.end_date}}</td>
                                    <td align="center" v-if="currentUser.type==='tggly'">
                                        <el-button
                                                title="编辑" size="small" icon="edit"
                                                @click="handleActions(item, 'groupEdit')">
                                        </el-button>
                                        <el-button
                                                title="导出" size="small" icon="coral-down"
                                                @click="downloadAboutGroup(item)">
                                        </el-button>
                                        <el-button
                                                v-if="item.status===1"
                                                title="结束" size="small" icon="coral-close"
                                                @click="handleActions(item, 'finish')">
                                        </el-button>
                                        <el-button
                                                v-if="item.status===0"
                                                title="重新开始" size="small" icon="coral-check"
                                                @click="handleActions(item, 'reopen')">
                                        </el-button>
                                        <el-button
                                                title="删除" size="small" icon="coral-delete"
                                                @click="handleActions(item, 'delete')">
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
        <el-dialog title="提示" size="tiny" :visible.sync="deleteVisible" :before-close="handleDeleteCancel">
            <span>你确定删除团单{{currentRow.name}}？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirmDelete">确定</el-button>
                <el-button @click="handleDeleteCancel">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .group-list-container {
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
                i {
                    font-size: 16px;
                }
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
