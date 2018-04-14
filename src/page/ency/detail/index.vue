<template>
    <div class="ency-detail-container">
        <el-card class="card-container">
            <div slot="header" class="card-header">
                <div style="line-height: 36px;">
                    <el-icon class="el-icon-coral-text"></el-icon>
                    <span class="card-title">{{encyEditing.name}}</span>
                </div>
            </div>
            <div>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" style="padding: 10px">
                        <div style="height: 400px;">
                            <el-carousel :interval="10000" height="350px" v-if="encyImages.length">
                                <el-carousel-item v-for="image in encyImages" :key="image">
                                    <img :src='image' height="350">
                                </el-carousel-item>
                            </el-carousel>
                            <div style="text-align: center; line-height: 400px" v-else>
                                <span>暂无图片，</span><a href="javascript: void (0);" @click="goToUploadPicture">去上传</a>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" style="padding: 10px">
                        <div>
                            <p>英文名：{{encyEditing.ename || '暂无'}}</p>
                            <p>学术名：{{encyEditing.sname || '暂无'}}</p>
                            <p>分类：{{mapCategory(encyEditing.category)}}</p>
                            <p>小类：{{mapType(encyEditing.type)}}</p>
                            <p>参考价：{{`￥${(encyEditing.price ||  0).toFixed(2)}`}}</p>
                            <p style="line-height: 20px">饲养难度：
                                <el-rate
                                        :value="encyEditing.level==='ry'?1:(encyEditing.level==='yb'?3:5)"
                                        disabled text-color="#ff9900">
                                </el-rate>
                            </p>
                            <p>兼容性：{{mapCompatibility(encyEditing.compatibility)}}</p>
                            <p>标签：{{encyEditing.tag}}</p>
                        </div>
                    </el-col>
                </el-row>
                <div style="padding: 10px">
                    <p v-html="encyEditing.description"></p>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .ency-detail-container {
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
            .el-rate {
                display: inline-block;
            }
            .el-rate__icon {
                font-size: 14px;
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
            @media screen and (max-width: 992px) {
                img {
                    width: 100%;
                    height: auto;
                }
            }
        }
    }
</style>
