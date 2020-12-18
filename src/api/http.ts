import { createService } from '@/api/server'
interface LoginData {
  username: string;
  password: string;
}

export const loginUser = (data: LoginData) => {
  return createService({
    url: '/login',
    method: 'post',
    data
  })
}

export const getMenus = () => {
  return createService({
    url: '/menus',
    method: 'get'
  })
}

export const getUsers = (data: object) => {
  return createService({
    url: '/users',
    method: 'get',
    params: data
  })
}

/**
 *  分配用户角色
 * @param {
 *   id: 用户id
 *   rid: 角色id
 * }
 */
export const saveUserRoleById = (userId: string, rid: string) => {
  return createService({
    url: `users/${userId}/role`,
    method: 'put',
    data: {
      rid: rid
    }
  })
}

export const usersPut = (data: any) => {
  return createService({
    url: `users/${data.id}/state/${data.ms_state}`,
    method: 'put'
  })
}

/**
 * 添加用戶
 */
export const addUser = (data: object) => {
  return createService({
    url: '/users',
    method: 'post',
    data
  })
}

/**
 * 根据用户id查询用户信息
 */
export const getUserInfoByInfo = (id: string | number) => {
  return createService({
    url: `users/${id}`,
    method: 'get'
  })
}

/**
 * 根据用户id修改用户信息
 */
export const editUsersInfo = (data: any) => {
  return createService({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 根据用户id删除用户信息
 */
export const deleteUserById = (id: string | number) => {
  return createService({
    url: `users/${id}`,
    method: 'delete'
  })
}

/**
 * 获取权限列表接口
 *   type {
 *    list --> 获取权限列表
 *    tree --> 获取属性结构的权限列表
 * }
 */
export const getRightsByType = (type: string) => {
  return createService({
    url: `rights/${type}`,
    method: 'get'
  })
}

/**
 * 获取所有的角色列表数据
 *
 */
export const getAllRolesInfo = () => {
  return createService({
    url: 'roles',
    method: 'get'
  })
}

/**
 * 添加角色
 *
 */
export const saveNewRole = (data: object) => {
  return createService({
    url: 'roles',
    method: 'post',
    data
  })
}

/**
 * 修改、编辑角色
 *
 */
export const editRoleById = (id: string, data: object) => {
  return createService({
    url: `roles/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除角色
 *
 */
export const deleteRoleById = (id: string) => {
  return createService({
    url: `roles/${id}`,
    method: 'delete'
  })
}

/**
 * 删除角色指定权限 roles/:roleId/rights/:rightId
 *  角色 ID  roleId
 *  权限  rightId
 */
export const deleteRolesRightById = (roleId: string, rightId: string) => {
  return createService({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

/**
 *  分配角色权限 roles/:roleId/rights
 *  角色 ID  roleId
 */
export const editRolesByIdrights = (id: string, data: any) => {
  return createService({
    url: `roles/${id}/rights`,
    method: 'post',
    data: {
      rids: data
    }
  })
}
