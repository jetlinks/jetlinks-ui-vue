<script setup lang="ts" name="PropertyFilter">
import type { PropType } from 'vue'
import dayjs from 'dayjs'
import FilterDropdownPanel from './FilterDropdownPanel.vue'
import { useSearchEngine } from './hooks/useSearchEngine'
import { buildIdToTitle, normalizeOptionTree } from './utils'
import { TermTypeOptions } from './setting'
import type { SearchItem, TermsItem } from './typing'

const props = defineProps({
  target: {
    type: String,
    default: '',
  },
  columns: {
    type: Array as PropType<SearchItem[]>,
    default: () => [],
  },
  initParams: {
    type: Array as PropType<TermsItem[]>,
    default: () => [],
  },
})

const emit = defineEmits(['search', 'update:params'])

const keyword = ref('')
const openColumnKey = ref<string>()

const {
  formModel,
  columnsOptions,
  columnsMap,
  optionsMap,
  submit,
  createOptionsLoader,
  getTermByColumn,
  setTermByColumn,
  removeTermByColumn,
  clearItems,
} = useSearchEngine(props)

const typeOptions = [
  { label: '并且', value: 'and' },
  { label: '或者', value: 'or' },
]

const typeOptionsMap = typeOptions.reduce<Record<string, string>>((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

const termTypeLabelMap = TermTypeOptions.reduce<Record<string, string>>((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

const cloneTermValue = (value: any) => {
  return Array.isArray(value) ? [...value] : value
}

const getUIParams = () => {
  return formModel.value.map((item) => ({
    ...item,
    value: cloneTermValue(item.value),
  }))
}

const onSearch = () => {
  const uiParams = getUIParams()
  const searchParams = submit()
  emit('search', searchParams)
  emit('update:params', uiParams)
}

const onClearAll = () => {
  clearItems()
  keyword.value = ''
  openColumnKey.value = undefined
  onSearch()
}

const onKeywordSearch = () => {
  openColumnKey.value = undefined
}

const onOpenChange = (columnKey: string, nextOpen: boolean) => {
  openColumnKey.value = nextOpen ? columnKey : undefined

  if (nextOpen) {
    const column = columnsMap[columnKey]
    if (column?.search?.options) {
      createOptionsLoader(column)
    }
  }
}

const onApply = (payload: TermsItem) => {
  if (!payload.column) {
    return
  }

  setTermByColumn(payload.column, {
    termType: payload.termType,
    value: cloneTermValue(payload.value),
  })
  openColumnKey.value = undefined
  onSearch()
}

const onReset = (columnKey: string) => {
  removeTermByColumn(columnKey)
  openColumnKey.value = undefined
  onSearch()
}

const onTypeChange = (index: number, type: string) => {
  if (!formModel.value[index]) {
    return
  }

  formModel.value.splice(index, 1, {
    ...formModel.value[index],
    type,
  })
  onSearch()
}

const onRemove = (columnKey: string) => {
  removeTermByColumn(columnKey)
  if (openColumnKey.value === columnKey) {
    openColumnKey.value = undefined
  }
  onSearch()
}

const normalizeText = (value: any) => {
  if (value === undefined || value === null || value === '') {
    return ''
  }
  return String(value)
}

const formatValueLabel = (term: TermsItem) => {
  const columnKey = term.column || ''
  const column = columnsMap[columnKey]
  const searchType = column?.search?.type

  if (!column) {
    return normalizeText(term.value)
  }

  const rawOptions = normalizeOptionTree(optionsMap[columnKey] || [])
  const titleMap = buildIdToTitle(rawOptions)
  const formatSingleValue = (value: any) => {
    if (value === undefined || value === null || value === '') {
      return ''
    }

    if (['date', 'time', 'timeRange', 'rangePicker'].includes(searchType)) {
      const currentValue = dayjs(value)
      return currentValue.isValid() ? currentValue.format('YYYY-MM-DD HH:mm:ss') : normalizeText(value)
    }

    return titleMap.get(value) || titleMap.get(String(value)) || normalizeText(value)
  }

  if (Array.isArray(term.value)) {
    const separator = ['btw', 'nbtw'].includes(term.termType || '') ? ' ~ ' : '、'
    return term.value.map((item) => formatSingleValue(item)).filter(Boolean).join(separator)
  }

  return formatSingleValue(term.value)
}

const getFilterTermLabel = (term: TermsItem) => {
  const column = term.column ? columnsMap[term.column] : undefined
  if (!column) {
    return ''
  }

  const searchType = column.search?.type

  if (['select', 'tree', 'treeSelect'].includes(searchType)) {
    return ''
  }

  return term.termType ? termTypeLabelMap[term.termType] || '' : ''
}

const filteredColumns = computed(() => {
  const searchText = keyword.value.trim().toLowerCase()

  if (!searchText) {
    return columnsOptions.value
  }

  return columnsOptions.value.filter((item) => {
    const text = `${item.title}${item.dataIndex}`.toLowerCase()
    return text.includes(searchText)
  })
})

const activeTerms = computed(() => {
  return formModel.value.filter(item => item.column)
})

const inactiveColumns = computed(() => {
  const activeColumnKeys = new Set(activeTerms.value.map(item => item.column))
  return filteredColumns.value.filter(item => !activeColumnKeys.has(item.dataIndex))
})

onMounted(() => {
  formModel.value = props.initParams || []
})

defineExpose({
  setValues: (value: TermsItem[]) => {
    formModel.value = value || []
  },
})
</script>

<template>
  <div class="property-filter">
    <div class="property-filter__toolbar">
      <div class="property-filter__conditions">
        <template v-for="(termItem, index) in activeTerms" :key="termItem.key || termItem.column">
          <a-dropdown
            :open="openColumnKey === termItem.column"
            trigger="click"
            placement="bottomLeft"
            @openChange="(visible) => onOpenChange(termItem.column!, visible)"
          >
            <div class="filter-chip filter-chip--active">
              <span class="filter-chip__label">{{ columnsMap[termItem.column!]?.title }}</span>
              <span v-if="getFilterTermLabel(termItem)" class="filter-chip__operator">
                {{ getFilterTermLabel(termItem) }}
              </span>
              <span class="filter-chip__text">{{ formatValueLabel(termItem) }}</span>
              <a-button class="filter-chip__remove" type="link" @click.stop="onRemove(termItem.column!)">
                <template #icon>
                  <AIcon type="CloseOutlined" />
                </template>
              </a-button>
            </div>
            <template #overlay>
              <FilterDropdownPanel
                :column="termItem.column"
                :term="termItem"
                @apply="onApply"
                @reset="onReset"
              />
            </template>
          </a-dropdown>

          <a-dropdown
            v-if="index < activeTerms.length - 1"
            trigger="click"
            placement="bottomLeft"
          >
            <button class="filter-logic" type="button">
              {{ typeOptionsMap[activeTerms[index + 1].type || 'and'] }}
              <AIcon type="DownOutlined" />
            </button>
            <template #overlay>
              <a-menu @click="({ key }) => onTypeChange(index + 1, key)">
                <a-menu-item v-for="option in typeOptions" :key="option.value">
                  {{ option.label }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>

        <a-dropdown
          v-for="column in inactiveColumns"
          :key="column.dataIndex"
          :open="openColumnKey === column.dataIndex"
          trigger="click"
          placement="bottomLeft"
          @openChange="(visible) => onOpenChange(column.dataIndex, visible)"
        >
          <button class="filter-chip filter-chip--ghost" type="button">
            <AIcon type="PlusOutlined" />
            <span class="filter-chip__label">{{ column.title }}</span>
            <AIcon type="DownOutlined" class="filter-chip__arrow" />
          </button>
          <template #overlay>
            <FilterDropdownPanel
              :column="column.dataIndex"
              :term="getTermByColumn(column.dataIndex)"
              @apply="onApply"
              @reset="onReset"
            />
          </template>
        </a-dropdown>
      </div>

      <div class="property-filter__tools">
        <a-input
          v-model:value="keyword"
          allow-clear
          class="property-filter__search"
          placeholder="搜索"
          @pressEnter="onKeywordSearch"
        >
          <template #prefix>
            <AIcon type="SearchOutlined" />
          </template>
        </a-input>
        <button class="property-filter__clear" type="button" @click="onClearAll">
          清除筛选条件
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.property-filter {
  width: 100%;
  padding: 24px;
  margin-bottom: 24px;
  background: #fff;

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 20px;
  }

  &__conditions {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  &__tools {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    justify-content: flex-end;
    margin-left: auto;
  }

  &__search {
    width: 300px;
  }

  &__clear {
    padding: 0;
    color: #165dff;
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
    background: transparent;
    border: 0;
    cursor: pointer;
  }
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 6px 12px;
  color: #1d2129;
  font-size: 14px;
  line-height: 20px;
  background: #fff;
  border: 1px solid #d9dde3;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #165dff;
  }

  &--active {
    padding-left: 8px;
  }

  &--ghost {
    border-style: dashed;
  }

  &__remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    color: #4e5969;
    background: transparent;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
  }

  &__text {
    max-width: 240px;
    overflow: hidden;
    color: #165dff;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__label {
    color: #1d2129;
  }

  &__operator {
    color: #4e5969;
  }

  &__arrow {
    color: #86909c;
    font-size: 12px;
  }
}

.filter-logic {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 7px 12px;
  color: #1d2129;
  font-size: 14px;
  line-height: 20px;
  background: #fff;
  border: 1px solid #d9dde3;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    border-color: #165dff;
  }
}

@media (max-width: 1200px) {
  .property-filter {
    &__toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    &__tools {
      justify-content: space-between;
    }

    &__search {
      width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .property-filter {
    padding: 16px;

    &__tools {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .filter-chip__text {
    max-width: 180px;
  }
}
</style>
