<script setup name="FilterItem">
import Column from './Column.vue';
import TermType from './TermType.vue';
import Value from './Value.vue';
import { useEngines } from './hooks/useSearchEngine'
import { isArrayTermType } from './setting'

const props = defineProps({
  column: {
    type: String,
    default: undefined,
  },
  type: {
    type: String,
    default: undefined,
  },
  termType: {
    type: String,
    default: undefined,
  },
  value: {
    type: [String, Number, Array],
    default: undefined,
  },
  index: {
    type: Number,
    default: 0,
  }
})

const typeOptions = [
  { label: '并且', value: 'and'},
  { label: '或者', value: 'or'}
]

const convertValue = (oldTermType, newTermType, currentValue) => {
  if (oldTermType === newTermType) {
    return currentValue
  }

  const expectsArrayValue = isArrayTermType(newTermType)
  const isRangeType = ['btw', 'nbtw'].includes(newTermType)

  if (!expectsArrayValue) {
    return Array.isArray(currentValue) ? currentValue[0] : currentValue
  }

  if (currentValue === undefined || currentValue === null) {
    return undefined
  }

  if (Array.isArray(currentValue)) {
    if (isRangeType) {
      return [currentValue[0], currentValue[1] ?? undefined]
    }
    return [...currentValue]
  }

  return isRangeType ? [currentValue, undefined] : [currentValue]
}

const { updateTermValue, removeItem } = useEngines()
const typeOptionsMap = ref({})

const onTypeChange = ({ key }) => {
  updateTermValue(key, props.index, 'type')
}

const onTermTypeChange = (value) => {
  const convertedValue = convertValue(props.termType, value, props.value)
  updateTermValue(convertedValue, props.index, 'value')
  updateTermValue(value, props.index, 'termType')
}

const onValueChange = (value) => {
  updateTermValue(value, props.index, 'value')
}

const onCloseTermItem = () => {
  removeItem(props.index)
}

const init = () => {
  typeOptions.forEach((item) => {
    typeOptionsMap.value[item.value] = item.label
  })
}

init()

</script>

<template>
  <div class="filter-item">
    <a-dropdown trigger="click">
      <a-tag v-if="type && index !== 0" color="processing" style="margin: 0">
        {{ typeOptionsMap[type] }}
      </a-tag>
      <template #overlay>
        <a-menu style="width: 120px" @click="onTypeChange">
          <a-menu-item v-for="option in typeOptions" :key="option.value">
            {{ option.label }}
          </a-menu-item>
        </a-menu>

      </template>
    </a-dropdown>
    <Column :value="column" />
    <TermType :column="column" :value="termType" @change="onTermTypeChange"/>
    <Value v-if="!!value" :column="column" :termType="termType" :value="value" @change="onValueChange" @close="onCloseTermItem" />
  </div>
</template>

<style scoped lang="less">
.filter-item {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-right: 4px;
}
</style>
