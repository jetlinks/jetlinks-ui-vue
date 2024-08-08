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
                    :columns="columns"
                    target="channel"
                    @search="handleSearch"
                />
                <FullPage>
                    <JProTable
                        ref="listRef"
                        model="table"
                        :columns="columns"
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
                                :title="$t('Channel.index.117446-0', [accessMethod])"
                            >
                                <j-button type="primary" disabled>
                                    {{ $t('Channel.index.117446-1') }}
                                </j-button>
                            </j-tooltip>
                            <PermissionButton
                                v-else
                                type="primary"
                                @click="handleAdd"
                                hasPermission="media/Device:add"
                            >
                                <template #icon
                                    ><AIcon type="PlusOutlined" />{{ $t('Channel.index.117446-1') }}</template
                                >
                            </PermissionButton>
                        </template>
                        <template #rightExtraRender>
                            <PermissionButton
                                type="text"
                                :tooltip="{
                                    title:
                                        route?.query?.type === 'fixed-media'
                                            ? $t('Channel.index.117446-2')
                                            : deviceData?.state?.value ===
                                              'offline'
                                            ? $t('Channel.index.117446-3')
                                            : deviceData?.state?.value ===
                                              'notActive'
                                            ? $t('Channel.index.117446-4')
                                            : $t('Channel.index.117446-5'),
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
                                    />{{ $t('Channel.index.117446-5') }}</template
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
                                    <!-- {{ $t('Channel.index.117446-16') }}/播放不要权限控制 -->
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();
const route: any = useRoute();
const accessMethod=computed(()=> route.query.type === 'onvif'
  ? 'Onvif'
  : 'GB/T28181')
const columns = [
    {
        title: $t('Channel.index.117446-6'),
        dataIndex: 'channelId',
        key: 'channelId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Channel.index.117446-7'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Channel.index.117446-8'),
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
    },
    {
        title: $t('Channel.index.117446-9'),
        dataIndex: 'address',
        ellipsis: true,
        key: 'address',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Channel.index.117446-10'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        width: 150,
        search: {
            type: 'select',
            options: [
                { label: $t('Channel.index.117446-11'), value: 'online' },
                { label: $t('Channel.index.117446-12'), value: 'offline' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: $t('Channel.index.117446-13'),
        key: 'action',
        width: 200,
        scopedSlots: true,
    },
];

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
            text: $t('Channel.index.117446-14'),
            tooltip: {
                title: $t('Channel.index.117446-14'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                channelData.value = cloneDeep(data);
                saveVis.value = true;
            },
        },
        {
            key: 'play',
            text: $t('Channel.index.117446-15'),
            tooltip: {
                title: $t('Channel.index.117446-15'),
            },
            icon: 'VideoCameraOutlined',
            onClick: () => {
                playData.value = cloneDeep(data);
                playerVis.value = true;
            },
        },
        {
            key: 'backPlay',
            text: $t('Channel.index.117446-16'),
            tooltip: {
                title: $t('Channel.index.117446-16'),
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
            text: $t('Channel.index.117446-17'),
            tooltip: {
                title: $t('Channel.index.117446-17'),
            },
            popConfirm: {
                title: $t('Channel.index.117446-18'),
                onConfirm: () => {
                    const response = ChannelApi.del(data.id);
                    response.then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage($t('Channel.index.117446-19'));
                            listRef.value?.reload();
                        } else {
                            onlyMessage($t('Channel.index.117446-20'), 'error');
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
const refreshChanel = async () => {
    const res = await DeviceApi.updateChannels(deviceData.value.id);
    if (res.success) {
        onlyMessage($t('Channel.index.117446-21'));
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
