import server from '@/utils/request';

// 设备数量
export const getDeviceCount_api = () => server.get(`/device/instance/_count`);
// 产品数量
export const getProductCount_api = (data) => server.post(`/device-product/_count`, data);
// 查询产品列表
export const getProductList_api = (data) => server.get(`/device/product/_query/no-paging?paging=false`, data);