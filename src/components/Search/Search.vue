<template>
  <j-advanced-search
    :target='target'
    :type='type'
    :request='(data) => saveSearchHistory(data, target)'
    :historyRequest='() => getSearchHistory(target)'
    :deleteRequest='(_target: string, id: string) => deleteSearchHistory(target, id)'
    :columns='columns'
    :class='props.class'
    :style='styles'
    @search='searchSubmit'
  />
</template>

<script setup lang='ts' name='ProSearch'>
import type { PropType } from 'vue'
import { computed } from 'vue'
import { JColumnsProps } from 'components/Table/types'
import { saveSearchHistory, getSearchHistory, deleteSearchHistory } from '@/api/comm'
import {isObject} from "lodash-es";

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
  },
  style: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()

/**
 * 提交
 */
const searchSubmit = (data: any) => {
  emit('search', data)
}

const styles = computed(() => {
  const defaultStyle = {
    'padding-top': '18px',
    'padding-bottom': '18px',
  }

  if (isObject(props.style)) {
    return {
      ...defaultStyle,
      ...props.style
    }
  }

  return defaultStyle
})

</script>

<style scoped lang='less'>

</style>
