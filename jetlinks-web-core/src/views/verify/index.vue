<template>
  <Modal
    v-model:open="visible"
    :title="title"
    :maskClosable="false"
    :width="type === 'identity' ? 420 : modalWidth"
    @cancel="onCancel"
    @ok="onSubmit"
    :okButtonProps="{ loading: submitting, disabled: type === 'identity' && identityListRaw.length === 0 }"
    :okText="submitText"
    :cancelText="t('verify.cancel')"
  >
    <!-- 验证码 -->
    <template v-if="type === 'captcha' && captchaConfig">

      <Form v-if="captchaConfig.type === 'image'" ref="formRef" layout="vertical" :model="captchaForm" :rules="captchaRules">
        <FormItem :label="t('verify.captchaLabel')" name="verifyCode">
          <Input
            ref="captchaInputRef"
            v-model:value="captchaForm.verifyCode"
            :placeholder="t('verify.captchaPlaceholder')"
            :maxlength="64"
            autocomplete="off"
            @keyup.enter="onSubmit"
          >
            <template #suffix>
              <span class="captcha-suffix" @click="loadCaptchaImage">
                <img
                  v-if="captchaImage"
                  :src="captchaImage"
                  class="captcha-img"
                />
                <span v-else class="captcha-loading">{{ t('verify.loading') }}</span>
              </span>
            </template>
          </Input>
        </FormItem>
      </Form>
      <Captcha v-else :showDialog="false" :open="visible" :config="captchaConfig.tianai" @imageWidth="v => modalWidth=v+48"  />
    </template>

    <!-- 身份校验 -->
    <template v-else-if="type === 'identity'">
      <!-- 空状态：没有身份信息 -->
      <div v-if="identityListRaw.length === 0" class="identity-empty">
        <div class="empty-icon">📧</div>
        <div class="empty-text">{{ t('verify.noIdentity') }}</div>
        <div class="empty-desc">{{ t('verify.noIdentityDesc') }}</div>
        <Button 
          type="primary" 
          @click="goToBindIdentity"
          @mousedown.stop
          @mouseup.stop
        >
          {{ t('verify.goToBindIdentity') }}
        </Button>
      </div>
      <!-- 有身份信息 -->
      <Form v-else ref="formRef" layout="vertical" :model="identityForm" :rules="identityRules">
        <FormItem :label="t('verify.identityLabel')" name="identityId">
          <Select
            v-model:value="identityForm.identityId"
            :placeholder="t('verify.identityPlaceholder')"
            :options="identityOptions"
            :field-names="{ label: 'identityLabel', value: 'id' }"
            @change="onIdentityChange"
          />
        </FormItem>
        <FormItem
          v-if="identityForm.identityId && isMobileProvider && !validationSent"
          :label="t('verify.phoneLabel')"
          name="identityValue"
        >
          <Input
            v-model:value="identityForm.identityValue"
            :placeholder="t('verify.phonePlaceholder')"
            :maxlength="20"
            autocomplete="off"
          />
        </FormItem>
        <FormItem v-if="identityForm.identityId && !validationSent" :label="t('verify.sendCode')">
          <Button type="primary" :loading="sendingCode" block @click="sendIdentityCode">
            {{ t('verify.sendCodeButton') }}
          </Button>
        </FormItem>
        <FormItem v-if="validationSent" :label="t('verify.codeLabel')" name="code">
          <Input
            ref="identityCodeInputRef"
            v-model:value="identityForm.code"
            :placeholder="t('verify.codePlaceholder')"
            :maxlength="16"
            autocomplete="off"
            @keyup.enter="onSubmit"
          />
          <div style="margin-top: 8px;">
            <Button 
              type="link" 
              :disabled="countdown > 0" 
              :loading="sendingCode"
              @click="resendIdentityCode"
              style="padding: 0;"
            >
              {{ countdown > 0 ? `${countdown}秒后重新发送` : t('AccountInfo.resendCode') }}
            </Button>
          </div>
        </FormItem>
      </Form>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Modal, Form, FormItem, Input, Select, Button } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  getVerifyCaptchaConfig,
  getVerifyCaptchaImage,
  confirmCaptcha,
  requestIdentityVerify,
  confirmIdentityVerify,
  getSelfIdentitiesForVerify
} from '@jetlinks-web-core/api/verify'
import { getIdentityProviders_api } from '@jetlinks-web-core/api/account/center'
import type { VerifyRequiredResult } from '@jetlinks-web-core/api/verify'
import i18n from '@jetlinks-web-core/locales'
import Captcha from '@jetlinks-web-core/components/Captcha'

const { t } = i18n.global
const router = useRouter()
const route = useRoute()

const props = defineProps<{
  verifyResult: VerifyRequiredResult
}>()

const emit = defineEmits<{
  success: [payload: { key: string; token: string; disposable: boolean }]
  cancel: []
}>()

