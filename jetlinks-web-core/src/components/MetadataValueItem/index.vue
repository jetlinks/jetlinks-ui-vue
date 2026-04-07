<template>
  <template v-if="['int', 'long', 'float', 'double'].includes(_type)">
    <a-input-number v-bind="componentsProps" v-model:value="_value" style="width: 100%" @change="onChange"/>
  </template>
  <template v-else-if="['date'].includes(_type)">
    <a-date-picker style="width: 100%" v-model:value="_value" v-bind="componentsProps" @change="onChange"/>
  </template>
  <template v-else-if="['time'].includes(_type)">
    <a-time-picker style="width: 100%" v-model:value="_value" v-bind="componentsProps" @change="onChange"/>
  </template>
  <template v-else-if="['boolean', 'enum'].includes(_type)">
    <a-select v-model:value="_value" v-bind="componentsProps" @change="onChange"/>
  </template>
  <template v-else-if="['geoPoint'].includes(_type)">
    <SelectAMap v-model:point="_value" @change="onChange"/>
  </template>
  <template v-else-if="['password'].includes(_type)">
    <a-input-password v-bind="componentsProps" v-model:value="_value" @change="onChange"/>
  </template>
  <template v-else-if="['array', 'object'].includes(_type)">
    <InputMonacoEditor v-bind="componentsProps" :type="_type" v-model="_value" @change="onChange"/>
  </template>
  <template v-else-if="['file'].includes(_type)">
    <a-input
        v-model:value="_value"
        allowClear
        v-bind="componentsProps"
        @change="onChange"
    >
      <template #addonAfter>
        <a-upload
            :headers="getUploadHeaders()"
            :action="FileStaticPath()"
            :showUploadList="false"
            name="file"
            @change="handleFileChange"
        >
          <AIcon type="UploadOutlined"/>
        </a-upload>
      </template>
    </a-input>
  </template>
  <a-input v-model:value="_value" v-bind="componentsProps" v-else @change="onChange"/>
</template>

<script setup>
import InputMonacoEditor from './InputMonacoEditor.vue';
import dayjs from "dayjs";
import {FileStaticPath} from "@jetlinks-web-core/api/comm";
import {useI18n} from "vue-i18n";
import { getUploadHeaders } from '../../utils'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: [String, Number, Object, Array],
  },
})

const emits = defineEmits(['update:modelValue', 'change'])
const { t: $t } = useI18n();
const _value = ref()

const _type = computed(() => {
  const __valueType = props.item.valueType
  if (__valueType.type === 'date' && __valueType.format === 'hh:mm:ss') {
    return 'time'
  }
  return __valueType.type
})

const handleFileChange = async (info) => {
  if (info.file.status === 'done') {
    let url = info.file.response?.result?.accessUrl

    if (props.handleFileChange) {
      url = await props.handleFileChange(info, info.file.response)
    }
    _value.value = url
    emits('update:modelValue', url)
    emits('change', url)
  }
}

const componentsProps = computed(() => {
  const _valueType = props.item.valueType || {}
  switch (_type.value) {
    case 'int':
      return {
        precision: 0,
        min: -2147483647,
        max: 2147483647,
        placeholder: $t('MetadataValueItem.index.6754398-1')
      }
    case 'long':
      return {
        precision: 0,
        min: -999999999999999,
        max: 999999999999999,
        placeholder: $t('MetadataValueItem.index.6754398-1')
      }
    case 'float':
    case 'double':
      return {
        precision: _valueType.scale || 2,
        min: -999999999999999,
        max: 999999999999999,
        placeholder: $t('MetadataValueItem.index.6754398-1')
      }
    case 'boolean':
      return {
        options: [
          {
            label: _valueType.trueText || '是',
            value: _valueType.trueValue || 'true',
          },
          {
            label: _valueType.falseText || '否',
            value: _valueType.falseValue || 'false',
          }
        ],
        placeholder: $t('MetadataValueItem.index.6754398-2')
      }
    case 'date':
      return {
        placeholder: $t('MetadataValueItem.index.6754398-2'),
        showTime: _valueType.format === 'yyyy-MM-dd HH:mm:ss'
      }
    case 'string':
      return {
        maxLength: _valueType.expands?.maxLength,
        placeholder: $t('MetadataValueItem.index.6754398-1')
      }
    case 'enum':
      return {
        options: _valueType.elements || [],
        placeholder: $t('MetadataValueItem.index.6754398-2')
      }
    case 'object':
    case 'array':
      return {}
  }
  return {
    placeholder: $t('MetadataValueItem.index.6754398-1')
  }
})

const onChange = () => {
  let __value = _value.value
  if (_type.value === 'time' || _type.value === 'date') {
    __value = dayjs(_value.value).valueOf()
  }
  emits('update:modelValue', __value)
  emits('change', __value)
}

watch(() => props.modelValue, (val) => {
  if (_type.value === 'time' || _type.value === 'date') {
    _value.value = val ? dayjs(val) : undefined
  } else {
    _value.value = val
  }
}, {
  immediate: true,
  deep: true
})
</script>

<style lang="less" scoped>

</style>
