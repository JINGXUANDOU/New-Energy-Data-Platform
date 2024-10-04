import request from '../request.js'

// 获取光伏站基本信息列表--单站
export function getReports(params) {
    return request.windGet('/apis/njdl/report/List', params)
}

