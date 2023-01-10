import server from '@/utils/request'

export const config = () => server.get(`/authorize/captcha/config`)

export const code = () => server.get(`/authorize/captcha/image?width=130&height=30`)

export const authLogin = (data) => server.post(`/authorize/login`, data)

export const getInitSet = () => server.get(`/user/settings/init`)

export const postInitSet = (data) => server.post(`/user/settings/init`, data)

export const systemVersion = () => server.get(`/system/version`)

export const bindInfo = () => server.get(`/application/sso/_all`)