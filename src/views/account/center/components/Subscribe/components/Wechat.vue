<template>
  <div id="login_container"></div>
</template>

<script lang="ts" setup>
import { LocalStore } from '@jetlinks-web/utils'
import { createScript } from '@/utils/document'

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
})
const timer = ref<any>(null)
const emits = defineEmits(['success'])
const initData = async () => {
  const _script = await createScript(
    'https://wwcdn.weixin.qq.com/node/wework/wwopen/js/wwLogin-1.2.7.js',
  )
  if (_script) {
    new WwLogin({
      id: 'login_container',
      appid: props.data.appid,
      redirect_uri: encodeURIComponent(`${location.origin}/#/oauth/wechat`),
      state: props.data.state,
      agentid: props.data.agentid,
      self_redirect: true,
    })
  }
}

watchEffect(() => {
  if (props.data?.appid) {
    initData()
  }
})

timer.value = setInterval(() => {
  const code = LocalStore.get('wexin_code')
  if (code) {
    emits('success', code)
    window.clearInterval(timer.value)
    timer.value = null
  }
}, 2000)
</script>
