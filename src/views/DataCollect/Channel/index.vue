<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-datacollect-channel"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    model="CARD"
                    :gridColumn="3"
                    :request="query"
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
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{ $t('Channel.index.098164-0') }}
                        </PermissionButton>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :showStatus="true"
                            :value="slotProps"
                            :actions="getActions(slotProps, 'card')"
                            v-bind="slotProps"
                            :status="getState(slotProps).value"
                            :statusText="getState(slotProps).value==='running'?$t('Channel.index.098164-9'):getState(slotProps).value==='stopped'?$t('Channel.index.098164-10'):$t('Channel.index.098164-7')"
                            :statusNames="StatusColorEnum"
                            @click="handlEye(slotProps.id)"
                        >
                            <template #img>{{getState(slotProps).value}}
                                <slot name="img">
                                    <img
                                        :src="ImageMap.get(slotProps.provider)"
                                    />
                                </slot>
                            </template>
                            <template #content>
                                <div class="card-item-content">
                                    <Ellipsis style="width: calc(100% - 100px)">
                                        <span
                                            style="
                                                font-size: 18px;
                                                font-weight: 800;
                                                line-height: 22px;
                                            "
                                        >
                                            {{ slotProps.name }}
                                        </span>
                                    </Ellipsis>
                                    <j-row class="card-item-content-box">
                                        <j-col :span="12">
                                            <div class="card-item-content-text">
                                                {{ $t('Channel.index.098164-1') }}
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        protocolList.find(
                                                            (item) =>
                                                                item.value ===
                                                                slotProps.provider,
                                                        )?.label
                                                    }}</template>
                                                    {{
                                                        protocolList.find(
                                                            (item) =>
                                                                item.value ===
                                                                slotProps.provider,
                                                        )?.label
                                                    }}
                                                </j-tooltip>
                                            </div>
                                        </j-col>
                                        <!-- <j-col :span="12">
                                            <div class="card-item-content-text">
                                                地址
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.configuration
                                                            .host ||
                                                        slotProps.configuration
                                                            .endpoint
                                                    }}</template>
                                                    <span
                                                        class="details-text"
                                                        >{{
                                                            slotProps
                                                                .configuration
                                                                .host ||
                                                            slotProps
                                                                .configuration
                                                                .endpoint
                                                        }}</span
                                                    >
                                                </j-tooltip>
                                            </div>
                                        </j-col> -->
                                        <j-col :span="12">
                                            <div class="card-item-content-text">
                                                {{ $t('Channel.index.098164-2') }}
                                            </div>
                                            <j-ellipsis>
                                                <div class="explain">
                                                    {{ slotProps.description }}
                                                </div>
                                            </j-ellipsis>
                                        </j-col>
                                    </j-row>
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
                                    :hasPermission="
                                        'DataCollect/Channel:' + item.key
                                    "
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
                </j-pro-table>
            </FullPage>
            <Save v-if="visible" :data="current" @change="saveChange" />
        </div>
    </page-container>
</template>
<script lang="ts" setup name="DataCollectPage">
import type { ActionsType } from '@/components/Table/index';
import { getImage } from '@/utils/comm';
import {
    query,
    remove,
    update,
    getProviders,
} from '@/api/data-collect/channel';
import { onlyMessage } from '@/utils/comm';
import { StatusColorEnum, updateStatus } from './data';
import { useMenuStore } from 'store/menu';
import Save from './Save/index.vue';
import { protocolList } from '@/utils/consts';
import _ from 'lodash-es';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const visible = ref(false);
const current = ref({});

const opcImage = getImage('/DataCollect/device-opcua.png');
const modbusImage = getImage('/DataCollect/device-modbus.png');
const s7Image = getImage('/DataCollect/s7.png');
const gatewayImage = getImage('/DataCollect/gateway.png');
const iecImage = getImage('/DataCollect/IEC104.png');
const ImageMap = new Map();
ImageMap.set('OPC_UA', opcImage);
ImageMap.set('MODBUS_TCP', modbusImage);
ImageMap.set('snap7', s7Image);
ImageMap.set('iec104', iecImage);
ImageMap.set('COLLECTOR_GATEWAY', gatewayImage);

