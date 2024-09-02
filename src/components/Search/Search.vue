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
      style='padding-top: 18px; padding-bottom: 18px;'
      @search='searchSubmit'
    />
  </div>
</template>

<script setup lang='ts' name='ProSearch'>
import { PropType } from 'vue'
import { saveSearchHistory, getSearchHistory, deleteSearchHistory } from '@/api/comm'

interface Emit {
  (e: 'search', data: any): void
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
  }
})

const emit = defineEmits<Emit>()

const classNames = computed(() => {
  return {
    'j-advanced-search-warp': true,
    'no-margin': props.noMargin !== false
  }
})

/**
 * 提交
 */
const searchSubmit = (data: any) => {
  emit('search', data)
}

</script>

<style scoped lang='less'>
  .no-margin {
    :deep(.JSearch-warp) {
      margin: 0;
    }
  }
</style>
