import { patch, post, get } from '@/utils/request'

export default {
    // 列表
    list: (data: any) => post(`/notifier/config/_query`, data),
    // 详情
    detail: (id: string): any => get(`/notifier/config/${id}`),
    // 新增
    save: (data: any) => post(`/notifier/config`, data),
    // 修改
    update: (data: any) => patch(`/notifier/config`, data)
}