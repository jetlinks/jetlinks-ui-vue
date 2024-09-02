import { notification } from 'ant-design-vue'
import { Observable } from 'rxjs'

let webSocketUrl = ''
let ws: WebSocket | null = null // websocket实例
let subs = {} // 订阅
const tempQueue: any[] = [] // 缓存消息队列

type HeartCheckType = {
  timeout: number,
  timer: NodeJS.Timeout | null
  reset: () => HeartCheckType
  start: () => void
}
// 心跳
const heartCheck: HeartCheckType  = {
  timeout: 2 * 1000,
  timer: null,
  reset() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    return this
  },
  start() {
    this.timer = setInterval(() => {
      if (ws) {
        ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, this.timeout)
  }
}

// 重启
const reconnect: {
    timeout: number,
    timer: NodeJS.Timeout | null
    count: number,
    lock: boolean,
    reload: () => void
    countAdd: () => void
    getReconnectCount: () => number
} = {
  timeout: 5 * 1000, // 重启时长，1-10次，频率为5s， 11-20次， 频率为15s， 20+， 频率为30s
  timer: null,
  count: 0,
  lock: false,
  reload() {
    this.timer && clearTimeout(this.timer)
    const that = this
    if (!this.lock) {
      const count = this.getReconnectCount()
      this.lock = true
      this.timer = setTimeout(() => {
        createWebSocket()
        that.lock = false
        that.countAdd()
      }, that.timeout * count)
    }
  },
  countAdd() {
    this.count += 1
  },
  getReconnectCount() {
    const count = this.count
    if (count <=10) {
      return 1
    } else if (count > 10 && count <= 20) {
      return 3
    } else {
      return 6
    }
  }
}

export const initWebSocket = (url: string) => {
  webSocketUrl = url
}

function createWebSocket() {
  if (!webSocketUrl) {
    console.warn('websocket url 不能为空')
    return
  }

  if (!ws) {
    console.log(webSocketUrl)
    ws = new WebSocket(webSocketUrl)

    ws.onopen = () => {
      heartCheck.reset().start()
      reconnect.count = 0 // 重置重启次数
      // 发送已缓存的消息
      if (tempQueue.length) {
        for (let i = tempQueue.length - 1; i >= 0; i--) {
          ws!.send(tempQueue[i])
          tempQueue.splice(i, 1)
        }
      }
    }

    ws.onerror = () => {
      ws = null
      reconnect.reload()

    }

    ws.onmessage = (msg: Record<string, any>) => {
      const data = JSON.parse(msg.data)

      if (data.type === 'error') {
        notification.error({ key: 'error', message: data.message })
      }

      const requestItem = subs[data.requestId]
      if (requestItem) {
        if (data.type === 'complete') {
          requestItem.forEach((item: Record<string, any>) => {
            item.complete()
          })
        } else if (data.type === 'result') {
          requestItem.forEach((item: Record<string, any>) => {
            item.next(data)
          })
        }
      }

    }

    ws.onclose = () => {
      ws = null
      reconnect.reload()
    }

  }
  return ws
}

export const getWebSocket = (id: string, topic: string, parameter: Record<string, any> = {}) => new Observable(subscriber => {
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

  const msg = JSON.stringify({id, topic, parameter, type: 'sub'})
  const thatWs = createWebSocket()
  if (thatWs) {
    if (thatWs.readyState === WebSocket.OPEN) {
      thatWs.send(msg)
    } else {
      tempQueue.push(msg)
    }
  }

  return () => {
    const unsub = JSON.stringify({ id, type: 'unsub' })
    delete subs[id]
    thatWs?.send(unsub)
  }
})

/**
 * 关闭 websocket
 */
const closeWs = () => {
  if (ws) {
    ws.close()
  }
}

window.onbeforeunload = function () {
  closeWs()
}

export {
  createWebSocket
}
