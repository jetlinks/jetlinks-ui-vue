import server from '@/utils/request'

// 获取通知订阅列表
export const getNoticeList_api = () => server.post(`/notifications/subscriptions/_query/`);
// 保存通知订阅
export const save_api = (data:any) => server.patch(`/notifications/subscribe`, data);
// 保存通知订阅
export const remove_api = (id:string) => server.remove(`/notifications/subscription/${id}`);
/**
 * 改变订阅的状态
 * @param id 对象id
 * @param status 改变后的状态
 */
export const changeStatus_api = (id: string, status: '_disabled' | '_enabled') => server.put(`/notifications/subscription/${id}/${status}`);
// 获取订阅类型
export const getTypeList_api = () => server.get(`/notifications/providers`);

// 获取告警规则列表
export const getAlarmList_api = () => server.post(`/alarm/config/_query/no-paging`, {
    sorts: [{ name: 'createTime', order: 'desc' }],
    paging: false,
});
