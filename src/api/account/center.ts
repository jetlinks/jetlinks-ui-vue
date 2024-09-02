import { request } from '@jetlinks-web/core'

export const getSsoBinds_api = (): any =>request.get(`/application/sso/me/bindings`)


// 修改登录用户信息
export const updateMeInfo_api = (data:object) => request.put(`/user/detail`,data);
// 修改登录用户密码
export const updateMepsd_api = (data:object) => request.put(`/user/passwd`,data);
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

