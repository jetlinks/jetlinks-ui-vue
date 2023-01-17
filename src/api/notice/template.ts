import { patch, post, get } from '@/utils/request'

export default {
    // 列表
    list: (data: any) => post(`/notifier/template/_query`, data),
    // 详情
    detail: (id: string): any => get(`/notifier/template/${id}`),
    // 新增
    save: (data: any) => post(`/notifier/template`, data),
    // 修改
    update: (data: any) => patch(`/notifier/template`, data)
}