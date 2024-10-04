<!--
*@connectArea
*@author whl
*@date 2024/5/13 10:49
-->
<template>
    <div class="report-panel">
        <div class="main-content">
            <el-col style="width: 200px;height:100%;text-align: center;padding-top: 20px;">
                <el-scrollbar style="height:100%">
                    <el-radio-group v-model="currentDev" @input="changeReport">
                        <el-radio-button v-for="item in reportList" :key="item.reportCode"
                                         :label="item.reportCode" border size="medium">
                            {{ item.reportName }}
                        </el-radio-button>
                    </el-radio-group>
                </el-scrollbar>
            </el-col>
            <el-col style="width: calc(100% - 202px);height: calc(100% - 8px);">
                <iframe ref="iframeRef" frameborder="0" :src="iframeUrl" style="width:100%;height:100%;">
                </iframe>
            </el-col>
        </div>
    </div>
</template>

<script>
import {getReports} from '@/http/api/reportManage';

export default {
    name: 'reportPanel',
    components: {},
    inject: ['stationList'],
    props: [],
    data() {
        return {
            currentStationID: '',
            sysID: '',
            stationArr: '',
            currentDev: '',
            reportList: [],
            iframeUrl: ''
        }
    },
    // 计算属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        // currentDev(val) {
        //     this.topoLineUpdate()
        // }
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
        pageInit() {
            this.currentStationID = sessionStorage.getItem('stationID')
            this.sysID = sessionStorage.getItem('sysId')

            this.getReportList()
        },
        getReportList() {
            let params = {
                cenControlId: this.sysID,
                substationId: this.currentStationID
            }
            this.reportList = []
            getReports(params).then(res => {
                this.reportList = res.data

                if (this.reportList.length > 0) {
                    this.currentDev = this.reportList[0].reportCode
                    this.reportUrlUpdate(this.reportList[0].reportUrl)
                }
            }).catch(e => {
                // for (let i = 0; i < 10; i++) {
                // this.reportList.push({
                //     "substationId": "xlb",
                //     "substationName": null,
                //     "reportId": "950628752955400192",
                //     "reportCode": "20240515155724",
                //     "reportName": "年发电量报表",
                //     "reportType": "chartinfo"
                //     "reportUrl": 'http://192.168.2.77:10002/jmreport/view/20240515155724'
                // })
                // }
                // this.reportUrlUpdate(this.reportList[0].reportUrl)
            })
        },
        changeReport(reportCode) {
            let reportObj = this.reportList.find(item => item.reportCode == reportCode)
            this.reportUrlUpdate(reportObj.reportUrl)
        },
        reportUrlUpdate(reportUrl) {
            this.$nextTick(() => {
                this.$refs.iframeRef.contentWindow.location = reportUrl
            })
        }
    }
};
</script>

<style scoped lang="less">
.report-panel {
    height: 100%;
    width: 100%;
    border: 1px solid #155E9C;

    .main-content {
        margin: 4px;
        height: calc(100% - 8px);
    }

    /deep/ .el-radio-button--mini .el-radio-button__inner {
        padding: 12px 20px;
        margin: 8px 0;
        font-size: 16px;
    }
}
</style>
