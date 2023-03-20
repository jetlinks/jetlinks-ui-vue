<template>
  <j-form ref='invokeForm' :model='formModel' layout='vertical' :colon='false'>
    <j-row :gutter='24'>
      <j-col :span='10'>
        <j-form-item
          name='functionId'
          :rules="[{ required: true, message: '请选择功能' }]"
        >
          <j-select
            showSearch
            allowClear
            v-model:value='formModel.functionId'
            style='width: 100%'
            placeholder='请选择功能'
            :options='functions'
            :filterOption='filterSelectNode'
            @select='onSelect'
          />
        </j-form-item>
      </j-col>
      <j-col :span='14'>
        <j-form-item>定时调用所选功能</j-form-item>
      </j-col>
      <j-col :span='24'>
        <FunctionCall
          :value='_value'
          :data='functionData'
          @change='callDataChange'
        />
      </j-col>
    </j-row>
  </j-form>
</template>

<script setup lang='ts' name='InvokeFunction'>
import { filterSelectNode } from '@/utils/comm'
import { FunctionCall } from '../components'
import type { PropType } from 'vue'
import { defineExpose } from 'vue'

type Emit = {
  (e: 'update:functionParameters', data: Array<Record<string, any>>): void
  (e: 'update:functionId', data: string): void
  (e: 'update:action', data: string): void
}

const props = defineProps({
  functionId: {
    type: String,
    default: undefined
  },
  functionParameters: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => []
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
const invokeForm = ref()
const formModel = reactive({
  functionId: props.functionId
})
const _value = ref<any[]>(props.functionParameters)

/**
 * 获取当前选择功能属性
 */
const functionData = computed(() => {
  const functionItem: any = props.functions.find((f: any) => f.id === formModel.functionId)
  const arrCache = []

  if (functionItem) {
    const properties = functionItem.valueType ? functionItem.valueType.properties : functionItem.inputs;
    for (const datum of properties) {
      arrCache.push({
        id: datum.id,
        name: datum.name,
        type: datum.valueType ? datum.valueType.type : '-',
        format: datum.valueType ? datum.valueType.format : undefined,
        options: datum.valueType ? datum.valueType.elements : undefined,
        value: undefined,
      });
    }
  }

  return arrCache
})

const onSelect = (v: string, item: any) => {
  emit('update:action', `执行${item.name}`)
  emit('update:functionId', v)
}

const callDataChange = (v: any[]) => {
  _value.value = v
  emit('update:functionParameters', v)
}

defineExpose({
  validateFields: () => new Promise(async (resolve)  => {
    const data = await invokeForm.value?.validateFields()
    resolve(data)
  })
})

</script>

<style scoped>

</style>