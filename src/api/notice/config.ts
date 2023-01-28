import { patch, post, get } from '@/utils/request'
import { BindConfig } from '@/views/notice/Template/types'

export default {
    // 列表
    list: (data: any) => post(`/notifier/config/_query`, data),
    // 不分页列表
    listNoPage: (data: any) => post<BindConfig>(`/notifier/config/_query/no-paging?paging=false`, data),
    // 详情
    detail: (id: string): any => get(`/notifier/config/${id}`),
    // 新增
    save: (data: any) => post(`/notifier/config`, data),
    // 修改
    update: (data: any) => patch(`/notifier/config`, data)
}