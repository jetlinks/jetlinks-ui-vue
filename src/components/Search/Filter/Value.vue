<script setup name="FilterValue">
import { buildIdToTitle, normalizeOptionTree } from './utils'
import { useColumnItemOptions, useColumnsMap } from './hooks/useSearchEngine'
import ValueItem from './ValueItem.vue'
import { toDayjsValue } from './ValueComponents/utils'

const props = defineProps({
  column: {
    type: String,
    default: undefined,
  },
  value: {
    type: [String, Number, Array],
    default: undefined,
  },
  termType: {
    type: String,
    default: undefined,
  }
})

const emit = defineEmits(['close', 'change'])

const optionsContent = useColumnItemOptions()
const columnsMap = useColumnsMap()
const optionsTitleMap = shallowRef(new Map())
const currentValue = ref('')
const open = ref(false)
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const _column = computed(() => {
  if (!props.column) {
    return null
  }
  return columnsMap[props.column]
})

const options = computed(() => {
  if (!props.column) {
    return []
  }
  const data = optionsContent[props.column] || []
  const optionsData = normalizeOptionTree(data)
  optionsTitleMap.value = buildIdToTitle(optionsData)

  return optionsData
})

const isTimeColumn = computed(() => {
  return ['time', 'date', 'timeRange', 'rangePicker'].includes(_column.value?.search?.type)
})

const formatTimeValue = (value) => {
  const dateValue = toDayjsValue(value)
  if (!dateValue) {
    return value
  }
  return dateValue.format(timeFormat)
}

const onChange = (v) => {
  open.value = false
  emit('change', v)
}

const onClose = () => {
  emit('close')
}

const openChange = (status) => {
  open.value = status
}

watch([() => props.value, options], ([newValue]) => {
  if (
    newValue === undefined
    || newValue === null
    || newValue === ''
    || (Array.isArray(newValue) && newValue.length === 0)
  ) {
    currentValue.value = ''
    return
  }

  if (Array.isArray(newValue)) {
    const labels = newValue.map((v) => {
      if (isTimeColumn.value) {
        return formatTimeValue(v)
      }
      return optionsTitleMap.value.get(v) || optionsTitleMap.value.get(String(v)) || v
    })
    currentValue.value = labels.join(', ')
  } else {
    if (isTimeColumn.value) {
      currentValue.value = formatTimeValue(newValue)
      return
    }
    currentValue.value = optionsTitleMap.value.get(newValue) || optionsTitleMap.value.get(String(newValue)) || newValue
  }
}, { immediate: true})

</script>

<template>
  <a-dropdown :open="open" trigger="click" @openChange="openChange">
    <a-tag color="processing" style="margin: 0" class="filter-value-tag">
      <a-space>
        <span class="filter-value-text">{{ currentValue }}</span>
        <AIcon type="CloseOutlined" style="font-size: 12px" @click="onClose"/>
      </a-space>
    </a-tag>
    <template #overlay>
      <ValueItem :column="column" :termType="termType" :value="value" @change="onChange" />
    </template>
  </a-dropdown>
</template>

<style scoped lang="less">
.filter-value-tag {
  max-width: 300px;
}

.filter-value-text {
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
</style>
