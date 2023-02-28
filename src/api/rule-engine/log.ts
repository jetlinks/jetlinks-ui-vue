import server from '@/utils/request';

/**
 * 获取产品列表
 */
export const getProductList  = (parmas?:any)  => server.get('/device/product/_query/no-paging?paging=false',parmas);

/**
 * 获取设备列表
 */
export const getDeviceList = (parmas?:any) => server.get('/device-instance/_query/no-paging?paging=false',parmas);

/**
 * 获取组织列表
 */
export const getOrgList = (parmas?:any) => server.get('/organization/_query/no-paging?paging=false',parmas);

/**
 * 搜索
 */
export const query = (data:any) => server.post('/alarm/record/_query/',data);