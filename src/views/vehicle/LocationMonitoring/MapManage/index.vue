<template>
    <page-container>
        <pro-search
            :columns="tableColumns"
            target="map-manage"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="tableRef"
                :columns="tableColumns"
                :request="queryData"
                model="table"
                :params="params"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton type="primary" @click="add">
                            添加
                        </PermissionButton>
                    </j-space>
                </template>
                <template #vehicleTypeEnum="{ vehicleTypeEnum }"> </template>
                <!-- 所属组织 -->
                <template #orgName="{ orgName }">
                    {{ orgName || '--' }}
                </template>
                <template #status="slotProps">
                    <BadgeStatus
                        :text="
                            slotProps.status === 0
                                ? '在线'
                                : slotProps.status === 1
                                ? '离线'
                                : '禁用'
                        "
                        :status="slotProps.status"
                        :statusNames="{
                            0: 'processing',
                            1: 'error',
                            2: 'warning',
                        }"
                    />
                </template>
            </JProTable>
        </FullPage>
        <!-- 新增、编辑 -->
        <Save ref="saveRef" :isAdd="isAdd" :title="title" @success="refresh" />
    </page-container>
</template>

<script setup lang="ts">
import { queryVehicleList } from '@/api/vehicle/vehicleManagement';
import Save from './Save/index.vue';
const params = ref<Record<string, any>>({});
const tableRef = ref<Record<string, any>>({});
const isAdd = ref<number>(0);
const title = ref<string>('');
const currentForm = ref();
const saveRef = ref();
const tableColumns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '绑定组织',
        dataIndex: 'orgName',
        key: 'orgName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 100,
        scopedSlots: true,
    },
];

const testData = [{}];

const handleSearch = (e: any) => {
    params.value = e;
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
 * 刷新数据
 */
const refresh = () => {
    tableRef.value?.reload();
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

<style lang="less" scoped></style>
