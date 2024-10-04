import request from '../request.js'
import {http} from '../request.js'
import Qs from 'qs'
 // 获取用户信息列表
export function getUserList(params) {
    return request.windGet('/apis/sys-user/list-users', params)
}
// 添加用户
export function addUser(data) {
    return request.windPost('/apis/sys-user/sign-in', data)
}
// 编辑用户信息
export function editUser(data) {
    return request.windPost('/apis/sys-user/update', data)
}
// 删除用户
export function deleteUser(userIds) {
    return request.windGet('/apis/sys-user/remove-users', {userIds})
}
// 根据ID查询用户详细信息
export function detailUser(id) {
    return request.windGet('/apis/sys-user/get-user', {id})
}
// 重置该用户密码
export function resetPassword(data) {
    return request.windPost('/apis/sys-user/reset-password', data)
}
// 修改该用户密码
export function modifyPassword(data) {
    return request.windPost('/apis/sys-user/chg-password', data)
}
// 登录
export const userLogin = data => http({
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    url: '/apis/sys-user/login',
    // data
    data: Qs.stringify(data)
})

// 登出
export function userLogout(data) {
    return request.windPost('/apis/sys-user/logout', data)
}
