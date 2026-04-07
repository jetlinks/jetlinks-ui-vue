<template>
  <EditTable
    ref="tableRef"
    :data-source='dataSource'
    :columns='columns'
    :height='300'
    :scroll="{x: 'max-content'}"
    :disableMenu="false"
    :validateRowKey="true"
  >
    <template #name="{record}">
      <j-ellipsis>
        {{ record.name }}
      </j-ellipsis>
    </template>
    <template #type="{record}">
      {{ record.type }}
      <a-tooltip
        v-if="record.type === 'object'"
      >
        <template slot="title">
          {{ $t('FunctionCall.FunctionCall.9093413-0') }}
        </template>

        <AIcon
          type="QuestionCircleOutlined"
          :style="{
               marginLeft: '5px',
               cursor: 'help',
            }"
        />
      </a-tooltip>
    </template>
    <template #value="{record, index}">
      <JEditTableFormItem
        :name="[index, 'value']"
        :required="record.required"
      >
        <j-value-item
          v-model:modelValue='record.value'
          :itemType="itemType(record.type)"
          :options="record.options"
          :extraProps="{
              style: { width: '100%'}
            }"
        />
      </JEditTableFormItem>
    </template>
  </EditTable>
</template>

<script setup lang='ts' name='FunctionCall'>
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import {EditTable} from '@jetlinks-web/components'

const { t: $t } = useI18n()
type Emit = {
  (e: 'change', data: Array<{ name: string, value: any}>): void
  (e: 'update:value', data: Array<{ name: string, value: any}>): void
}

const emit = defineEmits<Emit>()
const tableRef = ref()

const props = defineProps({
  value: {
    type: Array as PropType<Array<{ label: string, value: any}>>,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  required: {
    type: Boolean,
    default: false
  }
})

const dataSource = ref([])

const columns = [
  {
    title: $t('FunctionCall.FunctionCall.9093413-1'),
    dataIndex: 'name',
    width: 300
  },
  {
    title: $t('FunctionCall.FunctionCall.9093413-2'),
    dataIndex: 'type'
  },
  {
    title: $t('FunctionCall.FunctionCall.9093413-3'),
    dataIndex: 'value',
    align: 'center',
    form: {
      rules:[{
        asyncValidator(rule: any, value: any, ...setting: any){
          const record = setting[1]
          const _required = record.required ?? props.required
          if (_required && (value === null || value === undefined || value === '')) {
            const errorMsg = ['enum', 'boolean', 'time', 'date'].includes(record.type) ? $t('Device.InvokeFunction.372523-7') : $t('Device.InvokeFunction.372523-4')
            return Promise.reject(errorMsg)
          }
          return Promise.resolve();
        }
      }]
    },
    width: 260
  },
]

const itemType = (type: string) => {

  if (type === 'date') {
    return 'time'
  }

  if (['short', 'byte', 'word'].includes(type)) {
    return 'int'
  }

  if (['array','object'].includes(type)) {
    return 'object'
  }

  if (type === 'file') {
    return 'string'
  }

  return type
}

const valueChange = () => {
  const _value = dataSource.value.map(item => {
    return {
      name: item.id, value: item.value
    }
  })
  emit('update:value', _value)
  emit('change', _value)
}

watch(() => props.data, (v,old) => {
  dataSource.value = props.data.map((item: any) => {
    const oldValue = props.value.find((oldItem: any) => oldItem.name === item.id)
    return oldValue ? { ...item, value: oldValue.value } : item
  })
}, { immediate: true, deep: true })

defineExpose({
  validate: async () => {
    const resp = await tableRef.value.validate()
    if (resp) {
      valueChange()
    }
    return resp
  }
})

</script>

<style scoped>

</style>
