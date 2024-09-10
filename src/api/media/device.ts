import server from '@/utils/request'
import type { ProductType } from '@/views/media/Device/typings';

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
    // 更新通道
    updateChannels: (id: string) => server.post(`/media/device/${id}/channels/_sync`),
    // post查询产品列表
    queryProductList: (data: any) => server.post<ProductType[]>(`/device/product/_query/no-paging`, data),
    // get获取产品
    getProductList: (data: any) => server.get(`/device/product/_query/no-paging?paging=false`, data),
    // 快速添加产品
    saveProduct: (data: any) => server.post<any>(`/device/product`, data),
    // 产品发布
    deployProductById: (id: string) => server.post<any>(`/device/product/${id}/deploy`),
    // 查询设备接入配置
    queryProvider: (data?: any) => server.post<any>(`/gateway/device/detail/_query`, data),
    // 查询网关配置
    getConfiguration: (id: string, transport: string) => server.get<any>(`/protocol/${id}/${transport}/configuration`),
    //校验ID合法
    validateId: (id:string) => server.get<any>('/media/device/id/_validate',{id:id}),

    //视频分享地址
    getShare: (deviceId: string,channelId:string,data:any) => server.get<any>(`/media/device/${deviceId}/${channelId}/addresses`,data),
}