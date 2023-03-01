import server from '@/utils/request'

export const getSsoBinds_api = (): any =>server.get(`/application/sso/me/bindings`)
