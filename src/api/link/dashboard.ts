import server from '@/utils/request';

export const dashboard = (data: object) =>
    server.post(`/dashboard/_multi`, data);
export const productCount = (data: object) =>
    server.post(`/device-product/_count`, data);
export const getGeo = (data: object) =>
    server.post(`/geo/object/device/_search/geo.json`, data);
export const deviceCount = (data: object) =>
    server.get(`/device/instance/_count`, data);
export const serverNode = (data: object) =>
    server.get(`/dashboard/cluster/nodes`, data);
