<template>
  <j-table
    model='TABLE'
    :pagination='false'
    :data-source='dataSource.value'
    :columns='columns'
    :bodyStyle='{ padding: 0}'
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if='column.dataIndex === "name"'>
        <Ellipsis>
         {{ record.name }}
        </Ellipsis>
      </template>
      <template v-if='column.dataIndex === "type"'>
        {{ record.type }}
        <j-tooltip
          v-if="record.type === 'object'"
        >
          <template slot="title">
            请按照json格式输入
          </template>

          <AIcon
            type="QuestionCircleOutlined"
            :style="{
               marginLeft: '5px',
               cursor: 'help',
            }"
          />
        </j-tooltip>
      </template>
      <template v-if='column.dataIndex === "value"'>
        <div style='max-width: 260px'>
          <ValueItem
            v-model:modelValue='record.value'
            :itemType="record.type"
            :options="record.options"
            @change='valueChange'
          />
        </div>
      </template>
    </template>
  </j-table>
</template>

<script setup lang='ts' name='FunctionCall'>
import type { PropType } from 'vue'

type Emit = {
  (e: 'change', data: Array<{ name: string, value: any}>): void
  (e: 'update:value', data: Array<{ name: string, value: any}>): void
}

const emit = defineEmits<Emit>()

const props = defineProps({
  value: {
    type: Array as PropType<Array<{ label: string, value: any}>>,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  }
})

const dataSource = reactive<{value: any[]}>({
  value: []
})

const columns = [
  {
    title: '参数名称',
    dataIndex: 'name',
    width: 300
  },
  {
    title: '类型',
    dataIndex: 'type'
  },
  {
    title: '值',
    dataIndex: 'value',
    align: 'center',
    width: 260
  },
]

const valueChange = () => {
  const _value = dataSource.value.map(item => {
    return {
      name: item.id, value: item.value
    }
  })
  emit('update:value', _value)
  emit('change', _value)
}

watch(() => props.data, () => {
  dataSource.value = props.data.map((item: any) => {
    const oldValue = props.value.find((oldItem: any) => oldItem.name === item.id)
    return oldValue ? { ...item, value: oldValue.value } : item
  })
}, { immediate: true, deep: true })

</script>

<style scoped>

</style>