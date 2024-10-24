<template>
    <j-pro-table
        :columns="columns"
        :request="query"
        model="TABLE"
        style="padding: 0"
    >
        <template #access="slotProps">
            {{slotProps?.accessModes.map(item => item.text).join(',')}}
        </template>
        <template #interval="slotProps">
            {{slotProps.configuration?.interval || slotProps.interval}}ms
        </template>
        <template #pushRule="slotProps">
            {{slotProps.feature?.find(item => item.value === 'changedOnly') ? '只推送变化的数据' : '总是推送数据'}}
        </template>
    </j-pro-table>
</template>

<script setup lang="ts">
import _ from "lodash-es";
import { randomString } from "@/utils/utils";

const props = defineProps({
    dataSource: {
        type: Array,
        default: () => ([])
    }
})

const _params = ref({})
const columns = [
    {
        title: '点位名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true
    },
    {
        title: '访问类型',
        dataIndex: 'access',
        key: 'access',
        ellipsis: true,
        scopedSlots: true
    },
    {
        title: '采集频率',
        dataIndex: 'interval',
        key: 'interval',
        ellipsis: true,
        scopedSlots: true
    },
    {
        title: '推送规则',
        dataIndex: 'pushRule',
        key: 'pushRule',
        ellipsis: true,
        scopedSlots: true
    }
]

const query = (params: Record<string, any>) => {
    return new Promise((resolve) => {
        const _from = params.pageIndex * params.pageSize;
        const _to = (params.pageIndex + 1) * params.pageSize;
        let arr = _.cloneDeep(props.dataSource);
        resolve({
            success: true,
            message: 'success',
            status: 200,
            result: {
                data: arr.slice(_from, _to),
                pageIndex: params.pageIndex || 0,
                pageSize: params.pageSize || 12,
                total: arr.length,
            }
        })
    })
}
</script>

<style scoped lang="less">
.point-table {
    .point-header {
        background: #f2f2f2;
        display: grid;
        padding: 0.5rem 1rem;
        border-radius: 6px;
    }
    .point-body-row {
        display: grid;
        padding: 0.4rem 1rem;
    }
}
</style>