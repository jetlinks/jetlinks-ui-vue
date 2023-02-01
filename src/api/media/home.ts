import server from '@/utils/request'

export default {
    // 设备数量
    deviceCount: () => server.get<number>(`/media/device/_count`),
    // 通道数量
    channelCount: () => server.post<number>(`/media/channel/_count`),

}