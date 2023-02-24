<template>
    <page-container>
        <div>
            <div class="state-container">
                <div
                    class="state-body"
                    v-for="item in stateList"
                    :key="item.key"
                >
                    <div class="state-content">
                        <div class="state-header">
                            <div class="state-title">
                                <a-badge
                                    :text="item.name"
                                    :color="colorMap.get(item.key)"
                                />
                            </div>

                            <div class="state-title-right">
                                <a-popconfirm
                                    title="确定批量重试?"
                                    ok-text="确定"
                                    cancel-text="取消"
                                    @confirm="confirm"
                                    v-if="
                                        item.key === 'failed' &&
                                        stateInfo?.mode?.value === 'push'
                                    "
                                >
                                    <a href="#">批量重试</a>
                                </a-popconfirm>
                                <img
                                    :src="buttonImg"
                                    @click="handleRefresh(item.key)"
                                />
                            </div>
                        </div>
                        <div class="state-box">
                            <div
                                class="state-left"
                                :style="`color: ${colorMap.get(item.key)}`"
                            >
                                {{ state[item.key] }}
                            </div>
                            <img class="state-right" :src="item.img" />
                        </div>
                    </div>
                </div>
            </div>

            <Search :columns="columns" target="search" @search="handleSearch" />
            <JTable
                ref="tableRef"
                model="TABLE"
                :columns="columns"
                :request="history"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                    terms: defaultParams,
                }"
                :params="params"
            >
                <template #createTime="slotProps">
                    <span>{{
                        moment(slotProps.createTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )
                    }}</span>
                </template>
                <template #productId="slotProps">
                    <span>{{ slotProps.productName }}</span>
                </template>
                <template #state="slotProps">
                    <a-badge
                        :text="slotProps.state.text"
                        :color="colorMap.get(slotProps.state.value)"
                    />
                </template>
                <template #progress="slotProps">
                    <span>{{ slotProps.progress }}%</span>
                </template>
                <template #action="slotProps">
                    <a-space :size="16">
                        <a-tooltip
                            v-for="i in getActions(slotProps)"
                            :key="i.key"
                            v-bind="i.tooltip"
                        >
                            <a-popconfirm
                                v-if="i.popConfirm"
                                v-bind="i.popConfirm"
                            >
                                <a-button
                                    :disabled="i.disabled"
                                    style="padding: 0"
                                    type="link"
                                    ><AIcon :type="i.icon"
                                /></a-button>
                            </a-popconfirm>
                            <a-button
                                style="padding: 0"
                                type="link"
                                v-else
                                @click="i.onClick && i.onClick(slotProps)"
                            >
                                <a-button
                                    :disabled="i.disabled"
                                    style="padding: 0"
                                    type="link"
                                    ><AIcon :type="i.icon"
                                /></a-button>
                            </a-button>
                        </a-tooltip>
                    </a-space>
                </template>
            </JTable>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="TaskDetailPage">
import type { ActionsType } from '@/components/Table/index';
import {
    taskById,
    history,
    historyCount,
    queryProduct,
} from '@/api/device/firmware';
import { message } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import moment from 'moment';
import { cloneDeep } from 'lodash-es';

const tableRef = ref<Record<string, any>>({});
const router = useRouter();
const route = useRoute();
const params = ref<Record<string, any>>({});
const taskId = route.params?.id as string;
const visible = ref(false);
const current = ref({});
const productOptions = ref([]);

const colorMap = new Map();
colorMap.set('waiting', '#FF9000');
colorMap.set('processing', '#4293FF');
colorMap.set('failed', '#F76F5D');
colorMap.set('success', '#24B276');
colorMap.set('canceled', '#999');

const stateList = [
    {
        key: 'waiting',
        name: '等待升级',
        img: getImage('/firmware/waiting.png'),
    },
    {
        key: 'processing',
        name: '升级中',
        img: getImage('/firmware/loading.png'),
    },
    {
        key: 'success',
        name: '升级完成',
        img: getImage('/firmware/finish.png'),
    },
    {
        key: 'failed',
        name: '升级失败',
        img: getImage('/firmware/error.png'),
    },
    {
        key: 'canceled',
        name: '已停止',
        img: getImage('/firmware/cancel.png'),
    },
];

const buttonImg = getImage('/firmware/button.png');
const state = ref({
    waiting: 0,
    processing: 0,
    success: 0,
    failed: 0,
    canceled: 0,
});
const stateInfo = ref();

