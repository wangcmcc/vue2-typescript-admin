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
