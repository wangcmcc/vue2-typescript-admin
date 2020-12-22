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
