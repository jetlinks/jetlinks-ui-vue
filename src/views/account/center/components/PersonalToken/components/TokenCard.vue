<template>
  <div class="token-card">
    <div class="token-card-left">
      <div class="token-icon">
        <img src="@/assets/personal-token/img.png" alt=""/>
      </div>
      <div class="token-card-info">
        <div class="token-card-header">
          <div class="token-name">{{ token.name }}</div>
          <div class="status-tag" :style="{color: getStatusConfig(token).color}">
            {{ getStatusConfig(token).text }}
          </div>
        </div>
        <div class="token-card-content">
          <div class="token-field">
            <div class="field-label">{{ $t('PersonalToken.TokenCard.515931-0') }}</div>
            <div class="field-value">{{ token.sourceTypeName || token.sourceType }}</div>
          </div>

          <div class="token-field">
            <div class="field-label">{{ $t('PersonalToken.TokenCard.515931-1') }}</div>
            <div class="field-value">{{ token.creatorName }}</div>
          </div>

          <div class="token-field">
            <div class="field-label">{{ $t('PersonalToken.TokenCard.515931-2') }}</div>
            <div class="field-value"><j-ellipsis>{{ formatDate(token.createTime) }}</j-ellipsis></div>
          </div>

          <div class="token-field">
            <div class="field-label">{{ $t('PersonalToken.TokenCard.515931-3') }}</div>
            <div class="field-value">
              <j-ellipsis>{{ token.expires !== -1 ? formatDate(token.expires) : $t('PersonalToken.TokenCard.515931-4') }}</j-ellipsis>
            </div>
          </div>

          <div class="token-field">
            <div class="field-label">{{ $t('PersonalToken.TokenCard.515931-5') }}</div>
            <div class="field-value">
              <j-ellipsis>
                {{ token.description || '--' }}
              </j-ellipsis>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="token-card-actions">
      <a-space>
        <a-button @click="emit('view', token)" type="link">
          <template #icon>
            <AIcon type="EyeOutlined"/>
          </template>
          {{ $t('PersonalToken.TokenCard.515931-6') }}
        </a-button>

        <a-button
            @click="emit('edit', token)"
            type="link"
        >
          <template #icon>
            <AIcon type="EditOutlined"/>
          </template>
          {{ $t('PersonalToken.TokenCard.515931-7') }}
        </a-button>

        <j-permission-button
            danger
            :popConfirm="{
              title: $t('PersonalToken.TokenCard.515931-8'),
              onConfirm: () => {
                emit('delete', token)
              }
            }"
        >
          <template #icon>
            <AIcon type="DeleteOutlined"/>
          </template>
          {{ $t('PersonalToken.TokenCard.515931-9') }}
        </j-permission-button>
      </a-space>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import {useI18n} from 'vue-i18n'

const {t: $t} = useI18n()
const props = defineProps({
  token: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'delete'])

const getStatusConfig = (token) => {
  if (token.status === 'disabled') {
    return {
      color: 'red',
      text: $t('PersonalToken.TokenCard.515931-10'),
      icon: 'StopOutlined'
    }
  }
  if (token.expires === -1) {
    return {
      color: 'green',
      text: $t('PersonalToken.TokenCard.515931-4'),
      icon: 'CheckCircleOutlined'
    }
  }

  const now = dayjs()
  const expireTime = token.expires ? dayjs(token.expires) : null

  if (expireTime.isBefore(now)) {
    return {
      color: 'red',
      text: $t('PersonalToken.TokenCard.515931-15'),
      icon: 'ExclamationCircleOutlined'
    }
  }

  const diffDays = expireTime.diff(now, 'day')
  const diffHours = expireTime.diff(now, 'hour', true)

  if (diffDays >= 1) {
    return {
      color: '#777777',
      text: $t('PersonalToken.TokenCard.515931-13', [diffDays]),
      icon: 'ClockCircleOutlined'
    }
  } else {
    const _diffHours = diffHours > 1 ? diffHours.toFixed(0) : diffHours.toFixed(2)
    return {
      color: '#1677FF',
      text: $t('PersonalToken.TokenCard.515931-14', [_diffHours]),
      icon: 'ClockCircleOutlined'
    }
  }
}

const formatDate = (dateStr) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<style lang="less" scoped>
.token-card {
  border: 1px solid #E6E6E6;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;

  &-left {
    flex: 1;
    min-width: 0;
    display: flex;
    gap: 16px;
    align-items: center;

    .token-icon {
      width: 48px;
      height: 48px;
      border-radius: 6px;
      background: #f6f9ff;
      display: flex;
      font-size: 20px;
      align-items: center;
      justify-content: center;
      color: #1890ff;
      flex-shrink: 0;
    }

    .token-card-info {
      flex: 1;
      min-width: 0;

      .token-card-header {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;

        .token-name {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    .token-card-content {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;

      .token-field {
        .field-label {
          color: #777777;
          margin-bottom: 8px;
        }

        .field-value {
          color: #1A1A1A;
        }
      }
    }
  }
}

.token-card-actions {
  .ant-btn {
    background-color: #F0F0F0 !important;
    border: none;
  }
}
</style>
