<template>
    <div class="ency-list-container">
        <el-card class="card-container">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-list"></el-icon>
                            <span class="card-title">{{showType ? '生物' : '器材'}}百科</span>
                            <el-switch v-model="showType"
                                       v-if="currentUser.type==='bkgly'"
                                       on-color="#13ce66"
                                       off-color="#ff4949"
                                       on-text="生物"
                                       off-text="器材"
                                       @change="handleShowTypeChange"
                            ></el-switch>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="16" :lg="16">
                        <el-form ref="searchForm" :model="searchForm" class="clear">
                            <el-form-item class="left">
                                <el-input v-model="searchForm.name" @blur="handleSearch"></el-input>
                            </el-form-item>
                            <el-form-item class="left" style="margin-left: 20px">
                                <el-button type="primary" @click="handleSearch" icon="search">查询</el-button>
                                <el-button type="primary" @click="handleReset" icon="coral-refresh">重置</el-button>
                                <el-button type="primary" @click="handleAdd" icon="coral-add" v-if="currentUser.type==='bkgly'">
                                    添加
                                </el-button>
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
                                    <th>生物名</th>
                                    <th>
                                        <el-popover
                                                ref="categoryFilter"
                                                placement="bottom"
                                                width="150"
                                                trigger="click">
                                            <div>
                                                <el-checkbox-group v-model="checkedCategories">
                                                    <el-checkbox
                                                            v-for="item in categories" :label="item.code"
                                                            :key="item.code">
                                                        {{item.name}}
                                                    </el-checkbox>
                                                </el-checkbox-group>
                                                <div class="buttons">
                                                    <el-button type="primary" @click="handleConfirmFilter('category')">
                                                        确定
                                                    </el-button>
                                                    <el-button type="primary" @click="handleResetFilter('category')">
                                                        重置
                                                    </el-button>
                                                </div>
                                            </div>
                                        </el-popover>
                                        <!--
                                        <el-button
                                                id="categoryFilterButton" class="button-filter" icon="coral-filter"
                                                v-popover:categoryFilter>
                                            分类
                                        </el-button>
                                        -->
                                        分类
                                    </th>
                                    <th>
                                        <el-popover
                                                ref="typeFilter"
                                                placement="bottom"
                                                width="800"
                                                trigger="click">
                                            <div>
                                                <el-tree
                                                        ref="typesTree"
                                                        :data="filteredTypes"
                                                        :props="defaultProps"
                                                        show-checkbox
                                                        node-key="code"
                                                        accordion
                                                        :expand-on-click-node="false">
                                                </el-tree>
                                                <div class="buttons">
                                                    <el-button type="primary" @click="handleConfirmFilter('type')">确定</el-button>
                                                    <el-button type="primary" @click="handleEmptyFilter('type')">重选</el-button>
                                                    <el-button type="primary" @click="handleResetFilter('type')">重置</el-button>
                                                </div>
                                            </div>
                                        </el-popover>
                                        <el-button
                                                id="typeFilterButton" class="button-filter" icon="coral-filter"
                                                v-popover:typeFilter>
                                            小类
                                        </el-button>
                                    </th>
                                    <th>标签</th>
                                    <th class="center-th">饲养难度</th>
                                    <th>参考价格</th>
                                    <th>兼容性</th>
                                    <th class="center-th" v-if="currentUser.type==='bkgly'">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in encyList" :key="item.id">
                                    <td>
                                        <a href="javascript: void (0);" @click="handleActions(item, 'encyDetail')">
                                            {{item.name}}
                                        </a>
                                    </td>
                                    <td>{{mapCategory(item.category)}}</td>
                                    <td>{{mapType(item.type)}}</td>
                                    <td>
                                        <el-tag type="primary" v-for="item in item.tag.trim().split(',')" :key="item">
                                            {{item}}
                                        </el-tag>
                                    </td>
                                    <td class="center-th">
                                        <el-rate :value="item.level==='ry'?1:(item.level==='yb'?3:5)" disabled text-color="#ff9900"></el-rate>
                                    </td>
                                    <td>{{`￥${item.price.toFixed(2)}`}}</td>
                                    <td>
                                        <el-tag type="success">
                                            {{mapCompatibility(item.compatibility)}}
                                        </el-tag>
                                    </td>
                                    <td align="center" v-if="currentUser.type==='bkgly'">
                                        <el-button
                                                title="编辑"
                                                type="primary"
                                                size="small"
                                                icon="edit"
                                                @click="handleActions(item, 'encyEdit')">
                                        </el-button>
                                        <el-button
                                                title="图片管理"
                                                type="primary"
                                                size="small"
                                                icon="coral-pic"
                                                @click="handleActions(item, 'encyPicture')">
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
            <span>你确定删除生物{{currentRow.name}}？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .el-popover {
        .el-checkbox-group {
            display: flex;
            flex-direction: column;
            .el-checkbox {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                margin-left: 0;
                .el-checkbox__label {
                    padding-left: 0;
                    font-weight: normal;
                }
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
        }
        .buttons {
            margin-top: 10px;
            display: flex;
            justify-content: space-around;
        }
        .el-tree {
            border: none;
            .el-tree-node__children {
                display: flex;
                flex-wrap: wrap;
            }
            .el-tree-node {
                flex: 1;
            }
        }
    }
    .ency-list-container {
        padding: 10px;
        .el-rate__icon {
            font-size: 14px;
        }
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
                .center-th {
                    text-align: center;
                }
                .button-filter {
                    padding: 0;
                    i {
                        color: #ee735c;
                        float: right;
                    }
                    span {
                        color: #000;
                        margin-left: 0;
                        float: left;
                    }
                    &:focus, &:hover {
                        background: transparent;
                        padding: 0;
                        i {
                            color: rgba(0, 0, 0, 0.45);
                            float: right;
                        }
                        span {
                            color: #000;
                            margin-left: 0;
                            float: left;
                        }
                    }
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
