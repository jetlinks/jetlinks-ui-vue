<!-- 视频设备-通道列表 -->
<template>
    <page-container>
        <div class="device-channel-warp">
            <Tree
                :deviceData="deviceData"
                :on-tree-load="(e) => (show = e)"
                :on-select="handleSelect"
            />
            <div class="right">
                <pro-search
                    :columns="newColumns"
                    target="channel"
                    @search="handleSearch"
                />
                <FullPage>
                    <JProTable
                        ref="listRef"
                        model="table"
                        :columns="newColumns"
                        :request="(e:any) => ChannelApi.list(e, route?.query.id as string)"
                        :defaultParams="{
                            sorts: [{ name: 'modifyTime', order: 'desc' }],
                        }"
                        :params="params"
                    >
                        <template #headerTitle>
                            <j-tooltip
                                v-if="
                                    ['gb28181-2016', 'onvif'].includes(
                                        route.query.type,
                                    )
                                "
                                :title="`接入方式为${
                                    route.query.type === 'onvif'
                                        ? 'Onvif'
                                        : 'GB/T28181'
                                }时，不支持新增`"
                            >
                                <j-button type="primary" disabled>
                                    新增
                                </j-button>
                            </j-tooltip>
                            <PermissionButton
                                v-else
                                type="primary"
                                @click="handleAdd"
                                hasPermission="media/Device:add"
                            >
                                <template #icon
                                    ><AIcon type="PlusOutlined" />新增</template
                                >
                            </PermissionButton>
                        </template>
                        <template #rightExtraRender>
                            <PermissionButton
                                type="text"
                                :tooltip="{
                                    title:
                                        route?.query?.type === 'fixed-media'
                                            ? '固定地址无法更新通道'
                                            : deviceData?.state?.value ===
                                              'offline'
                                            ? '设备已离线'
                                            : deviceData?.state?.value ===
                                              'notActive'
                                            ? '设备已禁用'
                                            : '更新通道',
                                }"
                                :disabled="
                                    deviceData?.state?.value === 'offline' ||
                                    deviceData?.state?.value === 'notActive' ||
                                    route?.query?.type === 'fixed-media'
                                "
                                @click="refreshChanel"
                            >
                                <template #icon
                                    ><AIcon
                                        type="SyncOutlined"
                                    />更新通道</template
                                ></PermissionButton
                            >
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
                                <template
                                    v-for="i in getActions(slotProps, 'table')"
                                    :key="i.key"
                                >
                                    <PermissionButton
                                        v-if="
                                            i.key !== 'play' &&
                                            i.key !== 'backPlay'
                                        "
                                        :danger="i.key === 'delete'"
                                        :disabled="i.disabled"
                                        :popConfirm="i.popConfirm"
                                        :tooltip="{
                                            ...i.tooltip,
                                        }"
                                        @click="i.onClick"
                                        type="link"
                                        style="padding: 0px"
                                        :hasPermission="'media/Device:' + i.key"
                                    >
                                        <template #icon
                                            ><AIcon :type="i.icon"
                                        /></template>
                                    </PermissionButton>
                                    <!-- 回放/播放不要权限控制 -->
                                    <template v-else>
                                        <j-tooltip
                                            :key="i.key"
                                            v-bind="i.tooltip"
                                        >
                                            <j-button
                                                style="padding: 0px"
                                                type="link"
                                                @click="
                                                    i.onClick &&
                                                        i.onClick(slotProps)
                                                "
                                            >
                                                <j-button
                                                    :disabled="i.disabled"
                                                    style="padding: 0"
                                                    type="link"
                                                >
                                                    <AIcon :type="i.icon" />
                                                </j-button>
                                            </j-button>
                                        </j-tooltip>
                                    </template>
                                </template>
                            </j-space>
                        </template>
                    </JProTable>
                </FullPage>
            </div>
        </div>

        <Save
            v-model:visible="saveVis"
            :channelData="channelData"
            @submit="listRef.reload()"
        />
        <Live
            v-model:visible="playerVis"
            :data="playData"
            @refresh="listRef.reload()"
        />
    </page-container>
</template>

<script setup lang="ts">
import ChannelApi from '@/api/media/channel';
import type { ActionsType } from '@/views/device/Instance/typings';
import { useMenuStore } from 'store/menu';
import Save from './Save.vue';
import Live from './Live/index.vue';
import Tree from './Tree/index.vue';
import { cloneDeep } from 'lodash-es';
import { onlyMessage } from '@/utils/comm';
import DeviceApi from '@/api/media/device';

const menuStory = useMenuStore();
const route: any = useRoute();

const columns = [
    {
        title: '通道ID',
        dataIndex: 'channelId',
        key: 'channelId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
    },
    {
        title: '安装地址',
        dataIndex: 'address',
        ellipsis: true,
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
        width: 150,
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
        width: 200,
        scopedSlots: true,
    },
];

const newColumns = computed(()=>{
    if(route.query.type=== 'fixed-media'){
        return columns.filter(item=>item.key!=='manufacturer')
    }else{
        return columns
    }
});

const params = ref<Record<string, any>>({});
const deviceData = ref<any>();

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

const saveVis = ref(false);
const handleAdd = () => {
    channelData.value = undefined;
    saveVis.value = true;
};

const listRef = ref();
const playerVis = ref(false);
const channelData = ref();
const playData = ref();

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
            key: 'update',
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
                playData.value = cloneDeep(data);
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
                onConfirm: () => {
                    const response = ChannelApi.del(data.id);
                    response.then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage('操作成功！');
                            listRef.value?.reload();
                        } else {
                            onlyMessage('操作失败！', 'error');
                        }
                    });
                    return response;
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

const deviceId = computed(() => route.query.id as string);
const handleSelect = (key: string) => {
    if (key === deviceId.value && listRef.value?.reload) {
      params.value = {
        terms: []
      }
        // listRef.value?.reload();
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
const refreshChanel = async () => {
    const res = await DeviceApi.updateChannels(deviceData.value.id);
    if (res.success) {
        onlyMessage('通道更新成功');
        listRef.value?.reload();
    }
};
onMounted(async () => {
    const deviceResp = await DeviceApi.detail(route.query.id);
    if (deviceResp.success) {
        deviceData.value = deviceResp.result;
    }
});
</script>
<style lang="less" scoped>
@import './index.less';
</style>
