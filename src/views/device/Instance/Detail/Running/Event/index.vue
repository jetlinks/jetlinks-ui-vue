<template>
    <Search :columns="columns" target="device-instance-running-events" />
    <JTable
        ref="eventsRef"
        :columns="columns"
        :dataSource="dataSource"
        model="TABLE"
        :bodyStyle="{padding: '0 24px'}"
    >
        <template #timestamp="slotProps">
            {{ moment(slotProps.timestamp).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #action="slotProps">
            <a-button type="link" @click="detail(slotProps)">
                <AIcon type="SearchOutlined" />
            </a-button>
        </template>
    </JTable>
</template>

<script lang="ts" setup>
import moment from 'moment'
const events = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
})

const columns = ref<Record<string, any>>([
    {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
        scopedSlots: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
    }
])

const dataSource = ref<Record<string, any>[]>([])

watchEffect(() => {
    if(events.data?.valueType?.type === 'object'){
        (events.data.valueType?.properties || []).map((i: any) => {
            columns.value.splice(0, 0, {
              key: i.id,
              title: i.name,
              dataIndex: `${i.id}_format`,
            //   renderText: (text) => (typeof text === 'object' ? JSON.stringify(text) : text),
            })
        })
    } else {
        columns.value.splice(0, 0, {
            title: '数据',
            dataIndex: 'value',
        })
    }
})

const detail = () => {

}
</script>