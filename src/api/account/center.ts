import server from '@/utils/request'
import { BASE_API_PATH } from '@/utils/variable'

export const getSsoBinds_api = (): any =>server.get(`/application/sso/me/bindings`)

// 获取登录用户信息
export const getMeInfo_api = () => server.get(`/user/detail`);
// 修改登录用户信息
export const updateMeInfo_api = (data:object) => server.put(`/user/detail`,data);
// 修改登录用户密码
export const updateMepsd_api = (data:object) => server.put(`/user/passwd`,data);
// 第三方账号解绑
export const unBind_api = (appId: string) => server.request.post(`/application/sso/${appId}/unbind/me`);
/**
 * 校验字段合法性
 * @param type 类型
 * @param name 值
 */
export const validateField_api =  (type: 'username' | 'password', name: string) => server.post(`/user/${type}/_validate`,name,{},{
    headers: {
        'Content-Type': 'text/plain'
    }
});
/**
 * 校验旧密码是否正确
 * @param password 旧密码
 */
export const checkOldPassword_api = (password:string) => server.post(`/user/me/password/_validate`,password,{},{
    headers: {
        'Content-Type': 'text/plain'
    }
});
