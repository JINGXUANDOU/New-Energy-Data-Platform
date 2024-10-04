import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import 'lib-flexible/flexible.js'
import 'nprogress/nprogress.css'
import './plugin/directive'

import * as utils from './utils/util';
import * as RegExp from './utils/validate';

import http from './http/request'

// echarts
import echarts from 'echarts';
// ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './style/element-reset.css';
import './style/base-reset.css'
// 加载全局组件
import './components';

Vue.use(ElementUI, {size: 'mini'});

Vue.config.productionTip = false; // 消息提示的环境配置开发环境-生产环境

Vue.prototype.$utils = utils;
Vue.prototype.$RegExp = RegExp; // Form表单正则验证集合
Vue.prototype.$http = http;
Vue.prototype.$echarts = echarts;
Vue.prototype.$bus = new Vue();

window.vm = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

