<!--
*@pvArea
*@author whl
*@date 2024/5/13 10:49
-->
<template>
    <div class="pv-panel">
        <div class="station-info">
            <span>当前设备>> </span>
            <el-select v-model="currentDevID" placeholder="请选择" class="no-border-select">
                <el-option
                    v-for="item in devArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.key">
                </el-option>
            </el-select>
        </div>
        <div class="main-content">
            <el-col style="width: 50%;height: 100%;position: relative;">
                <div class="content-title">遥测量</div>
                <el-scrollbar style="height:calc(100% - 30px);">
                    <div class="tele-content">
                        <el-tag v-for="(item,index) in telemetryList" :key="index"
                                effect="dark"
                                color="#2D9085"
                                class="tag-content">
                            <span class="tag-item-name">{{ item.name }} </span><br>
                            <span class="tag-item-value">{{ item.value }} </span>
                            <span class="tag-item-unit">{{ item.unit || '' }} </span>
                        </el-tag>
                    </div>
                </el-scrollbar>
                <div v-if="telemetryList.length==0" class="no-data-content">暂无数据</div>
            </el-col>
            <el-col style="width: 50%;height: 100%;">
                <div class="content-title">遥信量</div>
                <div style="width: 100%;height: 50%;position: relative">
                    <el-scrollbar style="height:100%;">
                        <div class="signal-content">
                            <el-tag v-for="(item,index) in signalList" :key="index"
                                    :type="item.value==0?'success':'danger'"
                                    effect="dark"
                                    class="tag-content">
                                {{ item.name }}
                            </el-tag>
                        </div>
                    </el-scrollbar>
                    <div v-show="signalList.length==0" class="no-data-content">暂无数据</div>
                </div>
                <div class="content-title">告警故障列表</div>
                <el-tabs class="alarm-content" >
                    <el-tab-pane label="实时故障/报警/事件" style="height: 100%;">
                        <el-table :data="alarmTableList"  height="100%"
                                  class="table_dark" stripe
                                  style="width: 100%;height: 100%;overflow: auto;">
                            <el-table-column align="center" prop="devName" label="告警设备"></el-table-column>
                            <el-table-column align="center" prop="name" label="故障码/描述"></el-table-column>
                            <el-table-column align="center" prop="time" label="开始时间"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="历史故障/告警" style="height: 100%;">
                        <el-table :data="historyAlarmTableList" height="calc(100% - 40px)"
                                  class="table_dark" stripe
                                  style="width: 100%;height: calc(100% - 40px);overflow: auto;">
                            <el-table-column align="center" prop="devName" label="告警设备"></el-table-column>
                            <el-table-column align="center" prop="name" label="故障码/描述"></el-table-column>
                            <el-table-column align="center" prop="time" label="开始时间"></el-table-column>
                        </el-table>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageNum"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, sizes"
                            :total="tableDataTotal">
                        </el-pagination>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </div>
    </div>
</template>

<script>
import {getDeviceAlarmList, getDeviceList, getDeviceMeasureList} from '@/http/api/pvManage';

