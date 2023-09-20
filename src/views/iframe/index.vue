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
import { LocalStore, getToken } from '@/utils/comm';
import { getAppInfo_api } from '@/api/system/apply';
import { lowCodeUrl } from '@/api/comm'
import FullPage from "components/Layout/FullPage.vue";

const iframeUrl = ref<string>('');
const route = useRoute()
const loading = ref(false)
const handle = async (appId: string, url: string) => {
    const res = await getAppInfo_api(appId);
    let menuUrl: any = url;
    if (res.status === 200) {
        if (res.result.page.routeType === 'hash') {
            menuUrl = `${url}`;
        }
        if (res.result.provider === 'internal-standalone') {
            const urlStandalone = `${res.result.page.baseUrl}/api/application/sso/${appId}/login?redirect=${menuUrl}?layout=false`;
            iframeUrl.value = urlStandalone;
        } else if (res.result.provider === 'internal-integrated') {
            const tokenUrl = `${
                res.result.page.baseUrl
            }?X-Access-Token=${LocalStore.get(TOKEN_KEY)}`;
            iframeUrl.value = tokenUrl;
        } else {
            const urlOther = `${res.result.page.baseUrl}/${menuUrl}`;
            iframeUrl.value = urlOther;
        }
    }
};

const lowCode = () => {
  lowCodeUrl().then(res => {
    console.log(res.success && res.result)
    if (res.success && res.result) {
      const url = res.result['ui-addr']
      iframeUrl.value = url + '/#' + route.path + '?&token=' + getToken()
      console.log(iframeUrl.value)
      loading.value = true
    }
  })
}

watchEffect(() => {
    const matchedItem: any = route.matched?.[0]
    if (matchedItem?.meta?.isApp) {
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
