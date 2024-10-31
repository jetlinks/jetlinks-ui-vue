<template>
    <a-modal
        visible
        title="任务详情"
        width="75vw"
        @cancel="$emit('closeDetail')"
        :maskClosable="false"
    >
        <div class="generalInfo">
            <div class="header">
                <div class="header-left">
                    <div style="font-size: 20px; max-width: 300px">
                        <j-ellipsis>{{ data.name || '--' }}</j-ellipsis>
                    </div>
                    <div class="header-status bg-color-200">
                        <BadgeStatus
                            :text="data.state.text"
                            :status="data.state.value"
                            :statusNames="{
                                ...colorMap,
                                running: 'primary',
                            }"
                        />
                    </div>
                </div>
                <div class="header-right">
                    <span
                        class="text-color-500"
                        :style="{ fontSize: '12px', marginRight: '10px' }"
                        >{{
                            dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss')
                        }}</span
                    >
                    <div class="body-count bg-color-200">
                        <div>
                            <a-space>
                                <Icon
                                    type="icon-shebei"
                                    style="font-size: 16px"
                                />
                                <label class="text-color-500">网关数量</label>
                                <span class="text-color-900">{{
                                    data?.thingTotal
                                }}</span>
                            </a-space>
                        </div>
                        <div>
                            <a-space>
                                <Icon
                                    type="icon-chajianbao"
                                    style="font-size: 16px"
                                />
                                <label class="text-color-500">插件数量</label>
                                <span class="text-color-900">{{
                                    data?.thingTotal
                                }}</span>
                            </a-space>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dec">
                <j-ellipsis>{{ data.description || '--' }}</j-ellipsis>
                <!-- {{ data.description || '--' }} -->
            </div>
            <div class="allOperation">
                <PermissionButton @click="stopAll" :disabled="!stateArr.includes('waiting')"
                    ><template #icon><AIcon type="PauseOutlined" /> </template
                    >全部暂停
                </PermissionButton>
                <PermissionButton style="margin-left: 20px" @click="startAll" :disabled="!stateArr.includes('canceled')"
                    ><template #icon
                        ><AIcon type="CaretRightOutlined" /> </template
                    >全部开始</PermissionButton
                >
                <PermissionButton
                    style="margin-left: 20px"
                    @click="batchRetry"
                    :tooltip="{
                        title: stateArr.includes('failed') ? '批量重试' : '',
                    }"
                    :disabled="!stateArr.includes('failed')"
                    ><template #icon><AIcon type="RedoOutlined" /> </template>
                    批量重试
                </PermissionButton>
                <PermissionButton
                    style="margin-left: 20px"
                    @click="refreshState"
                    ><template #icon><AIcon type="RedoOutlined" /> </template>
                    刷新状态
                </PermissionButton>
                <PermissionButton style="float: right" @click="onCopy"
                    ><template #icon><AIcon type="CopyOutlined" /> </template>
                    从相同设备创建任务
                </PermissionButton>
                <PermissionButton
                    style="float: right; margin-right: 20px"
                    danger
                    :tooltip="{
                        title:
                            data.state.value === 'running'
                                ? '任务进行不可删除'
                                : '',
                    }"
                    :popConfirm="{
                        title: '确认删除?',
                        onConfirm: async () => {
                            deleteAll();
                        },
                    }"
                    :disabled="data.state.value === 'running'"
                >
                    <template #icon><AIcon type="DeleteOutlined" /> </template>
                    删除任务
                </PermissionButton>
            </div>
            <div class="body-progress">
                <div class="progress--warp bg-color-200">
                    <div
                        v-for="item in options"
                        :style="{ width: item.per + '%', background: item.bgc }"
                    ></div>
                </div>
            </div>
            <div class="body-status">
                <div v-for="item in options" class="status-item">
                    <div>
                        <Icon
                            :type="item.icon"
                            :style="{ color: item.color }"
                        />
                        {{ item.label }}
                    </div>
                    <div style="font-size: 20px">
                        {{ item.value }}
                    </div>
                </div>
                <div class="status-item last-item">
                    <label> 任务总数 </label>
                    <span class="text-color-900" style="font-size: 20px">
                        {{ taskTotal }}
                    </span>
                </div>
            </div>
        </div>
        <JProTable
            ref="tableRef"
            model="TABLE"
            style="padding: 0"
            :columns="columns"
            :request="_query"
            :scroll="{ x: true }"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: [
                    {
                        column: 'jobId',
                        value: props?.data?.id,
                        termType: 'eq',
                    },
                ],
            }"
        >
            <template #pulginId="{ detail }">
                <Ellipsis style="width: 100%">{{ detail.data.id }}</Ellipsis>
            </template>
            <template #pulginName="{ detail }">
                <Ellipsis style="width: 100%"> {{ detail.data.name }}</Ellipsis>
            </template>
            <template #thingName="{ thingName }">
                <Ellipsis style="width: 100%"> {{ thingName }}</Ellipsis>
            </template>
            <template #timeoutSeconds="{ timeoutSeconds }">
                <Ellipsis style="width: 100%"> {{ timeoutSeconds }}s</Ellipsis>
            </template>
            <template #id="{ id }">
                <Ellipsis style="width: 100%"> {{ id }}</Ellipsis>
            </template>
            <template #filename="{ detail }">
                <Ellipsis style="width: 100%">
                    {{
                        JSON.parse(detail.data.metadata || '{}')?.filename ||
                        '--'
                    }}</Ellipsis
                >
            </template>
            <template #completeTime="record">
                {{
                    record.completeTime
                        ? dayjs(record.completeTime).format(
                              'YYYY-MM-DD HH:mm:ss',
                          )
                        : '--'
                }}
            </template>
            <template #state="record">
                <div
                    class="state"
                    :style="{
                        color: colorMap[record.state.value]
                            ? `var(--ant-${colorMap[record.state.value]}-color)`
                            : '#646C73',
                    }"
                >
                    <a-space>
                        <Icon :type="iconMap[record.state.value]" />
                        <j-ellipsis>
                            <div>{{ record.state.text }}</div>
                            <div
                                v-if="
                                    record.state.value === 'failed' &&
                                    record.errorCodeMessage
                                "
                            >
                                {{ ':' + record.errorCodeMessage }}
                            </div>
                        </j-ellipsis>
                    </a-space>
                </div>
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
                            onConfirm: async () => {
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
                            onConfirm: async () => {
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
    queryTaskdDtail,
    startAllTask,
    stopAllTask,
    startOneTask,
    stopOneTask,
    deleteOneTask,
    deleteAllTask,
} from '@/api/edge/batch';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import Icon from '../components/Icon.vue';
const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
    deviceId: {
        type: String,
    },
});
const emit = defineEmits(['closeDetail', 'refresh', 'copy']);
const columns = [
    {
        title: '插件ID',
        key: 'pulginId',
        scopedSlots: true,
        width: 150,
    },
    {
        title: '插件名称',
        key: 'pulginName',
        scopedSlots: true,
        width: 150,
    },
    {
        title: '文件',
        key: 'filename',
        scopedSlots: true,
        width: 150,
    },
    {
        title: '资源库ID',
        key: 'id',
        dataIndex: 'id',
        ellipsis: true,
        scopedSlots: true,
        width: 100,
    },
    {
        title: '边缘网关',
        key: 'thingName',
        dataIndex: 'thingName',
        scopedSlots: true,
        width: 150,
    },
    {
        title: '响应超时时间',
        key: 'timeoutSeconds',
        dataIndex: 'timeoutSeconds',
        scopedSlots: true,
        width: 200,
    },
    {
        title: '重试次数',
        key: 'maxRetry',
        dataIndex: 'maxRetry',
        width: 150,
    },
    {
        title: '完成时间',
        key: 'completeTime',
        scopedSlots: true,
        width: 300,
    },
    {
        title: '状态',
        key: 'state',
        scopedSlots: true,
        width: 180,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 120,
        scopedSlots: true,
    },
];

