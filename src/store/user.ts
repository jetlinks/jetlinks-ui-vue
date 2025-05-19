import { defineStore } from 'pinia'
import { detail } from '@/api/system/user'
import { tabList } from "@/views/account/center/data";
import {LocalStore} from "@jetlinks-web/utils/src/storage";

type UserInfo = {
  name: string
  icon: string
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<Partial<UserInfo>>({})
  const isAdmin = ref(false)
  const tabKey = ref(tabList[0].key || 'HomeView') // 个人中心的tabKey,
  const other = {
    tabKey: '' // 站内信的tabkey
  }
  const alarmUpdateCount = ref(0)
  /**
   * 设置用户信息
   * @param data
   */
  const setUserInfo = (data: Partial<UserInfo>) => {
    userInfo.value = data
  }

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    const resp = await detail()
    if (resp.success) {
      setUserInfo(resp.result)
      isAdmin.value = resp.result.username === 'admin'
      LocalStore.set('username', resp.result?.username)
    }
  }
  const updateAlarm = () => {
    alarmUpdateCount.value += 1
  }
  return {
    tabKey,
    other,
    userInfo,
    alarmUpdateCount,
    isAdmin,
    getUserInfo,
    setUserInfo,
    updateAlarm
  }
})
