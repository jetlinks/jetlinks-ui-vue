<template>
  <j-page-container>
    <div ref="fullPage" :style="styles">
      <iframe
        class="iframe-content"
        v-if="loading"
        :src="iframeUrl"
        scrolling="yes"
        frameBorder="0"
        :style="styles"
      />
    </div>
  </j-page-container>
</template>

<script setup name="IframePage">
import { jumpLogin } from  '@/router'
import { useApplication, useMenuStore } from '@/store'
import { nextTick } from 'vue'
import { LayoutType } from '@jetlinks-web/components/es/ProLayout/defaultSettings'

const loading = ref(false)
const iframeUrl = ref('')
const route = useRoute()
const application = useApplication()
const menuStore = useMenuStore()
const fullPage = ref()
const styles = reactive({
  height: '100%',
  width: '100%'
})

/**
 * 第三方应用token失效，发送消息回来走退出流程
 * @param msg {Object}
 */
const onMessage = (msg) => {
  if (msg?.data?.token === 'LOSE') {
    setTimeout(() => {
      jumpLogin()
    }, 10)
  }
}

const findRedirect = (array, path) =>{
  let _redirect

  array.some(item => {
    if (item.path === path) {

      if (item.redirect && item.children?.length) {
        _redirect = findRedirect(item.children, item.redirect)
      } else {
        _redirect = item.redirect
      }
      return true
    } else if (item.children) {
      const res = findRedirect(item.children, path)
      if (res) {
        _redirect = res
        return true
      }
    }
  })

  return _redirect
}

const initHeight = () => {
  let { y } = fullPage.value.getBoundingClientRect()

  if (menuStore.menuMode === LayoutType.CARD) {
    y += 50
  } else {
    y += 28
  }

  styles.height = `calc(100vh - ${y}px)`
}

const handleQuery = () => {

  const {appId, url} = route.meta
  if (appId) {
    const appInfo = application.findAppById(appId)
    if (appInfo.page?.baseUrl) {
      let _url = appInfo.page.baseUrl
      const pageParams = new URLSearchParams()

      if (appInfo.page?.routeType === 'hash') {
        _url += _url.endsWith('/') ? '#' : '/#'
      }

      if (appInfo.provider === 'third-party') {
        pageParams.set('application', appInfo.id)
      }

      pageParams.set('layout', 'false')

      const path = findRedirect(menuStore.siderMenus, route.path)
      console.log('[handleQuery 2]>', path)

      iframeUrl.value = `${_url}${url}?${pageParams}`
      loading.value = true
    }
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  nextTick(() => {
    initHeight()
  })
})

onUnmounted(() => {
  window.removeEventListener('message', onMessage)
})

watch(() => route.fullPath, () => {
  handleQuery()
}, { immediate: true })

</script>

<style scoped>
.iframe-content {
  width: 100%;
}
</style>
