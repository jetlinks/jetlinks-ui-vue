<template>
    <page-container>
        <pro-search
            :columns="query.columns"
            target="product-manage"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                :columns="columns"
                :request="queryProductList"
                ref="tableRef"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            @click="add"
                            hasPermission="device/Product:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{ $t('Product.index.0645615-0') }}
                        </PermissionButton>
                        <j-upload
                            name="file"
                            accept=".json"
                            :showUploadList="false"
                            :before-upload="beforeUpload"
                            :disabled="!permission"
                        >
                            <PermissionButton
                                hasPermission="device/Product:import"
                                >{{ $t('Product.index.0645615-1') }}</PermissionButton
                            >
                        </j-upload>
                    </j-space>
                </template>
                <template #deviceType="slotProps">
                    <div>{{ slotProps.deviceType.text }}</div>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :active="_selectedRowKeys.includes(slotProps.id)"
                        :status="slotProps.state"
                        @click="handleView(slotProps.id)"
                        :statusText="slotProps.state === 1 ? $t('Product.index.0645615-2') : $t('Product.index.0645615-3')"
                        :statusNames="{
                            1: 'processing',
                            0: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img
                                    :src="
                                        slotProps.photoUrl ||
                                        getImage('/device-product.png')
                                    "
                                    class="productImg"
                                />
                            </slot>
                        </template>
                        <template #content>
                            <Ellipsis
                                style="
                                    width: calc(100% - 100px);
                                    margin-bottom: 18px;
                                "
                                ><span
                                    style="font-weight: 600; font-size: 16px"
                                >
                                    {{ slotProps.name }}
                                </span></Ellipsis
                            >
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Product.index.0645615-4') }}
                                    </div>
                                    <div>{{ slotProps?.deviceType?.text }}</div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Product.index.0645615-5') }}
                                    </div>
                                    <Ellipsis
                                        ><div>
                                            {{
                                                slotProps?.accessName
                                                    ? slotProps?.accessName
                                                    : $t('Product.index.0645615-6')
                                            }}
                                        </div></Ellipsis
                                    >
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
                                    item.key === 'view'
                                        ? true
                                        : 'device/Product:' + item.key
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
                <template #state="slotProps">
                    <BadgeStatus
                        :text="slotProps.state === 1 ? $t('Product.index.0645615-2') : $t('Product.index.0645615-3')"
                        :status="slotProps.state"
                        :statusNames="{
                            1: 'processing',
                            0: 'error',
                        }"
                    />
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
                                style="padding: 0px"
                                :danger="i.key === 'delete'"
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
        <!-- {{ $t('Product.index.0645615-0') }}、{{ $t('Product.index.0645615-12') }} -->
        <Save ref="saveRef" :isAdd="isAdd" :title="title" @success="refresh" />
    </page-container>
</template>

<script setup lang="ts">
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage, onlyMessage } from '@/utils/comm';
import {
    getProviders,
    category,
    queryOrgThree,
    queryGatewayList,
    queryProductList,
    _deploy,
    _undeploy,
    deleteProduct,
    updateDevice,
} from '@/api/device/product';
import {  downloadObject } from '@/utils/utils';
import { omit, cloneDeep } from 'lodash-es';
import Save from './Save/index.vue';
import { useMenuStore } from 'store/menu';
import { useRouterParams } from '@/utils/hooks/useParams';
import { accessConfigTypeFilter } from '@/utils/setting';
import { usePermissionStore } from '@/store/permission';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
/**
 * 表格数据
 */
