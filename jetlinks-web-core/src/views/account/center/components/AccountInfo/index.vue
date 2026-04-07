<template>
  <div class="account-info">
      <!-- 基本信息（表单样式 + 头像设置） -->
      <section class="account-info-section basic-info-section">
        <h3 class="section-title">{{ $t('AccountInfo.basicSection') }}</h3>
        <div class="basic-layout">
          <div class="basic-layout-left">
            <div class="basic-form">
              <!-- 名称 -->
              <div class="basic-form-item">
                <div class="basic-form-label">{{ $t('AccountInfo.basicName') }}</div>
                <div class="basic-form-control">
                  <a-input
                    v-model:value="editName"
                    :placeholder="$t('AccountInfo.basicNamePlaceholder')"
                    style="max-width: 360px"
                  />
                  <a-button
                    v-if="showNameSave"
                    type="primary"
                    size="small"
                    :loading="savingName"
                    @click="saveName"
                  >
                    {{ $t('AccountInfo.save') }}
                  </a-button>
                </div>
                <div class="basic-form-desc">{{ $t('AccountInfo.nameDesc') }}</div>
              </div>

              <!-- 用户名 -->
              <div class="basic-form-item">
                <div class="basic-form-label">{{ $t('AccountInfo.basicUsername') }}</div>
                <div class="basic-form-control">
                  <a-input
                    :value="userInfo?.username"
                    disabled
                    style="max-width: 360px"
                  />
                </div>
                <div class="basic-form-desc">{{ $t('AccountInfo.usernameDesc') }}</div>
              </div>

              <!-- 密码 -->
              <div class="basic-form-item">
                <div class="basic-form-label">{{ $t('AccountInfo.password') }}</div>
                <div class="basic-form-control">
                  <a-input value="******" disabled style="max-width: 360px" />
                  <a-button type="link" size="small" class="basic-info-password-edit" @click="openPasswordDialog">
                    {{ $t('AccountInfo.editPassword') }}
                  </a-button>
                </div>
                <div class="basic-form-desc">{{ $t('AccountInfo.passwordDesc') }}</div>
              </div>
            </div>
          </div>
          <div class="basic-layout-right">
            <div class="avatar-label">{{ $t('AccountInfo.avatar') }}</div>
            <UploadAvatar
              :modelValue="userInfo?.avatar"
              :accept="avatarTypes && avatarTypes.length ? avatarTypes.toString() : ''"
              @change="onAvatarChange"
            />
            <div class="avatar-desc">{{ $t('AccountInfo.avatarDesc') }}</div>
          </div>
        </div>

        <!-- 角色 / 组织 / 职位 信息展示（独立一行占据整行宽度） -->
        <div class="basic-form-meta">
          <div class="basic-form-meta-item">
            <div class="basic-form-meta-label">{{ $t('AccountInfo.roles') }}</div>
            <div class="basic-form-meta-value">
              <template v-if="(userInfo?.roleList || []).length">
                <a-tag
                  v-for="item in userInfo?.roleList || []"
                  :key="item.id || item.name"
                  color="blue"
                >
                  {{ item.name }}
                </a-tag>
              </template>
              <span v-else class="basic-form-meta-empty">
                {{ $t('Detail.index.153077-6') }}
              </span>
            </div>
          </div>

          <div class="basic-form-meta-item">
            <div class="basic-form-meta-label">{{ $t('AccountInfo.orgs') }}</div>
            <div class="basic-form-meta-value">
              <template v-if="orgList.length">
                <a-popover placement="topLeft">
                  <template #content>
                    <div class="org-popover-content">
                      <div
                        v-for="item in orgList"
                        :key="item.id || item.name"
                        class="org-popover-item"
                      >
                        {{ item.fullName || item.name }}
                      </div>
                    </div>
                  </template>
                  <span class="org-summary">
                    {{ orgSummary }}
                  </span>
                </a-popover>
              </template>
              <span v-else class="basic-form-meta-empty">
                {{ $t('Detail.index.153077-7') }}
              </span>
            </div>
          </div>

          <div class="basic-form-meta-item">
            <div class="basic-form-meta-label">{{ $t('AccountInfo.positions') }}</div>
            <div class="basic-form-meta-value">
              <template v-if="(userInfo?.positions || []).length">
                <a-tag
                  v-for="item in userInfo?.positions || []"
                  :key="item.id || item.name"
                  color="purple"
                >
                  {{ item.name }}
                </a-tag>
              </template>
              <span v-else class="basic-form-meta-empty">
                {{ $t('Detail.index.153077-9') }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 邮箱 -->
      <section id="email-section" class="account-info-section" v-if="identitySupported && hasEmailProvider">
        <h3 class="section-title">{{ $t('AccountInfo.emailSection') }}</h3>
        <p class="section-desc">{{ $t('AccountInfo.emailSectionDesc') }}</p>
        <div class="section-content">
          <template v-if="emailList.length">
            <div v-for="item in emailList" :key="item.id" class="identity-item identity-item-email">
              <div class="identity-item-left">
                <span class="identity-value">{{ item.identity }}</span>
                <a-tag color="green" class="verified-tag">{{ $t('AccountInfo.verified') }}</a-tag>
              </div>
              <a-popconfirm
                :title="$t('AccountInfo.deleteConfirm')"
                @confirm="() => removeEmailIdentity(item)"
              >
                <a-button type="link" size="small" class="identity-item-unbind">
                  {{ $t('AccountInfo.unbind') }}
                </a-button>
              </a-popconfirm>
            </div>
          </template>
          <div v-else class="empty-hint">{{ $t('AccountInfo.noEmailBound') }}</div>
          <div v-if="hasEmailProvider">
            <template v-if="!emailConfirmState">
              <a-input
                v-model:value="newEmail"
                :placeholder="$t('AccountInfo.pleaseEnterEmail')"
                style="width: 240px; margin-right: 8px"
                allow-clear
              />
              <a-button type="primary" :loading="emailValidating" @click="requestEmailValidation">
                {{ $t('AccountInfo.addEmail') }}
              </a-button>
            </template>
            <template v-else>
              <div class="add-row">
                <a-input
                  v-model:value="emailCode"
                  :placeholder="$t('AccountInfo.enterCode')"
                  style="width: 160px; margin-right: 8px"
                  allow-clear
                  maxlength="8"
                />
                <a-button type="primary" :loading="emailConfirming" @click="confirmEmailBind">
                  {{ $t('AccountInfo.confirmBind') }}
                </a-button>
                <a-button 
                  :disabled="emailCountdown > 0" 
                  @click="resendEmailCode"
                >
                  {{ emailCountdown > 0 ? `${emailCountdown}秒后重新发送` : $t('AccountInfo.resendCode') }}
                </a-button>
              </div>
              <div class="code-sent-hint">{{ $t('AccountInfo.codeSentTo', { email: emailConfirmState.identity }) }}</div>
            </template>
          </div>
        </div>
      </section>

      <!-- 手机号 -->
      <section id="phone-section" class="account-info-section" v-if="identitySupported && hasMobileProvider">
        <h3 class="section-title">{{ $t('AccountInfo.phoneSection') }}</h3>
        <p class="section-desc">{{ $t('AccountInfo.phoneSectionDesc') }}</p>
        <div class="section-content">
          <template v-if="phoneList.length">
            <div v-for="item in phoneList" :key="item.id" class="identity-item identity-item-email">
              <div class="identity-item-left">
                <span class="identity-value">{{ item.identity }}</span>
                <a-tag color="green" class="verified-tag">{{ $t('AccountInfo.verified') }}</a-tag>
              </div>
              <a-popconfirm
                :title="$t('AccountInfo.deleteConfirm')"
                @confirm="() => removeEmailIdentity(item)"
              >
                <a-button type="link" size="small" class="identity-item-unbind">
                  {{ $t('AccountInfo.unbind') }}
                </a-button>
              </a-popconfirm>
            </div>
          </template>
          <div v-else class="empty-hint">{{ $t('AccountInfo.noPhoneBound') }}</div>
          <div v-if="hasMobileProvider">
            <template v-if="!phoneConfirmState">
              <a-input
                v-model:value="newPhone"
                :placeholder="$t('AccountInfo.pleaseEnterPhone')"
                style="width: 240px; margin-right: 8px"
                allow-clear
              />
              <a-button type="primary" :loading="phoneValidating" @click="requestPhoneValidation">
                {{ $t('AccountInfo.addPhone') }}
              </a-button>
            </template>
            <template v-else>
              <div class="add-row">
                <a-input
                  v-model:value="phoneCode"
                  :placeholder="$t('AccountInfo.enterCode')"
                  style="width: 160px; margin-right: 8px"
                  allow-clear
                  maxlength="8"
                />
                <a-button type="primary" :loading="phoneConfirming" @click="confirmPhoneBind">
                  {{ $t('AccountInfo.confirmBind') }}
                </a-button>
                <a-button 
                  :disabled="phoneCountdown > 0" 
                  @click="resendPhoneCode"
                >
                  {{ phoneCountdown > 0 ? `${phoneCountdown}秒后重新发送` : $t('AccountInfo.resendCode') }}
                </a-button>
              </div>
              <div class="code-sent-hint">{{ $t('AccountInfo.codeSentToPhone', { phone: phoneConfirmState.identity }) }}</div>
            </template>
          </div>
        </div>
      </section>

      <!-- 第三方账号 -->
      <section class="account-info-section" v-if="hasThirdAccount">
        <h3 class="section-title">{{ $t('AccountInfo.thirdSection') }}</h3>
        <p class="section-desc">{{ $t('AccountInfo.thirdSectionDesc') }}</p>
        <div class="section-content">
          <BindThirdAccount />
        </div>
      </section>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@jetlinks-web-core/store'
import {
  getSelfIdentities_api,
  getIdentityProviders_api,
  requestIdentityValidation_api,
  confirmIdentityValidation_api,
  unbindIdentity_api,
  getSsoBinds_api,
  updateMeInfo_api,
} from '@jetlinks-web-core/api/account/center'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n'
import { queryModal } from '@jetlinks-web-core/api/login'
import BindThirdAccount from '../BindThirdAccount/index.vue'
import UploadAvatar from '../UploadAvatar/index.vue'

interface IdentityItem {
  id: string
  userId: string
  provider: string
  identity: string
  boundTime?: number
  isPrimary?: boolean
}

const { t: $t } = useI18n()
const route = useRoute()
const router = useRouter()
const user = useUserStore()
const userInfo = computed(() => user.userInfo)
const emit = defineEmits(['open-edit-password'])

// 是否支持身份（邮箱/手机号）绑定能力，由后端 authService:identity 控制
const identitySupported = ref(false)
const identityList = ref<IdentityItem[]>([])
const providers = ref<{ id: string; name: string }[]>([])
const newEmail = ref('')
const newPhone = ref('')
const emailValidating = ref(false)
const phoneValidating = ref(false)
const editName = ref('')
const savingName = ref(false)
const avatarTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/jfif', 'image/pjp', 'image/pjpeg']
/** 邮箱验证码确认：发起验证后保存 requestId/token/context，用于确认接口 */
const emailConfirmState = ref<{
  requestId: string
  token: string
  context?: Record<string, unknown>
  identity: string
} | null>(null)
const emailCode = ref('')
const emailConfirming = ref(false)
const emailCountdown = ref(0)
let emailCountdownTimer: ReturnType<typeof setInterval> | null = null
/** 手机号验证码确认：发起验证后保存 requestId/token/context，用于确认接口 */
const phoneConfirmState = ref<{
  requestId: string
  token: string
  context?: Record<string, unknown>
  identity: string
} | null>(null)
const phoneCode = ref('')
const phoneConfirming = ref(false)
const phoneCountdown = ref(0)
let phoneCountdownTimer: ReturnType<typeof setInterval> | null = null
// 是否存在支持的第三方账号（用于控制「第三方账号」整个区块是否展示）
const hasThirdAccount = ref(false)

const emailList = computed(() =>
  identityList.value.filter((i) => i.provider === 'email'),
)
const phoneList = computed(() =>
  identityList.value.filter((i) => i.provider === 'mobile'),
)
const primaryEmail = computed(() => {
  const primary = emailList.value.find((i) => i.isPrimary)
  return primary?.identity ?? (emailList.value[0]?.identity ?? undefined)
})
const primaryPhone = computed(() => {
  const primary = phoneList.value.find((i) => i.isPrimary)
  return primary?.identity ?? (phoneList.value[0]?.identity ?? undefined)
})
const hasEmailProvider = computed(() =>
  providers.value.some((p) => p.id === 'email'),
)
const hasMobileProvider = computed(() =>
  providers.value.some((p) => p.id === 'mobile'),
)

const orgList = computed(() => (userInfo.value?.orgList as any[]) || [])

const orgSummary = computed(() => {
  const list = orgList.value || []
  if (!list.length) return ''
  if (list.length <= 2) {
    return list.map((i: any) => i.name).join('、')
  }
  const firstTwo = list.slice(0, 2).map((i: any) => i.name).join('、')
  return `${firstTwo} 等 ${list.length} 个`
})

const showNameSave = computed(() => {
  const origin = (userInfo.value?.name || '').trim()
  const current = (editName.value || '').trim()
  return current && current !== origin
})

watch(
  () => userInfo.value?.name,
  (val) => {
    editName.value = val || ''
  },
  { immediate: true },
)

const saveName = async () => {
  const name = (editName.value || '').trim()
  if (!name) {
    onlyMessage($t('AccountInfo.basicNamePlaceholder'), 'warning')
    return
  }
  savingName.value = true
  try {
    const payload = {
      ...userInfo.value,
      name,
    }
    const resp: any = await updateMeInfo_api(payload)
    if (resp?.status === 200 || resp?.success) {
      onlyMessage($t('AccountInfo.saveSuccess'), 'success')
      await user.getUserInfo()
    }
  } finally {
    savingName.value = false
  }
}

const onAvatarChange = async (url: string) => {
  if (!url) return
  const payload = {
    ...userInfo.value,
    avatar: url,
  }
  const resp: any = await updateMeInfo_api(payload)
  if (resp?.status === 200 || resp?.success) {
    onlyMessage($t('AccountInfo.saveSuccess'), 'success')
    await user.getUserInfo()
  }
}

const openPasswordDialog = () => {
  emit('open-edit-password')
}

async function checkIdentitySupport() {
  try {
    const resp: any = await queryModal('authService:identity')
    let supported = false
    if (typeof resp === 'boolean') {
      supported = resp
    } else if (typeof resp?.result === 'boolean') {
      supported = resp.result
    } else if (resp?.success && typeof resp.result === 'boolean') {
      supported = resp.result
    }
    identitySupported.value = supported
  } catch {
    identitySupported.value = false
  }
}

async function loadIdentities() {
  try {
    const resp: any = await getSelfIdentities_api()
    const list = Array.isArray(resp?.result) ? resp.result : (Array.isArray(resp) ? resp : [])
    identityList.value = list
  } catch {
    identityList.value = []
  }
}

async function loadProviders() {
  try {
    const resp: any = await getIdentityProviders_api()
    const list = Array.isArray(resp?.result) ? resp.result : (Array.isArray(resp) ? resp : [])
    providers.value = list
  } catch {
    providers.value = []
  }
}

async function checkThirdAccount() {
  try {
    const resp: any = await getSsoBinds_api()
    if (resp?.status === 200 && Array.isArray(resp.result)) {
      const list = resp.result.filter((item: any) => !item.features?.includes('ssoUnsupportedRedirect'))
      hasThirdAccount.value = list.length > 0
    } else if (Array.isArray(resp)) {
      hasThirdAccount.value = resp.length > 0
    } else {
      hasThirdAccount.value = false
    }
  } catch {
    hasThirdAccount.value = false
  }
}

async function requestEmailValidation() {
  const email = emailConfirmState.value?.identity ?? newEmail.value?.trim()
  if (!email) {
    onlyMessage($t('AccountInfo.pleaseEnterEmail'), 'warning')
    return
  }
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailReg.test(email)) {
    onlyMessage($t('EditInfo.index.557023-15'), 'warning')
    return
  }
  // 如果倒计时中，不允许重新发送
  if (emailCountdown.value > 0) {
    return
  }
  emailValidating.value = true
  try {
    const resp: any = await requestIdentityValidation_api({
      provider: 'email',
      identity: email,
    })
    const result = resp?.result ?? resp
    const ok = resp?.status === 200 && result?.requestId && result?.token
    if (ok) {
      onlyMessage($t('AccountInfo.validationSent'), 'success')
      emailConfirmState.value = {
        requestId: result.requestId,
        token: result.token,
        context: result.context,
        identity: email,
      }
      emailCode.value = ''
      newEmail.value = ''
      // 启动倒计时
      const intervalSeconds = result?.intervalSeconds ?? 60
      startEmailCountdown(intervalSeconds)
    }
  } finally {
    emailValidating.value = false
  }
}

