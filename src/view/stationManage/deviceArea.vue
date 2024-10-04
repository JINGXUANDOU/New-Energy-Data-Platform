<!--
*@device
*@author whl
*@date 2024/5/13 10:50
-->
<template>
    <div class="dev-panel">
        <div class="main-content">
            <el-col style="width: 300px;height: 100%;padding: 4px 8px;">
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
                </el-input>

                <el-tree
                    class="filter-tree"
                    :data="otherDevList"
                    :props="defaultProps"
                    default-expand-all
                    style="height: calc(100% - 32px);"
                    :filter-node-method="filterNode"
                    ref="tree">
                </el-tree>
            </el-col>
            <el-col style="width: calc(100% - 320px);margin-left:16px;height: 100%;border-left: 2px solid #409EFF;">
                <el-table :data="deviceTableDataList" height="100%"
                          class="table_scroll" stripe
                          style="width: 100%;height: 100%;overflow: auto;">
                    <el-table-column align="center" prop="name" label="量测点"></el-table-column>
                    <el-table-column align="center" prop="oldValue" label="原始值"></el-table-column>
                    <el-table-column align="center" prop="change" label="变比"></el-table-column>
                    <el-table-column align="center" prop="value" label="测点数值"></el-table-column>
                    <el-table-column align="center" prop="unit" label="单位"></el-table-column>
                    <el-table-column align="center" prop="updateTime" label="数据更新时间"></el-table-column>
                </el-table>
            </el-col>
        </div>
    </div>
</template>

<script>
import {getDeviceList, getDeviceMeasureList} from '@/http/api/pvManage';

export default {
    name: 'deviceArea',
    components: {},
    inject: ['stationList'],
    props: [],
    data() {
        return {
            currentStationID: sessionStorage.stationID,
            stationArr: '',
            filterText: '',
            otherDevList: [],
            currentDevId: '',
            currentDevName: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            deviceTableDataList: []
        }
    },
    // 计算属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
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
    },
    // 方法集合
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        pageInit(params) {
            this.currentStationID = sessionStorage.getItem('stationID')
            this.devList = []
            this.treeDataUpdate()
        },
        treeDataUpdate() {
            this.otherDevList = [{
                key: -1,
                name: '其他设备',
                children: []
            }]
            getDeviceList({
                subAlias: this.currentStationID,
                devTypes: 'OTHER'
            }).then(res => {
                if (res.data) {
                    this.otherDevList[0].children = res.data
                    if (this.otherDevList[0] && this.otherDevList[0].children[0]) {
                        this.currentDevId = this.otherDevList[0].children[0].key
                        this.currentDevName = this.otherDevList[0].children[0].name
                    }
                    this.tableDataUpdate()
                }
            })
        },
        tableDataUpdate() {
            this.deviceTableDataList = []
            getDeviceMeasureList({
                devAlias: this.currentDevId
            }).then(res => {
                if (res.data) {
                    res.data.forEach((item, index) => {
                        this.deviceTableDataList.push({
                            id: 'otherDev' + index,
                            devName: this.currentDevName,
                            name: item.name,
                            value: item.currentValue,
                            unit: item.dimension,
                            updateTime: item.formatterTime
                        })
                    })
                }
            })
        }
    }
};
</script>

<style scoped lang="less">
.dev-panel {
    width: 100%;
    height: 100%;

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
        margin: 2px 4px;
        height: calc(100% - 12px);
        //border: 1px solid #409EFF;

        .filter-tree {
            overflow: auto;
        }
    }
}
</style>
