import request from '@/utils/request'
import { dashboard } from '@/config/api/dashboard'

/**
 * @description 获取dashboard的 设备模块 | 设备消息模块 | 设备消息折线表模块 数据
 */
export function getBaseInfo (data) {
  return request({
    url: dashboard.baseInfoData,
    method: 'POST',
    data
  })
}
