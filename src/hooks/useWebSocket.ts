import { onBeforeUnmount, ref } from 'vue'
import type { Ref } from 'vue'
import { wsClient } from '@jetlinks-web/core'
import { debounce, isNumber, throttle } from 'lodash-es'

interface WebSocketOptions<T> {
    onMessage?: (data: T) => void

    debounce?: number | boolean

    throttle?: number | boolean
}

export const useWebSocket = <T = any>(
    options?: WebSocketOptions<T>
): {
    data: Ref<T | undefined>,
    send: (id: string, topic: string, parameter?: Record<string, any>) => void
    unSubscribe: () => void
} => {

    const data = ref<T>()
    let ws: any = null

    const handleMsg = (msgData: T) => {
        data.value = msgData
        options?.onMessage?.(msgData)
    }

    const debounceMsg = debounce(handleMsg, isNumber(options?.debounce) ? options?.debounce : 300)

    const throttleMsg = throttle(handleMsg, isNumber(options?.throttle) ? options?.throttle : 300)
    /**
     * 消息发送
     * @param id {String}
     * @param topic {String}
     * @param parameter {Object}
     */
    const send = (id: string, topic: string, parameter?: Record<string, any>) => {
        ws = wsClient.getWebSocket(id, topic, parameter)

        if (options?.throttle) {
            ws.subscribe(throttleMsg)
        } else if (options?.debounce) {
            ws.subscribe(debounceMsg)
        } else {
            ws.subscribe((msgData: any) => handleMsg(msgData))
        }
    }

    const unSubscribe = () => {
        ws?.unsubscribe?.()
    }

    onBeforeUnmount(() => {
        unSubscribe()
    })

    return {
        data,
        send,
        unSubscribe
    }
}
