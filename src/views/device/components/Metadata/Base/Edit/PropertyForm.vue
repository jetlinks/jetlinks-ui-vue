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
  <value-type-form :name="['valueType']" v-model:value="value.valueType" key="property"
    @change-type="changeValueType"></value-type-form>

  <expands-form :name="['expands']" v-model:value="value.expands" :type="type" :id="value.id" :config="config"
    :valueType="value.valueType"></expands-form>

  <a-form-item label="说明" name="description" :rules="[
    { max: 200, message: '最多可输入200个字符' },
  ]">
    <a-textarea v-model:value="value.description" size="small"></a-textarea>
  </a-form-item>
</template>
<script setup lang="ts" name="PropertyForm">
import { PropType } from 'vue';
import ExpandsForm from './ExpandsForm.vue';
import ValueTypeForm from './ValueTypeForm.vue'
import { useProductStore } from '@/store/product';
import { getMetadataConfig } from '@/api/device/product'

const props = defineProps({
  type: {
    type: String as PropType<'product' | 'device'>,
    required: true,
    default: 'product'
  },
  value: {
    type: Object,
    default: () => ({})
  }
})
const productStore = useProductStore()

const config = ref<Record<any, any>[]>([])
const asyncOtherConfig = async () => {
  if (props.type !== 'product') return
  const { valueType: { type }, id } = props.value
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
  asyncOtherConfig()
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