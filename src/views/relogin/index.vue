<template>
  <Modal v-model:visible="visible" :footer="null" :width="1020" :bodyStyle="{padding: 0}" @cancel="onCancel">
    <template #closeIcon>
      <Button danger type="link" @click="onCancel" style="font-size: 18px">
        <svg focusable="false" class="" data-icon="export" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M888.3 757.4h-53.8c-4.2 0-7.7 3.5-7.7 7.7v61.8H197.1V197.1h629.8v61.8c0 4.2 3.5 7.7 7.7 7.7h53.8c4.2 0 7.7-3.4 7.7-7.7V158.7c0-17-13.7-30.7-30.7-30.7H158.7c-17 0-30.7 13.7-30.7 30.7v706.6c0 17 13.7 30.7 30.7 30.7h706.6c17 0 30.7-13.7 30.7-30.7V765.1c0-4.3-3.5-7.7-7.7-7.7zm18.6-251.7L765 393.7c-5.3-4.2-13-.4-13 6.3v76H438c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 000-12.6z"></path></svg>
      </Button>
    </template>
    <div class="relogin">
      <div class="left">
        <div class="left-box">
          <div>
            <img :width="280" :src="'/images/relogin.png'" />
          </div>
          <div style="font-size: 16px; color: #1A1A1A">{{ $t('relogin.419974-1') }}</div>
          <div style="font-size: 12px; color: #777777;">{{ $t('relogin.419974-2') }}</div>
        </div>
      </div>
      <div class="right">
        <Right
            :logo="systemInfo?.front?.logo"
            :title="layout?.title"
            :bindings="[]"
            v-model:loading="loading"
            type="relogin"
            @submit="handleSuccess"
        />
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Right from "@/views/login/right.vue";
import {useSystemStore} from "@/store";
import {storeToRefs} from "pinia";
import {jumpLogin} from "@/router";
import i18n from "@/locales";
import { AIcon } from '@jetlinks-web/components'
import { Modal, Button } from 'ant-design-vue'

const systemStore = useSystemStore();
const { systemInfo, layout } = storeToRefs(systemStore);
const loading = ref(false)
const $t = i18n.global.t

const visible = ref(false);
let resolvePromise = null;
const onCancel = () => {
  handleClose()
  jumpLogin()
}

const handleClose = (result = null) => {
  visible.value = false;
  if (resolvePromise) {
    resolvePromise(result); // 传递登录结果
    resolvePromise = null;
  }
};
const open = () => {
  visible.value = true;
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
};

const handleSuccess = () => {
  handleClose(true);
};

defineExpose({ open })
</script>

<style lang="less" scoped>
.relogin {
  display: flex;
  height: 650px;
  align-items: center;
}

.left {
  height: 100%;
  background-color: #F1F7FF;
  display: flex;
  justify-content: center;
  width: 466px;

  .left-box {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    gap: 16px;
  }
}

.right {
  padding: 24px;
  flex: 1;
  min-width: 0;
}
</style>
