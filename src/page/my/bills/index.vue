<template>
    <div class="my-bill-list-container">
        <el-card class="card-container">
            <div slot="header" class="card-header clear-fix">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-list"></el-icon>
                            <span class="card-title">出单列表</span>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="16" :lg="16">
                        <el-form ref="searchForm" :model="searchForm" class="clear">
                            <el-form-item label="按出单名查找" label-width="100px" class="left">
                                <el-input v-model="searchForm.name"></el-input>
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
                                    <th>出单名</th>
                                    <th>上传人</th>
                                    <th>供货商</th>
                                    <th>供货商手机</th>
                                    <th>截止日期</th>
                                    <th class="action-th">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in billList" :key="item.id">
                                    <td>
                                        <a href="javascript: void (0)" @click="handleActions(item, 'billDetail')">
                                            {{item.name}}
                                        </a>
                                    </td>
                                    <td>{{item.contacts}}</td>
                                    <td>{{item.supplier_name}}</td>
                                    <td>{{item.phone}}</td>
                                    <td>{{item.effort_date}}</td>
                                    <td align="center">
                                        <el-button
                                                title="我要开团"
                                                type="primary"
                                                size="small"
                                                icon="coral-add"
                                                @click="handleActions(item, 'groupAdd')">
                                        </el-button>
                                        <el-button
                                                title="明细"
                                                type="primary"
                                                size="small"
                                                icon="coral-list"
                                                @click="handleActions(item, 'detailList')">
                                        </el-button>
                                        <el-button
                                                title="编辑"
                                                type="primary"
                                                size="small"
                                                icon="edit"
                                                @click="handleActions(item, 'billEdit')">
                                        </el-button>
                                        <el-button
                                                title="删除"
                                                type="primary"
                                                size="small"
                                                icon="delete"
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
            <span>你确定删除出货单{{currentRow.name}}？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .my-bill-list-container {
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
