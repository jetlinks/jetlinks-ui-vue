import server from '@/utils/request'

export const deleteMetadata = (deviceId: string) => server.remove(`/device-instance/${deviceId}/metadata`)