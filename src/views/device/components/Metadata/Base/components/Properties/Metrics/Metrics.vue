<template>
  <div>
    <j-data-table
        :dataSource="dataSource"
        :columns="columns"
        :showTool="false"
        :serial="true"
        ref="tableRef"
    >
      <template #range="{data}">
        {{ data.record.range === 'true' ? '范围值' : '固定值'}}
      </template>
      <template #value="{data}">
        {{ data.record.range === 'true' ? data.record.value.toString() : data.record.value }}
      </template>
      <template #action="data">
        <j-button
            type="link"
            @click="() => deleteItem(data.index)"
        >
          <AIcon type="DeleteOutlined" />
        </j-button>
      </template>
    </j-data-table>
    <j-button style="width: 100%;margin-top: 16px;" @click="addItem">
      <template #icon><AIcon type="PlusOutlined" /></template>
      添加指标值
    </j-button>
  </div>
</template>

<script setup name="Metrics" lang="ts">
import { defineExpose } from 'vue'
import MetricValueItem from './ValueItem.vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:value'])

const dataSource = ref<any[]>([])
const tableRef = ref()

const columns = [
  {
    title: '指标标识',
    dataIndex: 'id',
    width: 120,
    type: 'text'
  },
  {
    title: '指标名称',
    dataIndex: 'name',
    type: 'text'
  },
  {
    title: '指标值',
    dataIndex: 'range',
    width: 120,
    type: 'booleanSelect',
    components: {
      props: {
        trueText: '范围值',
        trueValue: 'true',
        falseText: '固定值',
        falseValue: 'false',
      }
    }
  },
  {
    title: '指标配置',
    dataIndex: 'value',
    width: 100,
    type: 'components',
    components: {
      name: MetricValueItem
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60,
  },
];

const rules = []

const addItem = () => {
  const data = {
    id: undefined,
    name: undefined,
    range: 'false',
    value: undefined,
  }
  tableRef.value?.addItem(data)
}

const deleteItem = (index: number) => {
  dataSource.value = dataSource.value.slice(index, 1)
}

const cancel = () => {
  dataSource.value = props.value || []
}

const confirm = () => {

}

const getData = () => {
  return new Promise((resolve, reject) =>  {
    tableRef.value.getData().then((data: any) => {
      resolve(data)
    }).catch(() => {
      reject(false)
    })
  })
}

watch(() => props.value, () => {
  dataSource.value = props.value || []
}, { immediate: true, deep: true})

defineExpose({ getData })
</script>

<style scoped>

</style>