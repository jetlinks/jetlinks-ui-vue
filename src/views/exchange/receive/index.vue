<template>
    <page-container>
        <pro-search :columns="columns" type="simple" @search="onSearch" />
        <FullPage>
            <JProTable
                :defaultParams="defaultParams"
                :pagination="{
                    pageSizeOptions: ['10', '20', '50', '80', '100'],
                    showSizeChanger: true,
                    showQuickJumper: false,
                    size: 'size',
                }"
                :columns="columnsList"
                :params="params"
                ref="tableRef"
                :request="query"
                :row-selection="{
                    selectedRowKeys: selectedRowKeys,
                    onSelect: onSelectChange,
                    onSelectAll: onSelectAll,
                    onSelectNone: () => (selectedRowKeys = []),
                }"
            >
                <template #headerTitle>
                    <j-space>
                        <j-button type="primary" @click="handleAdd"
                            >新增</j-button
                        >
                        <j-space>
                            <PermissionButton
                                :popConfirm="{
                                    title: '确认导出吗',
                                    onConfirm: () => handleExport(),
                                }"
                            >
                                导出
                            </PermissionButton>
                        </j-space>
                    </j-space>
                </template>
                <template #factoryId="slotProps">
                    <div>
                        <j-ellipsis>{{
                            funGetFactory(slotProps.factoryId)
                        }}</j-ellipsis>
                    </div>
                </template>
                <template #state="slotProps">
                    <BadgeStatus
                        :status="slotProps.state?.value"
                        :text="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'warning',
                        }"
                    />
                </template>
                <template #actions="slotProps">
                    <j-space>
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                :disabled="i.disabled"
                                :popConfirm="i.popConfirm"
                                :hasPermission="
                                    i.key === 'view'
                                        ? true
                                        : 'device/Product:' + i.key
                                "
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                :danger="i.key === 'delete'"
                            >
                                <template #icon>
                                    <AIcon
                                        style="font-size: 13px"
                                        :type="i.icon"
                                    />
                                </template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        @click="handleClick"
                        :active="selectedRowKeys.includes(slotProps.id)"
                        :showStatus="true"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'warning',
                        }"
                    >
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row>
                                <j-col :span="8">
                                    <div class="card-item-content-text">
                                        Topic
                                    </div>
                                    <j-ellipsis
                                        style="width: calc(100% - 10px)"
                                    >
                                        <div>{{ slotProps.topic }}</div>
                                    </j-ellipsis>
                                </j-col>
                                <j-col :span="8">
                                    <div class="card-item-content-text">
                                        说明
                                    </div>
                                    <j-ellipsis
                                        style="width: calc(100% - 10px)"
                                    >
                                        <div>{{ slotProps.description }}</div>
                                    </j-ellipsis>
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
            </JProTable>
        </FullPage>

        <!-- 新增和编辑 -->
        <Modal
            :loading="myModalState.modalLoad"
            :visible="myModalState.modalVisible"
            :form="form"
            :title="myModalState.modalTitle"
            :factoryList="factoryList"
            :isAdd="isAdd"
            :productList="productList"
            @handModal="handModal"
        />
    </page-container>
</template>

<script lang="ts" setup>
import { getImage, onlyMessage } from '@/utils/comm';
import {
    addDataSand,
    editDataSand,
    deleteDataSand,
    queryDataReceiveList,
    queryNoPagingPostDevice,
    queryDeviceProductList,
    _deploy,
    filterReSandProduct,
} from '@/api/exchange/receive';
import { isTopic, queryFactoryList } from '@/api/factory/factory';
import { queryNoPagingPost } from '@/api/device/product';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { isNoCommunity, downloadObject } from '@/utils/utils';
import { ActionsType } from '../typings';
import { omit, cloneDeep } from 'lodash-es';
import Modal from '../components/modalReceive.vue';

const isAdd = ref<number>(0);
const params = ref<Record<string, any>>({});
const tableRef = ref<Record<string, any>>({});

const productList = ref<any>([]);

const factoryList = ref<Record<string, any>[]>([]);

const selectedRowKeys = ref<string[]>([]);
const selectedRow = ref<string[]>([]);

const formRef = ref();
const data = reactive({
    form: {} as Partial<Record<string, any>>,
});

const { form } = toRefs(data);

const handModal = () => {
    myModalState.modalVisible = false;
    tableRef.value?.reload();
    Init();
};

