<template>
    <div class="group-detail-container">
        <el-card class="card-container">
            <div slot="header" class="card-header">
                <el-row style="width: 100%">
                    <el-col :xs="24" :sm="24" :md="6" :lg="6">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-edit"></el-icon>
                            <span class="card-title">{{group.name}}</span>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="18" :lg="18">
                        <div class="header-info">
                            <el-row style="width: 100%">
                                <el-col :xs="24" :sm="24" :md="6" :lg="8">
                                    <div style="line-height: 36px; margin-right: 10px">
                                        <el-icon class="el-icon-coral-people"></el-icon>
                                        <span>{{group.contacts}}</span>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="6" :lg="8">
                                    <div style="line-height: 36px; margin-right: 10px">
                                        <el-icon class="el-icon-coral-phone"></el-icon>
                                        <span>{{group.phone}}</span>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="6" :lg="8">
                                    <div style="line-height: 36px">
                                        <el-icon class="el-icon-coral-time"></el-icon>
                                        <span>{{group.end_date}}</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="详细信息" name="info">
                        <div class="group-details">
                            <div v-html="group.description"></div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="出单明细" name="billDetails">
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="24" :lg="12">
                                <div class="table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th class="name-field">名称</th>
                                                <th>尺寸</th>
                                                <th>价格</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="detail in detailList.slice(0, Math.ceil(detailList.length / 2))" :key="detail.id">
                                                <td>
                                                    <el-popover
                                                            placement="right-start" width="150" trigger="hover"
                                                            @show="handleDetailImageShow(detail)">
                                                        <el-button slot="reference" class="detail-name-button">{{detail.name}}</el-button>
                                                        <img style="width: 128px; cursor: pointer" :src="imagePath" v-if="imagePath"/>
                                                        <div style="text-align: center" v-else>
                                                            <span>正在加载中...</span>
                                                        </div>
                                                    </el-popover>
                                                </td>
                                                <td>{{detail.size}}</td>
                                                <td>{{detail.price}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="24" :lg="12">
                                <div class="table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th class="name-field">名称</th>
                                                <th>尺寸</th>
                                                <th>价格</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="detail in detailList.slice(Math.ceil(detailList.length / 2), detailList.length)"
                                                :key="detail.id">
                                                <td>
                                                    <el-popover
                                                            placement="right-start" width="150" trigger="hover"
                                                            @show="handleDetailImageShow(detail)">
                                                        <el-button slot="reference" class="detail-name-button">{{detail.name}}</el-button>
                                                        <img style="width: 128px; cursor: pointer" :src="imagePath" v-if="imagePath"/>
                                                        <div style="text-align: center" v-else>
                                                            <span>正在加载中...</span>
                                                        </div>
                                                    </el-popover>
                                                </td>
                                                <td>{{detail.size}}</td>
                                                <td>{{detail.price}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-card>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .group-detail-container {
        padding: 10px;
        .card-container {
            a {
                text-decoration: none;
                cursor: pointer;
                &:hover {
                    cursor: pointer;
                }
            }
            .el-card__header {
                padding: 10px 20px;
            }
            .el-card__body {
                padding: 10px;
            }
            .el-icon-coral-text {
                font-size: 16px;
            }
            .el-carousel__item {
                text-align: center;
            }
            .el-card__body {
                padding: 0;
            }
            .el-collapse {
                border: none;
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
                .header-info {
                    display: flex;
                    flex-direction: row;
                    span, i {
                        font-size: 15px;
                    }
                    i {
                        color: #b9b9b9;
                    }
                    .el-icon-coral-phone {
                        font-size: 18px;
                        transform: translateY(2px);
                    }
                }
            }
            .group-details {
                padding: 10px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                img {
                    width: 120px;
                    height: 120px;
                }
            }
            .table-responsive {
                padding-bottom: 10px;
                th, td, tr {
                    padding: 0;
                    vertical-align: middle;
                }
                .name-field {
                    padding-left: 10px;
                }
                .table {
                    margin: 0 5px;
                }
                .detail-name-button {
                    border: none;
                    background: transparent;
                }
            }
        }
    }
</style>
