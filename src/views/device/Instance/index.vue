<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="device-instance"
            @search="handleSearch"
        />
        <JProTable
            ref="instanceRef"
            :columns="columns"
            :request="query"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange,
            }"
            :params="params"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton
                        type="primary"
                        @click="handleAdd"
                        hasPermission="device/Instance:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增
                    </PermissionButton>
                    <j-dropdown>
                        <j-button
                            >批量操作 <AIcon type="DownOutlined"
                        /></j-button>
                        <template #overlay>
                            <j-menu>
                                <j-menu-item>
                                    <PermissionButton
                                        @click="exportVisible = true"
                                        hasPermission="device/Instance:export"
                                    >
                                        <template #icon
                                            ><AIcon type="ExportOutlined"
                                        /></template>
                                        批量导出设备
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item>
                                    <PermissionButton
                                        @click="importVisible = true"
                                        hasPermission="device/Instance:import"
                                    >
                                        <template #icon
                                            ><AIcon type="ImportOutlined"
                                        /></template>
                                        批量导入设备
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item>
                                    <PermissionButton
                                        ghost
                                        type="primary"
                                        :popConfirm="{
                                            title: '确认激活全部设备？',
                                            onConfirm: activeAllDevice,
                                        }"
                                        hasPermission="device/Instance:action"
                                    >
                                        <template #icon
                                            ><AIcon type="CheckCircleOutlined"
                                        /></template>
                                        激活全部设备
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item>
                                    <PermissionButton
                                        type="primary"
                                        @click="syncDeviceStatus"
                                        hasPermission="device/Instance:view"
                                    >
                                        <template #icon
                                            ><AIcon type="SyncOutlined"
                                        /></template>
                                        同步设备状态
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item v-if="_selectedRowKeys.length">
                                    <PermissionButton
                                        type="primary"
                                        danger
                                        :popConfirm="{
                                            title: '已启用的设备无法删除，确认删除选中的禁用状态设备？',
                                            onConfirm: delSelectedDevice,
                                        }"
                                        hasPermission="device/Instance:delete"
                                    >
                                        <template #icon
                                            ><AIcon type="DeleteOutlined"
                                        /></template>
                                        删除选中设备
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item v-if="_selectedRowKeys.length">
                                    <PermissionButton
                                        type="primary"
                                        :popConfirm="{
                                            title: '确认激活选中设备',
                                            onConfirm: activeSelectedDevice,
                                        }"
                                        hasPermission="device/Instance:action"
                                    >
                                        <template #icon
                                            ><AIcon type="CheckOutlined"
                                        /></template>
                                        激活选中设备
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item v-if="_selectedRowKeys.length">
                                    <PermissionButton
                                        type="primary"
                                        danger
                                        :popConfirm="{
                                            title: '确认禁用选中设备?',
                                            onConfirm: disabledSelectedDevice,
                                        }"
                                        hasPermission="device/Instance:action"
                                    >
                                        <template #icon
                                            ><AIcon type="StopOutlined"
                                        /></template>
                                        禁用选中设备
                                    </PermissionButton>
                                </j-menu-item>
                            </j-menu>
                        </template>
                    </j-dropdown>
                </j-space>
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    @click="handleClick"
                    :actions="getActions(slotProps, 'card')"
                    :active="_selectedRowKeys.includes(slotProps.id)"
                    :status="slotProps.state?.value"
                    :statusText="slotProps.state?.text"
                    :statusNames="{
                        online: 'success',
                        offline: 'error',
                        notActive: 'warning',
                    }"
                >
                    <template #img>
                        <img
                            :src="getImage('/device/instance/device-card.png')"
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
                        <PermissionButton
                            :disabled="item.disabled"
                            :popConfirm="item.popConfirm"
                            :tooltip="{
                                ...item.tooltip,
                            }"
                            @click="item.onClick"
                            :hasPermission="'device/Instance:' + item.key"
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
                <j-badge
                    :text="slotProps.state?.text"
                    :status="statusMap.get(slotProps.state?.value)"
                />
            </template>
            <template #createTime="slotProps">
                <span>{{
                    dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss')
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
                            style="padding: 0px"
                            :hasPermission="'device/Instance:' + i.key"
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </JProTable>
    </page-container>
    <Import
        v-if="importVisible"
        @close="importVisible = false"
        @save="onRefresh"
    />
    <Export
        v-if="exportVisible"
        @close="exportVisible = false"
        :data="params"
        @save="onRefresh"
    />
    <Process
        v-if="operationVisible"
        @close="operationVisible = false"
        :api="api"
        :type="type"
        @save="onRefresh"
    />
    <Save
        v-if="visible"
        :data="current"
        @close="visible = false"
        @save="saveBtn"
    />
</template>

<script setup lang="ts">
import {
    query,
    _delete,
    _deploy,
    _undeploy,
    batchUndeployDevice,
    batchDeployDevice,
    batchDeleteDevice,
} from '@/api/device/instance';
import { getImage, LocalStore } from '@/utils/comm';
import { message } from 'jetlinks-ui-components';
import Import from './Import/index.vue';
import Export from './Export/index.vue';
import Process from './Process/index.vue';
import Save from './Save/index.vue';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import {
    getProviders,
    queryGatewayList,
    queryNoPagingPost,
    queryOrgThree,
} from '@/api/device/product';
import { queryTree } from '@/api/device/category';
import { useMenuStore } from '@/store/menu';
import type { ActionsType } from './typings';
import dayjs from 'dayjs';
import { throttle } from 'lodash-es';

const instanceRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);
const importVisible = ref<boolean>(false);
const exportVisible = ref<boolean>(false);
const visible = ref<boolean>(false);
const current = ref<Record<string, any>>({});
const operationVisible = ref<boolean>(false);
const api = ref<string>('');
const type = ref<string>('');

const menuStory = useMenuStore();

const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

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
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
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
        key: 'classifiedId',
        dataIndex: 'classifiedId',
        title: '产品分类',
        hideInTable: true,
        search: {
            type: 'treeSelect',
            options: () =>
                new Promise((resolve) => {
                    queryTree({ paging: false }).then((resp: any) => {
                        resolve(resp.result);
                    });
                }),
        },
    },
    {
        key: 'accessProvider',
        title: '网关类型',
        dataIndex: 'accessProvider',
        valueType: 'select',
        hideInTable: true,
        search: {
            type: 'select',
            rename: 'productId$product-info',
            options: () =>
                new Promise((resolve) => {
                    getProviders().then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.name,
                                value: `accessProvider is ${item.id}`,
                            })),
                        );
                    });
                }),
        },
    },
    {
        key: 'productId$product-info',
        dataIndex: 'productId$product-info',
        title: '接入方式',
        hideInTable: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    queryGatewayList({}).then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.name,
                                value: `accessId is ${item.id}`,
                            })),
                        );
                    });
                }),
        },
    },
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
        dataIndex: 'id$dim-assets',
        title: '所属组织',
        hideInTable: true,
        search: {
            type: 'treeSelect',
            options: () =>
                new Promise((resolve) => {
                    queryOrgThree({}).then((resp: any) => {
                        const formatValue = (list: any[]) => {
                            const _list: any[] = [];
                            list.forEach((item) => {
                                if (item.children) {
                                    item.children = formatValue(item.children);
                                }
                                _list.push({
                                    ...item,
                                    id: JSON.stringify({
                                        assetType: 'device',
                                        targets: [
                                            {
                                                type: 'org',
                                                id: item.id,
                                            },
                                        ],
                                    }),
                                });
                            });
                            return _list;
                        };
                        resolve(formatValue(resp.result));
                    });
                }),
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

const paramsFormat = (
    config: Record<string, any>,
    _terms: Record<string, any>,
    name?: string,
) => {
    if (
        config?.terms &&
        Array.isArray(config.terms) &&
        config?.terms.length > 0
    ) {
        (config?.terms || []).map(
            (item: Record<string, any>, index: number) => {
                if (item?.type) {
                    _terms[`${name ? `${name}.` : ''}terms[${index}].type`] =
                        item.type;
                }
                paramsFormat(
                    item,
                    _terms,
                    `${name ? `${name}.` : ''}terms[${index}]`,
                );
            },
        );
    } else if (!config?.terms && Object.keys(config).length > 0) {
        Object.keys(config).forEach((key) => {
            if (config[key]) {
                _terms[`${name ? `${name}.` : ''}${key}`] = config[key];
            }
        });
    }
};

onMounted(() => {
    if(history.state?.params?.type === 'add'){
        handleAdd()
    }
})

const handleParams = (config: Record<string, any>) => {
    const _terms: Record<string, any> = {};
    paramsFormat(config, _terms);
    if (Object.keys(_terms._value).length && Object.keys(_terms).length) {
        const url = new URLSearchParams();
        Object.keys(_terms).forEach((key) => {
            url.append(key, _terms[key]);
        });
        return url.toString();
    } else {
        return '';
    }
};

/**
 * 新增
 */
const handleAdd = () => {
    visible.value = true;
    current.value = {};
};

/**
 * 查看
 */
const handleView = (id: string) => {
    menuStory.jumpPage('device/Instance/Detail', { id });
};

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
                        instanceRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
        },
        {
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
                        instanceRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (type === 'card')
        return actions.filter((i: ActionsType) => i.key !== 'view');
    return actions;
};

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys];
};

