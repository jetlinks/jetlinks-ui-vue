<template>
    <ShareLive :visible="true" type="share" :data="playData"/>
</template>

<script lang="ts" setup>
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import ShareLive from '../Live/shareLive.vue';

const playData = ref({
    deviceId: '',
    channelId: '',
    type: '',
    id:''
});

// 获取url信息
const route = useRoute();

watchEffect(() => {
    const obj: any = unref(route.query) || {};
    playData.value = {
        deviceId: obj?.deviceId || '',
        channelId: obj?.channelId || '',
        type: obj?.type,
        id:obj.id || ''
    };
    if(obj?.[TOKEN_KEY]){
        LocalStore.set(TOKEN_KEY, obj?.[TOKEN_KEY]);
    }
});
</script>