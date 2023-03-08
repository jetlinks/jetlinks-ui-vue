<template>
  <j-form-item :label="title" :name="name.concat(['type'])" :rules="[
    metadataStore.model.type !== 'functions' ? { required: true, message: `请选择${title}` } : {},
  ]">
    <j-select v-model:value="_value.type"
      :options="metadataStore.model.type === 'events' ? eventDataTypeList : _dataTypeList" size="small"
      @change="changeType"></j-select>
  </j-form-item>
  <j-form-item label="单位" :name="name.concat(['unit'])" v-if="['int', 'float', 'long', 'double'].includes(_value.type)">
    <InputSelect v-model:value="_value.unit" :options="unit.unitOptions" size="small"></InputSelect>
  </j-form-item>
  <j-form-item label="精度" :name="name.concat(['scale'])" v-if="['float', 'double'].includes(_value.type)">
    <j-input-number v-model:value="_value.scale" size="small" :min="0" :max="2147483647" :precision="0" :default-value="2"
      style="width: 100%"></j-input-number>
  </j-form-item>
  <j-form-item label="布尔值" name="booleanConfig" v-if="['boolean'].includes(_value.type)">
    <BooleanParam :name="name" v-model:value="_value"></BooleanParam>
  </j-form-item>
  <j-form-item label="枚举项" :name="name.concat(['elements'])" v-if="['enum'].includes(_value.type)" :rules="[
    { required: true, validator: validateEnum, message: '请配置枚举项' }
  ]">
    <EnumParam v-model:value="_value.elements" :name="name.concat(['elements'])"></EnumParam>
  </j-form-item>
  <j-form-item :name="name.concat(['expands', 'maxLength'])" v-if="['string', 'password'].includes(_value.type)">
    <template #label>
      <j-space>
        最大长度
        <j-tooltip title="字节">
          <question-circle-outlined style="color: rgb(136, 136, 136); font-size: 12px;" />
        </j-tooltip>
      </j-space>
    </template>
    <j-input-number v-model:value="_value.expands.maxLength" size="small" :max="2147483647" :min="1" :precision="0"
      style="width: 100%;"></j-input-number>
  </j-form-item>
  <j-form-item label="元素配置" :name="name.concat(['elementType'])" v-if="['array'].includes(_value.type)" :rules="[
    { validator: validateArray }
  ]">
    <ArrayParam v-model:value="_value.elementType" :name="name.concat(['elementType'])"></ArrayParam>
  </j-form-item>
  <j-form-item label="JSON对象" :name="name.concat(['properties'])" v-if="['object'].includes(_value.type)" :rules="[
    { validator: validateJson }
  ]">
    <JsonParam v-model:value="_value.properties" :name="name.concat(['properties'])"></JsonParam>
  </j-form-item>
  <j-form-item label="文件类型" :name="name.concat(['fileType'])" v-if="['file'].includes(_value.type)" initialValue="url"
    :rules="[
      { required: true, message: '请选择文件类型' },
    ]">
    <j-select v-model:value="_value.fileType" :options="FileTypeList" size="small"></j-select>
  </j-form-item>
</template>
<script lang="ts" setup mame="BaseForm">
import { DataTypeList, FileTypeList } from '@/views/device/data';
import { DefaultOptionType, SelectValue } from 'ant-design-vue/es/select';
import { PropType } from 'vue'
import { getUnit } from '@/api/device/instance';
import { Store } from 'jetlinks-store';
import InputSelect from '@/components/InputSelect/index.vue';
import BooleanParam from '@/components/Metadata/BooleanParam/index.vue'
import EnumParam from '@/components/Metadata/EnumParam/index.vue'
import ArrayParam from '@/components/Metadata/ArrayParam/index.vue'
import JsonParam from '@/components/Metadata/JsonParam/index.vue'
import { useMetadataStore } from '@/store/metadata';
import { Rule } from 'ant-design-vue/es/form';
import { Form } from 'ant-design-vue/es';

type ValueType = Record<any, any>;
const props = defineProps({
  value: {
    type: Object as PropType<ValueType>,
    // default: () => ({})
  },
  isSub: {
    type: Boolean,
    default: false
  },
  name: {
    type: Array as PropType<(string | number)[]>,
    default: () => ([]),
    required: true
  },
  title: {
    String,
    default: '数据类型'
  }
})

