<template>
    <page-container>
        <pro-search :columns="columns" target="search-firmware-task" @search="handleSearch" />
        <j-pro-table
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
                <PermissionButton
                    type="primary"
                    @click="handlAdd"
                    hasPermission="device/Firmware:add"
                >
                    <template #icon><AIcon type="PlusOutlined" /></template>
                    新增
                </PermissionButton>
            </template>
            <template #mode="slotProps">
                <span>{{ slotProps.mode.text }}</span>
            </template>
            <template #progress="slotProps">
                <span>{{ slotProps.progress }}%</span>
            </template>
            <template #action="slotProps">
                <j-space>
                    <template v-for="i in getActions(slotProps)" :key="i.key">
                        <PermissionButton
                            :disabled="i.disabled"
                            :popConfirm="i.popConfirm"
                            :tooltip="{
                                ...i.tooltip,
                            }"
                            style="padding: 0px"
                            @click="i.onClick"
                            type="link"
                            :hasPermission="'device/Firmware:' + i.key"
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </j-pro-table>
        <Save v-if="visible" :data="current" @change="saveChange" />
    </page-container>
</template>
<script lang="ts" setup name="TaskPage">
import type { ActionsType } from '@/components/Table/index';
import { task, startTask, stopTask } from '@/api/device/firmware';
import { onlyMessage } from '@/utils/comm';
import Save from './Save/index.vue';
import { useMenuStore } from 'store/menu';

const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
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
            key: 'view',
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
            key: 'view',
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
            key: 'update',
            text: '停止',
            tooltip: {
                title: '停止',
            },
            onClick: async () => {
                const res = await stopTask(data.id);
                if (res.success) {
                    onlyMessage('操作成功', 'success');
                    tableRef.value.reload();
                }
            },
            icon: 'StopOutlined',
        });
    } else if (pause) {
        Actions.push({
            key: 'update',
            text: '继续升级',
            tooltip: {
                title: '继续升级',
            },
            onClick: async () => {
                const res = await startTask(data.id, ['canceled']);
                if (res.success) {
                    onlyMessage('操作成功', 'success');
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
    menuStory.jumpPage('device/Firmware/Task/Detail', { id });
};
const saveChange = (value: boolean) => {
    visible.value = false;
    current.value = {};
    if (value) {
        onlyMessage('操作成功', 'success');
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

<style lang="less" scoped></style>
