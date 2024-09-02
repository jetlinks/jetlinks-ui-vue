<template>
  <a-modal
    visible
    :title="props.mode"
    width="660px"
    @ok="confirm"
    @cancel="emits('close')"
    :maskClosable="false"
    :confirmLoading="loading"
  >
    <a-form :model="formModel" class="basic-form" ref="formRef">
      <a-form-item
        label="编码"
        name="id"
        :rules="[
          { required: true, message: '请输入编码' },
          { max: 64, message: '最多可输入64个字符' },
        ]"
      >
        <a-auto-complete
          v-model:value="formModel.id"
          :options="codeOptions"
          placeholder="请输入编码"
          :disabled="props.mode !== '新增'"
        >
          <template #option="{ value: val, message }">
            {{ val }}
            <span class="message">{{ message }}</span>
          </template>
        </a-auto-complete>
      </a-form-item>
      <a-form-item
        label="名称"
        name="name"
        :rules="[
          { required: true, message: '请输入名称' },
          { max: 64, message: '最多可输入64个字符' },
        ]"
      >
        <a-input
          v-model:value="formModel.name"
          :disabled="props.mode === '查看'"
          placeholder="请输入名称"
        />
      </a-form-item>
      <a-form-item
        label="权限"
        name="permissions"
        :rules="[
          {
            required: true,
            message: '请选择权限',
            validator: checkPermission,
          },
        ]"
      >
        <PermissionChoose
          :first-width="8"
          max-height="350px"
          v-model:value="formModel.permissions"
          :disabled="props.mode === '查看'"
          :key="formModel.id || ''"
        />
      </a-form-item>
      <a-form-item label="说明" name="describe">
        <a-textarea
          v-model:value="formModel.describe"
          :rows="4"
          placeholder="请输入说明"
          :disabled="props.mode === '查看'"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { onlyMessage } from '@jetlinks-web/utils'
import PermissionChoose from './PermissionChoose.vue'
import { updateMenu } from '@/api/system/menu'

const emits = defineEmits(['save', 'close'])
const props = defineProps({
  menuInfo: {
    type: Object,
    default: () => {},
  },
  mode: {
    type: String as PropType<'查看' | '新增' | '编辑'>,
    default: '',
  },
  data: {
    type: Object,
    default: () => {},
  },
})

const codeOptions = [
  { label: 'add', value: 'add', message: '新增' },
  { label: 'delete', value: 'delete', message: '删除' },
  { label: 'update', value: 'update', message: '更新' },
]
const loading = ref<boolean>(false)
const formRef = ref<any>()
const formModel = reactive({
  name: '',
  id: '',
  permissions: [],
  describe: '',
})

const checkPermission = (_rule: any, value: string[]) => {
  if (!value || value.length < 1) return Promise.reject('请选择权限')
  return Promise.resolve()
}

watchEffect(() => {
  Object.assign(formModel, props.data)
})

const confirm = () => {
  formRef.value &&
    formRef.value.validate().then(() => {
      const buttons = toRaw(props.menuInfo?.buttons) || []
      const button = buttons?.find((item) => item.id === formModel.id)
      if (button) {
        Object.entries(formModel).forEach(([key, value]) => {
          button[key] = value
        })
      } else {
        buttons.push({ ...formModel })
      }
      const params = {
        ...props.menuInfo,
        buttons,
      }
      loading.value = true
      updateMenu(params)
        .then((resp) => {
          if (resp.success) {
            onlyMessage('操作成功')
            emits('save')
          }
        })
        .finally(() => (loading.value = false))
        .catch(() => {
          loading.value = false
        })
    })
}
</script>

<style lang="less" scoped>
.basic-form {
  .ant-form-item {
    display: block;
    :deep(.ant-form-item-label) {
      overflow: inherit;
      label::after {
        display: none;
      }
    }

    .message {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
