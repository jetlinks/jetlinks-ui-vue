// 是否不是community版本
import { getToken, randomString } from '@jetlinks-web/utils'
import {BASE_API} from "@jetlinks-web/constants";

export const isNoCommunity = !(localStorage.getItem('version_code') === 'community');

export const openEdgeUrl = (id: string) => {
  window.open(`${BASE_API}/ui/edge/cloud/default/#/login?token=${getToken()}&thingId=${id}&deviceId=${id}&terminal=cloud-pc&thingType=device&proxy=${BASE_API}`)
}

export class TabSaveSuccess {
  private id: string
  private url: string

  constructor(url: string) {
    this.id = 'tab-save-success' + randomString(8)
    this.url = url
  }

  

}
