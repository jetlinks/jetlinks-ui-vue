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
                        @click="handleView(slotProps.id)"
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
                                    {{ slotProps.name }}
                                </span></Ellipsis
                            >
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">ID</div>
                                    <div>{{ slotProps?.id }}</div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        说明
                                    </div>
                                    <Ellipsis
                                        ><div>
                                            {{ slotProps?.describe }}
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
                <template #vehicleTypeEnum="slotProps">
                    {{ slotProps.vehicleTypeEnum.text }}
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
import type { ActionsType } from './typings';
import Save from './save/index.vue';

const typeList = ref([]);
const tableRef = ref<Record<string, any>>({});
const currentForm = ref({});
const query = reactive({
    columns: [
        {
            title: '车辆简称',
            dataIndex: 'modelNumber',
            key: 'modelNumber',
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
                type: 'string',
            },
        },
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
            width: 270,
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
const handleView = (id: string) => {
    console.log('查看详情');
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
            key: 'view',
            text: '详情',
            tooltip: {
                title: '详情',
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
    ];

    const others = [
        {
            key: 'firstLock',
            text: '一级锁车',
            tooltip: {
                title: '一级锁车',
            },

            icon: 'LockOutlined',
            onClick: () => {
                console.log('一级锁车');
            },
        },
        {
            key: 'secondLock',
            text: '二级锁车',
            tooltip: {
                title: '二级锁车',
            },

            icon: 'DisconnectOutlined',
            onClick: () => {
                console.log('二级锁车');
            },
        },
        {
            key: 'viewMonitor',
            text: '查看监控',
            tooltip: {
                title: '查看监控',
            },
            icon: 'VideoCameraOutlined',
            onClick: () => {
                console.log('查看监控');
            },
        },
    ];
    const deleteItem = {
        key: 'delete',
        text: '删除',
        disabled: data.vehicleStatus !== 1,
        tooltip: {
            title: data.vehicleStatus !== 1 ? '已启用的车辆不能删除' : '删除',
        },
        popConfirm: {
            title: '确认删除?',
            onConfirm: async () => {
                onlyMessage('操作成功！');
            },
        },
        icon: 'DeleteOutlined',
    };
    if (type === 'card') {
        let noDelItem = actions.filter((i: ActionsType) => i.key !== 'view');
        return [
            ...noDelItem,
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

const handleSearch = (e: any) => {
    params.value = e;
};

const queryData = (params: Record<string, any>) =>
    new Promise((resolve) => {
        queryVehicleList({
            pageIndex: params.pageIndex + 1,
            pageSize: params.pageSize,
            sorts: params.sorts,
            terms: params.terms,
        })
            .then((response: any) => {
                console.log('response', response);
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
