<template>
    <div class="map-content" style="position:relative;width: 100%;height: 100%;">
        <div ref="chinaMap" style="width: 100%;height: 100%;"></div>
        <div class="location-space">
            <slot name="topBox">
                <!-- 自定义内容 -->
            </slot>
        </div>

    </div>
</template>

<script>
import echart from 'echarts'
import henanGeoData from '@/assets/mapData/henan.json';

export default {
    name: 'MapChart',
    components: {},
    props: [],
    data() {
        return {
            myChart: null,
            dataList: [],
            isChinaFlag: true,
            tempDatalist: [],
            checkList: ['1', '2', '3', '4', '5', '6', '7', '8'],
            stationTypeData: [],
            value: '电流',
            paramsData: ''
        }
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    // 生命周期 - 销毁完成
    destroyed() {
    },
    // 方法集合
    methods: {
        initMapData(dataList, params) {
            this.paramsData = params
            this.dataList = dataList
            if (this.mapChart == null) {
                this.mapChart = echart.init(this.$refs.chinaMap);
            }
            this.getMapData({name: '河南'});
        },
        getMapData(params) {
            this.mapChart.showLoading();
            this.isChinaFlag = params.name == '全国';
            let option;
            this.tempDatalist = [];
            if ('河南省'.indexOf(params.name) > -1) {
                echart.registerMap('henan', henanGeoData);
                option = this.mapOption('henan', this.tempDatalist, '河 南 省');
            }
            option.series[0].data = this.dataList
            this.mapChart.hideLoading();
            this.mapChart.setOption(option);
        },

        mapOption(drawMapType, data, title) {
            let option = {
                title: {
                    // text: title,
                    textStyle: {
                        color: '#fff'
                    },
                    x: 'center',
                    top: '6%'
                },
                tooltip: {
                    trigger: 'item',
                    // formatter: '{b}   ' + '<span style="color: #10FAFE;"> ┊ {c} (tCO₂/MWh)</span>',
                    formatter: (params) => {
                        let ss1 = '<div style="color: #10FAFE;">'+ params.data[2]+'</div>'
                        return ss1;
                        // let ss1 = '<div style="color: #10FAFE;">'+ params.data[3]+'</div>'
                       // let ss2 = '<div style="color: #10FAFE;">'+ '发电量：'+params.data[2]+'</div>'
                       //  return ss1+ss2;
                    },
                    borderColor: '#59AFF9',
                    borderWidth: 1,
                    borderRadius: 0,
                    opacity: 0.1
                },
                geo: [{
                    map: drawMapType,
                    scaleLimit: {
                        min: 1,
                        max: 8
                    },
                    zoom: 1, // 当前视角的缩放比例
                    roam: true, // 是否开启平游或缩放
                    // zoom: 2,
                    top: 100,
                    label: {
                        normal: {
                            show: true,
                            fontSize: '12',
                            color: 'rgb(229,229,229)'
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: 'rgba(3,37,69,1)',
                            borderColor: '#016DAE',
                            // shadowColor: 'rgba(22,120,153,.6)',
                            // shadowOffsetY: 6,
                            // shadowOffsetX: 2,
                            borderWidth: 2
                        },
                        emphasis: {
                            areaColor: '#90FFF4',
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            borderWidth: 0
                        }
                    }
                }],
                series: [
                    {
                        // name: item[1],
                        type: 'effectScatter',
                        showEffectOn: 'render',
                        coordinateSystem: 'geo',
                        zlevel: 3,
                        rippleEffect: {
                            brushType: 'stroke', // 波纹的绘制方式，可选 'stroke' 和 'fill'
                            period: 4, // 动画的时间。
                            number: 5,
                            scale: 5 // 动画中波纹的最大缩放比例。
                        },
                        symbol: 'image://' + require('@/assets/stationType/map_wind.png'),
                        symbolSize: 6,
                        colorBy: 'series',
                        itemStyle: {
                            color: '#c0227b', // 颜色
                            borderColor: '#CD0373', // 边框颜色
                            borderWidth: 0, // 柱条的描边宽度，默认不描边。
                            borderType: 'solid', // 柱条的描边类型，默认为实线，支持 'dashed', 'dotted'。
                            barBorderRadius: 0, // 柱形边框圆角半径，单位px，支持传入数组分别指定柱形4个圆角半径。
                            shadowBlur: 10, // 图形阴影的模糊大小。
                            shadowColor: '#000', // 阴影颜色
                            shadowOffsetX: 0, // 阴影水平方向上的偏移距离。
                            shadowOffsetY: 0, // 阴影垂直方向上的偏移距离。
                            opacity: 1,
                            emphasis: {
                                itemStyle: {
                                    color: '#c0227b',
                                    borderColor: '#CD0373'
                                }
                            }
                        },
                    },
                ]
            }
            return option;
        },
    }
};
</script>

<style scoped lang="less">
.map-content {

    .location-space {
        position: absolute;
        top: 22px;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        color: #2DCDFF;


    }

}

</style>
