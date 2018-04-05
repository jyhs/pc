<template>
    <div class="other-user-setting-container">
        <el-card class="card-container">
            <div slot="header" class="clear-fix card-header">
                <div style="line-height: 36px;">
                    <el-icon class="el-icon-coral-settings"></el-icon>
                    <span class="my-setting-name">我的设置</span>
                </div>
            </div>
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="头像" class="uploader" name="avatar">
                        <el-col :xs="8" :sm="6" :md="4" :lg="3">
                            <label class="uploader-wrap">
                                <img :src="avatarImgPath">
                            </label>
                        </el-col>
                    </el-collapse-item>
                    <el-collapse-item class="uploader" name="qrCode">
                        <template slot="title">
                            二维码
                            <el-radio-group v-model="payType" :disabled="true">
                                <el-radio v-for="item in payTypes" :label="item.code" :key="item.code">
                                    {{item.name}}
                                </el-radio>
                            </el-radio-group>
                        </template>
                        <el-col :xs="8" :sm="6" :md="4" :lg="3">
                            <label class="uploader-wrap">
                                <img :src="qrCodeImage">
                            </label>
                        </el-col>
                    </el-collapse-item>
                    <el-collapse-item title="基本信息" name="info">
                        <el-form label-position="top">
                            <el-row :gutter="5">
                                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                                    <el-form-item label="昵称">
                                        <el-input v-model="currentUser.name" :readonly="true">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                                    <el-form-item label="手机号">
                                        <el-input v-model="currentUser.phone" :readonly="true">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                                    <el-form-item label="所在省份">
                                        <el-select placeholder="请选择" v-model="currentUser.province" :disabled="true">
                                            <el-option
                                                    v-for="item in provinces" :label="item.value"
                                                    :value="item.key" :key="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                                    <el-form-item label="所在城市">
                                        <el-select placeholder="请选择" v-model="currentUser.city" :disabled="true">
                                            <el-option
                                                    v-for="item in cities" :label="item.value"
                                                    :value="item.key" :key="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="我是商家" name="seller">
                        <el-form label-position="top">
                            <el-row :gutter="5">
                                <el-col :xs="24" :sm="24" :md="24" :lg="6">
                                    <el-form-item label="联系人">
                                        <el-input v-model="currentUser.contacts" :readonly="true">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" :lg="18">
                                    <el-form-item label="地址">
                                        <el-input v-model="currentUser.address" :readonly="true">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                                    <el-form-item label="关于我" class="description">
                                        <el-input type="textarea" v-model="currentUser.description" :readonly="true">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
        </el-card>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .other-user-setting-container {
        padding: 10px;
        .card-container {
            padding-bottom: 0;
            .el-radio__input.is-disabled.is-checked .el-radio__inner {
                background-color: #20a0ff;
                border-color: #20a0ff;
            }
            .el-radio__input.is-disabled+.el-radio__label {
                color: #1f2d3d;
            }
            .el-input.is-disabled .el-input__inner {
                background-color: #fff;
                border-color: #bfcbd9;
                color: #1f2d3d;
            }
            .el-card__header {
                padding: 10px 20px;
            }
            .el-card__body {
                padding: 0;
            }
            .el-collapse {
                border: none;
            }
            .el-select {
                width: 100%;
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
                    &:focus, &:focus {
                        background: transparent;
                        i, span {
                            color: #bfcbd9;
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
                .my-setting-name {
                    font-size: 16px;
                    font-weight: bold;
                }
            }
            .description {
                margin-bottom: 0;
            }
            .uploader {
                .uploader-wrap {
                    width: 148px;
                    height: 148px;
                    position: relative;
                    img {
                        width: 148px;
                        height: 148px;
                    }
                }
            }
        }
    }
</style>
