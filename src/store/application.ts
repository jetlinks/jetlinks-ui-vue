import { defineStore } from 'pinia'
import { ref } from 'vue'
import {uiList} from "@/api/application";

type ApplicationItemType = {
  id: string
  path: string
  name: string
}

export const useApplication = defineStore('application', () => {
  const appList = ref<Array<ApplicationItemType>>([])

  const queryApplication = async () => {
    const resp = await uiList()
    if (resp.success) {
      appList.value = resp.result
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
