<template>
    <a-modal
        :title="$t('Event.index.277611-0')"
        open
        width="50vw"
        :maskClosable="false"
        @ok="onCancel"
        @cancel="onCancel"
    >
        <div style="margin-bottom: 10px">
            <TimeComponent v-model="dateValue" :data="props.data" />
        </div>
        <div>
            <a-tabs
                :destroyInactiveTabPane="true"
                v-model:activeKey="activeKey"
                style="max-height: 620px; overflow-y: auto"
            >
                <a-tab-pane key="table" :tab="$t('Detail.index.256328-0')">
                    <Table :data="props.data" :time="_getTimes" />
                </a-tab-pane>
                <a-tab-pane key="charts" :tab="$t('Detail.index.256328-1')">
                    <Charts :data="props.data" :time="_getTimes" />
                </a-tab-pane>
                <a-tab-pane
                    key="geo"
                    :tab="$t('Detail.index.256328-2')"
                    v-if="data?.valueType?.type === 'geoPoint'"
                >
                    <PropertyAMap :data="props.data" :time="_getTimes" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </a-modal>
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
const activeKey = ref<'table' | 'charts' | 'geo'>('table');

const dateValue = ref<[Dayjs, Dayjs]>();

const _getTimes = computed(() => {
    if (dateValue.value) {
        return [dateValue.value[0].valueOf(), dateValue.value[1].valueOf()];
    }
    return [];
});

const onCancel = () => {
    _emits('close');
};
</script>

<style lang="less" scoped></style>
