<template>
    <j-modal
        title="详情"
        visible
        width="50vw"
        :maskClosable="false"
        @ok="onCancel"
        @cancel="onCancel"
    >
        <div style="margin-bottom: 10px">
            <TimeComponent
                v-model="dateValue"
                :data="props.data"
                @search="search"
            />
        </div>
        <div>
            <j-tabs
                :destroyInactiveTabPane="true"
                v-model:activeKey="activeKey"
                style="max-height: 600px; overflow-y: auto"
            >
                <j-tab-pane key="table" tab="列表">
                    <Table
                        :data="props.data"
                        :time="_getTimes"
                        :searchParams="params"
                    />
                </j-tab-pane>
                <j-tab-pane key="charts" tab="图表">
                    <Charts :data="props.data" :time="_getTimes" />
                </j-tab-pane>
                <j-tab-pane
                    key="geo"
                    tab="轨迹"
                    v-if="data?.valueType?.type === 'geoPoint'"
                >
                    <PropertyAMap :data="props.data" :time="_getTimes" />
                </j-tab-pane>
            </j-tabs>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import type { Dayjs } from 'dayjs';
import TimeComponent from './TimeComponent.vue';
import Charts from './Charts.vue';
import PropertyAMap from './PropertyAMap.vue';
import Table from './Table.vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const _emits = defineEmits(['close']);
const params = ref();
const activeKey = ref<'table' | 'charts' | 'geo'>('table');

const dateValue = ref<[Dayjs, Dayjs]>();

const _getTimes = computed(() => {
    if (dateValue.value) {
        return [dateValue.value[0].valueOf(), dateValue.value[1].valueOf()];
    }
    return [];
});
const search = (e: any) => {
    params.value = e;
};
const onCancel = () => {
    _emits('close');
};
</script>

<style lang="less" scoped></style>
