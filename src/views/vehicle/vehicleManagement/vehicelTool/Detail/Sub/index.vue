<template>
    <div class="container">
        <pro-search
            :columns="columns"
            type="simple"
            target="vehicleDevices"
            @search="handleSearch"
        />
        <FullPage>
            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="request"
                model="TABLE"
                :params="queryParams"
                :defaultParams="{
                    sorts: [{ name: 'vehicleDate', order: 'desc' }],
                    terms: [
                        {
                            column: 'vehicleId',
                            value: `${_id}`,
                            termType: 'eq',
                            // type: 'and',
                        },
                    ],
                }"
            >
                <template #state="slotProps">
                    <BadgeStatus
                        :status="slotProps.state?.value"
                        :text="slotProps.state?.text"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
                    ></BadgeStatus>
                </template>
                <template #createTime="slotProps">
                    <span>{{
                        slotProps?.createTime
                            ? dayjs(slotProps.createTime).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : '--'
                    }}</span>
                </template>
                <template #action="slotProps">
                    <a> 查看 </a>
                </template>
            </j-pro-table>
        </FullPage>
    </div>
</template>

<script lang="ts" setup>
import { queryVehicleEquipmentList } from '@/api/data-report/vehicleReport';
import { queryNoPagingPost } from '@/api/device/product';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import dayjs from 'dayjs';

const route = useRoute();
const _id = route.params?.id as string;

const queryParams = ref({});
const columns = [
    {
        title: 'ID',
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '物模型名称',
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
        title: '注册时间',
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
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
                { label: '禁用', value: 'notActive' },
                { label: '离线', value: 'offline' },
                { label: '在线', value: 'online' },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
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
];

const handleSearch = (e: any) => {
    queryParams.value = e;
};
const request = (params: Record<string, any>) =>
    new Promise((resolve) => {
        queryVehicleEquipmentList({
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
                        pageSize: params.pageSize || 10,
                        total: response.result?.total,
                    },
                    status: response.status,
                });
            })
            .catch((error: any) => {
                console.log(error);
            });
    });
</script>
<style lang="less" scoped>
.container {
    .ant-dropdown-trigger {
        margin-left: 12px;
    }

    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
