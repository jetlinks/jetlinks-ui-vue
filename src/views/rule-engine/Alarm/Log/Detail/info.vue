<template>
    <j-modal
        visible
        :title="$t('Detail.info.891329-0')"
        :okText="$t('Detail.info.891329-1')"
        :cancelText="$t('Detail.info.891329-2')"
        :width="1000"
        @ok="closeModal"
        @cancel="closeModal"
    >
        <j-descriptions bordered :column="2">
            <j-descriptions-item :label="$t('Detail.info.891329-3')" :span="1">{{
                data?.alarmConfigName
            }}</j-descriptions-item>
            <j-descriptions-item :label="$t('Detail.info.891329-4')" :span="1">{{
                dayjs(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss')
            }}</j-descriptions-item>
            <j-descriptions-item :label="$t('Detail.info.891329-5')" :span="1">
                <j-tooltip placement="topLeft" :title="levelMap?.[data?.level] || data?.level">
                    <Ellipsis>
                        <span>
                           {{ levelMap?.[data?.level] || data?.level}}
                        </span>
                    </Ellipsis>
                </j-tooltip>
            </j-descriptions-item>
            <j-descriptions-item :label="$t('Detail.info.891329-6')" :span="1">
                <Ellipsis style="width: calc(100% - 20px)">
                    <span>
                        {{ data?.description || '' }}
                    </span>
                </Ellipsis>
            </j-descriptions-item>
            <j-descriptions-item :label="$t('Detail.info.891329-7')" :span="2"
                ><div style="max-height: 500px; overflow-y: auto">
                    <JsonViewer
                        :value="runningWater"
                        :expanded="true"
                        :expandDepth="4"
                    ></JsonViewer></div
            ></j-descriptions-item>
        </j-descriptions>
    </j-modal>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import JsonViewer from 'vue-json-viewer';
import { useAlarmLevel } from '@/hook';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    data: Object,
});
const runningWater = computed(() => {
    return JSON.parse(props.data?.alarmInfo);
});
const { levelMap } = useAlarmLevel();

const emit = defineEmits(['close']);
const closeModal = () => {
    emit('close');
};

</script>
<style lang="less" scoped></style>
