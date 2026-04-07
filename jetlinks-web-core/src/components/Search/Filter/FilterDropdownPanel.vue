<script setup lang="ts">
import type { PropType } from 'vue'
import { getDefaultTermType, isArrayTermType, TermTypeOptions } from './setting'
import ValueItem from './ValueItem.vue'
import { useColumnsMap } from './hooks/useSearchEngine'
import type { TermsItem } from './typing'

const props = defineProps({
  column: {
    type: String,
    default: undefined,
  },
  term: {
    type: Object as PropType<TermsItem | undefined>,
    default: undefined,
  },
})

const emit = defineEmits(['apply', 'reset'])

const columnsMap = useColumnsMap()
const draftTermType = ref<string>()
const draftValue = ref<any>()

const currentColumn = computed(() => {
  if (!props.column) {
    return undefined
  }
  return columnsMap[props.column]
})

const title = computed(() => currentColumn.value?.title || '')

const termTypeOptions = computed(() => {
  const search = currentColumn.value?.search
  if (!search) {
    return []
  }

  if (search.termOptions) {
    return search.termOptions
  }

  const filterKeys = search.termFilter || []
  const optionKeys = search.termTypeOptions || getDefaultTermType(search.type)

  return TermTypeOptions.filter(item => optionKeys.includes(item.value) && !filterKeys.includes(item.value))
})

const showTermType = computed(() => {
  const type = currentColumn.value?.search?.type
  if (!type) {
    return false
  }

  if (['select', 'tree', 'treeSelect'].includes(type)) {
    return false
  }

  return termTypeOptions.value.length > 1
})

const cloneValue = (value: any) => {
  return Array.isArray(value) ? [...value] : value
}

const convertValue = (oldTermType?: string, newTermType?: string, currentValue?: any) => {
  if (!newTermType || oldTermType === newTermType) {
    return cloneValue(currentValue)
  }

  const expectsArrayValue = isArrayTermType(newTermType)
  const isRangeType = ['btw', 'nbtw'].includes(newTermType)

  if (!expectsArrayValue) {
    return Array.isArray(currentValue) ? currentValue[0] : currentValue
  }

  if (currentValue === undefined || currentValue === null || currentValue === '') {
    return isRangeType ? [undefined, undefined] : []
  }

  if (Array.isArray(currentValue)) {
    if (isRangeType) {
      return [currentValue[0], currentValue[1] ?? undefined]
    }
    return [...currentValue]
  }

  return isRangeType ? [currentValue, undefined] : [currentValue]
}

const initDraft = () => {
  const search = currentColumn.value?.search
  if (!search) {
    draftTermType.value = undefined
    draftValue.value = undefined
    return
  }

  const defaultTermType = search.defaultTermType || termTypeOptions.value[0]?.value || getDefaultTermType(search.type)[0] || 'eq'
  draftTermType.value = props.term?.termType || defaultTermType
  draftValue.value = cloneValue(props.term?.value ?? search.defaultValue)

  if (draftValue.value === undefined && isArrayTermType(draftTermType.value)) {
    draftValue.value = ['btw', 'nbtw'].includes(draftTermType.value) ? [undefined, undefined] : []
  }
}

const onTermTypeChange = (value: string) => {
  draftValue.value = convertValue(draftTermType.value, value, draftValue.value)
  draftTermType.value = value
}

const onApply = () => {
  emit('apply', {
    column: props.column,
    termType: draftTermType.value,
    value: cloneValue(draftValue.value),
  })
}

const onReset = () => {
  emit('reset', props.column)
}

watch(
  () => [props.column, props.term?.termType, props.term?.value],
  () => {
    initDraft()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="filter-dropdown-panel">
    <div class="filter-dropdown-panel__title">按{{ title }}筛选</div>
    <div class="filter-dropdown-panel__body">
      <a-select
        v-if="showTermType"
        :value="draftTermType"
        class="filter-dropdown-panel__select"
        :options="termTypeOptions"
        @change="onTermTypeChange"
      />
      <ValueItem
        v-model:value="draftValue"
        :column="column"
        :termType="draftTermType"
        :show-action="false"
        embedded
      />
    </div>
    <div class="filter-dropdown-panel__actions">
      <a-button type="primary" block @click="onApply">应用</a-button>
      <a-button block @click="onReset">重置</a-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.filter-dropdown-panel {
  width: 280px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(31, 35, 41, 0.12);

  &__title {
    margin-bottom: 12px;
    color: #1d2129;
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__select {
    width: 100%;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
  }
}
</style>
