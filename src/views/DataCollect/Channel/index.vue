<template>
    <page-container>
        <div>
            <Search :columns="columns" target="search" @search="handleSearch" />

            <JTable
                ref="tableRef"
                :columns="columns"
                model="CARD"
                :gridColumn="3"
                :request="queryChannel"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="handlAdd"
                        hasPermission="DataCollect/Channel:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增通道
                    </PermissionButton>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :showStatus="true"
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :status="slotProps.state.value"
                        :statusText="slotProps.state.text"
                        :statusNames="{
                            enabled: 'success',
                            disabled: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img :src="getImage('/network.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <div class="card-item-content">
                                <PermissionButton
                                    type="link"
                                    @click="handlEye(slotProps.id)"
                                    hasPermission="link/Type:view"
                                    :style="TiTlePermissionButtonStyle"
                                >
                                    {{ slotProps.name }}
                                </PermissionButton>

                                <a-row class="card-item-content-box">
                                    <a-col :span="12">
                                        <div class="card-item-content-text">
                                            协议
                                        </div>
                                        <div class="card-item-content-text">
                                            <a-tooltip>
                                                <template #title>{{
                                                    slotProps.provider
                                                }}</template>
                                                {{ slotProps.provider }}
                                            </a-tooltip>
                                        </div>
                                    </a-col>
                                    <a-col :span="12">
                                        <div class="card-item-content-text">
                                            地址
                                        </div>
                                        <div class="card-item-content-text">
                                            <a-tooltip>
                                                <template #title>{{
                                                    slotProps.configuration
                                                        .host ||
                                                    slotProps.configuration
                                                        .endpoint
                                                }}</template>
                                                <span class="details-text">{{
                                                    slotProps.configuration
                                                        .host ||
                                                    slotProps.configuration
                                                        .endpoint
                                                }}</span>
                                            </a-tooltip>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </template>
                        <template #actions="item">
                            <PermissionButton
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="'link/Type:' + item.key"
                            >
                                <AIcon
                                    type="DeleteOutlined"
                                    v-if="item.key === 'delete'"
                                />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item?.text }}</span>
                                </template>
                            </PermissionButton>
                        </template>
                    </CardBox>
                </template>
            </JTable>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="TypePage">
import type { ActionsType } from '@/components/Table/index';
import { getImage } from '@/utils/comm';
import {
    queryChannel,
    updateChannel,
    removeChannel,
} from '@/api/data-collect/channel';
import { message } from 'ant-design-vue';
import { TiTlePermissionButtonStyle } from './data';
import { useMenuStore } from 'store/menu';

const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const options = ref([]);

const statusMap = new Map();
statusMap.set('enabled', 'success');
statusMap.set('disabled', 'error');

const columns = [
    {
        title: '通道名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '通讯协议',
        dataIndex: 'provider',
        key: 'provider',
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                { label: 'OPC_UA', value: 'OPC_UA' },
                { label: 'MODBUS_TCP', value: 'MODBUS_TCP' },
            ],
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '正常', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
            ],
        },
    },
    {
        title: '运行状态',
        dataIndex: 'runningState',
        key: 'runningState',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '运行中', value: 'running' },
                { label: '部分错误', value: 'partialError' },
                { label: '错误', value: 'failed' },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const state = data.state.value;
    const stateText = state === 'enabled' ? '禁用' : '启用';
    const actions = [
        // {
        //     key: 'view',
        //     text: '查看',
        //     tooltip: {
        //         title: '查看',
        //     },
        //     icon: 'EyeOutlined',
        //     onClick: async () => {
        //         handlEye(data.id);
        //     },
        // },
        {
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                handlEdit(data.id);
            },
        },
        {
            key: 'action',
            text: stateText,
            tooltip: {
                title: stateText,
            },
            icon: state === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${stateText}?`,
                onConfirm: async () => {
                    // let res =
                    //     state === 'enabled'
                    //         ? await shutdown(data.id)
                    //         : await start(data.id);
                    // if (res.success) {
                    //     message.success('操作成功');
                    //     tableRef.value?.reload();
                    // } else {
                    //     message.error('操作失败！');
                    // }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            disabled: state === 'enabled',
            tooltip: {
                title:
                    state === 'enabled' ? '请先禁用该组件，再删除。' : '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    // const res = await remove(data.id);
                    // if (res.success) {
                    //     message.success('操作成功');
                    //     tableRef.value.reload();
                    // } else {
                    //     message.error('操作失败！');
                    // }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const handlAdd = () => {
    // menuStory.jumpPage(`link/Type/Detail`, { id: ':id' }, { view: false });
};

const handlEye = (id: string) => {
    // menuStory.jumpPage(`link/Type/Detail`, { id }, { view: true });
};

const handlEdit = (id: string) => {
    // menuStory.jumpPage(`link/Type/Detail`, { id }, { view: false });
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
.card-item-content {
    min-height: 100px;

    .card-item-content-title-a {
        // color: #000 !important;
        font-weight: 700;
        font-size: 16px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }
    .card-item-content-box {
        min-height: 50px;
    }
    .card-item-content-text {
        margin-top: 10px;
        color: rgba(0, 0, 0, 0.75);
        font-size: 12px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }
}
.details-text {
    font-weight: 700;
    font-size: 14px;
}
</style>
