<template>
    <div class="ency-update-container">
        <el-card class="card-container" style="padding-bottom: 100px" v-if="currentUser.type==='bkgly'">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-edit"></el-icon>
                            <span class="card-title">编辑{{encyEditing.name}}</span>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="16" :lg="16">
                        <el-form>
                            <el-form-item>
                                <el-button icon="coral-upload" @click="handleUpdate">提交</el-button>
                                <el-button icon="coral-close" @click="handleCancelEdit">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <el-row :gutter="5">
                <el-col :span="24">
                    <el-form ref="editForm" :model="editForm" :rules="rules" label-position="top">
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="生物名" prop="name">
                                <el-input placeholder="请输入生物名" :readonly="true" v-model="editForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="英文名" prop="ename">
                                <el-input placeholder="请输入英文名" v-model="editForm.ename"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="学名" prop="sname">
                                <el-input placeholder="请输入学名" v-model="editForm.sname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="分类" prop="category">
                                <el-select placeholder="请选择分类" v-model="editForm.category" @change="handleCategoryChange">
                                    <el-option
                                            v-for="category in categories" :label="category.name" :value="category.code"
                                            :key="category.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="小类" prop="type">
                                <el-select placeholder="请选择小类" v-model="editForm.type">
                                    <el-option
                                            v-for="type in types" :label="type.name" :value="type.code"
                                            :key="type.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="标签" prop="tag">
                                <el-input placeholder="请输入标签" v-model="editForm.tag"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="6">
                            <el-form-item label="编码" prop="code">
                                <el-input placeholder="请输入编码" v-model="editForm.code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="6">
                            <el-form-item label="参考价" prop="price">
                                <el-input placeholder="请输入参考价" v-model="editForm.price"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="6">
                            <el-form-item label="饲养难度" prop="level">
                                <el-radio-group v-model="editForm.level">
                                    <el-radio v-for="level in levels" :label="level.code" :key="level.code">
                                        {{level.name}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="6">
                            <el-form-item label="是否兼容" prop="compatibility">
                                <el-radio-group v-model="editForm.compatibility">
                                    <el-radio v-for="compatibility in compatibilities" :label="compatibility.code" :key="compatibility.code">
                                        {{compatibility.name}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24">
                            <el-form-item label="简介" prop="description">
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
            <span>你确定修改生物{{encyEditing.name}}的信息吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .ency-update-container {
        padding: 10px;
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