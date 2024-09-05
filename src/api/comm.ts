import { request } from '@jetlinks-web/core'
import {getToken} from "@jetlinks-web/utils";
import {BASE_API, TOKEN_KEY_URL} from '@jetlinks-web/constants';

export const FileStatic = '/file/upload'
export const FileStaticPath = `${BASE_API}/${FileStatic}`
export const getFileUrlById = (id: string) => `${BASE_API}/file/${id}?${TOKEN_KEY_URL}=${getToken()}`
export const fileUpload = (data: any) => request.post(FileStatic, data)

/**
 * 保存查询记录
 * @param data
 * @param target
 */
export const saveSearchHistory = (data: any, target:string) => request.post(`/user/settings/${target}`, data)

/**
 * 获取查询记录
 * @param target
 */
export const getSearchHistory = (target:string) => request.get(`/user/settings/${target}`)

/**
 * 删除指定查询记录
 * @param id
 * @param target
 */
export const deleteSearchHistory = (target:string, id:string) => request.remove(`/user/settings/${target}/${id}`)

