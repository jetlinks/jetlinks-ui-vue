import server from '@/utils/request'

export default {
    // 列表
    list: (data: any, id: string) => server.post(`/media/gb28181-cascade/_query`, data),
    // 列表字段通道数量, 来自下面接口的total
    queryCount: (id: string) => server.post(`/media/gb28181-cascade/${id}/bindings/_query`),
    // 详情
    detail: (id: string): any => server.get(`/media/gb28181-cascade/${id}`),
    // 新增
    save: (data: any) => server.post(`/media/gb28181-cascade`, data),
    // 修改
    update: (id: string, data: any) => server.put(`/media/gb28181-cascade/${id}`, data),
    // 删除
    del: (id: string) => server.remove(`media/gb28181-cascade/${id}`),
}