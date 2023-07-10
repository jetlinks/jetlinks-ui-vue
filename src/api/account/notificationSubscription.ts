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

// 判断获取当前用户绑定信
export const getIsBindThird = () => server.get(`/user/third-party/me`);

// 生成OAuth2授权URL
export const getWechatOAuth2 = (configId: string, templateId: string, url: string) => server.get(`/notifier/wechat/corp/${configId}/${templateId}/oauth2/binding-user-url?redirectUri=${url}`);

export const getDingTalkOAuth2 = (configId: string, url: string) => server.get(`/notifier/dingtalk/corp/${configId}/oauth2/binding-user-url?authCode=${url}`);

// 获取oauth2授权的用户绑定码

export const getUserBind = (type: 'wechat' | 'dingtalk', params: any) => server.get(`/notifier/${type}/corp/oauth2/user-bind-code`, params);

// 根据绑定码绑定当前用户
export const bindThirdParty = (type: string, provider: string, bindCode: string) => server.post(`/user/third-party/me/${type}/${provider}/${bindCode}/_bind`);