interface Emits {
  (e: 'update:value', data: ValueType): void;
  (e: 'changeType', data: string): void;
}
const emit = defineEmits<Emits>()

const metadataStore = useMetadataStore()

const _value = ref<ValueType>({})
watchEffect(() => {
  _value.value = props.value || {
    expands: {}
  }
})

watch(_value,
  () => {
    emit('update:value', _value.value)
  },
  { deep: true, immediate: true })

onMounted(() => {
  if (metadataStore.model.type === 'events') {
    _value.value = {
      type: 'object',
      expands: {}
    }
  }
})

const unit = {
  unitOptions: [] as DefaultOptionType[],
  getUnit: () => {
    getUnit().then(resp => {
      const _data = resp.result.map(item => ({
        label: item.description,
        value: item.id,
      }));
      // 缓存单位数据
      Store.set('units', _data);
      unit.unitOptions = _data;
    })
  },
}
unit.getUnit()

const _dataTypeList = computed(() => props.isSub ? DataTypeList.filter(item => item.value !== 'array' && item.value !== 'object') : DataTypeList)
const eventDataTypeList = [
  {
    value: 'object',
    label: 'object(结构体)',
  },
]

const changeType = (val: SelectValue) => {
  emit('changeType', val as string)
}

const validateEnum = async (_rule: Rule, val: Record<any, any>[]) => {
  if (val.length === 0) return Promise.reject(new Error('请配置枚举项'));
  const flag = val.every((item) => {
    return item.value && item.text;
  });
  if (!flag) {
    return Promise.reject(new Error('请配置枚举项'));
  }
  return Promise.resolve();
}

const validateArray = async (_rule: Rule, val: Record<any, any>) => {
  if (!val) return Promise.reject(new Error('请输入元素配置'));
  await validateValueType(_rule, val)
  return Promise.resolve();
}

const validateJson = async (_rule: Rule, val: Record<any, any>[]) => {
  if (!val || val.length === 0) {
    return Promise.reject(new Error('请输入配置参数'));
  }
  for (let item of val) {
    if (!item) return Promise.reject(new Error('请输入配置参数'));
    await validateValueType(_rule, item)
  }
  return Promise.resolve();
}

const validateValueType = async (_rule: Rule, val: Record<any, any>) => {
  if (!val) return Promise.reject(new Error('请输入元素配置'));
  if (!val.id) {
    return Promise.reject(new Error('请输入标识'))
  }
  if (!val.name) {
    return Promise.reject(new Error('请输入名称'))
  }
  if (metadataStore.model.type !== 'functions' && !val.valueType?.type) {
    return Promise.reject(new Error(`请选择${props.title}`))
  }
  if (['enum'].includes(val.valueType.type)) {
    await validateEnum(_rule, val.valueType.elements)
  }
  if (['array'].includes(val.valueType.type)) {
    await validateArray(_rule, val.valueType.elementType)
  }
  if (['object'].includes(val.valueType.type)) {
    await validateJson(_rule, val.valueType.properties)
  }
  if (['file'].includes(val.valueType.type) && !val.valueType.fileType) {
    return Promise.reject(new Error('请选择文件类型'))
  }
  return Promise.resolve();
}

// const rules = ref({
//   type: [
//     metadataStore.model.type !== 'functions' ? { required: true, message: `请选择${props.title}` } : {},
//   ],
//   elements: [
//     { required: true, validator: validateEnum, message: '请配置枚举项' }
//   ],
//   elementType: [
//     { validator: validateArray, message: '请输入元素配置' }
//   ],
//   properties: [
//     { validator: validateJson, message: '请输入配置参数' }
//   ],
//   fileType: [
//     { required: true, message: '请选择文件类型' },
//   ]
// })

</script>
<style lang="less" scoped>
:deep(.ant-form-item-label) {
  line-height: 1;

  >label {
    font-size: 12px;

    &.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
      font-size: 12px;
    }
  }
}

:deep(.ant-form-item-explain) {
  font-size: 12px;
}

:deep(.ant-form-item-with-help) {
  .ant-form-item-explain {
    min-height: 20px;
    line-height: 20px;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 20px;

  &.ant-form-item-with-help {
    margin-bottom: 0;
  }

  input {
    font-size: 12px;
  }
}

:deep(.ant-input),
:deep(.ant-select) {
  font-size: 12px;
}
</style>