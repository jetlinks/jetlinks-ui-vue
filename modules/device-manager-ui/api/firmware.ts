import { request } from '@jetlinks-web/core'

export const save = (data: object) => request.post(`/firmware`, data);

export const update = (data: object) => request.patch(`/firmware`, data);

export const remove = (id: string) => request.remove(`/firmware/${id}`);

export const query = (data: object) => request.post(`/firmware/_query/`, data);

export const queryPaginateNot = (data: object) => request.post('/firmware/_query/no-paging',data)

export const querySystemApi = (data?: object) =>
    request.post(`/system/config/scopes`, data);

export const task = (data: Record<string, unknown>) =>
    request.post(`/firmware/upgrade/task/detail/_query`, data);

export const queryTaskPaginateNot = (data:any)=> request.post('/firmware/upgrade/task/detail/_query/no-paging',data)

export const taskById = (id: string) =>
    request.get(`/firmware/upgrade/task/${id}`);

export const saveTask = (data: Record<string, unknown>) =>
    request.post(`/firmware/upgrade/task`, data);

export const deleteTask = (id: string) =>
    request.remove(`/firmware/upgrade/task/${id}`);

export const history = (data: Record<string, unknown>) =>
    request.post(`/firmware/upgrade/history/_query`, data);

export const historyPaginateNot =(data:Record<string,unknown>) =>
    request.post('/firmware/upgrade/history/detail/_query/no-paging',data)


export const historyCount = (data: Record<string, unknown>) =>
    request.post(`/firmware/upgrade/history/_count`, data);

export const startTask = (id: string, data: string[]) =>
    request.post(`/firmware/upgrade/task/${id}/_start`, data);

export const stopTask = (id: string, data: string[]) =>
    request.post(`/firmware/upgrade/task/${id}/_stop`, data);

export const startOneTask = (data: string[]) =>
    request.post(`/firmware/upgrade/task/_start`, data);

export const stopOneTask = (data: string[]) =>
    request.post('/firmware/upgrade/task/_stop',data)
// export const queryProduct = (data?: any) =>
//     request.post(`/device-product/_query/no-paging`, data);
export const queryProduct = (data?: any) =>
    request.post(`/device-product/detail/_query/no-paging`, data);

export const queryDevice = () =>
    request.get(`/device/instance/_query/no-paging?paging=false`);

export const validateVersion = (
    productId: string,
    versionOrder: number | string,
) => request.get(`/firmware/${productId}/${versionOrder}/exists`);

export const queryDetailList = (data: Record<string, unknown>, params?: Record<string, unknown>) => {
    return request.post(`/device-instance/detail/_query`, data, {params});
}

export const queryDetailListNoPaging = (data: Record<string, unknown>) =>
    request.post(`/device-instance/detail/_query/no-paging`, data);

export const deleteHistory = (id: string) => 
    request.remove(`/firmware/upgrade/history/${id}`);
