<template>
  <a-select
    style="width: 180px"
    :value="value"
    v-if="options.length"
    :options="options"
    placeholder="组织"
    @select="orgChange"
  />
</template>

<script setup name="GlobalOrgChange">
import { storeToRefs } from 'pinia'
import { useUserStore } from "@/store";
import { changeToken } from '@/api/login'
import {setToken} from "@jetlinks-web/utils";
import { wsClient } from '@jetlinks-web/core'

const emit = defineEmits(['change'])
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const value = ref()

const options = computed(() => {
  return userInfo.value.orgList.map(item => ({
    value: item.id,
    label: `${item.name}(${item.fullName})`,
    name: item.name,
    fullName: item.fullName
  }))
})

const orgChange = async (key, option) => {
  value.value = key

  const expires = localStorage.getItem('expires') // 获取token时效
  const tokenResp = await changeToken({ // 获取新token
    expires,
    dataAccessDimensions: [{
      id: key,
      name: option.name,
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

<style scoped>

</style>
