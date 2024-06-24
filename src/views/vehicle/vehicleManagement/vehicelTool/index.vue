<template>
    <page-container>
        <pro-search
            :columns="query.columns"
            target="product-manage"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                :columns="query.columns"
                :request="queryData"
                ref="tableRef"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :rowSelection="
                    isCheck
                        ? {
                              selectedRowKeys: _selectedRowKeys,
                              onChange: onSelectChange,
                          }
                        : false
                "
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton type="primary" @click="add">
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            新增
                        </PermissionButton>
                    </j-space>
                    <j-space style="margin-left: 10px">
                        <BatchDropdown
                            v-model:isCheck="isCheck"
                            :actions="batchActions"
                            @change="onCheckChange"
                        />
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
                        :status="slotProps.vehicleStatus"
                        @click="handleView(slotProps)"
                        :statusText="listStatusText(slotProps.vehicleStatus)"
                        :statusNames="{
                            0: 'processing',
                            1: 'error',
                            2: 'warning',
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
                                    {{ slotProps.simpleName }}
                                </span></Ellipsis
                            >
                            <div>
                                <j-row>
                                    <j-col :span="12"
                                        ><div>出厂编号:</div></j-col
                                    >
                                    <j-col :span="12"
                                        ><Ellipsis
                                            ><div>
                                                {{ slotProps?.factoryNumber }}
                                            </div></Ellipsis
                                        ></j-col
                                    >
                                </j-row>
                                <j-row>
                                    <j-col :span="12"
                                        ><div>车辆类型:</div></j-col
                                    >
                                    <j-col :span="12"
                                        ><Ellipsis
                                            ><div>
                                                {{
                                                    slotProps?.vehicleTypeEnum
                                                        .text
                                                }}
                                            </div></Ellipsis
                                        ></j-col
                                    >
                                </j-row>
                                <j-row>
                                    <j-col :span="12"><div>子设备:</div></j-col>
                                    <j-col :span="12"
                                        ><Ellipsis
                                            ><div>
                                                {{
                                                    slotProps?.devices.length
                                                }}个
                                            </div></Ellipsis
                                        ></j-col
                                    >
                                </j-row>
                            </div>
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
                                                :disabled="item.disabled"
                                                :popConfirm="o.popConfirm"
                                                :tooltip="{
                                                    ...o.tooltip,
                                                }"
                                                @click="o.onClick"
                                            >
                                                <AIcon :type="o.icon" />
                                                <span>{{ o?.text }}</span>
                                            </PermissionButton>
                                        </j-menu-item>
                                    </j-menu>
                                </template>
                            </j-dropdown>
                            <PermissionButton
                                v-else
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
                <template #status="slotProps">
                    <BadgeStatus
                        :text="slotProps.status === 0 ? '在线' : '离线'"
                        :status="slotProps.status"
                        :statusNames="{
                            0: 'success',
                            1: 'error',
                        }"
                    />
                </template>
                <template #vehicleStatus="slotProps">
                    <BadgeStatus
                        :text="listStatusText(slotProps.vehicleStatus)"
                        :status="slotProps.vehicleStatus"
                        :statusNames="{
                            0: 'processing',
                            1: 'error',
                            2: 'warning',
                        }"
                    />
                </template>
                <template #devices="slotProps">
                    {{ slotProps.devices.length }}个
                </template>
                <template #vehicleTypeEnum="slotProps">
                    <Ellipsis>{{ slotProps.vehicleTypeEnum.text }}</Ellipsis>
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
        <!-- 新增、编辑 -->
        <Save ref="saveRef" :isAdd="isAdd" :title="title" @success="refresh" />
    </page-container>
</template>

<script setup lang="ts">
import { queryVehicleList } from '@/api/vehicle/vehicleManagement';
import { useMenuStore } from 'store/menu';
import { getImage, onlyMessage } from '@/utils/comm';
import type { ActionsType } from '../typings';
import Save from './save/index.vue';
import BatchDropdown from '@/components/BatchDropdown/index.vue';
import { BatchActionsType } from '@/components/BatchDropdown/types';

