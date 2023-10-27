<template>
    <page-container>
      <full-page>
        <iframe
            v-if="loading"
            :src="iframeUrl"
            scrolling="no"
            frameBorder="0"
            style="width: 100%; height: 100%"
        ></iframe>
      </full-page>
    </page-container>
</template>

<script lang="ts" name="IframgePage" setup>
import { TOKEN_KEY } from '@/utils/variable';
import {LocalStore, getToken, cleanToken} from '@/utils/comm';
import { getAppInfo_api } from '@/api/system/apply';
import { lowCodeUrl } from '@/api/comm'
import FullPage from "components/Layout/FullPage.vue";
import {onUnmounted} from "vue";
import router from "@/router";
import {LoginPath} from "@/router/menu";
import { TokenLose} from "@/utils/request";

const iframeUrl = ref<string>('');
const route = useRoute()
const loading = ref(false)
const handle = async (appId: string, url: string) => {
    const res = await getAppInfo_api(appId);
    let menuUrl: any = url;
    if (res.status === 200) {
      const result = res.result
        if (result.page.routeType === 'hash') {
            menuUrl = url.startsWith('/') ? `#${url}` : `#/${url}`;
        }

        if (result.page.parameters) {
          const params = new URLSearchParams()
          result.page.parameters.forEach((item: any) => {
            params.set(item.key,item.value)
          })
          menuUrl += `?${params.toString()}`
        }

        if (result.provider === 'internal-standalone') {
            const urlStandalone = `${result.page.baseUrl}/api/application/sso/${appId}/login?redirect=${menuUrl}?layout=false`;
            iframeUrl.value = urlStandalone;
        } else if (result.provider === 'internal-integrated') {
            const tokenUrl = `${
                result.page.baseUrl
            }/${menuUrl}?layout=false&X-Access-Token=${LocalStore.get(TOKEN_KEY)}`;
            iframeUrl.value = tokenUrl;
        } else {
            const urlOther = `${result.page.baseUrl}/${menuUrl}`;
            iframeUrl.value = urlOther;
        }
    }
};

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

const onMessage = (msg: any) => {
  console.log('onMessage',msg)
  if (msg?.data?.token === 'LOSE') {
    TokenLose()
    setTimeout(() => {
      cleanToken()
      router.replace({
        path: LoginPath
      })
    }, 0)
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', onMessage)
})

watchEffect(() => {
    const matchedItem: any = route.matched?.[0]
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
:deep(.children-full-height) {
  margin: 0 !important;
}
</style>
