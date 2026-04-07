<template>
  <div class="identity-result-page">
    <div class="identity-result-card">
      <div v-if="isSuccess" class="result-icon success">
        <CheckCircleOutlined />
      </div>
      <div v-else class="result-icon error">
        <CloseCircleOutlined />
      </div>
      <div class="result-title">{{ isSuccess ? $t('IdentityResult.successTitle') : $t('IdentityResult.failTitle') }}</div>
      <div class="result-message">{{ displayMessage }}</div>
      <a-button type="primary" class="result-btn" @click="goCenter">
        {{ $t('IdentityResult.goCenter') }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const route = useRoute()
const router = useRouter()

const isSuccess = computed(() => {
  const s = route.query.success
  return s === 'true' || s === true
})

const displayMessage = computed(() => {
  const msg = route.query.message
  if (msg && typeof msg === 'string') return decodeURIComponent(msg)
  return isSuccess.value ? $t('IdentityResult.defaultSuccess') : $t('IdentityResult.defaultFail')
})

function goCenter() {
  router.replace('/account/center')
}
</script>

<style lang="less" scoped>
.identity-result-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.identity-result-card {
  background: #fff;
  border-radius: 8px;
  padding: 48px 56px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-width: 360px;
}

.result-icon {
  font-size: 64px;
  margin-bottom: 24px;

  &.success {
    color: #52c41a;
  }

  &.error {
    color: #ff4d4f;
  }
}

.result-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 12px;
}

.result-message {
  font-size: 14px;
  color: #86909c;
  margin-bottom: 32px;
  word-break: break-word;
}

.result-btn {
  min-width: 120px;
}
</style>
