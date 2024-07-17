<template>
    <a-modal
        visible
        title="任务详情"
        :width="1200"
        :closable="false"
        :maskClosable="false"
    >
        <div class="generalInfo">
            <div class="allOperation">
                <PermissionButton
                    @click="stopAll"
                    hasPermission="device/Firmware:update"
                    ><template #icon><AIcon type="PauseOutlined" /> </template
                    >全部暂停
                </PermissionButton>
                <PermissionButton
                    style="margin-left: 20px"
                    hasPermission="device/Firmware:update"
                    @click="startAll"
                    ><template #icon
                        ><AIcon type="CaretRightOutlined" /> </template
                    >全部开始</PermissionButton
                >
                <PermissionButton
                    v-if="data?.mode?.value === 'push'"
                    style="margin-left: 20px"
                    hasPermission="device/Firmware:update"
                    @click="batchRetry"
                    ><template #icon><AIcon type="RedoOutlined" /> </template>
                    批量重试
                </PermissionButton>
                <PermissionButton
                    type="text"
                    hasPermission="device/Firmware:update"
                    style="float: right"
                    @click="refreshState"
                    ><template #icon><AIcon type="RedoOutlined" /> </template>
                    刷新状态
                </PermissionButton>
            </div>
            <div class="progress">
                <div style="width: 90%">
                    <span>当前进度</span>
                    <a-progress
                        style="width: 90%; margin-left: 20px"
                        :strokeWidth="10"
                        :percent="general.percent"
                        :format="(percent) => `${percent}%`"
                    ></a-progress>
                </div>
                <span class="total">共{{ general.total }}个任务</span>
            </div>
        </div>
        <j-table
            :columns="columns"
            :data-source="historyList"
            :pagination="false"
            :rowClassName="rowClassName"
            :scroll="{
                y: 400,
            }"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'createTime'">{{
                    dayjs(text).format('YYYY-MM-DD HH:mm:ss')
                }}</template>
                <template v-if="column.dataIndex === 'completeTime'">{{
                    text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '--'
                }}</template>
                <template v-if="column.dataIndex === 'state'">
                    <div class="state">
                        <a-progress
                            type="circle"
                            style="margin-right: 10px"
                            :width="20"
                            :showInfo="false"
                            trailColor="#f0f0f0"
                            :percent="
                                text?.value === 'failed'
                                    ? '100'
                                    : record?.progress
                            "
                            :status="
                                text?.value === 'failed' ? 'exception' : ''
                            "
                        />
                        <div
                            v-if="
                                text?.value !== 'failed' &&
                                text?.value !== 'waiting'
                            "
                        >
                            {{ record?.progress + '%' }}
                        </div>
                        <div v-if="text?.value === 'failed'">
                            {{ text?.text + '：' + record?.errorReason }}
                        </div>
                        <div v-if="text?.value === 'waiting'">
                            {{ text?.text }}
                        </div>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'version'">
                    {{ text | '--' }}
                </template>
            </template>
        </j-table>
        <template #footer>
            <span class="tip">关闭弹窗不会影响任务执行状态</span>
            <a-button value="large" type="primary" @click="$emit('closeDetail')"
                >关闭</a-button
            >
        </template>
    </a-modal>
</template>

<script setup name="TaskDetail">
import {
    historyPaginateNot,
    stopTask,
    startTask,
    startOneTask,
    stopOneTask,
} from '@/api/device/firmware';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
    deviceId: {
        type: String,
    },
});
const emit = defineEmits(['closeDetail', 'refresh']);
const columns = [
    {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
    },
    {
        title: '所属产品',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width: 200,
    },
    {
        title: '完成时间',
        key: 'completeTime',
        dataIndex: 'completeTime',
    },
    {
        title: '设备版本',
        key: 'version',
        dataIndex: 'version',
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
    },
];
//列表数据
const historyList = ref();
//总进度
const general = reactive({
    total: 0,
    percent: 0,
});
const rowClassName = (record, index) => {
    return record.deviceId === props.deviceId ? 'heightLightRow' : '';
};
//查询任务升级记录列表
const queryHistoryList = async () => {
    const params = {
        paging: false,
        sorts: [
            { name: 'createTime', order: 'desc' },
            { name: 'upgradeTime', order: 'desc' },
        ],
        terms: [
            {
                terms: [
                    {
                        column: 'taskId',
                        value: props?.data?.id,
                    },
                ],
            },
        ],
    };
    const res = await historyPaginateNot(params);
    if (res.status === 200) {
        historyList.value = res.result;
        general.total = res.result.length;
        let progress = 0;
        res.result.forEach((item) => {
            item?.state?.value === 'success' ? (progress += 1) : '';
        });
        general.percent = (progress / general.total.toFixed(2)) * 100;
    }
};
const refreshState = async () => {
    emit('refresh');
    await queryHistoryList();
    onlyMessage('操作成功');
};
//全部开始
const startAll = async () => {
    const state =
        props.data?.mode?.value === 'push'
            ? ['canceled', 'failed']
            : ['canceled'];
    const res = await startTask(props.data.id, state);
    if (res.success) {
        onlyMessage('操作成功', 'success');
        queryHistoryList();
        emit('refresh');
    }
};
//全部重试
const batchRetry = async () => {
    const res = await startTask(props.data.id, ['failed']);
    if (res.success) {
        onlyMessage('操作成功', 'success');
        queryHistoryList();
        emit('refresh');
    }
};
//全部停止
const stopAll = async () => {
    const res = await stopTask(props.data.id);
    if (res.success) {
        onlyMessage('操作成功', 'success');
        queryHistoryList();
        emit('refresh');
    }
};
//升级某个记录
const startUpgrades = async (id) => {
    const res = await startOneTask([id]);
    if (res.success) {
        onlyMessage('操作成功', 'success');
        queryHistoryList();
        emit('refresh');
    }
};
//停止某个记录
const stopUpgrades = async (id) => {
    const res = await stopOneTask([id]);
    if (res.success) {
        onlyMessage('操作成功', 'success');
        queryHistoryList();
        emit('refresh');
    }
};

onMounted(() => {
    queryHistoryList();
});
</script>
<style lang="less" scoped>
.generalInfo {
    margin-bottom: 30px;
    .progress {
        width: 100%;
        line-height: 32px;
        display: flex;
    }
    .allOperation {
        margin-bottom: 20px;
    }
}
.tip {
    color: rgb(170, 170, 170);
    margin-right: 10px;
}
.state {
    display: flex;
}
</style>
<style>
.heightLightRow {
    background-color: rgb(242, 228, 255);
}
</style>
