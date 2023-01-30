<template>
    <a-card class="device-product">
        <Search :columns="query.columns" target="category" />
        <JTable :columns="columns" :request="queryProductList" ref="tableRef">
            <template #headerTitle>
                <a-button type="primary" @click="add"
                    ><plus-outlined />新增</a-button
                >
            </template>
            <template #deviceType="slotProps">
                <div>{{ slotProps.deviceType.text }}</div>
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    @click="handleClick"
                    :actions="getActions(slotProps, 'card')"
                    v-bind="slotProps"
                    :active="_selectedRowKeys.includes(slotProps.id)"
                    :status="slotProps.state"
                    :statusText="slotProps.state === 1 ? '正常' : '禁用'"
                    :statusNames="{
                        1: 'success',
                        0: 'error',
                    }"
                >
                    <template #img>
                        <slot name="img">
                            <img :src="getImage('/device-product.png')" />
                        </slot>
                    </template>
                    <template #content>
                        <h3>{{ slotProps.name }}</h3>
                        <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    设备类型
                                </div>
                                <div>直连设备</div>
                            </a-col>
                        </a-row>
                    </template>
                    <template #actions="item">
                        <a-popconfirm
                            v-if="item.popConfirm"
                            v-bind="item.popConfirm"
                        >
                            <a-button :disabled="item.disabled">
                                <DeleteOutlined v-if="item.key === 'delete'" />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item.text }}</span>
                                </template>
                            </a-button>
                        </a-popconfirm>
                        <template v-else>
                            <a-button :disabled="item.disabled">
                                <DeleteOutlined v-if="item.key === 'delete'" />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item.text }}</span>
                                </template>
                            </a-button>
                        </template>
                    </template>
                </CardBox>
            </template>
            <template #state="slotProps">
                <a-badge
                    :text="slotProps.state === 1 ? '正常' : '禁用'"
                    :status="statusMap.get(slotProps.state)"
                />
            </template>
            <template #id="slotProps">
                <a>{{ slotProps.id }}</a>
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip
                        v-for="i in getActions(slotProps)"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <a-popconfirm v-if="i.popConfirm" v-bind="i.popConfirm">
                            <a-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></a-button>
                        </a-popconfirm>
                        <a-button
                            style="padding: 0"
                            type="link"
                            v-else
                            @click="i.onClick && i.onClick(slotProps)"
                        >
                            <a-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></a-button>
                        </a-button>
                    </a-tooltip>
                </a-space>
            </template>
        </JTable>
        <!-- 新增、编辑 -->
        <Save ref="saveRef" />
    </a-card>
</template>

<script setup lang="ts">
import server from '@/utils/request';
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage } from '@/utils/comm';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {
    getProviders,
    category,
    queryOrgThree,
    queryGatewayList,
    queryProductList,
    _deploy,
    _undeploy,
    deleteProduct,
    addProduct,
    editProduct,
    queryProductId,
} from '@/api/device/product';
import { isNoCommunity } from '@/utils/utils';
import { typeOptions } from '@/components/Search/util';
import Save from './Save/index.vue';
/**
 * 表格数据
 */
const statusMap = new Map();
statusMap.set(1, 'success');
statusMap.set(0, 'error');
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true,
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '接入方式',
        dataIndex: 'accessName',
        key: 'accessName',
    },
    {
        title: '设备类型',
        dataIndex: 'deviceType',
        key: 'deviceType',
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const _selectedRowKeys = ref<string[]>([]);

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys];
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
};

const handleClick = (dt: any) => {
    if (_selectedRowKeys.value.includes(dt.id)) {
        const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
        _selectedRowKeys.value.splice(_index, 1);
    } else {
        _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
    }
};

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) {
        return [];
    }
    return [
        {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
        },
        {
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },

            icon: 'EditOutlined',
        },
        {
            key: 'download',
            text: '导出',
            tooltip: {
                title: '导出',
            },

            icon: 'icon-xiazai',
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
                        message.success('操作成功！');
                        tableRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            disabled: data.state !== 0,
            tooltip: {
                title: data.state !== 0 ? '已启用的设备不能删除' : '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const resp = await deleteProduct(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        tableRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const add = () => {
    saveRef.value.show();
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
                    return new Promise((res) => {
                        getProviders().then((resp: any) => {
                            listData.value = [];
                            // const list = () => {
                            if (isNoCommunity) {
                                listData.value = (resp?.result || []).map(
                                    (item: any) => ({
                                        label: item.name,
                                        value: item.id,
                                    }),
                                );
                            } else {
                                listData.value = (resp?.result || [])
                                    .filter((i: any) =>
                                        [
                                            'mqtt-server-gateway',
                                            'http-server-gateway',
                                            'mqtt-client-gateway',
                                            'tcp-server-gateway',
                                        ].includes(i.id),
                                    )
                                    .map((item: any) => ({
                                        label: item.name,
                                        value: item.id,
                                    }));
                                // }
                            }
                            res(listData.value);
                        });
                    });
                },
            },
        },
        {
            title: '接入方式',
            key: 'accessName',
            dataIndex: 'accessName',
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
                                value: item.name,
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
            title: '分类',
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
            title: '所属部门',
            key: 'id$dim-assets',
            dataIndex: 'id$dim-assets',
            search: {
                first: true,
                type: 'treeSelect',
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
</script>

<style lang="less" scoped>
.box {
    padding: 20px;
    background: #f0f2f5;
}
</style>
