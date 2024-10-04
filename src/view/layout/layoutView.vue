<template>
    <div style="width: 100%;height: 100%;" class="main-page">
        <el-header style="margin-top: 0px;">
            <self-header :activeMenu="activePanel" @childEvent="handleChildHeader"></self-header>
        </el-header>
        <div style="display: flex;height: calc(100% - 88px);width: 100%;gap: 6px;">
            <div class="col-item">
                <div class="border_corner border_corner_left_top" v-show = "borderVisible"></div>
                <div class="border_corner border_corner_right_top" v-show = "borderVisible"></div>
                <div class="border_corner border_corner_left_bottom" v-show = "borderVisible"></div>
                <div class="border_corner border_corner_right_bottom" v-show = "borderVisible"></div>
                <router-view @gotoStation="gotoStation"></router-view>
            </div>
            <div style="width: 32px;">
                <br>
                <div class="right-menu-title home-title-bg" @click="changePanel(1)">首页</div>
                <div class="right-menu-title station-title-bg" @click="changePanel(2)"> 电站监控</div>
                <div class="right-menu-title alarm-title-bg" @click="changePanel(3)"> 告警查询</div>
                <div class="right-menu-title static-title-bg" @click="changePanel(4)"> 统计报表</div>
            </div>
        </div>

        <userDialog @childEvent="handleChilduserDialog" :dialogTableVisible="Vdata"/>
        <div class="footer-div"></div>
    </div>
</template>

<script>
import userDialog from '../users/userDialog.vue';

export default {
    name: 'layoutView',
    components: {userDialog},
    data() {
        return {
            activePanel: 1,
            dataList: [],
            myTimer: null,
            timeout: null, // 定时器防抖

            Vdata: false,
            borderVisible: true,
        }
    },
    inject: ['reload'],
    mounted() {
        this.activePanel = this.$route.query.activePanel; // 获取传递的 id 参数
    },
    methods: {
        /**
         * 改变当前视图
         * @param val
         */
        changePanel(val) {
            this.activePanel = val
            if (val == 1) {
                this.$router.push({
                    name: 'homePage'
                })

            } else if (val == 2) {
                this.$router.push({
                    name: 'stationPage'
                })
            } else if (val == 3) {
                this.$router.push({
                    name: 'alarmPage'
                })
            } else if (val == 4) {
                this.$router.push({
                    name: 'reportPage'
                })
            }
        },
        gotoStation() {
            this.activePanel = 2
        },
        handleChildHeader (data) {
            this.borderVisible = false
            this.Vdata = true
            //console.log('父组件接收到的数据：' + data)
        },

        handleChilduserDialog (data) {
            this.borderVisible = true
            this.Vdata = false            
        },
    }
}
</script>

<style scoped lang="less">

.main-page {
    background: radial-gradient(#003c5f, #000106);
    overflow: hidden;

    .col-item {
        position: relative;
        height: 100%;
        flex: 1;
        box-sizing: border-box;
        min-width: 0; // 关键代码
        border: 1px solid #19474D;
        //margin: 0 8px;
        /*四个角框*/

        .border_corner {
            z-index: 2500;
            position: absolute;
            width: 32px;
            height: 32px;
            background: rgba(0, 0, 0, 0);
            border: 3px solid #83FDFF;
        }

        .border_corner_left_top {
            top: -2px;
            left: -2px;
            border-right: none;
            border-bottom: none;
            border-top-left-radius: 4px;
        }

        .border_corner_right_top {
            top: -2px;
            right: -2px;
            border-left: none;
            border-bottom: none;
            border-top-right-radius: 4px;
        }

        .border_corner_left_bottom {
            bottom: -2px;
            left: -2px;
            border-right: none;
            border-top: none;
            border-bottom-left-radius: 4px;
        }

        .border_corner_right_bottom {
            bottom: -2px;
            right: -2px;
            border-left: none;
            border-top: none;
            border-bottom-right-radius: 4px;
        }
    }

    .right-menu-title {
        width: 30px;
        height: 80px;
        line-height: 32px;
        margin: 8px 0;
        padding-top: 42px;
        color: #fff;
        writing-mode: tb-rl; /*决定文字排版方向*/
        word-wrap: break-word;
        letter-spacing: 2px;
    }

    .home-title-bg {
        background: url("~@/assets/pv/home-title.png") center center no-repeat;
        background-size: 100% 100%;
    }

    .station-title-bg {
        background: url("~@/assets/pv/station-title.png") center center no-repeat;
        background-size: 100% 100%;
    }

    .static-title-bg {
        background: url("~@/assets/pv/static-title.png") center center no-repeat;
        background-size: 100% 100%;
    }

    .alarm-title-bg {
        background: url("~@/assets/pv/alarm-title.png") center center no-repeat;
        background-size: 100% 100%;
    }

    .right-menu-title:hover {
        color: #43FFF6;
        cursor: pointer;
    }

    .footer-div {
        width: 100%;
        height: 20px;
        background: url("~@/assets/footer_bg_new.png") center center no-repeat;
        background-size: 100% 100%;
    }

    // 重点注意这段样式
    .seamless-warp {
        height: 200px;
        //overflow: hidden;

        ::v-deep .table_scroll .el-table__header-wrapper {
            display: none;
        }

        ::v-deep .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
            border-bottom: none;
        }

    }
}
</style>
