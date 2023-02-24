<template>
    <a-spin :spinning="loading">
        <div style="position: relative">
            <div style="position: absolute; right: 0; top: 5px; z-index: 999">
                <a-space>
                    <a-button type="primary">开始动画</a-button>
                    <a-button type="primary">停止动画</a-button>
                </a-space>
            </div>
        </div>
        <AMap :points="geoList" />
    </a-spin>
</template>

<script lang="ts" setup>
import { getPropertyData } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import encodeQuery from '@/utils/encodeQuery';
import AMap from './AMap.vue';

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

const geoList = ref<any[]>([]);
const loading = ref<boolean>(false);

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
    );
    loading.value = false;
    if (resp.status === 200) {
        const list: any[] = [];
        ((resp.result as any)?.data || []).forEach((item: any) => {
            list.push([item.value.lon, item.value.lat]);
        });
        geoList.value = list
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