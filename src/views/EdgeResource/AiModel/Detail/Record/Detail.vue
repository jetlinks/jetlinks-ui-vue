<template>
    <a-drawer
        visible
        :title="record?.name"
        width="70%"
        :maskClosable="false"
        @close="onCancel"
    >
        <div class="log-detail-body">
            <div style="margin-bottom: 16px;">
                <TitleComponent data="基本信息"/>
                <a-descriptions bordered>
                    <a-descriptions-item label="创建人" :labelStyle="{width: '110px'}">
                        {{resourceStore.resource.creatorName}}
                    </a-descriptions-item>
                    <a-descriptions-item label="创建时间" :labelStyle="{width: '110px'}">
                        {{dayjs(resourceStore.resource.createTime).format('YYYY-MM-DD HH:mm:ss')}}
                    </a-descriptions-item>
                    <a-descriptions-item label="网关数量" :labelStyle="{width: '110px'}">
                        {{ record.thingTotal }}
                    </a-descriptions-item>
                    <a-descriptions-item label="文件" :labelStyle="{width: '110px'}">
                        {{JSON.parse(resourceStore.resource.metadata || '{}')?.filename || resourceStore.resource?.properties?.fileName}}
                    </a-descriptions-item>
                    <a-descriptions-item label="版本" :labelStyle="{width: '110px'}"></a-descriptions-item>
                    <a-descriptions-item label="说明" :labelStyle="{width: '110px'}">
                        {{JSON.parse(resourceStore.resource.metadata || '{}')?.description || resourceStore.resource?.properties?.fileName}}

                    </a-descriptions-item>
                </a-descriptions>
            </div>
            <div>
                <TitleComponent data="任务信息"/>
                <div style="display: flex;justify-content: space-between;">
                    <j-space>
                        <j-button @click="handlePauseAll">
                            <AIcon type="PauseOutlined"/>
                            全部暂停
                        </j-button>
                        <j-button @click="handleStartAll">
                            <AIcon type="PlayCircleOutlined"/>
                            全部开始
                        </j-button>
                        <j-button @click="handlePauseAllRetry">
                            <AIcon type="RedoOutlined"/>
                            批量重试
                        </j-button>
                    </j-space>
                    <j-button type="text" @click="handleRefresh">
                        <AIcon type="RedoOutlined"/>
                        刷新
                    </j-button>
                </div>
                <div class="progress--warp" :style="progressStyles">
                </div>
                <div class="progress-info">
                    <a-space size="large">
                        <span v-for="item in record.stateCount">
                            <a-space>
                                <Icon :type="iconMap[item.state.value]" :style="{color: `var(--ant-${colorMap[item.state.value]}-color)`}"></Icon>
                                <span>{{item.state.text}}</span>
                                <span>{{item.total}}</span>
                            </a-space>
                        </span>
                    </a-space>
                    <span>共{{ record.thingTotal }}个网关</span>
                </div>
                <JProTable
                    ref="tableRef"
                    model="TABLE"
                    :request="queryList"
                    :defaultParams="defaultParams"
                    :columns="gatewayColumns"
                >
                    <template #state="slotProps">
                        <a-space>
                            <Icon :type="iconMap[slotProps.state.value]" :style="{color: `var(--ant-${colorMap[slotProps.state.value]}-color)`}"></Icon>
                            <div class="state-text" v-if="slotProps.state?.value === 'failed'">
                                {{ slotProps.state?.text }}：{{ slotProps.errorCode }}
                            </div>
                            <div class="state-text" v-else>
                                {{ slotProps.state?.text }}
                            </div>
                        </a-space>
                    </template>
                    <template #completeTime="slotProps">
                        {{ slotProps.completeTime ? dayjs(slotProps.completeTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}
                    </template>
                    <template #action="record">
                        <a-space :size="24">
                            <PermissionButton
                                v-if="
                                    record.state.value === 'waiting' ||
                                    record.state.value === 'running'
                                "
                                type="link"
                                :tooltip="{
                                    title: '停止',
                                }"
                                style="padding: 0"
                                :popConfirm="{
                                    title: '确认停止?',
                                    onConfirm: async () => {
                                        stopUpgrades(record.id);
                                    },
                                }"
                            >
                                <AIcon type="StopOutlined" />
                            </PermissionButton>
                            <PermissionButton
                                v-if="record.state.value === 'failed'"
                                type="link"
                                :tooltip="{
                                    title: '重试',
                                }"
                                style="padding: 0"
                                :popConfirm="{
                                    title: '确认重试?',
                                    onConfirm: () => {
                                        startUpgrades(record.id);
                                    },
                                }"
                            >
                                <AIcon type="ReloadOutlined" />
                            </PermissionButton>
                            <PermissionButton
                                v-if="record.state.value === 'canceled'"
                                type="link"
                                :tooltip="{
                                    title: '开始',
                                }"
                                style="padding: 0"
                                :popConfirm="{
                                    title: '确认开始?',
                                    onConfirm: async () => {
                                        startUpgrades(record.id);
                                    },
                                }"
                            >
                                <AIcon type="PlayCircleOutlined" />
                            </PermissionButton>
                            <PermissionButton
                                type="link"
                                :tooltip="{
                                    title: '删除',
                                }"
                                danger
                                style="padding: 0"
                                :popConfirm="{
                                    title: '确认删除?',
                                    onConfirm: () => {
                                        deleteUpgrades(record.id);
                                    },
                                }"
                                :disabled="
                                    record.state.value === 'waiting' ||
                                    record.state.value === 'running'
                                "
                            >
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </a-space>
                    </template>
                </JProTable>
            </div>
        </div>
    </a-drawer>
