import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export function actionToObject (json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    console.log('err', e.message)
  }
  return []
}

export function getAccessToken () {
  return storage.get(ACCESS_TOKEN)
}
