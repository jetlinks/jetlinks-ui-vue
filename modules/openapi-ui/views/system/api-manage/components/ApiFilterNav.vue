<template>
  <div class="api-filter-nav">
    <!-- 搜索框 -->
    <div class="search-section">
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索路径或描述"
        allow-clear
        @search="handleSearch"
        enter-button
        style="width: 100%"
      />
    </div>

    <!-- 过滤分类 -->
    <div class="filter-categories">
      <!-- 风险等级 -->
      <div class="filter-group">
        <div class="filter-group-title">风险等级</div>
        <a-checkbox-group
          v-model:value="filters.riskLevel"
          @change="handleFilterChange"
          style="display: flex; flex-direction: column; gap: 8px"
        >
          <a-checkbox value="low">
            <span class="risk-label">
              <a-tag color="green" style="margin: 0">低</a-tag>
              {{ lowRiskCount }}
            </span>
          </a-checkbox>
          <a-checkbox value="medium">
            <span class="risk-label">
              <a-tag color="orange" style="margin: 0">中</a-tag>
              {{ mediumRiskCount }}
            </span>
          </a-checkbox>
          <a-checkbox value="high">
            <span class="risk-label">
              <a-tag color="red" style="margin: 0">高</a-tag>
              {{ highRiskCount }}
            </span>
          </a-checkbox>
        </a-checkbox-group>
      </div>

      <!-- 操作类型 -->
      <div class="filter-group">
        <div class="filter-group-title">操作类型</div>
        <a-checkbox-group
          v-model:value="filters.operationType"
          @change="handleFilterChange"
          style="display: flex; flex-direction: column; gap: 8px"
        >
          <a-checkbox value="read">
            <span class="type-label">
              <a-tag color="blue" style="margin: 0">只读</a-tag>
              {{ readCount }}
            </span>
          </a-checkbox>
          <a-checkbox value="write">
            <span class="type-label">
              <a-tag color="orange" style="margin: 0">写</a-tag>
              {{ writeCount }}
            </span>
          </a-checkbox>
          <a-checkbox value="control">
            <span class="type-label">
              <a-tag color="red" style="margin: 0">控制</a-tag>
              {{ controlCount }}
            </span>
          </a-checkbox>
        </a-checkbox-group>
      </div>

      <!-- 可见性 -->
      <div class="filter-group">
        <div class="filter-group-title">可见性</div>
        <a-checkbox-group
          v-model:value="filters.visibility"
          @change="handleFilterChange"
          style="display: flex; flex-direction: column; gap: 8px"
        >
          <a-checkbox value="INTERNAL">仅内部可见 ({{ internalCount }})</a-checkbox>
          <a-checkbox value="PARTNER">用户可见 ({{ partnerCount }})</a-checkbox>
          <a-checkbox value="PUBLIC">公开 ({{ publicCount }})</a-checkbox>
        </a-checkbox-group>
      </div>

      <!-- 能力分组 -->
      <div class="filter-group">
        <div class="filter-group-title">能力分组</div>
        <a-select
          v-model:value="filters.group"
          placeholder="选择分组"
          allow-clear
          style="width: 100%"
          @change="handleFilterChange"
        >
          <a-select-option
            v-for="group in groupOptions"
            :key="group"
            :value="group"
          >
            {{ group }}
          </a-select-option>
        </a-select>
      </div>

      <!-- 重置按钮 -->
      <div class="filter-actions">
        <a-button type="default" block @click="handleReset">重置筛选</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { ListFilter } from '../types'

interface Props {
  allData: any[]
  currentFilters: ListFilter
}

interface Emits {
  (e: 'filter-change', filters: ListFilter): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchKeyword = ref('')
const filters = reactive<ListFilter>({
  recommended: undefined,
  riskLevel: [],
  operationType: [],
  visibility: [],
  group: undefined,
  hasPermission: undefined,
})

// 统计各类别的数量
const stats = computed(() => {
  const data = props.allData || []
  return {
    lowRiskCount: data.filter((item: any) => item.riskLevel === 'low').length,
    mediumRiskCount: data.filter((item: any) => item.riskLevel === 'medium').length,
    highRiskCount: data.filter((item: any) => item.riskLevel === 'high').length,
    readCount: data.filter((item: any) => item.operationType === 'read').length,
    writeCount: data.filter((item: any) => item.operationType === 'write').length,
    controlCount: data.filter((item: any) => item.operationType === 'control').length,
    internalCount: data.filter((item: any) => item.visibility === 'INTERNAL').length,
    partnerCount: data.filter((item: any) => item.visibility === 'PARTNER').length,
    publicCount: data.filter((item: any) => item.visibility === 'PUBLIC').length,
  }
})

const lowRiskCount = computed(() => stats.value.lowRiskCount)
const mediumRiskCount = computed(() => stats.value.mediumRiskCount)
const highRiskCount = computed(() => stats.value.highRiskCount)
const readCount = computed(() => stats.value.readCount)
const writeCount = computed(() => stats.value.writeCount)
const controlCount = computed(() => stats.value.controlCount)
const internalCount = computed(() => stats.value.internalCount)
const partnerCount = computed(() => stats.value.partnerCount)
const publicCount = computed(() => stats.value.publicCount)

// 能力分组选项
const groupOptions = computed(() => {
  const groups = new Set<string>()
  ;(props.allData || []).forEach((item: any) => {
    if (item.group) {
      groups.add(item.group)
    }
  })
  return Array.from(groups).sort()
})

const handleSearch = () => {
  filters.keyword = searchKeyword.value
  emit('filter-change', { ...filters })
}

const handleFilterChange = () => {
  emit('filter-change', { ...filters })
}

const handleReset = () => {
  searchKeyword.value = ''
  filters.keyword = undefined
  filters.recommended = undefined
  filters.riskLevel = []
  filters.operationType = []
  filters.visibility = []
  filters.group = undefined
  emit('filter-change', { ...filters })
}

// 监听外部 props 变化
watch(
  () => props.currentFilters,
  (val) => {
    Object.assign(filters, val)
  },
  { deep: true }
)
</script>

<style lang="less" scoped>
.api-filter-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-right: 1px solid #f0f0f0;

  .search-section {
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
  }

  .filter-categories {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;

    .filter-group {
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;

      .filter-group-title {
        font-weight: 600;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 8px;
        text-transform: uppercase;
      }

      :deep(.ant-checkbox-group),
      :deep(.ant-radio-group) {
        width: 100%;
      }

      :deep(.ant-checkbox),
      :deep(.ant-radio) {
        font-size: 13px;
      }

      .risk-label,
      .type-label {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .filter-actions {
      padding: 12px 16px;
    }
  }
}
</style>