function startEmailCountdown(seconds: number) {
  // 清除之前的定时器
  if (emailCountdownTimer) {
    clearInterval(emailCountdownTimer)
    emailCountdownTimer = null
  }
  emailCountdown.value = seconds
  emailCountdownTimer = setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0) {
      if (emailCountdownTimer) {
        clearInterval(emailCountdownTimer)
        emailCountdownTimer = null
      }
    }
  }, 1000)
}

async function confirmEmailBind() {
  const state = emailConfirmState.value
  if (!state || !emailCode.value?.trim()) {
    onlyMessage($t('AccountInfo.enterCode'), 'warning')
    return
  }
  emailConfirming.value = true
  try {
    await confirmIdentityValidation_api('email', {
      requestId: state.requestId,
      token: state.token,
      context: state.context,
      params: { code: emailCode.value.trim() },
    })
    onlyMessage($t('AccountInfo.bindSuccess'), 'success')
    emailConfirmState.value = null
    emailCode.value = ''
    await loadIdentities()
    
    // 如果是在新窗口中打开的，通知原窗口刷新
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage({ type: 'identity_bind_completed' }, window.location.origin)
      } catch (e) {
        console.error('通知原窗口失败:', e)
      }
    }
  } catch (err: any) {
    const code = err?.response?.data?.code ?? err?.code ?? ''
    const msg = err?.response?.data?.message ?? err?.message ?? ''
    const isTimeout =
      code === 'error.identity.validation.timeout' ||
      String(msg).includes('timeout') ||
      String(msg).includes('过期')
    if (isTimeout) {
      onlyMessage($t('AccountInfo.validationTimeout'), 'warning')
      emailConfirmState.value = null
      emailCode.value = ''
    }
  } finally {
    emailConfirming.value = false
  }
}

