<template>
  <a-row :futter='[24, 24]'>
    <a-col :span='10'>
      <a-select
        showSearch
        style='width: 100%'
        placeholder='请选择属性'
        v-model:value='reportKey'
        :options='properties'
        :filter-option='filterSelectNode'
        @change='change'
      />
    </a-col>
    <a-col :span='14'>
      <span style='line-height: 32px;padding-left: 24px'>
        定时调用所选属性
      </span>
    </a-col>
    <a-col :span='24' v-if='showTable'>
      <div style='margin-top: 24px'>
        <FunctionCall
          :value='_value'
          :data='callDataOptions'
          @change='callDataChange'
        />
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang='ts' name='WriteProperties'>
import { filterSelectNode } from '@/utils/comm'
import { FunctionCall } from '../components'
import type { PropType } from 'vue'

type Emit = {
  (e: 'update:value', data: Record<string, any>): void
  (e: 'update:action', data: string): void
}

const props = defineProps({
  value: {
    type: Object as PropType<Record<string, any>>,
    default: () => []
  },
  action: {
    type: String,
    default: ''
  },
  properties: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits<Emit>()

const reportKey = ref<string>()
const callData = ref<Array<{ id: string, value: string | undefined }>>()
const _value = ref([])

const callDataOptions = computed(() => {
  const _valueKeys = Object.keys(props.value)
  if (_valueKeys.length) {
    return _valueKeys.map(key => {
      const item: any = props.properties.find((p: any) => p.id === key)
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

const showTable = computed(() => {
  return !!reportKey.value
})

const change = (v: string, option: any) => {
  console.log(v, option)
  const _data = {
    [v]: undefined
  }
  callData.value = [{ id: v, value: undefined }]
  emit('update:value', _data)
  emit('update:action', `修改${option.name}`)
}

const callDataChange = (v: any[]) => {
  emit('update:value', {
    [reportKey.value!]: v[0]?.value
  })
}

const initRowKey = () => {
  if (props.value.length) {
    const keys = Object.keys(props.value)
    reportKey.value = keys[0]
  }
}

</script>

<style scoped>

</style>