<template>
    <div class="my-setting-container">
        <el-card class="card-container">
            <div slot="header" class="clear-fix card-header">
                <div style="line-height: 36px;">
                    <el-icon class="el-icon-coral-settings"></el-icon>
                    <span class="my-setting-name">我的设置</span>
                </div>
            </div>
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="头像上传" class="uploader" name="avatar">
                        <el-col>
                            <label class="uploader-wrap">
                                <input type="file" ref="avatarToUpload" @change="upload('avatar')"/>
                                <i class="el-icon-coral-add"></i>
                                <img :src="avatarImgPath" v-if="avatarImgPath">
                            </label>
                        </el-col>
                    </el-collapse-item>
                    <el-collapse-item class="uploader" name="qrCode">
                        <template slot="title">
                            二维码上传
                            <el-radio-group v-model="payType">
                                <el-radio v-for="item in payTypes" :label="item.code" :key="item.code">
                                    {{item.name}}
                                </el-radio>
                            </el-radio-group>
                        </template>
                        <el-col v-if="payType==='zfb'">
                            <label class="uploader-wrap">
                                <input type="file" ref="taobaoToUpload" @change="upload('taobao')"/>
                                <i class="el-icon-coral-add"></i>
                                <img :src="taobaoImgPath" v-if="taobaoImgPath">
                            </label>
                        </el-col>
                        <el-col v-if="payType==='wx'">
                            <label class="uploader-wrap">
                                <input type="file" ref="wechatToUpload" @change="upload('wechat')"/>
                                <i class="el-icon-coral-add"></i>
                                <img :src="wechatImgPath" v-if="wechatImgPath">
                            </label>
                        </el-col>
                    </el-collapse-item>
                    <el-collapse-item name="info">
                        <template slot="title">
                            基本信息
                            <el-button
                                    icon="coral-forward" class="confirm-button"
                                    @click.stop="handleModifyUserInfo('normal')">
                                确认修改
                            </el-button>
                        </template>
                        <el-form label-position="top">
                            <el-row :gutter="5">
                                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                                    <el-form-item label="昵称">
                                        <el-input v-model="editForm.name" :readonly="true"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                                    <el-form-item label="手机号">
                                        <el-input v-model="editForm.phone" icon="edit" :maxlength="11"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                                    <el-form-item label="所在省份">
                                        <el-select placeholder="请选择所在省份" v-model="editForm.province">
                                            <el-option v-for="item in provinces" :label="item.value" :value="item.key" :key="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="12" :lg="6">
                                    <el-form-item label="所在城市">
                                        <el-select placeholder="请选择所在城市" v-model="editForm.city">
                                            <el-option v-for="item in cities" :label="item.value" :value="item.key" :key="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item name="seller" v-if="currentUser.type !== 'yy'">
                        <template slot="title">
                            我是商家
                            <el-button
                                    icon="coral-forward" class="confirm-button"
                                    @click.stop="handleModifyUserInfo('seller')">
                                确认修改
                            </el-button>
                        </template>
                        <el-form label-position="top">
                            <el-row :gutter="5">
                                <el-col :xs="24" :sm="24" :md="24" :lg="6">
                                    <el-form-item label="联系人">
                                        <el-input v-model="editForm.contacts" icon="edit">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" :lg="18">
                                    <el-form-item label="地址">
                                        <el-input v-model="editForm.address" icon="edit">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                                    <el-form-item label="关于我" class="description">
                                        <el-input type="textarea" v-model="editForm.description">
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
    .my-setting-container {
        padding: 10px;
        .card-container {
            padding-bottom: 0;
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
                    &:focus, &:hover {
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
            .confirm-button {
                float: right;
                margin-top: 5px;
                margin-right: 5px;
            }
            .description {
                margin-bottom: 0;
            }
            .uploader {
                .uploader-wrap {
                    width: 148px;
                    height: 148px;
                    border-radius: 8px;
                    border: 1px dashed #c0ccda;
                    margin-bottom: 20px;
                    overflow: hidden;
                    display: inline-block;
                    position: relative;
                    &:hover {
                        border: 1px dashed #1d90e6;
                    }
                    input {
                        position: absolute;
                        left: -9999px;
                        top: -9999px;
                    }
                    .el-icon-coral-add {
                        font-size: 36px;
                        color: #8c939d;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                    }
                    .el-progress {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                    }
                    img {
                        width: 148px;
                        height: 148px;
                        z-index: 100;
                    }
                }
            }
        }
    }
</style>
