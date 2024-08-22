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
                :request="queryPro"
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
                            新增
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
                                >导入</PermissionButton
                            >
                        </j-upload>
                    </j-space>
                </template>
                <template #deviceType="slotProps">
                    <div>{{ slotProps.deviceType.text }}</div>
                </template>
                <template #factoryLogsEntities="slotProps">
                    <Ellipsis>
                        <div>
                            {{ funGetFactory(slotProps.factoryLogsEntities) }}
                        </div>
                    </Ellipsis>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :active="_selectedRowKeys.includes(slotProps.id)"
                        :status="slotProps.state"
                        @click="handleView(slotProps.id)"
                        :statusText="slotProps.state === 1 ? '正常' : '禁用'"
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
                                    width: calc(100% - 10px);
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
                                        设备类型
                                    </div>
                                    <ellipsis>
                                        <div>
                                            {{ slotProps?.deviceType?.text }}
                                        </div>
                                    </ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        接入方式
                                    </div>
                                    <Ellipsis
                                        ><div>
                                            {{
                                                slotProps?.accessName
                                                    ? slotProps?.accessName
                                                    : '未接入'
                                            }}
                                        </div></Ellipsis
                                    >
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <j-dropdown
                                placement="bottomRight"
                                v-if="item.key === 'more'"
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
                                                    'device/Product:' + o.key
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
                        :text="slotProps.state === 1 ? '正常' : '禁用'"
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
            </JProTable>
        </FullPage>
        <!-- 新增、编辑 -->
        <Save ref="saveRef" :isAdd="isAdd" :title="title" @success="refresh" />
        <Allots
            v-if="allotsVisible"
            :disProductId="disProductId"
            @close="allotsVisible = false"
        ></Allots>
    </page-container>
</template>

<script setup lang="ts">
import type { ActionsType } from './typings';
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
    tbQueryProduct,
} from '@/api/device/product';
import { isNoCommunity, downloadObject } from '@/utils/utils';
import {
    isTopic,
    queryFactoryList,
    queryFactoryIssued,
} from '@/api/factory/factory';
import { omit, cloneDeep } from 'lodash-es';
import { typeOptions } from '@/components/Search/util';
import Save from './Save/index.vue';
import { useMenuStore } from 'store/menu';
import { useRouterParams } from '@/utils/hooks/useParams';
import { accessConfigTypeFilter } from '@/utils/setting';
import { usePermissionStore } from '@/store/permission';
import Allots from './allots/index.vue';
import { useSystem } from '@/store/system';
const system = useSystem();
const configInfo = system.configInfo;
/**
 * 表格数据
 */
const menuStory = useMenuStore();
const isAdd = ref<number>(0);
const title = ref<string>('');
const params = ref<Record<string, any>>({});
const allotsVisible = ref(false);
const disProductId = ref();
const factoryList = ref<any>([]);

const isIOT = ref();
const factoryType = ref();
const columns = ref([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 180,
        ellipsis: true,
    },
    {
        title: '产品名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        ellipsis: true,
    },
    {
        title: '接入方式',
        dataIndex: 'accessName',
        key: 'accessName',
        width: 160,
        ellipsis: true,
    },
    {
        title: '设备类型',
        dataIndex: 'deviceType',
        key: 'deviceType',
        scopedSlots: true,
        ellipsis: true,
        width: 120,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        ellipsis: true,
        width: 90,
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 340,
        scopedSlots: true,
    },
]);
const permission = usePermissionStore().hasPermission(`device/Product:import`);
const _selectedRowKeys = ref<string[]>([]);
const currentForm = ref({});

