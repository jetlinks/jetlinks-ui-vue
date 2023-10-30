<template>
    <page-container>
        <iframe
            :src="iframeUrl"
            frameBorder="0"
            style="width: 100%; height: calc(100vh - 140px)"
        ></iframe>
    </page-container>
</template>

<script setup lang="ts">
import { TOKEN_KEY } from '@/utils/variable';
import { LocalStore } from '@/utils/comm';
import { getAppInfo_api } from '@/api/system/apply';

const iframeUrl = ref<string>('');
const route = useRoute()

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


watchEffect(() => {
    const matchedItem: any = route.matched?.[0]
    if (matchedItem?.meta?.isApp) {
      const params = route.path.split('/')?.[1];
      const url = route.path.split('/').slice(2).join('/');
      handle(params, url);
    }
});
</script>

<style lang='less' scoped>
:deep(.children-full-height) {
  margin: 0 !important;
}
</style>
