<template>
    <div>
        <pro-search
            :columns="columns"
            target="notice-config"
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
            </JProTable>
        </full-page>
    </div>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';
import { downloadObject } from '@/utils/utils';
import { query, PageIndex } from '@/api/data-report/commonApi';

const queryData = (data?: any) => query(PageIndex.OverloadAlarm, data);

const configRef = ref<Record<string, any>>({});

const selectedRowsData = ref();
/**
 * 导出
 */
 const handleExport = () => {
    if (selectedRowsData.value) {
        downloadObject(selectedRowsData.value, `超载报警数据`);
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
        title: '载荷',
        dataIndex: 'overLoadInfoLoadRating',
        key: 'overLoadInfoLoadRating',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '当前实际吊重',
        dataIndex: 'overLoadInfoOverloadValue',
        key: 'overLoadInfoOverloadValue',
        scopedSlots: true,
    },
    {
        title: '持续时间',
        dataIndex: 'duration',
        key: 'duration',
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
