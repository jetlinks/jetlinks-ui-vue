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
          <a-checkbox value="internal">仅内部可见 ({{ internalCount }})</a-checkbox>
          <a-checkbox value="saas_user">用户可见 ({{ partnerCount }})</a-checkbox>
          <a-checkbox value="open">公开 ({{ publicCount }})</a-checkbox>
        </a-checkbox-group>
      </div>

      <!-- 稳定性 -->
      <div class="filter-group">
        <div class="filter-group-title">稳定性</div>
        <a-checkbox-group
          v-model:value="filters.stable"
          @change="handleFilterChange"
          style="display: flex; flex-direction: column; gap: 8px"
        >
          <a-checkbox value="stable">稳定 ({{ stableCount }})</a-checkbox>
          <a-checkbox value="preview">预览 ({{ previewCount }})</a-checkbox>
          <a-checkbox value="deprecated">即将废弃 ({{ deprecatedCount }})</a-checkbox>
          <a-checkbox value="internal">仅内部 ({{ internalStableCount }})</a-checkbox>
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

      <!-- 业务能力 -->
      <div class="filter-group">
        <div class="filter-group-title">业务能力</div>
        <a-select
          v-model:value="filters.businessGroup"
          mode="multiple"
          placeholder="选择业务能力"
          allow-clear
          style="width: 100%"
          @change="handleFilterChange"
        >
          <a-select-option
            v-for="bg in businessGroupOptions"
            :key="bg"
            :value="bg"
          >
            {{ bg }}
          </a-select-option>
        </a-select>
      </div>

      <!-- 影响范围 -->
      <div class="filter-group">
        <div class="filter-group-title">影响范围</div>
        <a-select
          v-model:value="filters.impactScope"
          mode="multiple"
          placeholder="选择影响范围"
          allow-clear
          style="width: 100%"
          @change="handleFilterChange"
        >
          <a-select-option
            v-for="scope in impactScopeOptions"
            :key="scope"
            :value="scope"
          >
            {{ scope }}
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
  allData: any[] | any  // 支持数组或ref
  filteredData?: any[]
  currentFilters: ListFilter
}

interface Emits {
  (e: 'filter-change', filters: ListFilter): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchKeyword = ref('')
const filters = reactive<ListFilter>({
  keyword: undefined,
  riskLevel: [],
  operationType: [],
  visibility: [],
  stable: [],
  group: undefined,
  businessGroup: [],
  impactScope: [],
  hasPermission: undefined,
})

// 辅助函数：获取字段的值（支持对象和字符串格式）
const getFieldValue = (item: any, field: string): string | undefined => {
  if (!item) return undefined
  const fieldValue = item[field]
  if (fieldValue === null || fieldValue === undefined) return undefined
  
  // 如果是对象格式 {value: 'xxx', text: 'xxx'}，返回 value
  if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
    // 优先使用 value 属性（枚举对象通常有这个属性）
    if (fieldValue.value !== undefined && fieldValue.value !== null) {
      return String(fieldValue.value)
    }
    // 如果没有 value，尝试使用 name 属性（枚举的 name）
    if (fieldValue.name !== undefined && fieldValue.name !== null) {
      return String(fieldValue.name)
    }
    // 如果对象有 getValue 方法，调用它
    if (typeof fieldValue.getValue === 'function') {
      try {
        const val = fieldValue.getValue()
        if (val !== undefined && val !== null) {
          return String(val)
        }
      } catch (e) {
        // 忽略错误
      }
    }
    // 如果对象有 name() 方法，调用它
    if (typeof fieldValue.name === 'function') {
      try {
        const val = fieldValue.name()
        if (val !== undefined && val !== null) {
          return String(val)
        }
      } catch (e) {
        // 忽略错误
      }
    }
    return undefined
  }
  // 如果是字符串，直接返回
  if (typeof fieldValue === 'string') {
    return fieldValue
  }
  // 如果是数字，转换为字符串
  if (typeof fieldValue === 'number') {
    return String(fieldValue)
  }
  return undefined
}

