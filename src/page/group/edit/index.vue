<template>
    <div class="group-update-container">
        <el-card class="card-container" v-if="groupEditing.user_id==currentUser.id||currentUser.type==='tggly'">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-edit"></el-icon>
                            <span class="card-title">编辑{{groupEditing.name}}</span>
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
                    <el-form :model="editForm" :rules="rules" ref="editForm" label-position="top">
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="团单名" prop="name">
                                <el-input placeholder="请输入出团购名" v-model="editForm.name" :readonly="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="联系人姓名" prop="contacts">
                                <el-input placeholder="请输入联系人姓名" v-model="editForm.contacts"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="开团城市" prop="city">
                                <el-select placeholder="请选择所在城市" v-model="editForm.city">
                                    <el-option v-for="item in cities" :label="item.value" :value="item.key" :key="item.key"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="截止日期" prop="end_date">
                                <el-date-picker
                                        type="date"
                                        placeholder="请选择截止日期"
                                        :editable="false"
                                        :picker-options="pickerOptions"
                                        v-model="editForm.end_date"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" class="description_bottom">
                            <el-form-item label="其他信息" prop="description">
                                <quill-editor v-model="editForm.description" ref="myQuillEditor"
                                              class="editor" :options="editorOption">
                                </quill-editor>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="到货日期" prop="pickup_date">
                                <el-date-picker
                                        type="date"
                                        placeholder="请选择到货日期"
                                        :editable="false"
                                        :picker-options="pickerOptions"
                                        v-model="editForm.pickup_date"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="18">
                            <el-form-item label="分货地址" prop="pickup_address">
                                <el-input placeholder="请输入出分货地址" v-model="editForm.pickup_address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="支付类型" prop="pay_type">
                                <el-select placeholder="请选择支付类型" v-model="editForm.pay_type">
                                    <el-option v-for="item in payTypes" :label="item.name" :value="item.code" :key="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="支付账号名" prop="pay_name">
                                <el-input placeholder="请输入出支付账号名" v-model="editForm.pay_name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="支付账号名" prop="pay_count">
                                <el-input placeholder="请输入出支付账号名" v-model="editForm.pay_count"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="支付描述" prop="pay_description">
                                <el-input placeholder="请输入支付描述" v-model="editForm.pay_description"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="运费(%)" prop="freight">
                                <el-input placeholder="请输入运费(%)" v-model="editForm.freight"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="是否支持闪送" prop="is_flash">
                                <el-select placeholder="请选择是否闪送" v-model="editForm.is_flash">
                                    <el-option v-for="item in yesOrNo" :label="item.name" :value="item.code" :key="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12">
                            <el-form-item label="闪送描述" prop="flash_desc">
                                <el-input placeholder="请输入闪送描述" v-model="editForm.flash_desc"></el-input>
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
            <span>你确定修改团购{{groupEditing.name}}的信息吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .group-update-container {
        padding: 10px;
        .el-select {
            width: 100%;
        }
        .el-date-editor {
            width: 100%;
        }
        .editor {
            height: 150px;
        }
        .quill-editor + .el-form-item__error {
            top: 210px;
        }
        .el-card__header {
            padding: 10px 20px;
        }
        .el-card__body {
            padding: 10px;
        }
        .description_bottom {
            margin-bottom: 60px;
        }
        @media screen and (max-width: 992px) {
            .description_bottom {
                margin-bottom: 140px;
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