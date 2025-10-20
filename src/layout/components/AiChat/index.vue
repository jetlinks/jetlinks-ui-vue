<template>
  <a-button
    type="primary"
    shape="circle"
    v-if="showAiButton"
    class="ai-float-btn"
    @click="onOpen"
  >
    <AIcon type="RobotFilled" />
  </a-button>
  <!-- 全局抽屉 -->
  <AiChatDrawer @close="onClose" v-if="showAiDrawer" :agentList="agentList" :parameters="parameters" />
</template>

<script setup>
import AiChatDrawer from './AiChatDrawer.vue'
import {useAIStore} from "@/store";
import { storeToRefs } from 'pinia';

const aiStore = useAIStore()
const { showAiDrawer, showAiButton, agentList, parameters } = storeToRefs(aiStore)

const onClose = () => {
  aiStore.setDrawer(false)
}

const onOpen = () => {
  aiStore.setDrawer(true)
}
</script>

<style lang="less" scoped>
.ai-float-btn {
  position: fixed;
  bottom: 48px;
  right: 48px;
  z-index: 999;
  width: 56px;
  height: 56px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
