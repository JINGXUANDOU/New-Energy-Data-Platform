<template>
    <div class="home-content">
        <map-chart ref="myMap">
            <template v-slot:topBox>
                <i class="el-icon-location el-icon--left"></i>
                <el-dropdown size="medium" trigger="click"
                             style="margin:0 20px 0 4px;"
                             @command="handleCommand">
                  <span class="el-dropdown-link">
                    {{ currentStationName }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in stationArr"
                                          :key="index"
                                          :command="item">
                            {{ item.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" @click="gotoStation"
                           style="width: 100px;height: 24px;line-height: 24px;padding: 0 12px;margin: 0;">>>进入电站
                </el-button>
            </template>
        </map-chart>
        <div class="left-box">
            <div class="over-content">
                <div class="brand-item station-num-bg">
                    <div class="item-label" style="font-size: 16px;padding-left: 64px;">电站数量</div>
                    <div class="item-value" style="font-size: 18px;padding-left: 70px;">{{
                            brandInfo.stationTotalNum
                        }}
                    </div>
                </div>
                <div class="brand-item install-cap-bg">
                    <div class="item-label" style="font-size: 16px;padding-left: 64px;">总装机容量</div>
                    <div class="item-value" style="font-size: 16px;padding-left: 64px;">{{
                            brandInfo.installTotalCap
                        }}
                    </div>
                </div>
            </div>

            <div class="ele-content">
                <div class="brand-item day-bg">
                    <div class="item-label">日发电量</div>
                    <div class="item-value">{{ brandInfo.dayEle }}</div>
                </div>
                <div class="brand-item month-bg">
                    <div class="item-label">月发电量</div>
                    <div class="item-value">{{ brandInfo.monthEle }}</div>
                </div>
                <div class="brand-item year-bg">
                    <div class="item-label">年发电量</div>
                    <div class="item-value">{{ brandInfo.yearEle }}</div>
                </div>
            </div>
            <div class="brand-content">
                <div class="brand-item total-bg">
                    <div class="item-label">总发电量</div>
                    <div class="item-value">{{ brandInfo.connectCap }}</div>
                </div>
                <div class="brand-item coal-bg">
                    <div class="item-label">节约标准煤</div>
                    <div class="item-value">{{ brandInfo.thriftCoal }}</div>
                </div>
                <div class="brand-item co2-bg">
                    <div class="item-label">减排CO2</div>
                    <div class="item-value">{{ brandInfo.reduceCO2 }}</div>
                </div>
            </div>
            <div ref="leftLine1" style="width: 100%;height: 35%;">发电趋势</div>
            <div ref="leftBar1" style="width: 100%;height: 35%;">发电量TOP10</div>
        </div>
        <div class="right-box">
            <div ref="rightPie1" style="width: 100%;height: 33%;">发电趋势</div>
            <div ref="rightLine1" style="width: 100%;height: 33%;">发电量TOP10</div>
            <div style="width: 100%;height: 33%;">
                <el-tabs class="alarm-content">
                    <el-tab-pane label="实时故障/报警/事件" style="height: 100%;">
                        <el-table :data="alarmTableList" height="100%"
                                  class="table_dark" stripe
                                  style="width: 100%;height: 100%;overflow: auto;">
                            <el-table-column align="center" prop="alarmDesc" min-width="30%"
                                             label="告警内容"></el-table-column>
                            <!--                            <el-table-column align="center" prop="subName" label="场站名称"></el-table-column>-->
                            <el-table-column align="center" prop="deviceAlias" min-width="70%"
                                             label="设备名称"></el-table-column>
                            <el-table-column align="center" prop="alarmTime" width="140px"
                                             label="开始时间"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>

    </div>
</template>

<script>
import mapChart from '@/components/MapChart';
import {
    getAlarmByAllStation,
    getEffectiveByCap,
    getElectricTop,
    getInstallCapRate,
    getPowerByTime,
    getStationBrand, getStationPosition
} from '@/http/api/pvManage';

let lineOption = {
    title: {
        text: '实时功率',
        left: '12',
        top: '6%',
        textStyle: {
            color: '#EEF1FA'
        }
    },
    darkMode: true,
    color: ['#1EE7E7', '#64E579', '#ED9A34', '#F6FF00', '#AE54FD', '#0099FF', '#BEE5FB', '#004CFF'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    grid: {
        top: '20%',
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true
    },
    legend: {
        textStyle: {
            color: '#fff'
        },
        show: false,
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        // icon: 'diamond',
        itemGap: 4,
        itemWidth: 12,
        itemHeight: 12
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            axisLabel: {
                color: '#fff'
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#BAE7FF'
                }
            },
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
        }
    ],
    yAxis: [
        {
            name: '',
            nameLocation: 'end',
            nameTextStyle: {
                color: '#ffffff',
                padding: [22, 36, 0, 12]
            },
            type: 'value',

            axisLabel: {
                color: '#ffffff'
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            }
        }
    ],
    series: [
        {
            name: '实时功率',
            type: 'line',
            smooth: true,
            // stack:'total',
            showSymbol: true,
            symbol: 'circle',
            itemStyle: {
                borderColor: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.5,
                    colorStops: [
                        {offset: 0, color: 'rgba(5,154,244,1)'},
                        {offset: 1, color: 'rgba(22,117,205,0)'}
                    ],
                    globalCoord: true // 缺省为 false
                },
                borderWidth: '12'
            },
            lineStyle: {
                width: '1'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#0a1f50' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#00447A' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            },
            emphasis: {
                focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
            // markPoint: {
            //     data: [
            //         {type: 'max', name: '最大值'}
            //     ]
            // }
        }
    ]
};
let topOption = {
    darkMode: true,
    title: {
        text: '发电量TOP10',
        left: '12',
        top: '6px',
        textStyle: {
            color: '#fff'
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // Use axis to trigger tooltip
            type: 'line' // 'shadow' as default; can also be 'line' or 'shadow'
        }
    },
    grid: {
        top: '12%',
        left: '3%',
        right: '8%',
        bottom: '2',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        show: false,
        splitLine: {
            show: false
        },
        barStyle: {},
        axisTick: {
            show: false
        },
        axisLabel: {
            verticalAlign: 'top',
            color: '#fff',
            show: true
        }
    },
    yAxis: [{
        type: 'category',
        inverse: true,
        axisLabel: {
            color: '#fff',
            textAlign: 'center'
        },
        position: 'left',
        axisTick: { // y轴刻度线
            'show': false
        },
        axisLine: { // y轴
            'show': false
        },
        data: ['1号分布式光伏子站', '2号分布式光伏子站', '3号分布式光伏子站', '4号分布式光伏子站', '5号分布式光伏子站']
    }],
    series: [
        {
            name: '发电量',
            type: 'bar',
            stack: 'total',
            label: {
                normal: {
                    color: '#fff',
                    show: true,
                    position: 'right',
                    textStyle: {
                        fontSize: 12
                    }
                }
            },
            emphasis: {
                focus: 'series'
            },
            barWidth: 8,
            barCategoryGap: '80%',
            itemStyle: {
                barBorderRadius: [0, 0, 0, 0],
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0, color: '#1EE7E7' // 0% 处的颜色
                    }, {
                        offset: 0.98, color: '#1890FF' // 100% 处的颜色
                    }, {
                        offset: 1, color: '#fff' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            },
            showBackground: true,
            backgroundStyle: {
                color: '#26425d'
            },
            data: [1213, 823, 623, 522, 311, 111]
        }
    ]
};
let pieOption = {
    color: ['#64E579', '#1EE7E7', '#ED9A34', '#F6FF00', '#AE54FD', '#0099FF', '#BEE5FB', '#004CFF'],
    tooltip: {
        trigger: 'item'
    },
    title: {
        text: '装机容量分布',
        left: '12',
        top: '6px',
        textStyle: {
            color: '#EEF1FA'
        }
    },
    grid: {
        top: '12%',
        left: '3%',
        right: '8%',
        bottom: '2',
        containLabel: true
    },
    legend: {
        align: 'right',
        orient: 'vertical',
        right: '10',
        top: 'center',
        itemGap: 12,
        textStyle: {
            color: '#fff'
        }
    },
    series: [
        {
            name: '站装机容量分类统计',
            type: 'pie',
            radius: ['0%', '56%'],
            center: ['38%', '50%'],
            avoidLabelOverlap: true,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: true
                // position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    // fontSize: 28,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: true
            },
            data: [
                {value: 1, name: '<1MW'},
                {value: 1, name: '1~5MW'},
                {value: 2, name: '5~20MW'},
                {value: 1, name: '>20MW'}
            ]
        }
    ]
};
let barOption = {
    darkMode: true,
    title: {
        text: '场站能效利用率',
        left: '12',
        top: '0',
        textStyle: {
            color: '#EEF1FA'
        }
    },
    color: ['#ED9A34', '#0099FF', '#BEE5FB', '#004CFF'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    grid: {
        top: '20%',
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            axisLabel: {
                color: '#fff'
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#BAE7FF'
                }
            },
            data: ['<1MW', '1~5MW', '5~20MW', '>20MW']
        }
    ],
    yAxis: [
        {
            // name: '发电量',
            // nameLocation: 'end',
            // nameTextStyle: {
            //     color: '#ffffff',
            //     padding: [22, 36, 2, 12]
            // },
            type: 'value',
            min: 0,
            max: 1.6,
            interval: 0.4,
            axisLabel: {
                color: '#ffffff'

            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            }
        }
    ],
    series: [
        {
            name: '能效利用率',
            type: 'bar',
            stack: 'rate',
            showSymbol: false,
            data: [0.5, 0.8, 0.6, 0.64],
            barGap: '20%',
            barWidth: '33%',
            showBackground: true,
            backgroundStyle: {
                color: '#1C2438'
            },
            itemStyle: {
                borderRadius: ['25%', '25%', 0, 0]
            },
            markLine: {
                data: [{
                    name: 'Y 轴值为1 的水平线',
                    yAxis: 1
                }]
            }
        }
    ]
};
export default {
    name: 'homePanel',
    components: {mapChart},
    props: [],
    inject: ['stationList'],
    computed: {},
    data() {
        return {
            systemName: '',
            brandInfo: {
                stationTotalNum: 0, // 电站个数
                dayEle: '0.00', // 日发电量
                monthEle: '0.00', // 月发电量
                yearEle: '0.00', // 年发电量
                totalEle: '', // 总发电量
                realtimePower: '', // 实时功率
                installTotalCap: '', // 总装机容量
                connectCap: '', // 总发电量（并网电量）
                thriftCoal: '', // 节约标准煤
                reduceCO2: '' // 减排CO2
            },
            leftLine1: null,
            leftBar1: null,
            rightPie1: null,
            rightLine1: null,
            alarmTableList: [],

            stationArr: [],
            currentStationId: 1,
            currentStationName: ''
        }
    },
    mounted() {
        window.onresize = () => {
            this.$nextTick(_ => {
                this.leftLine1 && this.leftLine1.resize();
                this.leftBar1 && this.leftBar1.resize();
                this.rightPie1 && this.rightPie1.resize();
                this.rightLine1 && this.rightLine1.resize();

                this.$refs.myMap && this.$refs.myMap.mapChart && this.$refs.myMap.mapChart.resize();
            })
        }
        this.$nextTick(() => {

            this.leftLine1 = this.$echarts.init(this.$refs.leftLine1); // 左侧柱状图实例
            this.leftBar1 = this.$echarts.init(this.$refs.leftBar1); // 左侧柱状图实例
            this.rightPie1 = this.$echarts.init(this.$refs.rightPie1); // 右侧柱状图实例
            this.rightLine1 = this.$echarts.init(this.$refs.rightLine1); // 右侧线图实例

            this.leftLine1.setOption(lineOption)
            this.leftBar1.setOption(topOption)
            this.rightPie1.setOption(pieOption)
            this.rightLine1.setOption(barOption)
            this.pageInit()
        })
    },
    beforeDestroy() {
        window.onresize = null;
        this.leftLine1 && this.leftLine1.dispose();
        this.leftBar1 && this.leftBar1.dispose();
        this.rightPie1 && this.rightPie1.dispose();
        this.rightLine1 && this.rightLine1.dispose();
    },
    destroyed() {

    },
    methods: {
        pageInit() {
            this.systemName = sessionStorage.getItem('sysName')
            this.stationArr = this.stationList
            let stationNameArr = this.stationArr.map(item => item.name)
            // 获取概览信息
            this.getOverData(stationNameArr)
            // 获取图表数据
            this.getChartData(stationNameArr)

            this.currentStationId = sessionStorage.getItem('stationID')
            this.currentStationName = sessionStorage.getItem('stationName')
            // 获取地图数据
            this.getMapData(stationNameArr)
            // 获取告警数据
            this.getAlarmData(stationNameArr)
        },
        /**
         * 获取概览数据
         */
        getOverData() {
            this.brandInfo.stationTotalNum = this.stationList.length
            getStationBrand({
                prefix: this.systemName,
                suffixes: '总装机容量,日发电量,月发电量,年发电量,总发电量,实时功率,节约标准煤,减排CO2'
            }).then(res => {
                this.brandInfo.dayEle = res.data['日发电量']
                this.brandInfo.monthEle = res.data['月发电量']
                this.brandInfo.yearEle = res.data['年发电量']
                this.brandInfo.totalEle = res.data['总发电量']
                this.brandInfo.realtimePower = res.data['实时功率']
                this.brandInfo.installTotalCap = res.data['总装机容量']
                this.brandInfo.connectCap = res.data['总发电量']
                this.brandInfo.thriftCoal = res.data['节约标准煤']
                this.brandInfo.reduceCO2 = res.data['减排CO2']
            })
        },
        /**
         * 获取图表数据
         */
        getChartData(stationNameArr) {
            // getPowerByTime({
            //
            // }).then(res=>{
            //
            // })

            getElectricTop(stationNameArr).then(res => {
                let arrName = []
                let arrValue = []
                let arr = []
                Object.keys(res.data).forEach(key => {
                    arr.push({station: key, value: res.data[key]})
                })
                arr.sort((a, b) => {
                    return b.value - a.value
                })
                arrName = arr.map(item => item.station)
                arrValue = arr.map(item => item.value)
                let opt = this.leftBar1.getOption()
                opt.yAxis[0].data = arrName
                opt.series[0].data = arrValue
                this.leftBar1.setOption(opt)
            })

            getInstallCapRate(stationNameArr).then(res => {
                let arr = []
                res.data.forEach(item => {
                    arr.push({
                        value: item.value,
                        name: item.type
                    })
                })
                let opt = this.rightPie1.getOption()
                opt.series[0].data = arr
                this.rightPie1.setOption(opt)
            })

            getEffectiveByCap(stationNameArr).then(res => {
                let arrName = []
                let arrValue = []
                let arr = []
                res.data.forEach(item => {
                    arr.push({
                        value: item.value,
                        name: item.type
                    })
                    arrName.push(item.type)
                    arrValue.push(item.value)
                })
                let opt = this.rightLine1.getOption()
                opt.yAxis[0].data = arrName
                opt.series[0].data = arrValue
                this.rightLine1.setOption(opt)
            })
        },
        /**
         * 获取地图 各市 光伏站
         */
        getMapData(stationNameArr) {
            this.dataList = []
            getStationPosition(stationNameArr).then(res => {
                Object.keys(res.data).forEach(key => {
                    let positinoArr = res.data[key].split(',')
                    if (positinoArr.length == 2) {
                        this.dataList.push([positinoArr[0], positinoArr[1], key]) //positinoArr.concat[key]
                    }
                })
                this.$refs.myMap && this.$refs.myMap.initMapData(this.dataList, this.params)
            }).catch(err => {
                this.dataList = [
                    [113.081302, 33.888367, '1号分布式光伏子站'],
                    [113.235904, 33.972703, '2号分布式光伏子站'],
                    [113.373758, 33.609687, '3号分布式光伏子站'],
                    [112.829045, 34.177623, '4号分布式光伏子站'],
                    [112.866401, 33.907926, '5号分布式光伏子站']
                ];
                this.$refs.myMap && this.$refs.myMap.initMapData(this.dataList, this.params)
            })
        },
        getAlarmData(stationNameArr) {
            this.alarmTableList = []
            getAlarmByAllStation(stationNameArr).then(res => {
                this.alarmTableList = res.data
            })
        },
        handleCommand(stationObj) {
            sessionStorage.setItem('stationID', stationObj.id)
            sessionStorage.setItem('stationName', stationObj.name)
            this.currentStationId = sessionStorage.getItem('stationID')
            this.currentStationName = sessionStorage.getItem('stationName')
            this.$bus.$emit('changeStation')
        },
        gotoStation() {
            this.$router.push({
                name: 'stationPage'
            })
            this.$emit('gotoStation')
        }
    }
}
</script>

<style scoped lang="less">
.home-content {
    position: relative;
    height: 100%;
    width: 100%;
    border: 1px solid #155E9C;
    color: #fff;

    .left-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 28%;
        height: 100%;

        .over-content {
            width: 100%;
            height: 10%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: linear-gradient(90deg, rgba(1, 214, 248, 0.22) 0%, rgba(1, 214, 248, 0.08) 49%, rgba(1, 214, 248, 0.22) 100%);;
        }

        .ele-content {
            height: 8%;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }

        .brand-content {
            height: 10%;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }

        .brand-item {
            width: 170px;
            height: 50px;

            .item-label {
                padding-left: 56px;
                height: 28px;
                line-height: 28px;
            }

            .item-value {
                padding-left: 56px;
                height: 20px;
                line-height: 20px;
                color: #3ae4ef;
                font-family: 思源黑体;
                font-size: 14px;
                font-weight: 500;
            }
        }

        .station-num-bg {
            background: url("~@/assets/pv/brand_stationNum.png") center center no-repeat;
            background-size: 100% 100%;
        }

        .install-cap-bg {
            background: url("~@/assets/pv/brand_install_cap.png") center center no-repeat;
            background-size: 100% 100%;
        }

        .day-bg {
            background: url("~@/assets/pv/brand_dayEle.png") center center no-repeat;
            background-size: 100% 100%;
        }

        .month-bg {
            background: url("~@/assets/pv/brand_monthEle.png") center center no-repeat;
            background-size: 100% 100%;
        }

        .year-bg {
            background: url("~@/assets/pv/brand_yearEle.png") center center no-repeat;
            background-size: 100% 100%;
        }

        .total-bg {
            background: url("~@/assets/pv/brand_total.png") center center no-repeat;
            background-size: 100% 100%;
        }

        .coal-bg {
            background: url("~@/assets/pv/brand_coal.png") center center no-repeat;
            background-size: 100% 100%;
        }

        .co2-bg {
            background: url("~@/assets/pv/brand_co2.png") center center no-repeat;
            background-size: 100% 100%;
        }
    }

    .right-box {
        position: absolute;
        top: 0;
        right: 0;
        width: 26%;
        height: 100%;

        .alarm-content {
            height: 100%;
            width: calc(100% - 6px);
        }
    }

    /deep/ .el-tabs__content {
        padding: 0;
        height: calc(100% - 40px);
        border: 1px solid #00CFFE;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #fff;
        font-weight: bold;
        letter-spacing: 2px;
        font-size: 16px;
    }

    .el-icon-arrow-down {
        font-size: 14px;
    }
}

</style>