const tableRef = ref();
const dataSource = ref({});

const colorMap = {
    success: 'success',
    complete: 'success',
    running: 'warning',
    incomplete: 'warning',
    failed: 'error',
    waiting: 'primary',
};

const iconMap = {
    success: 'CheckCircleFilled',
    running: 'ClockCircleFilled',
    failed: 'InfoCircleFilled',
    canceled: 'PauseCircleFilled',
    waiting: 'icon-paiduizhong',
};
const taskTotal = computed(() => {
    return (
        props.data.stateCount?.reduce((prev, next) => prev + next.total, 0) || 0
    );
});

const options = computed(() => {
    return (
        props.data.stateCount?.map((item) => {
            const per = taskTotal.value
                ? Math.round(parseFloat(item.total / taskTotal.value) * 100)
                : 0; // 单个进度比例
            const key = colorMap[item.state.value];
            return {
                label: item.state.text,
                type: item.state.value,
                value: item.total,
                icon: iconMap[item.state.value],
                per: key ? per : 0,
                bgc: key ? `var(--ant-${key}-color)` : 'transparent',
                color: key ? `var(--ant-${key}-color)` : '#646C73',
            };
        }) || []
    );
});

const stateArr = computed(() => {
    return props.data.stateCount.map((item) => item.state.value);
});

