<template>
    <div class="bill-add-container">
        <el-card
                class="card-container" style="padding-bottom: 100px"
                v-if="currentUser.type==='tggly'||currentUser.type==='cjyy'||currentUser.type==='lss'||currentUser.type==='pfs'">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-upload"></el-icon>
                            <span class="card-title">上传出单</span>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="16" :lg="16">
                        <el-form>
                            <el-form-item>
                                <el-button icon="coral-down" @click="downloadTemplate">下载模板</el-button>
                                <el-button icon="coral-upload" @click="submitUpload">立即上传</el-button>
                                <el-button
                                        icon="coral-light"
                                        @click="submitUploadBySeller"
                                        v-if="currentUser.type==='tggly'||currentUser.type==='cjyy'||currentUser.type==='lss'||currentUser.type==='pfs'"
                                >
                                    一键开团
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <el-row :gutter="5">
                <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                    <el-col :xs="24" :sm="24" :md="12" :lg="8">
                        <el-form-item label="出货单名" prop="billName">
                            <el-input placeholder="请输入出货单名" v-model="addForm.billName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8">
                        <el-form-item label="供货商" prop="supplierId">
                            <el-select placeholder="请选择供货商" v-model="addForm.supplierId" @change="handleSupplierChange">
                                <el-option
                                        v-for="user in usersPfs" :label="user.name"
                                        :value="user.id" :key="user.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8">
                        <el-form-item label="供货商手机" prop="phone">
                            <el-input placeholder="请输入供货商手机" :maxlength="11" v-model="addForm.phone" :readonly="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8">
                        <el-form-item label="截止日期" prop="effortDate">
                            <el-date-picker
                                    type="date"
                                    placeholder="请选择截止日期"
                                    :editable="false"
                                    :picker-options="pickerOptions"
                                    v-model="addForm.effortDate"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8">
                        <div class="el-form-item is-error is-required">
                            <label class="el-form-item__label" style="width: 110px;">选择文件</label>
                            <div class="file-container">
                                <a href="javascript: void (0);" class="file">
                                    选择文件
                                    <input ref="billFile" type="file" @change="handleFillChange">
                                </a>
                                <span v-text="fileChangeDesc"></span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-form-item label="其他信息" prop="description">
                            <quill-editor
                                    v-model="addForm.description" ref="myQuillEditor"
                                    class="editor" :options="editorOption">
                            </quill-editor>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </el-card>
        <el-row class="card-container" v-else>
            抱歉，404
        </el-row>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .bill-add-container {
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
            top: 210px;
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
        .file-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            .file {
                position: relative;
                display: inline-block;
                background: #D0EEFF;
                border: 1px solid #99D3F5;
                border-radius: 4px;
                padding: 4px 12px;
                overflow: hidden;
                color: #1E88C7;
                text-decoration: none;
                text-indent: 0;
                line-height: 25px;
                input {
                    position: absolute;
                    font-size: 100px;
                    right: 0;
                    top: 0;
                    opacity: 0;
                }
                &:hover {
                    background: #AADFFD;
                    border-color: #78C3F3;
                    color: #004974;
                    text-decoration: none;
                }
            }
            span {
                padding-left: 10px;
            }
        }
    }
</style>