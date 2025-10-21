import { defineStore } from 'pinia'
import { ref } from 'vue'
import { uiList } from "@/api/application";
import { isSubApp, OpenMicroApp } from '@/utils/consts'
import { moduleRegistry } from '@/utils/module-registry'

type ApplicationItemType = {
  id: string
  path: string
  name: string
  version?: string
  description?: string
}

export const useApplication = defineStore('application', () => {
  const appList = ref<Array<ApplicationItemType>>([])

  let lock = false

  /**
   * 查询应用列表
   */
  const queryApplication = async () => {
    // if (appList.value.length > 0 || OpenMicroApp === 'false') return

    if (lock) return


    try {
      const resp = await uiList()
      if (resp.success && resp.result) {
        lock = true
        let result = resp.result
        // let result = [
        //   { id: 'authentication-manager', name: 'authentication-manager-ui', path: 'http://localhost:8082/'}
        // ]
        if (import.meta.env.VITE_MODULE_NAME && !isSubApp) { // 子模块编译之后独立运行时，排除自身
          result = result.filter((item: any) => (item.name + '-ui') !== import.meta.env.VITE_MODULE_NAME)
        }

        // 获取是否已在本地注册子模块分享出来的apis，components等
        for (const item of result) {
          const name = item.id + '-ui'
          if (!moduleRegistry.hasModule(name)) { // 没有本地模块注册，获取微前端模块进行注册
            const path = [item.path, item.path.endsWith('/') ? '' : '/', 'assets/remoteEntry.js' ].join('')
            await moduleRegistry.loadRemoteModule(name, path)
          }
        }

        appList.value = result
      }
    } catch (error) {
      console.error('查询应用列表失败:', error)
    }
  }

  /**
   * 根据ID查找应用
   */
  const findAppById = (appId: string) => appList.value.find((item: any) => item.id === appId)

  return {
    appList,
    queryApplication,
    findAppById,
  }
})
