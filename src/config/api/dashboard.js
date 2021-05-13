import { getAccessToken } from '@/utils/authority'

export const dashboard = {
  /**
   * @description 获取dashboard的 设备模块 | 设备消息模块 | 设备消息折线表模块 数据
   */
  baseInfoData: `/dashboard/_multi?:X_Access_Token=${getAccessToken()}`
}
