import { createService } from '@/api/server';
/**
 *  根据条件查询角色信息
 */
export const getUsers = (data: object) => {
  return createService({
    url: '/users',
    method: 'get',
    params: data
  });
};

/**
 *  修角色信息
 */
export const usersPut = (data: any) => {
  return createService({
    url: `users/${data.id}/state/${data.ms_state}`,
    method: 'put'
  });
};

/**
 * 添加用戶
 */
export const addUser = (data: object) => {
  return createService({
    url: '/users',
    method: 'post',
    data
  });
};

/**
 * 根据用户id查询用户信息
 */
export const getUserInfoByInfo = (id: string | number) => {
  return createService({
    url: `users/${id}`,
    method: 'get'
  });
};

/**
 * 根据用户id修改用户信息
 */
export const editUsersInfo = (data: any) => {
  return createService({
    url: `users/${data.id}`,
    method: 'put',
    data
  });
};

/**
 * 根据用户id删除用户信息
 */
export const deleteUserById = (id: string | number) => {
  return createService({
    url: `users/${id}`,
    method: 'delete'
  });
};

/**
 * 获取所有的角色列表数据
 *
 */
export const getAllRolesInfo = () => {
  return createService({
    url: 'roles',
    method: 'get'
  });
};

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
  });
};
