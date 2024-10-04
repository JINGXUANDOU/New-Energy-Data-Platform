import Vue from 'vue';
import VueRouter from 'vue-router'
import NProgress from 'nprogress'

import menuRouter from './defaultRouter'
import {Message} from 'element-ui';
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
    routes: menuRouter,
    mode: 'hash',
    scrollBehavior(to, from, savedPosition) {
        // keep-alive 返回缓存页面后记录浏览位置
        if (savedPosition && to.meta.keepAlive) {
            return savedPosition;
        }
        // 异步滚动操作
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({x: 0, y: 0})
            }, 200)
        })
    }
})

router.beforeEach((to, from, next) => {
    NProgress.start();
    // 如果去往/ 或者登录页 清除sessionStorage里所有内容
    if (to.path === '/' || to.path === '/login') {
        // 如果是登录状态去往login 则发起登出请求
        localStorage.clear();
        sessionStorage.clear();
        next()
    } else {
        if (sessionStorage.getItem('userId')) {
            next()
        } else {
            next('/login')
            Message.warning('登录信息异常,请先登陆')
        }
    }
    NProgress.done() // 进度条结束
})

router.afterEach((to, from) => {
    NProgress.done();
    NProgress.remove();
})

export default router;
