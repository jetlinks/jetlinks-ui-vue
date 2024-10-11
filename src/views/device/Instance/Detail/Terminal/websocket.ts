import { Observable } from 'rxjs'
import { BASE_API_PATH } from '@/utils/variable';
import { notification } from 'ant-design-vue';
import { getToken } from '@/utils/comm';

let ws: any = null
let count = 0 // 重连计数
// @ts-ignore
let timer: NodeJS.Timeout = null
let lockReconnect = false // 避免重复连接
const total = 100 // 重连总次数
const subs = {}
const timeout = 5000
const tempQueue: any[] = [] // websocket未连接上时，缓存消息列

export const initWebSocket = (id: string) => {
    const token = getToken()
    if (!token) return
    if (ws) {
        return ws
    }
    const url = `${document.location.protocol.replace('http', 'ws')}//${document.location.host}${BASE_API_PATH}/edge/device/${id}/_ws/messaging/${token}?:X_Access_Token=${token}`;
    if (count < total) {
        count += 1
        ws = new WebSocket(url)

        ws.onopen = () => {
            count = 0
            timer = setInterval(heartCheck, 2000)
            if (tempQueue.length > 0) {
                for (let i = tempQueue.length - 1; i >= 0; i--) {
                    ws.send(tempQueue[i])
                    tempQueue.splice(i, 1)
                }
            }
        }

        ws.onclose = () => {
            ws = null
            reconnect(id)
        }

        ws.onmessage = (msg: Record<string, any>) => {
            const data = JSON.parse(msg.data)

            if (data.type === 'error') {
                notification.error({ key: 'error', message: data.message })
            }

            if (subs[data.requestId]) {
                if (data.type === 'complete') {
                    subs[data.requestId].forEach((item: Record<string, any>) => {
                        item.complete()
                    })
                } else if (data.type === 'result') {
                    subs[data.requestId].forEach((element: Record<string, any>) => {
                        element.next(data)
                    })
                }
            }
        }

        ws.onerror = () => {
            ws = null
            reconnect(id)
        }

        return ws
    }
}

export const getWebSocket = (id: string, topic: string, parameter: Record<string, any>, deviceId: string) => new Observable(subscriber => {
    if (!subs[id]) {
        subs[id] = []
    }

    subs[id].push({
        next(val: Record<string, any>) {
            subscriber.next(val)
        },
        complete() {
            subscriber.complete()
        }
    })

    const msg = JSON.stringify({ id, topic, parameter, type: 'sub' })
    const thisWs = initWebSocket(deviceId)
    if (thisWs) {
        if (thisWs.readyState === WebSocket.OPEN) {
            thisWs.send(msg)
        } else {
            tempQueue.push(msg)
        }
    }

    return () => {
        const unsub = JSON.stringify({ id, type: 'unsub' })
        delete subs[id]
        if (thisWs) {
            thisWs.send(unsub)
        }
    }
})

export const closeWs = () => {
    if (ws) {
        ws.close()
        timer && clearInterval(timer)
    }
}

/**
 * 重连
 */
function reconnect(deviceId: string) {
    timer && clearInterval(timer)
    if (lockReconnect) {
        return
    }
    lockReconnect = true
    timer = setTimeout(() => {
        initWebSocket(deviceId)
        lockReconnect = false
    }, timeout * count)
}

/**
 * 心跳检测
 */
function heartCheck() {
    if (ws) {
        ws.send(JSON.stringify({ type: 'ping' }))
    }
}
