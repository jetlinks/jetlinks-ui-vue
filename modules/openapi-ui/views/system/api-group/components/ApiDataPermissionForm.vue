<template>
  <div class="data-permission-form">
    <a-form
      ref="formRef"
      :model="formData"
      layout="vertical"
    >
      <!-- 数据权限支持状态 -->
      <a-form-item
        name="accessSupport"
        :label="$t('ApiGroup.ApiDataPermissionForm.321479-0')"
      >
        <a-radio-group v-model:value="formData.accessSupport">
          <a-radio value="unsupported">不支持</a-radio>
          <a-radio value="support">支持</a-radio>
          <a-radio value="indirect">间接支持</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        v-show="formData.accessSupport != 'unsupported'"
        name="assetType"
        :label="$t('ApiGroup.ApiDataPermissionForm.321479-2')"
        :rules="formData.accessSupport != 'unsupported' ? [{ required: true, message: '请选择资产类型' }] : []"
      >
        <a-select
          v-model:value="formData.assetType"
          :placeholder="$t('ApiGroup.ApiDataPermissionForm.321479-3')"
          :loading="assetTypeLoading"
          show-search
          option-filter-prop="label"
          :options="assetTypeList"
          @change="handleFormChange"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import type { ApiDataPermissionConfig } from '../types'
import {useI18n} from "vue-i18n"
import { queryAssetTypes } from '../../../../api/asset'
import { getMenuTree } from '@authentication-manager-ui/api/system/menu'

interface Props {
  data: ApiDataPermissionConfig
}

interface Emits {
  (e: 'update', data: ApiDataPermissionConfig): void
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({ accessSupport: 'unsupported' })
})

const emit = defineEmits<Emits>()

const { t: $t } = useI18n()
const formRef = ref()
const assetTypeLoading = ref(false)
const assetTypeList = ref<any[]>([])
const menuTreeLoading = ref(false)
const menuTreeData = ref<any[]>([])

const formData = reactive<ApiDataPermissionConfig>({
  accessSupport: 'unsupported',
  assetType: '',
  indirectMenus: [],
})

/**
 * 加载资产类型列表
 */
const loadAssetTypes = async () => {
  assetTypeLoading.value = true
  try {
    const resp = await queryAssetTypes()
    if (resp.success && resp.result) {
      assetTypeList.value = Array.isArray(resp.result)
        ? resp.result.map((item: any) => ({
            label: item.name || item.text || item.label,
            value: item.value || item.id,
          }))
        : []
    }
  } catch (error) {
    console.error('加载资产类型失败:', error)
  } finally {
    assetTypeLoading.value = false
  }
}

/**
 * 加载菜单树
 */
const loadMenuTree = async () => {
  menuTreeLoading.value = true
  try {
    const resp = await getMenuTree({})
    if (resp.success && resp.result) {
      const transformTree = (nodes: any[]) => {
        return nodes.map((node: any) => ({
          title: node.name || node.title,
          value: node.id || node.value,
          children: node.children && node.children.length > 0 ? transformTree(node.children) : undefined,
        }))
      }
      menuTreeData.value = Array.isArray(resp.result) ? transformTree(resp.result) : []
    }
  } catch (error) {
    console.error('加载菜单树失败:', error)
  } finally {
    menuTreeLoading.value = false
  }
}

const handleFormChange = () => {
  emit('update', { ...formData })
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
const setFieldsValue = (values: Partial<ApiDataPermissionConfig>) => {
  Object.assign(formData, values)
}

defineExpose({
  validate,
  resetFields,
  setFieldsValue,
  formData,
})

watch(
  () => props.data,
  (val) => {
    if (val) {
      Object.assign(formData, {
        accessSupport: val.accessSupport || 'unsupported',
        assetType: val.assetType || '',
        indirectMenus: val.indirectMenus || [],
      })
    }
  },
  { immediate: true, deep: true }
)

watch(
  formData,
  (val) => {
    emit('update', { ...val })
  },
  { deep: true }
)

onMounted(() => {
  loadAssetTypes()
  loadMenuTree()
})
</script>

<style lang="less" scoped>
.data-permission-form {
  :deep(.ant-form) {
    .ant-form-item {
      margin-bottom: 16px;
    }
  }

  .form-item-tips {
    margin-top: 8px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    line-height: 1.5;
  }
}
</style>
