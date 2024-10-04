<!--
*@overview
*@author whl
*@date 2024/5/13 10:49
-->
<template>
    <div class="monitor-panel">
        <div class="main-content">
            <div class="top-row">
                <div class="station-base">
                    <div style="width: 100%;height:320px;">
                        <video-player></video-player>
                    </div>
                    <div class="base-row">
                        <div class="base-item"><span>电站并网时间：</span>{{ currentSubstation.stationInfo.incorporationTime }}
                        </div>
                        <div class="base-item"><span>当前电价（元/kwh）：</span>{{ currentSubstation.stationInfo.volatgePrice }}
                        </div>
                    </div>
                    <div class="base-row">
                        <div class="base-item"><span>运维负责人：</span>{{ currentSubstation.stationInfo.principalPeople }}
                        </div>
                        <div class="base-item"><span>运维负责人联系方式：</span>{{ currentSubstation.stationInfo.iphone }}</div>
                    </div>
                </div>
                <div class="station-total">
                    <div class="brand-content">
                        <div class="brand-item day-bg">
                            <div class="item-label">日发电量</div>
                            <div class="item-value">{{ brandInfo.dayEle }}</div>
                        </div>
                        <div class="brand-item total-bg">
                            <div class="item-label">累计发电量</div>
                            <div class="item-value">{{ brandInfo.totalEle }}</div>
                        </div>
                        <div class="brand-item realtime-bg">
                            <div class="item-label">实时功率</div>
                            <div class="item-value">{{ brandInfo.realtimePower }}</div>
                        </div>
                        <div class="brand-item install-cap-bg">
                            <div class="item-label">装机容量</div>
                            <div class="item-value">{{ brandInfo.installCap }}</div>
                        </div>
                    </div>
                    <div class="device-state-space">
                        <div ref="stationDev1" style="width: 100%;height: 100%;">逆变器状态</div>
                        <div ref="stationDev2" style="width: 100%;height: 100%;">电表状态</div>
                    </div>
                </div>
                <div class="station-generation">
                    <div ref="stationG" style="width: 100%;height: 100%">发电量</div>
                </div>
            </div>
            <el-row style="width: 100%;height: 50%;border: 1px solid #19474D">
                <div style="padding: 2px;position:relative;">
                    <el-button-group>
                        <el-button @click="changeChart(1,'整站功率')">整站功率</el-button>
                        <el-button @click="changeChart(1,'逆变器功率')">逆变器功率</el-button>
                        <el-button @click="changeChart(1,'日发电量')">日发电量</el-button>
                        <el-button @click="changeChart(1,'月发电量')">月发电量</el-button>
                        <el-button @click="changeChart(1,'年发电量')">年发电量</el-button>
                        <el-button @click="changeChart(1,'总发电量')">总发电量</el-button>
                    </el-button-group>
                    <div
                        style="position: absolute;top: 0;right: 22px;display: flex;vertical-align: middle;align-items: center;gap:6px;">
                        <span>时间：</span>
                        <el-date-picker
                            v-model="times"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <!--                        <el-button type="primary" @click="onReport">导出</el-button>-->
                    </div>
                </div>
                <div style="width: 100%;height: calc(100% - 32px);">
                    <div v-if="activeChart==1" ref="stationP" class="chart-div"></div>
                    <div v-else-if="activeChart==2" ref="devP" class="chart-div"></div>
                    <div v-else-if="activeChart==3" ref="dayP" class="chart-div"></div>
                    <div v-else-if="activeChart==4" ref="monthP" class="chart-div"></div>
                    <div v-else-if="activeChart==5" ref="yearP" class="chart-div"></div>
                    <div v-else-if="activeChart==6" ref="totalP" class="chart-div"></div>
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>
import videoPlayer from '@/components/videoComp/videoPlayer';

