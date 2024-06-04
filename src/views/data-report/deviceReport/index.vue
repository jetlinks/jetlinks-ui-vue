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
                            <PermissionButton
                                hasPermission="notice/Template:export"
                            >
                                <AIcon type="ExportOutlined" />
                                <span>导出</span>
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
                </template>
                <template #number="slotProps">
                    <span>{{ slotProps.number }}</span>
                </template>
                <template #state="slotProps">
                    <button
                        v-if="slotProps.state.value === 'offline'"
                        style="
                            height: 24px;
                            padding: 3px 8px 3px 8px;
                            border-radius: 3px;
                            background: #f99d311a;
                            color: #f99d31;
                            border: 1px solid #f99d3199;
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 18px;
                        "
                    >
                        离线
                    </button>
                    <button
                        v-else-if="slotProps.state.value === 'notActive'"
                        style="
                            height: 24px;
                            padding: 3px 8px 3px 8px;
                            border-radius: 3px;
                            background: rgba(229, 0, 18, 0.1);
                            color: rgba(229, 0, 18, 1);
                            border: 1px solid rgba(229, 0, 18, 1);
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 18px;
                        "
                    >
                        禁用
                    </button>
                    <button
                        v-else
                        style="
                            height: 24px;
                            padding: 3px 8px 3px 8px;
                            border-radius: 3px;
                            background: #0fce8c1a;
                            color: #0fce8c;
                            border: 1px solid #0fce8c99;
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 18px;
                        "
                    >
                        在线
                    </button>
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { queryDeviceList, deviceExport } from '@/api/data-report/deviceReport';
import { onlyMessage } from '@/utils/comm';

import { downloadFileByUrl, downloadObject } from '@/utils/utils';
import moment from 'moment';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const selectIds = ref<Array<number | string>>([]);

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 180,
        ellipsis: true,
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属产品',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属车辆编号',
        dataIndex: 'number',
        key: 'number',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        ellipsis: true,
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
];

/**
 * 搜索
 * @param param
 */
const handleSearch = (param: any) => {
    params.value = param;
};

/**
 * 导出
 */
const type = ref<string>('xlsx');
const handleExport = async () => {
    if (!selectIds.value?.length) {
        onlyMessage('请勾选需要导出的数据', 'error');
        return;
    }
    const _params = {
        terms: [
            {
                column: 'id',
                value: selectIds.value,
                termType: 'in',
            },
        ],
    };
    deviceExport('设备消息数据', type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `设备消息数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
        }
    });
};
const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows,
        );
        selectIds.value = selectedRowKeys;
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
        queryDeviceList({
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
