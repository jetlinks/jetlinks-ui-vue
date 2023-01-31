import server from '@/utils/request';
import { BASE_API_PATH } from '@/utils/variable';

export const NETWORK_CERTIFICATE_UPLOAD = `${BASE_API_PATH}/network/certificate/upload`;


export const save = (data: object) => server.post(`/network/certificate`, data);

export const update = (data: object) => server.patch(`/network/certificate`, data);

export const query = (data: object) => server.post(`/network/certificate/_query`, data);

export const queryDetail = (id: string) => server.get(`/network/certificate/${id}`);

export const remove = (id: string) => server.remove(`/network/certificate/${id}`);

