<!--
*@connectArea
*@author whl
*@date 2024/5/13 10:49
-->
<template>
    <div class="alarm-panel">
        <div class="main-content">
            <el-tabs class="alarm-content">
                <el-tab-pane label="实时故障/报警/事件" style="width:100%;height: 100%;">
                    <el-table :data="alarmTableList" height="100%" width="100%"
                              class="table_scroll" stripe
                              style="width: 100%;overflow: auto;">
                        <el-table-column align="center" prop="stationName" label="子站名称"></el-table-column>
                        <el-table-column align="center" prop="devName" label="告警设备"></el-table-column>
                        <el-table-column align="center" prop="name" label="故障码/描述"></el-table-column>
                        <el-table-column align="center" prop="alarmLevel" label="告警级别"></el-table-column>
                        <el-table-column align="center" prop="time" label="开始时间"></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="历史故障/告警" style="width:100%;height: 100%;">
                    <div class="filter-div">
                        <span>子站: </span>
                        <el-select v-model="filterParams.stationIds" multiple collapse-tags placeholder="请选择"
                                   class="no-border-select">
                            <el-option
                                v-for="item in stationList"
                                :key="'s'+item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <!--                        <span>设备: </span>-->
                        <!--                        <el-select v-model="filterParams.devIds" multiple placeholder="请选择" class="no-border-select">-->
                        <!--                            <el-option-->
                        <!--                                v-for="item in devList"-->
                        <!--                                :key="item.id"-->
                        <!--                                :label="item.name"-->
                        <!--                                :value="item.key">-->
                        <!--                            </el-option>-->
                        <!--                        </el-select>-->
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
                    </div>
                    <div class="table-div">
                        <el-table :data="historyAlarmTableList" height="calc(100% - 40px)"
                                  class="table_scroll" stripe
                                  style="width: 100%;overflow: auto;">
                            <el-table-column align="center" prop="subName" label="子站名称"></el-table-column>
                            <el-table-column align="center" prop="deviceName" label="告警设备"></el-table-column>
                            <el-table-column align="center" prop="alarmDesc" label="故障码/描述"></el-table-column>
                            <el-table-column align="center" prop="alarmLevel" label="告警级别"></el-table-column>
                            <el-table-column align="center" prop="alarmTime" label="开始时间"></el-table-column>
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
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

import {getHisToryAlarmList, getStationAlarmList} from '@/http/api/pvManage';

export default {
    name: 'AlarmPanel',
    components: {},
    inject: ['stationList'],
    props: [],
    data() {
        return {
            currentStationID: '',
            alarmTableList: [],
            historyAlarmTableList: [],
            pageNum: 1,
            pageSize: 20,
            tableDataTotal: 20,
            // stationList: [],
            devList: [],
            filterParams: {
                stationIds: '',
                devIds: '',
                startTime: '',
                endTime: ''
            },
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
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.$bus.$on('changeStation', this.pageInit())
        this.$nextTick(_ => {
            this.pageInit()
        })
    },
    beforeDestroy() {
        this.$bus.$off('changeStation')
    },
    // 方法集合
    methods: {
        pageInit() {
            this.currentStationID = sessionStorage.getItem('stationID')
            this.currentStationName = sessionStorage.getItem('stationName')

            this.filterParams.stationIds = [this.currentStationID]
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            this.times = [start, end]

            this.alarmTableList = []
            getStationAlarmList({
                subAlias: this.currentStationID,
                maxSize: 10
            }).then(res => {
                if (res.data) {
                    res.data.forEach((item, index) => {
                        this.alarmTableList.push({
                            id: 'alarm' + index,
                            stationName: this.currentStationName,
                            devName: item.deviceName,
                            name: item.alarmDesc,
                            alarmLevel: this.$utils.numberToChinese(item.alarmLevel) + '级',
                            time: item.alarmTime
                        })
                    })
                }
            })
            this.getHistoryTableData()
        },
        getHistoryTableData() {
            if (this.times == '') {
                this.$message.warning('请选择时间！')
                return
            }
            if (this.times.length !== 2) {
                this.$message.warning('请选择时间！')
                return
            }
            this.historyAlarmTableList = []
            let startTime = this.$utils.dateFormat('YYYY-mm-dd HH:MM:SS', this.times[0])
            let endTime = this.$utils.dateFormat('YYYY-mm-dd HH:MM:SS', this.times[1])
            getHisToryAlarmList({
                aliases: this.filterParams.stationIds.toString(),
                startTime: startTime,
                endTime: endTime,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }).then(res => {
                if (res.data) {
                    this.tableDataTotal = res.data.total
                    this.historyAlarmTableList = res.data.data
                    this.historyAlarmTableList.forEach(item => {
                        item.alarmLevel = this.$utils.numberToChinese(item.alarmLevel) + '级'
                    })
                }
            })
        },
        onSubmit() {
            this.pageNum = 1;
            this.getHistoryTableData();
        },
        onReset() {
            this.filterParams.stationIds = ''
            this.times = ''
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.onSubmit()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pageNum = val;
            this.getHistoryTableData()
        },
        handleCommand(stationObj) {
            sessionStorage.setItem('stationID', stationObj.id)
            sessionStorage.setItem('stationName', stationObj.name)
            this.changedStation()
            this.$bus.$emit('changeStation')

        }
    }
};
</script>

<style scoped lang="less">
.alarm-panel {
    height: 100%;
    width: 100%;
    border: 1px solid #155E9C;

    .station-info {
        height: 36px;
        padding: 2px 8px;

        .no-border-select .el-input {
            border: none;
            box-shadow: none;
        }

        .no-border-select .el-input__suffix {
            display: none;
        }
    }

    .main-content {
        padding: 4px;
        width: calc(100% - 8px);
        height: calc(100% - 12px);
        border: 1px solid #409EFF;

        .alarm-content {
            height: calc(100% - 2px);
            width: calc(100% - 2px);

            .table_scroll {
                width: 100%;
                border-collapse: separate;
                table-layout: fixed; // 这一行是重点
            }

            .filter-div {
                width: 100%;
                height: 36px;
                padding: 2px 8px;
                display: flex;
                vertical-align: middle;
                align-items: center;
                gap: 6px;
                color: #fff;

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

            .table-div {
                width: 100%;
                height: calc(100% - 40px);
            }

            // 解决el-table宽度无限拉伸问题, 一定要加scoped, 否则deep无效
            ::v-deep .el-table {
                width: 100%;

                .el-table__header-wrapper table, .el-table__body-wrapper table {
                    width: 100% !important;
                }

                .el-table__body, .el-table__footer, .el-table__header {
                    table-layout: auto;
                }
            }
        }

        /deep/ .el-tabs__content {
            padding: 0;
            width: 100%;
            height: calc(100% - 36px);
            border: 1px solid #00CFFE;
        }
    }

    /deep/ .el-tag.el-tag--info {
        background-color: #04454e;
        color: #fff;
        border: none;
    }
}
</style>
