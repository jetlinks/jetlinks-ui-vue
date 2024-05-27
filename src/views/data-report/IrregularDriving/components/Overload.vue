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
                :request="TemplateApi.list"
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

import TemplateApi from '@/api/notice/template';
import { downloadObject } from '@/utils/utils';


const configRef = ref<Record<string, any>>({});
/**
 * 导出
 */
 const handleExport = () => {
    downloadObject(configRef.value._dataSource, `通知模板数据`);
};

const params = ref<Record<string, any>>({});
const columns = [
    {
        title: '车辆类型',
        dataIndex: 'provider',
        key: 'provider',
        scopedSlots: true,
       
    },
    {
        title: '出厂编号',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '车辆简称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '速度限制',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '开始速度',
        dataIndex: 'type',
        key: 'type',
        scopedSlots: true,
       
    },
    {
        title: '最大速度',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '持续时间 ',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '型号',
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属组织',
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
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
