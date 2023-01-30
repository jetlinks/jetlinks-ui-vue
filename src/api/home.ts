import server from '@/utils/request';

// 当前登录用户权限信息
export const getMe_api = () => server.get(`/authorize/me`);
// 设置登录用户选择的页面
export const setView_api = (data:object) => server.patch(`/user/settings/view/user`, data);
// 当前登录用户选择的页面
export const getView_api = () => server.get(`/user/settings/view/user`);

// 设备数量
export const getDeviceCount_api = () => server.get(`/device/instance/_count`);
// 产品数量
export const getProductCount_api = (data:object) => server.post(`/device-product/_count`, data);
// 查询产品列表
export const getProductList_api = (data:object={}) => server.get(`/device/product/_query/no-paging?paging=false`, data);
// 查询设备列表
export const getDeviceList_api = (data:object) => server.post(`/device-instance/_query/`, data);
