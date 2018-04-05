<template>
    <div class="image-upload-container">
        <el-card class="card-container" v-if="currentUser.type==='bkgly'">
            <div slot="header" class="card-header">
                <div style="line-height: 36px;">
                    <el-icon class="el-icon-picture"></el-icon>
                    <span class="card-title">{{encyName}}图片</span>
                </div>
                <el-button type="primary" @click="handleBack" icon="coral-back">返回</el-button>
            </div>
            <el-row :gutter="5">
                <el-col :xs="12" :sm="12" :md="6" :lg="4" v-for="(image, index) in imageList" :key="index">
                    <label @mouseenter="handleMaskIsShow(index, true)" @mouseleave="handleMaskIsShow(index, false)">
                        <img :src="image" alt="">
                        <div class="mask" v-if="maskShow[index]&&maskShow[index][index]">
                            <div class="icons">
                                <i class="el-icon-coral-search icon" @click.stop.prevent="handleSearch(image)"></i>
                                <i class="el-icon-coral-delete icon" @click.stop.preven="handleDelete(image)"></i>
                            </div>
                        </div>
                    </label>
                </el-col>
                <el-col :xs="12" :sm="12" :md="6" :lg="4">
                    <label v-if="!imgPath">
                        <input type="file" ref="fileToUpload" @change="upload"/>
                        <i class="el-icon-coral-add" v-if="!imgPath"></i>
                    </label>
                    <label v-else @mouseenter="handleMaskIsShow(imageList.length, true)"
                           @mouseleave="handleMaskIsShow(imageList.length, false)">
                        <img :src="imgPath" alt="">
                        <div class="mask" v-if="maskShow[imageList.length]?maskShow[imageList.length][imageList.length]:false">
                            <div class="icons">
                                <i class="el-icon-coral-search icon" @click.stop.prevent="handleSearch"></i>
                                <i class="el-icon-coral-delete icon"></i>
                            </div>
                        </div>
                    </label>
                </el-col>
            </el-row>
        </el-card>
        <el-row class="card-container" v-else>
            抱歉，404
        </el-row>
        <el-dialog title="提示" size="tiny" :visible.sync="dialogVisible" :before-close="handleCancel">
            <span>你确定删除图片{{currentImage}}？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .image-upload-container {
        padding: 10px;
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
            .el-icon-picture {
                font-size: 16px;
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
            }
            label {
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
                .mask {
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    border-radius: 8px;
                    position: absolute;
                    left: 0;
                    top: 0;
                    .icons {
                        color: #fff;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        .icon {
                            font-size: 20px;
                        }
                    }
                }
            }
        }
    }
</style>