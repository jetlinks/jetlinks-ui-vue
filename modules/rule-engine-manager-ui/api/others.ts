import { request  } from "@jetlinks-web/core";

/**
 * 根据设备ID获取设备详情
 * @param id 设备ID
 * @returns 设备详情
 */
export const detail = (id: string, _hideError?: any) => request.get(`/device-instance/${id}/detail`)

/**
 * 不分页查询设备
 * @param data
 * @returns
 */
export const queryNoPagingPost = (data?: Record<string, any>) => request.post('/device-instance/_query/no-paging?paging=false', {...data, paging: false})

/**
 * 查询数据
 * @param data 分页搜索数据
 * @returns
 */
export const query = (data?: Record<string, any>) => request.post('/device-instance/_query', data)

// 获取所有关系
export const getRelationUsers = (data: any) => request.post<any>(`/relation/_query/no-paging`, data)

// 获取所有平台用户
export const getPlatformUsers = (data: any) => request.post<any>(`/user/_query/no-paging`, data)

/**
 * 获取网关类型
 */
export const getProviders = (terms?:any) => request.get('/gateway/device/providers',terms)

/**
  * 获取接入方式
  * @param data 查询条件
  */
const defaultGatewayData = {
    paging: false,
    sorts: [
     {
      name: 'createTime',
      order: 'desc',
     },
    ],
   }
   export const queryGatewayList = (data: any = defaultGatewayData) => request.post('/gateway/device/_query/no-paging', data)

/**
  * 查询产品列表(分页)
  * @param data 查询条件
  */
 export const queryProductList = (data: any) => request.post('/device-product/_query', data)

 /**
 * 根据产品ID获取产品详情
 * @param id 产品ID
 * @returns
 */
export const productDetail = (id: string) => request.get(`/device-product/${id}`)

// 获取部门数据
export const getTreeData_api = (data: object) => request.post(`/organization/_all/tree`, data);

/**
 * 查询产品分类树形数据
 */

export const queryProductSortTree = (params?: Record<string, any>) => request.post('/device/category/_tree', params)


// 通知列表
export const queryNoticeList = (data: any) => request.post(`/notifier/config/_query`, data)


//
export const  queryDingTalkUsers = (id: string) => request.get<any>(`/notifier/dingtalk/corp/${id}/users?sorts[0].name="name"&sorts[0].order=asc`)

//
export const  queryWechatUsers =  (id: string) => request.get<any>(`/notifier/wechat/corp/${id}/users?sorts[0].name="name"&sorts[0].order=asc`)

  // 钉钉部门
export const dingTalkDept = (id: string) => request.get<any>(`/notifier/dingtalk/corp/${id}/departments/tree`)

// 微信部门
export const weChatDept = (id: string) => request.get<any>(`/notifier/wechat/corp/${id}/departments`)

//获取模板列表
export const queryTemplateList = (data: any) => request.post(`/notifier/template/_query`, data)

export const getTemplateDetail = (id: string) => request.get<any>(`/notifier/template/${id}/detail`)

// 微信获取标签推送
export const getTags = (id: string) => request.get<any>(`/notifier/wechat/corp/${id}/tags`)

// 通知模板详情
export const queryTemplateDetail = (id: string) => request.get(`/notifier/template/${id}`)

export const getListByConfigId = (id: string, data: any): any => request.post(`/notifier/template/${id}/_query`, data)
// 钉钉/微信, 根据配置获取部门和用户
export const getDept = (type: string, id: string) => request.get<any>(`/notifier/${type}/corp/${id}/departments`)

export const getUser = (type: string, id: string) => request.get<any>(`/notifier/${type}/corp/${id}/users`)

 //通知类型
 export const queryMessageType = () => request.get(`/notifier/config/types`)

 export const queryDetailListNoPaging = (data: Record<string, unknown>) =>
  request.post(`/device-instance/detail/_query/no-paging`, data);