function resendEmailCode() {
  // 如果倒计时中，不允许重新发送
  if (emailCountdown.value > 0) {
    return
  }
  const email = emailConfirmState.value?.identity
  emailConfirmState.value = null
  emailCode.value = ''
  if (email) newEmail.value = email
  requestEmailValidation()
}

async function removeEmailIdentity(item: IdentityItem) {
  try {
    const resp: any = await unbindIdentity_api(item.provider, [item.id])
    const ok = resp?.status === 200 || resp?.result === undefined
    if (ok) {
      onlyMessage($t('AccountInfo.deleteSuccess'), 'success')
      await loadIdentities()
    }
  } catch (e) {
    // ignore, 交给全局错误处理
  }
}

async function requestPhoneValidation() {
  const phone = phoneConfirmState.value?.identity ?? newPhone.value?.trim()
  if (!phone) {
    onlyMessage($t('AccountInfo.pleaseEnterPhone'), 'warning')
    return
  }
  const phoneReg = /^1[3456789]\d{9}$/
  if (!phoneReg.test(phone)) {
    onlyMessage($t('EditInfo.index.557023-12'), 'warning')
    return
  }
  // 如果倒计时中，不允许重新发送
  if (phoneCountdown.value > 0) {
    return
  }
  phoneValidating.value = true
  try {
    const resp: any = await requestIdentityValidation_api({
      provider: 'mobile',
      identity: phone,
    })
    const result = resp?.result ?? resp
    const ok = resp?.status === 200 && result?.requestId && result?.token
    if (ok) {
      onlyMessage($t('AccountInfo.validationSmsSent'), 'success')
      phoneConfirmState.value = {
        requestId: result.requestId,
        token: result.token,
        context: result.context,
        identity: phone,
      }
      phoneCode.value = ''
      newPhone.value = ''
      // 启动倒计时
      const intervalSeconds = result?.intervalSeconds ?? 60
      startPhoneCountdown(intervalSeconds)
    }
  } finally {
    phoneValidating.value = false
  }
}

