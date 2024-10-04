<template>
	<div class="app">
		<router-view v-if="isRouterAlive"></router-view>
	</div>
</template>

<script>
import {userLogout} from '@/http/api/userManage';

export default {
    name: 'App',
    provide() {
        return {
            reload: this.reload,
            stationList: this.stationList,
        };
    },
    data() {
        return {
            isRouterAlive: true,
            stationList: []
        };
    },
    mounted() {
        sessionStorage.clear()
        this.$http.windGet('/apis/standard-data/pccp-info', {}).then(res => {
            if (res.data) {
                sessionStorage.setItem('sysId', res.data.alias)
                sessionStorage.setItem('sysName', res.data.sysName)
                res.data.subs.forEach(item => {
                    this.stationList.push({
                        id: item.data.key,
                        name: item.data.name,
                        value: '',
                        unit: 'kwh',
                        stationInfo: {
                            principalPeople: item.manager,
                            volatgePrice: item.price,
                            iphone: item.telephone,
                            incorporationTime: item.connectionDatetime,
                        }
                    })
                })
                sessionStorage.setItem('stationID', this.stationList[0].id)
                sessionStorage.setItem('stationName', this.stationList[0].name)
            }
        })
    },
	beforeDestroy() {
        sessionStorage.clear()
    },
	destroyed() {
		// 关闭浏览器执行退出接口
		window.removeEventListener('beforeunload', (e) =>
			this.beforeunloadHandler(e)
		);
		window.removeEventListener('unload', (e) => this.unloadHandler(e));
	},
	methods: {
		/**
		 * 重载页面 适合添加数据或者路由id改变
		 * */
		reload() {
			this.isRouterAlive = false;
			this.$nextTick(() => {
				this.isRouterAlive = true;
			});
		},
		// 退出登录接口
		async logout() {
			try {
				await userLogout();
			} catch (error) {
				console.log(error);
			}
		},
		// 关闭窗口之前执行
		beforeunloadHandler() {
			this.beforeUnload_time = new Date().getTime();
		},
		// 关闭窗口之后执行--暂时用不到
		async unloadHandler() {
			this.gap_time = new Date().getTime() - this.beforeUnload_time;
			// 判断是窗口关闭还是刷新 毫秒数判断 网上大部分写的是5
			if (this.gap_time <= 1) {
				await this.logout(); // 退出登录接口
			}
		}
	}
};
</script>

<style>
.app {
	width: 100vw;
	height: 100vh;
	min-width: 1600px;
	min-height: 810px;

	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
</style>