const columns = [
    {
        title: $t('Channel.index.098164-3'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Channel.index.098164-4'),
        dataIndex: 'provider',
        key: 'provider',
        ellipsis: true,
        search: {
            type: 'select',
            options: async () => {
                const resp: any = await getProviders();
                if (resp.status === 200) {
                    const arr = resp.result
                        .filter((item: any) =>
                            [
                                'GATEWAY',
                                'Modbus/TCP',
                                'opc-ua',
                                'snap7',
                                'IEC104',
                                'BACNet/IP',
                            ].includes(item.name),
                        )
                        .map((it: any) => it.name);
                    const providers: any = protocolList.filter((item: any) =>
                        arr.includes(item.alias),
                    );
                    return providers;
                }
            },
        },
    },
    {
        title: $t('Channel.index.098164-5'),
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Channel.index.098164-6'), value: 'enabled' },
                { label: $t('Channel.index.098164-7'), value: 'disabled' },
            ],
        },
    },
    {
        title: $t('Channel.index.098164-8'),
        dataIndex: 'runningState',
        key: 'runningState',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Channel.index.098164-9'), value: 'running' },
                { label: $t('Channel.index.098164-10'), value: 'stopped' },
            ],
        },
    },
    {
        title: $t('Channel.index.098164-2'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Channel.index.098164-11'),
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
    const stateText = state === 'enabled' ? $t('Channel.index.098164-20') : $t('Channel.index.098164-12');
    const actions = [
        {
            key: 'update',
            text: $t('Channel.index.098164-13'),
            tooltip: {
                title: $t('Channel.index.098164-13'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                handleEdit(data);
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
                title: `${
                  state === 'enabled' ? $t('Channel.index.098164-14') : $t('Channel.index.098164-19')
                }?`,
                onConfirm: () => {
                    const response = update(data.id, updateStatus[state]);
                    response.then((res) => {
                        if (res.success) {
                            onlyMessage($t('Channel.index.098164-15'), 'success');
                            tableRef.value?.reload();
                        }
                    });
                    return response
                },
            },
        },
        {
            key: 'delete',
            text: $t('Channel.index.098164-16'),
            disabled: state === 'enabled',
            tooltip: {
                title:
                    state === 'enabled' ? $t('Channel.index.098164-17') : $t('Channel.index.098164-16'),
            },
            popConfirm: {
                placement: 'topRight',
                title: $t('Channel.index.098164-18'),
                onConfirm:  () => {
                    const response =  remove(data.id);
                    response.then((res)=>{
                        if (res.success) {
                        onlyMessage($t('Channel.index.098164-15'), 'success');
                        tableRef.value.reload();
                    }
                    })
                   return response
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const handlAdd = () => {
    current.value = {};
    visible.value = true;
};

const handleEdit = (data: object) => {
    current.value = _.cloneDeep(data);
    visible.value = true;
};
const handlEye = (id: string) => {
    menuStory.jumpPage(`DataCollect/Collector`, {}, { channelId: id });
};
const saveChange = (value: object) => {
    visible.value = false;
    current.value = {};
    if (value) {
        onlyMessage($t('Channel.index.098164-15'), 'success');
        tableRef.value.reload();
    }
};
const getState = (record: Partial<Record<string, any>>) => {
    if (record) {
        if (record?.state?.value === 'enabled') {
            return { ...record?.runningState };
        } else {
            return {
                text: $t('Channel.index.098164-7'),
                value: 'disabled',
            };
        }
    } else {
        return {};
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
.card-item-content {
    min-height: 100px;
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
    .explain {
        margin-top: 10px;
    }
}
.details-text {
    font-weight: 700;
    font-size: 14px;
}
</style>