const visible = ref(true)
const type = computed(() => props.verifyResult?.type ?? 'captcha')
const title = computed(() =>
  type.value === 'captcha' ? t('verify.titleCaptcha') : t('verify.titleIdentity')
)
const submitText = computed(() =>
  type.value === 'captcha' ? t('verify.submit') : t('verify.confirm')
)

const formRef = ref<FormInstance>()
const captchaInputRef = ref()
const identityCodeInputRef = ref()
const submitting = ref(false)
const sendingCode = ref(false)
const validationSent = ref(false)
const validationData = ref<{ requestId: string; token: string; context?: Record<string, unknown> } | null>(null)
const countdown = ref(0)
const modalWidth = ref(448)
let countdownTimer: ReturnType<typeof setInterval> | null = null
const identityListRaw = ref<Array<{ id: string; provider: string; identity: string }>>([])
const identityOptions = computed(() =>
  identityListRaw.value.map((item) => ({
    id: item.id,
    provider: item.provider,
    identity: item.identity,
    identityLabel: `${t('verify.provider.' + item.provider)}: ${item.identity}`
  }))
)

const captchaForm = reactive({
  verifyCode: '',
  imageKey: ''
})
const captchaImage = ref('')
const captchaConfig = ref<{ type?: string, tianai?: Record<string, string> } | null>(null)

const identityForm = reactive({
  identityId: '',
  identityValue: '',
  code: ''
})

const mobileProviders = ['mobile', 'phone', 'sms', 'phoneNumber']
const selectedIdentityOption = computed(() =>
  identityForm.identityId ? identityListRaw.value.find((o) => o.id === identityForm.identityId) : null
)
const isMobileProvider = computed(() =>
  selectedIdentityOption.value ? mobileProviders.includes(selectedIdentityOption.value.provider) : false
)

const captchaRules = {
  verifyCode: [{ required: true, message: t('verify.verifyCodeRequired') }]
}
const identityRules = {
  identityId: [{ required: true, message: t('verify.identityRequired') }],
  identityValue: [{ required: true, message: t('verify.phoneRequired') }],
  code: [{ required: true, message: t('verify.codeRequired') }]
}

async function loadCaptchaImage() {
  try {
    const res = await getVerifyCaptchaImage()
    const data = res?.result ?? res
    if (data?.base64) {
      captchaImage.value = data.base64
      captchaForm.imageKey = data.key ?? ''
    }
  } catch {
    captchaImage.value = ''
  }
}

async function loadCaptchaConfig() {
  try {
    const res = await getVerifyCaptchaConfig()
    const data = res?.result ?? res
    captchaConfig.value = data ?? null
    if (data.type === 'image') {
      await loadCaptchaImage()
    }
  } catch {
    captchaConfig.value = null
  }
}

async function loadIdentities() {
  try {
    const res = await getSelfIdentitiesForVerify()
    const list = res?.result ?? res ?? []
    identityListRaw.value = Array.isArray(list)
      ? list.map((item: { id: string; provider: string; identity: string }) => ({
          id: item.id,
          provider: item.provider,
          identity: item.identity
        }))
      : []
    
    // 如果有身份信息，自动选择第一个（优先选择邮箱）
    if (identityListRaw.value.length > 0) {
      // 优先选择邮箱
      const emailIdentity = identityListRaw.value.find(item => item.provider === 'email')
      if (emailIdentity) {
        identityForm.identityId = emailIdentity.id
      } else {
        // 如果没有邮箱，选择第一个
        identityForm.identityId = identityListRaw.value[0].id
      }
    }
  } catch {
    identityListRaw.value = []
  }
}

function goToBindIdentity() {
  // 先关闭弹窗
  visible.value = false
  emit('cancel')
  
  // 在新窗口打开账号信息页面
  const currentOrigin = window.location.origin
  const targetUrl = `${currentOrigin}/#/account/center?tabKey=BindThirdAccount&anchor=email-section`
  const newWindow = window.open(targetUrl, '_blank')
  
  if (newWindow) {
    // 监听来自新窗口的消息
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type === 'identity_bind_completed') {
        // 收到绑定完成的消息，刷新当前页面
        window.removeEventListener('message', handleMessage)
        window.location.reload()
      }
    }
    window.addEventListener('message', handleMessage)
    
    // 备用方案：使用轮询检查新窗口是否关闭
    const checkWindowClosed = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(checkWindowClosed)
        // 新窗口已关闭，刷新当前页面（无论是否完成绑定）
        window.removeEventListener('message', handleMessage)
        window.location.reload()
      }
    }, 1000)
  }
}

function onIdentityChange() {
  validationSent.value = false
  validationData.value = null
  identityForm.code = ''
  identityForm.identityValue = ''
  // 清除倒计时
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = 0
}

