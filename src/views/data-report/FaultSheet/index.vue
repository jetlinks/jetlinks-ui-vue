<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="fault-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryData"
                model="table"
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
                            <AIcon type="ExportOutlined" />
                            导出
                        </PermissionButton>
                    </j-space>
                </template>
                <template #orgName="{ orgName }">
                    {{ orgName || '暂未标记组织' }}
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
import { downloadFileByUrl } from '@/utils/utils';
import { queryFaultData } from '@/api/data-report/faultSheet';
import { useFilterAlarmDesc } from '@/hook/useFilterAlarmDesc';
import { _export } from '@/api/data-report/alarmSheet';
import moment from 'moment/moment';
import dayjs from 'dayjs';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

// 生成请求函数
const queryData = useFilterAlarmDesc(queryFaultData, 'faultTime');

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
        dataIndex: 'alarmDeviceName',
        key: 'alarmDeviceName',
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
        search: {
            type: 'string',
        },
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
        width: 180,
        scopedSlots: true,
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
 * @param param
 */
const handleSearch = (param: any) => {
    params.value = param;
};

const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {},
    onSelect: (record: any, selected: boolean, selectedRows: any) => {},
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {},
};

/**
 * 导出
 */
const type = ref<string>('xlsx');

const handleExport = async (_params: any) => {
    const data = { ..._params };
    _export(type.value, data).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `车辆告警数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
        }
    });
};
</script>

<style lang="less" scoped></style>
