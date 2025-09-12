<script setup name="BaseSubApp">
import {getToken} from "@jetlinks-web/utils";
import app from '@micro-zoe/micro-app'
import { wsClient } from '@jetlinks-web/core'
import { useMenuStore } from '@/store'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const menuStore = useMenuStore()
const menuStoreRef = storeToRefs(menuStore)

const pageData = reactive({
  name: undefined,
  url: undefined,
  defaultPage: '/',
})

const subContext = ref({
  token: getToken(),
})

const styles = computed(() => {
  return {
    padding: loading.value ? '24px' : '0',
  }
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
  loading.value = false
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
  if (data.detail.data.type === 'route-change') {
    const { path } = data.detail.data.data
    const targetPath = route.path
    const microPath = path
    if (targetPath && microPath !== targetPath) {
      router.push(microPath)
    }
  }
}

const initPage = () => {
  const { appName, appUrl } = route.meta
  const microPath = route.path
  subContext.value.menuResult = menuStore.menuResultCache
  subContext.value.version = localStorage.getItem('version_code')

  const searchParams = new URLSearchParams(route.fullPath.split('?')[1] || '')
  if (!searchParams.has('layout')) {
    searchParams.set('layout', 'false')
  }

  const _defaultPage = '#' + `${microPath}?${searchParams.toString()}`
  if (pageData.name && pageData.name === appName) {
    app.router.push({ name: pageData.name, path: _defaultPage })
  } else if(appUrl){
    const hasHttp = appUrl.startsWith('http')
    pageData.name = appName
    pageData.url = hasHttp ? appUrl : `${window.location.protocol}//${document.location.host}${appUrl}/index.html`
    pageData.defaultPage =  _defaultPage
  }
}

watch(() => [route.fullPath, menuStoreRef.loading.value], () => {
  if (!menuStoreRef.loading.value) {
    initPage()
  }
}, { immediate: true, deep: true })

</script>

<template>
  <div class="micro-app-container" :style="styles">
    <div v-if="loading" style="overflow: hidden">
      <div class="skeleton skeleton-active" style="height: 32px; width: 190px"></div>
      <div class="skeleton skeleton-active" style="height: 64px; width: 100%"></div>
      <div class="skeleton-context" style="height: calc(100% - 64px); width: 100%;">
        <div v-for="i in 8" class="skeleton-context-card skeleton-active" style="height: 186px; width: 100%;"></div>
      </div>
    </div>
    <micro-app
      v-if="pageData.name"
      iframe
      keep-router-state
      v-bind="pageData"
      :key="pageData.name"
      class="micro-app-content"
      :data="subContext"
      :baseroute="'/'+pageData.name"
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

@keyframes css-1p3hq3p-ant-skeleton-loading{
  0%{
    transform:translateX(-37.5%);
  }
  100%{
    transform:translateX(37.5%);
  }
}

.skeleton {
  margin-bottom: 24px;
}

.skeleton-context {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 24px;
}

.skeleton-active {
  position: relative;
  overflow: hidden;

  &::after {
    position: absolute;
    top: 0;
    inset-inline-end: -150%;
    bottom: 0;
    inset-inline-start: -150%;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.06) 25%, rgba(0, 0, 0, 0.15) 37%, rgba(0, 0, 0, 0.06) 63%);
    animation-name: css-1p3hq3p-ant-skeleton-loading;
    animation-duration: 1.4s;
    animation-timing-function: ease;
    animation-iteration-count: infinite;
    content: "";
  }
}
</style>
