import request from '../request.js'

export function getRoleList(params) {
    return request.windGet('/apis/sys-user/list-roles', params)
}

export function saveRole(params) {
    return request.windPost('/apis/sys-user/add-role', params)
}

export function savePermission(params) {
    return request.windPost('/apis/sys-user/add-menu', params)
}

export function updatePermission(params) {
    return request.windPost('/apis/sys-user/update-menu', params)
}

export function updateRolePermission(params) {
    return request.windGet('/apis/sys-user/mount-menu', params)
}

export function deleteRole(params) {
    return request.windPost('/apis/sys-user/remove-role', params)
}

export function deletePermission(params) {
    return request.windPost('/apis/sys-user/remove-menu', params)
}

// 权限菜单/用户鉴权路由信息表
export function roleListMenus(params) {
    return request.windGet('/apis/sys-user/list-menus', params)
}
// 新增角色
export function newRole(params) {
    return request.windPost('/apis/sys-user/add-role', params)
}
// 根据ID查询角色详细信息
export function detailRoleInfo(id) {
    return request.windGet('/apis/sys-user/get-role-by-id', {roleId: id})
}
// 编辑角色
export function updateRole(params) {
    return request.windPost('/apis/sys-user/update-role', params)
}
