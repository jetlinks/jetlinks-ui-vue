import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export function getAccessToken (type) {
  return type ? localStorage.getItem('x-access-token') || `${new Date().getTime()}` : storage.get(ACCESS_TOKEN)
}

export function setAccessToken (token) {
  localStorage.setItem('x-access-token', token)
}
