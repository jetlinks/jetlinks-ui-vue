import { patch, post, get, remove } from '@/utils/request'
import type { BindConfig } from '@/views/notice/Template/types'

export default {
    // 列表
    list: (data: any) => post(`/notifier/template/_query`, data),
    // 详情
    detail: (id: string): any => get(`/notifier/template/${id}`),
    // 新增
    save: (data: any) => post(`/notifier/template`, data),
    // 修改
    update: (data: any) => patch(`/notifier/template`, data),
    del: (id: any) => remove(`/notifier/template/${id}`),
    getConfig: (data: any) => post<BindConfig[]>(`/notifier/config/_query/no-paging?paging=false`, data),
    getTemplateDetail: (id: string) => get<any>(`/notifier/template/${id}/detail`),
    debug: (data: any, configId: string, templateId: string) => post(`/notifier/${configId}/${templateId}/_send`, data),
    getHistory: (data: any, id: string) => post(`/notify/history/template/${id}/_query`, data),
    // 钉钉/微信, 根据配置获取部门和用户
    getDept: (type: string, id: string) => get<any>(`/notifier/${type}/corp/${id}/departments`),
    getUser: (type: string, id: string) => get<any>(`/notifier/${type}/corp/${id}/users`),
    // 微信获取标签推送
    getTags: (id: string) => get<any>(`/notifier/wechat/corp/${id}/tags`),
    // 语音/短信获取阿里云模板
    getAliTemplate: (id: any) => get(`/notifier/sms/aliyun/${id}/templates`),
    // 短信获取签名
    getSigns: (id: any) => get(`/notifier/sms/aliyun/${id}/signs`),
    getListByConfigId: (id: string, data: any): any => post(`/notifier/template/${id}/_query`, data),
}