async function sendIdentityCode() {
  if (!identityForm.identityId) return
  const item = identityOptions.value.find((o) => o.id === identityForm.identityId)
  if (!item) return
  if (isMobileProvider.value && !identityForm.identityValue?.trim()) {
    await formRef.value?.validateFields(['identityValue'])
    return
  }
  // 如果倒计时中，不允许重新发送
  if (countdown.value > 0) {
    return
  }

  sendingCode.value = true
  try {
    const identityToSend = isMobileProvider.value ? identityForm.identityValue?.trim() ?? '' : item.identity
    const res = await requestIdentityVerify(identityForm.identityId, {
      provider: item.provider,
      identity: identityToSend
    })
    const data = res?.result ?? res
    validationData.value = data
      ? { requestId: (data as any).requestId, token: (data as any).token, context: (data as any).context }
      : null
    validationSent.value = true
    // 启动倒计时
    const intervalSeconds = (data as any)?.intervalSeconds ?? 60
    startCountdown(intervalSeconds)
    // 自动focus到验证码输入框
    nextTick(() => {
      identityCodeInputRef.value?.focus()
    })
  } finally {
    sendingCode.value = false
  }
}

function startCountdown(seconds: number) {
  // 清除之前的定时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = seconds
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }
  }, 1000)
}

async function resendIdentityCode() {
  // 如果倒计时中，不允许重新发送
  if (countdown.value > 0) {
    return
  }
  await sendIdentityCode()
}

async function onSubmit() {
  // 如果没有身份信息，不允许提交
  if (type.value === 'identity' && identityListRaw.value.length === 0) {
    return
  }
  
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  if (type.value === 'identity' && !validationSent.value) {
    return
  }
  if (type.value === 'identity' && !identityForm.code?.trim()) {
    formRef.value?.validateFields(['code'])
    return
  }

  submitting.value = true
  try {
    let res: { result?: { token: string } }
    if (type.value === 'captcha') {
      res = await confirmCaptcha({
        key: props.verifyResult.key,
        provider: captchaConfig.value?.type ?? 'image',
        params: {
          verifyKey: captchaForm.imageKey,
          verifyCode: captchaForm.verifyCode
        }
      })
    } else {
      if (!validationData.value) throw new Error('Validation not sent')
      const item = identityOptions.value.find((o) => o.id === identityForm.identityId)
      res = await confirmIdentityVerify({
        key: props.verifyResult.key,
        provider: item?.provider ?? '',
        requestId: validationData.value.requestId,
        token: validationData.value.token,
        context: validationData.value.context,
        params: { code: identityForm.code }
      })
    }
    const token = (res?.result ?? (res as any))?.token
    if (token) {
      visible.value = false
      await nextTick()
      emit('success', {
        key: props.verifyResult.key,
        token,
        disposable: props.verifyResult.disposable
      })
    }
  } catch (e) {
    console.error(e)
    if (type.value === 'captcha') {
      captchaForm.verifyCode = ''
      await loadCaptchaImage()
    }
    submitting.value = false
    return Promise.reject(e)
  }
  submitting.value = false
}

async function onCancel() {
  visible.value = false
  await nextTick()
  emit('cancel')
}

watch(
  () => props.verifyResult,
  (val) => {
    if (!val) return
    if (val.type === 'captcha') {
      loadCaptchaConfig()
    } else {
      loadIdentities()
      validationSent.value = false
      validationData.value = null
      // 清除倒计时
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
      countdown.value = 0
    }
  },
  { immediate: true }
)

// 监听visible变化，自动focus到对应输入框
watch(
  () => visible.value,
  (val) => {
    if (!val) return
    nextTick(() => {
      if (type.value === 'captcha' && captchaConfig.value?.type === 'image') {
        // 图片验证码：focus到验证码输入框
        captchaInputRef.value?.focus()
      } else if (type.value === 'identity' && validationSent.value) {
        // 身份验证：如果已发送验证码，focus到验证码输入框
        identityCodeInputRef.value?.focus()
      }
    })
  }
)

// 监听validationSent变化，当验证码输入框出现时自动focus
watch(
  () => validationSent.value,
  (val) => {
    if (val && visible.value && type.value === 'identity') {
      nextTick(() => {
        identityCodeInputRef.value?.focus()
      })
    }
  }
)

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})
</script>

<style scoped lang="less">
.captcha-suffix {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding-left: 8px;
  border-left: 1px solid #d9d9d9;
}
.captcha-img {
  height: 32px;
  width: 130px;
  object-fit: contain;
  display: block;
}
.captcha-loading {
  font-size: 12px;
  color: #999;
}
.identity-empty {
  text-align: center;
  padding: 24px 0;
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  .empty-text {
    font-size: 16px;
    font-weight: 500;
    color: #262626;
    margin-bottom: 8px;
  }
  .empty-desc {
    font-size: 14px;
    color: #8c8c8c;
    margin-bottom: 24px;
  }
}
</style>
