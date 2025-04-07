<template>
  <a-modal v-model:visible="visible" :footer="null" :width="900" :bodyStyle="{padding: 0}" @cancel="onCancel">
    <template #closeIcon>
      <a-button danger type="link" @click="onCancel">
        <AIcon type="ExportOutlined" />
      </a-button>
    </template>
    <div class="relogin">
      <div class="left">
        <div class="left-box">
          <div>
            <img :width="150" src="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original" />
          </div>
          <h3>{{ $t('relogin.419974-1') }}</h3>
          <p>{{ $t('relogin.419974-2') }}</p>
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
  </a-modal>
</template>

<script setup>
import Right from "@/views/login/right.vue";
import {useSystemStore} from "@/store";
import {storeToRefs} from "pinia";
import {jumpLogin} from "@/router";
import i18n from "@/locales";
import { AIcon } from '@jetlinks-web/components'

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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 600px;
  align-items: center;
}

.left {
  height: 100%;
  background-color: rgba(123, 88, 122, .1);
  display: flex;
  justify-content: center;

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
}
</style>
