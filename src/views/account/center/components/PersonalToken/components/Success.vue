<template>
  <a-modal
      :open="true"
      title="新增令牌"
      :width="600"
      :footer="null"
      :closable="true"
      @cancel="handleClose"
  >
    <div class="success-container">
      <!-- 插画区域 -->
      <div class="illustration">
        <div class="success-illustration">
          <!-- 这里可以放置自定义插画，现在用简化的图标组合 -->
          <div class="lock-icon">
            <AIcon type="LockOutlined"/>
          </div>
          <div class="hand-icon">
            <AIcon type="SafetyOutlined"/>
          </div>
        </div>
      </div>

      <!-- 成功文本 -->
      <div class="success-title">
        新增令牌成功
      </div>

      <!-- Token 展示区域 -->
      <div class="token-section">
        <div class="token-display">
          <a-input
              :value="token"
              readonly
              class="token-input"
          />
          <a-button
              type="primary"
              class="copy-button"
              @click="copyToken"
          >
            <AIcon type="CopyOutlined"/>
          </a-button>
        </div>
      </div>

      <!-- 说明文本 -->
      <div class="warning-section">
        <AIcon type="ExclamationCircleOutlined" class="warning-icon"/>
        <span class="warning-text">
          令牌仅会明文显示一次，关闭此对话框后将不再显示，请确保已成功保存令牌信息
        </span>
      </div>

      <!-- 关闭按钮 -->
      <div class="footer-actions">
        <a-button type="default" @click="handleClose">
          关闭
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>

import {onlyMessage} from "@jetlinks-web/utils";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

async function copy(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
  onlyMessage('令牌已复制到剪贴板')
}


const copyToken = () => {
  copy(props.token)
}

const handleClose = () => {
  emit('close')
}
</script>

<style lang="less" scoped>
.success-container {
  text-align: center;
  padding: 40px 24px 24px;

  .illustration {
    margin-bottom: 24px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .success-illustration {
      position: relative;
      width: 120px;
      height: 120px;

      .lock-icon {
        position: absolute;
        top: 20px;
        left: 30px;
        font-size: 48px;
        color: #6366f1;
        z-index: 2;
      }

      .hand-icon {
        position: absolute;
        bottom: 20px;
        right: 20px;
        font-size: 36px;
        color: #f97316;
        z-index: 1;
      }

      // 添加一些装饰圆点
      &::before {
        content: '';
        position: absolute;
        top: 10px;
        right: 10px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #e5e7eb;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 40px;
        left: 10px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #6366f1;
      }
    }
  }

  .success-title {
    font-size: 18px;
    font-weight: 500;
    color: #262626;
    margin-bottom: 24px;
  }

  .token-section {
    margin-bottom: 20px;

    .token-display {
      display: flex;
      gap: 8px;
      align-items: stretch;

      .token-input {
        flex: 1;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;

        :deep(.ant-input) {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          padding: 8px 12px;
          font-size: 13px;
          color: #495057;
        }
      }

      .copy-button {
        flex-shrink: 0;
        padding: 0 16px;
        display: flex;
        align-items: center;
        gap: 4px;
        background: #1890ff;
        border-color: #1890ff;

        &:hover {
          background: #40a9ff;
          border-color: #40a9ff;
        }
      }
    }
  }

  .warning-section {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 32px;
    text-align: left;

    .warning-icon {
      color: #faad14;
      font-size: 16px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .warning-text {
      color: #666;
      font-size: 13px;
      line-height: 1.5;
    }
  }

  .footer-actions {
    text-align: right;

    .ant-btn {
      min-width: 72px;
      border-radius: 4px;
    }
  }
}

// 自定义modal样式
:deep(.ant-modal) {
  .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;

    .ant-modal-title {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-close {
    top: 16px;
    right: 16px;
  }
}
</style>