const defaultParams = ref({
    pageSize: 20,
    pageIndex: 0,
    terms: [
        {
            type: 'or',
            value: 'receive',
            termType: 'eq',
            column: 'type',
        },
    ],
    sorts: [{ name: 'createTime', order: 'desc' }],
});

const myModalState = reactive({
    modalVisible: false,
    modalTitle: '新增',
    modalLoad: false,
});

const hasSelected = computed(() => selectedRowKeys.value.length > 0);

const handleClick = (dt: any) => {
    if (selectedRowKeys.value.includes(dt.id)) {
        const _index = selectedRowKeys.value.findIndex((i: any) => i === dt.id);
        selectedRowKeys.value.splice(_index, 1);
        selectedRow.value.splice(_index, 1);
    } else {
        selectedRowKeys.value = [...selectedRowKeys.value, dt.id];
        selectedRow.value = [...selectedRow.value, dt];
    }
};

const onSelectChange = (_selectedRowKeys: any, state: boolean) => {
    const arr = new Set(selectedRowKeys.value);
    const arr1 = new Set(selectedRow.value);
    if (state) {
        arr.add(_selectedRowKeys.id);
        arr1.add(_selectedRowKeys);
    } else {
        arr.delete(_selectedRowKeys.id);
        arr1.delete(_selectedRowKeys);
    }
    selectedRowKeys.value = [...arr.values()];
    selectedRow.value = [...arr1.values()];
};

const onSelectAll = (selected: boolean, selectedRows: any, changeRows: any) => {
    if (!selected) {
        selectedRowKeys.value = [];
        selectedRow.value = [];
    } else {
        selectedRow.value = selectedRows;
        const arr = selectedRows.map((item: any) => item.id);
        selectedRowKeys.value = arr;
    }
};

const reset = () => {
    form.value = {
        id: '',
        name: '',
        topic: '',
        productId: [],
        deviceIds: [],
        factoryId: undefined,
        description: '',
        type: 'receive',
        state: 'enabled',
    };
};

// 搜索
const onSearch = (e: any) => {
    const newTerms = cloneDeep(e);
    if (newTerms.terms?.length) {
        newTerms.terms.forEach((a: any) => {
            a.terms = a.terms.map((b: any) => {
                if (b.column === 'type') {
                    const value = b.value;
                    b = {
                        type: 'or',
                        value: `${value}`,
                        termType: 'eq',
                        column: 'type',
                    };
                }
                return b;
            });
        });
    }
    params.value = newTerms;
};

//新增
const handleAdd = () => {
    reset();
    isAdd.value = 1;
    myModalState.modalTitle = '新增';
    myModalState.modalVisible = true;
};

const handleExport = () => {
    let myArr = selectedRow.value.map((item: any) => ({
        productId: item.productId,
        deviceIds: item.deviceIds,
        name: item.name,
    }));
    if (myArr.length === 1) {
        const query = {
            ids: myArr[0].deviceIds,
            queryParam: {
                terms: [
                    {
                        terms: [
                            {
                                column: 'id',
                                termType: 'in',
                                type: 'or',
                                value: myArr[0].productId,
                            },
                        ],
                    },
                ],
            },
        };
        console.log('query', query);
        queryDeviceProductList(query).then((res: any) => {
            const { result } = res;
            if (result) {
                const extra = omit(JSON.parse(JSON.stringify(result)), [
                    'transportProtocol',
                    'protocolName',
                    'accessId',
                    'accessName',
                    'accessProvider',
                    'messageProtocol',
                ]);
                downloadObject(extra, `导出信息-${myArr[0].name}`);
            }
        });
    } else if (myArr.length > 1) {
        console.log('myArr', myArr);
        myArr.forEach((element) => {
            const query = {
                ids: element.deviceIds,
                queryParam: {
                    terms: [
                        {
                            terms: [
                                {
                                    column: 'id',
                                    termType: 'in',
                                    type: 'or',
                                    value: element.productId,
                                },
                            ],
                        },
                    ],
                },
            };
            queryDeviceProductList(query).then((res: any) => {
                const { result } = res;
                if (result) {
                    const extra = omit(JSON.parse(JSON.stringify(result)), [
                        'transportProtocol',
                        'protocolName',
                        'accessId',
                        'accessName',
                        'accessProvider',
                        'messageProtocol',
                    ]);
                    downloadObject(extra, `导出信息-${element.name}`);
                }
            });
        });
    } else {
        onlyMessage('请先选择需要导出数据', 'error');
    }
};

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: 'Topic',
        dataIndex: 'topic',
        key: 'topic',
        search: {
            type: 'string',
        },
    },
    {
        title: '所属工厂',
        dataIndex: 'factoryId',
        key: 'factoryId',
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    queryFactoryList({
                        paging: false,
                        sorts: [
                            {
                                name: 'createTime',
                                order: 'desc',
                            },
                        ],
                        terms: [],
                    }).then((response: any) => {
                        resolve(
                            response.result.data.map((item: any) => ({
                                label: item.name,
                                value: item.id,
                            })),
                        );
                    });
                }),
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'disabled' },
                { label: '正常', value: 'enabled' },
            ],
        },
    },
];

