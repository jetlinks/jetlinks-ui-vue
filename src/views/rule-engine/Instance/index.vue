<template>
    <page-container>
        <div>
            <Search
                :columns="query.columns"
                target="device-instance"
                @search="handleSearch"
            ></Search>
            <JTable
                :columns="columns"
                :request="queryList"
                ref="tableRef"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
            >
                <template #headerTitle>
                    <a-space>
                        <a-button type="primary" @click="add"
                            ><plus-outlined />新增</a-button
                        >
                    </a-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            started: 'success',
                            disable: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img :src="getImage('/device-product.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <Ellipsis>
                                <span style="font-weight: 600; font-size: 16px">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <a-row>
                                <a-col :span="12">
                                    <Ellipsis>
                                        <div>
                                            {{ slotProps.description }}
                                        </div>
                                    </Ellipsis>
                                </a-col>
                            </a-row>
                        </template>
                        <template #actions="item">
                            <a-tooltip
                                v-bind="item.tooltip"
                                :title="item.disabled && item.tooltip.title"
                            >
                                <a-popconfirm
                                    v-if="item.popConfirm"
                                    v-bind="item.popConfirm"
                                    :disabled="item.disabled"
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <a-button :disabled="item.disabled">
                                        <AIcon
                                            type="DeleteOutlined"
                                            v-if="item.key === 'delete'"
                                        />
                                        <template v-else>
                                            <AIcon :type="item.icon" />
                                            <span>{{ item?.text }}</span>
                                        </template>
                                    </a-button>
                                </a-popconfirm>
                                <template v-else>
                                    <a-button
                                        :disabled="item.disabled"
                                        @click="item.onClick"
                                    >
                                        <AIcon
                                            type="DeleteOutlined"
                                            v-if="item.key === 'delete'"
                                        />
                                        <template v-else>
                                            <AIcon :type="item.icon" />
                                            <span>{{ item?.text }}</span>
                                        </template>
                                    </a-button>
                                </template>
                            </a-tooltip>
                        </template>
                    </CardBox>
                </template>
                <template #state="slotProps">
                    <a-badge
                        :text="
                            slotProps.state?.value === 'started'
                                ? '正常'
                                : '禁用'
                        "
                        :status="
                            slotProps.state?.value === 'started'
                                ? 'success'
                                : 'error'
                        "
                    />
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
                                okText="确定"
                                cancelText="取消"
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
            <!-- 新增、编辑 -->
            <Save
                ref="saveRef"
                :isAdd="isAdd"
                :title="title"
                @success="refresh"
            />
        </div>
    </page-container>
</template>

<script lang="ts" setup>
import JTable from '@/components/Table';
import type { InstanceItem } from './typings';
import {
    queryList,
    startRule,
    stopRule,
    deleteRule,
} from '@/api/rule-engine/instance';
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage } from '@/utils/comm';
import { message } from 'ant-design-vue';
import Save from './Save/index.vue';
const params = ref<Record<string, any>>({});
let isAdd = ref<number>(0);
let title = ref<string>('');
let saveRef = ref();
let currentForm = ref();
const tableRef = ref<Record<string, any>>({});
const query = {
    columns: [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            search: {
                type: 'string',
            },
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            search: {
                type: 'select',
                options: [
                    {
                        label: '正常',
                        value: 'started',
                    },
                    {
                        label: '禁用',
                        value: 'disable',
                    },
                ],
            },
        },
        {
            title: '说明',
            key: 'description',
            dataIndex: 'description',
            search: {
                type: 'string',
            },
        },
    ],
};
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];
const getActions = (
    data: Partial<Record<string, any>>,
    type?: 'card' | 'table',
): ActionsType[] => {
    if (!data) {
        return [];
    }
    const actions = [
        {
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },

            icon: 'EditOutlined',
            onClick: () => {
                title.value = '编辑';
                isAdd.value = 2;
                nextTick(() => {
                    saveRef.value.show(data);
                });
            },
        },
        {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
        },
        {
            key: 'action',
            text: data.state?.value !== 'disable' ? '禁用' : '启用',
            tooltip: {
                title: data.state?.value !== 'disable' ? '禁用' : '启用',
            },
            icon:
                data.state?.value !== 'disable'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${data.state !== 'disable' ? '禁用' : '启用'}?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state?.value !== 'started') {
                        response = await startRule(data.id);
                    } else {
                        response = await stopRule(data.id);
                    }
                    if (response && response.status === 200) {
                        message.success('操作成功！');
                        tableRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            disabled: data?.state?.value !== 'disable',
            tooltip: {
                title:
                    data?.state?.value !== 'disable'
                        ? '请先禁用再删除'
                        : '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const resp = await deleteRule(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        tableRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (type === 'card')
        return actions.filter((i: ActionsType) => i.key !== 'view');
    return actions;
};
const add = () => {
    isAdd.value = 1;
    title.value = '新增';
    nextTick(() => {
        saveRef.value.show(currentForm.value);
    });
};
/**
 * 刷新数据
 */
const refresh = () => {
    tableRef.value?.reload();
};
const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style scoped>
</style>