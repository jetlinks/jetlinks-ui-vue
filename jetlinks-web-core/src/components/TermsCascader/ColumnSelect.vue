<script setup name="ColumnSelect">
import { useTermsEvent, useTermsParse, useTermsValue } from './hooks'
import { computed } from 'vue'
import { initValueByTermType } from './utils'

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  valueOptions: {
    type: Array,
    default: () => [],
  },
  fieldNames: {
    type: Object,
    default: () => ({ column: 'column' }),
  }
})

const defaultFieldNames = { title: 'name', key: 'column', children: 'children' };

const termsValue = useTermsValue()
const termsParse = useTermsParse()
const events = useTermsEvent()
const open = ref(false)
const oleValueCache = ref()
const expendsKeys = ref([])

const getColumnDetail = (code) => {
  const map = unref(termsParse.map)
  const item = map.get(code)
  expendsKeys.value = item?.__sourcePath__ || []
  return item
}

// 计算当前选中的显示文本
const selectedLabel = computed(() => {
  const column = unref(termsValue).column
  return getColumnDetail(column)?.fullName || '请选择参数'
})

// 查找当前选中项的完整路径
const getSelectedKeys = computed({
  get() {
    const column = unref(termsValue).column
    return column ? [column] : []
  },
  set(selectedKeys) {
    unref(termsValue).column = selectedKeys?.[0] || undefined
  }
})

const setColumnData = (keys) => {
  open.value = false
  getSelectedKeys.value = keys
  events.onChange?.()
}

// 处理选择
const handleSelectResult = (keys, oldKey) => {
  const key = keys[0]
  const columnItem = getColumnDetail(key)
  const oldColumnItem = getColumnDetail(oldKey)
  const isDataTypeChange = columnItem.dataType !== oldColumnItem?.dataType

  // 如果column数据类型发生变化，修改termType和value值
  if (isDataTypeChange) {
    const value = {}
    const termsType = columnItem.termTypes[0]?.id || 'eq'
    termsValue.value.termType = termsType
    if (columnItem.dataType === 'array') {
      value.value = {}
    } else {
      value.value = initValueByTermType(termsType)
    }
    value.source = props.valueOptions[0]?.value || 'fixed'
    events.updateValue(value.value)
  }
}

const handleSelect = ( keys ) => {
  handleSelectResult(keys, oleValueCache.value)
  setColumnData(keys)
}

const visibleChange = (v) => {
  open.value = v;
};

const showOpen = () => {
  if (!props.disabled) {
    open.value = true
  }
}

watch(() => termsValue.value.column, (newValue, oldValue) => {
    oleValueCache.value = oldValue
    if (newValue) {
      handleSelectResult([newValue], oldValue)
    }
})

</script>

<template>
<a-dropdown :trigger="['click']" :open="open" @openChange="visibleChange">
  <div class="column-select-popup border-box" @click="showOpen">
    <span>{{ selectedLabel }}</span>
  </div>

  <template #overlay>
    <div class="column-tree-dropdown">
      <a-tree
        v-if="props.options.length"
        :selectedKeys="getSelectedKeys"
        :treeData="options"
        :height="360"
        :field-names="{...defaultFieldNames, key: props.column}"
        v-model:expandedKeys="expendsKeys"
        tree-default-expand-all
        @select="handleSelect"
      >
        <template #title="{ name, description, fullName }">
          <a-space>
            {{ name || fullName }}
            <span v-if="description" style="color: grey">
              {{description }}
            </span>
          </a-space>
        </template>
      </a-tree>
      <j-empty v-else />
    </div>
  </template>
</a-dropdown>
</template>

<style scoped lang="less">
@import './style/comm.less';

.column-select-popup {
  max-width: 220px;
  height: 32px;
  padding: 4px 11px;
  border: 1px solid rgba(0, 164, 254, 0.3);
  color: #00a4fe;
  background-color: rgba(154, 219, 255, 0.3);
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    border-color: rgba(0, 164, 254, 0.5);
    background-color: rgba(154, 219, 255, 0.4);
  }

  &:focus {
    border-color: #00a4fe;
    outline: none;
  }

  span {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.column-tree-dropdown {
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  min-width: 400px;

  :deep(.ant-tree) {
    .ant-tree-node-content-wrapper {
      border-radius: 4px;

      &:hover {
        background-color: rgba(154, 219, 255, 0.2);
      }
    }

    .ant-tree-node-selected {
      .ant-tree-node-content-wrapper {
        background-color: rgba(0, 164, 254, 0.3);
      }
    }
  }
}
</style>
