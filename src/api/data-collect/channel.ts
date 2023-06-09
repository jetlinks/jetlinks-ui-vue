import server from '@/utils/request';

export const query = (data: any) =>
    server.post(`/data-collect/channel/_query`, data);

export const remove = (id: string) =>
    server.remove(`/data-collect/channel/${id}`);

export const save = (data: any) => server.post(`/data-collect/channel`, data);

export const update = (id: string, data: any) =>
    server.put(`/data-collect/channel/${id}`, data);

export const getProviders = () => server.get(`/gateway/device/providers`);

export const queryOptionsList = (type: string) =>
    server.get(`/data-collect/opc/${type}`);

export const validateField = (data: any) =>
    server.post(`/data-collect/opc/endpoint/_validate`, data, null, {
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
        },
    });

export const queryCertificateList = () =>
    server.get(`/network/certificate/_query/no-paging?paging=false`, {});
