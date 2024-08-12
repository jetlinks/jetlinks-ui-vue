<template>
  <j-form-item :label="title" :name="name.concat(['type'])" :rules="[
    required ? { required: true, message: $t('Edit.ValueTypeForm.6915918-0', [title]) } : {},
  ]">
    <j-select v-model:value="_value.type" :disabled="onlyObject"
      :options="onlyObject ? eventDataTypeList : _dataTypeList" size="small"
      @change="changeType" :placeholder="$t('Edit.ValueTypeForm.6915918-0', [title])"></j-select>
  </j-form-item>
  <j-form-item :label="$t('Edit.ValueTypeForm.6915918-1')" :name="name.concat(['unit'])" v-if="['int', 'float', 'long', 'double'].includes(_value.type)">
    <InputSelect v-model:value="_value.unit" :options="unit.unitOptions" size="small"></InputSelect>
  </j-form-item>
  <j-form-item :label="$t('Edit.ValueTypeForm.6915918-2')" :name="name.concat(['scale'])" v-if="['float', 'double'].includes(_value.type)">
    <j-input-number v-model:value="_value.scale" size="small" :min="0" :max="2147483647" :precision="0"
      style="width: 100%" :placeholder="$t('Edit.ValueTypeForm.6915918-3')"></j-input-number>
  </j-form-item>
  <j-form-item :label="$t('Edit.ValueTypeForm.6915918-4')" :name="name.concat(['format'])" v-if="['date'].includes(_value.type)" v-show="false">
    <j-input v-model:value="_value.format" size="small"></j-input>
  </j-form-item>
  <j-form-item :label="$t('Edit.ValueTypeForm.6915918-5')" name="booleanConfig" v-if="['boolean'].includes(_value.type)">
    <BooleanParam :name="name" v-model:value="_value"></BooleanParam>
  </j-form-item>
  <j-form-item :label="$t('Edit.ValueTypeForm.6915918-6')" :name="name.concat(['elements'])" v-if="['enum'].includes(_value.type)" :rules="[
    { required: true, validator: validateEnum }
  ]">
    <EnumParam v-model:value="_value.elements" :name="name.concat(['elements'])"></EnumParam>
  </j-form-item>
  <j-form-item :name="name.concat(['expands', 'maxLength'])" v-if="['string', 'password'].includes(_value.type)">
    <template #label>
      <j-space>
        {{ $t('Edit.ValueTypeForm.6915918-7') }}
        <j-tooltip :title="$t('Edit.ValueTypeForm.6915918-8')">
          <AIcon type="QuestionCircleOutlined" style="color: rgb(136, 136, 136); font-size: 12px;" />
          <!-- <question-circle-outlined style="color: rgb(136, 136, 136); font-size: 12px;" /> -->
        </j-tooltip>
      </j-space>
    </template>
    <j-input-number v-model:value="_value.expands.maxLength" size="small" :max="2147483647" :min="1" :precision="0"
      style="width: 100%;" :placeholder="$t('Edit.ValueTypeForm.6915918-9')"></j-input-number>
  </j-form-item>
  <j-form-item :label="$t('Edit.ValueTypeForm.6915918-10')" :name="name.concat(['elementType'])" v-if="['array'].includes(_value.type)" :rules="[
    { validator: validateArray }
  ]">
    <ArrayParam v-model:value="_value.elementType" :name="name.concat(['elementType'])"></ArrayParam>
  </j-form-item>
  <j-form-item :label="$t('Edit.ValueTypeForm.6915918-11')" :name="name.concat(['properties'])" v-if="['object'].includes(_value.type)" :rules="[
    { validator: (_rule: Rule, val: Record<any, any>[]) => validateJson(_rule, val, $t('Edit.ValueTypeForm.6915918-11')) }
  ]">
    <JsonParam v-model:value="_value.properties" :name="name.concat(['properties'])"></JsonParam>
  </j-form-item>
  <j-form-item :label="$t('Edit.ValueTypeForm.6915918-12')" :name="name.concat(['bodyType'])" v-if="['file'].includes(_value.type)" initialValue="url"
    :rules="[
      { required: true, message: $t('Edit.ValueTypeForm.6915918-13') },
    ]">
    <j-select v-model:value="_value.bodyType" :options="FileTypeList" size="small" :placeholder="$t('Edit.ValueTypeForm.6915918-13')"></j-select>
  </j-form-item>
</template>
<script lang="ts" setup mame="BaseForm">
import { DataTypeList, FileTypeList } from '@/views/device/data';
import { DefaultOptionType, SelectValue } from 'ant-design-vue/es/select';
import { PropType } from 'vue'
import { getUnit } from '@/api/device/instance';
import InputSelect from '@/components/InputSelect/index.vue';
import BooleanParam from '@/components/Metadata/BooleanParam/index.vue'
import EnumParam from '@/components/Metadata/EnumParam/index.vue'
import ArrayParam from '@/components/Metadata/ArrayParam/index.vue'
import JsonParam from '@/components/Metadata/JsonParam/index.vue'
import { useMetadataStore } from '@/store/metadata';
import { validateEnum, validateArray, validateJson } from './validator'
import { Rule } from 'ant-design-vue/es/form';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


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
    type: String,
  },
  required: {
    type: Boolean,
    default: true
  },
  onlyObject: {
    type: Boolean,
    default: false
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
  if (props.onlyObject) {
    _value.value.type = 'object'
  }
})

watch(_value,
  () => {
    emit('update:value', _value.value)
  },
  { deep: true, immediate: true })

// onMounted(() => {
//   if (props.onlyObject) {
//     _value.value = props.value || {
//       type: 'object',
//       expands: {}
//     }
//   }
// })

const unit = reactive({
  unitOptions: [] as DefaultOptionType[],
  getUnit: () => {
    getUnit().then(resp => {
      const _data = resp.result.map(item => ({
        label: item.description,
        value: item.id,
      }));
      // 缓存单位数据
      unit.unitOptions = _data;
    })
  },
})
unit.getUnit()

const _dataTypeList = computed(() => props.isSub ? DataTypeList.filter(item => item.value !== 'array' && item.value !== 'object') : DataTypeList)
const eventDataTypeList = [
  {
    value: 'object',
    label: 'object(结构体)',
  },
]

const changeType = (val: SelectValue) => {
  if (['float', 'double'].includes(_value.value.type) && _value.value.scale === undefined) {
    _value.value.scale = 2
  }
  if (['file'].includes(val as string)) {
    _value.value.bodyType = _value.value.bodyType || 'url'
  }
  if (['date'].includes(val as string)) {
    _value.value.format = _value.value.format || 'yyyy-MM-dd HH:mm:ss'
  }
  emit('changeType', val as string)
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
//     { required: true, message: $t('Edit.ValueTypeForm.6915918-13') },
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