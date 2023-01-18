import server from '@/utils/request';
import { BASE_API_PATH } from '@/utils/variable';

export const NETWORK_CERTIFICATE_UPLOAD = `${BASE_API_PATH}/network/certificate/upload`;


export const save = (data: object) => server.post(`/network/certificate`, data);
