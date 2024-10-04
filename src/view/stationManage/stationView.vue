<!--
*@stationView
*@author whl
*@date 2024/5/17 14:39
-->
<template>
    <div class="station-view">
        <el-tabs v-model="activeMenu" @tab-click="handleClick" class="area-content">
            <el-tab-pane label="电站首页" name="1" style="width: 100%;height: 100%;">
                <overview v-if="activeMenu=='1'" style="width: 100%;height: 100%;"></overview>
            </el-tab-pane>
            <el-tab-pane label="并网监视" name="2" style="width: 100%;height: 100%;">
                <connect-area v-if="activeMenu=='2'" style="width: 100%;height: 100%;"></connect-area>
            </el-tab-pane>
            <el-tab-pane label="光伏设备" name="3" style="width: 100%;height: 100%;">
                <pv-area v-if="activeMenu=='3'" style="width: 100%;height: 100%;"></pv-area>
            </el-tab-pane>
            <el-tab-pane label="其他设备" name="4" style="width: 100%;height: 100%;">
                <device-area v-if="activeMenu=='4'" style="width: 100%;height: 100%;"></device-area>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Overview from '@/view/stationManage/overview';
import PvArea from '@/view/stationManage/pvArea';
import ConnectArea from '@/view/stationManage/connectArea';
import DeviceArea from '@/view/stationManage/deviceArea';

export default {
    name: 'stationView',
    components: {DeviceArea, ConnectArea, PvArea, Overview},
    props: [],
    data() {
        return {
            activeMenu: '1'
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

    },
    // 方法集合
    methods: {
        handleClick() {

        }
    }
};
</script>

<style scoped lang="less">
.station-view {
    position: relative;
    width: 100%;
    height: 100%;
    //border: 1px solid #155E9C;
    color: #fff;

    .area-content {
        width: 100%;
        height: 100%;
    }

    /deep/ .el-tabs__content {
        padding: 0;
        width: 100%;
        height: calc(100% - 40px);
        border: 1px solid #00CFFE;
    }
}
</style>
