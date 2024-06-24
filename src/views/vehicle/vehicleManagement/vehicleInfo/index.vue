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
                                    {{ slotProps.modelNumber }}
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
                                    <j-col :span="12"><div>说明:</div></j-col>
                                    <j-col :span="12"
                                        ><Ellipsis
                                            ><div>
                                                {{ slotProps?.describe }}
                                            </div></Ellipsis
                                        ></j-col
                                    >
                                </j-row>
                            </div>
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
                                    <span>{{ item?.text }}</span>
                                </template>
                            </PermissionButton>
                        </template>
                    </CardBox>
                </template>
                <template #deviceType="slotProps">
                    <div>{{ slotProps.deviceType.text }}</div>
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
            title: '出厂编号',
            dataIndex: 'factoryNumber',
            key: 'factoryNumber',
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
            width: 200,
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
 * 查看
 */
const handleView = (data: string) => {
    title.value = '编辑';
    isAdd.value = 2;
    nextTick(() => {
        saveRef.value.show(data);
    });
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
                console.log('查看详情');
            },
        },
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

    return actions;
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
