import server from '@/utils/request'

export default {
    // 列表
    list: (data: any, id: string) => server.post(`/media/device/${id}/channel/_query`, data),
    // 详情
    detail: (id: string): any => server.get(`/media/channel/${id}`),
    // 验证通道ID是否存在
    validateField: (params: string): any => server.get(`/media/channel/channelId/_validate`, params),
    // 新增
    save: (data: any) => server.post(`/media/channel`, data),
    // 修改
    update: (data: any) => server.put(`/media/channel`, data),
    del: (id: string) => server.remove(`media/channel/${id}`),
}