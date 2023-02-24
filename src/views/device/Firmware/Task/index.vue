<template>
    <page-container>
        <Search :columns="columns" target="search" @search="handleSearch" />
        <JTable
            ref="tableRef"
            model="TABLE"
            :columns="columns"
            :request="task"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: defaultParams,
            }"
            :params="params"
        >
            <template #headerTitle>
                <a-button type="primary" @click="handlAdd"
                    ><AIcon type="PlusOutlined" />新增</a-button
                >
            </template>
            <template #mode="slotProps">
                <span>{{ slotProps.mode.text }}</span>
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
                        <a-popconfirm v-if="i.popConfirm" v-bind="i.popConfirm">
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
        <Save v-if="visible" :data="current" @change="saveChange" />
    </page-container>
</template>
<script lang="ts" setup name="CertificatePage">
import type { ActionsType } from '@/components/Table/index.vue';
import { task, startTask, stopTask } from '@/api/device/firmware';
import { message } from 'ant-design-vue';
import Save from './Save/index.vue'

const tableRef = ref<Record<string, any>>({});
const router = useRouter();
const route = useRoute();
const params = ref<Record<string, any>>({});

const visible = ref(false);
const current = ref({});

const columns = [
    {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
        },
        // scopedSlots: true,
    },
    {
        title: '推送方式',
        dataIndex: 'mode',
        key: 'mode',
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                {
                    label: '设备拉取',
                    value: 'pull',
                },
                {
                    label: '平台推送',
                    value: 'push',
                },
            ],
        },
        scopedSlots: true,
        width: 200,
    },

    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '完成比例',
        dataIndex: 'progress',
        key: 'progress',
        ellipsis: true,
        scopedSlots: true,
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
                column: 'firmwareId',
                value: route.query.id,
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
            key: 'edit',
            text: '详情',
            tooltip: {
                title: '详情',
            },
            icon: 'EditOutlined',
            onClick: async () => {
                handlEdit(data.id);
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
            icon: 'PauseOutlined',
        });
    }

    return Actions;
};

const handlAdd = () => {
    current.value = {};
    visible.value = true;
    
};

const handlEye = (data: object) => {
    current.value = toRaw(data);
    visible.value = true;
};

const handlEdit = (id: string) => {
    // router.push({
    //     path: `/iot/link/certificate/detail/${id}`,
    //     query: { view: false },
    // });
};
const saveChange = (value: FormDataType) => {
    visible.value = false;
    current.value = {};
    if (value) {
        message.success('操作成功');
        tableRef.value.reload();
    }
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>

<style lang="less" scoped>
.a {
    // display: none;
    visibility: 0;
}
</style>