// 根据过滤条件计算数据（排除指定的过滤字段）
const getFilteredData = (excludeField?: string) => {
  // 确保 allData 是数组，处理 ref 的情况
  let allDataArray = props.allData
  if (allDataArray && typeof allDataArray === 'object' && 'value' in allDataArray) {
    allDataArray = (allDataArray as any).value
  }
  let result = Array.isArray(allDataArray) ? allDataArray : []

  if (filters.keyword && excludeField !== 'keyword') {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter((api: any) =>
      api.path?.toLowerCase().includes(keyword) ||
      api.description?.toLowerCase().includes(keyword) ||
      api.summary?.toLowerCase().includes(keyword)
    )
  }

  if (filters.riskLevel && filters.riskLevel.length > 0 && excludeField !== 'riskLevel') {
    result = result.filter((api: any) => {
      const apiRiskLevel = getFieldValue(api, 'riskLevel')
      if (!apiRiskLevel) return false
      return (filters.riskLevel as any[]).some((rl: any) => 
        String(apiRiskLevel).toLowerCase() === String(rl).toLowerCase()
      )
    })
  }

  if (filters.operationType && filters.operationType.length > 0 && excludeField !== 'operationType') {
    result = result.filter((api: any) => {
      const apiOperationType = getFieldValue(api, 'operationType')
      if (!apiOperationType) return false
      return (filters.operationType as any[]).some((ot: any) => 
        String(apiOperationType).toLowerCase() === String(ot).toLowerCase()
      )
    })
  }

  if (filters.visibility && filters.visibility.length > 0 && excludeField !== 'visibility') {
    result = result.filter((api: any) => {
      const apiVisibility = getFieldValue(api, 'visibility')
      // 如果没有设置可见性，默认认为是 internal
      const defaultVisibility = (apiVisibility || 'internal').toLowerCase()
      return (filters.visibility as any[]).some((v: any) => String(v).toLowerCase() === defaultVisibility)
    })
  }

  if (filters.group && excludeField !== 'group') {
    result = result.filter((api: any) => api.group === filters.group)
  }

  if (filters.stable && filters.stable.length > 0 && excludeField !== 'stable') {
    result = result.filter((api: any) => {
      const apiStable = getFieldValue(api, 'stable')
      if (!apiStable) return false
      return (filters.stable as any[]).some((s: any) => 
        String(apiStable).toLowerCase() === String(s).toLowerCase()
      )
    })
  }

  if (filters.businessGroup && filters.businessGroup.length > 0 && excludeField !== 'businessGroup') {
    result = result.filter((api: any) => {
      const businessGroups = api.businessGroup
      if (!businessGroups || !Array.isArray(businessGroups)) {
        return false
      }
      return (filters.businessGroup as any[]).some((bg: any) => 
        businessGroups.some((apiBg: string) => String(apiBg).toLowerCase() === String(bg).toLowerCase())
      )
    })
  }

  if (filters.impactScope && filters.impactScope.length > 0 && excludeField !== 'impactScope') {
    result = result.filter((api: any) => {
      const impactScopes = api.impactScope
      if (!impactScopes || !Array.isArray(impactScopes)) {
        return false
      }
      return (filters.impactScope as any[]).some((scope: any) => 
        impactScopes.some((apiScope: string) => String(apiScope).toLowerCase() === String(scope).toLowerCase())
      )
    })
  }

  return result
}

// 获取 allData 数组（处理 ref 的情况）
const getAllDataArray = computed(() => {
  let allDataArray = props.allData
  if (allDataArray && typeof allDataArray === 'object' && 'value' in allDataArray) {
    allDataArray = (allDataArray as any).value
  }
  return Array.isArray(allDataArray) ? allDataArray : []
})

