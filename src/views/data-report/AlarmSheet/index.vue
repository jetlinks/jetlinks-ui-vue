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
                :request="test"
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
                        <PermissionButton
                            :popConfirm="{
                                title: `确认导出？`,
                                onConfirm: () => handleExport(),
                            }"
                        >
                            导出
                        </PermissionButton>
                    </j-space>
                </template>
                <template #createTime="{ alarmTime }">
                    {{ dayjs(alarmTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { downloadObject } from '@/utils/utils';
import { PageIndex, query } from '@/api/data-report/commonApi';
import dayjs from 'dayjs';
import { FullPage } from 'components/Layout';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

// 测试用的数据
const test = () => {
    return new Promise((resolve, reject) => {
        resolve({
            message: 'success',
            result: {
                pageIndex: 0,
                pageSize: 0,
                total: 0,
                data: [
                    {
                        id: '1234567890',
                        vehicleId: 'V001',
                        vehicleTypeEnum: 'Truck',
                        factoryNumber: 'FAB2023001',
                        simpleName: 'Truck-01',
                        modelNumber: 'T4500',
                        orgName: 'Logistics Co., Ltd.',
                        alarmTime: 1654321000,
                        lngLat: '116.404,39.904',
                        alarmDeviceName: 'Engine Monitor',
                        alarmDictionaryKey: 'overheat',
                        alarmDictionaryValue: '发动机过热',
                        description: '车辆发动机温度过高，请检查冷却系统。',
                    },
                    {
                        id: '2345678901',
                        vehicleId: 'V002',
                        vehicleTypeEnum: 'Bus',
                        factoryNumber: 'FAB2022123',
                        simpleName: 'Bus-07',
                        modelNumber: 'B888',
                        orgName: 'Public Transport Corp.',
                        alarmTime: 1654322000,
                        lngLat: '121.4737,31.2304',
                        alarmDeviceName: 'Brake System',
                        alarmDictionaryKey: 'low_pressure',
                        alarmDictionaryValue: '刹车压力低',
                        description:
                            '刹车系统检测到压力不足，请立即检查刹车液位。',
                    },
                    {
                        id: '3456789012',
                        vehicleId: 'V003',
                        vehicleTypeEnum: 'Van',
                        factoryNumber: 'FAB2021009',
                        simpleName: 'Van-C1',
                        modelNumber: 'V300',
                        orgName: 'Delivery Express Inc.',
                        alarmTime: 1654323000,
                        lngLat: '114.304,22.5431',
                        alarmDeviceName: 'Tire Pressure Monitor',
                        alarmDictionaryKey: 'flat_tire',
                        alarmDictionaryValue: '轮胎瘪胎',
                        description: '左后轮胎气压严重不足，建议立即停车检查。',
                    },
                ],
            },
            status: 200,
            timestamp: 1716796318076,
        });
    });
};

const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        scopedSlots: true,
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
    },
    {
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        scopedSlots: true,
    },
    {
        title: '车辆位置',
        dataIndex: 'lngLat',
        key: 'lngLat',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '告警设备',
        dataIndex: 'alarmDeviceName',
        key: 'alarmDeviceName',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '告警说明 ',
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 导出
 */
const handleExport = () => {
    downloadObject(configRef.value.selectedKeys, `车辆告警数据`);
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
</script>

<style lang="less" scoped></style>
