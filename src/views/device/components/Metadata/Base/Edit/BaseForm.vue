<template>
  <j-form-item label="标识" name="id" :rules="[
    { required: true, message: '请输入标识' },
    { max: 64, message: '最多可输入64个字符' },
    {
      pattern: /^[a-zA-Z0-9_\-]+$/,
      message: 'ID只能由数字、字母、下划线、中划线组成',
    },
  ]">
    <j-input v-model:value="value.id" size="small" @change="asyncOtherConfig" :disabled="metadataStore.model.action === 'edit'" placeholder="请输入标识"></j-input>
  </j-form-item>
  <j-form-item label="名称" name="name" :rules="[
    { required: true, message: '请输入名称' },
    { max: 64, message: '最多可输入64个字符' },
  ]">
    <j-input v-model:value="value.name" size="small" placeholder="请输入名称"></j-input>
  </j-form-item>
  <template v-if="modelType === 'properties'">
    <value-type-form :name="['valueType']" v-model:value="value.valueType" key="property" title="数据类型"
      @change-type="changeValueType"></value-type-form>
    <expands-form :name="['expands']" v-model:value="value.expands" :type="type" :id="value.id" :config="config"
      :valueType="value.valueType"></expands-form>
  </template>
  <template v-if="modelType === 'functions'">
    <j-form-item label="是否异步" name="async" :rules="[
      { required: true, message: '请选择是否异步' },
    ]">
      <j-radio-group v-model:value="value.async">
        <j-radio :value="true">是</j-radio>
        <j-radio :value="false">否</j-radio>
      </j-radio-group>
    </j-form-item>
    <j-form-item label="输入参数" name="inputs" :rules="[
      { validator: (_rule: Rule, val: Record<any, any>[]) => validateJson(_rule, val, '输入参数', false) },
    ]">
      <JsonParam v-model:value="value.inputs" :name="['inputs']" :is-sub="false"></JsonParam>
    </j-form-item>
    <value-type-form :name="['output']" v-model:value="value.output" key="function" title="输出参数" :required="false"></value-type-form>
  </template>
  <template v-if="modelType === 'events'">
    <j-form-item label="级别" :name="['expands', 'level']" :rules="[
      { required: true, message: '请选择级别' },
    ]">
      <j-select v-model:value="value.expands.level" :options="EventLevel" size="small" placeholder="请选择级别"></j-select>
    </j-form-item>
    <value-type-form :name="['valueType']" v-model:value="value.valueType" key="function" title="输出参数" only-object></value-type-form>
  </template>
  <template v-if="modelType === 'tags'">
    <value-type-form :name="['valueType']" v-model:value="value.valueType" key="property" title="数据类型"></value-type-form>
    <j-form-item label="读写类型" :name="['expands', 'type']" :rules="[
      { required: true, message: '请选择读写类型' },
    ]">
      <j-select v-model:value="value.expands.type" :options="ExpandsTypeList" mode="multiple" size="small" placeholder="请选择读写类型"></j-select>
    </j-form-item>
  </template>
  <j-form-item label="说明" name="description" :rules="[
    { max: 200, message: '最多可输入200个字符' },
  ]">
    <j-textarea v-model:value="value.description" size="small" placeholder="请输入说明"></j-textarea>
  </j-form-item>
</template>
<script setup lang="ts" name="BaseForm">
import { PropType } from 'vue';
import ExpandsForm from './ExpandsForm.vue';
import ValueTypeForm from './ValueTypeForm.vue'
import { useProductStore } from '@/store/product';
import { useInstanceStore } from'@/store/instance'
import { getMetadataConfig, getMetadataDeviceConfig } from '@/api/device/product'
import JsonParam from '@/components/Metadata/JsonParam/index.vue'
import { EventLevel, ExpandsTypeList } from '@/views/device/data';
import { useMetadataStore } from '@/store/metadata';
import { validateJson } from './validator';
import { Rule } from 'ant-design-vue/es/form';
import { debounce } from 'lodash';

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

const metadataStore = useMetadataStore()

if (props.modelType === 'events' || props.modelType === 'tags') {
  if (!props.value.expands) {
    props.value.expands = {}
  }
}

const productStore = useProductStore()
const deviceStore = useInstanceStore()

const config = ref<Record<any, any>[]>([])
const asyncOtherConfig = debounce(async () => {

  const { valueType, id } = props.value
  const { type } = valueType || {}
  const productId = props.type === 'product' ? productStore.current?.id : deviceStore.current.id
  if (!productId || !id || !type) return
  const params: any = {
    deviceId: productId,
    metadata: {
      id,
      type: 'property',
      dataType: type,
    },
  }
  const resp = props.type === 'product' ? await getMetadataConfig(params) : await getMetadataDeviceConfig(params)
  if (resp.status === 200) {
    config.value = resp.result
  }
}, 500)

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