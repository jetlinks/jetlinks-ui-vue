<template>
  <a-select
      style="width: 180px;"
      v-if="options.length"
      :options="options"
      :value="value"
      placeholder="职位"
      @select="orgChange"
  />
</template>

<script setup>
import {useUserStore} from '@/store'
import {changeToken} from "@/api/login";
import {setToken} from "@jetlinks-web/utils";
import { wsClient } from "@jetlinks-web/core";

const emit = defineEmits(['change'])
const userStore = useUserStore()
const value = ref()

const options = computed(() => {
  return (userStore.userInfo?.positions || [])?.map(item => ({
    ...item,
    value: item.id,
    label: item.name
  }))
})

const orgChange = async (key, option) => {
  value.value = key
  const expires = localStorage.getItem('expires') // 获取token时效
  const tokenResp = await changeToken({ // 获取新token
    expires,
    dataAccessDimensions: [{
      id: option?.orgId,
      // name: option.name,
      type: 'org'
    }]
  })

  if (tokenResp.success) {
    setToken(tokenResp.result) // 设置token
    // 刷新ws
    wsClient.connect()
    emit('change')
  }
}
</script>

<style lang="less" scoped>

</style>
