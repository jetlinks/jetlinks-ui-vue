// 仪表盘数据
import server from '@/utils/request'
/**
 * 项目数量
 */
export const productCount = (data?:any) => server.post(`/device-product/_count`,data);
/**
 * 设备数量
 */
export const deviceCount = (data?:any) => server.get('/device/instance/_count',data);
/**
 * 当前在线
 */
export const dashboard = (data?:any) => server.post('/dashboard/_multi',data);
/**
 * 地图数据
 */
export const getGo = (data?:any) => server.post('/geo/object/device/_search/geo.json')