function startPhoneCountdown(seconds: number) {
  // 清除之前的定时器
  if (phoneCountdownTimer) {
    clearInterval(phoneCountdownTimer)
    phoneCountdownTimer = null
  }
  phoneCountdown.value = seconds
  phoneCountdownTimer = setInterval(() => {
    phoneCountdown.value--
    if (phoneCountdown.value <= 0) {
      if (phoneCountdownTimer) {
        clearInterval(phoneCountdownTimer)
        phoneCountdownTimer = null
      }
    }
  }, 1000)
}

async function confirmPhoneBind() {
  const state = phoneConfirmState.value
  if (!state || !phoneCode.value?.trim()) {
    onlyMessage($t('AccountInfo.enterCode'), 'warning')
    return
  }
  phoneConfirming.value = true
  try {
    await confirmIdentityValidation_api('mobile', {
      requestId: state.requestId,
      token: state.token,
      context: state.context,
      params: { code: phoneCode.value.trim() },
    })
    onlyMessage($t('AccountInfo.bindPhoneSuccess'), 'success')
    phoneConfirmState.value = null
    phoneCode.value = ''
    await loadIdentities()
    
    // 如果是在新窗口中打开的，通知原窗口刷新
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage({ type: 'identity_bind_completed' }, window.location.origin)
      } catch (e) {
        console.error('通知原窗口失败:', e)
      }
    }
  } catch (err: any) {
    const code = err?.response?.data?.code ?? err?.code ?? ''
    const msg = err?.response?.data?.message ?? err?.message ?? ''
    const isTimeout =
      code === 'error.identity.validation.timeout' ||
      String(msg).includes('timeout') ||
      String(msg).includes('过期')
    if (isTimeout) {
      onlyMessage($t('AccountInfo.validationTimeout'), 'warning')
      phoneConfirmState.value = null
      phoneCode.value = ''
    }
  } finally {
    phoneConfirming.value = false
  }
}