export default {
    name: 'pvArea',
    components: {},
    inject: ['stationList'],
    props: [],
    data() {
        return {
            currentStationID: '',
            currentDevID: '',
            devArr: [],
            telemetryList: [],
            signalList: [],
            alarmTableList: [],
            historyAlarmTableList: [],
            pageNum: 1,
            pageSize: 1,
            tableDataTotal: 20,
            myTimer:null
        }
    },
    // 计算属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        currentDevID(newVal, oldVal) {
            this.devChange(newVal)
        }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.$bus.$on('changeStation', this.pageInit)
        this.$nextTick(_ => {
            this.pageInit()
        })
    },
    beforeDestroy() {
        this.$bus.$off('changeStation')
        this.myTimer && clearInterval(this.myTimer);
    },
    // 方法集合
    methods: {
        pageInit() {
            this.currentStationID = sessionStorage.getItem('stationID')
            this.devArr = []
            getDeviceList({
                subAlias: this.currentStationID,
                devTypes: 'BATTERY,INVERTER'
            }).then(res => {
                if (res.data) {
                    this.devArr = res.data
                    this.currentDevID = this.devArr[0].key
                }
            })

            // for (let i = 0; i < 15; i++) {
            //     if (i < 5) {
            //         this.alarmTableList.push({
            //             id: i,
            //             devName: '光伏面板' + i,
            //             name: 'xxx故障告警' + i,
            //             time: this.$utils.dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
            //         })
            //     }
            //     this.historyAlarmTableList.push({
            //         id: i,
            //         devName: '光伏面板' + i,
            //         name: 'xxx故障告警' + i,
            //         time: this.$utils.dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
            //     })
            // }
        },
        devChange(devKey) {
            this.telemetryList = []
            this.signalList = []

            this.getMetasureData(devKey)
            this.getAlarmData(devKey)

            this.myTimer && clearInterval(this.myTimer);
            this.myTimer = setInterval((_) => {
                this.getMetasureData(devKey)
                this.getAlarmData(devKey)
            }, 1000 * 60 * 2); // 两分钟 1000 * 60 * 2
        },
        getMetasureData(devKey){
            this.telemetryList =[]
            this.signalList =[]
            getDeviceMeasureList({
                devAlias: devKey
            }).then(res => {
                if (res.data) {
                    res.data.forEach(item => {
                        if (item.pointType == 'YC') {
                            this.telemetryList.push({
                                id: item.id,
                                name: item.name,
                                value: item.currentValue,
                                unit: item.dimension
                            })
                        } else if (item.pointType == 'YX') {
                            this.signalList.push({
                                id: item.id,
                                name: item.name,
                                value: parseInt(item.currentValue),
                                unit: item.dimension
                            })
                        }
                    })
                }
            })
        },
        getAlarmData(devKey){
            this.alarmTableList =[]
            getDeviceAlarmList({
                devAlias: devKey,
                maxSize: 8
            }).then(res => {
                if (res.data) {
                    res.data.forEach((item, index) => {
                        this.alarmTableList.push({
                            id: 'alarm' + index,
                            devName: item.deviceName,
                            name: item.alarmDesc,
                            time: item.alarmTime
                        })
                    })
                }
            })
        },
        handleSizeChange() {

        },
        handleCurrentChange() {

        }
    }
};
</script>

<style scoped lang="less">
.pv-panel {
    width: 100%;
    height: 100%;

    .station-info {
        height: 36px;
        padding: 4px 8px;

        .no-border-select {
            width: 300px;
        }

        .no-border-select .el-input {
            border: none;
            box-shadow: none;
        }

        .no-border-select .el-input__suffix {
            display: none;
        }

    }

    .main-content {
        margin: 2px 4px;
        height: calc(100% - 48px);
        //border: 1px solid #409EFF;

        .content-title {
            height: 30px;
            line-height: 30px;
            padding-left: 6px;
            border-left: 1px solid #233354;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 2px;
            font-family: "Microsoft YaHei UI";
            background-color: #134246;
            color: #b1e8fd;
        }

        .tele-content {
            position: relative;
            overflow: hidden;
            height: calc(100% - 30px);
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;

            .tag-content {
                flex: 0 0 calc((100% - 10px) / 3);
                min-width: 200px;
                height: 48px;
                padding-top: 4px;
                margin: 2px 0.2%;
            }
            .tag-content:nth-child(3n){
                margin-right: 0;// 去除第3n个的margin-right
            }
            .tag-item-name {
                display: inline-block;
                width: 100%;
            }

            .tag-item-value {
                display: inline-block;
                width: 60%;
                color: #00CFFE;
                font-size: 16px;
                font-weight: bold;
            }

            .tag-item-unit {
                font-weight: bold;
                display: inline-block;
                width: 20%
            }
        }

        .signal-content {
            position: relative;
            overflow: hidden;
            height: 50%;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            .tag-content {
                flex: 0 0 calc((100% - 12px) / 3);
                //width: 24%;
                height: 40px;
                padding-top: 10px;
                margin: 6px 0.2%;
                text-align: center
            }
        }

        .no-data-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            letter-spacing: 2px;
            display: flex;
            /*实现垂直居中*/
            align-items: center;
            /*实现水平居中*/
            justify-content: center;
        }

        .alarm-content {
            height: calc(50% - 66px);
            width: calc(100% - 6px);

        }

        /deep/ .el-tabs--border-card > .el-tabs__content {
            padding: 0;
            height: calc(100% - 40px);
            border: 1px solid #00CFFE;
        }
    }
}
</style>
