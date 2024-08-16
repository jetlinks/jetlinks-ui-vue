<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="edge-device"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="edgeDeviceRef"
                :columns="columns"
                :request="query"
                :defaultParams="defaultParams"
                :params="params"
                :gridColumn="3"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            @click="handleAdd"
                            hasPermission="edge/Device:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{ $t('Device.index.697800-0') }}
                        </PermissionButton>
                        <PermissionButton
                            @click="importVisible = true"
                            hasPermission="edge/Device:import"
                        >
                            <template #icon
                                ><AIcon type="ImportOutlined"
                            /></template>
                            {{ $t('Device.index.697800-1') }}
                        </PermissionButton>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.value==='notActive'?$t('Device.index.697800-7'):slotProps.state?.value==='offline'?$t('Device.index.697800-8'):$t('Device.index.697800-9')"
                        @click="handleView(slotProps.id)"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
                    >
                        <template #img>
                            <img
                                :width="80"
                                :height="80"
                                :src="
                                    slotProps?.photoUrl ||
                                    getImage('/device-gateway.png')
                                "
                            />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row style="margin-top: 18px">
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Device.index.697800-2') }}
                                    </div>
                                    <div>{{ slotProps.deviceType?.text }}</div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Device.index.697800-3') }}
                                    </div>
                                    <Ellipsis style="width: 100%">
                                        {{ slotProps.productName }}
                                    </Ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <j-dropdown
                                placement="bottomRight"
                                v-if="item.key === 'others'"
                            >
                                <j-button>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item.text }}</span>
                                </j-button>
                                <template #overlay>
                                    <j-menu>
                                        <j-menu-item
                                            v-for="(o, i) in item.children"
                                            :key="i"
                                        >
                                            <PermissionButton
                                                :disabled="
                                                    o.disabled ||
                                                    slotProps.state.value !==
                                                        'online'
                                                "
                                                :popConfirm="o.popConfirm"
                                                :tooltip="{
                                                    ...o.tooltip,
                                                }"
                                                @click="o.onClick"
                                                :hasPermission="
                                                    'edge/Device:' + o.key
                                                "
                                                type="link"
                                            >
                                                <AIcon :type="o.icon" />
                                                <span>{{ o?.text }}</span>
                                            </PermissionButton>
                                        </j-menu-item>
                                    </j-menu>
                                </template>
                            </j-dropdown>
                            <PermissionButton
                                :disabled="item.disabled"
                                v-else
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="'edge/Device:' + item.key"
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
                <template #state="slotProps">
                    <BadgeStatus
                        :status="slotProps.state?.value"
                        :text="slotProps.state?.text"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
                    />
                </template>
                <template #registryTime="slotProps">
                    <span>{{
                        slotProps.registryTime
                            ? dayjs(slotProps.registryTime).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}</span>
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                :disabled="i.disabled"
                                :popConfirm="i.popConfirm"
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0 5px"
                                :danger="i.key === 'delete'"
                                :hasPermission="
                                    i.key === 'view'
                                        ? true
                                        : 'edge/Device:' + i.key
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
        <Save
            v-if="visible"
            :data="current"
            @close="visible = false"
            @save="saveBtn"
        />
        <Import
            @save="onRefresh"
            @close="importVisible = false"
            v-if="importVisible"
            type="official-edge-gateway"
        />
    </page-container>
</template>

<script lang="ts" setup>
import { queryGatewayList, queryNoPagingPost } from '@/api/device/product';
import { queryTree } from '@/api/device/category';
import { ActionsType } from '@/views/device/Instance/typings';
import { useMenuStore } from '@/store/menu';
import { getImage, onlyMessage } from '@/utils/comm';
import dayjs from 'dayjs';
import { query, _delete, _deploy, _undeploy } from '@/api/device/instance';
import { restPassword } from '@/api/edge/device';
import Save from './Save/index.vue';
import Import from '@/views/device/Instance/Import/index.vue';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();

const defaultParams = {
    sorts: [{ name: 'createTime', order: 'desc' }],
    terms: [
        {
            terms: [
                {
                    column: 'productId$product-info',
                    value: 'accessProvider is official-edge-gateway',
                },
            ],
            type: 'and',
        },
    ],
};

const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const params = ref<Record<string, any>>({});
const edgeDeviceRef = ref<Record<string, any>>({});
const importVisible = ref<boolean>(false);
const visible = ref<boolean>(false);
const current = ref<Record<string, any>>({});

const transformData = (arr: any[]): any[] => {
    if (Array.isArray(arr) && arr.length) {
        return (arr || []).map((item: any) => {
            return {
                ...item,
                id: `classifiedId is ${item.id}`,
                children: transformData(item.children),
            };
        });
    } else {
        return [];
    }
};

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        search: {
            type: 'string',
            defaultTermType: 'eq',
        },
        ellipsis: true,
    },
    {
        title: $t('Device.index.697800-4'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
        ellipsis: true,
    },
    {
        title: $t('Device.index.697800-3'),
        dataIndex: 'productName',
        key: 'productName',
        search: {
            type: 'select',
            rename: 'productId',
            options: () =>
                new Promise((resolve) => {
                    queryNoPagingPost({ paging: false }).then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.name,
                                value: item.id,
                            })),
                        );
                    });
                }),
        },
        ellipsis: true,
    },
    {
        title: $t('Device.index.697800-5'),
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('Device.index.697800-6'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Device.index.697800-7'), value: 'notActive' },
                { label: $t('Device.index.697800-8'), value: 'offline' },
                { label: $t('Device.index.697800-9'), value: 'online' },
            ],
        },
    },
    {
        key: 'productId$product-info',
        dataIndex: 'productId$product-info',
        title: $t('Device.index.697800-10'),
        hideInTable: true,
        search: {
            type: 'treeSelect',
            options: () =>
                new Promise((resolve) => {
                    queryTree({ paging: false }).then((resp: any) => {
                        resolve(transformData(resp.result));
                    });
                }),
        },
    },
    // {
    //     key: 'productId$product-info',
    //     dataIndex: 'productId$product-info',
    //     title: '接入方式',
    //     hideInTable: true,
    //     search: {
    //         type: 'select',
    //         options: () =>
    //             new Promise((resolve) => {
    //                 queryGatewayList({}).then((resp: any) => {
    //                     resolve(
    //                         resp.result.map((item: any) => ({
    //                             label: item.name,
    //                             value: `accessId is ${item.id}`,
    //                         })),
    //                     );
    //                 });
    //             }),
    //     },
    // },
    {
        dataIndex: 'deviceType',
        title: $t('Device.index.697800-2'),
        valueType: 'select',
        hideInTable: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Device.index.697800-11'), value: 'device' },
                { label: $t('Device.index.697800-12'), value: 'childrenDevice' },
                { label: $t('Device.index.697800-13'), value: 'gateway' },
            ],
        },
    },
    {
        title: $t('Device.index.697800-14'),
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Device.index.697800-15'),
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'view',
            text: $t('Device.index.697800-16'),
            tooltip: {
                title: $t('Device.index.697800-16'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id);
            },
        },
        {
            key: 'update',
            text: $t('Device.index.697800-17'),
            tooltip: {
                title: $t('Device.index.697800-17'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                visible.value = true;
                current.value = data;
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'notActive' ? $t('Device.index.697800-30') : $t('Device.index.697800-18'),
            tooltip: {
                title: data.state?.value !== 'notActive' ? $t('Device.index.697800-30') : $t('Device.index.697800-18'),
            },
            icon:
                data.state.value !== 'notActive'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `${
                    data.state.value !== 'notActive' ? $t('Device.index.697800-19') : $t('Device.index.697800-29')
                }?`,
                onConfirm: () => {
                    let response = undefined;
                    if (data.state.value !== 'notActive') {
                        response = _undeploy(data.id);
                    } else {
                        response = _deploy(data.id);
                    }
                    response.then((res) => {
                        if (res && res.status === 200) {
                            onlyMessage($t('Device.index.697800-20'));
                            edgeDeviceRef.value?.reload();
                        } else {
                            onlyMessage($t('Device.index.697800-21'), 'error');
                        }
                    });
                    return response;
                },
            },
        },
    ];
    const others = [
        {
            key: 'setting',
            text: $t('Device.index.697800-22'),
            tooltip: {
                title: $t('Device.index.697800-22'),
            },
            icon: 'ControlOutlined',
            onClick: () => {
                menuStory.jumpPage('edge/Device/Remote', {
                    id: data.id,
                });
            },
        },
        {
            key: 'password',
            text: $t('Device.index.697800-23'),
            tooltip: {
                title: $t('Device.index.697800-23'),
            },
            icon: 'RedoOutlined',
            popConfirm: {
                title: $t('Device.index.697800-24'),
                onConfirm: () => {
                    const response = restPassword(data.id);
                    response.then((resp: any) => {
                        if (resp.status === 200) {
                            onlyMessage($t('Device.index.697800-20'));
                            edgeDeviceRef.value?.reload();
                        }
                    });
                    return response;
                },
            },
        },
    ];

    const deleteItem = {
        key: 'delete',
        text: $t('Device.index.697800-25'),
        disabled: data.state?.value !== 'notActive',
        tooltip: {
            title:
                data.state.value !== 'notActive'
                    ? $t('Device.index.697800-26')
                    : $t('Device.index.697800-25'),
        },
        popConfirm: {
            title: $t('Device.index.697800-27'),
            onConfirm: () => {
                const response = _delete(data.id);
                response.then((resp) => {
                    if (resp.status === 200) {
                        onlyMessage($t('Device.index.697800-20'));
                        edgeDeviceRef.value?.reload();
                    } else {
                        onlyMessage($t('Device.index.697800-21'), 'error');
                    }
                });
                return response;
            },
        },
        icon: 'DeleteOutlined',
    };

    if (type === 'card') {
        const arr = actions.filter((i: ActionsType) => i.key !== 'view');
        return [
            ...arr,
            {
                key: 'others',
                text: $t('Device.index.697800-28'),
                icon: 'EllipsisOutlined',
                children: [...others],
            },
            deleteItem,
        ];
    } else {
        return [...actions, ...others, deleteItem];
    }
};

const handleSearch = (_params: any) => {
    params.value = _params;
};

const handleView = (id: string) => {
    menuStory.jumpPage('device/Instance/Detail', { id });
};

const handleAdd = () => {
    visible.value = true;
    current.value = {};
};

const saveBtn = () => {
    visible.value = false;
    edgeDeviceRef.value?.reload();
};

const onRefresh = () => {
    importVisible.value = false;
    edgeDeviceRef.value?.reload();
};
</script>

<style lang="less" scoped></style>
