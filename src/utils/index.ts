// 通过递归获取角色下三级权限的id
export const getLeafKeys = (node: any, arr: Array<any>) => {
  if (!node.children) {
      return arr.push(node.id)
  }
  node.children.forEach((item: any) => {
    getLeafKeys(item, arr)
  });
}