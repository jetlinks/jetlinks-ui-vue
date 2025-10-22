<template>
  <a-modal
    :open="visible"
    :title="dialogTitle"
    :width="1000"
    :footer="mode === 'view' ? null : undefined"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template
      v-if="mode !== 'view'"
      #footer
    >
      <a-space>
        <a-button @click="handleCancel">{{ $t('PersonalToken.TokenDialog.168178-0') }}</a-button>
        <a-button
          type="primary"
          :disabled="!canSubmit"
          @click="handleOk"
          :loading="loading"
        >
          {{ mode === 'add' ? $t('PersonalToken.TokenDialog.168178-1') : $t('PersonalToken.TokenDialog.168178-2') }}
        </a-button>
      </a-space>
    </template>
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
    >
      <div class="form-layout">
        <div class="form-left">
          <a-descriptions
            v-if="mode === 'view'"
            :column="1"
          >
            <a-descriptions-item :label="$t('PersonalToken.TokenDialog.168178-7')">
              {{ token.name }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('PersonalToken.TokenCard.515931-0')">
              {{ token.sourceTypeName || token.sourceType }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('PersonalToken.TokenCard.515931-1')">
              {{ token.creatorName }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('PersonalToken.TokenCard.515931-2')">
              <span v-time-format="'YYYY-MM-DD HH:mm:ss'">{{ token.createTime }}</span>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('PersonalToken.TokenCard.515931-3')">
              <span v-if="token.expires === -1">{{ $t('PersonalToken.TokenCard.515931-4') }}</span>
              <span
                v-else
                v-time-format="'YYYY-MM-DD HH:mm:ss'"
              >
                {{ token.expires }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('PersonalToken.TokenCard.515931-5')">
              {{ token.description || '--' }}
            </a-descriptions-item>
          </a-descriptions>
          <div
            v-else
            class="form-section"
          >
            <a-form-item
              :label="$t('PersonalToken.TokenDialog.168178-7')"
              name="name"
            >
              <a-input
                v-model:value="formData.name"
                :placeholder="$t('PersonalToken.TokenDialog.168178-8')"
                :maxlength="64"
                :disabled="mode === 'view'"
                show-count
              />
            </a-form-item>

            <a-form-item :label="$t('PersonalToken.TokenDialog.168178-9')">
              <a-select
                v-model:value="expireType"
                :placeholder="$t('PersonalToken.TokenDialog.168178-10')"
                :disabled="mode === 'view'"
                @change="handleExpireTypeChange"
              >
                <a-select-option :value="7">{{ $t('PersonalToken.TokenDialog.168178-11') }}</a-select-option>
                <a-select-option :value="30">{{ $t('PersonalToken.TokenDialog.168178-12') }}</a-select-option>
                <a-select-option :value="60">{{ $t('PersonalToken.TokenDialog.168178-13') }}</a-select-option>
                <a-select-option :value="90">{{ $t('PersonalToken.TokenDialog.168178-14') }}</a-select-option>
                <a-select-option value="custom">{{ $t('PersonalToken.TokenDialog.168178-15') }}</a-select-option>
                <a-select-option :value="-1">{{ $t('PersonalToken.TokenDialog.168178-16') }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              v-if="expireType === 'custom'"
              name="expires"
            >
              <a-date-picker
                v-model:value="formData.expires"
                show-time
                valueFormat="x"
                :placeholder="$t('PersonalToken.TokenDialog.168178-17')"
                :disabled="mode === 'view'"
                style="width: 100%"
                :disabled-date="disabledDate"
                :disabled-time="disabledTime"
              />
            </a-form-item>

            <a-form-item
              :label="$t('PersonalToken.TokenDialog.168178-18')"
              name="description"
            >
              <a-textarea
                v-model:value="formData.description"
                :placeholder="$t('PersonalToken.TokenDialog.168178-19')"
                :maxlength="200"
                :rows="3"
                :disabled="mode === 'view'"
                show-count
              />
            </a-form-item>
          </div>
        </div>

        <div class="form-right">
          <div class="form-section">
            <h5 class="section-title">{{ $t('PersonalToken.TokenDialog.168178-20') }}</h5>
            <PermissionSelector
              v-model:value="formData.scope.permissions"
              :disabled="mode === 'view'"
            />
          </div>
        </div>
      </div>
    </a-form>

    <!-- Success 弹窗 -->
    <Success
      v-if="showSuccessModal"
      :token="generatedToken"
      @close="handleSuccessClose"
    />
  </a-modal>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import PermissionSelector from './PermissionSelector.vue'
import Success from './Success.vue'
import { savePersonalToken_api } from '@/api/account/center'
import { useUserStore } from '@/store'
import { randomString } from '@jetlinks-web/utils'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'add', // add, edit, view
    validator: (value) => ['add', 'edit', 'view'].includes(value)
  },
  token: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['close', 'save'])

const formRef = ref()
const showResult = ref(false)
const visible = ref(true)
const showSuccessModal = ref(false)
const generatedToken = ref('')
const expireType = ref('custom')
const userStore = useUserStore()
const loading = ref(false)

const formData = ref({
  name: '',
  expires: null,
  description: '',
  scope: {
    permissions: []
  },
  sourceType: 'account-center',
  sourceId: randomString(8), // userStore.userInfo.id,
  sourceTypeName: '个人中心'
})

const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { max: 64, message: '最多可输入64个字符', trigger: 'blur' }
  ],
  expires: [{ required: true, message: '请选择到期时间', trigger: 'change' }]
}

const dialogTitle = computed(() => {
  const titles = {
    add: '新增令牌',
    edit: '编辑令牌',
    view: '查看令牌'
  }
  return titles[props.mode]
})

const canSubmit = computed(() => {
  if (!formData.value.name) return false
  if (!expireType.value) return false
  if (expireType.value === 'custom' && !formData.value.expires) return false
  if (formData.value.scope.permissions.length === 0) return false
  return true
})

const disabledDate = (current) => {
  return current && current < dayjs()
}

const disabledTime = (current) => {
  // 如果选择的是今天，则禁用当前时间之前的时间
  if (current && dayjs(current).isSame(dayjs(), 'day')) {
    const now = dayjs()
    return {
      disabledHours: () => {
        const hours = []
        for (let i = 0; i < now.hour(); i++) {
          hours.push(i)
        }
        return hours
      },
      disabledMinutes: (selectedHour) => {
        const minutes = []
        if (selectedHour === now.hour()) {
          for (let i = 0; i < now.minute(); i++) {
            minutes.push(i)
          }
        }
        return minutes
      },
      disabledSeconds: (selectedHour, selectedMinute) => {
        const seconds = []
        if (selectedHour === now.hour() && selectedMinute === now.minute()) {
          for (let i = 0; i < now.second(); i++) {
            seconds.push(i)
          }
        }
        return seconds
      }
    }
  }
  return {}
}

const handleExpireTypeChange = (value) => {
  if (value === 'custom') {
    formData.value.expires = null
  } else if (value === -1) {
    formData.value.expires = -1
  } else {
    formData.value.expires = dayjs().add(parseInt(value), 'day').valueOf()
  }
}

const handleCancel = () => {
  emit('close')
  resetForm()
}

const handleOk = async () => {
  if (props.mode === 'view') {
    handleCancel()
    return
  }

  try {
    await formRef.value.validate()
    loading.value = true
    const submitData = {
      ...formData.value
    }

    if (props.mode === 'add' || props.mode === 'edit') {
      // 模拟生成令牌
      // generatedToken.value = 'jetlinks_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const res = await savePersonalToken_api({
        ...submitData
      }).finally(() => {
        loading.value = false
      })
      if (res.success) {
        showSuccessModal.value = true
        visible.value = false
        generatedToken.value = res.result.accessToken
      }
      // 关闭当前弹窗，显示成功弹窗
    } else {
      emit('save', submitData)
      emit('close')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleResultClose = () => {
  showResult.value = false
  emit('save', formData.value)
  handleCancel()
}

const handleSuccessClose = () => {
  showSuccessModal.value = false
  emit('save', formData.value)
}

const copyToken = async () => {
  try {
    await navigator.clipboard.writeText(generatedToken.value)
    message.success('令牌已复制到剪贴板')
  } catch (error) {
    message.error('复制失败')
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    expires: null,
    description: '',
    permissions: []
  }
  showResult.value = false
  showSuccessModal.value = false
  generatedToken.value = ''
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

const getExpireType = (expireTime) => {
  if (!expireTime) return 'never'

  const expires = dayjs(expireTime)
  const now = dayjs(props.token.createTime)
  const diffDays = expires.diff(now, 'day')

  if (expireTime === -1) return -1
  if (diffDays === 7) return 7
  if (diffDays === 30) return 30
  if (diffDays === 60) return 60
  if (diffDays === 90) return 90

  return 'custom'
}

watch(
  () => props.visible,
  (visible) => {
    if (visible && props.token && props.mode !== 'add') {
      // 编辑或查看模式，填充表单数据
      formData.value = {
        name: props.token.name || '',
        expires: props.token.expires,
        description: props.token.description || '',
        sourceType: props.token.sourceType || 'account-center',
        sourceId: props.token.sourceId || randomString(8), // userStore.userInfo.id,
        scope: {
          permissions: props.token.scope?.permissions || []
        }
      }
      console.log(getExpireType(props.token.expires))
      expireType.value = getExpireType(props.token.expires)
    } else if (!visible) {
      resetForm()
    }
  },
  { immediate: true }
)

provide('mode', props.mode)
</script>

<style lang="less" scoped>
.form-layout {
  display: flex;
  // gap: 24px;
  width: 100%;


  .form-right {
    width: 55%;
  }

  .form-left {
    padding-right: 12px;
    width: 45%;
    border-right: 1px solid #f0f0f0;
  }

  .form-right {
    padding-left: 12px;
  }
}

.form-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 500;
    color: #262626;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 8px;
  }
}

.permission-display {
  .empty-text {
    color: #999;
    font-style: italic;
  }
}

.result-page {
  text-align: center;
  padding: 40px 20px;

  .result-content {
    .result-icon {
      margin-bottom: 16px;
    }

    h3 {
      font-size: 20px;
      margin-bottom: 8px;
    }

    .result-desc {
      color: #666;
      margin-bottom: 32px;
    }

    .token-display {
      margin-bottom: 32px;
      text-align: left;

      .token-label {
        margin-bottom: 8px;
        font-weight: 500;
      }

      .token-value {
        :deep(.ant-input-group-addon) {
          cursor: pointer;

          &:hover {
            background: #f0f0f0;
          }
        }
      }
    }

    .result-actions {
      text-align: center;
    }
  }
}
</style>
