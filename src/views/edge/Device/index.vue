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
                            新增
                        </PermissionButton>
                        <PermissionButton
                            @click="importVisible = true"
                            hasPermission="edge/Device:import"
                        >
                            <template #icon
                                ><AIcon type="ImportOutlined"
                            /></template>
                            导入
                        </PermissionButton>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
                    >
                        <template #img>
                            <img
                                :width="88"
                                :height="88"
                                :src="
                                    slotProps?.photoUrl ||
                                    getImage('/device/instance/device-card.png')
                                "
                            />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span
                                    style="font-size: 16px; font-weight: 600"
                                    @click.stop="handleView(slotProps.id)"
                                >
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row style="margin-top: 20px">
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        设备类型
                                    </div>
                                    <div>{{ slotProps.deviceType?.text }}</div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        产品名称
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
                                                :disabled="o.disabled"
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
                        dayjs(slotProps.registryTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )
                    }}</span>
                </template>
                <template #action="slotProps">
                    <j-space>
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
import { message } from 'jetlinks-ui-components';
import { ActionsType } from '@/views/device/Instance/typings';
import { useMenuStore } from '@/store/menu';
import { getImage } from '@/utils/comm';
import dayjs from 'dayjs';
import { query, _delete, _deploy, _undeploy } from '@/api/device/instance';
import { restPassword } from '@/api/edge/device';
import Save from './Save/index.vue';
import Import from '@/views/device/Instance/Import/index.vue';
import BadgeStatus from '@/components/BadgeStatus/index.vue';

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
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '产品名称',
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
    },
    {
        title: '注册时间',
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'notActive' },
                { label: '离线', value: 'offline' },
                { label: '在线', value: 'online' },
            ],
        },
    },
    {
        key: 'productId$product-info',
        dataIndex: 'productId$product-info',
        title: '产品分类',
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
        title: '设备类型',
        valueType: 'select',
        hideInTable: true,
        search: {
            type: 'select',
            options: [
                { label: '直连设备', value: 'device' },
                { label: '网关子设备', value: 'childrenDevice' },
                { label: '网关设备', value: 'gateway' },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        search: {
            type: 'string',
        },
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
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id);
            },
        },
        {
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                visible.value = true;
                current.value = data;
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'notActive' ? '禁用' : '启用',
            tooltip: {
                title: data.state?.value !== 'notActive' ? '禁用' : '启用',
            },
            icon:
                data.state.value !== 'notActive'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${
                    data.state.value !== 'notActive' ? '禁用' : '启用'
                }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state.value !== 'notActive') {
                        response = await _undeploy(data.id);
                    } else {
                        response = await _deploy(data.id);
                    }
                    if (response && response.status === 200) {
                        message.success('操作成功！');
                        edgeDeviceRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
        },
    ];
    const others = [
        {
            key: 'setting',
            text: '远程控制',
            tooltip: {
                title: '远程控制',
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
            text: '重置密码',
            tooltip: {
                title: '重置密码',
            },
            icon: 'RedoOutlined',
            popConfirm: {
                title: '确认重置密码为P@ssw0rd？',
                onConfirm: async () => {
                    restPassword(data.id).then((resp: any) => {
                        if (resp.status === 200) {
                            message.success('操作成功！');
                            edgeDeviceRef.value?.reload();
                        }
                    });
                },
            },
        },
    ];

    const deleteItem = {
        key: 'delete',
        text: '删除',
        disabled: data.state?.value !== 'notActive',
        tooltip: {
            title:
                data.state.value !== 'notActive'
                    ? '已启用的设备不能删除'
                    : '删除',
        },
        popConfirm: {
            title: '确认删除?',
            onConfirm: async () => {
                const resp = await _delete(data.id);
                if (resp.status === 200) {
                    message.success('操作成功！');
                    edgeDeviceRef.value?.reload();
                } else {
                    message.error('操作失败！');
                }
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
                text: '其他',
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
  
  <style lang="less" scoped>
</style>