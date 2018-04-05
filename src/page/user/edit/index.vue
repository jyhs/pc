<template>
    <div class="user-update-container">
        <el-card class="card-container" v-if="currentUser.type==='yhgly'">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-edit"></el-icon>
                            <span class="card-title">编辑{{userEditing.name}}</span>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="16" :lg="16">
                        <el-form>
                            <el-form-item>
                                <el-button icon="coral-upload" @click="handleSubmit('editForm')">提交</el-button>
                                <el-button icon="coral-close" @click="handleCancelEdit">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <el-row :gutter="5">
                <el-col :span="24">
                    <el-form ref="editForm" :model="editForm" :rules="rules" label-position="top">
                        <el-col :xs="24" :sm="24" :md="12" :lg="6">
                            <el-form-item label="用户名" prop="name">
                                <el-input placeholder="请输入用户名" :readonly="true" v-model="editForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="6">
                            <el-form-item label="手机号" prop="phone">
                                <el-input placeholder="请输入手机号" :maxlength="11" v-model="editForm.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="6">
                            <el-form-item label="所在省份" prop="province">
                                <el-select placeholder="请选择" v-model="editForm.province" @change="handleProvinceChange">
                                    <el-option
                                            v-for="item in provinces" :label="item.value"
                                            :value="item.key" :key="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="6">
                            <el-form-item label="所在城市" prop="city">
                                <el-select placeholder="请选择" v-model="editForm.city">
                                    <el-option
                                            v-for="item in cities" :label="item.value"
                                            :value="item.key" :key="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="用户类型">
                                <el-select placeholder="请选择" v-model="editForm.type" @change="handleTypeChange">
                                    <el-option
                                            v-for="item in types" :label="item.name"
                                            :value="item.code" :key="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="16">
                            <el-form-item label="类型描述">
                                <el-input placeholder="请输入类型描述" :readonly="true" v-model="editForm['typeDesc']"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="8">
                            <el-form-item label="积分" prop="point">
                                <el-input placeholder="请输入积分" v-model="editForm.point"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="16">
                            <el-form-item label="所在地址" prop="address">
                                <el-input placeholder="请输入地址" v-model="editForm.address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24">
                            <el-form-item label="简介" prop="description">
                                <el-input placeholder="请输入简介" type="textarea" v-model="editForm.description"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-row class="card-container" v-else>
            抱歉，404
        </el-row>
        <el-dialog title="提示" size="tiny" :visible.sync="dialogVisible">
            <span>你确定修改用户{{userEditing.name}}的信息吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .user-update-container {
        padding: 10px;
        .el-select {
            width: 100%;
        }
        .el-card__header {
            padding: 10px 20px;
        }
        .el-card__body {
            padding: 10px;
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
    }
</style>