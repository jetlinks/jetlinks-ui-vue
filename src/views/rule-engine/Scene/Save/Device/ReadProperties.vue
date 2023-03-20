<template>
  <j-row :gutter='[24]'>
    <j-col :span='10'>
      <j-form-item
        name='readProperties'
        :rules="[{ required: true, message: '请选择属性' }]"
      >
        <j-select
          show-search
          mode='multiple'
          max-tag-count='responsive'
          placeholder='请选择属性'
          style='width: 100%'
          v-model:value='readProperties'
          :options='properties'
          :filter-option='filterSelectNode'
          @change='change'
        />
      </j-form-item>
    </j-col>
    <j-col :span='14'>
      <j-form-item>定时读取所选属性值</j-form-item>
    </j-col>
  </j-row>
</template>

<script setup lang='ts' name='ReadProperties'>
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

const readProperties = ref<string[]>(props.value)

const change = (values: string[], optionItems: any[]) => {
  const names = optionItems.map((item) => item.name);
  let extraStr = '';
  let isLimit = false;
  let indexOf = 0;
  extraStr = names.reduce((_prev, next, index) => {
    if (_prev.length <= 30) {
      indexOf = index;
      return index === 0 ? next : _prev + '、' + next;
    } else {
      isLimit = true;
    }
    return _prev;
  }, '');

  if (isLimit && names.length - 1 > indexOf) {
    extraStr += `等${optionItems.length}个属性`;
  }
  emit('update:value', values)
  emit('update:action', `读取 ${extraStr}`)
}

</script>

<style scoped>

</style>