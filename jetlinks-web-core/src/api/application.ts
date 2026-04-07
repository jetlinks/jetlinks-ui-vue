import { request } from '@jetlinks-web/core'

export const uiList = () => request.get('/system/resources/ui')
