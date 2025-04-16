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
        :label="$t('components.ButtonAddDialog.947292-0')"
        name="id"
        :rules="[
          { required: true, message: $t('components.ButtonAddDialog.947292-1') },
          { max: 64, message: $t('components.ButtonAddDialog.947292-2') },
        ]"
      >
        <a-auto-complete
          v-model:value="formModel.id"
          :options="codeOptions"
          :placeholder="$t('components.ButtonAddDialog.947292-1')"
          :disabled="props.mode !== $t('components.ButtonAddDialog.947292-3')"
        >
          <template #option="{ value: val, message }">
            {{ val }}
            <span class="message">{{ message }}</span>
          </template>
        </a-auto-complete>
      </a-form-item>
      <a-form-item
        :label="$t('components.ButtonAddDialog.947292-4')"
        name="name"
        :rules="[
          { required: true, message: $t('components.ButtonAddDialog.947292-5') },
          { max: 64, message: $t('components.ButtonAddDialog.947292-2') },
        ]"
      >
        <a-input
          v-model:value="formModel.name"
          :disabled="props.mode === $t('components.ButtonAddDialog.947292-6')"
          :placeholder="$t('components.ButtonAddDialog.947292-5')"
        />
      </a-form-item>
      <a-form-item
        :label="$t('components.ButtonAddDialog.947292-7')"
        name="permissions"
        :rules="[
          {
            required: true,
            message: $t('components.ButtonAddDialog.947292-8'),
            validator: checkPermission,
          },
        ]"
      >
        <PermissionChoose
          :first-width="8"
          max-height="350px"
          v-model:value="formModel.permissions"
          :disabled="props.mode === $t('components.ButtonAddDialog.947292-6')"
          :key="formModel.id || ''"
        />
      </a-form-item>
      <a-form-item :label="$t('components.ButtonAddDialog.947292-9')" name="description">
        <a-textarea
          v-model:value="formModel.description"
          :rows="4"
          :placeholder="$t('components.ButtonAddDialog.947292-10')"
          :disabled="props.mode === $t('components.ButtonAddDialog.947292-6')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { onlyMessage } from '@jetlinks-web/utils'
import PermissionChoose from './PermissionChoose.vue'
import { updateMenu } from '@/api/system/menu'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emits = defineEmits(['save', 'close'])
const props = defineProps({
  menuInfo: {
    type: Object,
    default: () => {},
  },
  mode: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: () => {},
  },
})

const codeOptions = [
  { label: 'add', value: 'add', message: $t('components.ButtonAddDialog.947292-3') },
  { label: 'delete', value: 'delete', message: $t('components.ButtonAddDialog.947292-11') },
  { label: 'update', value: 'update', message: $t('components.ButtonAddDialog.947292-12') },
]
const loading = ref<boolean>(false)
const formRef = ref<any>()
const formModel = reactive({
  name: '',
  id: '',
  permissions: [],
  description: '',
})

const checkPermission = (_rule: any, value: string[]) => {
  if (!value || value.length < 1) return Promise.reject($t('components.ButtonAddDialog.947292-8'))
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
            onlyMessage($t('components.ButtonAddDialog.947292-13'))
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
