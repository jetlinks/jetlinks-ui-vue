<template>
  <div class="authorize-wrapper">
    <!-- 加载状态 -->
    <div
      v-if="isLoading && !isExpired"
      class="loading-container"
    >
      <div class="loading-card">
        <a-spin size="large" />
        <p class="loading-text">正在加载配置...</p>
      </div>
    </div>

    <!-- 链接过期状态 -->
    <div
      v-else-if="isExpired"
      class="status-container"
    >
      <div class="status-card error">
        <div class="status-icon">
          <AIcon type="CloseCircleOutlined" />
        </div>
        <h2 class="status-title">链接已失效</h2>
        <p class="status-description">授权链接已过期或无效，请重新获取授权链接</p>
        <div class="status-footer">
          <a-button
            @click="handleRefresh"
            ghost
          >
            <AIcon type="ReloadOutlined" />
            重新加载
          </a-button>
        </div>
      </div>
    </div>

    <!-- 密码授权表单 -->
    <div
      v-else-if="config.authType === 'password'"
      class="auth-container"
    >
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">
            <AIcon type="SafetyOutlined" />
          </div>
          <h1 class="auth-title">授权认证</h1>
        </div>

        <a-form
          ref="formRef"
          :model="formState"
          name="authorize"
          @finish="handleSubmit"
          class="auth-form"
          layout="vertical"
        >
          <a-form-item
            name="password"
            :rules="passwordRules"
          >
            <a-input-password
              v-model:value="formState.password"
              placeholder="请输入授权密码"
              size="large"
              @pressEnter="handleSubmit"
            >
              <template #prefix>
                <AIcon type="LockOutlined" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item
            v-if="showVerificationCode"
            name="verifyCode"
            :rules="verifyCodeRules"
          >
            <a-input
              v-model:value="formState.verifyCode"
              placeholder="请输入验证码"
              size="large"
              autocomplete="off"
            >
              <template #prefix>
                <AIcon type="SafetyCertificateOutlined" />
              </template>
              <template #suffix>
                <div
                  class="verify-code-wrapper"
                  @click="refreshVerificationCode"
                >
                  <img
                    v-if="verificationCodeUrl"
                    :src="verificationCodeUrl"
                    alt="验证码"
                    class="verify-code-image"
                  />
                  <div
                    v-else
                    class="verify-code-placeholder"
                  >
                    <AIcon type="ReloadOutlined" />
                  </div>
                </div>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item class="form-actions">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              block
              :loading="isSubmitting"
            >
              {{ isSubmitting ? '验证中...' : '立即授权' }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getTokenConfig, getTokenRedirect } from '@/api/comm'
import { codeUrl } from '@/api/login'
import { useRequest } from '@jetlinks-web/hooks'
import { encrypt, LocalStore } from '@jetlinks-web/utils'

const PERSONAL_TOKEN_KEY = 'X-Personal-Token'
const PERSONAL_TOKEN_URL_KEY = ':X_Personal_Token'
const ERROR_MESSAGES = {
  MISSING_TOKEN: '缺少必要的授权参数',
  CONFIG_FAILED: '获取授权配置失败',
  REDIRECT_FAILED: '授权跳转失败',
  EXPIRED_LINK: '授权链接已失效',
  AUTH_SUCCESS: '授权成功，正在跳转...'
}

const formRef = ref(null)
const config = ref({})
const personalToken = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
const isExpired = ref(false)
const verificationData = ref({})
const showVerificationCode = ref(false)

const formState = reactive({
  password: '',
  verifyCode: '',
  verifyKey: ''
})

const verificationCodeUrl = computed(() => verificationData.value?.base64 || '')

