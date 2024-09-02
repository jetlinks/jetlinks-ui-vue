import { request } from '@jetlinks-web/core';

// 获取全部地区(树结构)
export const getRegionTree = (data?: any): Promise<any> => request.post(`/area/_all/tree`, data);

// 校验名称是否存在
export const validateName = (name: string, id?: string): Promise<any> => request.get(`/area/name/_validate?name=${name}${id ? `&id=${id}` : ''}`);

//校验行政区划代码是否存在
export const validateCode = (code: string, id?: string): Promise<any> => request.get(`/area/code/_validate?code=${code}${id ? `&id=${id}` : ''}`);

// 删除
export const delRegion = (id: string): Promise<any> => request.remove(`/area/${id}`);

// 保存
export const saveRegion = (data: any): Promise<any> => request.post(`/area`, data);

// 更新
export const updateRegion = (data: any): Promise<any> => request.patch(`/area`, data);

// 获取全部内置地区(树结构)
export const getBuiltinRegionTree = (data: any): Promise<any> => request.post(`/area/builtin/_all/tree`, data);
