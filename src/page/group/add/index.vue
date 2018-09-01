<template>
    <div class="group-add-container">
        <el-col :xs="24" :sm="24" :md="18" :lg="18">
            <div style="padding: 10px;">
                <el-card class="card-container main-card">
                    <div slot="header" class="clear-fix card-header">
                        <el-row style="width: 100%">
                            <el-col :xs="24" :sm="24" :md="6" :lg="6">
                                <div style="line-height: 36px;">
                                    <el-icon class="el-icon-coral-edit"></el-icon>
                                    <span class="group-name">{{bill.name}}</span>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="18" :lg="18">
                                <div class="header-info">
                                    <el-row style="width: 100%">
                                        <el-col :xs="24" :sm="24" :md="6" :lg="8">
                                            <div style="line-height: 36px; margin-right: 10px">
                                                <el-icon class="el-icon-coral-people"></el-icon>
                                                <span>{{bill.contacts}}</span>
                                            </div>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="6" :lg="8">
                                            <div style="line-height: 36px; margin-right: 10px">
                                                <el-icon class="el-icon-coral-phone"></el-icon>
                                                <span>{{bill.phone}}</span>
                                            </div>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="6" :lg="8">
                                            <div style="line-height: 36px">
                                                <el-icon class="el-icon-coral-time"></el-icon>
                                                <span>{{bill.effort_date}}</span>
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
                                <div class="bill-details">
                                    <div v-html="bill.description"></div>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item title="出单明细" name="billDetails">
                                <el-row class="ency-table-container">
                                    <el-col :xs="24" :sm="24" :md="24" :lg="12">
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
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="24" :lg="12">
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
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-card>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6">
            <div style="padding: 10px;">
                <el-card class="card-container">
                    <div slot="header" class="clear-fix card-header">
                        <div style="line-height: 36px;">
                            <el-icon class="el-icon-coral-group_fill"></el-icon>
                            <span class="group-name">我要开团</span>
                        </div>
                    </div>
                    <div class="form-container">
                        <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                            <el-form-item label="私密单" v-if="currentUser.type!=='yy'">
                                <el-checkbox v-model="isPrivate">是否为私密单</el-checkbox>
                            </el-form-item>
                            <el-form-item label="团购名" prop="name">
                                <el-input placeholder="请输入团购名" v-model="addForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="联系人姓名" prop="contacts">
                                <el-input placeholder="请输入联系人姓名" v-model="addForm.contacts"></el-input>
                            </el-form-item>
                            <el-form-item label="联系人手机" prop="phone">
                                <el-input placeholder="请输入联系人手机" :maxlength="11" v-model="addForm.phone"></el-input>
                            </el-form-item>
                            <el-form-item label="开团城市" prop="city" v-if="currentUser.type!=='cjlss'">
                                <el-select placeholder="请选择城市" v-model="addForm.city">
                                    <el-option
                                            v-for="item in cities" :label="item.value" :value="item.key"
                                            :key="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="截止时间" prop="end_date">
                                <el-date-picker
                                        type="datetime"
                                        placeholder="请选择截止时间"
                                        :editable="false"
                                        :picker-options="pickerOptions"
                                        v-model="addForm.end_date"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="运费(%)" prop="freight">
                                <el-input-number placeholder="请输入运费(%)" v-model="addForm.freight"></el-input-number>
                            </el-form-item>
                            <el-form-item label="单品运费封顶" prop="hasTop">
                                <el-switch on-text="是" off-text="否" v-model="addForm.hasTop"></el-switch>
                            </el-form-item>
                            <el-form-item  v-if="addForm.hasTop" label="单品运费封顶额(元)" prop="top_freight">
                                <el-input-number placeholder="请输入单品运费封顶额(元)" v-model="addForm.top_freight"></el-input-number>
                            </el-form-item>
                            <el-form-item label="其他信息" prop="description">
                                <quill-editor v-model="addForm.description" ref="myQuillEditor"
                                              class="editor" :options="editorOption">
                                </quill-editor>
                            </el-form-item>
                            <el-form-item v-if="!isExpand" style="text-align: right; margin-top: 100px">
                                <a href="javascript: void (0);" @click="toggleExpand">
                                    <i class="el-icon-coral-unfold"></i>展开
                                </a>
                            </el-form-item>
                            <el-form-item label="收货日期" prop="pickup_date" v-if="isExpand" style="margin-top: 120px">
                                <el-date-picker
                                        type="date"
                                        placeholder="请选择收货日期"
                                        :editable="false"
                                        :picker-options="pickerOptions"
                                        v-model="addForm.pickup_date"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="收货地址" prop="pickup_address" v-if="isExpand">
                                <el-input placeholder="请输入出收货地址" v-model="addForm.pickup_address"></el-input>
                            </el-form-item>
                            <el-form-item label="支付类型" prop="pay_type" v-if="isExpand">
                                <el-select placeholder="请选择支付类型" v-model="addForm.pay_type">
                                    <el-option v-for="item in payTypes" :label="item.name" :value="item.code" :key="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="支付账号名" prop="pay_name" v-if="isExpand">
                                <el-input placeholder="请输入出支付账号名" v-model="addForm.pay_name"></el-input>
                            </el-form-item>
                            <el-form-item label="支付账号名" prop="pay_count" v-if="isExpand">
                                <el-input placeholder="请输入出支付账号名" v-model="addForm.pay_count"></el-input>
                            </el-form-item>
                            <el-form-item label="支付描述" prop="pay_description" v-if="isExpand">
                                <el-input type="textarea" placeholder="请输入支付描述" v-model="addForm.pay_description"></el-input>
                            </el-form-item>
                            <el-form-item label="是否支持闪送" prop="is_flash" v-if="isExpand">
                                <el-select placeholder="请选择是否闪送" v-model="addForm.is_flash">
                                    <el-option v-for="item in yesOrNo" :label="item.name" :value="item.code" :key="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="闪送描述" prop="flash_desc" v-if="isExpand">
                                <el-input type="textarea" placeholder="请输入闪送描述" v-model="addForm.flash_desc"></el-input>
                            </el-form-item>
                            <el-form-item v-if="isExpand" style="text-align: right">
                                <a href="javascript: void (0);" @click="toggleExpand">
                                    <i class="el-icon-coral-fold"></i>收起
                                </a>
                            </el-form-item>
                            <el-form-item class="submit-button">
                                <el-button type="primary" icon="coral-add" @click="submit">立即开团</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </div>
        </el-col>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less">
    .group-add-container {
        .card-container {
            &.main-card {
                .el-card__body {
                    padding: 0;
                }
            }
            .el-radio {
                margin-bottom: 0;
                margin-top: 0;
            }
            .el-card__header {
                padding: 10px 20px;
            }
            .el-card__body {
                padding: 10px;
            }
            .editor {
                height: 150px;
            }
            .el-date-editor {
                width: 100%;
            }
            .el-collapse {
                border: none;
            }
            .quill-editor + .el-form-item__error {
                top: 240px;
            }
            .ency-table-container {
                padding-bottom: 10px;
                th, td, tr {
                    padding: 0;
                    vertical-align: middle;
                }
                .name-field {
                    padding-left: 10px;
                }
                .action-field {
                    text-align: center;
                }
                .table {
                    margin: 0 5px;
                }
            }
            .card-header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .el-icon-coral-edit, .el-icon-coral-group_fill {
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
            .card-item {
                padding: 10px 0;
                font-size: 14px;
            }
            .group-name {
                font-size: 16px;
                font-weight: bold;
            }
            .bill-details {
                padding: 10px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .detail-name-button {
                border: none;
                background: transparent;
            }
            .submit-button {
                .el-form-item__content {
                    margin-left: 0 !important;
                }
                .el-button {
                    width: 100%;
                    background: #f5a623;
                    border: none;
                }
            }
        }

        .form-container {
            .el-select {
                width: 100%;
            }
        }
    }
</style>
