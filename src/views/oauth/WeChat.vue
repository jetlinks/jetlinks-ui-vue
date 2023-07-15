<template>
    <j-spin style="margin: 50%;"></j-spin>
</template>

<script lang="ts" setup>
import { LocalStore } from "@/utils/comm";

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