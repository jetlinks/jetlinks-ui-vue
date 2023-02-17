import server from '@/utils/request'

export default {
    // 列表
    list: (data: any) => server.post(`/media/device/_query/`, data),
    // 详情
    detail: (id: string): any => server.get(`/media/device/${id}`),
    // 新增
    save: (data: any) => server.post(`/media/device/${data.channel}`, data),
    // 修改
    update: (data: any) => server.put(`/media/device/${data.channel}/${data.id}`, data),
    del: (id: string) => server.remove(`/media/device/${id}`),
}