import server from '@/utils/request';

// 设备数量
export const getDeviceCount_api = () => server.get(`/device/instance/_count`);
// 产品数量
export const getProductCount_api = (data) => server.post(`/device-product/_count`, data);
