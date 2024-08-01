<template>
    <div>
        <pro-search :columns="columns" target="search-access" @search="handleSearch" />
        <j-pro-table
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
            <template #description="slotProps">
                {{ slotProps.action }}
            </template>
            <template #responseTime="slotProps">
                <j-tag color="purple">
                    {{ slotProps.responseTime - slotProps.requestTime }} ms
                </j-tag>
            </template>
            <template #username="slotProps">

                    <!-- <j-tag color="geekblue"> -->
                    <div class="userName">
                        <Ellipsis style="max-width: 100px;">
                        {{ slotProps.context.userName }}
                    </Ellipsis>
                     <!-- </j-tag> -->
                </div>
            </template>



            <template #action="slotProps">
                <j-space :size="16">
                    <template
                            v-for="i in getActions(slotProps)"
                            :key="i.key"
                        >
                            <PermissionButton
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0 5px"
                            >
                                <template #icon
                                    ><AIcon :type="i.icon"
                                /></template>
                            </PermissionButton>
                        </template>
                </j-space>
            </template>
        </j-pro-table>
    </div>
    <j-modal :width="1100" v-model:visible="visible" title="详情">
        <j-descriptions :data="descriptionsData" title="" bordered :column="2">
            <j-descriptions-item label="URL">
                {{ descriptionsData?.url }}
            </j-descriptions-item>
            <j-descriptions-item label="请求方法">
                {{ descriptionsData?.httpMethod }}
            </j-descriptions-item>
            <j-descriptions-item label="动作">
                {{ descriptionsData?.action }}
            </j-descriptions-item>
            <j-descriptions-item label="类名">
                {{ descriptionsData?.target }}
            </j-descriptions-item>
            <j-descriptions-item label="方法名">
                {{ descriptionsData?.method }}
            </j-descriptions-item>
            <j-descriptions-item label="IP">
                {{ descriptionsData?.ip }}
            </j-descriptions-item>
            <j-descriptions-item label="请求时间">
                {{
                    moment(descriptionsData?.requestTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    )
                }}
            </j-descriptions-item>
            <j-descriptions-item label="请求耗时">
                {{
                    descriptionsData?.responseTime -
                    descriptionsData?.requestTime +
                    'ms'
                }}
            </j-descriptions-item>
            <j-descriptions-item label="请求头" :span="2">
                {{ descriptionsData?.httpHeaders }}
            </j-descriptions-item>
            <j-descriptions-item label="请求参数" :span="2">
                {{ descriptionsData?.parameters }}
            </j-descriptions-item>
            <j-descriptions-item label="异常信息" :span="2">
                {{ descriptionsData.exception }}
            </j-descriptions-item>
        </j-descriptions>
        <template #footer>
            <j-button type="primary" @click="handleOk">关闭</j-button>
        </template>
    </j-modal>
</template>
<script lang="ts" setup name="AccessLog">
import type { ActionsType } from '@/components/Table/index';
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
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
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
        // search: {
        //     type: 'string',
        // },
        width: 150,
        scopedSlots: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 60,
        scopedSlots: true,
    },
];

const descriptionsData = ref<any>({
    url: '',
    httpMethod: '',
    action: '',
    target: '',
    method: '',
    ip: '',
    requestTime: 0,
    responseTime: 0,
    httpHeaders: '',
    parameters: '',
    exception: '',
});
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
            onClick: () => {
                descriptionsData.value = data;
                visible.value = true;
            },
        },
    ];
};

const column = {
    username: 'context.username',
    description: 'action',
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = modifySearchColumnValue(e, column);
};
</script>
<style scoped lang="less">
.userName{
    color: #1677FF;
    background: #f0f5ff;
    border-color: #adc6ff;
    list-style: none;
    font-feature-settings: 'tnum';
    display: inline-block;
    height: auto;
    margin-right: 8px;
    padding: 0 7px;
    font-size: 12px;
    line-height: 20px;border: 1px solid #d9d9d9;
    border-radius: 2px;
    opacity: 1;
}
</style>
