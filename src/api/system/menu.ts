import server from '@/utils/request'

export const queryOwnThree = (data: any) => server.post<any>('/menu/user-own/tree', data)