const menuStory = useMenuStore();
const isAdd = ref<number>(0);
const title = ref<string>('');
const params = ref<Record<string, any>>({});
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true,
        width: 200,
        ellipsis: true,
    },
    {
        title: $t('Product.index.0645615-7'),
        dataIndex: 'name',
        key: 'name',
        width: 220,
        ellipsis: true,
    },
    {
        title: $t('Product.index.0645615-5'),
        dataIndex: 'accessName',
        key: 'accessName',
        width: 220,
        ellipsis: true,
    },
    {
        title: $t('Product.index.0645615-4'),
        dataIndex: 'deviceType',
        key: 'deviceType',
        scopedSlots: true,
        ellipsis: true,
        width: 120,
    },
    {
        title: $t('Product.index.0645615-8'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        ellipsis: true,
        width: 90,
    },
    {
        title: $t('Product.index.0645615-9'),
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
    },
    {
        title: $t('Product.index.0645615-10'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
        ellipsis: true,
    },
];
const permission = usePermissionStore().hasPermission(`device/Product:import`);
const _selectedRowKeys = ref<string[]>([]);
const currentForm = ref({});

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) {
        return [];
    }
    const actions = [
        {
            key: 'view',
            text: $t('Product.index.0645615-11'),
            tooltip: {
                title: $t('Product.index.0645615-11'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id);
            },
        },
        {
            key: 'update',
            text: $t('Product.index.0645615-12'),
            tooltip: {
                title: $t('Product.index.0645615-12'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                title.value = $t('Product.index.0645615-12');
                isAdd.value = 2;
                nextTick(() => {
                    saveRef.value.show(data);
                });
            },
        },
        {
            key: 'export',
            text: $t('Product.index.0645615-13'),
            tooltip: {
                title: $t('Product.index.0645615-13'),
            },

            icon: 'icon-xiazai',
            onClick: () => {
                console.log(data);
                const extra = omit(data, [
                    'transportProtocol',
                    'protocolName',
                    'accessId',
                    'accessName',
                    'accessProvider',
                    'messageProtocol',
                ]);
                downloadObject(extra, data.name + $t('Product.index.0645615-14'));
            },
        },
        {
            key: 'action',
            text: data.state !== 0 ? $t('Product.index.0645615-34') : $t('Product.index.0645615-15'),
            tooltip: {
                title: data.state !== 0 ? $t('Product.index.0645615-34') : $t('Product.index.0645615-15'),
            },
            icon: data.state !== 0 ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `${data.state !== 0 ? $t('Product.index.0645615-16') : $t('Product.index.0645615-35')}?`,
                onConfirm: () => {
                    let response = undefined;
                    if (data.state !== 0) {
                        response = _undeploy(data.id);
                    } else {
                        response = _deploy(data.id);
                    }
                    response.then((res) => {
                        if (res && res.status === 200) {
                            onlyMessage($t('Product.index.0645615-17'));
                            tableRef.value?.reload();
                        } else {
                            onlyMessage($t('Product.index.0645615-18'), 'error');
                        }
                    });
                    return response;
                },
            },
        },
        {
            key: 'delete',
            text: $t('Product.index.0645615-19'),
            disabled: data.state !== 0,
            tooltip: {
                title: data.state !== 0 ? $t('Product.index.0645615-20') : $t('Product.index.0645615-19'),
            },
            popConfirm: {
                title: $t('Product.index.0645615-21'),
                onConfirm: () => {
                    const response = deleteProduct(data.id);
                    response.then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage($t('Product.index.0645615-17'));
                            tableRef.value?.reload();
                        } else {
                            onlyMessage($t('Product.index.0645615-18'), 'error');
                        }
                    });
                    return response;
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (type === 'card')
        return actions.filter((i: ActionsType) => i.key !== 'view');
    return actions;
};

/**
 * 新增
 */
const add = () => {
    isAdd.value = 1;
    title.value = $t('Product.index.0645615-0');
    nextTick(() => {
        saveRef.value.show(currentForm.value);
    });
};

/**
 * 导入
 */
const beforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (result) => {
        const text = result.target?.result;
        console.log(text);
        if (!file.type.includes('json')) {
            onlyMessage($t('Product.index.0645615-22'), 'error');
            return false;
        }
        if (!text) {
            onlyMessage($t('Product.index.0645615-23'), 'error');
            return false;
        }
        const data = JSON.parse(text);
        // 设置导入的产品状态为未发布
        data.state = 0;
        if (Array.isArray(data)) {
            onlyMessage($t('Product.index.0645615-24'), 'error');
            return false;
        }
        delete data.state;
        if (!data?.name) {
            data.name = $t('Product.index.0645615-14') + Date.now();
        }
        if (!data?.deviceType || JSON.stringify(data?.deviceType) === '{}') {
            onlyMessage($t('Product.index.0645615-25'), 'error');
            return false;
        }
        const res = await updateDevice(data);
        if (res.status === 200) {
            onlyMessage($t('Product.index.0645615-26'));
            tableRef.value?.reload();
        }
        return true;
    };
    return false;
};
/**
 * 查看
 */
const handleView = (id: string) => {
    menuStory.jumpPage('device/Product/Detail', { id });
};

/**
 * 刷新数据
 */
