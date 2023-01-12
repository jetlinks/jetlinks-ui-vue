import server from '@/utils/request'

export const queryNoPagingPost = (data: any) => server.post(`/device-product/_query/no-paging?paging=false`, data)