<template>
    <a-modal
        open
        :title="$t('Detail.info.165157-0')"
        :okText="$t('Detail.info.165157-1')"
        :cancelText="$t('Detail.info.165157-2')"
        :width="1000"
        @ok="closeModal"
        @cancel="closeModal"
    >
        <a-descriptions bordered :column="2">
            <a-descriptions-item :label="$t('Detail.info.165157-3')" :span="1">{{
                data?.alarmConfigName
            }}</a-descriptions-item>
            <a-descriptions-item :label="$t('Detail.info.165157-4')" :span="1">{{
                dayjs(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss')
            }}</a-descriptions-item>
            <a-descriptions-item :label="$t('Detail.info.165157-5')" :span="1">
                <a-tooltip placement="topLeft" :title="levelMap?.[data?.level] || data?.level">
                    <j-ellipsis>
                        <span>
                           {{ levelMap?.[data?.level] || data?.level}}
                        </span>
                    </j-ellipsis>
                </a-tooltip>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Detail.info.165157-6')" :span="1">
                <j-ellipsis style="width: calc(100% - 20px)">
                    <span>
                        {{ data?.description || '' }}
                    </span>
                </j-ellipsis>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Detail.info.165157-7')" :span="2"
                ><div style="max-height: 500px; overflow-y: auto">
                    <JsonViewer
                        :value="runningWater"
                        :expanded="true"
                        :expandDepth="4"
                    ></JsonViewer></div
            ></a-descriptions-item>
        </a-descriptions>
    </a-modal>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { JsonViewer } from 'vue3-json-viewer';
import { useAlarmLevel } from '../../../../hook/index';
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