isIOT.value = configInfo.front?.isIOT;
factoryType.value = configInfo.front?.factoryType;
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
                title.value = '编辑';
                isAdd.value = 2;
                nextTick(() => {
                    saveRef.value.show(data);
                });
            },
        },
    ];
    const others = [
        {
            key: 'export',
            text: '导出',
            tooltip: {
                title: '导出',
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
                downloadObject(extra, data.name + '产品');
            },
        },
        {
            key: 'action',
            text: data.state !== 0 ? '禁用' : '启用',
            tooltip: {
                title: data.state !== 0 ? '禁用' : '启用',
            },
            icon: data.state !== 0 ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${data.state !== 0 ? '禁用' : '启用'}?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state !== 0) {
                        response = await _undeploy(data.id);
                    } else {
                        response = await _deploy(data.id);
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
    ];
    const distributeData = {
        key: 'distribute',
        text: '下发',
        tooltip: {
            title: '下发',
        },
        icon: 'ArrowRightOutlined',
        onClick: () => {
            allotsVisible.value = true;
            disProductId.value = data.id;
        },
    };
    const deleteItem = {
        key: 'delete',
        text: '删除',
        disabled: data.state !== 0,
        tooltip: {
            title: data.state !== 0 ? '已启用的产品不能删除' : '删除',
        },
        popConfirm: {
            title: '确认删除?',
            onConfirm: async () => {
                // const getInstance = {
                //     terms: [
                //         {
                //             column: 'productId',
                //             termType: 'eq',
                //             type: 'or',
                //             value: `${data.id}`,
                //         },
                //     ],
                // };
                // const result = await queryGetSendData(getInstance);
                // console.log('result',result)
                const resp = await deleteProduct(data.id);
                if (resp.status === 200) {
                    onlyMessage('操作成功！');
                    tableRef.value?.reload();
                } else {
                    onlyMessage('操作失败！', 'error');
                }
            },
        },
        icon: 'DeleteOutlined',
    };
    if (isIOT.value === 'true' && factoryType.value === 'general') {
        others.splice(1, 0, distributeData);
    }
    if (type === 'card') {
        const arr = actions.filter((i: ActionsType) => i.key !== 'view');
        return [
            ...arr,
            {
                key: 'more',
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

/**
 * 新增
 */
const add = () => {
    isAdd.value = 1;
    title.value = '新增';
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
            onlyMessage('请上传json格式文件', 'error');
            return false;
        }
        if (!text) {
            onlyMessage('文件内容不能为空', 'error');
            return false;
        }
        const data = JSON.parse(text);
        // 设置导入的产品状态为未发布
        data.state = 0;
        if (Array.isArray(data)) {
            onlyMessage('请上传正确格式文件', 'error');
            return false;
        }
        delete data.state;
        if (!data?.name) {
            data.name = '产品' + Date.now();
        }
        if (!data?.deviceType || JSON.stringify(data?.deviceType) === '{}') {
            onlyMessage('缺少deviceType字段或对应的值', 'error');
            return false;
        }
        const res = await updateDevice(data);
        if (res.status === 200) {
            onlyMessage('操作成功');
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
            title: '名称',
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
            },
        },
        {
            title: '网关类型',
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
            title: '接入方式',
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
            title: '设备类型',
            key: 'deviceType',
            dataIndex: 'deviceType',
            search: {
                type: 'select',
                options: [
                    {
                        label: '直连设备',
                        value: 'device',
                    },
                    {
                        label: '网关子设备',
                        value: 'childrenDevice',
                    },
                    {
                        label: '网关设备',
                        value: 'gateway',
                    },
                ],
            },
        },
        {
            title: '状态',
            key: 'state',
            dataIndex: 'state',
            search: {
                type: 'select',
                options: [
                    {
                        label: '正常',
                        value: 1,
                    },
                    {
                        label: '禁用',
                        value: 0,
                    },
                ],
            },
        },
        {
            title: '说明',
            key: 'describe',
            dataIndex: 'describe',
            search: {
                type: 'string',
            },
        },
        {
            title: '产品分类',
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
            title: '所属组织',
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
            title: '操作',
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

const funGetFactory = (data: any) => {
    console.log(data);
    if (data?.length > 0) {
        let facNames = data.map((item: any) => {
            return item.factoryName;
        });
        return facNames.toString();
        // const s = new Set(facNames);
        // return Array.from(s);
    }
    return null;
};

const queryPro = (params: Record<string, any>) =>
    new Promise((resolve) => {
        //queryProductList  tbQueryProduct
        tbQueryProduct({
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
                        pageSize: params.pageSize || 12,
                        total: response.result?.total,
                    },
                    status: response.status,
                });
            })
            .catch((error: any) => {
                console.log(error);
            });
    });

const routerParams = useRouterParams();
onMounted(() => {
    if (isIOT.value === 'true' && factoryType.value === 'general') {
        const factoryName = {
            title: '已下发工厂',
            dataIndex: 'factoryLogsEntities',
            key: 'factoryLogsEntities',
            width: 200,
            scopedSlots: true,
            ellipsis: true,
        };
        columns.value.splice(2, 0, factoryName);
    }
    // getMock();
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
td.ant-table-cell.ant-table-cell-fix-right.ant-table-cell-fix-right-first
    > div {
    gap: 2px !important;
}
</style>
