import { post } from '@/api/server'

export const loginUser = (data: object) => {
  return post('/login', data)
}
