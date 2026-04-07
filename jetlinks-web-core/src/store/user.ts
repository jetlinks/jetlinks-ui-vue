import { defineStore } from 'pinia'
import { detail } from '@jetlinks-web-core/api/system/user'
import { tabList } from "@jetlinks-web-core/views/account/center/data";
import { getToken, LocalStore } from '@jetlinks-web/utils'
import { pick } from 'lodash-es'

export interface UserInfo {
  id: string;
  username: string;
  type: {
    name: string;
    id: string;
  };
  status: number;
  loggedIn: boolean;
  lastRequestTime: number;
  name: string;
  createTime: number;
  roleList: unknown[];
  orgList: unknown[];
  parentOrgList: unknown[];
  childrenOrgList: unknown[];
  positions: unknown[];
  parentPositions: unknown[];
  tenantDisabled: boolean;
  modifyTime: number;
  gender: {
    text: string;
    value: string;
  };
  register: {
    text: string;
    value: string;
  };
  loginInfo: {
    loginIpRegion: string;
  };
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<Partial<UserInfo>>({})
  const isAdmin = ref(false)
  const isApplicationUser = ref(false)
  const tabKey = ref(tabList?.[0]?.key || 'HomeView') // 个人中心的tabKey,
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
      const userInfo = pick(resp.result, ['id', 'username', 'name', 'avatar'])
      setUserInfo(resp.result)
      isAdmin.value = resp.result.username === 'admin'
      isApplicationUser.value = resp.result.type?.id === 'application'
      LocalStore.set('userId', resp.result?.id)
      LocalStore.set('user_info', userInfo)
    }
  }
  const updateAlarm = () => {
    alarmUpdateCount.value += 1
  }

  const init = () => {
    isAdmin.value = false
    isApplicationUser.value = false
    tabKey.value = tabList?.[0]?.key || 'HomeView'
    alarmUpdateCount.value = 0
  }

  return {
    tabKey,
    other,
    userInfo,
    alarmUpdateCount,
    isAdmin,
    isApplicationUser,
    getUserInfo,
    setUserInfo,
    updateAlarm,
    init
  }
})

