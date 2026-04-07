<script setup>
import { Input, InputNumber } from 'ant-design-vue'
import Tree from './ValueComponents/Tree.vue'
import DatePicker from './ValueComponents/DatePicker.vue'
import RangePicker from './ValueComponents/RangePicker.vue'
import { useColumnItemOptions, useColumnsMap } from './hooks/useSearchEngine'
import { isArrayTermType } from './setting'
import { normalizeOptionTree } from './utils'

const props = defineProps({
  value: {
    type: [String, Number, Array],
    default: undefined,
  },
  column: {
    type: String,
    default: undefined,
  },
  termType: {
    type: String,
    default: undefined,
  },
  showAction: {
    type: Boolean,
    default: true,
  },
  embedded: {
    type: Boolean,
    default: false,
  },
})

const optionsContent = useColumnItemOptions()
const columnsMap = useColumnsMap()
const myValue = ref()

const emit = defineEmits(['change', 'update:value'])

const columnItem = computed(() => {
  if (!props.column) {
    return null
  }
  return columnsMap[props.column]
})

const type = computed(() => {
  return columnItem.value?.search?.type || 'string'
})

const options = computed(() => {
  if (!props.column) {
    return []
  }
  const data = optionsContent[props.column] || []
  return normalizeOptionTree(data)
})

const isRangeMode = computed(() => {
  return ['date', 'time', 'timeRange', 'rangePicker'].includes(type.value) && isArrayTermType(props.termType)
})

const isDateMode = computed(() => {
  return ['date', 'time'].includes(type.value) && !isArrayTermType(props.termType)
})

const isMultipleMode = computed(() => {
  return isArrayTermType(props.termType)
})

const showBtn = computed(() => {
  return props.showAction && !['date', 'time', 'timeRange', 'rangePicker'].includes(type.value)
})

const isNumberRangeMode = computed(() => {
  return type.value === 'number' && isArrayTermType(props.termType)
})

const onSubmit = () => {
  emit('change', myValue.value)
}

const onInputChange = (e) => {
  myValue.value = e.target.value
}

const onNumberChange = (e) => {
  myValue.value = e
}

const onRangeNumberChange = (value, index) => {
  const values = Array.isArray(myValue.value) ? [...myValue.value] : [undefined, undefined]
  values[index] = value
  myValue.value = values
}

const onValueChange = (e) => {
  myValue.value = e
  if (!showBtn.value) {
    onSubmit()
  }
}

watch(() => props.value, (val) => {
  myValue.value = Array.isArray(val) ? [...val] : val
}, { immediate: true })

watch(myValue, (val) => {
  emit('update:value', Array.isArray(val) ? [...val] : val)
}, { deep: true })
</script>

<template>
  <div class="filter-terms-value-item" :class="{ 'filter-terms-value-item--embedded': embedded }" style="min-width: 120px">

    <div v-if="isNumberRangeMode" class="filter-terms-value-item__range">
      <a-input-number
        :value="Array.isArray(myValue) ? myValue[0] : undefined"
        class="filter-terms-value-item__range-input"
        v-bind="columnItem.search.componentProps"
        @change="(value) => onRangeNumberChange(value, 0)"
      />
      <span class="filter-terms-value-item__range-separator">至</span>
      <a-input-number
        :value="Array.isArray(myValue) ? myValue[1] : undefined"
        class="filter-terms-value-item__range-input"
        v-bind="columnItem.search.componentProps"
        @change="(value) => onRangeNumberChange(value, 1)"
      />
    </div>
    <a-input-number
      v-else-if="type === 'number'"
      v-model:value="myValue"
      style="width:100%"
      v-bind="columnItem.search.componentProps"
      @change="onNumberChange"
    />
    <Tree
      v-else-if="type === 'tree' || type === 'select' || type === 'treeSelect'"
      v-bind="columnItem.search.componentProps"
      :options="options"
      :multiple="isMultipleMode"
      v-model:value="myValue"
      @change="onValueChange"
    />
    <RangePicker
      v-else-if="isRangeMode"
      v-model:value="myValue"
      v-bind="columnItem.search.componentProps"
      @change="onValueChange"
    />
    <DatePicker
      v-else-if="isDateMode"
      v-model:value="myValue"
      v-bind="columnItem.search.componentProps"
      @change="onValueChange"
    />
    <component
      v-else-if="type === 'component'"
      :is="columnItem.search.components"
      v-model:value="myValue"
      v-bind="columnItem.search.componentProps"
      @change="onValueChange"
    />
    <a-input v-else v-model:value="myValue" style="width:100%" @change="onInputChange" />
    <div v-if="showBtn" style="text-align: right;padding-right: 10px;">
      <a-button size="small" type="primary" @click="onSubmit">
        确定
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.filter-terms-value-item {
  padding: 6px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &--embedded {
    padding: 0;
    box-shadow: none;
  }

  &__range {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
  }

  &__range-input {
    width: 100%;
  }

  &__range-separator {
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
  }
}
</style>