function resendPhoneCode() {
  // 如果倒计时中，不允许重新发送
  if (phoneCountdown.value > 0) {
    return
  }
  const phone = phoneConfirmState.value?.identity
  phoneConfirmState.value = null
  phoneCode.value = ''
  if (phone) newPhone.value = phone
  requestPhoneValidation()
}

// 处理锚点滚动（从 query 参数中获取）
const scrollToAnchor = () => {
  // 优先从 query 参数获取锚点（用于从验证页面跳转过来）
  const anchorFromQuery = route.query?.anchor as string
  
  if (anchorFromQuery) {
    setTimeout(() => {
      const element = document.getElementById(anchorFromQuery)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // 滚动完成后清除 query 参数，避免刷新时重复滚动
        const newQuery = { ...route.query }
        delete newQuery.anchor
        router.replace({ 
          path: route.path, 
          query: newQuery
        })
      }
    }, 300)
  }
}

onMounted(async () => {
  await checkIdentitySupport()
  if (identitySupported.value) {
    loadProviders()
    await loadIdentities()
  }
  checkThirdAccount()
  
  // 等待DOM渲染完成后再滚动
  await nextTick()
  scrollToAnchor()
  
  // 监听路由 query 变化（用于锚点滚动）
  watch(() => route.query?.anchor, (newAnchor) => {
    if (newAnchor) {
      scrollToAnchor()
    }
  })
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (emailCountdownTimer) {
    clearInterval(emailCountdownTimer)
    emailCountdownTimer = null
  }
  if (phoneCountdownTimer) {
    clearInterval(phoneCountdownTimer)
    phoneCountdownTimer = null
  }
})
</script>

