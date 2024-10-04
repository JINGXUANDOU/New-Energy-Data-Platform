import request from '../request.js'

// 获取光伏站基本信息列表--单站
export function getStationList(params) {
    return request.windGet('/apis/standard-data/pccp-info', params)
}

// 获取设备信息列表--单站
export function getDeviceList(params) {
    return request.windGet('/apis/standard-data/get-device', params)
}

// 获取设备测点信息列表--单站
export function getDeviceMeasureList(params) {
    return request.windGet('/apis/standard-data/get-semaphore', params)
}
// 获取量测值信息列表--单站
export function getMeteValueList(params) {
    return request.windGet('/apis/standard-data/value', params)
}

// 获取设备告警信息列表--单站
export function getDeviceAlarmList(params) {
    return request.windGet('/apis/standard-data/alarm-list', params)
}
// 获取某个站下的实时告警信息列表--单站
export function getStationAlarmList(params) {
    return request.windGet('/apis/standard-data/alarm-list-for-substation', params)
}
// 获取历史告警信息列表--单站
export function getHisToryAlarmList(params) {
    return request.windGet('/apis/standard-data/history-alarm-list', params)
}

// 获取趋势图（整站功率、逆变器功率、日发电量、月发电量、年发电量、总发电量） 按时间段   -- 单站
export function getTrendByType(params) {
    return request.windGet('/apis/standard-data/XXX', params)
}

// 获取发电量和收入的趋势图（月发电量、月收入） 按当年12个月   -- 单站
export function getElcAndPriceTrend(params) {
    return request.windGet('/apis/standard-data/XXX', params)
}




// ---------------------------------------集控首页-------------------------------------------------------------

// 获取多站概要统计信息（电站数量，总装机容量，日/月/年发电量等信息）--多站
export function getStationBrand(params) {
    return request.windGet('/apis/standard-data/getStationValue', params)
}

// 获取所有接入站的实时功率趋势（按时间算趋势）信息--多站 图表信息
export function getPowerByTime(params) {
    return request.windPost('/apis/XXXX', params)
}
// 获取所有接入站的发电量TOP信息--多站 图表信息
export function getElectricTop(params) {
    return request.windPost('/apis/query/electric-top', params)
}

// 获取所有接入站的装机容量分布占比信息（<1、1-5、5-20、>20）--多站 图表信息
export function getInstallCapRate(params) {
    return request.windPost('/apis/query/install-cap-rete', params)
}

// 获取所有接入站的不同装机容量下的能力差利用率（<1、1-5、5-20、>20）实际发电量/额定发电量   --多站 图表信息
export function getEffectiveByCap(params) {
    return request.windPost('/apis/query/effective-by-cap', params)
}
// 获取所有接入站的实时告警  --多站 列表信息
export function getAlarmByAllStation(params) {
    return request.windPost('/apis/query/alarm-by-all-station', params)
}

// 获取所有接入站的经纬度信息   --多站
export function getStationPosition(params) {
    return request.windPost('/apis/query/coordinate', params)
}
