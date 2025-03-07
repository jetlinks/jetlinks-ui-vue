<template>
    <pro-search
        :columns="columns"
        target="device-instance-log"
        @search="handleSearch"
        class="device-log-search"
    />
    <JProTable
        ref="instanceRefLog"
        :columns="columns"
        :request="(e: Record<string, any>) => queryLogByEdge(edgeId,instanceStore.current.id, e)"
        model="TABLE"
        :defaultParams="{ sorts: [{ name: 'timestamp', order: 'desc' }] }"
        :params="params"
        :bodyStyle="{ padding: 0 , minHeight: 'auto' }"
    >
        <template #type="slotProps">
            {{ slotProps?.type?.text }}
        </template>
        <template #content="slotProps">
           <Ellipsis style="width:calc(100% - 20px)">{{ slotProps?.content }}</Ellipsis>
        </template>
        <template #timestamp="slotProps">
            {{
                slotProps.timestamp
                    ? dayjs(slotProps.timestamp).format('YYYY-MM-DD HH:mm:ss')
                    : ''
            }}
        </template>
        <template #action="slotProps">
            <j-space :size="16">
                <template
                    v-for="i in getActions(slotProps, 'table')"
                    :key="i.key"
                >
                    <j-button
                        @click="i.onClick"
                        type="link"
                        style="padding: 0px"
                    >
                        <template #icon><AIcon :type="i.icon" /></template>
                    </j-button>
                </template>
            </j-space>
        </template>
    </JProTable>
</template>

<script lang="ts" setup>
import type { ActionsType } from '@/components/Table';
import { queryLog, queryLogsType } from '@/api/device/instance';
import {queryLogByEdge} from '@/api/edge/batch';
import { useInstanceStore } from '@/store/instance';
import dayjs from 'dayjs';
import { Modal, Textarea } from 'jetlinks-ui-components';

const params = ref<Record<string, any>>({});
const instanceStore = useInstanceStore();
const edgeId = inject('_edgeId')

const columns = [
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    queryLogsType().then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.text,
                                value: item.value,
                            })),
                        );
                    });
                }),
        },
    },
    {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
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
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    return [
        {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'SearchOutlined',
            onClick: () => {
                let content = '';
                try {
                    content = JSON.stringify(JSON.parse(data.content), null, 2);
                } catch (error) {
                    content = data.content;
                }
                Modal.info({
                    title: '详细信息',
                    width: 700,
                    content: h(Textarea, {
                        bordered: false,
                        rows: 15,
                        value: content,
                    }),
                });
            },
        },
    ];
};

const handleSearch = (_params: any) => {
    params.value = _params;
};
</script>

<style lang="less" scoped>
.device-log-search {
    padding: 0;
}
</style>
