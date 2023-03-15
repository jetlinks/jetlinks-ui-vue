<!-- 视频设备-通道列表 -->
<template>
    <page-container>
        <div class="device-channel-warp">
            <div class="left-warp" v-if="route.query.type === 'gb28181-2016'">
                <div class="left-content" :class="{ active: show }">
                    <Tree
                        :deviceId="deviceId"
                        :on-tree-load="(e) => (show = e)"
                        :on-select="handleSelect"
                    />
                </div>
                <div
                    class="left-warp--btn"
                    :class="{ active: !show }"
                    @click="show = !show"
                >
                    <AIcon type="LeftOutlined" />
                </div>
            </div>
            <div class="right">
                <pro-search
                    type="simple"
                    :columns="columns"
                    target="product"
                    @search="handleSearch"
                />

                <JProTable
                    ref="listRef"
                    model="table"
                    :columns="columns"
                    :request="(e:any) => ChannelApi.list(e, route?.query.id as string)"
                    :defaultParams="{
                        pageSize: 10,
                        sorts: [{ name: 'notifyTime', order: 'desc' }],
                    }"
                    :params="params"
                    :pagination="{
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }"
                >
                    <template #headerTitle>
                        <j-tooltip
                            v-if="route?.query.type === 'gb28181-2016'"
                            title="接入方式为GB/T28281时，不支持新增"
                        >
                            <j-button type="primary" disabled> 新增 </j-button>
                        </j-tooltip>
                        <j-button type="primary" @click="handleAdd" v-else>
                            新增
                        </j-button>
                    </template>
                    <template #status="slotProps">
                        <j-space>
                            <j-badge
                                :status="
                                    slotProps.status.value === 'online'
                                        ? 'success'
                                        : 'error'
                                "
                                :text="slotProps.status.text"
                            ></j-badge>
                        </j-space>
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <j-tooltip
                                v-for="i in getActions(slotProps, 'table')"
                                :key="i.key"
                                v-bind="i.tooltip"
                            >
                                <j-popconfirm
                                    v-if="i.popConfirm"
                                    v-bind="i.popConfirm"
                                    :disabled="i.disabled"
                                >
                                    <j-button
                                        :disabled="i.disabled"
                                        style="padding: 0"
                                        type="link"
                                        ><AIcon :type="i.icon"
                                    /></j-button>
                                </j-popconfirm>
                                <j-button
                                    style="padding: 0"
                                    type="link"
                                    v-else
                                    @click="i.onClick && i.onClick(slotProps)"
                                >
                                    <j-button
                                        :disabled="i.disabled"
                                        style="padding: 0"
                                        type="link"
                                        ><AIcon :type="i.icon"
                                    /></j-button>
                                </j-button>
                            </j-tooltip>
                        </j-space>
                    </template>
                </JProTable>
            </div>
        </div>

        <Save
            v-model:visible="saveVis"
            :channelData="channelData"
            @submit="listRef.reload()"
        />
        <Live v-model:visible="playerVis" :data="channelData" />
    </page-container>
</template>

<script setup lang="ts">
import ChannelApi from '@/api/media/channel';
import type { ActionsType } from '@/components/Table/index.vue';
import { useMenuStore } from 'store/menu';
import { message } from 'ant-design-vue';
import Save from './Save.vue';
import Live from './Live/index.vue';
import Tree from './Tree/index.vue';
import { cloneDeep } from 'lodash-es';
import { useElementSize } from '@vueuse/core';

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
                channelData.value = cloneDeep(data);
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

// 左侧树
const show = ref(false);
const deviceId = computed(() => route.query.id as string);
const handleSelect = (key: string) => {
    if (key === deviceId.value && listRef.value?.reload) {
        listRef.value?.reload();
    } else {
        params.value = {
            terms: [
                {
                    column: 'parentId',
                    value: key,
                },
            ],
        };
    }
};
</script>
<style lang="less" scoped>
@import './index.less';
</style>
