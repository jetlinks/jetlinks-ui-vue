<template>
  <div class="authorize-wrapper">
    <div
      v-if="isLoading && !isExpired"
      class="loading-container"
    >
      <div class="loading-card">
        <a-spin size="large" />
        <p class="loading-text">正在加载配置...</p>
      </div>
    </div>

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
import { encrypt, LocalStore, onlyMessage } from '@jetlinks-web/utils'

const PERSONAL_TOKEN_KEY = 'X-Personal-Token'
const PERSONAL_TOKEN_URL_KEY = ':X_Personal_Token'
const ERROR_MESSAGES = {
  MISSING_TOKEN: '缺少必要的授权参数',
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
      const redirectUrl = processRedirectUrl(response.result)
      if (params) {
        onlyMessage(ERROR_MESSAGES.AUTH_SUCCESS)
        setTimeout(() => {
          window.location.href = redirectUrl
        }, 1000)
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
  } catch (error) {
    console.error('表单验证失败:', error)
  }
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
      .catch((error) => {
        console.error('获取授权配置失败:', error)
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
  background: #f5f5f5;
  padding: 20px;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading-card {
  text-align: center;
}

.loading-text {
  margin-top: 16px;
  color: #666;
}

.status-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.status-card {
  background: white;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-card.error .status-icon {
  color: #ff4d4f;
}

.status-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.status-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.status-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 24px;
}

.status-footer {
  margin-top: 24px;
}

.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.auth-card {
  background: white;
  border-radius: 8px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: #1890ff;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 24px;
  color: white;
}

.auth-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.auth-form {
  width: 100%;
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
}

.verify-code-placeholder:hover {
  background: #e8e8e8;
}

.form-actions {
  margin-top: 24px;
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .auth-card,
  .status-card,
  .loading-card {
    padding: 24px;
  }

  .auth-logo {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .auth-title,
  .status-title {
    font-size: 18px;
  }

  .status-icon {
    font-size: 40px;
  }
}
</style>
