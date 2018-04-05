<template>
    <div class="seller-recent-list-container">
        <el-card class="card-container">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-peoplelist"></el-icon>
                            <span class="card-title">用户列表</span>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="16" :lg="16">
                        <el-form ref="searchForm" :model="searchForm" class="clear">
                            <el-form-item label="按用户名查找" label-position="left" label-width="100px" class="left">
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
                                <th>用户名</th>
                                <!--
                                <th>手机号</th>
                                -->
                                <th>城市</th>
                                <th>类型</th>
                                <th>积分</th>
                                <th>状态</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in userList" :key="item.id">
                                <td>
                                    <a href="javascript: void (0)" @click="handleActions(item, 'userDetail')">
                                        {{item.name}}
                                    </a>
                                </td>
                                <!--
                                <td>{{item.phone}}</td>
                                -->
                                <td>{{item.city_name}}</td>
                                <td>{{mapType(item.type)}}</td>
                                <td>{{item.point}}</td>
                                <td>
                                    <el-tag type="success" v-if="item.status===1">有效</el-tag>
                                    <el-tag v-else>无效</el-tag>
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
            <span>你确定{{currentRow.status===0?'恢复':'删除'}}用户{{currentRow.name}}？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .seller-recent-list-container {
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
