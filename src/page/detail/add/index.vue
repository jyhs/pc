<template>
    <div class="detail-add-container">
        <el-card class="card-container">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :span="16">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-add"></el-icon>
                            <span class="card-title">添加明细</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <el-form>
                            <el-form-item class="button-submit">
                                <el-button icon="coral-add" @click="submitAdd">立即创建</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <el-row :gutter="5" style="padding: 10px">
                <el-col :span="24">
                    <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="明细名" prop="name">
                                <el-input placeholder="请输入明细名" v-model="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="尺寸" prop="size">
                                <el-input placeholder="请输入尺寸" v-model="addForm.size"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="价格" prop="price">
                                <el-input placeholder="请输入价格" v-model="addForm.price"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="积分" prop="point">
                                <el-input placeholder="请输入积分" v-model="addForm.point"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="数量" prop="numbers">
                                <el-input placeholder="请输入积分" v-model="addForm.numbers"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8">
                            <el-form-item label="购买限额" prop="limits">
                                <el-input placeholder="请输入积分" v-model="addForm.limits"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .detail-add-container {
        padding: 10px;
        .card-container {
            .el-card__header {
                padding: 10px 20px;
            }
            .el-card__body {
                padding: 0;
            }
            .el-icon-coral-text {
                font-size: 16px;
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
                    i, span{
                        color: #bfcbd9;
                    }
                    &:focus, &:hover {
                        background: transparent;
                        i, span{
                            color: #bfcbd9;
                        }
                    }
                }
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
                .el-form-item {
                    margin-bottom: 0;
                }
            }
            .table-responsive {
                padding-bottom: 10px;
                th, td, tr {
                    padding: 0;
                    vertical-align: middle;
                }
                .table {
                    margin: 0 5px;
                    .name-field {
                        padding-left: 10px;
                    }
                    .popup-img {
                        width: 128px;
                        cursor: pointer;
                    }
                }
                .bill-name-button {
                    border: none;
                    background: transparent;
                }
            }
        }
    }
</style>