<template>
    <j-modal
        visible
        title="详情"
        okText="确定"
        cancelText="取消"
        :width="1000"
        @ok="closeModal"
        @cancel="closeModal"
    >
        <j-descriptions bordered :column="2">
            <j-descriptions-item
                v-if="props.data.targetType === 'device'"
                label="告警设备"
                :span="1"
                >{{ props.data?.targetName || '' }}</j-descriptions-item
            >
            <j-descriptions-item
                v-if="props.data.targetType === 'device'"
                label="设备ID"
                :span="1"
                >{{ props.data?.targetId || '' }}</j-descriptions-item
            >
            <j-descriptions-item label="告警名称" :span="1">{{
                props.data?.alarmConfigName
            }}</j-descriptions-item>
            <j-descriptions-item label="告警时间" :span="1">{{
                dayjs(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss')
            }}</j-descriptions-item>
            <j-descriptions-item label="告警级别" :span="1">
                <j-tooltip
                    placement="topLeft"
                    :title="(Store.get('default-level') || []).find((item: any) => item?.level === data?.level)
                ?.title || props.data?.level"
                >
                    <Ellipsis>
                        <span>
                            {{(Store.get('default-level') || []).find((item: any) => item?.level === data?.level)
                ?.title || props.data?.level}}
                        </span>
                    </Ellipsis>
                </j-tooltip>
            </j-descriptions-item>
            <j-descriptions-item label="告警说明" :span="1">
                <Ellipsis style="width: calc(100% - 20px)">
                    <span>
                        {{ description || '' }}
                    </span>
                </Ellipsis>
            </j-descriptions-item>
            <j-descriptions-item label="告警流水" :span="2"
                ><div style="max-height: 500px; overflow-y: auto">
                    <JsonViewer
                        :value="JSON.parse(data?.alarmInfo || '{}')"
                        :expand-depth="5"
                    ></JsonViewer></div
            ></j-descriptions-item>
        </j-descriptions>
    </j-modal>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { Store } from 'jetlinks-store';
import JsonViewer from 'vue-json-viewer';
const props = defineProps({
    data: Object,
    description: String,
});
const emit = defineEmits(['close']);
const closeModal = () => {
    emit('close');
};
</script>
<style lang="less" scoped>
</style>