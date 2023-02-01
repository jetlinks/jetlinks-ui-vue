<template>
    <JTable
        ref="metadataRef"
        :columns="columns"
        :dataSource="dataSource"
        :bodyStyle="{padding: 0}"
    >
        <template #headerTitle>
            <a-input-search
                placeholder="请输入名称"
                style="width: 300px; margin-bottom: 10px"
                @search="onSearch"
            />
        </template>
        <template #card="slotProps">
            <PropertyCard :data="slotProps" />
        </template>
        <template #value="slotProps">
            <ValueRender :data="slotProps" />
        </template>
        <template #time="slotProps">
            {{slotProps.time || '--'}}
        </template>
        <template #action="slotProps">
            <a-space :size="16">
                <a-tooltip
                    v-for="i in getActions(slotProps)"
                    :key="i.key"
                    v-bind="i.tooltip"
                >
                    <a-popconfirm
                        v-if="i.popConfirm"
                        v-bind="i.popConfirm"
                        :disabled="i.disabled"
                    >
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
</template>

<script lang="ts" setup>
import { PropertyData } from "../../../typings"
import PropertyCard from './PropertyCard.vue'
import ValueRender from './ValueRender.vue'

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '值',
        dataIndex: 'value',
        key: 'value',
        scopedSlots: true
    },
    {
        title: '更新时间',
        dataIndex: 'time',
        key: 'time',
        scopedSlots: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
    },
]

const _data = defineProps({
    data: {
        type: Array,
        default: () => []
    }
})

const dataSource = ref<PropertyData[]>([])

const getActions = (data: Partial<Record<string, any>>) => {
    const arr = []
    if(data.expands?.type?.includes('write')){
        arr.push({
            key: 'edit',
            tooltip: {
                title: '设置属性至设备',
            },
            icon: 'EditOutlined',
            onClick: () => {
                
            },
        })
    }
    if((data.expands?.metrics || []).length && ['int', 'long', 'float', 'double', 'string', 'boolean', 'date'].includes(
        data.valueType?.type || '',
    )){
        arr.push({
            key: 'metrics',
            tooltip: {
                title: '指标',
            },
            icon: 'ClockCircleOutlined',
            onClick: () => {
                
            },
        })
    }
    if(data.expands?.type?.includes('read')){
        arr.push({
            key: 'read',
            tooltip: {
                title: '获取最新属性值',
            },
            icon: 'SyncOutlined',
            onClick: () => {
                
            },
        })
    }
    arr.push({
        key: 'detail',
        text: '详情',
        tooltip: {
            title: '详情',
        },
        icon: 'BarsOutlined',
        onClick: () => {
            
        },
    })
    return arr
}

watchEffect(() => {
    dataSource.value = _data.data as PropertyData[]
})

const onSearch = () => {};

</script>

<style scoped lang="less">
    
</style>