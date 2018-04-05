<template>
    <div class="bill-update-container">
        <el-card class="card-container" style="padding-bottom: 100px" v-if="billEditing.user_id==currentUser.id||currentUser.type==='tggly'||currentUser.type==='cjyy'">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-edit"></el-icon>
                            <span class="card-title">编辑出单{{billEditing.name}}</span>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="16" :lg="16">
                        <el-form>
                            <el-form-item>
                                <el-button icon='coral-upload' @click="handleUpdate">提交</el-button>
                                <el-button icon='coral-close' @click="handleCancelEdit">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <el-row :gutter="5">
                <el-col :span="24">
                    <el-form :model="editForm" :rules="rules" ref="editForm" label-position="top">
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="出货单名" prop="name">
                                <el-input placeholder="请输入出货单名" :readonly="true" v-model="editForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="联系人姓名" prop="contacts">
                                <el-input placeholder="请输入联系人姓名" v-model="editForm.contacts"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="联系人手机" prop="phone">
                                <el-input placeholder="请输入联系人手机" :maxlength="11" v-model="editForm.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="截止日期" prop="effortDate">
                                <el-date-picker
                                        type="date"
                                        placeholder="请选择截止日期"
                                        :editable="false"
                                        :picker-options="pickerOptions"
                                        v-model="editForm.effortDate"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="供货商" prop="supplierId">
                                <el-select placeholder="请选择供货商" v-model="editForm.supplierId">
                                    <el-option
                                            v-for="user in usersLssAndPfs" :label="user.name" :value="user.id"
                                            :key="user.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24">
                            <el-form-item label="其他信息" prop="description">
                                <quill-editor
                                        v-model="editForm.description" ref="myQuillEditor"
                                        class="editor" :options="editorOption">
                                </quill-editor>
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
            <span>你确定修改生物{{billEditing.name}}的信息吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .bill-update-container {
        padding: 10px;
        .el-date-editor {
            width: 100%;
        }
        .el-select {
            width: 100%;
        }
        .editor {
            height: 150px;
        }
        .quill-editor + .el-form-item__error {
            top: 240px;
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