const _query = async (e) => {
    const res = await queryTaskdDtail(e);
    if (res.success) {
        dataSource.value = res.result;
    }
    return res;
};

const refreshState = () => {
    tableRef.value?.reload();
    onlyMessage('操作成功');
    emit('refresh');
};
//全部开始
const startAll = async () => {
    const res = await startAllTask(props.data.id, ['canceled']);
    if (res.success) {
        refreshState();
    }
};
//全部重试
const batchRetry = async () => {
    const res = await startAllTask(props.data.id, ['canceled', 'failed']);
    if (res.success) {
        refreshState();
    }
};
//全部停止
const stopAll = async () => {
    const res = await stopAllTask(props.data.id, {});
    if (res.success) {
        refreshState();
    }
};
//全部删除
const deleteAll = async () => {
    const res = await deleteAllTask(props.data.id);
    if (res.success) {
        emit('closeDetail');
        emit('refresh');
    }
};
//开始某个记录
const startUpgrades = async (id) => {
    const res = await startOneTask(id, {});
    if (res.success) {
        refreshState();
    }
};
//停止某个记录
const stopUpgrades = async (id) => {
    const res = await stopOneTask(id, {});
    if (res.success) {
        refreshState();
    }
};
//删除某个记录
const deleteUpgrades = async (id) => {
    if (dataSource.value?.total === 1) {
        deleteAll();
    } else {
        const res = await deleteOneTask(id);
        if (res.success) {
            refreshState();
        }
    }
};

const onCopy = () => {
    emit('copy');
};
</script>
<style lang="less" scoped>
.generalInfo {
    // margin-bottom: 30px;
    .header {
        display: flex;
        justify-content: space-between;

        .header-left {
            display: flex;
            align-items: center;
            .header-status {
                margin-left: 6px;
                padding: 2px 8px;
                border-radius: 4px;
            }
        }
        .header-right {
            display: flex;
            align-items: center;
            .body-count {
                display: flex;
                padding: 8px 24px;
                border-radius: 6px;

                > div {
                    flex: 1;
                    min-width: 150px;
                }
            }
        }
    }
    .dec {
        height: 30px;
        line-height: 20px;
        border-bottom: 1px solid #eaeaeb;
        // margin: 6px 0
        color: #aaaaaa;
        margin-bottom: 6px;
    }
    .progress {
        width: 100%;
        line-height: 32px;
        display: flex;
    }
    .allOperation {
        margin-bottom: 20px;
    }
    .body-progress {
        margin-bottom: 12px;
    }

    .body-status {
        display: flex;
        .status-item {
            width: 120px;
            display: flex;
            align-items: center;
            flex-direction: column;
        }

        .last-item {
            margin-left: auto;
        }
    }

    .progress--warp {
        height: 6px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
    }
}
.tip {
    color: rgb(170, 170, 170);
    margin-right: 10px;
}
.state {
    display: flex;
    align-items: center;
    width: 140px;
}
</style>
