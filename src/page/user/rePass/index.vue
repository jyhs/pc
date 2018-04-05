<template>
    <div class="pass-form-container">
        <el-card class="card-container">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-refresh"></el-icon>
                            <span class="card-title">重置密码</span>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="16" :lg="16">
                        <el-form>
                            <el-form-item>
                                <el-button type="primary" icon="coral-refresh" @click="handleSubmit">修改</el-button>
                                <el-button icon="coral-close" @click="handleCancelChange">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <el-row>
                <el-form ref="passForm" :model="passForm" :rules="rules" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input v-model="userEditing.name" :readonly="true"></el-input>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-card>
        <el-dialog title="提示" size="tiny" :visible.sync="dialogVisible">
            <span>你确定修改用户{{userEditing.name}}的密码吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .pass-form-container {
        padding: 10px;
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