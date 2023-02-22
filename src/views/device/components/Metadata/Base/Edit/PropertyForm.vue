<template>
  <a-form ref="addFormRef" :model="form.model" layout="vertical">
    <a-form-item label="标识" name="id" :rules="[
      { required: true, message: '请输入标识' },
      { max: 64, message: '最多可输入64个字符' },
      {
        pattern: /^[a-zA-Z0-9_]+$/,
        message: '请输入英文或者数字或者-或者_',
      },
    ]">
      <a-input v-model:value="form.model.id" size="small"></a-input>
    </a-form-item>
    <a-form-item label="名称" name="name" :rules="[
      { required: true, message: '请输入名称' },
      { max: 64, message: '最多可输入64个字符' },
    ]">
      <a-input v-model:value="form.model.name" size="small"></a-input>
    </a-form-item>
    <value-type-form :name="['valueType']" v-model:value="form.model.valueType" key="property"></value-type-form>

    <expands-form :name="['expands']" v-model:value="form.model.expands" :type="type" :id="form.model.id"></expands-form>

    <a-form-item label="说明" name="description" :rules="[
      { max: 200, message: '最多可输入200个字符' },
    ]">
      <a-textarea v-model:value="form.model.description" size="small"></a-textarea>
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts" name="PropertyForm">
import { PropType } from 'vue';
import ExpandsForm from './ExpandsForm.vue';
import ValueTypeForm from './ValueTypeForm.vue'

const props = defineProps({
  type: {
    type: String as PropType<'product' | 'device'>,
    required: true,
    default: 'product'
  }
})

const form = reactive({
  model: {
    valueType: {
      expands: {}
    },
    expands: {}
  } as any,
})

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