const handleClick = (dt: any) => {
    if (_selectedRowKeys.value.includes(dt.id)) {
        const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
        _selectedRowKeys.value.splice(_index, 1);
    } else {
        _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
    }
};

const activeAllDevice = () => {
    type.value = 'active';
    const activeAPI = `${BASE_API_PATH}/device-instance/deploy?:X_Access_Token=${LocalStore.get(
        TOKEN_KEY,
    )}&${handleParams(params)}`;
    api.value = activeAPI;
    operationVisible.value = true;
};

const syncDeviceStatus = () => {
    type.value = 'sync';
    const syncAPI = `${BASE_API_PATH}/device-instance/state/_sync?:X_Access_Token=${LocalStore.get(
        TOKEN_KEY,
    )}&${handleParams(params)}`;
    api.value = syncAPI;
    operationVisible.value = true;
};

const delSelectedDevice = async () => {
    const resp = await batchDeleteDevice(_selectedRowKeys.value);
    if (resp.status === 200) {
        message.success('操作成功！');
        _selectedRowKeys.value = [];
        instanceRef.value?.reload();
    }
};

const activeSelectedDevice = async () => {
    const resp = await batchDeployDevice(_selectedRowKeys.value);
    if (resp.status === 200) {
        message.success('操作成功！');
        _selectedRowKeys.value = [];
        instanceRef.value?.reload();
    }
};

const disabledSelectedDevice = async () => {
    const resp = await batchUndeployDevice(_selectedRowKeys.value);
    if (resp.status === 200) {
        message.success('操作成功！');
        _selectedRowKeys.value = [];
        instanceRef.value?.reload();
    }
};

const saveBtn = () => {
    visible.value = false;
    instanceRef.value?.reload();
};

const handleSearch = (_params: any) => {
    params.value = _params;
};

const onRefresh = () => {
    instanceRef.value?.reload();
};
</script>
