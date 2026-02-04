import { request } from '@jetlinks-web/core'

/**
 * 应用管理相关接口
 */
export default {
    /**
     * 获取数据权限支持列表
     */
    getAccessSupports: () => request.get<any>(`/assets/access-supports`),
}