const tableRef = ref<Record<string, any>>({});
const currentForm = ref({});
const isCheck = ref<boolean>(false);
const query = reactive({
    columns: [
        {
            title: '车辆简称',
            dataIndex: 'simpleName',
            key: 'simpleName',
            ellipsis: true,
            search: {
                type: 'string',
            },
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
            search: {
                type: 'string',
            },
        },
        {
            title: '车辆类型',
            dataIndex: 'vehicleTypeEnum',
            key: 'vehicleTypeEnum',
            scopedSlots: true,
            search: {
                type: 'select',
                options: [
                    {
                        label: '内燃柴油机',
                        value: 'ICDieselEngine',
                    },
                    {
                        label: '内燃汽油机',
                        value: 'ICGasolineEngine',
                    },
                    {
                        label: '内燃牵引车',
                        value: 'ICTractor',
                    },
                    {
                        label: '机械柴油机',
                        value: 'MachineDieselEngine',
                    },
                    {
                        label: '其他',
                        value: 'other',
                    },
                ],
            },
        },
        //
        {
            title: '车辆状态',
            key: 'vehicleStatus',
            dataIndex: 'vehicleStatus',
            scopedSlots: true,
            search: {
                type: 'select',
                options: [
                    {
                        label: '正常',
                        value: 0,
                    },
                    {
                        label: '停用',
                        value: 1,
                    },
                    {
                        label: '维修',
                        value: 2,
                    },
                ],
            },
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            scopedSlots: true,
            search: {
                type: 'select',
                options: [
                    {
                        label: '离线',
                        value: 1,
                    },
                    {
                        label: '在线',
                        value: 0,
                    },
                ],
            },
        },
        {
            title: '子设备',
            key: 'devices',
            dataIndex: 'devices',
            scopedSlots: true,
            ellipsis: true,
        },
        {
            title: '说明',
            key: 'describe',
            dataIndex: 'describe',
            ellipsis: true,
            search: {
                type: 'string',
            },
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 160,
            scopedSlots: true,
        },
    ],
});

const saveRef = ref();
const isAdd = ref<number>(0);
const title = ref<string>('');
const params = ref<Record<string, any>>({});

const _selectedRowKeys = ref<string[]>([]);

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
 * 查看
 */
const handleView = (data: any) => {
    console.log('data', data);
    if (isCheck.value) {
        if (_selectedRowKeys.value.includes(data.id)) {
            const _index = _selectedRowKeys.value.findIndex(
                (i) => i === data.id,
            );
            _selectedRowKeys.value.splice(_index, 1);
        } else {
            _selectedRowKeys.value = [..._selectedRowKeys.value, data.id];
        }
    } else {
        console.log('查看详情');
    }
};

/**
 * 刷新数据
 */
const refresh = () => {
    tableRef.value?.reload();
};

const listStatusText = (text: number) => {
    if (text === 0) {
        return '正常';
    } else if (text === 2) {
        return '维修';
    } else {
        return '停用';
    }
};

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) {
        return [];
    }
    const actions = [
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
            key: 'action',
            text: data.vehicleStatus !== 1 ? '禁用' : '启用',
            tooltip: {
                title: data.vehicleStatus !== 1 ? '禁用' : '启用',
            },
            icon:
                data.vehicleStatus !== 1
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${data.vehicleStatus !== 1 ? '禁用' : '启用'}?`,
                onConfirm: async () => {
                    onlyMessage('操作成功！');
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            disabled: data.vehicleStatus !== 1,
            tooltip: {
                title:
                    data.vehicleStatus !== 1 ? '已启用的车辆不能删除' : '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    onlyMessage('操作成功！');
                },
            },
            icon: 'DeleteOutlined',
        },
    ];

    return actions;
};

const onSelectChange = (keys: string[], rows: []) => {
    _selectedRowKeys.value = [...keys];
};

const handelRemove = async () => {
    if (!_selectedRowKeys.value.length) {
        onlyMessage('请选择数据', 'error');
        return;
    }
    //删除

    onlyMessage('操作成功');
    //清空已选择
    _selectedRowKeys.value = [];
    //恢复状态
    isCheck.value = false;
    tableRef.value?.reload();
};

const batchActions: BatchActionsType[] = [
    {
        key: 'export',
        text: '批量删除',
        icon: 'ExportOutlined',
        selected: {
            popConfirm: {
                title: '确认删除吗？',
                onConfirm: handelRemove,
            },
        },
    },
];

const onCheckChange = () => {
    _selectedRowKeys.value = [];
};

const handleSearch = (e: any) => {
    params.value = e;
};

const queryData = (params: Record<string, any>) =>
    new Promise((resolve) => {
        queryVehicleList({
            pageIndex: params.pageIndex,
            pageSize: params.pageSize,
            sorts: params.sorts,
            terms: params.terms,
        })
            .then((response: any) => {
                resolve({
                    result: {
                        data: response.result?.data,
                        pageIndex: response.result?.pageIndex || 0,
                        pageSize: response.result?.pageSize || 12,
                        total: response.result?.total,
                    },
                    status: 200,
                });
            })
            .catch((error: any) => {
                console.log(error);
            });
    });
</script>

<style lang="less" scoped>
td.ant-table-cell.ant-table-cell-fix-right.ant-table-cell-fix-right-first
    > div {
    gap: 2px !important;
}
</style>
