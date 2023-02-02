import server from '@/utils/request'
import type { Agg, AggPlaying } from '@/views/media/DashBoard/typings'

export default {
    // 录像数量
    agg: () => server.get<Agg>(`/media/record/file/agg`),
    // 播放中数量
    aggPlaying: () => server.get<AggPlaying>(`/media/channel/playing/agg`),
    // 获取播放数量(人次)
    getPlayCount: (data: any) => server.post<any>(`/dashboard/_multi`, data),
}