</template>

<script setup name="LogDrawer">
import {
    queryIssueDetail,
    pauseAll,
    startTask,
    startTaskOne,
    stopTaskOne,
    deleteTaskOne,
    deleteJob
} from '@/api/edge-resource';
import {queryNoPagingPost} from '@/api/device/instance';
import dayjs from "dayjs";
import {onlyMessage} from "@/utils/comm";
import Icon from '@/views/edge/Batch/components/Icon.vue'
import { useResourceStore } from "store/resource";

const props = defineProps({
    record: {
        type: Object,
        default: () => ({})
    }
})

const colorMap = {
    'success': 'success',
    'complete': 'success',
    'running': 'warning',
    'incomplete': 'warning',
    'failed': 'error',
    'waiting': 'primary'
}

const iconMap = {
    'success': 'CheckCircleFilled',
    'running': 'ClockCircleFilled',
    'failed': 'InfoCircleFilled',
    'canceled': 'PauseCircleFilled',
    'waiting': 'icon-paiduizhong',
}

const emit = defineEmits(['showTaskDetail', 'copy', 'cancel', 'reload']);

const resourceStore = useResourceStore();
const dataSource = ref([]);
const defaultParams = {
    terms: [
        {
            column: "jobId",
            termType: "eq",
            value: props.record.id,
        }
    ]
}

const tableRef = ref();
const gatewayColumns = [
    {
        title: '网关设备id',
        dataIndex: 'thingId',
        ellipsis: true,
        width: 200,
    },
    {
        title: '网关设备名称',
        dataIndex: 'thingName',
        ellipsis: true,
    },
    {
        title: '设备类型',
        dataIndex: 'deviceType',
        ellipsis: true,
        width: 100,
    },
    {
        title: '设备状态',
        dataIndex: 'deviceState',
        ellipsis: true,
        width: 100,
    },
    {
        title: '完成时间',
        dataIndex: 'completeTime',
        scopedSlots: true,
        ellipsis: true,
        width: 180,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
        width: 120,
    },
]

const progressStyles = computed(() => {
    const value = {
        'error': (props.record?.stateCount?.find(item => item.state?.value === 'failed')?.percent || 0) * 100,
        'success': (props.record?.stateCount?.find(item => item.state?.value === 'success')?.percent || 0) * 100,
        'primary': (props.record?.stateCount?.find(item => item.state?.value === 'waiting')?.percent || 0) * 100,
    }
    const bgi = Object.keys(value).reduce((prev, key, index) => {
        const v = Object.values(value).splice(0, index + 1).reduce((a, b) => a + b, 0)
        prev += `var(--ant-${key}-color) 0, var(--ant-${key}-color) ${v}%,`
        return prev
    }, '')

    return {
        'background-image': 'linear-gradient(90deg,' + bgi + '#EFF0F1 0, #EFF0F1 100%)'
    }
})

const onCancel = () => {
    emit('cancel')
}

//列表
const queryList = (params) => {
    return new Promise(async (resolve, reject) => {
        const res = await queryIssueDetail(params);
        if(res.success && res.result.data.length) {
            const resp = await queryNoPagingPost({
                terms: [
                    {
                        column: 'id',
                        termType: 'in',
                        value: res.result.data.map(item => item.thingId)
                    }
                ]
            })
            if(resp.success) {
                res.result.data.forEach(item => {
                    const device = resp.result.find(i => i.id === item.thingId);
                    item.deviceType = device?.deviceType?.text;
                    item.deviceState = device?.state?.text;
                })
                dataSource.value = res.result.data || []
                resolve({
                    ...res
                })
            }
        }
    })
}


//刷新
const handleRefresh = () => {
    tableRef.value?.reload();
    emit('reload');
}

//全部删除
const deleteAll = async () => {
    const res = await deleteJob(props.record.id);
    if (res.success) {
        emit('cancel');
        emit('reload');
    }
};

//全部暂停
const handlePauseAll = async () => {
    const res = await pauseAll(props.record.id);
    if (res) {
        tableRef.value?.reload();
        onlyMessage('操作成功');
        emit('reload');
    }
}

//全部开始
const handleStartAll = async () => {
    const res = await startTask (props.record.id, ['failed', 'canceled']);
    if (res) {
        tableRef.value?.reload();
        onlyMessage('操作成功');
        emit('reload');
    }
}

//批量重试
const handlePauseAllRetry = async () => {
    const res = await startTask( props.record.id, ['failed', 'canceled']);
    if (res) {
        tableRef.value?.reload();
        onlyMessage('操作成功');
        emit('reload');
    }
}

//开始某个记录
const startUpgrades = async (id) => {
    const res = await startTaskOne(id, ['failed']);
    if (res.success) {
        tableRef.value?.reload();
        emit('reload');
    }
};

//停止某个记录
const stopUpgrades = async (id) => {
    const res = await stopTaskOne(id, {});
    if (res.success) {
        tableRef.value?.reload();
        emit('reload');
    }
};

//删除某个记录
const deleteUpgrades = async (id) => {
    if (dataSource.value?.length === 1) {
        await deleteAll();
    } else {
        const res = await deleteTaskOne(id);
        if (res.success) {
            tableRef.value?.reload();
            emit('reload');
        }
    }
};

</script>

<style scoped>
:deep(.jtable-body-spin) {
    padding: 0;
}

.progress--warp {
    height: 6px;
    border-radius: 3px;
    position: relative;
    margin: 16px 0;
}

.progress-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.state-text {
    font-size: 14px;
    color: #8D9399;
}
</style>
