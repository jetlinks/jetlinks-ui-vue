<template>
  <div>
    <j-data-table
        :dataSource="dataSource"
        :columns="newColumns"
        :showTool="false"
        :serial="true"
        ref="tableRef"
    >
      <template #range="{data}">
        {{ data.record.range === true ? '范围值' : '固定值'}}
      </template>
      <template #value="{data}">
        {{ data.record.range === true ? data.record.value?.join('-') : data.record.value }}
      </template>
      <template #action="{data}">
        <j-button
            type="link"
            @click="() => deleteItem(data.index)"
        >
          <AIcon type="DeleteOutlined" />
        </j-button>
      </template>
    </j-data-table>
    <j-button style="width: 100%;margin-top: 16px;" @click="addItem" >
      <template #icon><AIcon type="PlusOutlined" /></template>
      添加指标值
    </j-button>
  </div>
</template>

<script setup name="Metrics" lang="ts">
import { defineExpose, provide } from 'vue'
import MetricValueItem from './ValueItem.vue'
import {validatorConfig} from "@/views/device/components/Metadata/Base/columns";
import BooleanSelect from "@/views/device/components/Metadata/Base/components/Properties/Metrics/BooleanSelect.vue";

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: undefined
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
    form: {
      required: true,
      rules: [{
        callback(rule:any,value: any, dataSource: any[]) {
          if (value) {
            const field = rule.field.split('.')
            const fieldIndex = Number(field[1])
            const hasId = dataSource.some((item, index) => item.id === value && fieldIndex !== index)
            if (hasId) {
              return Promise.reject('该标识已存在')
            }
            return Promise.resolve()
          }
          return Promise.reject('请输入标识')
        },
      },
        { max: 64, message: '最多可输入64个字符' },
        {
          pattern: /^[a-zA-Z0-9_\-]+$/,
          message: 'ID只能由数字、字母、下划线、中划线组成',
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
          callback(rule:any,value: any) {
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
    type: 'components',
    components: {
      name: MetricValueItem
    },
    form: {
      required: true,
      rules: [
        {
          callback(rule:any,value: any) {
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
        type: 'components',
        components: {
          name: BooleanSelect
        }
    })
    return data
  }
  return columns
})

const rules = []

const addItem = () => {
  const data = {
    id: undefined,
    name: undefined,
    range: false,
    value: undefined,
  }

  tableRef.value.addItem(data)
}

const deleteItem = (index: number) => {
  tableRef.value.removeItem(index)
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