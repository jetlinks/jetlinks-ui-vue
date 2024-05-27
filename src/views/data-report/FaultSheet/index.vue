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
                <template #faultTime="{ faultTime }">
                    <span>
                        {{ dayjs(faultTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </span>
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { downloadObject } from '@/utils/utils';
import { PageIndex, query } from '@/api/data-report/commonApi';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

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
                        faultDeviceName: 'Engine',
                        faultCode: 'P0300',
                        description: '发动机多重随机失火',
                        modelNumber: 'T4500',
                        orgName: 'Logistics Co., Ltd.',
                        faultTime: 1654321000,
                        lngLat: '116.404,39.904',
                        alarmDeviceName: 'Diagnostic System',
                        alarmDictionaryKey: 'misfire',
                        alarmDictionaryValue: '失火',
                    },
                    {
                        id: '2345678901',
                        vehicleId: 'V002',
                        vehicleTypeEnum: 'Bus',
                        factoryNumber: 'FAB2022123',
                        simpleName: 'Bus-07',
                        faultDeviceName: 'Transmission',
                        faultCode: 'U1000',
                        description: '通信接口故障',
                        modelNumber: 'B888',
                        orgName: 'Public Transport Corp.',
                        faultTime: 1654322000,
                        lngLat: '121.4737,31.2304',
                        alarmDeviceName: 'Transmission Control Module',
                        alarmDictionaryKey: 'communication_error',
                        alarmDictionaryValue: '通信错误',
                    },
                    {
                        id: '3456789012',
                        vehicleId: 'V003',
                        vehicleTypeEnum: 'Van',
                        factoryNumber: 'FAB2021009',
                        simpleName: 'Van-C1',
                        faultDeviceName: 'ABS',
                        faultCode: 'C0255',
                        description: 'ABS控制模块电源故障',
                        modelNumber: 'V300',
                        orgName: 'Delivery Express Inc.',
                        faultTime: 1654323000,
                        lngLat: '114.304,22.5431',
                        alarmDeviceName: 'ABS Controller',
                        alarmDictionaryKey: 'power_supply',
                        alarmDictionaryValue: '电源供应',
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
        search: {
            type: 'string',
        },
    },
    {
        title: '故障设备',
        dataIndex: 'faultDeviceName',
        key: 'faultDeviceName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '故障码',
        dataIndex: 'faultCode',
        key: 'faultCode',
        scopedSlots: true,
    },
    {
        title: '故障说明',
        dataIndex: 'description',
        key: 'description',
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
        scopedSlots: true,
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
        title: '故障时间 ',
        dataIndex: 'faultTime',
        key: 'faultTime',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '车辆位置',
        dataIndex: 'lngLat',
        key: 'lngLat',
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
    downloadObject(configRef.value._dataSource, `通知模板数据`);
};
</script>

<style lang="less" scoped></style>
