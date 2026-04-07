import { request } from '@jetlinks-web/core'

export const getSsoBinds_api = (): any =>request.get(`/application/sso/me/bindings`)


// 修改登录用户信息
export const updateMeInfo_api = (data:object) => request.put(`/user/detail`,data);
// 修改登录用户密码
export const updateMepsd_api = (data:object) => request.put(`/user/passwd`,data);
// 重置登录用户密码（忘记密码）
export const resetPassword_api = (data: { password: string }) => request.post(`/user/passwd/_reset`, data);
// 第三方账号解绑
export const unBind_api = (appId: string) => request.post(`/application/sso/${appId}/unbind/me`,[]);
/**
 * 校验字段合法性
 * @param type 类型
 * @param name 值
 */
export const validateField_api =  (type: 'username' | 'password', name: string) => request.post(`/user/${type}/_validate`,name,{
    headers: {
        'Content-Type': 'text/plain'
    }
});
/**
 * 校验旧密码是否正确
 * @param password 旧密码
 */
export const checkOldPassword_api = (password:string) => request.post(`/user/me/password/_validate`,password,{
    headers: {
        'Content-Type': 'text/plain'
    }
});

// 我的订阅
// 查询当前用户可访问的通道配置
export const getAllNotice = () => request.get(`/notify/channel/all`);


// 当前登录用户权限信息
export const getMe_api = () => request.get<{ user: any, [key : string]: any }>(`/authorize/me`);
// 设置登录用户选择的页面
export const setView_api = (data:object) => request.patch(`/user/settings/view/user`, data);
// 当前登录用户选择的页面
export const getView_api = () => request.get(`/user/settings/view/user`);

/**
 * 查询创建的个人令牌
 * @param data 通用查询参数
 */
export const getCreatedPersonalTokens_api = (data:object) => request.post(`/personal/token/created/_query/no-paging`, data);

/**
 * 新增/编辑个人令牌
 * @param data 个人令牌信息
 */
export const savePersonalToken_api = (data:object) => request.post(`/personal/token/me/_save`, data);

/**
 * 删除个人令牌
 * @param tokenId 个人令牌ID
 */
export const deletePersonalToken_api = (tokenId: string) => request.remove(`/personal/token/me/${tokenId}`);

/** 用户身份：获取支持的身份提供商（如 email、mobile） */
export const getIdentityProviders_api = () => request.get<{ id: string; name: string }[]>(`/user/identity/providers`);

/** 用户身份：获取当前用户已绑定的身份列表（邮箱、手机号等） */
export const getSelfIdentities_api = () =>
  request.get<{ id: string; userId: string; provider: string; identity: string; boundTime?: number; isPrimary?: boolean }[]>(`/user/identity/_me`);

/** 用户身份：请求验证（如发送验证邮件/短信以绑定新邮箱或手机号） */
export const requestIdentityValidation_api = (data: { provider: string; identity: string; params?: Record<string, unknown> }) =>
  request.post<{ requestId: string; token: string; context?: Record<string, unknown>; intervalSeconds?: number }>(`/user/identity/_validation`, data);

/** 用户身份：确认验证（如邮箱/手机验证码确认绑定） */
export const confirmIdentityValidation_api = (
  provider: string,
  data: { requestId: string; token: string; context?: Record<string, unknown>; params?: Record<string, string> }
) => request.post(`/user/identity/${provider}/_confirm`, data);

/** 用户身份：解绑已绑定身份（如解绑邮箱/手机号），对应 UserIdentityController#unbind，body 为绑定ID列表 */
export const unbindIdentity_api = (provider: string, ids: string[]) =>
  request.post(`/user/identity/${provider}/_unbind`, ids);
