import server from '@/utils/request';
import { BASE_API_PATH } from '@/utils/variable';

export const FIRMWARE_UPLOAD = `${BASE_API_PATH}/file/upload`;

export const save = (data: object) => server.post(`/firmware`, data);

export const update = (data: object) => server.patch(`/firmware`, data);

export const remove = (id: string) => server.remove(`/firmware/${id}`);

export const query = (data: object) => server.post(`/firmware/_query/`, data);

export const querySystemApi = (data?: object) =>
    server.post(`/system/config/scopes`, data);

export const task = (data: Record<string, unknown>) =>
    server.post(`/firmware/upgrade/task/detail/_query`, data);

export const queryTaskPaginateNot = (data:any)=> server.post('/firmware/upgrade/task/detail/_query/no-paging',data)

export const taskById = (id: string) =>
    server.get(`/firmware/upgrade/task/${id}`);

export const saveTask = (data: Record<string, unknown>) =>
    server.post(`/firmware/upgrade/task`, data);

export const deleteTask = (id: string) =>
    server.remove(`/firmware/upgrade/task/${id}`);

export const history = (data: Record<string, unknown>) =>
    server.post(`/firmware/upgrade/history/_query`, data);

export const historyPaginateNot =(data:Record<string,unknown>) =>
    server.post('/firmware/upgrade/history/_query/no-paging',data)


export const historyCount = (data: Record<string, unknown>) =>
    server.post(`/firmware/upgrade/history/_count`, data);

export const startTask = (id: string, data: string[]) =>
    server.post(`/firmware/upgrade/task/${id}/_start`, data);

export const stopTask = (id: string) =>
    server.post(`/firmware/upgrade/task/${id}/_stop`);

export const startOneTask = (data: string[]) =>
    server.post(`/firmware/upgrade/task/_start`, data);

export const stopOneTask = (data: string[]) => 
    server.post('/firmware/upgrade/task/_stop',data)
// export const queryProduct = (data?: any) =>
//     server.post(`/device-product/_query/no-paging`, data);
export const queryProduct = (data?: any) =>
    server.post(`/device-product/detail/_query/no-paging`, data);

export const queryDevice = () =>
    server.get(`/device/instance/_query/no-paging?paging=false`);

export const validateVersion = (
    productId: string,
    versionOrder: number | string,
) => server.get(`/firmware/${productId}/${versionOrder}/exists`);

export const queryDetailList = (data: Record<string, unknown>) =>
    server.post(`/device-instance/detail/_query`, data);

export const queryDetailListNoPaging = (data: Record<string, unknown>) =>
    server.post(`/device-instance/detail/_query/no-paging`, data);