<style lang="less" scoped>
.account-info {
  max-width: 800px;
  padding: 0 4px;
}

.basic-info-section {
  .basic-layout {
    display: flex;
    justify-content: space-between;
    gap: 32px;
  }

  .basic-layout-left {
    flex: 1;
    min-width: 0;
  }

  .basic-layout-right {
    width: 220px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .basic-form {
    padding: 4px 4px 0;
  }

  .basic-form-item {
    margin-bottom: 20px;
  }

  .basic-form-label {
    font-size: 13px;
    font-weight: 500;
    color: #1d2129;
    margin-bottom: 6px;
  }

  .basic-form-control {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .basic-form-desc {
    margin-top: 4px;
    font-size: 12px;
    color: #86909c;
  }

  .basic-info-password-edit {
    padding: 0 4px;
  }

  .avatar-label {
    font-size: 13px;
    font-weight: 500;
    color: #1d2129;
  }

  .avatar-desc {
    font-size: 12px;
    color: #86909c;
  }

  .basic-form-meta {
    margin-top: 8px;
    border-top: 1px solid #f0f0f0;
    padding-top: 12px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 24px;
    row-gap: 0;
  }

  .basic-form-meta-item {
    font-size: 13px;
    color: #4e5969;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    row-gap: 4px;
  }

  .basic-form-meta-label {
    color: #86909c;
    font-size: 12px;
  }

  .basic-form-meta-value {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .basic-form-meta-empty {
    font-size: 12px;
    color: #c9cdd4;
  }

  .org-summary {
    cursor: pointer;
    white-space: nowrap;
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .org-popover-content {
    max-width: 320px;
  }

  .org-popover-item {
    font-size: 13px;
    color: #4e5969;
    line-height: 1.5;
  }
}

.account-info-section {
  margin-bottom: 32px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1d2129;
    margin: 0 0 8px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e6eb;
  }

  .section-desc {
    font-size: 13px;
    color: #86909c;
    margin: 0 0 12px 0;
  }

  .section-content {
    padding-left: 0;
  }

  .basic-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px 24px;

    .basic-item {
      .label {
        display: block;
        font-size: 13px;
        color: #86909c;
        margin-bottom: 4px;
      }
      .value {
        font-size: 14px;
        color: #1d2129;
      }
      .muted {
        color: #86909c;
      }
    }
  }

  .identity-item {
    padding: 10px 12px;
    background: #f7f8fa;
    border-radius: 6px;
    margin-bottom: 8px;

    .identity-value {
      font-size: 14px;
      color: #1d2129;
    }
  }

  .identity-item-email {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;

    .identity-item-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .verified-tag {
      margin: 0;
    }
    .identity-item-unbind {
      color: #86909c;
      padding: 0 4px;
      &:hover {
        color: @primary-color;
      }
    }
  }

  .empty-hint {
    font-size: 13px;
    color: #86909c;
    margin-bottom: 12px;
  }

  .add-row {
    margin-top: 12px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .code-sent-hint {
    margin-top: 6px;
    font-size: 12px;
    color: #c9cdd4;
    line-height: 1.4;
  }

  .email-code-row {
    margin-bottom: 8px;
  }
  .email-code-desc {
    font-size: 13px;
    color: #4e5969;
  }
}
</style>
