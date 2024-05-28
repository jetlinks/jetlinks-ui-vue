<template>
    <div>
        <pro-search
            :columns="columns"
            target="overSpeed-config"
            @search="handleSearch"
        ></pro-search>
        <full-page>
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
                        <j-popconfirm
                            title="确认导出？"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="handleExport"
                        >
                            <PermissionButton>
                                <AIcon type="ExportOutlined" />
                                导出
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
                </template>
                <template #reportTime="{ reportTime }">
                    {{ dayjs(reportTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
            </JProTable>
        </full-page>
    </div>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';
import { downloadObject } from '@/utils/utils';
import { query, PageIndex } from '@/api/data-report/commonApi';
import dayjs from 'dayjs';
const configRef = ref<Record<string, any>>({});

const queryData = (data?: any) => query(PageIndex.SpeedAlarm, data);

const selectedRowsData = ref();
/**
 * 导出
 */
 const handleExport = () => {
    if (selectedRowsData.value) {
        downloadObject(selectedRowsData.value, `超速报警数据`);
        return;
    }
    onlyMessage('请勾选需要导出的数据', 'error');
};
const params = ref<Record<string, any>>({});
const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        scopedSlots: true,
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
        title: '速度限制',
        dataIndex: 'overSpeedInfoNewLimitSpeed',
        key: 'overSpeedInfoNewLimitSpeed',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '开始速度',
        dataIndex: 'overSpeedInfoNewStartOverSpeed',
        key: 'overSpeedInfoNewStartOverSpeed',
        scopedSlots: true,
    },
    {
        title: '最大速度',
        dataIndex: 'overSpeedInfoNewMaximumOverSpeed',
        key: 'overSpeedInfoNewMaximumOverSpeed',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '持续时间 ',
        dataIndex: 'duration',
        key: 'duration',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '型号',
        dataIndex: 'modelNumber',
        key: 'modelNumber',
        scopedSlots: true,
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
        title: '时间',
        dataIndex: 'reportTime',
        key: 'reportTime',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];

const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows,
        );
        selectedRowsData.value = selectedRows;
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
        console.log(selected, selectedRows, changeRows);
    },
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>

<style lang="less" scoped></style>
