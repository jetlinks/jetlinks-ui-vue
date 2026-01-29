import {request} from '@jetlinks-web/core'

/**
 * API 接口管理接口
 */
export default {
    /**
     * 查询 API 接口列表（不分页）
     * @param data 查询参数
     */
    query: (data: any) => request.post('/open/api/spec/_query/no-paging', {
        ...data,
        paging: false,
    }),

    /**
     * 获取单个 API 接口详情
     * @param id API ID
     */
    detail: (id: string) => request.get(`/open/api/spec/${id}`),

    /**
     * 批量更新 API 接口的治理属性
     * @param data 更新数据 { ids: string[], fields: Record<string, any> }
     */
    batchUpdate: (data: any) => request.patch('/open/api/spec/_batch', data),

    /**
     * 更新单个 API 接口的治理属性
     * @param id API ID
     * @param data 更新数据
     */
    update: (id: string, data: any) => request.put(`/open/api/spec/${id}`, data),

    /**
     * 获取可用的权限列表（用于绑定）
     * @param data 查询参数
     */
    getPermissions: (data: any) => request.post('/permission/_query/no-paging', data),

}
