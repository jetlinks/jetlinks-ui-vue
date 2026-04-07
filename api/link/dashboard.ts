import { request } from '@jetlinks-web/core'

export const dashboard = (data: object) =>
    request.post(`/dashboard/_multi`, data);
export const productCount = (data: object) =>
    request.post(`/device-product/_count`, data);
export const getGeo = (data: object) =>
    request.post(`/geo/object/device/_search/geo.json`, data);
export const deviceCount = (data: object) =>
    request.get(`/device/instance/_count`, data);
export const requestNode = () => request.get(`/dashboard/cluster/nodes`);

export const serverNode = () => request.get(`/dashboard/cluster/nodes`);
