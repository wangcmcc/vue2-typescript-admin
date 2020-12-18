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
