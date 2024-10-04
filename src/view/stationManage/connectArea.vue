<!--
*@connectArea
*@author whl
*@date 2024/5/13 10:49
-->
<template>
    <div class="connect-panel">
        <div class="main-content">
            <el-col style="width: 190px;height:100%;text-align: center;padding-top: 20px;">
                <el-scrollbar style="height:100%">
                    <el-radio-group v-model="currentDev" @input="changeDev">
                        <el-radio-button v-for="item in devList" :key="'nbq'+item.id"
                                         :label="item.key" border size="medium">
                            {{ item.name }}
                        </el-radio-button>
                    </el-radio-group>
                </el-scrollbar>
            </el-col>
            <el-col style="position:relative;width: calc(100% - 202px);height: 100%;">
                <div style="width: 100%;height:100%;border:1px solid #409EFF;overflow: auto;background-color: #000;">
                    <object id="svgBox2" :data="svgUrl" width="800px" height="600px"/>
                </div>
                <div v-show="devList.length==0" class="no-data-content">暂无数据</div>
            </el-col>
        </div>
    </div>
</template>

<script>
import {getDeviceList, getMeteValueList} from '@/http/api/pvManage';

export default {
    name: 'ConnectArea',
    components: {},
    inject: ['stationList'],
    props: [],
    data() {
        return {
            currentStationID: sessionStorage.stationID,
            stationArr: '',
            currentDev: '',

            devList: [{     // 测试用的系统列表，后面需要修改
                key: 0,
                id: 0,
                name: 'station0',
            }, {
                key: 1,
                id: 1,
                name: 'station1',                
            }],

            svgUrl: null,
            myTimer: null,

            key_value_pair: [],     // 生成的随机数值对
            isFormTwo: false        // form1是原来读取text的，form2是读取g的新的

        }
    },
    // 计算属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {
        // currentDev(valNew, valOld) {
        //     this.topoLineUpdate(valNew)
        // }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.$bus.$on('changeStation', this.pageInit2)
        this.$nextTick(_ => {
            this.pageInit2()
        })
    },
    beforeDestroy() {
        this.$bus.$off('changeStation')
        this.myTimer && clearInterval(this.myTimer);
    },
    // 方法集合
    methods: {
        /*pageInit(params) {
            this.currentStationID = sessionStorage.getItem('stationID')
            this.devList = []
            this.svgUrl = ''
            getDeviceList({
                subAlias: this.currentStationID,
                devTypes: 'CABINET'
            }).then(res => {
                if (res.data) {
                    this.devList = res.data
                    this.currentDev = this.devList[0].key
                    this.changeDev(this.devList[0].key)
                }
            })
        },*/


        pageInit2(params) {
            this.currentStationID = 0
            this.svgUrl = '' 
            this.currentDev = this.devList[0].key
            this.changeDev(this.devList[0].key)           
        },


        changeDev(val) {
            this.topoLineUpdate(val)
        },
        topoLineUpdate(devKey) {
            // let sub = this.currentStationID.split('/')[0]
            let sub = 'S001_new'
            this.svgUrl = require('/public/topoTemplate/' + sub + '.svg')
            let url = '/topoTemplate/' + sub + '.svg'
            let metaList = []
            fetch(url).then((res) => res.text()).then(data => {
                const svgDom = new DOMParser().parseFromString(data, 'image/svg+xml');

                // 判断SVG类型，FormOne是<text>里面找class, FormTwo是<g>里面找link_data_key
                if (this.isFormatTwo(svgDom)){
                    this.isFormTwo = true;
                } else {
                    this.isFormTwo = false;
                }

                if (!this.isFormTwo){
                    console.log("form1")
                    // 获取 svg中文本list
                    let len = svgDom.querySelectorAll('text').length
                    for (let i = 0; i < len; i++) {
                        let node = svgDom.querySelectorAll('text')[i]
                        let metePath = node.getAttribute('class')
                        if (metePath.indexOf('/') != -1) {
                            let arr = metePath.split('/')
                            arr[0] = sub
                            metaList.push(arr.join('/'))
                        }
                    }
                    if (metaList.length == 0) {
                        console.log('模板图中测点数据获取异常！')
                    }
                    this.updateTopoDataValueFormOne(metaList)
                } else {
                    console.log("form2")
                    let gElements = svgDom.querySelectorAll('g');
                    gElements.forEach(gElement => {
                        // 获取link_data_key
                        let linkDataKey = gElement.getAttribute('link_data_key');
                        if (linkDataKey) {
                            // &quot -> 常规数据
                            let parsedKey = JSON.parse(linkDataKey.replace(/&quot;/g, '"')); 
                            if (parsedKey.alias) {
                                this.key_value_pair[parsedKey.alias] =  '';
                            }
                        }
                    });
                    this.updateTopoDataValueFormTwo()
           
                }
            }).catch(err => console.log(err));

            // 设置定时器，2分钟刷新一次数据
            this.myTimer && clearInterval(this.myTimer);
            this.myTimer = setInterval((_) => {
                if (!this.isFormTwo){
                    this.updateTopoDataValueFormOne(metaList)
                } else {
                    this.updateTopoDataValueFormTwo()
                }
            }, 1000 * 60 * 2); // 两分钟 1000 * 60 * 2

        },

        isFormatTwo(svgDoc) {
            // 检测是否是<g>linked_data_key风格的
            return svgDoc.querySelectorAll('g[link_data_key]').length > 0;
        },  

        printKVS() {
            // 测试用，检查提取的key_value_pair里面的值是否正确
            Object.keys(this.key_value_pair).forEach(key => {
                console.log(key + ": " + this.key_value_pair[key]);
            });      
        },

        giveRandomNum() {
            // 生成一个随机数
            Object.keys(this.key_value_pair).forEach(key => {
                this.key_value_pair[key] = Math.floor(Math.random()* 114514);
            });
        },  

        updateTopoDataValueFormOne(metaList) {
            // 原updateTopoDataValue方法，对应<text>class
            getMeteValueList({
                index: metaList.toString()
            }).then(res => {
                if (res.data) {
                    let valueMap = res.data
                    let svgDom = window.document.getElementById('svgBox2').contentDocument
                    let len = svgDom.querySelectorAll('text').length
                    for (let i = 0; i < len; i++) {
                        let node = svgDom.querySelectorAll('text')[i]
                        let metePath = node.getAttribute('class')
                        node.setHTMLUnsafe(valueMap[metePath] || '0.00')
                    }
                }
            }).catch(e => {
                this.$message.warning('量测值数据接口返回异常！')
                let svgDom = window.document.getElementById('svgBox2').contentDocument
                let len = svgDom.querySelectorAll('text').length
                for (let i = 0; i < len; i++) {
                    let node = svgDom.querySelectorAll('text')[i]
                    node.setHTMLUnsafe('0.00')
                }
            })
        },

        updateTopoDataValueFormTwo() {
            // 对应<g>link_data_key
            this.giveRandomNum();   // 往里面丢一个随机数
            this.printKVS();    // 打印以下key value pair里面的值，校验用，可删除此行

            let svgDoc = window.document.getElementById('svgBox2').contentDocument;
            let gElements = svgDoc.querySelectorAll('g');
            gElements.forEach(gElement => {
                let linkDataKey = gElement.getAttribute('link_data_key');
                if (linkDataKey) {
                    let parsedKey;
                    try {
                        parsedKey = JSON.parse(linkDataKey.replace(/&quot;/g, '"'));
                    } catch (e) {
                        this.$message.warning('量测值数据接口返回异常！', e)
                        return;
                    }

                    if (parsedKey && parsedKey.alias) {
                        let nodes = gElement.querySelectorAll('text');
                        nodes.forEach(node => {
                            let value = this.key_value_pair[parsedKey.alias] || '0.00';
                            node.setHTMLUnsafe(value);
                        });
                    }
                }
            });
        }
    }
};
</script>

<style scoped lang="less">
.connect-panel {
    width: 100%;
    height: 100%;

    .main-content {
        margin: 2px 4px;
        height: calc(100% - 12px);

        .no-data-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            text-align: center;
            transform: translateY(50%);
            letter-spacing: 2px;
        }
    }

    /deep/ .el-radio-button--mini .el-radio-button__inner {
        padding: 12px 20px;
        margin: 8px 0;
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: normal;
        line-height: 18px;
        vertical-align: middle;
        display: inline-block;
        line-height: 20px;
    }
}
</style>


