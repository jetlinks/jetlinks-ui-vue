<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="listRef"
                :columns="columns"
                :request="DeviceApi.list"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="handleAdd"
                        hasPermission="media/Device:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增
                    </PermissionButton>
                </template>
                <template #card="slotProps">
                    <CardBox
                        @click="() => showSummary(slotProps)"
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :showStatus="true"
                        :status="slotProps.state.value"
                        :statusText="slotProps.state.text"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img :src="getImage('/device-media.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 700">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        厂商
                                    </div>
                                    <Ellipsis style="width: calc(100% - 20px)">
                                        <div>{{ slotProps.manufacturer }}</div>
                                    </Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        通道数量
                                    </div>
                                    <div>{{ slotProps.channelNumber }}</div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        型号
                                    </div>
                                    <Ellipsis
                                        style="width: calc(100% - 20px)"
                                        >{{ slotProps.model }}</Ellipsis
                                    >
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        接入方式
                                    </div>
                                    <div>
                                        {{ providerType[slotProps.provider] }}
                                    </div>
                                </j-col>
                            </j-row>
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
                                    'media/Device:' +
                                    (item.key !== 'updateChannel'
                                        ? item.key
                                        : 'update')
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

                <template #channelNumber="slotProps">
                    {{ slotProps.channelNumber || 0 }}
                </template>
                <template #provider="slotProps">
                    {{ providerType[slotProps.provider] }}
                </template>
                <template #productId="slotProps">
                    {{ getProductName(slotProps.productId) }}
                </template>
                <template #state="slotProps">
                    <j-badge
                        :text="slotProps.state?.text"
                        :status="
                            slotProps.state?.value === 'online'
                                ? 'success'
                                : 'error'
                        "
                    />
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                :danger="i.key === 'delete'"
                                :disabled="i.disabled"
                                :popConfirm="i.popConfirm"
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0px"
                                :hasPermission="
                                    'media/Device:' +
                                    (i.key !== 'updateChannel' &&
                                    i.key !== 'viewDevice'
                                        ? i.key
                                        : 'update')
                                "
                            >
                                <template #icon
                                    ><AIcon :type="i.icon"
                                /></template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
        </FullPage>
        <Summary v-if="visibleSummary" :deviceId="deviceId" @closeDrawer="visibleSummary = false"></Summary>
    </page-container>
</template>

<script setup lang="ts">
import DeviceApi from '@/api/media/device';
import type { ActionsType } from '@/views/device/Instance/typings';
import { getImage, onlyMessage } from '@/utils/comm';
import { PROVIDER_OPTIONS } from '@/views/media/Device/const';
import { providerType } from './const';
import encodeQuery from '@/utils/encodeQuery';
import { useMenuStore } from 'store/menu';
import Summary from './Summary/index.vue';

const menuStory = useMenuStore();

const listRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const visibleSummary = ref(false);
const deviceId = ref();
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        fixed: 'left',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
        ellipsis: true,
    },
    {
        title: '接入方式',
        dataIndex: 'provider',
        key: 'provider',
        scopedSlots: true,
        width: 120,
        search: {
            type: 'select',
            options: PROVIDER_OPTIONS,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '通道数量',
        dataIndex: 'channelNumber',
        key: 'channelNumber',
        scopedSlots: true,
        width: 100,
    },
    {
        title: '厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
    },
    {
        title: '产品名称',
        dataIndex: 'productId',
        key: 'productId',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'select',
            options: async () => {
                return productList.value;
            },
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'notActive' },
                { label: '离线', value: 'offline' },
                { label: '在线', value: 'online' },
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
            key: 'update',
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
            key: 'viewDevice',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                menuStory.jumpPage('device/Instance/Detail', { id: data.id });
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title:
                    data.state.value === 'online' ? '在线设备无法删除' : '删除',
            },
            disabled: data.state.value === 'online',
            popConfirm: {
                title: '确认删除?',
                onConfirm: () => {
                    const response = DeviceApi.del(data.id);
                    response.then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage('操作成功！');
                            listRef.value?.reload();
                        } else {
                            onlyMessage('操作失败！', 'error');
                        }
                    });
                    return response
                },
            },
            icon: 'DeleteOutlined',
        },
    ];

    let acts: any = [];
    if (type === 'card') {
        // 卡片不展示查看按钮
        const tempActs = actions.filter((f: any) => f.key !== 'viewDevice');
        acts =
            data.provider === 'fixed-media'
                ? tempActs.filter((f: any) => f.key !== 'updateChannel')
                : tempActs;
    } else {
        acts =
            data.provider === 'fixed-media'
                ? actions.filter((f: any) => f.key !== 'updateChannel')
                : actions;
    }
    return acts;
};

const productList = ref<any[]>([]);
const getProductList = () => {
    DeviceApi.getProductList(
        encodeQuery({
            terms: {
                messageProtocol$in: [
                    'gb28181-2016',
                    'fixed-media',
                    'onvif',
                    'media-plugin',
                ],
            },
        }),
    ).then((resp: any) => {
        productList.value = resp.result.map((pItem: any) => ({
            label: pItem.name,
            value: pItem.id,
        }));
    });
};
getProductList();

const getProductName = (pid: string) => {
    return productList.value.find((f: any) => f.value === pid)?.label;
};



const showSummary = (data: any) => {
    visibleSummary.value = true;
    deviceId.value = data.id;
};
</script>
