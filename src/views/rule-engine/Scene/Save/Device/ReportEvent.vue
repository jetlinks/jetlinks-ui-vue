<template>
  <a-row :futter='[24]'>
    <a-col :span='10'>
      <a-select
        showSearch
        max-tag-count='responsive'
        style='width: 100%'
        placeholder='placeholder'
        v-model:value='reportKey'
        :options='properties'
        :filter-option='filterSelectNode'
      />
    </a-col>
    <a-col :span='14'>定时调用所选属性</a-col>
    <a-col :span='24' v-if='showTable'>

    </a-col>
  </a-row>
</template>

<script setup lang='ts' name='ReportEvent'>
import { filterSelectNode } from '@/utils/comm'
import type { PropType } from 'vue'

type Emit = {
  (e: 'update:value', data: Array<string>): void
  (e: 'update:action', data: string): void
}

const props = defineProps({
  value: {
    type: Array as PropType<Array<string>>,
    default: () => []
  },
  action: {
    type: String,
    default: ''
  },
  properties: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits<Emit>()

const reportKey = ref<Array<string>>([])
const callData = ref<Array<{}>>()

const showTable = computed(() => {
  return !!reportKey.value
})

watch([props.value, props.properties], () => {
  if (props.value && props.properties?.length) {

  } else {

  }
}, { immediate: true })

</script>

<style scoped>

</style>