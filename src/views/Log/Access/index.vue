<template>
    <div>
        <Search :columns="columns" target="search" @search="handleSearch" />
        <JTable
            ref="tableRef"
            model="TABLE"
            :columns="columns"
            :request="queryAccess"
            :defaultParams="{
                sorts: [{ name: 'responseTime', order: 'desc' }],
            }"
            :params="params"
        >
            <template #requestTime="slotProps">
                {{
                    moment(slotProps.requestTime).format('YYYY-MM-DD HH:mm:ss')
                }}
            </template>
            <template #responseTime="slotProps">
                <a-tag color="purple">
                    {{ slotProps.responseTime - slotProps.requestTime }} ms
                </a-tag>
            </template>
            <template #username="slotProps">
                <a-tag color="geekblue">
                    {{ slotProps.context.userName }}
                </a-tag>
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip
                        v-for="i in getActions(slotProps)"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <a-popconfirm v-if="i.popConfirm" v-bind="i.popConfirm">
                            <a-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></a-button>
                        </a-popconfirm>
                        <a-button
                            style="padding: 0"
                            type="link"
                            v-else
                            @click="i.onClick && i.onClick(slotProps)"
                        >
                            <a-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></a-button>
                        </a-button>
                    </a-tooltip>
                </a-space>
            </template>
        </JTable>
    </div>
    <a-modal
        :width="1100"
        v-model:visible="visible"
        title="详情"
        @ok="handleOk"
    >
        <a-descriptions :data="descriptionsData" title="" bordered :column="2">
            <a-descriptions-item label="URL">
                {{ descriptionsData?.url }}
            </a-descriptions-item>
            <a-descriptions-item label="请求方法">
                {{ descriptionsData?.httpMethod }}
            </a-descriptions-item>
            <a-descriptions-item label="动作">
                {{ descriptionsData?.action }}
            </a-descriptions-item>
            <a-descriptions-item label="类名">
                {{ descriptionsData?.target }}
            </a-descriptions-item>
            <a-descriptions-item label="方法名">
                {{ descriptionsData?.method }}
            </a-descriptions-item>
            <a-descriptions-item label="IP">
                {{ descriptionsData?.ip }}
            </a-descriptions-item>
            <a-descriptions-item label="请求时间">
                {{
                    moment(descriptionsData?.requestTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    )
                }}
            </a-descriptions-item>
            <a-descriptions-item label="请求耗时">
                {{
                    descriptionsData?.responseTime -
                    descriptionsData?.requestTime +
                    'ms'
                }}
            </a-descriptions-item>
            <a-descriptions-item label="请求头" :span="2">
                {{ descriptionsData?.httpHeaders }}
            </a-descriptions-item>
            <a-descriptions-item label="请求参数" :span="2">
                {{ descriptionsData?.parameters }}
            </a-descriptions-item>
            <a-descriptions-item label="异常信息" :span="2">
                <a-textarea
                    v-model:value="descriptionsData.exception"
                    placeholder="暂无数据"
                    :auto-size="{ minRows: 3, maxRows: 20 }"
                />
            </a-descriptions-item>
        </a-descriptions>
    </a-modal>
</template>
<script lang="ts" setup name="AccessLog">
import type { ActionsType } from '@/components/Table/index.vue';
import type { AccessLogItem } from '../typings';
import { queryAccess } from '@/api/link/log';
import moment from 'moment';

import { modifySearchColumnValue } from '@/utils/comm';

const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
        search: {
            type: 'string',
        },
        scopedSlots: true,
        width: 150,
        fixed: 'left',
    },
    {
        title: '请求路径',
        dataIndex: 'url',
        key: 'url',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: '请求方法',
        dataIndex: 'httpMethod',
        key: 'httpMethod',
        search: {
            type: 'select',
            options: [
                {
                    label: 'POST',
                    value: 'POST',
                },
                {
                    label: 'GET',
                    value: 'GET',
                },
                {
                    label: 'PATCH',
                    value: 'PATCH',
                },
                {
                    label: 'DELETE',
                    value: 'DELETE',
                },
                {
                    label: 'PUT',
                    value: 'PUT',
                },
            ],
        },
        scopedSlots: true,
        width: 100,
    },
    {
        title: '请求时间',
        dataIndex: 'requestTime',
        key: 'requestTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
        width: 200,
    },
    {
        title: '请求耗时',
        dataIndex: 'responseTime',
        key: 'responseTime',
        scopedSlots: true,
        width: 100,
    },
    {
        title: '请求用户',
        dataIndex: 'username',
        key: 'username',
        search: {
            type: 'string',
        },
        width: 150,
        scopedSlots: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 150,
        scopedSlots: true,
    },
];

const descriptionsData = ref<AccessLogItem>();
const visible = ref<boolean>(false);

const handleOk = (e: MouseEvent) => {
    visible.value = false;
};

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) {
        return [];
    }
    return [
        {
            key: 'eye',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: (data: AccessLogItem) => {
                descriptionsData.value = data;
                visible.value = true;
            },
        },
    ];
};

const column = {
    username: 'context.username',
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = modifySearchColumnValue(e, column);
};
</script>
