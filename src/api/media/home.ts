import server from '@/utils/request'

export default {
    // 设备数量
    deviceCount: (params: any) => server.get<number>(`/media/device/_count`, params),
    // 通道数量
    channelCount: (data: any) => server.post<number>(`/media/channel/_count`, data),

}