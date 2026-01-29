import {request} from '@jetlinks-web/core'

/**
 * API 分组管理接口
 */
export default {
    /**
     * 查询 API 分组列表
     * @param data 查询参数
     */
    query: (data: any) => request.post('/open/api/group/detail/_query', data),

    /**
     * 获取 API 分组详情（标准接口）
     * @param id 分组 ID
     */
    getById: (id: string) => request.get(`/open/api/group/${id}`),

    /**
     * 获取 API 分组详情（旧接口，包含 API 文档详情）
     * @param id 分组 ID
     * @param specification 是否查询API文档详情
     */
    detail: (id: string, specification: boolean = true) => request.post(`/open/api/group/detail/_query/no-paging?specification=${specification}`, {
        terms: [{column: 'id', value: id}],
        paging: false,
    }),

    /**
     * 创建 API 分组（绑定到应用）
     * @param appId 应用 ID
     * @param data 分组数据
     */
    saveWithApp: (appId: string, data: any) => request.post(`/open/api/group/${appId}/_save`, data),

    /**
     * 创建 API 分组（不绑定应用）
     * @param data 分组数据
     */
    save: (data: any) => request.post('/open/api/group', data),

    /**
     * 更新 API 分组
     * @param data 分组数据
     */
    update: (id: string, data: any) => request.put(`/open/api/group/${id}`, data),

    /**
     * 删除 API 分组
     * @param id 分组 ID
     */
    delete: (id: string) => request.remove(`/open/api/group/${id}`),

    /**
     * 查询可用的 API 操作列表（从api_spec表查询）
     * @param data 查询参数
     */
    queryOperations: (data?: any) => request.post('/open/api/spec/_query/no-paging', data || {}),

    /**
     * 查询按group分组的 API 操作列表（后端直接返回分组数据）
     * @param data 查询参数，包含 group 参数用于后端分组
     */
    queryGroupedOperations: (data?: any) => request.post('/open/api/spec/_query/no-paging', data || {}),

    /**
     * 根据应用 ID 查询已绑定的 API 分组
     * @param appId 应用 ID
     * @param data 查询参数
     */
    queryByApp: (appId: string, data: any) => request.post(`/open/api/group/app/${appId}/_query`, data),
}