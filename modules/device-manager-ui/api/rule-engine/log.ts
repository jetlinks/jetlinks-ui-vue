import { request } from '@jetlinks-web/core'

/**
 * 获取产品列表
 */
export const getProductList  = (parmas?:any)  => request.get('/device/product/_query/no-paging?paging=false',parmas);

/**
 * 获取设备列表
 */
export const getDeviceList = (parmas?:any) => request.get('/device-instance/_query/no-paging?paging=false',parmas);

/**
 * 获取有设备的告警的产品名称
 */
export const getAlarmProduct = (parmas:any) => request.post('/device-instance/_query',parmas)

/**
 * 获取组织列表
 */
export const getOrgList = (parmas?:any) => request.get('/organization/_query/no-paging?paging=false',parmas);

/**
 * 搜索
 */
export const query = (data:any) => request.post('/alarm/record/_query/',data);

/**
 * 设备产品专用查询
 * @param data
 * @returns
 */
export const queryByDevice = (data:any) => request.post(`/alarm/record/device/_query`,data)

/**
 * 告警处理
 */
export const handleLog = (data:any) => request.post('/alarm/record/_handle',data);

/**
 *
 * 预处理告警处理
 */
export const handlePreconditioning = (data:any) => request.post(`/alarm/record/device/_handle`,data)

/**
 * 告警记录
 */
export const detail = (id:string) => request.get(`/alarm/record/${id}`);

/**
 * 告警历史记录
 */
export const queryHistoryLogList = (alarmConfigId: string, data:any) => request.post(`/alarm/history/${alarmConfigId}/_query`,data);

/**
 * 告警日志
 */
export const queryHistoryList = (data:any) => request.post('/alarm/history/_query',data);


/**
 * 获取告警处理结果
 */
export const queryHandleHistory = (data:any) => request.post('/alarm/record/handle-history/_query',data);

/**
 * 获取预处理数据告警处理结果
 */
// export const queryPreHandleHistory = (recordId:any,data:any) => request.post(`/alarm/record/handle-history/device/${recordId}/_query`,data)
export const queryPreHandleHistory = (recordId:any,data:any) => request.post(`/alarm/record/${recordId}/handle-history/_query`,data)

/**
 * 获取告警日志（新）
 */
export const queryLogList = (alarmConfigId:any,data:any) => request.post(`/alarm/history/alarm-record/${alarmConfigId}/_query`,data)


/**
 * 获取告警日志（新）
 */
// export const queryLogList = (alarmConfigId:any,data:any) => request.post(`/alarm/history/${alarmConfigId}/_query`,data)

/**
 * 获取预处理数据告警日志
 */
export const queryPreconditioningLogList = (alarmConfigId:any,data:any) => request.post(`/alarm/history/device/${alarmConfigId}/_query`,data)

/**
 * 查询无效数据
 */
export const queryInvalidData = (data:any) => request.post('/message/preprocessor/invalid/_query',data)
