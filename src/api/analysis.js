import { getAccessToken } from '@/utils/permissions'

export const wsUrl = `${document.location.protocol.replace('http', 'ws')}//${process.env.VUE_APP_API_BASE_URL.replace('https://', '').replace('http://', '')}/messaging/${getAccessToken()}`
