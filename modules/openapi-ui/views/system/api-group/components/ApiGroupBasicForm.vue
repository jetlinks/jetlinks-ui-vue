<template>
  <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
    <!-- 分组名称 -->
    <a-form-item
      name="name"
      :label="$t('ApiGroup.ApiGroupBasicForm.460947-0')"
    >
      <a-input
        v-model:value="formData.name"
        :placeholder="$t('ApiGroup.ApiGroupBasicForm.460947-1')"
        :maxlength="64"
        show-count
        @change="handleValuesChange"
        @blur="handleValuesChange"
      />
    </a-form-item>

    <!-- 分组描述 -->
    <a-form-item
      name="description"
      :label="$t('ApiGroup.ApiGroupBasicForm.460947-2')"
    >
      <a-textarea
        v-model:value="formData.description"
        :placeholder="$t('ApiGroup.ApiGroupBasicForm.460947-3')"
        :rows="3"
        :maxlength="200"
        show-count
        @change="handleValuesChange"
        @blur="handleValuesChange"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { ApiGroupBaseInfo } from '../types'
import type { FormInstance } from 'ant-design-vue'
import {useI18n} from "vue-i18n";

interface Props {
  data: ApiGroupBaseInfo
}

interface Emits {
  (e: 'update', data: ApiGroupBaseInfo): void
  (e: 'validate', valid: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

const { t: $t } = useI18n()
const formRef = ref<FormInstance>()

const formData = reactive<ApiGroupBaseInfo>({
  name: '',
  description: '',
})

const rules = {
  name: [
    { required: true, message: $t('ApiGroup.ApiGroupBasicForm.460947-9'), trigger: 'blur' },
    { min: 2, max: 64, message: $t('ApiGroup.ApiGroupBasicForm.460947-10'), trigger: 'blur' },
  ],
}

const handleValuesChange = () => {
  // 确保使用最新的formData值
  emit('update', {
    name: formData.name,
    description: formData.description,
  })
}

/**
 * 表单验证
 */
const validate = async () => {
  try {
    await formRef.value?.validate()
    return true
  } catch (error) {
    return false
  }
}

/**
 * 重置表单
 */
const resetFields = () => {
  formRef.value?.resetFields()
}

/**
 * 设置表单值
 */
const setFieldsValue = (values: Partial<ApiGroupBaseInfo>) => {
  Object.assign(formData, values)
}

// 暴露方法供父组件调用
defineExpose({
  validate,
  resetFields,
  setFieldsValue,
  formData,
})

// 监听formData变化，实时同步到父组件
watch(
  formData,
  () => {
    handleValuesChange()
  },
  { deep: true }
)

// 初始化时加载数据
watch(
  () => props.data,
  (val) => {
    if (val) {
      Object.assign(formData, val)
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
:deep(.ant-form) {
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
}
</style>