const passwordRules = [
  { required: true, message: '请输入授权密码', trigger: 'blur' },
  { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
]

const verifyCodeRules = [
  { required: true, message: '请输入验证码', trigger: 'blur' },
  { len: 4, message: '验证码长度为4位', trigger: 'blur' }
]

const { run: refreshVerificationCode } = useRequest(codeUrl, {
  immediate: false,
  onSuccess(resp) {
    if (resp.result?.key && showVerificationCode.value) {
      formState.verifyKey = resp.result.key
      verificationData.value = resp.result
    }
  },
  onError() {
    onlyMessage('获取验证码失败，请重试', 'error')
  }
})

const handleRedirect = async (params) => {
  try {
    isSubmitting.value = true
    const response = await getTokenRedirect(personalToken.value, params || {})

    if (response?.result) {
      console.log('response: ', response)
      const redirectUrl = processRedirectUrl(response.result)
      if (params) {
        onlyMessage(ERROR_MESSAGES.AUTH_SUCCESS)
        setTimeout(() => {
          window.location.href = redirectUrl
        }, 1500)
      } else {
        window.location.href = redirectUrl
      }
    }
  } catch (error) {
    if (error.status === 401 || error.status === 500) {
      isExpired.value = true
    } else {
      if (showVerificationCode.value) {
        refreshVerificationCode()
        formState.verifyCode = ''
      }
    }
  } finally {
    isSubmitting.value = false
  }
}

const processRedirectUrl = (urlString) => {
  const urlObject = new URL(urlString)
  const token = urlObject.searchParams.get(PERSONAL_TOKEN_URL_KEY)

  if (token) {
    LocalStore.set(PERSONAL_TOKEN_KEY, token)
    urlObject.searchParams.delete(PERSONAL_TOKEN_URL_KEY)
  }

  return urlObject.toString()
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    const authParameters = buildAuthParameters()
    await handleRedirect({ authParameters })
  } catch (error) {}
}

const buildAuthParameters = () => {
  const params = {
    password: formState.password
  }

  if (config.value?.authConfiguration?.encrypt?.enabled) {
    params.password = encrypt(formState.password, config.value.authConfiguration.encrypt.publicKey)
    params.encryptId = config.value.authConfiguration.encrypt.id
  }

  if (showVerificationCode.value) {
    params.verifyKey = formState.verifyKey
    params.verifyCode = formState.verifyCode
  }

  return params
}

const initialize = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    personalToken.value = urlParams.get('personal_token')

    if (!personalToken.value) {
      onlyMessage(ERROR_MESSAGES.MISSING_TOKEN, 'error')
      isExpired.value = true
      return
    }

    isLoading.value = true
    await getTokenConfig(personalToken.value)
      .then(async (res) => {
        config.value = res.result

        switch (res.result.authType) {
          case 'password':
            handlePasswordAuth(res.result)
            break
          case 'none':
            await handleRedirect()
            break
          default:
            onlyMessage('不支持的授权类型', 'error')
        }
      })
      .catch(() => {
        isExpired.value = true
      })
  } finally {
    isLoading.value = false
  }
}

const handlePasswordAuth = (authConfig) => {
  showVerificationCode.value = authConfig.authConfiguration?.captchaType === 'image'
  if (showVerificationCode.value) {
    refreshVerificationCode()
  }
}

const handleRefresh = () => {
  isExpired.value = false
  formState.password = ''
  formState.verifyCode = ''
  initialize()
}

onMounted(() => {
  initialize()
})
</script>

<style scoped>
.authorize-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Loading Container */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading-card {
  background: white;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.loading-text {
  margin-top: 24px;
  font-size: 16px;
  color: #666;
}

/* Status Container */
.status-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.status-card {
  background: white;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.status-card.error .status-icon {
  color: #ff4d4f;
}

.status-card.info .status-icon {
  color: #1890ff;
}

.status-icon {
  font-size: 72px;
  margin-bottom: 24px;
}

.status-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.status-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
}

.status-footer {
  margin-top: 32px;
}

/* Auth Container */
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 48px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin-bottom: 24px;
  font-size: 36px;
  color: white;
}

.auth-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.auth-form {
  width: 100%;
}

.auth-form :deep(.ant-input-affix-wrapper),
.auth-form :deep(.ant-input) {
  border-radius: 8px;
}

.auth-form :deep(.ant-input) {
  height: 38px;
}

.auth-form :deep(.ant-input-prefix) {
  margin-right: 12px;
  color: #999;
}

.verify-code-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  min-width: 80px;
}

.verify-code-image {
  height: 32px;
  border-radius: 4px;
}

.verify-code-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 32px;
  background: #f5f5f5;
  border-radius: 4px;
  color: #999;
  font-size: 18px;
}

.verify-code-placeholder:hover {
  background: #e8e8e8;
  color: #666;
}

.form-actions {
  margin-top: 32px;
  margin-bottom: 0;
}

.form-actions :deep(.ant-btn) {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 640px) {
  .auth-card,
  .status-card,
  .loading-card {
    padding: 32px 24px;
  }

  .auth-logo {
    width: 64px;
    height: 64px;
    font-size: 28px;
  }

  .auth-title,
  .status-title {
    font-size: 24px;
  }

  .status-description {
    font-size: 14px;
  }

  .status-icon {
    font-size: 56px;
  }
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-card,
.status-card,
.loading-card {
  animation: fadeIn 0.5s ease-out;
}
</style>
