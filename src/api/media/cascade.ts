import server from '@/utils/request'
import type { CascadeItem } from '@/views/media/Cascade/typings'

export default {
    // 列表
    list: (data: any) => server.post<any>(`/media/gb28181-cascade/_query`, data),
    // 详情
    detail: (id: string): any => server.get(`/media/gb28181-cascade/${id}`),
    // 新增
    save: (data: any) => server.post(`/media/gb28181-cascade`, data),
    // 修改
    // update: (id: string, data: any) => server.put(`/media/gb28181-cascade/${id}`, data),
    update: (data: any) => server.patch(`/media/gb28181-cascade`, data),
    // 删除
    del: (id: string) => server.remove(`media/gb28181-cascade/${id}`),
    // 禁用
    disabled: (id: string) => server.post<any>(`/media/gb28181-cascade/${id}/_disabled`),
    // 启用
    enabled: (id: string) => server.post<any>(`/media/gb28181-cascade/${id}/_enabled`),

    // 新增/编辑 
    // 获取集群节点
    clusters: () => server.get<any>(`/network/resources/clusters`),
    // SIP本地地址
    all: () => server.get<any>(`/network/resources/alive/_all`),

    // 查询已绑定的通道, list列表字段通道数量, 来自下面接口的total
    queryBindChannel: (id: string, data: any) => server.post<any>(`/media/gb28181-cascade/${id}/bindings/_query`, data),
    // 绑定通道
    bindChannel: (id: string, data: string[]) => server.post<any>(`/media/gb28181-cascade/${id}/_bind`, data),
    // 解绑
    unbindChannel: (id: string, data: string[]) => server.post<any>(`/media/gb28181-cascade/${id}/_unbind`, data),
    // 验证国标ID是否存在
    validateField: (id: string, data: string[]): any => server.post(`/media/gb28181-cascade/${id}/gbChannelId/_validate`, data),
    // 更改国标ID
    updateGbChannelId: (id: string, data: any): any => server.post(`/media/gb28181-cascade/binding/${id}`, data),

}