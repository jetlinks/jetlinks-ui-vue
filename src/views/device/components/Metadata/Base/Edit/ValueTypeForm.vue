<template>
  <a-form-item label="数据类型" :name="name.concat(['type'])" :rules="[
    { required: true, message: '请选择数据类型' },
  ]">
    <a-select v-model:value="value.type" :options="_dataTypeList" size="small"></a-select>
  </a-form-item>
  <a-form-item label="单位" :name="name.concat(['unit'])" v-if="['int', 'float', 'long', 'double'].includes(value.type)">
    <InputSelect v-model:value="value.unit" :options="unit.unitOptions" size="small"></InputSelect>
  </a-form-item>
  <a-form-item label="精度" :name="name.concat(['scale'])" v-if="['float', 'double'].includes(value.type)">
    <a-input-number v-model:value="value.scale" size="small" :min="0" :max="2147483647" :precision="0"
      :default-value="2" style="width: 100%"></a-input-number>
  </a-form-item>
  <a-form-item label="布尔值" name="booleanConfig" v-if="['boolean'].includes(value.type)">
    <BooleanParam 
      :name="name"
      v-model:value="_value"
    ></BooleanParam>
  </a-form-item>
  <a-form-item label="枚举项" :name="name.concat(['elements'])" v-if="['enum'].includes(value.type)" :rules="[
    { required: true, message: '请配置枚举项' }
  ]">
    <EnumParam v-model:value="value.elements"></EnumParam>
  </a-form-item>
  <a-form-item :name="name.concat(['expands', 'maxLength'])" v-if="['string', 'password'].includes(value.type)">
    <template #label>
      <a-space>
        最大长度
        <a-tooltip title="字节">
          <question-circle-outlined style="color: rgb(136, 136, 136); font-size: 12px;" />
        </a-tooltip>
      </a-space>
    </template>
    <a-input-number v-model:value="value.expands.maxLength" size="small" :max="2147483647" :min="1" :precision="0"
      style="width: 100%;"></a-input-number>
  </a-form-item>
  <a-form-item label="元素配置" :name="name.concat(['elementType'])" v-if="['array'].includes(value.type)">
    <ArrayParam v-model:value="value.elementType" :name="name.concat(['elementType'])"></ArrayParam>
  </a-form-item>
  <a-form-item label="JSON对象" :name="name.concat(['properties'])" v-if="['object'].includes(value.type)">
    <JsonParam v-model:value="value.jsonConfig" :name="name.concat(['properties'])"></JsonParam>
  </a-form-item>
  <a-form-item label="文件类型" :name="name.concat(['fileType'])" v-if="['file'].includes(value.type)" initialValue="url" :rules="[
    { required: true, message: '请选择文件类型' },
  ]">
    <a-select v-model:value="value.fileType" :options="FileTypeList" size="small"></a-select>
  </a-form-item>
</template>
<script lang="ts" setup mame="BaseForm">
import { DataTypeList, FileTypeList } from '@/views/device/data';
import { DefaultOptionType } from 'ant-design-vue/es/select';
import { PropType } from 'vue'
import { getUnit } from '@/api/device/instance';
import { Store } from 'jetlinks-store';
import InputSelect from '@/components/InputSelect/index.vue';
import BooleanParam from '@/components/Metadata/BooleanParam/index.vue'
import EnumParam from '@/components/Metadata/EnumParam/index.vue'
import ArrayParam from '@/components/Metadata/ArrayParam/index.vue'
import JsonParam from '@/components/Metadata/JsonParam/index.vue'

type ValueType = Record<any, any>;
const props = defineProps({
  value: {
    type: Object as PropType<ValueType>,
    default: () => ({
      extends: {}
    })
  },
  isSub: {
    type: Boolean,
    default: false
  },
  name: {
    type: Array as PropType<string[]>,
    default: () => ([]),
    required: true
  }
})

interface Emits {
  (e: 'update:value', data: ValueType): void;
}
const emit = defineEmits<Emits>()


const _value = computed({
  get: () => props.value,
  set: val => {
    emit('update:value', val)
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