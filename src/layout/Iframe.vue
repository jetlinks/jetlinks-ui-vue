<template>
  <j-page-container class="iframe-warp">
    <full-page>
      <iframe
        v-if="loading"
        :src="iframeUrl"
        scrolling="yes"
        frameBorder="0"
        style="width: 100%; height: 100%"
      ></iframe>
    </full-page>
  </j-page-container>
</template>

<script name="IframePage" setup>
import {BASE_API, TOKEN_KEY} from '@jetlinks-web/constants';
import {LocalStore, getToken} from '@jetlinks-web/utils';
import { getAppInfo_api } from '@/api/system/apply';
import { lowCodeUrl } from '@/api/comm'
import FullPage from "./FullPage.vue";
import {onUnmounted} from "vue";
import {jumpLogin} from "@/router";

const iframeUrl = ref('');
const route = useRoute()
const loading = ref(false)

const props = defineProps({
  noMargin: {
    type: Boolean,
    default: false
  }
})

const className = computed(() => {
  return {
    'iframe-warp': true,
    'margin-full': props.hasOwnProperty('noMargin') && props.noMargin !== false
  }
})

const handle = async (appId, url) => {
  const res = await getAppInfo_api(appId);
  let menuUrl = url;
  if (res.status === 200) {
    const result = res.result
    if (result.page.routeType === 'hash') {
      menuUrl = url.startsWith('/') ? `/#${url}` : `/#/${url}`;
    }

    if (result.page.parameters) {
      const params = new URLSearchParams()
      result.page.parameters.forEach((item) => {
        if (item?.key) {
          params.set(item.key,item.value)
        }
      })
      const urlParams = params.toString()
      if (urlParams) {
        menuUrl += `?${urlParams}`
      }
    }
    const _url = menuUrl.startsWith('/') ? menuUrl : `/${menuUrl}`;

    const baseUrl = result.page.baseUrl.endsWith('/') ? result.page.baseUrl.slice(0,-1) : result.page.baseUrl;
    if (result.provider === 'internal-standalone') {
      iframeUrl.value = `${baseUrl}${BASE_API}/application/sso/${appId}/login?redirect=${menuUrl}?layout=false`;
    } else if (result.provider === 'internal-integrated') {
      const tokenUrl = `${
        baseUrl
      }${_url}?layout=false&X-Access-Token=${LocalStore.get(TOKEN_KEY)}`;
      iframeUrl.value = tokenUrl;
    } else {
      iframeUrl.value = `${baseUrl}${_url}`;
    }
  }
}

const lowCode = () => {
  lowCodeUrl().then(res => {
    if (res.success && res.result) {
      const url = res.result['ui-addr']
      // const url = 'http://localhost:8080'
      iframeUrl.value = url + '/#' + route.path + '?&token=' + getToken()
      console.log(iframeUrl.value)
      loading.value = true
    }
  })
}

const onMessage = (msg) => {
  if (msg?.data?.token === 'LOSE') {
    jumpLogin()
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', onMessage)
})

watchEffect(() => {
  const matchedItem = route.matched?.[0]
  if (route.meta?.isApp) {
    const params = route.path.split('/')?.[1];
    if (params === 'preview') {
      lowCode()
    } else {
      loading.value = true
      const url = route.path.split('/').slice(2).join('/');
      handle(params, url);
    }
  }
});
</script>

<style lang='less' scoped>

</style>
