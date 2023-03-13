<template>
  <j-advanced-search
    :target='target'
    :type='type'
    :request='saveSearchHistory'
    :historyRequest='getSearchHistory'
    :columns='columns'
    @search='searchSubmit'
  />
</template> 

<script setup lang='ts' name='ProSearch'>
import { PropType } from 'vue'
import { JColumnsProps } from 'components/Table/types'
import { saveSearchHistory, getSearchHistory } from '@/api/comm'

interface Emit {
  (e: 'search', data: any): void
}

const props = defineProps({
  columns: {
    type: Array as PropType<JColumnsProps[]>,
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
  }
})

const emit = defineEmits<Emit>()

/**
 * 提交
 */
const searchSubmit = (data: any) => {
  emit('search', data)
}

</script>

<style scoped lang='less'>

</style>