<template>
    <div class="log-warp">
        <pro-search
            type="simple"
            :columns="columns"
            :style="{ padding: 0, marginBottom: 0 }"
            @search="handleSearch"
        />
        <JProTable
            ref="tableRef"
            model="CARD"
            style="padding: 12px 0 0"
            :columns="columns"
            :request="queryTask"
            :params="params"
            :gridColumn="1"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: [
                    {
                        column: 'jobType',
                        value: type,
                    },
                ],
            }"
        >
            <template #card="slotProps">
                <Card
                    :key="slotProps.id"
                    :detail="slotProps"
                    :type="type"
                    @reload="reload"
                    @click="() => onClick(slotProps)"
                />
            </template>
        </JProTable>
        <TaskDetail
            v-if="visible"
            :data="current"
            @copy="onCopy"
            @refresh="reload"
            @closeDetail="taskDetailClose"
        />
    </div>
</template>

<script setup name="BatchLog">
import { queryTask } from '@/api/edge/batch';
import Card from './Card.vue';
import TaskDetail from './TaskDetail.vue';
import { getContext } from '../util';

const props = defineProps({
    type: {
        type: String,
        default: undefined,
    },
});
const context = getContext();
const params = ref();
const tableRef = ref();
const visible = ref(false);
const current = ref({});

const columns = [
    {
        title: '操作类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '涉及网关',
        dataIndex: 'gateway',
        key: 'gateway',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
    {
        title: '全部任务',
        dataIndex: 'all',
        hideInTable: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '全部完成',
        dataIndex: 'complete',
        hideInTable: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '进行中',
        dataIndex: 'running',
        hideInTable: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '未完成',
        dataIndex: 'incomplete',
        hideInTable: true,
        search: {
            type: 'string',
        },
    },
];

const handleSearch = (e, terms) => {
    const _terms = terms?.terms?.[0]?.terms?.filter((item) => item);
    if (_terms?.length) {
        const newParams = [];
        const termsItem = _terms[0];

        if (termsItem.value) {
            const item = e.terms[0].terms[0];
            newParams.push({
                ...item,
                column: 'name',
            });
        }

        if (termsItem.column !== 'all') {
            newParams.push({
                column: 'state',
                value: termsItem.column,
                type: 'and',
            });
        }

        params.value = newParams.length
            ? {
                  terms: [
                      {
                          terms: newParams,
                          type: 'and',
                      },
                  ],
              }
            : e;
    } else {
        params.value = e;
    }
};

const reload = () => {
    tableRef.value?.reload();
};

const onCopy = () => {
    context.openTask({
        thingList: (current.value?.others?.thingList || []).map((item) => ({
            ...item,
            label: item.name || item.thingName,
            value: item.id || item.thingId,
        })),
        jobType: props.type,
    });
};

const onClick = (record) => {
    visible.value = true;
    current.value = record;
};
const taskDetailClose = () => {
    visible.value = false;
    current.value = {};
};

defineExpose({
    reload,
});
</script>

<style scoped lang="less">
.log-warp {
    .header {
        padding: 16px 0;
        font-size: 18px;
    }
}
</style>
