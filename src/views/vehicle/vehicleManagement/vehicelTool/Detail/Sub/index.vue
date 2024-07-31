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
                :defaultParams="defaultParams"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton type="primary" @click="funBind">
                            绑定
                        </PermissionButton>
                        <PermissionButton @click="funUnbinds">
                            批量解绑
                        </PermissionButton>
                    </j-space>
                </template>
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
                    <a style="color: #f84914" @click="funSee(slotProps)">
                        查看
                    </a>
                    <a style="margin-left: 10px; color: #f84914"> 解绑 </a>
                </template>
            </j-pro-table>
        </FullPage>
        <Modal ref="subDetailRef" />
    </div>
</template>

<script lang="ts" setup>
import { queryVehicleEquipmentList } from '@/api/data-report/vehicleReport';
import { queryNoPagingPost } from '@/api/device/product';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import Modal from './Modal/index.vue';
import dayjs from 'dayjs';

const route = useRoute();
const _id = route.params?.id as string;
const defaultParams = {
    terms: [
        {
            column: 'vehicleId',
            value: `${_id}`,
            termType: 'eq',
        },
    ],
};
const queryParams = ref({});
const subDetailRef = ref();

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
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

const funBind = () => {
    console.log('绑定');
};

const funUnbinds = () => {
    console.log('批量绑定');
};

const funSee = (data: any) => {
    nextTick(() => {
        subDetailRef.value.show(data.deviceId);
    });
};

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
