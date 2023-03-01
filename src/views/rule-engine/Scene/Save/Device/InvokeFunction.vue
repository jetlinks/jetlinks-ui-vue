<template>
  <a-row :gutter='24'>
    <a-col :span='10'>
      <a-form-item
        name='functionId'
        :rules="[{ required: true, message: '请选择功能' }]"
      >
        <a-select
          showSearch
          allowClear
          v-model='functionId'
          style='width: 100%'
          placeholder='请选择功能'
          :filterOption='filterSelectNode'
          @select='onSelect'
        />
      </a-form-item>
    </a-col>
    <a-col :span='14'>
      <a-form-item>定时调用所选功能</a-form-item>
    </a-col>
    <a-col :span='24'>
      <a-form-item
        style='margin-top: 24px'
        name='functionParameters'
      >
        <FunctionCall
          v-model:value='_value'
          :data='callDataOptions'
          @change='callDataChange'
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script setup lang='ts' name='InvokeFunction'>
import { filterSelectNode } from '@/utils/comm'
import { FunctionCall } from '../components'

type Emit = {
  (e: 'update:value', data: Record<string, any>): void
  (e: 'update:action', data: string): void
}

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  action: {
    type: String,
    default: ''
  },
  functions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits<Emit>()

const functionId = ref()
const _value = ref([])

const callDataOptions = computed(() => {
  const _valueKeys = Object.keys(props.value)
  if (_valueKeys.length) {
    return _valueKeys.map(key => {
      const item: any = props.functions.find((p: any) => p.id === key)
      if (item) {
        return {
          id: item.id,
          name: item.name,
          type: item.valueType ? item.valueType.type : '-',
          format: item.valueType ? item.valueType.format : undefined,
          options: item.valueType ? item.valueType.element : undefined,
          value: props.value[key]
        }
      }
      return {
        id: key,
        name: key,
        type: '',
        format: undefined,
        options: undefined,
        value: props.value[key]
      }
    })
  }
  return []
})

const onSelect = (v: string, item: any) => {
  emit('update:action', `执行${item.name}`)
}

const callDataChange = () => {

}

</script>

<style scoped>

</style>