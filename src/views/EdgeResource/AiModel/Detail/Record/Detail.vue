<template>
    <a-drawer
        visible
        :title="record?.name"
        :width="1000"
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
                        {{ record.total }}
                    </a-descriptions-item>
                    <a-descriptions-item label="已完成" :labelStyle="{width: '110px'}">
                        {{ addUnit(record.successRatio) }}
                    </a-descriptions-item>
                    <a-descriptions-item label="已失败" :labelStyle="{width: '110px'}">
                        {{ addUnit(record.failedRatio) }}
                    </a-descriptions-item>
                    <a-descriptions-item label="进行中" :labelStyle="{width: '110px'}">
                        {{ addUnit(record.processingRatio) }}
                    </a-descriptions-item>
                    <a-descriptions-item label="排队中" :labelStyle="{width: '110px'}">
                        {{ addUnit(record.waitingRatio) }}
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
                <div style="display: flex;justify-content: space-between">
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
                    <j-space>
                        <span align="center">当前进度</span>
                        <StatusInfo
                            :success="addUnit(record.successRatio)"
                            :failed="addUnit(record.failedRatio)"
                            :processing="addUnit(record.processingRatio)"
                            :waiting="addUnit(record.waitingRatio)"
                        />
                    </j-space>
                    <span>共{{ record.total }}个网关</span>
                </div>
                <JProTable
                    ref="tableRef"
                    model="TABLE"
                    :request="queryList"
                    :defaultParams="defaultParams"
                    :columns="gatewayColumns"
                >
                    <template #state="slotProps">
                        <div class="state-text" v-if="slotProps.state?.value === 'failed'">
                            {{ taskStateEnum[slotProps.state?.value] }}：{{ slotProps.errorReason }}
                        </div>
                        <div class="state-text" v-else>
                            {{ taskStateEnum[slotProps.state?.value] }}
                        </div>
                    </template>
                    <template #upgradeTime="slotProps">
                        {{ dayjs(slotProps.upgradeTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </JProTable>
            </div>
        </div>
    </a-drawer>
</template>

<script setup name="LogDrawer">
import {queryIssueDetail, pauseAll, startTask} from '@/api/edge-resource';
import {queryNoPagingPost} from '@/api/device/instance';
import dayjs from "dayjs";
import {onlyMessage} from "@/utils/comm";
import StatusInfo from './StatusInfo.vue';
import { useResourceStore } from "store/resource";

const props = defineProps({
    record: {
        type: Object,
        default: () => ({})
    }
})

const taskStateEnum = {
    'processing': '进行中',
    'success': '下发成功',
    'failed': '下发失败',
    'waiting': '排队中',
}

const emit = defineEmits(['showTaskDetail', 'copy', 'cancel', 'reload']);

const resourceStore = useResourceStore();

const defaultParams = {
    terms: [
        {
            column: "taskId",
            termType: "eq",
            value: props.record.id,
        }
    ]
}

const tableRef = ref();
const gatewayColumns = [
    {
        title: '网关设备id',
        dataIndex: 'deviceId',
        width: 200
    },
    {
        title: '网关设备名称',
        dataIndex: 'deviceName',
    },
    {
        title: '设备类型',
        dataIndex: 'deviceType',
        width: 100,
    },
    {
        title: '设备状态',
        dataIndex: 'deviceState',
        width: 100,
    },
    {
        title: '完成时间',
        dataIndex: 'upgradeTime',
        scopedSlots: true,
        width: 180
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 250
    },
]

const progressStyles = computed(() => {
    const value = {
        'success': props.record.successRatio,
        'warning': props.record.processingRatio + props.record.waitingRatio,
        'error': props.record.failedRatio,
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

const addUnit = (val) => {
    return val + '%';
}

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
                        value: res.result.data.map(item => item.deviceId)
                    }
                ]
            })
            if(resp.success) {
                res.result.data.forEach(item => {
                    const device = resp.result.find(i => i.id === item.deviceId);
                    item.deviceType = device?.deviceType?.text;
                    item.deviceState = device?.state?.text;
                })
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

//全部暂停
const handlePauseAll = async () => {
    const res = await pauseAll('resourceIssue', props.record.id);
    if (res) {
        tableRef.value?.reload();
        onlyMessage('操作成功');
        emit('reload');
    }
}

//全部开始
const handleStartAll = async () => {
    const res = await startTask('resourceIssue', props.record.id, ['failed', 'canceled']);
    if (res) {
        tableRef.value?.reload();
        onlyMessage('操作成功');
        emit('reload');
    }
}

//批量重试
const handlePauseAllRetry = async () => {
    const res = await startTask('resourceIssue', props.record.id, ['failed']);
    if (res) {
        tableRef.value?.reload();
        onlyMessage('操作成功');
        emit('reload');
    }
}
</script>

<style scoped>
:deep(.jtable-body-spin) {
    padding: 0;
}

.progress--warp {
    height: 4px;
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