const refresh = () => {
    tableRef.value?.reload();
};
// 筛选
const listData = ref([]);
const typeList = ref([]);
const tableRef = ref<Record<string, any>>({});
const query = reactive({
    columns: [
        {
            title: $t('Product.index.0645615-27'),
            dataIndex: 'name',
            key: 'name',
            search: {
                first: true,
                type: 'string',
            },
        },
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
            title: $t('Product.index.0645615-28'),
            key: 'accessProvider',
            dataIndex: 'accessProvider',
            search: {
                type: 'select',
                options: async () => {
                    return new Promise((resolve) => {
                        getProviders().then((resp: any) => {
                            const data = resp.result || [];
                            resolve(
                                accessConfigTypeFilter(data).filter(
                                    (i: any) => {
                                        return (
                                            i.id !== 'modbus-tcp' &&
                                            i.id !== 'opc-ua'
                                        );
                                    },
                                ),
                            );
                        });
                    });
                },
            },
        },
        {
            title: $t('Product.index.0645615-5'),
            key: 'accessId',
            dataIndex: 'accessId',
            search: {
                type: 'select',
                options: async () => {
                    return new Promise((res) => {
                        queryGatewayList({
                            paging: false,
                        }).then((resp: any) => {
                            typeList.value = [];
                            typeList.value = resp.result.map((item: any) => ({
                                label: item.name,
                                value: item.id,
                            }));
                            res(typeList.value);
                        });
                    });
                },
            },
        },
        {
            title: $t('Product.index.0645615-4'),
            key: 'deviceType',
            dataIndex: 'deviceType',
            search: {
                type: 'select',
                options: [
                    {
                        label: $t('Product.index.0645615-29'),
                        value: 'device',
                    },
                    {
                        label: $t('Product.index.0645615-30'),
                        value: 'childrenDevice',
                    },
                    {
                        label: $t('Product.index.0645615-31'),
                        value: 'gateway',
                    },
                ],
            },
        },
        {
            title: $t('Product.index.0645615-8'),
            key: 'state',
            dataIndex: 'state',
            search: {
                type: 'select',
                options: [
                    {
                        label: $t('Product.index.0645615-2'),
                        value: 1,
                    },
                    {
                        label: $t('Product.index.0645615-3'),
                        value: 0,
                    },
                ],
            },
        },
        {
            title: $t('Product.index.0645615-9'),
            key: 'describe',
            dataIndex: 'describe',
            search: {
                type: 'string',
            },
        },
        {
            title: $t('Product.index.0645615-32'),
            key: 'classified',
            dataIndex: 'classifiedId',
            search: {
                type: 'treeSelect',
                options: async () => {
                    return new Promise((res) => {
                        category({
                            paging: false,
                        }).then((resp) => {
                            res(resp.result);
                        });
                    });
                },
            },
        },
        {
            title: $t('Product.index.0645615-33'),
            key: 'id$dim-assets',
            dataIndex: 'id$dim-assets',
            search: {
                first: true,
                type: 'treeSelect',
                termOptions: ['eq'],
                options: async () => {
                    return new Promise((res) => {
                        queryOrgThree({ paging: false }).then((resp: any) => {
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
                                        value: JSON.stringify({
                                            assetType: 'product',
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
                            res(formatValue(resp.result));
                        });
                    });
                },
            },
        },
        {
            title: $t('Product.index.0645615-10'),
            key: 'action',
            fixed: 'right',
            width: 250,
            scopedSlots: true,
        },
    ],
});
const saveRef = ref();
const handleSearch = (e: any) => {
    const newTerms = cloneDeep(e);
    if (newTerms.terms?.length) {
        newTerms.terms.forEach((a: any) => {
            a.terms = a.terms.map((b: any) => {
                if (b.column === 'id$dim-assets') {
                    const value = b.value;
                    b = {
                        column: 'id',
                        termType: 'dim-assets',
                        value: {
                            assetType: 'product',
                            targets: [
                                {
                                    type: 'org',
                                    id: value,
                                },
                            ],
                        },
                    };
                }
                if (b.column === 'accessProvider') {
                    if (b.value === 'collector-gateway') {
                        b.termType = b.termType === 'eq' ? 'in' : 'nin';
                        b.value = ['opc-ua', 'modbus-tcp', 'collector-gateway'];
                    } else if (
                        Array.isArray(b.value) &&
                        b.value.includes('collector-gateway')
                    ) {
                        b.value = ['opc-ua', 'modbus-tcp', ...b.value];
                    }
                }
                return b;
            });
        });
    }

    params.value = newTerms;
};
const routerParams = useRouterParams();
onMounted(() => {
    if (routerParams.params?.value.save) {
        add();
    }
});
</script>

<style lang="less" scoped>
.box {
    padding: 20px;
    background: #f0f2f5;
}
.productImg {
    width: 80px;
    height: 80px;
}
.productName {
    white-space: nowrap; /*强制在同一行内显示所有文本，直到文本结束或者遭遇br标签对象才换行。*/
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /*隐藏部分以省略号代替*/
}
</style>
