<template>
    <page-container>
        <pro-search
            :columns="query.columns"
            target="product-manage"
            @search="handleSearch"
        />
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
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增
                    </PermissionButton>
                    <j-upload
                        name="file"
                        accept=".json"
                        :showUploadList="false"
                        :before-upload="beforeUpload"
                    >
                        <PermissionButton hasPermission="device/Product:import"
                            >导入</PermissionButton
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
                    :statusText="slotProps.state === 1 ? '正常' : '禁用'"
                    :statusNames="{
                        1: 'success',
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
                        <Ellipsis style="width: calc(100% - 100px)"
                            ><span
                                @click.stop="handleView(slotProps.id)"
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
                                <div>{{ slotProps?.deviceType?.text }}</div>
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
                        <PermissionButton
                            :disabled="item.disabled"
                            :popConfirm="item.popConfirm"
                            :tooltip="{
                                ...item.tooltip,
                            }"
                            @click="item.onClick"
                            :hasPermission="'device/Product:' + item.key"
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
                    :text="slotProps.state === 1 ? '正常' : '禁用'"
                    :status="statusMap.get(slotProps.state)"
                />
            </template>
            <template #id="slotProps">
                <a>{{ slotProps.id }}</a>
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
                            :hasPermission="'device/Product:' + i.key"
                            :tooltip="{
                                ...i.tooltip,
                            }"
                            @click="i.onClick"
                            type="link"
                            style="padding: 0px"
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </JProTable>
        <!-- 新增、编辑 -->
        <Save ref="saveRef" :isAdd="isAdd" :title="title" @success="refresh" />
    </page-container>
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
    updateDevice,
} from '@/api/device/product';
import { isNoCommunity, downloadObject } from '@/utils/utils';
import { omit } from 'lodash-es';
import { typeOptions } from '@/components/Search/util';
import Save from './Save/index.vue';
import { useMenuStore } from 'store/menu';
import { useRoute } from 'vue-router';
/**
 * 表格数据
 */
const menuStory = useMenuStore();
const isAdd = ref<number>(0);
const title = ref<string>('');
const params = ref<Record<string, any>>({});
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
        {
            key: 'export',
            text: '导出',
            tooltip: {
                title: '导出',
            },

            icon: 'icon-xiazai',
            onClick: () => {
                const extra = omit(data, [
                    'transportProtocol',
                    'protocolName',
                    'accessId',
                    'accessName',
                    'accessProvider',
                    'messageProtocol',
                ]);
                downloadObject(extra, '产品');
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
                title: data.state !== 0 ? '已启用的产品不能删除' : '删除',
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
    if (type === 'card')
        return actions.filter((i: ActionsType) => i.key !== 'view');
    return actions;
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
        console.log('text: ', text);
        if (!file.type.includes('json')) {
            message.error('请上传json格式文件');
            return false;
        }
        try {
            const data = JSON.parse(text || '{}');
            // 设置导入的产品状态为未发布
            data.state = 0;
            if (Array.isArray(data)) {
                message.error('请上传json格式文件');
                return false;
            }
            delete data.state;
            const res = await updateDevice(data);
            if (res.status === 200) {
                message.success('操作成功');
                tableRef.value?.reload();
            }
            return true;
        } catch {
            message.error('请上传json格式文件');
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
const handleSearch = (e: any) => {
    params.value = e;
};
const route = useRoute();
onMounted(() => {
    if(history.state?.params?.save){
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
    width: 88px;
    height: 88px;
}
.productName {
    white-space: nowrap; /*强制在同一行内显示所有文本，直到文本结束或者遭遇br标签对象才换行。*/
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /*隐藏部分以省略号代替*/
}
</style>
