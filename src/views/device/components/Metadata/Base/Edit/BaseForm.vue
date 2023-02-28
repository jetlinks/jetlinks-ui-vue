<template>
  <a-form-item label="标识" name="id" :rules="[
    { required: true, message: '请输入标识' },
    { max: 64, message: '最多可输入64个字符' },
    {
      pattern: /^[a-zA-Z0-9_\-]+$/,
      message: 'ID只能由数字、字母、下划线、中划线组成',
    },
  ]">
    <a-input v-model:value="value.id" size="small" @change="asyncOtherConfig"></a-input>
  </a-form-item>
  <a-form-item label="名称" name="name" :rules="[
    { required: true, message: '请输入名称' },
    { max: 64, message: '最多可输入64个字符' },
  ]">
    <a-input v-model:value="value.name" size="small"></a-input>
  </a-form-item>
  <template v-if="modelType === 'properties'">
    <value-type-form :name="['valueType']" v-model:value="value.valueType" key="property" title="数据类型"
      @change-type="changeValueType"></value-type-form>
    <expands-form :name="['expands']" v-model:value="value.expands" :type="type" :id="value.id" :config="config"
      :valueType="value.valueType"></expands-form>
  </template>
  <template v-if="modelType === 'functions'">
    <a-form-item label="是否异步" name="async" :rules="[
      { required: true, message: '请选择是否异步' },
    ]">
      <a-radio-group v-model:value="value.async">
        <a-radio :value="true">是</a-radio>
        <a-radio :value="false">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="输入参数" name="inputs" :rules="[
      { required: true, message: '请输入输入参数' },
    ]">
      <JsonParam v-model:value="value.inputs" :name="['inputs']"></JsonParam>
    </a-form-item>
    <value-type-form :name="['output']" v-model:value="value.output" key="function" title="输出参数"></value-type-form>
  </template>
  <template v-if="modelType === 'events'">
    <a-form-item label="级别" :name="['expands', 'level']" :rules="[
      { required: true, message: '请选择级别' },
    ]">
      <a-select v-model:value="value.expands.level" :options="EventLevel" size="small"></a-select>
    </a-form-item>
    <value-type-form :name="['valueType']" v-model:value="value.valueType" key="function" title="输出参数"></value-type-form>
  </template>
  <template v-if="modelType === 'tags'">
    <value-type-form :name="['valueType']" v-model:value="value.valueType" key="property" title="数据类型"></value-type-form>
    <a-form-item label="读写类型" :name="['expands', 'type']" :rules="[
      { required: true, message: '请选择读写类型' },
    ]">
      <a-select v-model:value="value.expands.type" :options="ExpandsTypeList" mode="multiple" size="small"></a-select>
    </a-form-item>
  </template>
  <a-form-item label="说明" name="description" :rules="[
    { max: 200, message: '最多可输入200个字符' },
  ]">
    <a-textarea v-model:value="value.description" size="small"></a-textarea>
  </a-form-item>
</template>
<script setup lang="ts" name="BaseForm">
import { PropType } from 'vue';
import ExpandsForm from './ExpandsForm.vue';
import ValueTypeForm from './ValueTypeForm.vue'
import { useProductStore } from '@/store/product';
import { getMetadataConfig } from '@/api/device/product'
import JsonParam from '@/components/Metadata/JsonParam/index.vue'
import { EventLevel, ExpandsTypeList } from '@/views/device/data';

const props = defineProps({
  type: {
    type: String as PropType<'product' | 'device'>,
    required: true,
    default: 'product'
  },
  value: {
    type: Object,
    default: () => ({})
  },
  modelType: {
    type: String,
    default: ''
  }
})
if (props.modelType === 'events' || props.modelType === 'tags') {
  if (!props.value.expands) {
    props.value.expands = {}
  }
}

const productStore = useProductStore()

const config = ref<Record<any, any>[]>([])
const asyncOtherConfig = async () => {
  if (props.type !== 'product') return
  const { valueType, id } = props.value
  const { type } = valueType || {}
  const productId = productStore.current?.id
  if (!productId || !id || !type) return
  const resp = await getMetadataConfig({
    deviceId: productId,
    metadata: {
      id,
      type: 'property',
      dataType: type,
    },
  })
  if (resp.status === 200) {
    config.value = resp.result
  }
}

onMounted(() => {
  if (props.modelType === 'properties') {
    asyncOtherConfig()
  }
})

const changeValueType = (val: string) => {
  if (props.type === 'product' && ['int', 'float', 'double', 'long', 'date', 'string', 'boolean'].includes(val)) {
    props.value.expands.metrics = []
  } else {
    delete props.value.expands?.metrics
  }
  asyncOtherConfig()
}

</script>
<style scoped lang="less">
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