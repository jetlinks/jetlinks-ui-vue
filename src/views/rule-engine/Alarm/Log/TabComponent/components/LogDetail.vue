<template>
    <j-modal
        visible
        okText="确定"
        cancelText="取消"
        :width="1000"
        :closable="true"
        @ok="closeModal"
        @cancel="closeModal"
    >
        <template #title>
            <span>{{ data?.alarmConfigName }}</span>
            <span class="alarmTime">{{
                dayjs(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
        </template>

        <j-descriptions bordered :column="2">
            <j-descriptions-item label="触发条件" :span="2">{{
                data?.triggerDesc
            }}</j-descriptions-item>
            <j-descriptions-item label="告警原因" :span="2">{{
                data?.actualDesc
            }}</j-descriptions-item>
            <j-descriptions-item label="告警源" :span="2">
                设备ID：<a-button
                    type="link"
                    @click="() => gotoDevice(data?.sourceId)"
                    >{{ data?.sourceId }}</a-button
                >
            </j-descriptions-item>
            <j-descriptions-item label="告警流水" :span="2"
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
    menuStory.jumpPage('device/Instance/Detail', { id });
};
</script>
<style lang="less" scoped>
.alarmTime {
    font-size: 12px;
    margin-left: 20px;
}
</style>
