<template>
    <div class="image-container">
        <div class="image-list-container">
            <el-row :gutter="20">
                <el-col :span="6" v-for="(image, index) in imageList" :key="index">
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
                <el-col :span="6">
                    <label v-if="!imgPath">
                        <input type="file" ref="fileToUpload" @change="upload"/>
                        <i class="el-icon-coral-add" v-if="!imgPath"></i>
                    </label>
                    <label v-else @mouseenter="handleMaskIsShow(imageList.length, true)" @mouseleave="handleMaskIsShow(imageList.length, false)">
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
        </div>
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
    .image-container {
        position: relative;
        .image-list-container {
            position: relative;
            width: 80%;
            padding-left: 10%;
            label {
                width: 148px;
                height: 148px;
                border-radius: 8px;
                border: 1px dashed #c0ccda;
                margin-bottom: 20px;
                overflow: hidden;
                display: inline-block;
                position: relative;
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
            label:hover {
                border: 1px dashed #1d90e6;
            }
        }
    }
</style>