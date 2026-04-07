<template>
  <div :class="classNames">
    <j-advanced-search
      :target='target'
      :type='type'
      :request='(data) => saveSearchHistory(data, target)'
      :historyRequest='() => getSearchHistory(target)'
      :deleteRequest='(_target: string, id: string) => deleteSearchHistory(target, id)'
      :columns='columns'
      :class='props.class'
      :style='myStyles'
      @search='searchSubmit'
      @reset="onReset"
      ref="searchRef"
    />
  </div>
</template>

<script setup lang='ts' name='ProSearch'>
import { PropType } from 'vue'
import { saveSearchHistory, getSearchHistory, deleteSearchHistory } from '@jetlinks-web-core/api/comm'
import {isObject} from "lodash-es";

interface Emit {
  (e: 'search', data: any): void
  (e: 'reset'): void
}

const props = defineProps({
  columns: {
    type: Array as PropType<any[]>,
    default: () => [],
    required: true
  },
  type: {
    type: String,
    default: 'advanced'
  },
  target: {
    type: String,
    default: '',
    required: true
  },
  class: {
    type: String,
    default: ''
  },
  noMargin: {
    type: Boolean,
    default: false
  },
  style: {
    type: [String, Object],
    default: () => ({
      paddingTop: '18px',
      paddingBottom: '18px',
    })
  }
})

const emit = defineEmits<Emit>()

const searchRef = ref()
const classNames = computed(() => {
  return {
    'j-advanced-search-warp': true,
    'no-margin': props.noMargin !== false
  }
})

const myStyles = computed(() => {
  if (isObject(props.style)) {
    return {
      paddingTop: '18px',
      paddingBottom: '18px',
      ...props.style
    }
  }
  return props.style
})

/**
 * 提交
 */
const searchSubmit = (data: any) => {
  emit('search', data)
}

const reset = () => {
  searchRef.value?.reset?.()
}

const onReset = () => {
  emit('reset')
}

defineExpose({ reset, setValues: (data: Record<string, any>) => searchRef.value?.setValues(data) })
</script>

<style scoped lang='less'>
  .no-margin {
    :deep(.JSearch-warp) {
      margin: 0;
    }
  }
</style>
