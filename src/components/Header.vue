<template>
    <div class="page-title">
        <div class="page-text">{{ systemName }}</div>
        <div class="location-space">
            <div style="display: inline-block" v-show="activeMenu !=1">
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
            </div>
            <i class="el-icon-s-tools" style="font-size:20px;margin-left: 12px;cursor: pointer;color: #28B6E8;" @click="clickHandle"></i>
        </div>
    </div>
</template>
<script>
export default {
    name: 'headerComponent',
    data() {
        return {
            systemName: '新能源集控系统',
            stationArr: [],
            currentStationId: 1,
            currentStationName: '',

        }
    },
    props: ['activeMenu'],
    inject: ['stationList'],
    created() {
    },
    destroyed() {
        this.myTimer1 && clearInterval(this.myTimer1);
    },
    mounted() {
        this.$bus.$on('init', this.initPage)
        this.$bus.$on('changeStation', this.changedStation)
        this.initPage()
        this.myTimer1 = setInterval((_) => {
            this.nowTime = this.$utils.dateFormat('YYYY-mm-dd HH:MM:SS', new Date());
            // this.weekNum = this.$utils.numToWeek(new Date().getDay() + 1 + '', '星期');
        }, 1000);
    },
    methods: {
        initPage() {
            if (this.$route.path == '/home') {
                this.activeMenu = 1
            }
            this.stationArr = this.stationList
            this.systemName = sessionStorage.getItem('sysName')
            this.changedStation()
        },
        changedStation() {
            this.currentStationId = sessionStorage.getItem('stationID')
            this.currentStationName = sessionStorage.getItem('stationName')
        },
        handleCommand(stationObj) {
            sessionStorage.setItem('stationID', stationObj.id)
            sessionStorage.setItem('stationName', stationObj.name)
            this.changedStation()
            this.$bus.$emit('changeStation',stationObj.id)

        },
        clickHandle(){
            this.$emit('childEvent')
            
        }
    }
};
</script>
<style lang="less" scoped>
@font-face {
    font-family: "MYFONT";
    src: url("../assets/font/YouSheBiaoTiHei-2.ttf");
}

.page-title {
    margin-top: 0px;
    display: flex;
    width: 100%;
    height: 130px;
    background: url("~@/assets/header_bg.png") center 100% no-repeat;
    background-size: 100% 100%;
    background-position: 50% -8px;


    .weatherspan {
        padding-top: 80%;
        font-size: 11px;
        color: #fff;
        display: block;
        text-align: center;
        line-height: 16px;
    }

    .page-text {
        flex: 1;
        /* 将背景设为渐变 */
        background-image: -webkit-linear-gradient(top, white 10%, #4489e4, #4489e4);
        /* 规定背景绘制区域 */
        -webkit-background-clip: text;
        /* 将文字隐藏 */
        -webkit-text-fill-color: transparent;
        text-align: center;
        color: #fff;
        font: 40px "MYFONT";
        letter-spacing: 7px;
    }

    .location-space {
        position: absolute;
        right: 8px;
        top: 28px;
        font-size: 16px;
        color: #2DCDFF;

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
}

.time {
    transform: translateY(3.5px);
}

/deep/ .el-dialog {
    /*height: 500px;*/
    height: 100vh;
}

/deep/ .el-dialog__body {
    padding: 20px 0 0;
    height: calc(100% - 72px);
}

/deep/ .el-dialog__footer {
    height: 0;
}

/deep/ .el-dropdown-menu__item {
    padding: 6px 14px;
    color: #fff;
}

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #04454e;
    color: #39937e;
}
</style>
