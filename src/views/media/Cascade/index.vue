<template>
    <page-container>
        <Search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        />
        <JTable
            ref="listRef"
            :columns="columns"
            :request="DeviceApi.list"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
            }"
            :params="params"
        >
            <template #headerTitle>
                <a-button type="primary" @click="handleAdd"> 新增 </a-button>
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    :actions="getActions(slotProps, 'card')"
                    v-bind="slotProps"
                    :showStatus="true"
                    :status="
                        slotProps.state.value === 'online' ? 'success' : 'error'
                    "
                    :statusText="slotProps.state.text"
                    :statusNames="{ success: 'success', error: 'error' }"
                >
                    <template #img>
                        <slot name="img">
                            <img :src="getImage('/device-media.png')" />
                        </slot>
                    </template>
                    <template #content>
                        <h3 class="card-item-content-title">
                            {{ slotProps.name }}
                        </h3>
                        <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">厂商</div>
                                <div>{{ slotProps.manufacturer }}</div>
                            </a-col>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    通道数量
                                </div>
                                <div>{{ slotProps.channelNumber }}</div>
                            </a-col>
                            <a-col :span="12">
                                <div class="card-item-content-text">型号</div>
                                <div>{{ slotProps.model }}</div>
                            </a-col>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    接入方式
                                </div>
                                <!-- <div>
                                    {{ providerType[slotProps.provider] }}
                                </div> -->
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
                            >
                                <a-button :disabled="item.disabled">
                                    <AIcon type="DeleteOutlined" />
                                </a-button>
                            </a-popconfirm>
                            <template v-else>
                                <a-button
                                    :disabled="item.disabled"
                                    @click="item.onClick"
                                >
                                    <AIcon :type="item.icon" />
                                    <span>{{ item.text }}</span>
                                </a-button>
                            </template>
                        </a-tooltip>
                    </template>
                </CardBox>
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip
                        v-for="i in getActions(slotProps, 'table')"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <a-popconfirm
                            v-if="i.popConfirm"
                            v-bind="i.popConfirm"
                            :disabled="i.disabled"
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
    </page-container>
</template>

<script setup lang="ts">
import DeviceApi from '@/api/media/device';
import type { ActionsType } from '@/components/Table/index.vue';
import { message } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import { PROVIDER_OPTIONS } from '@/views/media/Device/const';

import { useMenuStore } from 'store/menu';

const menuStory = useMenuStore();

const listRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '上级SIP ID',
        dataIndex: 'sipConfigs',
        key: 'sipConfigs',
        scopedSlots: true,
    },
    {
        title: '上级SIP 地址',
        dataIndex: 'sipConfigs',
        key: 'sipConfigs',
        scopedSlots: true,
    },
    {
        title: '通道数量',
        dataIndex: 'count',
        key: 'count',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '正常', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '级联状态',
        dataIndex: 'onlineStatus',
        key: 'onlineStatus',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '已连接', value: 'online' },
                { label: '未连接', value: 'offline' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    // console.log('handleSearch:', e);
    params.value = e;
};

/**
 * 新增
 */
const handleAdd = () => {
    menuStory.jumpPage('media/Device/Save', {
        id: ':id',
    });
};

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'media/Device/Save',
                    {},
                    {
                        id: data.id,
                    },
                );
            },
        },
        {
            key: 'view',
            text: '查看通道',
            tooltip: {
                title: '查看通道',
            },
            icon: 'PartitionOutlined',
            onClick: () => {
                // router.push(
                //     `/media/device/Channel?id=${data.id}&type=${data.provider}`,
                // );
                menuStory.jumpPage(
                    'media/Device/Channel',
                    {},
                    {
                        id: data.id,
                        type: data.provider,
                    },
                );
            },
        },
        {
            key: 'debug',
            text: '更新通道',
            tooltip: {
                title:
                    data.provider === 'fixed-media'
                        ? '固定地址无法更新通道'
                        : data.state.value === 'offline'
                        ? '设备已离线'
                        : data.state.value === 'notActive'
                        ? '设备已禁用'
                        : '',
            },
            disabled:
                data.state.value === 'offline' ||
                data.state.value === 'notActive' ||
                data.provider === 'fixed-media',
            icon: 'SyncOutlined',
            onClick: () => {
                // updateChannel()
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title: '在线设备无法删除',
            },
            disabled: data.state.value === 'online',
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const resp = await DeviceApi.del(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        listRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};
</script>
