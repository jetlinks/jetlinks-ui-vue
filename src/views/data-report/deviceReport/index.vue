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
                            <PermissionButton
                                hasPermission="notice/Template:export"
                            >
                                <AIcon type="ExportOutlined" />
                                <span>导出</span>
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
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
                        未启用
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
import { queryDeviceList } from '@/api/data-report/deviceReport';
import { NOTICE_METHOD, MSG_TYPE } from '@/views/notice/const';
import { downloadObject } from '@/utils/utils';
import { onlyMessage } from '@/utils/comm';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 180,
        ellipsis: true,
        search: {
            type: 'string',
        },
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
            type: 'string',
        },
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
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

/**
 * 通知方式字段展示对应文字
 */
const getMethodTxt = (type: string) => {
    return NOTICE_METHOD.find((f) => f.value === type)?.label;
};
/**
 * 根据类型展示对应文案
 * @param type
 * @param provider
 */
const getProviderTxt = (type: string, provider: string) => {
    return MSG_TYPE[type].find((f: any) => f.value === provider)?.label;
};

/**
 * 导出
 */
const handleExport = () => {
    downloadObject(configRef.value._dataSource, `设备消息导出信息`);
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
        queryDeviceList({
            pageIndex: params.pageIndex + 1,
            pageSize: params.pageSize,
            sorts: params.sorts,
            terms: params.terms,
        })
            .then((response: any) => {
                console.log('response', response);
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
