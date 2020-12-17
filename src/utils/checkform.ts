export const checkEamil: any = (rule: any, value: any, cb: Function) => {
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
  if (regEmail.test(value)) {
    return cb()
  }
  cb(new Error('请输入合法的邮箱'))
}
export const checkMobile: any = (rule: any, value: any, cb: Function) => {
  const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
  if (regMobile.test(value)) {
    return cb()
  }
  cb(new Error('请输入合法的手机号'))
}