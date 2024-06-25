<template>
    <j-modal
        visible
        title="详情"
        width="754px"
        @cancel="emits('update:visible', false)"
        class="view-dialog-container"
    >
        <template
            v-if="
                ['device-transparent-codec', 'system-event'].includes(
                    data?.topicProvider,
                )
            "
        >
            <div>
                <div class="label">通知流水:</div>
                <div
                    style="
                        padding: 10px;
                        background-color: #fafafa;
                        overflow: auto;
                        height: 200px;
                    "
                >
                    <JsonViewer :value="data" :expandDepth="10" />
                </div>
            </div>
        </template>
        <template
            v-else-if="
                [
                    'workflow-task-cc',
                    'workflow-task-todo',
                    'workflow-task-reject',
                    'workflow-process-finish',
                    'workflow-process-repealed',
                    'workflow-task-transfer-todo',
                ].includes(data?.topicProvider)
            "
        >
            <j-descriptions
                :column="2"
                :contentStyle="{
                    color: '#333333',
                }"
                :labelStyle="{
                    color: 'rgba(0, 0, 0, 0.6)',
                    width: '72px',
                }"
            >
                <j-descriptions-item label="发起人">
                    <j-ellipsis>{{ workFlowData?.creatorName }}</j-ellipsis>
                </j-descriptions-item>
                <j-descriptions-item label="发起时间">
                    <j-ellipsis>
                        {{
                            dayjs(workFlowData?.createTime).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )
                        }}
                    </j-ellipsis>
                </j-descriptions-item>
                <j-descriptions-item label="流程分类">
                    <j-ellipsis>
                        {{ workFlowData?.classifiedName }}
                    </j-ellipsis>
                </j-descriptions-item>
                <j-descriptions-item label="流程名称"
                    ><j-ellipsis>
                        {{ workFlowData?.modelName }}
                    </j-ellipsis></j-descriptions-item
                >
                <j-descriptions-item label="标题"
                    ><j-ellipsis>
                        {{ workFlowData?.name }}
                    </j-ellipsis></j-descriptions-item
                >
                <j-descriptions-item label="摘要">
                    <j-ellipsis>
                        {{ workFlowData?.summary }}
                    </j-ellipsis>
                </j-descriptions-item>
            </j-descriptions>
        </template>
        <template v-else>
            <j-descriptions
                :column="2"
                :contentStyle="{
                    color: '#333333',
                }"
                :labelStyle="{
                    color: 'rgba(0, 0, 0, 0.6)',
                    width: '72px',
                }"
            >
                <template v-if="data?.topicProvider === 'alarm-device'">
                    <j-descriptions-item label="告警设备">
                        <j-ellipsis>{{ _data?.targetName || '' }}</j-ellipsis>
                    </j-descriptions-item>
                    <j-descriptions-item label="设备ID">
                        <j-ellipsis>
                            {{ _data?.targetId || '' }}
                        </j-ellipsis>
                    </j-descriptions-item>
                </template>
                <j-descriptions-item label="告警名称">
                    <j-ellipsis>
                        {{ _data?.alarmName || _data?.alarmConfigName || '' }}
                    </j-ellipsis>
                </j-descriptions-item>
                <j-descriptions-item label="告警时间">{{
                    dayjs(_data?.alarmTime).format('YYYY-MM-DD HH:mm:ss')
                }}</j-descriptions-item>
                <j-descriptions-item label="告警级别">{{
                    (levelList.length > 0 && getLevelLabel(_data.level)) || ''
                }}</j-descriptions-item>
                <j-descriptions-item label="告警说明">
                    <j-ellipsis>
                        {{ _data?.description || '' }}
                    </j-ellipsis>
                </j-descriptions-item>
            </j-descriptions>
            <div>
                <div class="label">告警流水:</div>
                <div
                    style="
                        padding: 10px;
                        background-color: #fafafa;
                        height: 200px;
                        overflow: auto;
                    "
                >
                    <JsonViewer
                        style="background-color: #fafafa"
                        :value="JSON.parse(_data?.alarmInfo || '{}')"
                    />
                </div>
            </div>
        </template>
        <template #footer>
            <j-button type="primary" @click="emits('update:visible', false)"
                >确定</j-button
            >
        </template>
    </j-modal>
</template>

<script setup lang="ts">
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import { queryLevel as queryLevel_api } from '@/api/rule-engine/config';
import dayjs from 'dayjs';
import { getWorkflowNotice } from '@/api/account/notificationRecord';

const emits = defineEmits(['update:visible']);
const props = defineProps<{
    visible: boolean;
    data: any;
    type: string;
}>();

const levelList = ref<any[]>([]);
//工作流详情的值
const workFlowData = ref();

const _data = computed(() => {
    if (props.data.detailJson) return JSON.parse(props.data.detailJson);
    else return props.data?.detail || props.data;
});

const getLevel = () => {
    queryLevel_api().then((resp: any) => {
        if (resp.status === 200) levelList.value = resp.result.levels;
    });
};
const getLevelLabel = (id: number) => {
    if (levelList.value.length < 1 || !id) return '';
    const obj = levelList.value.find((item) => item.level === id);
    return obj?.title;
};
onMounted(() => {
    if (
        !['device-transparent-codec', 'system-event'].includes(
            props?.data?.topicProvider,
        )
    ) {
        getLevel();
    }
    if (
        [
            'workflow-task-cc',
            'workflow-task-todo',
            'workflow-task-reject',
            'workflow-process-finish',
            'workflow-process-repealed',
            'workflow-task-transfer-todo',
        ].includes(props?.data?.topicProvider)
    ) {
        const params = {
            terms: [
                {
                    type: 'or',
                    value: [
                        'workflow-process-finish',
                        'workflow-process-repealed',
                    ].includes(props?.data?.topicProvider)
                        ? props?.data?.dataId
                        : props?.data?.detailJson
                        ? JSON.parse(props?.data?.detailJson)?.processId
                        : props?.data?.detail?.processId,
                    termType: 'eq',
                    column: 'id',
                },
            ],
        };
        getWorkflowNotice(params).then((res) => {
            workFlowData.value = {
                topicProvider: props?.data?.topicProvider,
                ...res?.result?.[0],
            };
        });
    }
});
</script>

<style lang="less" scoped>
.view-dialog-container {
    .label {
        width: 100%;
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 8px;
    }

    .value {
        color: #333333;
    }
}
</style>
