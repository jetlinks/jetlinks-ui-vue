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
 * 获取有设备的告警的产品名称
 */ 
export const getAlarmProduct = (parmas:any) => server.post('/device-instance/_query',parmas) 

/**
 * 获取组织列表
 */
export const getOrgList = (parmas?:any) => server.get('/organization/_query/no-paging?paging=false',parmas);

/**
 * 搜索
 */
export const query = (data:any) => server.post('/alarm/record/_query/',data);

/**
 * 告警处理
 */
export const handleLog = (data:any) => server.post('/alarm/record/_handle',data);

/**
 * 告警记录
 */
export const detail = (id:string) => server.get(`/alarm/record/${id}`);

/**
 * 告警历史记录
 */
export const queryHistoryLogList = (alarmConfigId: string, data:any) => server.post(`/alarm/history/${alarmConfigId}/_query`,data);

/**
 * 告警日志
 */
export const queryHistoryList = (data:any) => server.post('/alarm/history/_query',data);


/**
 * 获取告警处理结果
 */
export const queryHandleHistory = (data:any) => server.post('/alarm/record/handle-history/_query',data);

/**
 * 获取告警日志（新）
 */
export const queryLogList = (alarmConfigId:any,data:any) => server.post(`/alarm/history/${alarmConfigId}/_query`,data)

/**
 * 查询无效数据
 */
export const queryInvalidData = (data:any) => server.post('/threshold/invalid/record/_query/pager',data)