import server from '@/utils/request'
import type { CascadeItem } from '@/views/media/Cascade/typings'

export default {
    // 列表
    list: (data: any) => server.post<any>(`/media/gb28181-cascade/_query`, data),
    // 列表字段通道数量, 来自下面接口的total
    queryCount: (id: string) => server.post<any>(`/media/gb28181-cascade/${id}/bindings/_query`),
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

}