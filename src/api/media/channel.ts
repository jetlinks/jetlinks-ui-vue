import server from '@/utils/request';
import { LocalStore } from '@/utils/comm';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';

export default {
    // 列表
    list: (data: any, id: string) => server.post(`/media/device/${id}/channel/_query`, data),
    // 详情
    detail: (id: string): any => server.get(`/media/channel/${id}`),
    // 验证通道ID是否存在
    validateField: (params: any): any => server.get(`/media/channel/channelId/_validate`, params),
    // 新增
    save: (data: any) => server.post(`/media/channel`, data),
    // 修改
    update: (id: string, data: any) => server.put(`/media/channel/${id}`, data),
    // 删除
    del: (id: string) => server.remove(`/media/channel/${id}`),

    // 查询树形数据
    queryTree: (id: string, data?: any) => server.post(`/media/device/${id}/catalog/_query/tree`, data),

    // ========== 视频播放 ==========
    // 开始直播
    ptzStart: (deviceId: string, channelId: string, type: string) =>
        `${BASE_API_PATH}/media/device/${deviceId}/${channelId}/live.${type}?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}`,

    // 云台控制-停止
    ptzStop: (deviceId: string, channelId: string) => server.post(`/media/device/${deviceId}/${channelId}/_ptz/STOP`),

    // 云台控制-缩放、转向等
    ptzTool: (deviceId: string, channelId: string, direct: string, speed: number = 90) =>
        server.post(`/media/device/${deviceId}/${channelId}/_ptz/${direct}/${speed}`),

    // 重置
    mediaStop: (deviceId: string, channelId: string) => server.post(`/media/device/${deviceId}/${channelId}/_stop`),

    // 查询是否正在录像
    ptzIsRecord: (deviceId: string, channelId: string) => server.get(`/media/device/${deviceId}/${channelId}/live/recording`),

    // 开始录像
    recordStart: (deviceId: string, channelId: string, data: any) =>
        server.post(`/media/device/${deviceId}/${channelId}/_record`, data),

    // 停止录像
    recordStop: (deviceId: string, channelId: string, data?: any) =>
        server.post(`/media/device/${deviceId}/${channelId}/_stop-record`, data),

    // 查询本地回放记录
    queryRecordLocal: (deviceId: string, channelId: string, data: any) =>
        server.post(`/media/device/${deviceId}/${channelId}/records/in-local`, data),

    // 播放本地回放
    playbackLocal: (deviceId: string, channelId: string, suffix: string) =>
        server.get(`/media/device/${deviceId}/${channelId}/playback.${suffix}`),

    // 本地录像播放控制
    playbackControl: (deviceId: string, channelId: string) =>
        server.post(`/media/device/${deviceId}/${channelId}/stream-control`),

    // 查询云端回放记录
    recordsInServer: (deviceId: string, channelId: string) =>
        server.post(`/media/device/${deviceId}/${channelId}/records/in-server`),

    // 查询云端回放文件信息
    recordsInServerFiles: (deviceId: string, channelId: string) =>
        server.post(`/media/device/${deviceId}/${channelId}/records/in-server/files`),

    // 播放云端回放
    playbackStart: (recordId: string) => server.get(`/media/record/${recordId}.mp4`),

    // 设备预置位相关接口
    opFunction: (deviceId: string, functionId: string, data?: any) => server.post(`/device/invoked/${deviceId}/function/${functionId}`, data),

    broadcastPushUrl: (deviceId: string, channelId: string) => `${BASE_API_PATH}/media/device/${deviceId}/${channelId}/broadcast/_push`,
    broadcastPush: (deviceId: string, channelId: string, data: any) => server.post(`/media/device/${deviceId}/${channelId}/broadcast/_push`, data, {}, {
        responseType: 'json',
        headers:{
            'Content-Type':'text/plain;charset=utf-8'
        }}),

    broadcastStart: (deviceId: string, channelId: string, extra: any) => server.post(`/media/device/${deviceId}/${channelId}/broadcast/_start`, {}, {}, extra),
    broadcastStop: (deviceId: string, channelId: string) => server.post(`/media/device/${deviceId}/${channelId}/broadcast/_stop`, {}),

}
