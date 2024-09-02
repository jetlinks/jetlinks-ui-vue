import { request } from '@jetlinks-web/core'

export default {
    // 列表
    list: (data: any) => request.post(`/notifier/template/_query`, data),
    // 详情
    detail: (id: string): any => request.get(`/notifier/template/${id}`),
    // 新增
    save: (data: any) => request.post(`/notifier/template`, data),
    // 修改
    update: (data: any) => request.patch(`/notifier/template`, data),
    del: (id: any) => request.remove(`/notifier/template/${id}`),
    getTemplateDetail: (id: string) => request.get<any>(`/notifier/template/${id}/detail`),
    debug: (data: any, configId: string, templateId: string) => request.post(`/notifier/${configId}/${templateId}/_send`, data),
    // 微信获取标签推送
    getTags: (id: string) => request.get<any>(`/notifier/wechat/corp/${id}/tags`),
    getListVariableByConfigId: (id: string, data?: any): any => request.post(`/notifier/template/${id}/detail/_query`, data),
}