// 统计各类别的数量（基于排除当前类别的过滤数据）
const stats = computed(() => {
  const allDataArray = getAllDataArray.value
  
  // 如果没有数据，返回全0
  if (allDataArray.length === 0) {
    return {
      lowRiskCount: 0,
      mediumRiskCount: 0,
      highRiskCount: 0,
      readCount: 0,
      writeCount: 0,
      controlCount: 0,
      internalCount: 0,
      partnerCount: 0,
      publicCount: 0,
      stableCount: 0,
      previewCount: 0,
      deprecatedCount: 0,
      internalStableCount: 0,
    }
  }
  
  // 风险等级统计（排除风险等级筛选）
  const riskLevelFilteredData = getFilteredData('riskLevel')
  const lowRiskCount = riskLevelFilteredData.filter((item: any) => {
    const riskLevel = getFieldValue(item, 'riskLevel')
    return riskLevel && riskLevel.toLowerCase() === 'low'
  }).length
  const mediumRiskCount = riskLevelFilteredData.filter((item: any) => {
    const riskLevel = getFieldValue(item, 'riskLevel')
    return riskLevel && riskLevel.toLowerCase() === 'medium'
  }).length
  const highRiskCount = riskLevelFilteredData.filter((item: any) => {
    const riskLevel = getFieldValue(item, 'riskLevel')
    return riskLevel && riskLevel.toLowerCase() === 'high'
  }).length

  // 操作类型统计（排除操作类型筛选）
  const operationTypeFilteredData = getFilteredData('operationType')
  const readCount = operationTypeFilteredData.filter((item: any) => {
    const operationType = getFieldValue(item, 'operationType')
    return operationType && operationType.toLowerCase() === 'read'
  }).length
  const writeCount = operationTypeFilteredData.filter((item: any) => {
    const operationType = getFieldValue(item, 'operationType')
    return operationType && operationType.toLowerCase() === 'write'
  }).length
  const controlCount = operationTypeFilteredData.filter((item: any) => {
    const operationType = getFieldValue(item, 'operationType')
    return operationType && operationType.toLowerCase() === 'control'
  }).length

  // 可见性统计（排除可见性筛选）
  const visibilityFilteredData = getFilteredData('visibility')
  const internalCount = visibilityFilteredData.filter((item: any) => {
    const visValue = getFieldValue(item, 'visibility')
    return !visValue || visValue.toLowerCase() === 'internal'
  }).length
  const partnerCount = visibilityFilteredData.filter((item: any) => {
    const visValue = getFieldValue(item, 'visibility')
    return visValue && visValue.toLowerCase() === 'saas_user'
  }).length
  const publicCount = visibilityFilteredData.filter((item: any) => {
    const visValue = getFieldValue(item, 'visibility')
    return visValue && visValue.toLowerCase() === 'open'
  }).length

  // 稳定性统计（排除稳定性筛选，但考虑其他所有筛选条件）
  const stableFilteredData = getFilteredData('stable')
  const stableCount = stableFilteredData.filter((item: any) => {
    const stableValue = getFieldValue(item, 'stable')
    return stableValue && stableValue.toLowerCase() === 'stable'
  }).length
  const previewCount = stableFilteredData.filter((item: any) => {
    const stableValue = getFieldValue(item, 'stable')
    return stableValue && stableValue.toLowerCase() === 'preview'
  }).length
  const deprecatedCount = stableFilteredData.filter((item: any) => {
    const stableValue = getFieldValue(item, 'stable')
    return stableValue && stableValue.toLowerCase() === 'deprecated'
  }).length
  const internalStableCount = stableFilteredData.filter((item: any) => {
    const stableValue = getFieldValue(item, 'stable')
    return stableValue && stableValue.toLowerCase() === 'internal'
  }).length

  return {
    lowRiskCount,
    mediumRiskCount,
    highRiskCount,
    readCount,
    writeCount,
    controlCount,
    internalCount,
    partnerCount,
    publicCount,
    stableCount,
    previewCount,
    deprecatedCount,
    internalStableCount,
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
const stableCount = computed(() => stats.value.stableCount)
const previewCount = computed(() => stats.value.previewCount)
const deprecatedCount = computed(() => stats.value.deprecatedCount)
const internalStableCount = computed(() => stats.value.internalStableCount)

// 能力分组选项（基于当前过滤后的数据，排除能力分组筛选）
const groupOptions = computed(() => {
  const groups = new Set<string>()
  // 使用过滤后的数据（排除能力分组筛选），这样选项列表会随其他筛选条件变化
  const filteredData = getFilteredData('group')
  filteredData.forEach((item: any) => {
    if (item && item.group) {
      groups.add(item.group)
    }
  })
  return Array.from(groups).sort()
})

// 业务能力选项（基于当前过滤后的数据，排除业务能力筛选）
const businessGroupOptions = computed(() => {
  const businessGroups = new Set<string>()
  // 使用过滤后的数据（排除业务能力筛选），这样选项列表会随其他筛选条件变化
  const filteredData = getFilteredData('businessGroup')
  filteredData.forEach((item: any) => {
    if (item && item.businessGroup && Array.isArray(item.businessGroup)) {
      item.businessGroup.forEach((bg: string) => {
        if (bg) {
          businessGroups.add(bg)
        }
      })
    }
  })
  return Array.from(businessGroups).sort()
})

// 影响范围选项（基于当前过滤后的数据，排除影响范围筛选）
const impactScopeOptions = computed(() => {
  const impactScopes = new Set<string>()
  // 使用过滤后的数据（排除影响范围筛选），这样选项列表会随其他筛选条件变化
  const filteredData = getFilteredData('impactScope')
  filteredData.forEach((item: any) => {
    if (item && item.impactScope && Array.isArray(item.impactScope)) {
      item.impactScope.forEach((scope: string) => {
        if (scope) {
          impactScopes.add(scope)
        }
      })
    }
  })
  return Array.from(impactScopes).sort()
})

const handleSearch = () => {
  filters.keyword = searchKeyword.value
  emit('filter-change', { ...filters })
}

// 监听搜索关键字变化，实时更新过滤条件（使用防抖避免频繁触发）
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(searchKeyword, (newVal) => {
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  // 延迟更新，避免频繁触发
  searchTimer = setTimeout(() => {
    filters.keyword = newVal || undefined
    emit('filter-change', { ...filters })
  }, 300)
})

const handleFilterChange = () => {
  emit('filter-change', { ...filters })
}

const handleReset = () => {
  searchKeyword.value = ''
  filters.keyword = undefined
  filters.riskLevel = []
  filters.operationType = []
  filters.visibility = []
  filters.stable = []
  filters.group = undefined
  filters.businessGroup = []
  filters.impactScope = []
  emit('filter-change', { ...filters })
}

// 监听 allData 变化，确保统计能正确更新
watch(
  () => props.allData,
  () => {
    // 当数据变化时，触发统计重新计算（computed 会自动更新）
  },
  { deep: true, immediate: true }
)

// 监听外部 props 变化
watch(
  () => props.currentFilters,
  (val) => {
    if (val) {
      // 避免循环更新：只有当值真正变化时才更新
      const keywordChanged = val.keyword !== filters.keyword
      const riskLevelChanged = JSON.stringify(val.riskLevel) !== JSON.stringify(filters.riskLevel)
      const operationTypeChanged = JSON.stringify(val.operationType) !== JSON.stringify(filters.operationType)
      const visibilityChanged = JSON.stringify(val.visibility) !== JSON.stringify(filters.visibility)
      const groupChanged = val.group !== filters.group
      
      if (keywordChanged || riskLevelChanged || operationTypeChanged || visibilityChanged || groupChanged) {
        Object.assign(filters, val)
        // 同步搜索关键字
        if (val.keyword !== undefined && val.keyword !== searchKeyword.value) {
          searchKeyword.value = val.keyword || ''
        }
      }
    }
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
