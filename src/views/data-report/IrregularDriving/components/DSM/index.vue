<template>
    <div>
        <pro-search
            :columns="columns"
            target="dsm-config"
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
                <template #action="slotProps">
                    <a-button danger type="text" @click="onDetail(slotProps)">
                        查看</a-button
                    >
                </template>
                <template #reportTime="{ reportTime }">
                    {{ dayjs(reportTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
            </JProTable>
            <Detail v-if="visible" v-model:visible="visible" :data="dataInfo" />
        </full-page>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import { downloadObject } from '@/utils/utils';
import Detail from './Detail.vue';
import { query, PageIndex } from '@/api/data-report/commonApi';

const queryData = (data?: any) => query(PageIndex.DSMAlarm, data);

const configRef = ref<Record<string, any>>({});

const selectedRowsData = ref();

const visible = ref(false);

const dataInfo = ref<Record<string, any>>();
/**
 * 导出
 */
const handleExport = () => {
    if (selectedRowsData.value) {
        downloadObject(selectedRowsData.value, `DSM报警数据`);
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
        title: '车辆简称',
        dataIndex: 'simpleName',
        key: 'simpleName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '报警类型',
        dataIndex: 'reportType',
        key: 'reportType',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '报警信息',
        dataIndex: 'reportInfo',
        key: 'reportInfo',
        scopedSlots: true,
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
        title: '告警时间 ',
        dataIndex: 'reportTime',
        key: 'reportTime',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '报警附件',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
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

const onDetail = (data: Record<string, any>) => {
    dataInfo.value = data;
    visible.value = true;
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
