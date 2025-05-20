import { request } from '@jetlinks-web/core'

// 获取部门数据
export const getTreeData_api = (data: object) => request.post(`/organization/_all/tree`, data);

