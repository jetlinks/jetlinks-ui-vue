<template>
    <page-container>
        <div class="box">
            <iframe :src="url" class="box-iframe"></iframe>
        </div>
    </page-container>
</template>

<script setup lang="ts">
import { _control, _stopControl } from '@/api/edge/device';
import {useRouterParams} from "@/utils/hooks/useParams";

const url = ref<string>('');
const deviceId = ref<string>('');
const { params } = useRouterParams()
watch(
    () => params.value.id,
    (newId) => {
        if (newId) {
            deviceId.value = newId as string;
            _control(newId).then((resp: any) => {
                if (resp.status === 200) {
                    const item = `http://${resp.result?.url}/#/login?token=${resp.result.token}`;
                    if(window.location.protocol === 'https:' && item){
                        window.open(item)
                    }else{
                         url.value = item;
                    }
                }
            });
        }
    },
    { immediate: true },
);

onUnmounted(() => {
    if (deviceId.value) {
        _stopControl(unref(deviceId));
    }
});
</script>

<style lang="less" scoped>
.box {
    width: 100%;
    height: 85vh;
    background-color: #fff;
}
.box-iframe {
    width: 100%;
    height: 100%;
    border: none;
}
</style>