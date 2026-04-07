import { request } from '@jetlinks-web/core'

// 当前登录用户权限信息
export const getMe_api = () => request.get(`/authorize/me`);
