import server from '@/utils/request'

export const restPassword = (id: string) => server.post(`/edge/operations/${id}/auth-user-password-reset/invoke`)

export const _control = (deviceId: string) => server.get(`/edge/remote/${deviceId}/url`)

export const _stopControl = (deviceId: string) => server.post(`/edge/remote/${deviceId}/stop`)

export const getRemoteProxyUrl = (deviceId: string) => server.post(`/edge/device/${deviceId}/_proxy/_start?timeoutMinute=10`)

export const getRemoteToken = (deviceId: string) => server.post(`/edge/device/${deviceId}/token`)


