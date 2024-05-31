<template>
    <page-container>
        <pro-search :columns="columns" type="simple" @search="onSearch" />
        <FullPage>
            <j-pro-table
                :defaultParams="defaultParams"
                :pagination="{
                    pageSizeOptions: ['10', '20', '50', '80', '100'],
                    showSizeChanger: true,
                    showQuickJumper: false,
                    size: 'size',
                }"
                :columns="columns"
                :params="params"
                ref="tableRef"
                :request="query"
            >
                <template #headerTitle>
                    <j-space>
                        <j-button type="primary" @click="handleAdd"
                            >新增</j-button
                        >
                    </j-space>
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
                                <template #icon
                                    ><AIcon
                                        style="font-size: 13px"
                                        :type="i.icon"
                                /></template>
                            </PermissionButton>
                        </template>
                    </j-space>
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
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
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
                                        <div>{{slotProps.topic}}</div>
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
            </j-pro-table>
        </FullPage>

        <!-- 新增和编辑 -->
        <Modal :loading="myModalState.modalLoad" :visible="myModalState.modalVisible" :form="form" :title="myModalState.modalTitle"
        :isAdd="isAdd" :productList="productList" @handModal="handModal" />
    </page-container>
</template>

<script lang="ts" setup>
import { useMenuStore } from 'store/menu';
import { getImage, onlyMessage } from '@/utils/comm';
import {
    addDataSand,
    editDataSand,
    deleteDataSand,
    queryDataReceiveList,
    queryNoPagingPostDevice,
    _deploy,
    filterReSandProduct,
} from '@/api/exchange/receive';
import { isTopic, queryFactoryList } from '@/api/factory/factory';
import { queryNoPagingPost } from '@/api/device/product';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import Modal from '../components/modalSend.vue';
// import { isUrl } from '@/utils/regular';
import { ActionsType } from '../typings';
import { omit, cloneDeep } from 'lodash-es';

const isAdd = ref<number>(0);
const params = ref<Record<string, any>>({});
const tableRef = ref<Record<string, any>>({});

const productList = ref<any>([]);
const SelProductList = ref<Record<string, any>[]>([]);

const deviceList = ref<Record<string, any>[]>([]);

const formRef = ref();
const data = reactive({
    form: {} as Partial<Record<string, any>>,
});

const myModalState = reactive({
    modalVisible: false,
    modalTitle: '新增',
    modalLoad: false,
})

const { form } = toRefs(data);

const menuStory = useMenuStore();
const divWidth = ref(1920)

const handleResize = () => {
      divWidth.value = window.innerWidth;
    }

const handModal = ()=>{
    myModalState.modalVisible = false
    tableRef.value?.reload();
    Init();
}

const reset = () => {
    form.value = {
        id: '',
        name: '',
        topic: undefined,
        productId: [],
        deviceIds: [],
        factoryId: undefined,
        description: '',
        type: 'sand',
        state: 'enabled',
    };
    formRef.value?.resetFields();
};

const defaultParams = ref({
    pageSize: 20,
    pageIndex: 0,
    terms: [
        {
            type: 'or',
            value: 'sand',
            termType: 'eq',
            column: 'type',
        },
    ],
});

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
    isAdd.value = 1
    myModalState.modalTitle = '新增'
    myModalState.modalVisible = true
};

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 220,
        ellipsis: true,
        search: {
            type: 'string',
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
                { label: '禁用', value: 'disabled' },
                { label: '正常', value: 'enabled' },
            ],
        },
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
        width: 270,
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
            key: 'view',
            text: '配置',
            tooltip: {
                title: '配置',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'exchange/send/Detail',
                    {
                        id: data.id,
                    },
                    {
                        id: data.id,
                        productId: JSON.stringify(data.productId),
                        ids: JSON.stringify(data.deviceIds),
                    },
                );
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
            sorts: [
                {
                    name: 'createTime',
                    order: 'desc',
                },
            ],
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

watch(
    () => form.value.productId,
    (newValue, oldValue) => {
        const setData = {
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    terms: [
                        {
                            column: 'productId',
                            termType: 'in',
                            type: 'or',
                            value: newValue,
                        },
                    ],
                },
            ],
        };
        queryNoPagingPostDevice(setData).then((resp) => {
            if (resp.status === 200) {
                deviceList.value = resp.result as Record<string, any>[];
            }
        });
    },
);

const Init = ()=>{
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

            filterReSandProduct().then((res: any) => {
                if (res.status === 200) {
                    if(res.result.length > 0){
                        SelProductList.value = res.result;
                    } else{
                        SelProductList.value = []
                    }
                }
            });
        }
    });
}

onMounted(() => {
    window.addEventListener('resize', handleResize);
    Init()
});

onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

</script>

<style lang="less" scoped></style>
