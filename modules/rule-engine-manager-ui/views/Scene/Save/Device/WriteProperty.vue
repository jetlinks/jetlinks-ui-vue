<template>
  <a-form ref='writeForm' :model='formModel' layout='vertical' :colon='false'>
    <a-row :futter='[24, 24]'>
      <a-col :span='10'>
        <a-form-item
          name='reportKey'
          :rules="[{ required: true, message: $t('Device.WriteProperty.372527-0') }]"
        >
          <a-select
            showSearch
            style='width: 100%'
            :placeholder="$t('Device.WriteProperty.372527-1')"
            v-model:value='formModel.reportKey'
            :options='properties'
            :filter-option='filterSelectNode'
            @change='change'
          />
        </a-form-item>
      </a-col>
      <a-col :span='14'>
        <span style='line-height: 32px;padding-left: 24px'>
          {{ $t('Device.WriteProperty.372527-2') }}
        </span>
      </a-col>
      <a-col :span='24' v-if='showTable'>
        <FunctionCall
          ref="functionRef"
          :required="true"
          :data='callDataOptions'
          @change='callDataChange'
        />
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang='ts' name='WriteProperties'>
import { filterSelectNode } from '../../../../utils/comm'
import { FunctionCall } from '../components'
import type { PropType } from 'vue'
import { defineExpose } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
const functionRef = ref()
const formModel = reactive<{ reportKey: string | undefined, data: any[] }>({
  reportKey: undefined,
  data: Object.keys(props.value).map(key => {
    return { name: key, value: props.value[key] }
  }) || []
})

const callData = ref<Array<{ id: string, value: string | undefined }>>()
const writeForm = ref()
const _value = ref([])

const handleOptions = (item: any, type: string) => {
  if (type === 'enum') {
    return item.valueType.elements?.map((a: any) => ({ ...a, label: a.text }))
  } else if (type === 'boolean') {
    return [
      { label: item.valueType.trueText, value: item.valueType.trueValue },
      { label: item.valueType.falseText, value: item.valueType.falseValue },
    ]
  }
  return undefined
}

const callDataOptions = computed(() => {
  const _valueKeys = Object.keys(props.value)
  if (_valueKeys.length) {
    return _valueKeys.map(key => {
      const item: any = props.properties.find((p: any) => p.id === key)
      if (item) {
        const _options = handleOptions(item, item.valueType?.type)
        return {
          id: item.id,
          name: item.name,
          type: item.valueType ? item.valueType.type : '-',
          format: item.valueType ? item.valueType.format : undefined,
          options: _options,
          value: props.value[key]
        }
      }
      return {
        id: key,
        name: key,
        type: '',
        format: undefined,
        options: undefined,
        value: undefined
      }
    })
  }
  return []
})

nextTick(() => {
  formModel.reportKey = Object.keys(props.value)[0]
})

const showTable = computed(() => {
  return !!formModel.reportKey
})

const change = (v: string, option: any) => {
  const _data = {
    [v]: undefined
  }
  callData.value = [{ id: v, value: undefined }]
  emit('update:value', _data)
  emit('update:action', $t('Device.WriteProperty.372527-3', [option.name]))
}

const callDataChange = (v: any[]) => {
  emit('update:value', {
    [formModel.reportKey!]: v[0]?.value
  })
}

defineExpose({
  validateFields: () => new Promise(async (resolve)  => {
    const data = await writeForm.value?.validateFields()
    const data2 = await functionRef.value?.validate()
    resolve({
      ...data,
      data: {
        [formModel.reportKey!]: data2[0]?.value
      }
    })
  })
})

</script>

<style scoped>

</style>
