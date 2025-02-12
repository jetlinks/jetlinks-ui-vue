import { request } from '@jetlinks-web/core'

export const save = (orgId: string, data: any) =>  request.post(`/position/${orgId}/_create`, data)

export const update = (id: string, data: any) => request.patch(`/position/${id}/_save`, data)

export const detail = (id: string) => request.post('/position/_query/detail/no-paging', { terms: [{
    "column":"id",
    "termType":"eq",
    "value": id
  }]})
// 职位绑定用户
export const bindUser = (orgId: string, id: string, userIdList: Array<string>) => request.post(`/organization/${orgId}/position/${id}/users/_bind`, userIdList)
// 职位解绑用户
export const unbindUser = (orgId: string, id: string, userIdList: Array<string>) => request.post(`/organization/${orgId}/position/${id}/users/_unbind`, userIdList)

export const del = (id: string) => request.remove(`/position/${id}`)

export const getUser = (data: any) => request.post(`/user/detail/_query`, data)

export const queryPage = (data: any) => request.post('/position/_query/detail', data)

export const queryPageNoPage = (data?: any) => request.post('/position/_query/detail/no-paging', data)
