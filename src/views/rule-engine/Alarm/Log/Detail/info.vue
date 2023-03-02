<template>
    <a-modal visible title="详情" okText="确定" cancelText="取消" :width="1000" @ok="closeModal" @cancel="closeModal">
        <a-descriptions bordered :column="2">
            <a-descriptions-item v-if="props.data.targetType==='device'" label="告警设备" :span="1">{{props.data?.targetName || ''}}</a-descriptions-item>
            <a-descriptions-item v-if="props.data.targetType==='device'" label="设备ID" :span="1">{{props.data?.targetId || ''}}</a-descriptions-item>
            <a-descriptions-item label="告警名称" :span="1">{{
                props.data?.alarmConfigName
            }}</a-descriptions-item>
            <a-descriptions-item label="告警时间" :span="1">{{
                moment(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss')
            }}</a-descriptions-item>
            <a-descriptions-item label="告警级别" :span="1">
                <a-tooltip
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
                </a-tooltip>
            </a-descriptions-item>
            <a-descriptions-item label="告警说明" :span="1"
                ><a-tooltip
                    placement="topLeft"
                    :title="data?.description || ''"
                >
                    <Ellipsis>
                        <span>
                            {{ data?.description || '' }}
                        </span> </Ellipsis
                    >
                </a-tooltip></a-descriptions-item
            >
            <a-descriptions-item
                label="告警流水"
                :span="2"
            ><div style="max-height: 500px; overflow-y: auto;"><JsonViewer :value="JSON.parse(data?.alarmInfo || '{}')" :expand-depth="5"></JsonViewer></div></a-descriptions-item>
        </a-descriptions>
    </a-modal>
</template>

<script lang="ts" setup>
import moment from 'moment';
import { Store } from 'jetlinks-store';
import JsonViewer from 'vue-json-viewer';
const props = defineProps({
    data: Object,
});
const emit = defineEmits(['close'])
const closeModal = () => {
    emit('close');
}
</script>
<style lang="less" scoped>
</style>