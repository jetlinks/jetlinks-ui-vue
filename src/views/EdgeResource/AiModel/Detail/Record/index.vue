<template>
    <pro-search
        :columns="columns"
        @search="handleSearch"
        type="simple"
    ></pro-search>
    <JProTable
        ref="tableRef"
        :request="queryTaskDetailPage"
        :columns="columns"
        :gridColumn="1"
        model="CARD"
        :defaultParams="defaultParams"
        :params="params"
    >
        <template #card="slotProps">
            <Card :detail="slotProps" @reload="onReload"/>
        </template>
    </JProTable>
</template>

<script setup lang="ts">
import {queryTaskDetailPage} from '@/api/edge-resource';
import {PropType} from "vue";
import Card from './Card.vue';

const props = defineProps({
    data: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({}),
    }
})
const tableRef = ref();
const defaultParams = {
    terms: [
        {
            column: "targetId",
            termType: "eq",
            value: props.data.targetId,
        }
    ]
}

const params = ref({});
const columns = [
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
        search: {
            type: 'date'
        }
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {label: '全部完成', value: 'complete'},
                {label: '未完成', value: 'incomplete'},
                {label: '进行中', value: 'running'},
            ]
        }
    },
]

const handleSearch = (e: any) => {
    params.value = e
}

const onReload = () => {
    tableRef.value?.reload();
}

</script>

<style scoped lang="less">

</style>