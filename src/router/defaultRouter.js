const Forbidden = r => require.ensure([], () => r(require('@/view/error/403.vue')), '403');
const NotFound = r => require.ensure([], () => r(require('@/view/error/404.vue')), '404');
const Login = r => require.ensure([], () => r(require('@/view/login/Login.vue')), 'login');
const homeView = r => require.ensure([], () => r(require('@/view/home/Home.vue')), 'homeView');
const layoutView = r => require.ensure([], () => r(require('@/view/layout/layoutView.vue')), 'layoutView');
const stationView = r => require.ensure([], () => r(require('@/view/stationManage/stationView.vue')), 'stationView');
const alarmView = r => require.ensure([], () => r(require('@/view/alarms/alarm.vue')), 'alarmView');
const reportView = r => require.ensure([], () => r(require('@/view/reports/report.vue')), 'reportView');
// 静态路由
const defaultRouter = [
    {
        path: '/',
        redirect: {
            name: 'loginPage'
        }
    },
    {
        path: '/login', // 登录页 -- 用户登录鉴权
        component: Login,
        name: 'loginPage'
    },
    // {
    //     path: '/home', // 集控站首页
    //     component: LayoutView,
    //     name: 'homePage'
    // },
    // {
    //     path: '/substation', // 光伏站页面
    //     component: stationView,
    //     name: 'stationPage'
    // },
    {
        path: '/centraly', // 光伏站页面
        component: layoutView,
        name: 'centralyPage',
        children: [
            {
                path: '/home', // 集控站首页
                component: homeView,
                name: 'homePage'
            },
            {
                path: '/substation', // 光伏站页面
                component: stationView,
                name: 'stationPage'
            },
            {
                path: '/alarm', // 告警查询
                component: alarmView,
                name: 'alarmPage'
            },
            {
                path: '/report', // 统计报表
                component: reportView,
                name: 'reportPage'
            }
        ]
    },
    {
        path: '/403',
        component: Forbidden,
        name: '403'
    },
    {
        path: '/404',
        component: NotFound,
        name: '404'
    },
    {
        path: '*',
        redirect: {
            name: '404'
        }
    }
]

export default defaultRouter;
