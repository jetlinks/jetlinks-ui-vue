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
                <!-- <template #deviceId="slotProps">
                    {{
                        slotProps.deviceId
                            ? getDeviceName(slotProps.deviceId).value
                            : ''
                    }}
                </template> -->
                <template #createTime="slotProps">
                    {{
                        slotProps.createTime
                            ? moment(slotProps.createTime).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}
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
import {
    getVehicleDevice,
    queryDeviceList,
} from '@/api/data-report/deviceReport';
import { queryDeviceLogs } from '@/api/data-report/deviceMessages';
import { downloadObject } from '@/utils/utils';
import { onlyMessage } from '@/utils/comm';
import moment from 'moment';
import { useMenuStore } from 'store/menu';
const menuStory = useMenuStore();

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
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
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

const handelDetail = (data: any) => {
    menuStory.jumpPage('data-report/vehicleReport/Detail', {
        id: data.id,
    });
};

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
 * 通知设备id获取设备名称
 */
const getDeviceName = (id: string) => {
    const res: any =  getVehicleDevice(id);
    console.log('result', res.result);
    if (res.result) {
        return res.result.name;
    } else {
        return '';
    }
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
        console.log('params', params);
        queryDeviceLogs({
            firstPageIndex: params.pageIndex,
            pageIndex: params.pageIndex,
            pageSize: params.pageSize,
            sorts: params.sorts,
            terms: params.terms,
        })
            .then((response: any) => {
                console.log(response, 'response');
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
