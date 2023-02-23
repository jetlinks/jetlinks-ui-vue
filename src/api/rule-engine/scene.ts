import server from '@/utils/request';


export const modify = (id: string, data: any) => server.put(`/scene/${id}`, data)

export const save = (data: any) => server.post(`/scene`, data)

export const detail = (id: string) => server.get(`/scene/${id}`)