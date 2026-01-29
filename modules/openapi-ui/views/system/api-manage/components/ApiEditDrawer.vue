<template>
  <div class="api-edit-drawer">
    <a-drawer
      v-model:open="visible"
      :title="drawerTitle"
      :width="480"
      :body-style="{ paddingBottom: '80px' }"
      @close="handleClose"
    >
      <!-- 单个编辑模式 -->
      <template v-if="!batchMode && currentApi">
        <div class="edit-section">
          <div class="section-label">基本信息</div>
          <div class="info-display">
            <div class="info-row">
              <span class="info-label">请求路径</span>
              <span class="info-value">{{ currentApi.path }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">请求方法</span>
              <a-tag :color="getMethodColor(currentApi.method)">{{ currentApi.method }}</a-tag>
            </div>
            <div class="info-row">
              <span class="info-label">接口描述</span>
              <span class="info-value">{{ currentApi.description || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">所属分组</span>
              <span class="info-value">{{ currentApi.group || '未分组' }}</span>
            </div>
          </div>
        </div>

        <!-- 治理属性编辑 -->
        <div class="edit-section">
          <div class="section-label">治理属性</div>

          <!-- 可见性 -->
          <div class="form-item">
            <label class="form-label">对外开放</label>
            <a-select
              v-model:value="editData.visibility"
              style="width: 100%"
            >
              <a-select-option value="INTERNAL">
                <span style="color: #8c8c8c">仅内部可见</span>
              </a-select-option>
              <a-select-option value="PARTNER">
                <span style="color: #faad14">用户可见</span>
              </a-select-option>
              <a-select-option value="PUBLIC">
                <span style="color: #1890ff">公开</span>
              </a-select-option>
            </a-select>
            <div class="form-help">定义该接口的对外开放范围</div>
          </div>

          <!-- 风险等级 -->
          <div class="form-item">
            <label class="form-label">风险等级</label>
            <a-select
              v-model:value="editData.riskLevel"
              style="width: 100%"
            >
              <a-select-option value="low">
                <a-tag color="green">低风险</a-tag>
              </a-select-option>
              <a-select-option value="medium">
                <a-tag color="orange">中风险</a-tag>
              </a-select-option>
              <a-select-option value="high">
                <a-tag color="red">高风险</a-tag>
              </a-select-option>
            </a-select>
            <div class="form-help">评估该接口可能带来的安全和业务风险</div>
          </div>

          <!-- 操作类型 -->
          <div class="form-item">
            <label class="form-label">操作类型</label>
            <a-select
              v-model:value="editData.operationType"
              style="width: 100%"
            >
              <a-select-option value="read">
                <a-tag color="blue">只读</a-tag>
              </a-select-option>
              <a-select-option value="write">
                <a-tag color="orange">写</a-tag>
              </a-select-option>
              <a-select-option value="control">
                <a-tag color="red">控制</a-tag>
              </a-select-option>
            </a-select>
            <div class="form-help">标识接口的操作特性</div>
          </div>
        </div>
      </template>

      <!-- 批量编辑模式 -->
      <template v-if="batchMode">
        <div class="batch-edit-notice">
          <AIcon type="InfoCircleOutlined" />
          <span>即将批量修改 {{ selectedCount }} 个 API</span>
        </div>

        <div class="edit-section">
          <div class="section-label">选择要修改的属性</div>

          <!-- 可见范围 -->
          <div class="batch-item">
            <a-checkbox v-model:checked="batchFields.visibility">
              <span class="batch-label">对外开放</span>
            </a-checkbox>
            <a-select
              v-if="batchFields.visibility"
              v-model:value="editData.visibility"
              style="width: 200px"
            >
              <a-select-option value="INTERNAL">仅内部可见</a-select-option>
              <a-select-option value="PARTNER">用户可见</a-select-option>
              <a-select-option value="PUBLIC">公开</a-select-option>
            </a-select>
          </div>

          <!-- 风险等级 -->
          <div class="batch-item">
            <a-checkbox v-model:checked="batchFields.riskLevel">
              <span class="batch-label">风险等级</span>
            </a-checkbox>
            <a-select
              v-if="batchFields.riskLevel"
              v-model:value="editData.riskLevel"
              style="width: 200px"
            >
              <a-select-option value="low">低风险</a-select-option>
              <a-select-option value="medium">中风险</a-select-option>
              <a-select-option value="high">高风险</a-select-option>
            </a-select>
          </div>

          <!-- 操作类型 -->
          <div class="batch-item">
            <a-checkbox v-model:checked="batchFields.operationType">
              <span class="batch-label">操作类型</span>
            </a-checkbox>
            <a-select
              v-if="batchFields.operationType"
              v-model:value="editData.operationType"
              style="width: 200px"
            >
              <a-select-option value="read">只读</a-select-option>
              <a-select-option value="write">写</a-select-option>
              <a-select-option value="control">控制</a-select-option>
            </a-select>
          </div>
        </div>

        <!-- 风险提示 -->
        <div class="batch-warning">
          <AIcon type="ExclamationCircleOutlined" />
          <span>请谨慎操作，该操作将影响多个接口的配置</span>
        </div>
      </template>

      <!-- 底部操作按钮 -->
      <template #footer>
        <a-space style="float: right">
          <a-button @click="handleClose">取消</a-button>
          <a-button
            type="primary"
            :loading="saving"
            @click="handleSave"
          >
            保存
          </a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, withDefaults } from 'vue'
import type { ApiGovernanceAttrs } from '../types'

interface Props {
  api?: ApiGovernanceAttrs
  batchMode?: boolean
  selectedCount?: number
}

interface Emits {
  (e: 'save', data: any): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  batchMode: false,
  selectedCount: 0,
})
const emit = defineEmits<Emits>()

const visible = ref(false)
const saving = ref(false)

const currentApi = ref<ApiGovernanceAttrs | undefined>(props.api)

const editData = reactive({
  riskLevel: 'low' as const,
  operationType: 'read' as const,
  visibility: 'internal' as const,
})

const batchFields = reactive({
  riskLevel: false,
  operationType: false,
  visibility: false,
})

const drawerTitle = computed(() => {
  if (props.batchMode) {
    return `批量编辑 - ${props.selectedCount} 个 API`
  }
  return `编辑接口 - ${currentApi.value?.path || ''}`
})

const getMethodColor = (method: string) => {
  const colorMap: Record<string, string> = {
    GET: 'green',
    POST: 'blue',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'purple',
  }
  return colorMap[method] || 'default'
}

const open = (api?: ApiGovernanceAttrs, batchMode?: boolean) => {
  currentApi.value = api
  if (api) {
    editData.riskLevel = api.riskLevel
    editData.operationType = api.operationType
    editData.visibility = api.visibility || 'internal'
  }
  visible.value = true
}

const handleClose = () => {
  visible.value = false
  emit('close')
}

const handleSave = async () => {
  saving.value = true
  try {
    const payload = {
      apiId: currentApi.value?.id,
      batchMode: props.batchMode,
      selectedFields: batchMode ? Object.entries(batchFields)
        .filter(([, v]) => v)
        .map(([k]) => k) : undefined,
      data: {
        riskLevel: editData.riskLevel,
        operationType: editData.operationType,
        visibility: editData.visibility,
      },
    }
    emit('save', payload)
    handleClose()
  } finally {
    saving.value = false
  }
}

const batchMode = computed(() => props.batchMode)

defineExpose({
  open,
})
</script>

<style lang="less" scoped>
.api-edit-drawer {
  :deep(.ant-drawer-header) {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px;
  }

  :deep(.ant-drawer-title) {
    font-weight: 600;
    font-size: 14px;
  }

  :deep(.ant-drawer-body) {
    padding: 0 !important;
    background: #fafafa;
  }

  :deep(.ant-drawer-footer) {
    background: #fff;
    border-top: 1px solid #f0f0f0;
  }

  .edit-section {
    margin-bottom: 0;

    .section-label {
      font-weight: 600;
      font-size: 13px;
      padding: 12px 16px;
      margin-bottom: 0;
      color: rgba(0, 0, 0, 0.65);
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .info-display {
    background: #fff;
    padding: 0;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
        min-width: 80px;
        font-weight: 500;
        text-align: left;
      }

      .info-value {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.85);
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        word-break: break-all;
        text-align: right;
        flex: 1;
        margin-left: 12px;
      }
    }
  }

  .form-item {
    padding: 16px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .form-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
      color: rgba(0, 0, 0, 0.85);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-help {
      font-size: 12px;
      color: #8c8c8c;
      margin-top: 8px;
      line-height: 1.6;
    }

    :deep(.ant-select) {
      font-size: 13px;
    }

    :deep(.ant-switch) {
      margin-bottom: 8px;
    }
  }

  .batch-edit-notice {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
    background: #e6f7ff;
    border-left: 3px solid #1890ff;
    margin-bottom: 0;
    font-size: 13px;
    color: #0050b3;

    :deep(.anticon) {
      margin-top: 2px;
      flex-shrink: 0;
    }
  }

  .batch-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .batch-label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      min-width: 100px;
      display: flex;
      align-items: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    :deep(.ant-checkbox-wrapper) {
      margin-right: 0;
    }

    :deep(.ant-select) {
      font-size: 13px;
    }
  }

  .batch-warning {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
    background: #fffbe6;
    border-left: 3px solid #faad14;
    margin-top: 0;
    font-size: 13px;
    color: #ad6800;

    :deep(.anticon) {
      margin-top: 2px;
      flex-shrink: 0;
    }
  }
}
</style>
