<template>
    <a-row :gutter="24">
        <a-col :span="16">
            <a-row :gutter="24" style="margin-bottom: 20px;">
                <a-col :span="12" v-for="item in messageArr" :key="item">
                    <div :style="messageStyleMap.get(item.status)" class="message-status">
                      <a-badge :status="messageStatusMap.get(item.status)" style="margin-right: 5px;" />
                      <span>{{item.text}}</span>
                    </div>
                </a-col>
            </a-row>
            <div>
                <TitleComponent data="调试" />
                <div class="content">
                    <div class="dialog" id="dialog">
                        <template v-for="item in dialogList" :key="item.key">
                            <Dialog :data="item" />
                        </template>
                    </div>
                </div>
                <div><Function /></div>
            </div>
        </a-col>
        <a-col :span="8">
            <div class="right-log">
                <TitleComponent data="日志" />
                <div :style="{ marginTop: 10 }">
                    <template v-if="logList.length">
                        <Log v-for="item in logList" :data="item" :key="item.key" />
                    </template>
                    <a-empty v-else />
                </div>
            </div>
        </a-col>
    </a-row>
</template>

<script lang="ts" setup>
import type { MessageType } from './util'
import { messageStatusMap, messageStyleMap } from './util'
import Dialog from './Dialog/index.vue'
import Function from './Function/index.vue'
import Log from './Log/index.vue'

const message = reactive<MessageType>({
    up: {
      text: '上行消息诊断中',
      status: 'loading',
    },
    down: {
      text: '下行消息诊断中',
      status: 'loading',
    },
})

const dialogList = ref<Record<string, any>>([])
const logList = ref<Record<string, any>>([])

const messageArr = computed(() => {
    const arr = Object.keys(message) || []
    return arr.map(i => { return {...message[i], key: i}})
})


</script>

<style lang="less" scoped>
.message-status {
  padding: 8px 24px;
}
.content {
  width: 100%;
}

.dialog {
  width: 100%;
  min-height: 300px;
  max-height: 500px;
  padding: 24px;
  overflow: hidden;
  overflow-y: auto;
  background-color: #f2f5f7;
}
.right-log {
    padding-left: 20px;
    border-left: 1px solid rgba(0, 0, 0, .09);
    overflow: hidden;
    max-height: 600px;
    overflow-y: auto;
    min-height: 400px;
}
</style>
