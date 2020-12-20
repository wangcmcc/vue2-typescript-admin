import { Message } from 'element-ui'
// 成功的提示
export const msgCommon = (type: any, info: string) => {
  return Message({
    message: info,
    type: type
  })
}
