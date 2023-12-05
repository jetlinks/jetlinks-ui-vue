<template>
    <j-spin :spinning="loading">
        <div style="position: relative">
            <div style="position: absolute; right: 0; top: 5px; z-index: 999">
                <j-space>
                    <j-button type="primary" @click="onStart">开始动画</j-button>
                    <j-button type="primary" v-if="!stop" @click="onStop">暂停动画</j-button>
                    <j-button type="primary" v-else @click="onResume">继续动画</j-button>
                </j-space>
            </div>
        </div>
        <AMapComponent style="height: 500px">
            <PathSimplifier :pathData="geoList" ref="amapPath"></PathSimplifier>
        </AMapComponent>
    </j-spin>
</template>

<script lang="ts" setup>
import { getPropertyData } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import encodeQuery from '@/utils/encodeQuery';

const instanceStore = useInstanceStore();

const prop = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    time: {
        type: Array,
        default: () => [],
    },
});

const stop = ref<boolean>(false);
const geoList = ref<any[]>([]);
const loading = ref<boolean>(false);
const amapPath = ref()

const onStart = () => {
    amapPath.value?.start()
    stop.value = false
}

const onStop = () => {
    amapPath.value?.pause()
    stop.value = true
}

const onResume = () => {
    amapPath.value?.resume()
    stop.value = false
}

const query = async () => {
    loading.value = true;
    const resp = await getPropertyData(
        instanceStore.current.id,
        encodeQuery({
            paging: false,
            terms: {
                property: prop.data.id,
                timestamp$BTW: prop.time[0] && prop.time[1] ? prop.time : [],
            },
            sorts: { timestamp: 'asc' },
        }),
    ).finally(()=>{
        loading.value = false;
    }
    )
    if (resp.status === 200) {
        const list: any[] = [];
        ((resp.result as any)?.data || []).forEach((item: any) => {
            list.push([item.value.lon, item.value.lat]);
        });
        geoList.value = [{
            name: prop?.data?.name,
            path: list
        }]
    }
};

watch(
    () => [prop.data.id, prop.time],
    ([newVal]) => {
        if (newVal) {
            query();
        }
    },
    {
        deep: true, immediate: true
    }
);
</script>

<style lang="less" scoped>
</style>