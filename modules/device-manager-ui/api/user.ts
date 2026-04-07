import { request } from '@jetlinks-web/core'

/**
 * 查询用户列表
 * @returns
 */
export const queryUserListNoPaging = () => request.post(`/user/_query/no-paging`, {
  paging: false,
  sorts: [{ name: 'name', order: "asc" }]
})
