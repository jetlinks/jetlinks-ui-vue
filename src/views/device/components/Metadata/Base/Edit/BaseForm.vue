<template>
  <j-form-item :label="$t('Edit.BaseForm.6916022-0')" name="id" :rules="[
    { required: true, message: $t('Edit.BaseForm.6916022-1') },
    { max: 64, message: $t('Edit.BaseForm.6916022-2') },
    {
      pattern: /^[a-zA-Z0-9_\-]+$/,
      message: $t('Edit.BaseForm.6916022-3'),
    },
  ]">
    <j-input v-model:value="value.id" size="small" @change="asyncOtherConfig" :disabled="metadataStore.model.action === 'edit'" :placeholder="$t('Edit.BaseForm.6916022-1')"></j-input>
  </j-form-item>
  <j-form-item :label="$t('Edit.BaseForm.6916022-4')" name="name" :rules="[
    { required: true, message: $t('Edit.BaseForm.6916022-5') },
    { max: 64, message: $t('Edit.BaseForm.6916022-2') },
  ]">
    <j-input v-model:value="value.name" size="small" :placeholder="$t('Edit.BaseForm.6916022-5')"></j-input>
  </j-form-item>
  <template v-if="modelType === 'properties'">
    <value-type-form :name="['valueType']" v-model:value="value.valueType" key="property" :title="$t('Edit.BaseForm.6916022-6')"
      @change-type="changeValueType"></value-type-form>
    <expands-form :name="['expands']" v-model:value="value.expands" :type="type" :id="value.id" :config="config"
      :valueType="value.valueType"></expands-form>
  </template>
  <template v-if="modelType === 'functions'">
    <j-form-item :label="$t('Edit.BaseForm.6916022-7')" name="async" :rules="[
      { required: true, message: $t('Edit.BaseForm.6916022-8') },
    ]">
      <j-radio-group v-model:value="value.async">
        <j-radio :value="true">{{ $t('Edit.BaseForm.6916022-9') }}</j-radio>
        <j-radio :value="false">{{ $t('Edit.BaseForm.6916022-10') }}</j-radio>
      </j-radio-group>
    </j-form-item>
    <j-form-item :label="$t('Edit.BaseForm.6916022-11')" name="inputs" :rules="[
      { validator: (_rule: Rule, val: Record<any, any>[]) => validateJson(_rule, val, $t('Edit.BaseForm.6916022-11'), false) },
    ]">
      <JsonParam v-model:value="value.inputs" :name="['inputs']" :is-sub="false"></JsonParam>
    </j-form-item>
    <value-type-form :name="['output']" v-model:value="value.output" key="function" :title="$t('Edit.BaseForm.6916022-12')" :required="false"></value-type-form>
  </template>
  <template v-if="modelType === 'events'">
    <j-form-item :label="$t('Edit.BaseForm.6916022-13')" :name="['expands', 'level']" :rules="[
      { required: true, message: $t('Edit.BaseForm.6916022-14') },
    ]">
      <j-select v-model:value="value.expands.level" :options="EventLevel" size="small" :placeholder="$t('Edit.BaseForm.6916022-14')"></j-select>
    </j-form-item>
    <value-type-form :name="['valueType']" v-model:value="value.valueType" key="function" :title="$t('Edit.BaseForm.6916022-12')" only-object></value-type-form>
  </template>
  <template v-if="modelType === 'tags'">
    <value-type-form :name="['valueType']" v-model:value="value.valueType" key="property" :title="$t('Edit.BaseForm.6916022-6')"></value-type-form>
    <j-form-item :label="$t('Edit.BaseForm.6916022-15')" :name="['expands', 'type']" :rules="[
      { required: true, message: $t('Edit.BaseForm.6916022-16') },
    ]">
      <j-select v-model:value="value.expands.type" :options="ExpandsTypeList" mode="multiple" size="small" :placeholder="$t('Edit.BaseForm.6916022-16')"></j-select>
    </j-form-item>
  </template>
  <j-form-item :label="$t('Edit.BaseForm.6916022-17')" name="description" :rules="[
    { max: 200, message: $t('Edit.BaseForm.6916022-18') },
  ]">
    <j-textarea v-model:value="value.description" size="small" :placeholder="$t('Edit.BaseForm.6916022-19')"></j-textarea>
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
import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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