const columnsList = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 220,
        ellipsis: true,
    },
    {
        title: 'Topic',
        dataIndex: 'topic',
        key: 'topic',
        ellipsis: true,
    },
    {
        title: '所属工厂',
        dataIndex: 'factoryId',
        key: 'factoryId',
        width: 200,
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        width: 150,
        key: 'state',
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        width: 220,
        scopedSlots: true,
    },
];

const funGetFactory = (id: string) => {
    const foundObject: any = factoryList.value.find(
        (item: any) => item.id === id,
    );
    return foundObject ? foundObject.name : '';
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
                isAdd.value = 2;
                myModalState.modalTitle = '编辑';
                myModalState.modalVisible = true;
                form.value = data;
            },
        },
        {
            key: 'action',
            text: data.state.value === 'enabled' ? '禁用' : '启用',
            tooltip: {
                title: data.state.value === 'enabled' ? '禁用' : '启用',
            },
            icon:
                data.state.value === 'enabled'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${
                    data.state.value === 'enabled' ? '禁用' : '启用'
                }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state.value === 'enabled') {
                        response = await _deploy(data.id, {
                            state: 'disabled',
                        });
                    } else {
                        response = await _deploy(data.id, { state: 'enabled' });
                    }
                    if (response && response.status === 200) {
                        onlyMessage('操作成功！');
                        tableRef.value?.reload();
                    } else {
                        onlyMessage('操作失败！', 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            disabled: data.state.value === 'enabled',
            tooltip: {
                title:
                    data.state.value === 'enabled'
                        ? '已启用的数据不能删除'
                        : '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    deleteDataSand(data.id).then((response: any) => {
                        if (response.status === 200) {
                            onlyMessage('删除成功！');
                            tableRef.value?.reload();
                            Init();
                        } else {
                            onlyMessage('操作失败！', 'error');
                        }
                    });
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const query = (params: Record<string, any>) =>
    new Promise((resolve) => {
        queryDataReceiveList({
            pageIndex: params.pageIndex + 1,
            pageSize: params.pageSize,
            sorts: params.sorts,
            terms: params.terms,
        })
            .then((response: any) => {
                resolve({
                    result: {
                        data: response.result?.data,
                        pageIndex: params.pageIndex || 0,
                        pageSize: params.pageSize || 20,
                        total: response.result?.total,
                    },
                    status: response.status,
                });
            })
            .catch((error: any) => {
                console.log(error);
            });
    });

const Init = () => {
    queryNoPagingPost({
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            {
                terms: [
                    {
                        termType: 'eq',
                        column: 'state',
                        value: 1,
                    },
                ],
            },
        ],
    }).then((resp: any) => {
        if (resp.status === 200) {
            productList.value = resp.result;
        }
    });

    queryFactoryList({
        paging: false,
        sorts: [
            {
                name: 'createTime',
                order: 'desc',
            },
        ],
        terms: [],
    }).then((response: any) => {
        if (response.status === 200) {
            factoryList.value = response.result.data;
        }
    });
};

const divWidth = ref(1920);
const handleResize = () => {
    divWidth.value = window.innerWidth;
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
    Init();
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<style lang="less" scoped>
.modal-all {
    width: 100%;
    display: flex;
    flex-direction: row;

    .modal-left {
        width: 30%;
        height: 380px;
    }

    .modal-right {
        width: 68%;
        height: 380px;
        margin-left: 20px;
    }
}

.modal-span {
    font-size: 16px;
}
</style>
