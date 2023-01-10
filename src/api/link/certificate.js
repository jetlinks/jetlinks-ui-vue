import server from '@/utils/request'

export const save = (data) => server.post(`/network/certificate`, data)