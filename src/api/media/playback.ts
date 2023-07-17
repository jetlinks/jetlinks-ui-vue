import server from '@/utils/request';
import { LocalStore } from '@/utils/comm';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { recordsItemType } from '@/views/media/Device/Playback/typings';

export default {
    // 开始直播
    ptzStart: (deviceId: string, channelId: string, type: string) =>
        `${BASE_API_PATH}/media/device/${deviceId}/${channelId}/live.${type}?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}`,

    // 查询设备通道详情
    queryDetail: (deviceId: string, data: any) => server.post(`/media/device/${deviceId}/channel/_query`, data),

    // 查询本地回放记录
    queryRecordLocal: (deviceId: string, channelId: string, data?: any) =>
        server.post<any>(`/media/device/${deviceId}/${channelId}/records/in-local`, data),

    // 下载到云端
    downloadRecord: (deviceId: string, channelId: string, data: any) =>
        server.post(`/media/device/${deviceId}/${channelId}/_record`, data),

    // 播放本地回放
    playbackLocal: (
        deviceId: string,
        channelId: string,
        suffix: string,
        startTime: string,
        endTime: string,
        speed: number = 1
    ) =>
        `${BASE_API_PATH}/media/device/${deviceId}/${channelId}/playback.${suffix}?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}&startTime=${startTime}&endTime=${endTime}&speed=${speed}`,

    // 本地录像播放控制
    playbackControl: (deviceId: string, channelId: string) =>
        server.post(`/media/device/${deviceId}/${channelId}/stream-control`),

    // 查询云端回放记录
    recordsInServer: (deviceId: string, channelId: string, data: any) =>
        server.post<recordsItemType[]>(`/media/device/${deviceId}/${channelId}/records/in-server`, data),

    // 查询云端回放文件信息
    recordsInServerFiles: (deviceId: string, channelId: string, data: any) =>
        server.post<recordsItemType[]>(`/media/device/${deviceId}/${channelId}/records/in-server/files`, data),

    // 播放云端回放
    playbackStart: (recordId: string) => `${BASE_API_PATH}/media/record/${recordId}.mp4?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}`,

    downLoadFile: (recordId: string) => `${BASE_API_PATH}/media/record/${recordId}.mp4?download=true&:X_Access_Token=${LocalStore.get(TOKEN_KEY)}`
}