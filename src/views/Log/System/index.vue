<template>
    <div>
        <pro-search :columns="columns" target="search-system" @search="handleSearch" />
        <j-pro-table
            ref="tableRef"
            model="TABLE"
            :columns="columns"
            :request="querySystem"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
            }"
            :params="params"
        >
            <template #level="slotProps">
                <a-tag
                    :color="
                        slotProps.level === 'WARN'
                            ? 'orange'
                            : slotProps.level === 'ERROR'
                            ? 'red'
                            : slotProps.level === 'DEBUG'
                            ? 'blue'
                            : 'green'
                    "
                >
                    {{ slotProps.level }}
                </a-tag>
            </template>
            <template #createTime="slotProps">
                {{ dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #server="slotProps">
                {{ slotProps.context.server }}
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
    <a-modal :width="1100" v-model:visible="visible" :title="$t('System.index.112006-0')">
        <div>
            <span class="mr-10">[{{ descriptionsData?.threadName }}]</span>
            <span class="mr-10">{{
                dayjs(descriptionsData?.createTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                )
            }}</span>
            <span>{{ descriptionsData?.className }}</span>
        </div>
        <div class="mb-10">
            <a-tag
                :color="
                    descriptionsData?.level === 'WARN'
                        ? 'orange'
                        : descriptionsData?.level === 'ERROR'
                        ? 'red'
                        : descriptionsData?.level === 'DEBUG'
                        ? 'blue'
                        : 'green'
                "
            >
                {{ descriptionsData?.level }}
            </a-tag>
            <span>{{ descriptionsData?.message }}</span>
        </div>
      <div class="warn-content">
        {{ descriptionsData.exceptionStack }}
      </div>
<!--        <j-textarea-->
<!--            v-model:value=""-->
<!--            placeholder="暂无数据"-->
<!--            :auto-size="{ minRows: 24, maxRows: 28 }"-->
<!--        />-->
        <template #footer>
            <a-button type="primary" @click="handleOk">{{ $t('System.index.112006-1') }}</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts" setup name="SystemLog">
import type { ActionsType } from '../typings';
import type { SystemLogItem } from '../typings';
import { querySystem } from '@/api/log';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
import { modifySearchColumnValue } from '@/utils/comm';

const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: $t('System.index.112006-2'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        scopedSlots: true,
        width: 400,
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: $t('System.index.112006-3'),
        dataIndex: 'level',
        key: 'level',
        search: {
            type: 'select',
            options: [
                {
                    label: 'ERROR',
                    value: 'ERROR',
                },
                {
                    label: 'INFO',
                    value: 'INFO',
                },
                {
                    label: 'DEBUG',
                    value: 'DEBUG',
                },
                {
                    label: 'WARN',
                    value: 'WARN',
                },
            ],
        },
        scopedSlots: true,
        width: 100,
    },
    {
        title: $t('System.index.112006-4'),
        dataIndex: 'message',
        key: 'message',
        search: {
            type: 'string',
        },
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: $t('System.index.112006-5'),
        dataIndex: 'server',
        key: 'server',
        scopedSlots: true,
        search: {
            type: 'string',
        },
        width: 200,
        ellipsis: true,
    },
    {
        title: $t('System.index.112006-6'),
        dataIndex: 'createTime',
        key: 'createTime',
        search: {
            type: 'date',
        },
        scopedSlots: true,
        width: 200,
    },
    {
        title: $t('System.index.112006-7'),
        key: 'action',
        fixed: 'right',
        width: 100,
        scopedSlots: true,
    },
];

const descriptionsData = ref<SystemLogItem>({
    id: '',
    threadName: '',
    createTime: 0,
    className: '',
    level: '',
    message: '',
    exceptionStack: '',
    context: '',
    lineNumber: 0,
    methodName: '',
    name: '',
    threadId: '',
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
            text: $t('System.index.112006-8'),
            tooltip: {
                title: $t('System.index.112006-8'),
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
    server: 'context.server',
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
.mr-10 {
    margin-right: 10px;
}
.mb-10 {
    margin-bottom: 10px;
}
.warn-content {
  border: 1px solid #d9d9d9;
  padding: 12px;
  border-radius: 2px;
}
</style>
