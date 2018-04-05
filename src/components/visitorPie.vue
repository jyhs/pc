<template>
    <div class="visitor_pie">
        <div id="visitor_pie" class="" style="width: 90%;height:450px;"></div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import echarts from 'echarts/lib/echarts';
    import 'echarts/lib/chart/pie';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/legend';
    import 'echarts/lib/component/tooltip';

    export default {
        data() {
            return {
                users: [],
                provinces: []
            }
        },

        created() {
            this.initData();
        },

        mounted(){
            this.myChart = echarts.init(document.getElementById('visitor_pie'), {});
        },

        methods: {
            ...mapActions(['loading', 'getProvinces', 'getUserList']),

            async initData() {
                this.loading(true);
                let pieData = [];
                let legendData = [];
                try {
                    this.users = (await this.getUserList({
                        page: 1,
                        size: 10000
                    }))['users'];
                    this.provinces = await this.getProvinces();
                    [pieData,legendData]  = this.generatePieData();
                } catch (error) {
                    console.error(error);
                }
                this.loading(false);

                const option = {
                    title : {
                        text: '用户分布',
                        subtext: '',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: legendData
                    },
                    series : [
                        {
                            name: '用户所在地',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data: pieData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };

                this.myChart.setOption(option);
            },

            generatePieData () {
                const calculate = {};
                const pieData = [];
                const legendData = [];

                for (let user of this.users) {
                    if (calculate[user.province]) {
                        calculate[user.province].value++;
                    } else {
                        calculate[user.province] = {};
                        calculate[user.province].value = 1;
                    }
                }

                for (let key in calculate) {
                    for (let provinces of this.provinces) {
                        if (provinces.key === key) {
                            pieData.push({
                                name: provinces.value,
                                value: calculate[key].value
                            });
                            legendData.push(provinces.value);
                            break;
                        }
                    }
                }

                return [pieData, legendData];
            }
        }
    }
</script>

<style lang="less">
	@import '../style/mixin';
    .visitor_pie{
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
</style>
