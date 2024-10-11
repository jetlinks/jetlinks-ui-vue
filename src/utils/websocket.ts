import { Observable } from 'rxjs'
import { BASE_API_PATH } from '@/utils/variable';
import { notification } from 'ant-design-vue';
import { getToken } from '@/utils/comm';

let ws: any = null
let count = 0 // 重连计数
let timer: NodeJS.Timeout = null
const total = 100 // 重连总次数
const subs = {}
const timeout = 2000
const timeSub = 5 // 每多少次 增加重连时间间隔
let tempQueue: any[] = [] // websocket未连接上时，缓存消息列

export const initWebSocket = () => {
    const token = getToken()
    if (!token) return
    if (ws) {
        return ws
    }
    const url = `${document.location.protocol.replace('http', 'ws')}//${document.location.host}${BASE_API_PATH}/messaging/${token}?:X_Access_Token=${token}`;
    if (count < total) {
        count += 1
        ws = new WebSocket(url)

        ws.onopen = () => {
            count = 0
            timer = setInterval(heartCheck, 2000)
            if (tempQueue.length > 0) {
                for (let i = tempQueue.length - 1; i >= 0; i--) {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(tempQueue[i].msg)
                    }
                }
            }
        }

        ws.onclose = () => {
            ws = null
            reconnect()
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
            reconnect()
        }

        return ws
    }
}

export const getWebSocket = (id: string, topic: string, parameter: Record<string, any>) => new Observable(subscriber => {
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
    const thisWs = initWebSocket()
    if (thisWs) {
        if (thisWs.readyState === WebSocket.OPEN) {
            thisWs.send(msg)
        } else {
            tempQueue.push({id, msg})
        }
    }

    return () => {
        const unsub = JSON.stringify({ id, type: 'unsub' })
        delete subs[id]
        tempQueue = tempQueue.filter(item => item.id !== id)
        if (thisWs && thisWs.readyState === WebSocket.OPEN) {
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
function reconnect() {
    timer && clearInterval(timer)
    const _time = timeout * (Math.floor(count / timeSub) + 1)

    timer = setTimeout(() => {
        initWebSocket()
    }, _time)
}

/**
 * 心跳检测
 */
function heartCheck() {

    if (ws) {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }))
        } else {
            reconnect()
        }
    }
}
