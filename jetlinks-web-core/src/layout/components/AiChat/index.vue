<template>
  <div
    v-if="showAiButton"
    class="ai-float-btn-wrapper"
    @click="onOpen"
  >
    <div class="ai-sparkle ai-sparkle-1">✦</div>
    <div class="ai-sparkle ai-sparkle-2">✦</div>
    <div class="ai-sparkle ai-sparkle-3">✦</div>
    <a-button
      type="primary"
      shape="circle"
      class="ai-float-btn"
    >
      <svg
        class="ai-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
        ></path>
        <path d="M20 3v4"></path>
        <path d="M22 5h-4"></path>
        <path d="M4 17v2"></path>
        <path d="M5 18H3"></path>
      </svg>
    </a-button>
  </div>
  <!-- 全局抽屉 -->
  <AiChatDrawer
    @close="onClose"
    v-if="showAiDrawer"
    :agentList="agentList"
    :parameters="parameters"
  />
</template>

<script setup>
import AiChatDrawer from './AiChatDrawer.vue'
import { useAIStore } from '@jetlinks-web-core/store'
import { storeToRefs } from 'pinia'

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
.ai-float-btn-wrapper {
  position: fixed;
  bottom: 22px;
  right: 22px;
  z-index: 999;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    .ai-float-btn {
      transform: scale(1.1);
      box-shadow: 0 0 30px rgba(22, 119, 255, 0.6);
    }
    .ai-icon {
      animation: icon-wiggle 0.5s ease-in-out;
    }
    .ai-sparkle {
      opacity: 1;
      animation-duration: 0.8s;
    }
  }

  &:active .ai-float-btn {
    transform: scale(0.95);
  }
}

.ai-float-btn {
  width: 52px;
  height: 52px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(22, 119, 255, 0.35);
}

.ai-icon {
  animation: icon-pulse 2.5s ease-in-out infinite;
}

.ai-sparkle {
  position: absolute;
  color: #1677ff;
  font-size: 10px;
  opacity: 0;
  z-index: 1;
  text-shadow: 0 0 4px #1677ff;
  pointer-events: none;
}

.ai-sparkle-1 {
  top: 6px;
  right: 8px;
  animation: sparkle-blink 2s ease-in-out infinite;
}

.ai-sparkle-2 {
  bottom: 10px;
  left: 6px;
  font-size: 8px;
  animation: sparkle-blink 2.5s ease-in-out infinite 0.8s;
}

.ai-sparkle-3 {
  top: 14px;
  left: 10px;
  font-size: 6px;
  animation: sparkle-blink 3s ease-in-out infinite 1.5s;
}

@keyframes icon-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(0.96);
  }
}

@keyframes icon-wiggle {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(22, 119, 255, 0));
  }
  50% {
    transform: scale(1.15);
    filter: drop-shadow(0 0 8px rgba(22, 119, 255, 0.8));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(22, 119, 255, 0));
  }
}

@keyframes sparkle-blink {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
