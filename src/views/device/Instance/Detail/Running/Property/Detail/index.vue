<template>
    <j-modal
        :title="$t('Detail.index.2866712-0')"
        visible
        width="50vw"
        :maskClosable="false"
        @ok="onCancel"
        @cancel="onCancel"
        :okText="$t('Detail.index.2866712-4')"
        :cancelText="$t('Detail.index.2866712-5')"
    >
        <div style="margin-bottom: 10px">
            <TimeComponent v-model="dateValue" :data="props.data" />
        </div>
        <div>
            <j-tabs
                :destroyInactiveTabPane="true"
                v-model:activeKey="activeKey"
                style="max-height: 600px; overflow-y: auto"
            >
                <j-tab-pane key="table" :tab="$t('Detail.index.2866712-1')">
                    <Table :data="props.data" :time="_getTimes" />
                </j-tab-pane>
                <j-tab-pane key="charts" :tab="$t('Detail.index.2866712-2')">
                    <Charts :data="props.data" :time="_getTimes" />
                </j-tab-pane>
                <j-tab-pane
                    key="geo"
                    :tab="$t('Detail.index.2866712-3')"
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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
