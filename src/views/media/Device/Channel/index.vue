<!-- 视频设备-通道列表 -->
<template>
    <page-container>
        <Search
            type="simple"
            :columns="columns"
            target="product"
            @search="handleSearch"
        />

        <JTable
            ref="listRef"
            :columns="columns"
            :request="(e:any) => ChannelApi.list(e, route?.query.id as string)"
            :defaultParams="{
                sorts: [{ name: 'notifyTime', order: 'desc' }],
            }"
            :params="params"
            model="table"
        >
            <template #headerTitle>
                <a-tooltip
                    v-if="route?.query.type === 'gb28181-2016'"
                    title="接入方式为GB/T28281时，不支持新增"
                >
                    <a-button type="primary" disabled> 新增 </a-button>
                </a-tooltip>
                <a-button type="primary" @click="handleAdd" v-else>
                    新增
                </a-button>
            </template>
            <template #status="slotProps">
                <a-space>
                    <a-badge
                        :status="
                            slotProps.status.value === 'online'
                                ? 'success'
                                : 'error'
                        "
                        :text="slotProps.status.text"
                    ></a-badge>
                </a-space>
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

        <Save
            v-model:visible="saveVis"
            :channelData="channelData"
            @submit="listRef.reload()"
        />
        <Live v-model:visible="playerVis" />
    </page-container>
</template>

<script setup lang="ts">
import ChannelApi from '@/api/media/channel';
import type { ActionsType } from '@/components/Table/index.vue';
import { useMenuStore } from 'store/menu';
import { message } from 'ant-design-vue';
import Save from './Save.vue';
import Live from './Live/index.vue';
import { cloneDeep } from 'lodash-es';

const menuStory = useMenuStore();
const route = useRoute();

const columns = [
    {
        title: '通道ID',
        dataIndex: 'channelId',
        key: 'channelId',
        search: {
            type: 'string',
        },
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: '厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        search: {
            type: 'string',
        },
    },
    {
        title: '安装地址',
        dataIndex: 'address',
        key: 'address',
        search: {
            type: 'string',
        },
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
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
        scopedSlots: true,
    },
];

const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

const saveVis = ref(false);
const handleAdd = () => {
    saveVis.value = true;
};

const listRef = ref();
const playerVis = ref(false);
const channelData = ref();

/**
 * 表格操作按钮
 * @param data 表格数据项
 * @param type 表格展示类型
 */
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
                channelData.value = cloneDeep(data);
                saveVis.value = true;
            },
        },
        {
            key: 'play',
            text: '播放',
            tooltip: {
                title: '播放',
            },
            icon: 'VideoCameraOutlined',
            onClick: () => {
                playerVis.value = true;
            },
        },
        {
            key: 'backPlay',
            text: '回放',
            tooltip: {
                title: '回放',
            },
            icon: 'HistoryOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'media/Device/Playback',
                    {},
                    {
                        id: route.query.id,
                        type: route.query.type,
                        channelId: data.channelId,
                    },
                );
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title: '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const resp = await ChannelApi.del(data.id);
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
    return route?.query.type === 'gb28181-2016'
        ? actions.filter((f) => f.key !== 'delete')
        : actions;
};
</script>
