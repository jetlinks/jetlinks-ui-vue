<script setup name="BaseSubApp">
import {getToken} from "@jetlinks-web/utils";
import app from '@micro-zoe/micro-app'
import { wsClient } from '@jetlinks-web/core'

const route = useRoute()
const loading = ref(true)
let ws

const pageData = reactive({
  name: 'device-ui',
  url: 'http://localhost:9101/',
  defaultPage: '/',
})

const subContext = ref({
  token: getToken()
})

const handleCreated = () => {
  console.log(`[${pageData.name}] handleCreated`)
}

const handleBeforeMount = () => {
  console.log(`[${pageData.name}] handleBeforeMount`)
}

const handleMounted = () => {
  console.log(`[${pageData.name}] handleMounted`)
  app.setGlobalData({ wsClient })
}

const handleUnmount = () => {
  console.log(`[${pageData.name}] handleUnmount`)
  loading.value = false
}

const handleError = (err) => {
  console.log(`[${pageData.name}] handleError`, err)
}

const handleDataChange = (data) => {
  console.log(`[${pageData.name}] handleDataChange`, data)
}

const initPage = () => {
  const { appName, appUrl } = route.meta
  const searchParams = new URLSearchParams(route.fullPath.split('?')[1] || '')
  if (!searchParams.has('layout')) {
    searchParams.set('layout', 'false')
  }

  const _defaultPage = '#' + `${route.path}?${searchParams.toString()}`

  if (pageData.name && pageData.name === appName) {
    app.router.push({ name: pageData.name, path: _defaultPage })
  } else if(appUrl){
    const hasHttp = appUrl.startsWith('http')
    pageData.name = appName
    pageData.url = hasHttp ? appUrl : `${window.location.protocol}//${document.location.host}${appUrl}/index.html`
    pageData.defaultPage =  _defaultPage
  }
  loading.value = false
}

watch(() => route.fullPath, () => {
  initPage()
}, { immediate: true})

</script>

<template>
  <div class="micro-app-container" >
    <micro-app
      v-if="pageData.name"
      iframe
      keep-router-state
      v-bind="pageData"
      :key="pageData.name"
      router-mode='pure'
      class="micro-app-content"
      :data="subContext"
      @created="handleCreated"
      @beforemount="handleBeforeMount"
      @mounted="handleMounted"
      @unmount="handleUnmount"
      @error="handleError"
      @datachange="handleDataChange"
    />
  </div>
</template>

<style lang="less">
.micro-app-container {
  micro-app-body {
    background-color: transparent !important;
  }
}
</style>