let option = {
    title: {
        text: '整站功率趋势',
        left: 'center',
        textStyle: {
            color: '#EEF1FA',
            fontSize: 16,
            fontWeight: 'bold'
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
        top: '8%',
        left: '2%',
        right: '4%',
        bottom: '8%',
        containLabel: true
    },
    legend: {
        textStyle: {
            color: '#fff'
        },
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
            name: '整站功率',
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
let barOption = {
    darkMode: true,
    color: ['#1EE7E7', '#AE54FD', '#F6FF00', '#64E579', '#ED9A34', '#0099FF', '#BEE5FB', '#004CFF'],
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
        top: '8%',
        left: '2%',
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
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
        }
    ],
    yAxis: [
        {
            name: '发电量',
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
        },
        {
            name: '收入',
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
            name: '发电量',
            type: 'bar',
            stack: 'Total1',
            yAxisIndex: 0,
            showSymbol: false,
            data: [222, 123, 125, 212, 123, 121, 233],
            barGap: '0',
            itemStyle: {
                borderColor: '#1C2438',
                borderWidth: 4
            },
            showBackground: true,
            backgroundStyle: {
                color: '#1C2438'
            }
        },
        {
            name: '电价',
            type: 'bar',
            stack: 'TotalBlue',
            yAxisIndex: 1,
            showSymbol: false,
            data: [382, 312, 223, 371, 299, 312, 492],
            barGap: '0',
            itemStyle: {
                borderColor: '#1C2438'
                // borderWidth: 4
            },
            showBackground: true,
            backgroundStyle: {
                color: '#1C2438'
            }
        }
    ]
};
let pieOption = {
    color: ['#64E579', '#1EE7E7', '#ED9A34', '#F6FF00', '#AE54FD', '#0099FF', '#BEE5FB', '#004CFF'],
    tooltip: {
        trigger: 'item'
    },
    title: {
        text: '电表状态',
        left: '2',
        top: '12',
        textStyle: {
            color: '#EEF1FA',
            fontSize: 16,
            fontWeight: 'bold'
        }
    },
    legend: {
        textStyle: {
            color: '#fff'
        },
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        // icon: 'diamond',
        itemGap: 4,
        itemWidth: 12,
        itemHeight: 12
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['32%', '60%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 28,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 1048, name: '正常'},
                {value: 735, name: '检修'},
                {value: 580, name: '故障'},
                {value: 484, name: '其他'}
            ]
        }
    ]
};
export default {
    name: 'Overview',
    components: {videoPlayer},
    inject: ['stationList'],
    props: [],
    data() {
        return {
            activeChart: 1,
            activeChartTitle: '整站功率',
            currentStationID: sessionStorage.stationID,
            currentSubstation: {
                name: '',
                stationInfo: {
                    incorporationTime: '',
                    volatgePrice: '',
                    principalPeople: '',
                    iphone: ''
                }
            },
            stationArr: [],
            brandInfo: {
                dayEle: '0.00',
                totalEle: '',
                realtimePower: '',
                installCap: '',
                connectCap: ''
            },
            pie1Chart: null,
            rightBarChart: null,
            bottomLineChart: null,
            times: '',
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            dateType: 'daterange',
            dateFormat: 'yyyy-MM-dd',
            dateRangeArr: {
                'hour': ['datetimerange', 'yyyy-MM-dd HH'],
                'day': ['daterange', 'yyyy-MM-dd'],
                'month': ['monthrange', 'yyyy-MM'],
                'year': ['yearrange', 'yyyy']
            }
        }
    },
    // 计算属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.$bus.$on('changeStation', this.pageInit)
        this.pageInit()
        this.$nextTick(_ => {
            this.pie1Chart = this.$echarts.init(this.$refs.stationDev1); // 右侧柱状图实例
            this.pie2Chart = this.$echarts.init(this.$refs.stationDev2); // 右侧柱状图实例
            this.rightBarChart = this.$echarts.init(this.$refs.stationG); // 右侧柱状图实例
            this.bottomLineChart = this.$echarts.init(this.$refs.stationP); // 底部折线图实例

            this.pie1Chart.setOption(pieOption)
            pieOption.title.text = '光伏运行状态'
            this.pie2Chart.setOption(pieOption)
            this.rightBarChart.setOption(barOption)
            this.bottomLineChart.setOption(option)

            this.initChartData()
        })
        window.onresize = () => {
            this.$nextTick(_ => {
                this.pie1Chart && this.pie1Chart.resize();
                this.pie2Chart && this.pie2Chart.resize();
                this.rightBarChart && this.rightBarChart.resize();
                this.bottomLineChart && this.bottomLineChart.resize();
            })
        }
    },
    beforeDestroy() {
        this.$bus.$off('changeStation')
        window.onresize = null;
        this.pie1Chart && this.pie1Chart.dispose();
        this.pie2Chart && this.pie2Chart.dispose();
        this.rightBarChart && this.rightBarChart.dispose();
        this.bottomLineChart && this.bottomLineChart.dispose();
    },
    // 方法集合
    methods: {
        pageInit(params) {
            this.currentStationID = sessionStorage.getItem('stationID')
            this.currentSubstation = this.stationList.find(station => station.id == this.currentStationID)

            // 获取概览信息
            this.getOverData()
        },
        getOverData() {
            this.$http.windGet('/apis/standard-data/getStationValue', {
                prefix: this.currentSubstation.name,
                suffixes: '装机容量,日发电量,累计发电量,实时功率'
            }).then(res => {
                this.brandInfo.dayEle = res.data['日发电量']
                // this.brandInfo.monthEle = res.data['月发电量']
                // this.brandInfo.yearEle = res.data['年发电量']
                this.brandInfo.totalEle = res.data['累计发电量']
                this.brandInfo.realtimePower = res.data['实时功率']
                this.brandInfo.installCap = res.data['装机容量']
            })
        },
        initChartData() {
            // this.getRightBarData()
            // this.getbottomlineData()
            // this.getMiddlePieData()
            // this.getRightBarData()
        },
        changeChart(activeVal, label) {
            this.activeChart = activeVal
            this.activeChartTitle = label
            this.getBottomLineData()
        },
        onSubmit() {
            this.getBottomLineData()
        },
        onReport() {

        },
        getMiddlePieData() {
            this.$http.windGet('/apis/v1/home/trend-analysis-carbon-emission-all-country', {
                areaId: this.currentStationID
            }).then(res => {
                let resultData = res.data
                let opt = this.pie1Chart.getOption()
                opt.title[0].text = '电表状态'
                opt.series = [
                    {
                        name: '电表状态',
                        type: 'pie',
                        radius: ['32%', '60%'],
                        avoidLabelOverlap: false,
                        padAngle: 5,
                        itemStyle: {
                            borderRadius: 10
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 28,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: resultData
                    }
                ]
                this.pie1Chart.setOption(opt, {notMerge: true})
            })
            this.$http.windGet('/apis/v1/home/trend-analysis-carbon-emission-all-country', {
                areaId: this.currentStationID
            }).then(res => {
                let resultData = res.data
                let opt = this.pie1Chart.getOption()
                opt.title[0].text = '光伏运行状态'
                opt.series = [
                    {
                        name: '光伏运行状态',
                        type: 'pie',
                        radius: ['32%', '60%'],
                        avoidLabelOverlap: false,
                        padAngle: 5,
                        itemStyle: {
                            borderRadius: 10
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 28,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: resultData
                    }
                ]
                this.pie2Chart.setOption(opt, {notMerge: true})
            })
        },
        getRightBarData() {
            this.$http.windGet('/apis/v1/home/trend-analysis-carbon-emission-all-country', {
                areaId: this.currentStationID
            }).then(res => {
                let resultData = res.data
                let xData = []
                let seriesArr = [] // [{name:'山东省',data:[]},{name:'江苏省',data:[]}]
                let minArr = [] // 找最小值
                let opt = this.rightBarChart.getOption()
                opt.title[0].text = ''
                if (resultData) {
                    resultData.forEach((item, index) => {
                        xData.push(item.xData)
                        for (let key in item) {
                            if (key.indexOf('yData') > -1) {
                                let index = seriesArr.findIndex(item => item.dataType == key)
                                if (index > -1) {
                                    seriesArr[index].value.push(item[key].result)
                                } else {
                                    seriesArr.push({
                                        type: 'line',
                                        dataType: key,
                                        name: item[key].name,
                                        value: [item[key].result]
                                    })
                                }
                            }
                            minArr.push(item[key].result || 0)
                        }
                    })
                }
                // xData = this.dateFormat(xData)
                opt.xAxis[0].data = xData
                opt.xAxis[0].axisLabel.lineHeight = 20
                this.$nextTick(() => {
                    opt.xAxis[0].axisLabel.formatter = (value) => {
                        let line1, line2
                        if (this.tabDate == 'year') {
                            let arr = value.split(' ')
                            let arrYear = arr[0].split('-')
                            line1 = arrYear[1] + '月'
                            line2 = arrYear[0]
                        } else if (this.tabDate == 'month') {
                            let arr = value.split(' ')
                            let arrYear = arr[0].split('-')
                            line1 = arrYear[2] + '日'
                            line2 = arrYear[1] + '月'
                        } else if (this.tabDate == 'day') {
                            let arr = value.split(' ')
                            let arrYear = arr[0].split('-')
                            let arrTime = arr[1].split(':')
                            line1 = arrTime[0] + '时'
                            line2 = arrYear[2] + '日'
                        }
                        return line1 + '\n' + line2
                    }
                })
                opt.yAxis[0].min = parseInt(Math.min(...minArr) * 4 / 5)
                opt.yAxis[0].axisLabel.showMinLabel = false
                opt.yAxis[0].name = 'tCO₂'
                opt.series = []
                seriesArr.forEach(item => {
                    opt.series.push(
                        {
                            name: item.name,
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
                            data: item.value
                            // markPoint: {
                            //     data: [
                            //         {type: 'max', name: '最大值'}
                            //     ]
                            // }
                        }
                    )
                })

                this.rightBarChart.setOption(opt, {notMerge: true})
            })
        },
        getBottomLineData() {
            this.$http.windGet('/apis/standard-data/statistics-semaphore', {
                'calculate': 'SUM',
                'columnName': '',
                'dateTime': '',
                'period': 'MONTH',
                'tableName': '',
                'value': 0,
                'ycId': 0
            }).then(res => {
                let resultData = res.data
                let xData = []
                let seriesArr = [] // [{name:'山东省',data:[]},{name:'江苏省',data:[]}]
                let minArr = [] // 找最小值
                let opt = this.bottomLineChart.getOption()
                opt.title[0].text = this.activeChartTitle
                if (resultData) {
                    resultData.forEach((item, index) => {
                        xData.push(item.xData)
                        for (let key in item) {
                            if (key.indexOf('yData') > -1) {
                                let index = seriesArr.findIndex(item => item.dataType == key)
                                if (index > -1) {
                                    seriesArr[index].value.push(item[key].result)
                                } else {
                                    seriesArr.push({
                                        type: 'line',
                                        dataType: key,
                                        name: item[key].name,
                                        value: [item[key].result]
                                    })
                                }
                            }
                            minArr.push(item[key].result || 0)
                        }
                    })
                }
                // xData = this.dateFormat(xData)
                opt.xAxis[0].data = xData
                opt.xAxis[0].axisLabel.lineHeight = 20
                this.$nextTick(() => {
                    opt.xAxis[0].axisLabel.formatter = (value) => {
                        let line1, line2
                        if (this.tabDate == 'year') {
                            let arr = value.split(' ')
                            let arrYear = arr[0].split('-')
                            line1 = arrYear[1] + '月'
                            line2 = arrYear[0]
                        } else if (this.tabDate == 'month') {
                            let arr = value.split(' ')
                            let arrYear = arr[0].split('-')
                            line1 = arrYear[2] + '日'
                            line2 = arrYear[1] + '月'
                        } else if (this.tabDate == 'day') {
                            let arr = value.split(' ')
                            let arrYear = arr[0].split('-')
                            let arrTime = arr[1].split(':')
                            line1 = arrTime[0] + '时'
                            line2 = arrYear[2] + '日'
                        }
                        return line1 + '\n' + line2
                    }
                })
                opt.yAxis[0].min = parseInt(Math.min(...minArr) * 4 / 5)
                opt.yAxis[0].axisLabel.showMinLabel = false
                opt.yAxis[0].name = 'tCO₂'
                opt.series = []
                seriesArr.forEach(item => {
                    opt.series.push(
                        {
                            name: item.name,
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
                            data: item.value
                            // markPoint: {
                            //     data: [
                            //         {type: 'max', name: '最大值'}
                            //     ]
                            // }
                        }
                    )
                })
                this.bottomLineChart.setOption(opt, {notMerge: true})
            })
        }
    }
};
</script>

<style scoped lang="less">
.monitor-panel {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .main-content {
        margin: 2px 4px;
        width: calc(100% - 12px);
        height: calc(100% - 8px);

        .top-row {
            width: 100%;

            height: 50%;
            min-height: 380px;
            display: inline-flex;

            .station-base {
                width: 560px;
                height: 100%;
                border: 1px solid #19474D;

                .base-row {
                    margin-top: 12px;
                    margin-left: 8px;
                    display: flex;
                    justify-content: flex-start;

                    .base-item {
                        width: 40%;
                        min-width: 210px;
                    }
                }
            }

            .station-total {

                //width: 200px;
                flex: 1;
                height: 100%;
                min-width: 640px;
                border: 1px solid #19474D;

                .brand-content {
                    margin-top: 12px;
                    display: flex;
                    column-gap: 22px;
                    row-gap: 12px;
                    flex-wrap: wrap;

                    .brand-item {
                        width: 240px;
                        height: 50px;

                        .item-label {
                            padding-left: 80px;
                            height: 28px;
                            line-height: 28px;
                        }

                        .item-value {
                            padding-left: 80px;
                            height: 20px;
                            line-height: 20px;
                            color: #3ae4ef;
                            font-family: 思源黑体;
                            font-size: 14px;
                            font-weight: 500;
                        }
                    }

                    .day-bg {
                        background: url("~@/assets/pv/brand_day.png") left center no-repeat;
                        background-size: 80% 100%;
                    }

                    .total-bg {
                        background: url("~@/assets/pv/brand_total.png") left center no-repeat;
                        background-size: 80% 100%;
                    }

                    .realtime-bg {
                        background: url("~@/assets/pv/brand_realtime.png") left center no-repeat;
                        background-size: 80% 100%;
                    }

                    .install-cap-bg {
                        background: url("~@/assets/pv/brand_install_cap2.png") left center no-repeat;
                        background-size: 80% 100%;
                    }

                }

                .device-state-space {
                    width: 100%;
                    height: calc(100% - 120px);
                    display: flex;
                }

            }

            .station-generation {
                flex: 1;
                height: 100%;
                border: 1px solid #19474D;
            }
        }

        .chart-div {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
