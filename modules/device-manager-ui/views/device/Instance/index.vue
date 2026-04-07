<template>
    <j-page-container>
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
                modeValue="CARD"
            >
                <template #headerLeftRender>
                    <RegistryComponent code="addTool" is="a-space" @save="saveBtn">
                        <slot name="instanceAdd"></slot>
                        <j-permission-button
                            v-if="!slots.instanceAdd"
                            type="primary"
                            key="add"
                            @click="handleAdd"
                            hasPermission="device/Instance:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{ $t('Instance.index.133466-0') }}
                        </j-permission-button>
                        <BatchDropdown
                            key="batch"
                            v-model:isCheck="isCheck"
                            :actions="batchActions"
                            @change="onCheckChange"
                        />
                    </RegistryComponent>
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
                            <Image
                                class="card-list-img-80"
                                :src="
                                    slotProps?.photoUrl ||
                                    device.deviceCard
                                "
                            />
                        </template>
                        <template #content>
                            <j-ellipsis
                                style="
                                    width: calc(100% - 100px);
                                    margin-bottom: 18px;
                                "
                            >
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </j-ellipsis>
                            <a-row>
                                <a-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Instance.index.133466-1') }}
                                    </div>
                                    <div>{{ slotProps.deviceType?.text }}</div>
                                </a-col>
                                <a-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Instance.index.133466-2') }}
                                    </div>
                                    <j-ellipsis style="width: 100%">
                                        {{ slotProps.productName }}
                                    </j-ellipsis>
                                </a-col>
                            </a-row>
                        </template>
                        <template #actions="item">
                            <j-permission-button
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
                            </j-permission-button>
                        </template>
                    </CardBox>
                </template>
                <template #state="slotProps">
                    <j-badge-status
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
                    <a-space :size="16">
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <j-permission-button
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
                            </j-permission-button>
                        </template>
                    </a-space>
                </template>
            </JProTable>
        </FullPage>
    </j-page-container>
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
    batchDeleteDevice,
    detail,
} from '../../../api/instance';
import { getToken, onlyMessage } from '@jetlinks-web/utils'
import Import from './Import/modal.vue';
import Export from './Export/index.vue';
import Process from './Process/index.vue';
import Save from './Save/index.vue';
import { BASE_API, TOKEN_KEY_URL } from '@jetlinks-web/constants'
import {
    queryGatewayList,
    queryNoPagingPost,
    queryOrgThree,
} from '../../../api/product';
import { queryTree } from '../../../api/category';
import { useMenuStore } from '@jetlinks-web-core/store/menu';
import type { ActionsType } from './typings';
import dayjs from 'dayjs';
import BatchDropdown from '@jetlinks-web-core/components/BatchDropdown/index.vue';
import type { BatchActionsType } from '@jetlinks-web-core/components/BatchDropdown/types';
import { useRouterParams } from '@jetlinks-web/hooks';
import TagSearch from './components/TagSearch.vue';
import { Modal } from 'ant-design-vue';
import { device } from '../../../assets';
import { isNoCommunity } from '@jetlinks-web-core/utils/utils';
import { useI18n } from 'vue-i18n';
import { useTermOptions } from '@jetlinks-web/components/es/Search/hooks/useTermOptions'
import { mergeObjectArrays, getBaseApi } from '@jetlinks-web-core/utils';
import {deviceStateList} from "@device-manager-ui/views/device/data";
import {isSass} from '@jetlinks-web-core/utils/consts'

const { t: $t } = useI18n();

const slots = useSlots();
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
const deleteTip = ref($t('Instance.index.133466-3'));
const transformData = (arr: any[]): any[] => {
    if (Array.isArray(arr) && arr.length) {
        return (arr || []).map((item: any) => {
            return {
                ...item,
                id: item.id,
                children: transformData(item.children),
            };
        });
    } else {
        return [];
    }
};