const columns = [
    {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        fixed: 'left',
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属产品',
        dataIndex: 'productId',
        key: 'productId',
        ellipsis: true,
        width: 200,
        scopedSlots: true,
        // search: {
        //     type: 'select',
        //     options: productOptions,
        // },
    },
    {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width: 200,
        scopedSlots: true,
    },
    {
        title: '完成时间',
        key: 'completeTime',
        ellipsis: true,
        dataIndex: 'completeTime',
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: '进度',
        dataIndex: 'progress',
        key: 'progress',
        ellipsis: true,
        scopedSlots: true,
        width: 200,
        search: {
            type: 'string',
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        search: {
            type: 'select',
            options: stateList.map((item) => ({
                value: item.key,
                label: item.name,
            })),
        },
        scopedSlots: true,
        width: 200,
    },

    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const defaultParams = [
    {
        terms: [
            {
                column: 'taskId',
                value: taskId,
            },
        ],
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) {
        return [];
    }

    const stop = data.waiting > 0 && data?.state?.value === 'processing';
    const pause = data?.state?.value === 'canceled';

    const Actions = [
        {
            key: 'details',
            text: '详情',
            tooltip: {
                title: '详情',
            },
            icon: 'icon-details',
            onClick: async () => {
                handlDetails(data.id);
            },
        },
        {
            key: 'eye',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: async () => {
                handlEye(data);
            },
        },
    ];

    if (stop) {
        Actions.push({
            key: 'actions',
            text: '停止',
            tooltip: {
                title: '停止',
            },
            onClick: async () => {
                const res = await stopTask(data.id);
                if (res.success) {
                    message.success('操作成功');
                    tableRef.value.reload();
                }
            },
            icon: 'StopOutlined',
        });
    } else if (pause) {
        Actions.push({
            key: 'actions',
            text: '继续升级',
            tooltip: {
                title: '继续升级',
            },
            onClick: async () => {
                const res = await startTask(data.id, ['canceled']);
                if (res.success) {
                    message.success('操作成功');
                    tableRef.value.reload();
                }
            },
            icon: 'ControlOutlined',
        });
    }

    return Actions;
};

const handlAdd = () => {
    current.value = {};
    visible.value = true;
};

const handlEye = (data: object) => {
    current.value = toRaw({ ...data, view: true });
    visible.value = true;
};

const handlDetails = (id: string) => {
    // router.push({
    //     path: `/iot/link/certificate/detail/${id}`,
    //     query: { view: false },
    // });
};
const saveChange = (value: boolean) => {
    visible.value = false;
    current.value = {};
    if (value) {
        message.success('操作成功');
        tableRef.value.reload();
    }
};
const confirm = (e: MouseEvent) => {
    console.log(e);
    message.success('Click on Yes');
};

const handleRefresh = async (key: string) => {
    const terms = cloneDeep(defaultParams);
    terms[0].terms.push({ column: 'state', value: key });
    const res = await historyCount({ terms });
    if (res.success) {
        state.value[key] = res?.result || 0;
    }
};

onMounted(() => {
    stateList.forEach((item) => {
        handleRefresh(item.key);
    });
    taskById(taskId).then((res) => {
        if (res.success) {
            stateInfo.value = res?.result;
        }
    });
});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>

<style lang="less" scoped>
.state-container {
    width: 100%;
    min-height: 148px;
    background-color: #ffffff;
    padding: 24px 12px;
    margin-bottom: 24px;
    display: flex;
    flex-wrap: wrap;
    .state-body {
        background: linear-gradient(
            135.62deg,
            #f6f7fd 22.27%,
            rgba(255, 255, 255, 0.86) 91.82%
        );
        min-width: 185px;
        flex: 1px;
        margin: 0 12px;
        .state-content {
            width: 100% -15px;
            height: 100%;
            margin: 15px 0 0 15px;
            align-content: center;

            .state-header {
                display: flex;
                justify-content: space-between;
                height: 22px;
                .state-title-right {
                    z-index: 1;
                    img {
                        margin: 0 10px;
                        width: 22px;
                        // margin-top: -12px;
                        margin-top: -5px;
                        cursor: pointer;
                    }
                }
            }
            .state-box {
                display: flex;
                justify-content: space-between;
                .state-left {
                    flex: 1;
                    font-size: 52px;
                }
                .state-right {
                    height: 100%;
                    flex: 1;
                    margin-top: -31px;
                    max-width: 120px;
                    max-height: 94px;
                }
            }
        }
    }
}
</style>
