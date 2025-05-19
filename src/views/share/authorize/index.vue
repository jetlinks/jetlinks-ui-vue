<template>
  <div
    class="login-container"
    v-if="config.authType === 'password'"
  >
    <div class="login-card">
      <div class="login-header">
        <h1>授权认证</h1>
      </div>

      <a-form
        :model="formState"
        name="login"
        @finish="handleSubmit"
        class="login-form"
      >
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="请输入密码"
            size="large"
          >
            <template #prefix>
              <AIcon
                type="LockOutlined"
                class="prefix-icon"
              />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          v-if="showVerificationCode"
          name="verifyCode"
          :rules="[{ required: true, message: '请输入验证码!' }]"
        >
          <a-input
            v-model:value="formState.verifyCode"
            placeholder="请输入验证码"
            size="large"
          >
            <template #prefix>
              <AIcon
                type="SafetyOutlined"
                class="prefix-icon"
              />
            </template>
            <template #addonAfter>
              <img
                :src="verificationCodeUrl"
                @click="refreshVerificationCode"
                alt="验证码"
                class="verification-image"
              />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            class="login-form-button"
            size="large"
            :loading="isLoading"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { getTokenConfig, getTokenRedirect } from '@/api/comm'
import { codeUrl } from '@/api/login'
import { useRequest } from '@jetlinks-web/hooks'
import { encrypt, onlyMessage, LocalStore } from '@jetlinks-web/utils'

const formState = reactive({
  password: '',
  verifyCode: '',
  verifyKey: ''
})

const personalTokenKey = 'X-Personal-Token'
const personalTokenKeyUrl = ':X_Personal_Token'
const config = ref({})
const personalToken = ref('')
const isLoading = ref(false)
const verificationData = ref({})
const showVerificationCode = computed(() => !!verificationData.value?.base64)
const verificationCodeUrl = computed(() => verificationData.value?.base64 || '')

const { run: refreshVerificationCode } = useRequest(codeUrl, {
  immediate: false,
  onSuccess(resp) {
    if (resp.result?.key) {
      formState.verifyKey = resp.result.key
      verificationData.value = resp.result
    }
  }
})

const handleRedirect = async (params) => {
  let redirectRes
  try {
    isLoading.value = true
    redirectRes = await getTokenRedirect(personalToken.value, params || {})
    if (redirectRes?.result) {
      const urlString = redirectRes.result
      const urlObject = new URL(urlString)
      const token = urlObject.searchParams.get(personalTokenKeyUrl)
      LocalStore.set(personalTokenKey, token)

      urlObject.searchParams.delete(personalTokenKeyUrl)
      const cleanUrl = urlObject.toString()
      if (params) {
        onlyMessage('授权成功，即将跳转...')
        setTimeout(() => {
          window.location.href = cleanUrl
        }, 1000)
      } else {
        window.location.href = cleanUrl
      }
    } else {
      throw new Error('获取重定向URL失败')
    }
  } catch (error) {
    console.error('Redirect error:', error)
    refreshVerificationCode()
    // 如果重定向返回状态是 401，则认为链接过期
    if (redirectRes?.status === 401) {
      onlyMessage('链接已过期', 'error')
      return
    }
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  const authParameters = {
    password: formState.password
  }

  if (config.value?.authConfiguration?.encrypt) {
    authParameters.password = encrypt(formState.password, config.value.authConfiguration.encrypt.publicKey)
    authParameters.encryptId = config.value.authConfiguration.encrypt.id
  }

  if (showVerificationCode.value) {
    authParameters.verifyKey = formState.verifyKey
    authParameters.verifyCode = formState.verifyCode
  }

  await handleRedirect({ authParameters })
}

const initialize = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    personalToken.value = urlParams.get('personal_token')

    if (!personalToken.value) {
      onlyMessage('缺少必要的授权参数', 'error')
      return
    }

    isLoading.value = true
    const res = await getTokenConfig(personalToken.value)

    if (res?.result) {
      config.value = res.result

      if (res.result.authType === 'password') {
        refreshVerificationCode()
      } else if (res.result.authType === 'none') {
        handleRedirect()
      }
    } else {
      onlyMessage('获取授权配置失败', 'error')
    }
  } catch (error) {
    console.error('初始化失败:', error)
    // 如果错误状态为 401，则标记链接过期
    if (error.status === 401) {
      onlyMessage('链接已过期', 'error')
      return
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  initialize()
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  padding: 40px 30px;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.login-form {
  width: 100%;
}

.login-form-button {
  width: 100%;
  margin-top: 8px;
}

.verification-image {
  cursor: pointer;
  height: 32px;
}

.prefix-icon {
  font-size: 16px;
  margin-right: 8px;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
}
</style>
