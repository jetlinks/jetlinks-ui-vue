import server from '@/utils/request'

export const restPassword = (id: string) => server.post(`/edge/operations/${id}/auth-user-password-reset/invoke`)

export const _control = (deviceId: string) => server.get(`/edge/remote/${deviceId}/url`)

export const _stopControl = (deviceId: string) => server.get(`/edge/remote/${deviceId}/stop`, {})


