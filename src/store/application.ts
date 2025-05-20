import { defineStore } from 'pinia'
import { ref } from 'vue'
import {uiList} from "@/api/application";
import {OpenMicroApp} from "@/utils/consts";

type ApplicationItemType = {
  id: string
  path: string
  name: string
}

export const useApplication = defineStore('application', () => {
  const appList = ref<Array<ApplicationItemType>>([])
  let lock = false

  const queryApplication = async () => {
    if (lock && OpenMicroApp === 'false') return

    const resp = await uiList()
    if (resp.success) {
      appList.value = resp.result
      lock = true
      // appList.value = [{
      //   id: 'device-manager',
      //   path: 'http://localhost:9100/'
      // }]
    }
  }


  const findAppById = (appId:string) => appList.value.find((item: any) => item.id === appId)

  return {
    appList,
    queryApplication,
    findAppById
  }
})
