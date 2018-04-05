<template>
    <div class="detail-list-container">
        <div class="detail-container">
            <div class="table-container">
                <el-card class="card-container">
                    <div slot="header" class="card-header clear-fix">
                        <el-row style="width: 100%">
                            <el-col :xs="24" :sm="24" :md="8" :lg="8">
                                <div style="line-height: 36px;">
                                    <el-icon class="el-icon-coral-list"></el-icon>
                                    <span class="card-title">明细列表</span>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="16" :lg="16">
                                <el-form ref="searchForm" :model="searchForm" class="clear">
                                    <el-form-item label="按明细名查找" label-width="100px" class="left">
                                        <el-input v-model="searchForm.billDetailName"></el-input>
                                    </el-form-item>
                                    <el-form-item class="left" style="margin-left: 20px">
                                        <el-button type="primary" @click="handleSearch" icon="search">查询</el-button>
                                        <el-button type="primary" @click="handleReset" icon="coral-refresh">重置</el-button>
                                        <el-button type="primary" @click="handleAdd" icon="coral-add">新增</el-button>
                                        <el-button type="primary" @click="handleBack" icon="coral-back">返回</el-button>
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
                                        <th>明细名</th>
                                        <th>尺寸</th>
                                        <th>价格</th>
                                        <th>积分</th>
                                        <th>剩余数量</th>
                                        <th>购买限额</th>
                                        <th class="action-th">操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="item in billDetails" :key="item.id">
                                        <td>{{item.name}}</td>
                                        <td>{{item.size}}</td>
                                        <td>{{item.price}}</td>
                                        <td>{{item.point}}</td>
                                        <td>{{item.left_numbers}}</td>
                                        <td>{{Number(item.limits) === 99 ? '不限' : item.limits}}</td>
                                        <td align="center">
                                            <el-button
                                                    title="编辑"
                                                    type="primary"
                                                    size="small"
                                                    icon="edit"
                                                    @click="handleUpdate(item)">
                                            </el-button>
                                            <el-button
                                                    title="删除"
                                                    type="primary"
                                                    size="small"
                                                    icon="delete"
                                                    @click="handleDelete(item)">
                                            </el-button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </el-col>
                    </el-row>
                    <!--
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
                    -->
                </el-card>
            </div>
            <el-dialog title="提示" size="tiny" :visible.sync="dialogVisible" :before-close="handleCancel">
                <span>你确定删除明细{{currentRow.name}}？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleConfirm">确定</el-button>
                    <el-button @click="handleCancel">取消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .detail-list-container {
        .detail-container {
            padding: 20px;
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
                .table {
                    .action-th {
                        text-align: center;
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
                    .el-form-item {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .pagination {
            float: right;
            text-align: left;
            margin-top: 10px;
        }
    }
</style>
