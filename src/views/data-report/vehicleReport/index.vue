<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="request"
                model="table"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :gridColumn="3"
                :row-selection="rowSelection"
            >
                <template #headerTitle>
                    <j-space>
                        <j-popconfirm
                            title="确认导出？"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="handleExport"
                        >
                            <PermissionButton>
                                <AIcon type="ExportOutlined" />
                                <span>导出</span>
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
                </template>
                <template #vehicleTypeEnum="slotProps">
                    <span> {{ slotProps.vehicleTypeEnum.text }}</span>
                </template>
                <template #action="slotProps">
                    <a @click="handelDetail(slotProps)" style="color: #f84914"
                        >详情
                    </a>
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { NOTICE_METHOD, MSG_TYPE } from '@/views/notice/const';
import { downloadObject } from '@/utils/utils';
import { useMenuStore } from 'store/menu';
import { onlyMessage } from '@/utils/comm';
import { queryVehicleList } from '@/api/data-report/vehicleReport';

const menuStory = useMenuStore();

let providerList: any = [];
Object.keys(MSG_TYPE).forEach((key) => {
    providerList = [...providerList, ...MSG_TYPE[key]];
});

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        width: 180,
        scopedSlots: true,
        ellipsis: true,
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
                        label: '机械柴油机',
                        value: 'MachineDieselEngine',
                    },
                    {
                        label: '内燃牵引车',
                        value: 'ICTractor',
                    }
                ],
            },
    },
    {
        title: '车辆编号',
        dataIndex: 'factoryNumber',
        key: 'factoryNumber',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
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
        title: '型号',
        dataIndex: 'modelNumber',
        key: 'modelNumber',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '日期',
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
        ellipsis: true,
    },
];

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    // console.log('handleSearch:', e);
    params.value = e;
    // console.log('params.value: ', params.value);
};

const handelDetail = (slotProps: any) => {
    console.log('data', slotProps);
    menuStory.jumpPage('data-report/vehicleReport/Detail', {
        id: slotProps.id,
    });
};

/**
 * 通知方式字段展示对应文字
 */
const getMethodTxt = (type: string) => {
    return NOTICE_METHOD.find((f) => f.value === type)?.label;
};

/**
 * 导出
 */
const handleExport = () => {
    downloadObject(configRef.value._dataSource, `车辆导出信息`);
};

const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows,
        );
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
        console.log(selected, selectedRows, changeRows);
    },
};

const request = (params: Record<string, any>) =>
    new Promise((resolve) => {
        queryVehicleList({
            firstPageIndex: params.pageIndex,
            pageIndex: params.pageIndex,
            pageSize: params.pageSize,
            sorts: params.sorts,
            terms: params.terms,
        })
            .then((response: any) => {
                resolve({
                    result: {
                        data: response.result?.data,
                        pageIndex: params.pageIndex || 0,
                        pageSize: params.pageSize || 20,
                        total: response.result?.total,
                    },
                    status: response.status,
                });
            })
            .catch((error: any) => {
                console.log(error);
            });
    });

const currentConfig = ref<Partial<Record<string, any>>>();
</script>

<style lang="less" scoped></style>
