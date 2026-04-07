import { request } from '@jetlinks-web/core'

export default {
    // 列表
    list: (data: any) => request.post(`/notifier/config/_query`, data),
    // 详情
    detail: (id: string): any => request.get(`/notifier/config/${id}`),
    // 新增
    save: (data: any) => request.post(`/notifier/config`, data),
    // 修改
    update: (data: any) => request.patch(`/notifier/config`, data),
    del: (id: string) => request.remove(`/notifier/config/${id}`),
    debug: (data: any, configId: string, templateId: string) => request.post(`/notifier/${configId}/${templateId}/_send`, data),
}
