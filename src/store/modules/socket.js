import Vue from 'vue'
import Message from '@/utils/message'

export default {
    state: () => ({
        message: {},
        connected: false,
        reconnectError: false,
        heartBeatTimer: 0,
        heartBeatInterval: 2000
    }),
    mutations: {
        SOCKET_ONMESSAGE (state, message) {
            state.message = message
        },
        SOCKET_ONOPEN (state, event) {
            Vue.prototype.$socket = event.currentTarget
            state.connected = true

            // 心跳消息
            state.heartBeatTimer = setInterval(() => {
                const message = Message.createHeartbeatMessage()
                state.connected && Vue.prototype.$socket.sendObj(message)
            }, state.heartBeatInterval)

            console.log('消息系统连接成功: ' + new Date())
        },
        SOCKET_ONCLOSE (state, event) {
            state.connected = false

            clearInterval(state.heartBeatTimer)
            state.heartBeatTimer = 0

            console.log('消息系统连接已断开: ' + new Date())
        },
        SOCKET_ONERROR (state, event) {
            console.error(state, event)
        },
        SOCKET_RECONNECT (state, count) {
            console.info('消息系统重连中...', state, count)
        },
        SOCKET_RECONNECT_ERROR (state) {
            state.reconnectError = true
        },
        SOCKET_SEND_MESSAGE (state, message) {
            state.connected && Vue.prototype.$socket.sendObj(message)
        }
    },
    actions: {
        // 发送消息: this.$store.dispatch('sendMessage', message)
        sendMessage: function (context, message) {
            context.commit('SOCKET_SEND_MESSAGE', message)
        }
    }
}

// 调用 this.sendMessage(message) 发送消息
Vue.prototype.sendMessage = function (message) {
    this.$store.dispatch('sendMessage', message)
}
