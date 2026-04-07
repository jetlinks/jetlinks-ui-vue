<template>
    <pro-search
        :columns="columns"
        target="device-instance-log"
        @search="handleSearch"
        class="device-log-search"
        :saveButton='false'
    />
    <JProTable
        ref="instanceRefLog"
        :columns="columns"
        :request="(e) => queryLog(instanceStore.current.id, e)"
        mode="TABLE"
        :defaultParams="{ sorts: [{ name: 'timestamp', order: 'desc' }] }"
        :params="params"
        :bodyStyle="{ padding: 0 , minHeight: 'auto' }"
    >
        <template #type="slotProps">
            {{ slotProps?.type?.text }}
        </template>
        <template #content="slotProps">
           <j-ellipsis style="width:calc(100% - 20px)">{{ slotProps?.content }}</j-ellipsis>
        </template>
        <template #timestamp="slotProps">
            {{
                slotProps.timestamp
                    ? dayjs(slotProps.timestamp).format('YYYY-MM-DD HH:mm:ss')
                    : ''
            }}
        </template>
        <template #action="slotProps">
            <a-space :size="16">
                <template
                    v-for="i in getActions(slotProps, 'table')"
                    :key="i.key"
                >
                    <a-button
                        @click="i.onClick"
                        type="link"
                        style="padding: 0px"
                    >
                        <template #icon><AIcon :type="i.icon" /></template>
                    </a-button>
                </template>
            </a-space>
        </template>
    </JProTable>
</template>

<script lang="ts" setup>
import { queryLog, queryLogsType } from '../../../../../api/instance';
import { useInstanceStore } from '../../../../../store/instance';
import dayjs from 'dayjs';
import { Modal, Textarea } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const params = ref<Record<string, any>>({});
const instanceStore = useInstanceStore();

const columns = [
    {
        title: $t('Log.index.848256-0'),
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
        title: $t('Log.index.848256-1'),
        dataIndex: 'timestamp',
        key: 'timestamp',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('Log.index.848256-2'),
        dataIndex: 'content',
        key: 'content',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Log.index.848256-3'),
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): any[] => {
    if (!data) return [];
    return [
        {
            key: 'view',
            text: $t('Log.index.848256-4'),
            tooltip: {
                title: $t('Log.index.848256-4'),
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
                    title: $t('Log.index.848256-5'),
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
