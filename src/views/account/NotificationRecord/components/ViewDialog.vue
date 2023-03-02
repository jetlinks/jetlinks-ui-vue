<template>
    <a-modal
        visible
        title="详情"
        width="1000px"
        @ok="emits('update:visible', false)"
        @cancel="emits('update:visible', false)"
        class="view-dialog-container"
    >
        <a-row v-if="data?.targetType === 'device'">
            <a-col :span="4" class="label">告警设备</a-col>
            <a-col :span="8" class="value">
                {{ data?.targetName || '' }}
            </a-col>
            <a-col :span="4" class="label">设备ID</a-col>
            <a-col :span="8" class="value">
                {{ data?.targetId || '' }}
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="4" class="label">告警名称</a-col>
            <a-col :span="8" class="value">
                {{ data?.alarmName || data?.alarmConfigName || '' }}
            </a-col>
            <a-col :span="4" class="label">告警时间</a-col>
            <a-col :span="8" class="value">
                {{ moment(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss') }}
            </a-col>

            <a-col :span="4" class="label">告警级别</a-col>
            <a-col :span="8" class="value">
                {{ (levelList.length > 0 && getLevelLabel(data.level)) || '' }}
            </a-col>
            <a-col :span="4" class="label">告警说明</a-col>
            <a-col :span="8" class="value">{{ data?.description || '' }}</a-col>

            <a-col
                :span="4"
                class="label"
                style="display: flex; height: 440px; align-items: center"
                >告警流水</a-col
            >
            <a-col
                :span="20"
                class="value"
                style="max-height: 440px; overflow: auto"
            >
                <JsonViewer :value="JSON.parse(data?.alarmInfo || '{}')" />
            </a-col>
        </a-row>
    </a-modal>
</template>

<script setup lang="ts">
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import { queryLevel as queryLevel_api } from '@/api/rule-engine/config';
import moment from 'moment';

const emits = defineEmits(['update:visible']);
const props = defineProps<{
    visible: boolean;
    data: any;
}>();
const levelList = ref<any[]>([]);
const data = computed(() => {
    if (props.data.detailJson) return JSON.parse(props.data.detailJson);
    else return props.data?.detail || props.data;
});

const getLevel = () => {
    queryLevel_api().then((resp: any) => {
        if (resp.status === 200) levelList.value = resp.result.levels;
    });
};
getLevel();
const getLevelLabel = (id: number) => {
    if (levelList.value.length < 1 || !id) return '';
    const obj = levelList.value.find((item) => item.level === id);
    return obj?.title;
};
</script>

<style lang="less" scoped>
.view-dialog-container {
    .ant-row {
        .ant-col {
            padding: 16px 24px;
            border-right: 1px solid #f0f0f0;
        }
        .label {
            background-color: #fafafa;
        }
        .value {
        }
    }
}
</style>
