<template>
    <j-modal
        visible
        title="详情"
        width="1000px"
        @ok="emits('update:visible', false)"
        @cancel="emits('update:visible', false)"
        class="view-dialog-container"
    >
        <template v-if="type === 'alarm'">
            <j-row v-if="data?.topicProvider === 'alarm-device'">
                <j-col :span="4" class="label">告警设备</j-col>
                <j-col :span="8" class="value">
                    {{ data?.targetName || '' }}
                </j-col>
                <j-col :span="4" class="label">设备ID</j-col>
                <j-col :span="8" class="value">
                    {{ data?.targetId || '' }}
                </j-col>
            </j-row>
            <j-row>
                <j-col :span="4" class="label">告警名称</j-col>
                <j-col :span="8" class="value">
                    {{ data?.alarmName || data?.alarmConfigName || '' }}
                </j-col>
                <j-col :span="4" class="label">告警时间</j-col>
                <j-col :span="8" class="value">
                    {{ dayjs(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss') }}
                </j-col>

                <j-col :span="4" class="label">告警级别</j-col>
                <j-col :span="8" class="value">
                    {{
                        (levelList.length > 0 && getLevelLabel(data.level)) ||
                        ''
                    }}
                </j-col>
                <j-col :span="4" class="label">告警说明</j-col>
                <j-col :span="8" class="value">{{
                    data?.description || ''
                }}</j-col>

                <j-col
                    :span="4"
                    class="label"
                    style="display: flex; height: 440px; align-items: center"
                    >告警流水</j-col
                >
                <j-col
                    :span="20"
                    class="value"
                    style="max-height: 440px; overflow: auto"
                >
                    <JsonViewer :value="JSON.parse(data?.alarmInfo || '{}')" />
                </j-col>
            </j-row>
        </template>
        <template v-else>
            <j-row>
                <j-col
                    :span="4"
                    class="label"
                    style="display: flex; height: 440px; align-items: center"
                    >通知流水</j-col
                >
                <j-col
                    :span="20"
                    class="value"
                    style="max-height: 440px; overflow: auto"
                >
                    <JsonViewer :value="JSON.parse(data?.alarmInfo || '{}')" />
                </j-col>
            </j-row>
        </template>
    </j-modal>
</template>

<script setup lang="ts">
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import { queryLevel as queryLevel_api } from '@/api/rule-engine/config';
import dayjs from 'dayjs';

const emits = defineEmits(['update:visible']);
const props = defineProps<{
    visible: boolean;
    data: any;
    type: string;
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
    }
}
</style>
