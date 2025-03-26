<template>
    <a-spin style="margin: 50%;"></a-spin>
</template>

<script lang="ts" setup>
import { LocalStore } from "@jetlinks-web/utils";

watch(
    () => location?.hash,
    () => {
        const _url = new URLSearchParams(location?.hash);
        const params = Object.fromEntries(_url?.entries());
        LocalStore.set('wexin_code', params?.['#/oauth/wechat?code'])
    },
    {
        deep: true,
        immediate: true
    }
);
</script>
