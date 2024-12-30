<template>
    <div>
        <pro-search :columns="columns" target="search-access" @search="handleSearch" />
        <j-pro-table
            ref="tableRef"
            mode="TABLE"
            :columns="columns"
            :request="queryAccess"
            :defaultParams="{
                sorts: [{ name: 'responseTime', order: 'desc' }],
            }"
            :params="params"
        >
            <template #requestTime="slotProps">
                {{
                dayjs(slotProps.requestTime).format('YYYY-MM-DD HH:mm:ss')
                }}
            </template>
            <template #description="slotProps">
                {{ slotProps.action }}
            </template>
            <template #responseTime="slotProps">
                <a-tag color="purple">
                    {{ slotProps.responseTime - slotProps.requestTime }} ms
                </a-tag>
            </template>
            <template #username="slotProps">

                    <!-- <j-tag color="geekblue"> -->
                    <div class="userName">
                        <j-ellipsis style="max-width: 100px;">
                        {{ slotProps.context.userName }}
                    </j-ellipsis>
                     <!-- </j-tag> -->
                </div>
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <template
                            v-for="i in getActions(slotProps)"
                            :key="i.key"
                        >
                            <j-permission-button
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
                            </j-permission-button>
                        </template>
                </a-space>
            </template>
        </j-pro-table>
    </div>
    <a-modal :width="1100" v-model:visible="visible" :title="$t('Access.index.480752-0')">
        <a-descriptions :labelStyle="{width: '200px'}" :data="descriptionsData" title="" bordered :column="2">
            <a-descriptions-item label="URL">
                {{ descriptionsData?.url }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Access.index.480752-1')">
                {{ descriptionsData?.httpMethod }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Access.index.480752-2')">
                {{ descriptionsData?.action }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Access.index.480752-3')">
                {{ descriptionsData?.target }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Access.index.480752-4')">
                {{ descriptionsData?.method }}
            </a-descriptions-item>
            <a-descriptions-item label="IP">
                {{ descriptionsData?.ip }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Access.index.480752-5')">
                {{
                dayjs(descriptionsData?.requestTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    )
                }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Access.index.480752-6')">
                {{
                    descriptionsData?.responseTime -
                    descriptionsData?.requestTime +
                    'ms'
                }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Access.index.480752-7')" :span="2">
                {{ descriptionsData?.httpHeaders }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Access.index.480752-8')" :span="2">
                {{ descriptionsData?.parameters }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('Access.index.480752-9')" :span="2">
                {{ descriptionsData.exception }}
            </a-descriptions-item>
        </a-descriptions>
        <template #footer>
            <a-button type="primary" @click="handleOk">{{ $t('Access.index.480752-10') }}</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts" setup name="AccessLog">
import type { ActionsType } from '../typings';
import { queryAccess } from '@/api/log';
import dayjs from 'dayjs';
import { modifySearchColumnValue } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
        title: $t('Access.index.480752-11'),
        dataIndex: 'url',
        key: 'url',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: $t('Access.index.480752-12'),
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: $t('Access.index.480752-1'),
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
        title: $t('Access.index.480752-5'),
        dataIndex: 'requestTime',
        key: 'requestTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
        width: 200,
    },
    {
        title: $t('Access.index.480752-6'),
        dataIndex: 'responseTime',
        key: 'responseTime',
        scopedSlots: true,
        width: 100,
    },
    {
        title: $t('Access.index.480752-13'),
        dataIndex: 'username',
        key: 'username',
        // search: {
        //     type: 'string',
        // },
        width: 150,
        scopedSlots: true,
    },
    {
        title: $t('Access.index.480752-14'),
        key: 'action',
        fixed: 'right',
        width: 100,
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
            text: $t('Access.index.480752-15'),
            tooltip: {
                title: $t('Access.index.480752-15'),
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
    list-style: none;
    font-feature-settings: 'tnum';
    display: inline-block;
    height: auto;
    margin-right: 8px;
    padding: 0 7px;
    font-size: 12px;
    line-height: 20px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    opacity: 1;
}
</style>
