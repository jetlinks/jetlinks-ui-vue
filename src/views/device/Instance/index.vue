<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="device-instance"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="instanceRef"
                :columns="columns"
                :request="query"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }, { name: 'name', order: 'desc'}],
                }"
                :rowSelection="
                    isCheck
                        ? {
                              selectedRowKeys: _selectedRowKeys,
                              onSelect: onSelectChange,
                              onSelectAll: selectAll,
                              onSelectNone: () => (_selectedRowKeys = []),
                          }
                        : false
                "
                :params="params"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            @click="handleAdd"
                            hasPermission="device/Instance:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            新增
                        </PermissionButton>
                        <BatchDropdown
                            v-model:isCheck="isCheck"
                            :actions="batchActions"
                            @change="onCheckChange"
                        />
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
                                    getImage('/device/instance/device-card.png')
                                "
                            />
                        </template>
                        <template #content>
                            <Ellipsis
                                style="
                                    width: calc(100% - 100px);
                                    margin-bottom: 18px;
                                "
                            >
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row>
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
                <template #createTime="slotProps">
                    <span>{{
                        slotProps?.createTime
                            ? dayjs(slotProps.createTime).format(
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
                                        : 'device/Instance:' + i.key
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
    </page-container>
    <Import
        v-if="importVisible"
        @cancel="importVisible = false"
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
        :data="params"
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
    detail,
} from '@/api/device/instance';
import { getImage, LocalStore, onlyMessage } from '@/utils/comm';
import Import from './Import/modal.vue';
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
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import BatchDropdown from '@/components/BatchDropdown/index.vue';
import { BatchActionsType } from '@/components/BatchDropdown/types';
import { useRouterParams } from '@/utils/hooks/useParams';
import TagSearch from './components/TagSearch.vue';
import { Modal } from 'ant-design-vue';
import { isNoCommunity } from '@/utils/utils';

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
const isCheck = ref<boolean>(false);
const routerParams = useRouterParams();
const menuStory = useMenuStore();
const modalVisible = ref(false);
const deleteDeviceId = ref('');
const deleteState = ref(false);
const deleteTip = ref('确认删除？');
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

const columns = ref([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        search: {
            type: 'string',
            defaultTermType: 'eq',
        },
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
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
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        width: 200,
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
            // rename: 'productId$product-info',
            options: () =>
                new Promise((resolve) => {
                    queryTree({ paging: false }).then((resp: any) => {
                        resolve(transformData(resp.result));
                    });
                }),
        },
    },
    // {
    //     key: 'accessProvider',
    //     title: '网关类型',
    //     dataIndex: 'accessProvider',
    //     valueType: 'select',
    //     hideInTable: true,
    //     search: {
    //         type: 'select',
    //         // rename: 'productId$product-info',
    //         options: () =>
    //             new Promise((resolve) => {
    //                 getProviders().then((resp: any) => {
    //                     const data = resp.result || [];
    //                     resolve(
    //                         accessConfigTypeFilter(data).map((item) => ({
    //                             ...item,
    //                             value: `accessProvider is ${item.id}`,
    //                         })),
    //                     );
    //                 });
    //             }),
    //     },
    // },
    {
        key: 'accessId',
        dataIndex: 'accessId',
        title: '接入方式',
        hideInTable: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    queryGatewayList({
                        paging: false,
                        sorts: [
                            {
                                name: 'createTime',
                                order: 'desc',
                            },
                        ],
                    }).then((resp: any) => {
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
        key: 'id$dev-tag',
        dataIndex: 'id$dev-tag',
        title: '标签',
        hideInTable: true,
        search: {
            type: 'component',
            components: TagSearch,
            termOptions: ['eq', 'not'],
        },
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
])

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

const handleParams = (config: Record<string, any>) => {
    const _terms: Record<string, any> = {};
    paramsFormat(config, _terms);
    if (Object.keys(_terms).length) {
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
                    let response;
                    if (data.state.value !== 'notActive') {
                        response = await _undeploy(data.id);
                    } else {
                        response = await _deploy(data.id);
                    }
                    if (response && response.status === 200) {
                        onlyMessage('操作成功！');
                        instanceRef.value?.reload();
                    } else {
                        onlyMessage('操作失败！', 'error');
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
            onClick: async () => {
                if (deleteState.value) {
                    return;
                }
                deleteState.value = true;
                deleteDeviceId.value = data.id;
                const res = await detail(data.id).finally(() => {
                    modalVisible.value = true;
                });
                if (res.success) {
                    deleteTip.value =
                        res.result?.accessProvider === 'Ctwing'
                            ? '该操作仅可删除物联网平台数据Ctwing平台数据需另行删除'
                            : '确认删除？';
                }
                Modal.confirm({
                    title: deleteTip.value,
                    onOk() {
                        return deleteDevice();
                    },
                    onCancel() {
                        deleteState.value = false;
                    },
                });
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (type === 'card')
        return actions.filter((i: ActionsType) => i.key !== 'view');
    return actions;
};

const onSelectChange = (item: any, state: boolean) => {
    const arr = new Set(_selectedRowKeys.value);
    if (state) {
        arr.add(item.id);
    } else {
        arr.delete(item.id);
    }
    _selectedRowKeys.value = [...arr.values()];
};

const selectAll = (selected: Boolean, selectedRows: any, changeRows: any) => {
    if (selected) {
        changeRows.map((i: any) => {
            if (!_selectedRowKeys.value.includes(i.id)) {
                _selectedRowKeys.value.push(i.id);
            }
        });
    } else {
        const arr = changeRows.map((item: any) => item.id);
        const _ids: string[] = [];
        _selectedRowKeys.value.map((i: any) => {
            if (!arr.includes(i)) {
                _ids.push(i);
            }
        });
        _selectedRowKeys.value = _ids;
    }
};

const handleClick = (dt: any) => {
    if (isCheck.value) {
        if (_selectedRowKeys.value.includes(dt.id)) {
            const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
            _selectedRowKeys.value.splice(_index, 1);
        } else {
            _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
        }
    } else {
        handleView(dt.id);
    }
};

const onCheckChange = () => {
    _selectedRowKeys.value = [];
};

const handleGetParams = (p: any) => {
    p?.terms.map((a: any) => {
        return a.terms.map((b: any) => {
            if (b.column.includes('$product-info')) {
                b.column = 'productId';
                b.termType = 'product-info';
            }
            return b;
        });
    });
    return p;
};

const activeAllDevice = () => {
    type.value = 'active';
    const activeAPI = `${BASE_API_PATH}/device-instance/deploy?:X_Access_Token=${LocalStore.get(
        TOKEN_KEY,
    )}&${handleParams(handleGetParams(params.value))}`;
    api.value = activeAPI;
    operationVisible.value = true;
};

const syncDeviceStatus = () => {
    type.value = 'sync';
    const syncAPI = `${BASE_API_PATH}/device-instance/state/_sync?:X_Access_Token=${LocalStore.get(
        TOKEN_KEY,
    )}&${handleParams(params.value)}`;
    api.value = syncAPI;
    operationVisible.value = true;
};

const delSelectedDevice = () => {
    if (!_selectedRowKeys.value.length) {
        onlyMessage('请选择设备', 'error');
        return;
    }
    const response = batchDeleteDevice(_selectedRowKeys.value);
    response.then((resp) => {
        if (resp.status === 200) {
            onlyMessage('操作成功！');
            _selectedRowKeys.value = [];
            instanceRef.value?.reload();
        }
    });
    return response;
};

// const activeSelectedDevice = async () => {
//     if(!_selectedRowKeys.value.length){
//         onlyMessage('请选择设备', 'error')
//         return
//     }
//     const resp = await batchDeployDevice(_selectedRowKeys.value);
//     if (resp.status === 200) {
//         onlyMessage('操作成功！');
//         _selectedRowKeys.value = [];
//         instanceRef.value?.reload();
//     }
// };

const disabledSelectedDevice = () => {
    if (!_selectedRowKeys.value.length) {
        onlyMessage('请选择设备', 'error');
        return;
    }
    const response = batchUndeployDevice(_selectedRowKeys.value);
    response.then((resp) => {
        if (resp.status === 200) {
            onlyMessage('操作成功！');
            _selectedRowKeys.value = [];
            instanceRef.value?.reload();
        }
    });
    return response;
};

const batchActions: BatchActionsType[] = [
    {
        key: 'export',
        text: '批量导出设备',
        permission: 'device/Instance:export',
        icon: 'ExportOutlined',
        onClick: () => {
            exportVisible.value = true;
        },
    },
    {
        key: 'import',
        text: '批量导入设备',
        permission: 'device/Instance:import',
        icon: 'ImportOutlined',
        onClick: () => {
            importVisible.value = true;
        },
    },
    {
        key: 'activeAll',
        text: '启用全部设备',
        ghost: true,
        type: 'primary',
        permission: 'device/Instance:action',
        icon: 'CheckCircleOutlined',
        popConfirm: {
            title: '确认启用全部设备？',
            onConfirm: activeAllDevice,
        },
    },
    {
        key: 'sync',
        text: '同步设备状态',
        type: 'primary',
        ghost: true,
        icon: 'SyncOutlined',
        onClick: syncDeviceStatus,
    },
    {
        key: 'delete',
        text: '批量删除设备',
        danger: true,
        permission: 'device/Instance:delete',
        icon: 'DeleteOutlined',
        selected: {
            popConfirm: {
                title: '已启用的设备无法删除，确认删除选中的禁用状态设备？',
                onConfirm: delSelectedDevice,
            },
        },
    },
    // {
    //     key: 'active',
    //     text: '激活选中设备',
    //     ghost: true,
    //     type: 'primary',
    //     icon: 'CheckOutlined',
    //     permission: 'device/Instance:action',
    //     selected: {
    //         popConfirm: {
    //             title: '确认激活选中设备',
    //             onConfirm: activeSelectedDevice,
    //         },
    //     },
    // },
    {
        key: 'disable',
        text: '批量禁用设备',
        danger: true,
        icon: 'StopOutlined',
        permission: 'device/Instance:action',
        selected: {
            popConfirm: {
                title: '确认禁用选中设备?',
                onConfirm: disabledSelectedDevice,
            },
        },
    },
];

const saveBtn = () => {
    visible.value = false;
    instanceRef.value?.reload();
};

const dealSearchValue = (item: any) => {
    let value: any = '';
    item.value.forEach((i: any, index: number) => {
        if (index > 0) {
            value += ',' + i.slice((item.column + ' is ').length);
        } else {
            value +=
                item.column + ' in ' + i.slice((item.column + ' is ').length);
        }
    });
    return value;
};
const handleSearch = (_params: any) => {
    // params.value = _params;
    const newParams = (_params?.terms as any[])?.map((item1) => {
        item1.terms = item1.terms.map((item2: any) => {

            if (item2.column === 'id$dev-tag') {
              return {
                terms: item2.value,
                type: item2.type
              }
            }

            if (item2.column === 'id$dim-assets') {
                if (item2.termType === 'not') {
                    const oldValue = JSON.parse(item2.value);
                    oldValue.not = true;
                    item2.value = JSON.stringify(oldValue);
                }
                delete item2.termType;
            }

            if (
                item2.column &&
                ['classifiedId', 'accessId', 'accessProvider'].includes(
                    item2.column,
                )
            ) {
                const oldTermType = item2.termType === 'nin' ?  'not' : item2.termType;
                delete item2.termType;
                return {
                    ...item2,
                    column: `productId$product-info$${oldTermType}`,
                    value: Array.isArray(item2.value)
                        ? dealSearchValue(item2)
                        : item2.value,
                };
            }
            return item2;
        });
        return item1;
    });
    params.value = { terms: newParams || [] };
};

const onRefresh = () => {
    instanceRef.value?.reload();
};

const deleteDevice = async () => {
    const resp = await _delete(deleteDeviceId.value);
    if (resp.status === 200) {
        onlyMessage('操作成功！');
        const index = _selectedRowKeys.value.findIndex(
            (id: any) => id === deleteDeviceId.value,
        );
        if (index !== -1) {
            _selectedRowKeys.value.splice(index, 1);
        }
        instanceRef.value?.reload();
    } else {
        onlyMessage('操作失败！', 'error');
    }
    deleteState.value = false;
};

onMounted(() => {
    if (routerParams.params.value.type === 'add') {
        handleAdd();
    }
    if (routerParams.params.value.type === 'import') {
        importVisible.value = true;
    }
    if (isNoCommunity) {
        columns.value.splice(columns.value.length - 3,0,{
            dataIndex: 'id$dim-assets',
            title: '所属组织',
            hideInTable: true,
            search: {
                type: 'treeSelect',
                termOptions: ['eq'],
                options: () =>
                    new Promise((resolve) => {
                        queryOrgThree({}).then((resp: any) => {
                            const formatValue = (list: any[]) => {
                                const _list: any[] = [];
                                list.forEach((item) => {
                                    if (item.children) {
                                        item.children = formatValue(
                                            item.children,
                                        );
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
        });
    }
});
</script>
