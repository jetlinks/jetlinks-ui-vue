<template>
    <j-modal
        visible
        :okText="$t('components.LogDetail.891306-0')"
        :cancelText="$t('components.LogDetail.891306-1')"
        :width="1000"
        :title="$t('components.LogDetail.891306-2')"
        :closable="true"
        @ok="closeModal"
        @cancel="closeModal"
    >
        <div class="alarmInfo">
            <span class="alarmTitle">{{ data?.alarmConfigName }}</span>
            <span class="alarmTime">{{
                dayjs(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
        </div>
        <j-descriptions bordered :column="2">
            <j-descriptions-item :label="$t('components.LogDetail.891306-3')" :span="2">{{
                data?.triggerDesc
            }}</j-descriptions-item>
            <j-descriptions-item :label="$t('components.LogDetail.891306-4')" :span="2">{{
                data?.actualDesc
            }}</j-descriptions-item>
            <j-descriptions-item :label="$t('components.LogDetail.891306-5')" :span="2">
                {{ $t('components.LogDetail.891306-6') }}<a-button
                    type="link"
                    @click="() => gotoDevice(data?.sourceId)"
                    >{{ data?.sourceId }}</a-button
                >
            </j-descriptions-item>
            <j-descriptions-item :label="$t('components.LogDetail.891306-7')" :span="2"
                ><div style="max-height: 500px; overflow-y: auto">
                    <JsonViewer
                        :value="JSON.parse(data?.alarmInfo)"
                        :expanded="true"
                        :expandDepth="4"
                    ></JsonViewer></div
            ></j-descriptions-item>
        </j-descriptions>
    </j-modal>
</template>

<script setup>
import dayjs from 'dayjs';
import JsonViewer from 'vue-json-viewer';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    data: Object,
});
const menuStory = useMenuStore();
const runningWater = computed(() => {
    return JSON.parse(props.data?.alarmInfo);
});

const emit = defineEmits(['close']);
const closeModal = () => {
    emit('close');
};
const gotoDevice = (id) => {
    menuStory.jumpPage('device/Instance/Detail', { id, tab: 'Running' });
};
</script>
<style lang="less" scoped>
.alarmInfo {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .alarmTitle {
        font-weight: 600;
        font-size: 16px;
        color: #1a1a1a;
    }
    .alarmTime {
        font-size: 14px;
    }
}
</style>