const { termOptions } = useTermOptions({ pick: ['eq']})

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
        title: $t('Instance.index.133466-4'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Instance.index.133466-2'),
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
        title: $t('Instance.index.133466-5'),
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('Instance.index.133466-6'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: deviceStateList,
        },
    },
    {
        key: 'classifiedId',
        dataIndex: 'classifiedId',
        title: $t('Instance.index.133466-10'),
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
        title: $t('Instance.index.133466-11'),
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
                                value: item.id // `accessId is ${item.id}`,
                            })),
                        );
                    });
                }),
        },
    },
    {
        dataIndex: 'deviceType',
        title: $t('Instance.index.133466-1'),
        valueType: 'select',
        hideInTable: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Instance.index.133466-12'), value: 'device' },
                { label: $t('Instance.index.133466-13'), value: 'childrenDevice' },
                { label: $t('Instance.index.133466-14'), value: 'gateway' },
            ],
        },
    },
    // {
    //     key: 'id$tag',
    //     dataIndex: 'id$tag',
    //     title: $t('Instance.index.133466-17'),
    //     hideInTable: true,
    //     search: {
    //         type: 'component',
    //         components: TagSearch,
    //         termOptions: ['eq', 'not'],
    //     },
    // },
    {
        key: 'id$dev-tag',
        dataIndex: 'id$dev-tag',
        title: $t('Instance.index.133466-15'),
        hideInTable: true,
        search: {
            type: 'component',
            components: TagSearch,
            componentProps: {
                data: params.value,
            },
            defaultTermType: 'eq',
            termOptions: termOptions,
        },
    },
    {
        title: $t('Instance.index.133466-18'),
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Instance.index.133466-19'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
]);

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
            console.log(_terms[key]);
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
    menuStory.jumpPage('device/Instance/Detail', { params: { id } });
};

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    const parentGetActions = inject('getActions', {}).getActions;
    const parentActions = parentGetActions?.(data) || []
    if (!data) return [];
    let actions = [
        {
            key: 'view',
            text: $t('Instance.index.133466-20'),
            tooltip: {
                title: $t('Instance.index.133466-20'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id);
            },
        },
        {
            key: 'update',
            text: $t('Instance.index.133466-21'),
            tooltip: {
                title: $t('Instance.index.133466-21'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                visible.value = true;
                current.value = data;
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'notActive' ? $t('Instance.index.133466-7') : $t('Instance.index.133466-22'),
            tooltip: {
                title: data.state?.value !== 'notActive' ? $t('Instance.index.133466-7') : $t('Instance.index.133466-22'),
            },
            icon:
                data.state.value !== 'notActive'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',

            popConfirm: {
                title: `${$t('Instance.index.133466-23', [data.state.value !== 'notActive' ? $t('Instance.index.133466-7') : $t('Instance.index.133466-22')])}`,
                onConfirm: async () => {
                    let response;
                    if (data.state.value !== 'notActive') {
                        response = await _undeploy(data.id);
                    } else {
                        response = await _deploy(data.id);
                    }
                    if (response && response.status === 200) {
                        onlyMessage($t('Instance.index.133466-24'));
                        instanceRef.value?.reload();
                    } else {
                        onlyMessage($t('Instance.index.133466-25'), 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: $t('Instance.index.133466-26'),
            disabled: data.state?.value !== 'notActive',
            tooltip: {
                title:
                    data.state.value !== 'notActive'
                        ? $t('Instance.index.133466-27')
                        : $t('Instance.index.133466-26'),
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
                            ? $t('Instance.index.133466-28')
                            : $t('Instance.index.133466-3');
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
    if (parentActions && parentActions.length > 0) {
        actions = mergeObjectArrays(actions, parentActions);
    }
    if (type === 'card')
        return actions.filter((i: ActionsType) => i.key !== 'view');
    return actions;
};

const onSelectChange = (item: any, state: boolean) => {
    const arr = new Set(_selectedRowKeys.value);
    // console.log(item, state);
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
    let activeAPI = `${getBaseApi()}/device-instance/deploy?${TOKEN_KEY_URL}=${getToken()}`;
    if (params.value?.terms) {
      activeAPI += `&${handleParams(handleGetParams(params.value))}`;
    }
    api.value = activeAPI;
    operationVisible.value = true;
};

const syncDeviceStatus = () => {
    type.value = 'sync';
    let syncAPI = `${getBaseApi()}/device-instance/state/_sync?${TOKEN_KEY_URL}=${getToken()}`;
    if (params.value) {
      syncAPI += `&${handleParams(params.value)}`;
    }
    api.value = syncAPI;
    operationVisible.value = true;
};

const delSelectedDevice = () => {
    if (!_selectedRowKeys.value.length) {
        onlyMessage($t('Instance.index.133466-29'), 'error');
        return;
    }
    const response = batchDeleteDevice(_selectedRowKeys.value);
    response.then((resp) => {
        if (resp.status === 200) {
            onlyMessage($t('Instance.index.133466-24'));
            _selectedRowKeys.value = [];
            instanceRef.value?.reload();
        }
    });
    return response;
};

// const activeSelectedDevice = async () => {
//     if(!_selectedRowKeys.value.length){
//         onlyMessage($t('Instance.index.133466-29'), 'error')
//         return
//     }
//     const resp = await batchDeployDevice(_selectedRowKeys.value);
//     if (resp.status === 200) {
//         onlyMessage($t('Instance.index.133466-24'));
//         _selectedRowKeys.value = [];
//         instanceRef.value?.reload();
//     }
// };

const disabledSelectedDevice = () => {
    if (!_selectedRowKeys.value.length) {
        onlyMessage($t('Instance.index.133466-29'), 'error');
        return;
    }
    const response = batchUndeployDevice(_selectedRowKeys.value);
    response.then((resp) => {
        if (resp.status === 200) {
            onlyMessage($t('Instance.index.133466-24'));
            _selectedRowKeys.value = [];
            instanceRef.value?.reload();
        }
    });
    return response;
};

const batchActions = computed((): BatchActionsType[] => {
    let actions = [
        {
            key: 'export',
            text: $t('Instance.index.133466-30'),
            permission: 'device/Instance:export',
            icon: 'ExportOutlined',
            onClick: () => {
                exportVisible.value = true;
            },
        },
        {
            key: 'activeAll',
            text: $t('Instance.index.133466-32'),
            ghost: true,
            type: 'primary',
            permission: 'device/Instance:action',
            icon: 'CheckCircleOutlined',
            popConfirm: {
                title: $t('Instance.index.133466-33'),
                onConfirm: activeAllDevice,
            },
        },
        {
            key: 'sync',
            text: $t('Instance.index.133466-34'),
            type: 'primary',
            ghost: true,
            icon: 'SyncOutlined',
            onClick: syncDeviceStatus,
        },
        {
            key: 'delete',
            text: $t('Instance.index.133466-35'),
            danger: true,
            permission: 'device/Instance:delete',
            icon: 'DeleteOutlined',
            selected: {
                popConfirm: {
                    title: $t('Instance.index.133466-36'),
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
            text: $t('Instance.index.133466-37'),
            danger: true,
            icon: 'StopOutlined',
            permission: 'device/Instance:action',
            selected: {
                popConfirm: {
                    title: $t('Instance.index.133466-38'),
                    onConfirm: disabledSelectedDevice,
                },
            },
        },
    ]
    if(!isSass){
      actions.unshift({
        key: 'import',
        text: $t('Instance.index.133466-31'),
        permission: 'device/Instance:import',
        icon: 'ImportOutlined',
        onClick: () => {
          importVisible.value = true;
        },
      })
    }
    const parentActions = inject('getActions', {}).batchActions
    if(parentActions && parentActions.length > 0) {
        actions = mergeObjectArrays(actions, parentActions)
    }
    return actions
});

const saveBtn = () => {
    visible.value = false;
    instanceRef.value?.reload();
};

const dealSearchValue = (item: any) => {
    return [{
      column: item.column,
      termType: 'in',
      value: item.value
    }];
};
const handleSearch = (_params: any) => {
    // params.value = _params;
    const newParams = (_params?.terms as any[])?.map((item1) => {
        item1.terms = item1.terms.map((item2: any) => {
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
                // const oldTermType = item2.termType;
                // delete item2.termType;
                return {
                    type: item2.type,
                    column: `productId$product-info`, //$${oldTermType}
                    value: [{
                      column: item2.column,
                      termType: item2.termType,
                      value: item2.value
                    }]
                    // value: Array.isArray(item2.value)
                    //     ? dealSearchValue(item2)
                    //     : item2.value,
                };
            }
            if(item2.column === 'id$dev-tag') {
                item2 = {
                    terms: [
                        ...item2.value.map(i => i)
                    ]
                }
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
        onlyMessage($t('Instance.index.133466-24'));
        const index = _selectedRowKeys.value.findIndex(
            (id: any) => id === deleteDeviceId.value,
        );
        if (index !== -1) {
            _selectedRowKeys.value.splice(index, 1);
        }
        instanceRef.value?.reload();
    } else {
        onlyMessage($t('Instance.index.133466-25'), 'error');
    }
    deleteState.value = false;
};

onMounted(() => {
    if (routerParams.params.value?.type === 'add') {
        handleAdd();
    }
    if (routerParams.params.value?.type === 'import') {
        importVisible.value = true;
    }
    if (isNoCommunity) {
        columns.value.splice(columns.value.length - 3,0,{
            dataIndex: 'id$dim-assets',
            title: $t('Instance.index.133466-16'),
            hideInTable: true,
            search: {
                type: 'treeSelect',
                termOptions: termOptions,
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

defineExpose({
    reload: () => instanceRef.value?.reload(),
    activeAllDevice,
    disabledSelectedDevice
})
</script>
