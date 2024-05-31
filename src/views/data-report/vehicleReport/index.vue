<template>
    <page-container>
        <pro-search :columns="columns" target="notice-config" @search="handleSearch" />
        <FullPage>
            <JProTable ref="configRef" :columns="columns" :request="request"
                :defaultParams="{ sorts: [{ name: 'vehicleDate', order: 'desc' }] }" model="table" :params="params"
                :gridColumn="3" :row-selection="rowSelection">
                <template #headerTitle>
                    <j-space>
                        <j-popconfirm title="确认导出？" ok-text="确定" cancel-text="取消" @confirm="handleExport">
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
                <template #orgName="slotProps">
                    <span> {{ slotProps.orgName || '暂未标记组织' }}</span>
                </template>
                <template #action="slotProps">
                    <a @click="handelDetail(slotProps)" style="color: #f84914">详情
                    </a>
                </template>       
                <template #vehicleDate="{ vehicleDate }">
                    {{ dayjs(vehicleDate).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';

import { downloadFileByUrl } from '@/utils/utils';
import { useMenuStore } from 'store/menu';

import {
    queryVehicleList,
    vehicleExport,
} from '@/api/data-report/vehicleReport';
import moment from 'moment';
import { onlyMessage } from '@/utils/comm';

const menuStory = useMenuStore();

const selects = ref<any>([]);


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
                },
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
    },
    {
        title: '日期',
        dataIndex: 'vehicleDate',
        key: 'vehicleDate',
        width: 200,
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'date',
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
 * @param param
 */
const handleSearch = (param: any) => {
    params.value = param;
};

const handelDetail = (slotProps: any) => {
    if(!slotProps.deviceId){
        onlyMessage('未绑定车辆设备，请先绑定再查看详情','error')
        return
    }
    menuStory.jumpPage('data-report/vehicleReport/Detail',
        { id: slotProps.id, },
        {
            id: slotProps.id,
            deviceId: JSON.stringify(slotProps.deviceId),
        });
};

/**
 * 导出
 */

const type = ref<string>('xlsx');
const handleExport = async () => {
    if (!selects.value?.length) {
        onlyMessage('请勾选需要导出得数据', 'error');
        return;
    } else if (selects.value?.length > 1) {
        onlyMessage('只能勾选一条数据进行导出', 'error');
        return;
    } else {
        const { id, deviceId } = selects.value[0]
        console.log(selects.value[0])
        vehicleExport(id, deviceId).then((res: any) => {
            if (res) {
                const blob = new Blob([res.data], { type: type.value });
                const url = URL.createObjectURL(blob);
                downloadFileByUrl(
                    url,
                    `车辆列表数据-${moment(new Date()).format(
                        'YYYY/MM/DD HH:mm:ss',
                    )}`,
                    type.value,
                );
            }
        });
    }
};
const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows,
        );
        selects.value = selectedRows;
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
</script>

<style lang="less" scoped></style>
