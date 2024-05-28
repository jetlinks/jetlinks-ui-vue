<template>
    <a-modal
        visible
        title="任务详情"
        :width="1200"
        :closable="false"
        :maskClosable="false"
    >
        <div class="allOperation">
            <a-button
                :disabled="
                    !(data?.waiting > 0 && data?.state?.value === 'processing')
                "
                @click="stopAll"
                ><template #icon><AIcon type="PauseOutlined" /> </template
                >全部暂停
            </a-button>
            <a-button
                style="margin-left: 20px"
                :disabled="data?.state?.value !== 'canceled'"
                @click="startAll"
                ><template #icon><AIcon type="CaretRightOutlined" /> </template
                >全部开始</a-button
            >
        </div>
        <div class="generalInfo">
            <div style="width: 80%">
                <span>当前进度</span>
                <a-progress
                    style="width: 90%"
                    strokeLinecap="square"
                    :strokeWidth="20"
                    :percent="general.percent"
                    :format="(percent) => `已完成${percent}%`"
                ></a-progress>
            </div>
            <div class="total">共{{ general.total }}个任务</div>
        </div>
        <j-table
            :columns="columns"
            :data-source="historyList"
            :pagination="false"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'createTime'">{{
                    dayjs(text).format('YYYY-MM-DD HH:mm:ss')
                }}</template>
                <template v-if="column.dataIndex === 'completeTime'">{{
                    text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '--'
                }}</template>
                <template v-if="column.dataIndex === 'state'">
                    <a-progress
                        strokeLinecap="square"
                        :percent="
                            text?.value === 'failed' ? '100' : record?.progress
                        "
                        :status="text?.value === 'failed' ? 'exception' : ''"
                        :showInfo="false"
                    />
                    <div
                        v-if="
                            text?.value !== 'failed' &&
                            text?.value !== 'waiting'
                        "
                    >
                        {{ text?.text + ' ' + record?.progress + '%' }}
                    </div>
                    <div v-if="text?.value === 'failed'">
                        {{ text?.text + '：' + record?.errorReason }}
                    </div>
                    <div v-if="text?.value === 'waiting'">
                        {{ text?.text }}
                    </div>
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <a-button
                        v-if="
                            record.state.value === 'waiting' ||
                            record.state.value === 'processing'
                        "
                        :disabled="record.state.value === 'processing'"
                        type="text"
                        @click="() => stopUpgrades(record.id)"
                    >
                        <template #icon>
                            <AIcon type="PauseOutlined"></AIcon></template
                    ></a-button>
                    <a-button
                        v-if="
                            record.state.value === 'canceled' ||
                            record.state.value === 'success' ||
                            record.state.value === 'failed'
                        "
                        :disabled="record.state.value === 'success'"
                        type="text"
                        @click="() => startUpgrades(record.id)"
                    >
                        <template #icon>
                            <AIcon
                                :type="
                                    record.state.value === 'failed'
                                        ? 'RedoOutlined'
                                        : 'CaretRightOutlined'
                                "
                            ></AIcon></template
                    ></a-button>
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
    stopOneTask
} from '@/api/device/firmware';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
});
const emit = defineEmits(['closeDetail']);
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
        title: '状态',
        dataIndex: 'state',
        key: 'state',
    },

    {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
    },
];
//列表数据
const historyList = ref();
//总进度
const general = reactive({
    total: 0,
    percent: 0,
});
//查询任务升级记录列表
const queryHistoryList = async () => {
    const params = {
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
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
        const successArr = res.result.filter(
            (i) => i?.state?.value === 'success',
        );
        general.percent = (successArr.length / general.total) * 100;
    }
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
    }
};
//全部停止
const stopAll = async () => {
    const res = await stopTask(props.data.id);
    if (res.success) {
        onlyMessage('操作成功', 'success');
        queryHistoryList();
    }
};
//升级某个记录
const startUpgrades = async (id) => {
    const res = await startOneTask([id]);
    if (res.success) {
        onlyMessage('操作成功', 'success');
        queryHistoryList();
    }
};
//停止某个记录
const stopUpgrades = async(id) =>{
    const res = await stopOneTask([id]);
    if(res.success){
        onlyMessage('操作成功', 'success');
        queryHistoryList();
    }
}
onMounted(() => {
    queryHistoryList();
});
</script>
<style lang="less" scoped>
.generalInfo {
    display: flex;
    margin: 30px 0;
    .total {
        margin-left: 5%;
    }
}
.tip {
    color: rgb(170, 170, 170);
    margin-right: 10px;
}
</style>
