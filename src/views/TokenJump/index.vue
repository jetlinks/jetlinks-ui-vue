<template>
  <div class="token-jump-page">
    <a-modal
      visible
      :centered="true"
      :closable="false"
      :footer="null"
      :keyboard="false"
      :mask="false"
      :width="500"
    >
      <div class="token-jump-body">
        <img src="@/assets/token-error-icon.png" alt="">
        <span style="color: #1F2429;padding: 24px 0;">{{ msg }}</span>
        <a-button style="width: 180px" type="primary" @click="onBack">返回</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import {useMenuStore} from "@/store/menu";

const menuStory = useMenuStore();
const route = useRoute()

const msg = computed(() => {
  return route.query.proxy_error || '远程访问秘钥已过期'
})

const onBack = () => {
  menuStory.jumpPage('device/Instance/Detail', {
      params: {
          id: route.params.id
      }
  })
}
</script>

<style scoped>
.token-jump-page {
  height: 100vh;
  width: 100vw;
  background: url("@/assets/token-error.jpg") no-repeat;
  background-size: cover;
}

.token-jump-body {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
