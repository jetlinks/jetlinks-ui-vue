<template>
  <div>
    <EditTable
        ref="tableRef"
        :dataSource="dataSource"
        :columns="newColumns"
        :height="200"
    >
      <template #id="{ record, index }">
        <EditTableFormItem :name="[index, 'id']">
          <a-input v-model:value="record.id" placeholder="请输入标识"/>
        </EditTableFormItem>
      </template>
      <template #name="{ record, index }">
        <EditTableFormItem :name="[index, 'name']">
          <a-input v-model:value="record.name" placeholder="请输入名称"/>
        </EditTableFormItem>
      </template>
      <template #range="{record}">
        <BooleanSelect
          v-model:value="record.range"
          @select="(e) => record.value = e ? [undefined, undefined]: undefined"/>
      </template>
      <template #value="{record, index}">
        <EditTableFormItem :name="[index, 'value']">
          <MetricValueItem
            v-model:value="record.value"
            :range="record.range"
            :options="options"
          />
        </EditTableFormItem>
      </template>
      <template #action="{index}">
        <j-button
            type="link"
            @click="() => deleteItem(index)"
        >
          <AIcon type="DeleteOutlined" />
        </j-button>
      </template>
    </EditTable>
    <j-button style="width: 100%;margin-top: 16px;" @click="addItem" >
      <template #icon><AIcon type="PlusOutlined" /></template>
      添加指标值
    </j-button>
  </div>
</template>

<script setup name="Metrics" lang="ts">
import { defineExpose, provide } from 'vue'
import MetricValueItem from './ValueItem.vue'
import BooleanSelect from "@/views/device/components/Metadata/Base/components/Properties/Metrics/BooleanSelect.vue";
import { EditTable, EditTableFormItem } from '@/components/Metadata/Table'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: undefined
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:value'])

const dataSource = ref<any[]>([])
const tableRef = ref()

provide('metricsType', props.type)


const columns: any = [
  {
    title: '指标标识',
    dataIndex: 'id',
    width: 120,
    type: 'text',
    placement: 'Left',
    form: {
      required: true,
      rules: [
        {
          asyncValidator(_: any, value: any, ...setting) {
            if (value) {
              const option = setting[2]

              if (dataSource.value.filter((_, index) => index !== option.index).some(item => item.value === value)) {
                return Promise.reject('该标识已存在')
              }
              return Promise.resolve()
            }
            return Promise.reject('请输入标识')
          }
        },
        { max: 64, message: '最多可输入64个字符' },
        {
          pattern: /^[a-zA-Z0-9_\-]+$/,
          message: '标识只能由数字、字母、下划线、中划线组成',
        },
      ]
    },
  },
  {
    title: '指标名称',
    dataIndex: 'name',
    type: 'text',
    form: {
      required: true,
      rules: [
        {
          asyncValidator(rule:any,value: any) {
            if (!value) {
              return Promise.reject('请输入指标名称')
            }
            return Promise.resolve()
          }
        },
        { max: 64, message: '最多可输入64个字符' },
      ]
    },
  },

  {
    title: '指标配置',
    dataIndex: 'value',
    width: 100,
    form: {
      rules: [
        {
          asyncValidator(rule:any,value: any) {
            if (!value || (Array.isArray(value) && value.some(item => !item))) {
              return Promise.reject('请配置指标')
            }
            return Promise.resolve()
          }
        },
      ]
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60,
  },
]


const newColumns = computed(() => {
  if (props.type && !['string', 'boolean', 'date'].includes(props.type)) {
    const data = [...columns]
    data.splice(2, 0, {
        title: '指标值',
        dataIndex: 'range',
        width: 120,
    })
    return data
  }
  return columns
})

const addItem = () => {
  dataSource.value.push({
    id: undefined,
    name: undefined,
    range: false,
    value: undefined,
  })
}

const deleteItem = (index: number) => {
  dataSource.value.splice(index, 1)
}

const getData = () => {
  return new Promise((resolve, reject) =>  {
    tableRef.value.validate().then((data: any) => {
      resolve(data)
    }).catch((err) => {
      reject(false)
    })
  })
}

watch(() => props.value, () => {
  dataSource.value = JSON.parse(JSON.stringify(props.value)) || []
}, { immediate: true, deep: true})

defineExpose({ getData })

</script>

<style scoped>

</style>
