/**
 * 消息
 *
 * @param id 消息类型
 * @param topic 消息的内容
 * @param parameter 参数
 */
function Message (id, topic, parameter, type) {
    this.id = id
    this.topic = topic
    this.parameter = parameter
    this.type = type
}

// 消息转为 JSON 字符串
Message.prototype.toJson = function () {
    var temp = {
        id: this.id,
        topic: this.topic,
        parameter: this.parameter,
        type: this.type
    }

    return JSON.stringify(temp)
}

// 消息类型
Message.ids = {
    CPUSTATE: 'home-page-statistics-cpu-realTime', // CPU
    JVMSTATE: 'home-page-statistics-jvm-realTime', // JVM
    HEARTBEAT: 'HEARTBEAT', // 心跳消息
    ERROR: 'ERROR' // 错误消息
}

Message.topics = {
    CPUTOPIC: '/dashboard/systemMonitor/cpu/usage/realTime', // CPU
    JVMTOPIC: '/dashboard/jvmMonitor/memory/info/realTime' // JVM
}

// 创建关闭消息，WebSocket 中关闭的消息为空的内容
Message.createCloseMessage = function () {
    return ''
}

// 创建心跳消息
Message.createHeartbeatMessage = function () {
    return new Message(Message.ids.HEARTBEAT, '')
}

// 创建消息
Message.createMessage = function (id, topic, parameter, type) {
    return new Message(id, topic, parameter, type)
}

// 默认导出
export default Message
