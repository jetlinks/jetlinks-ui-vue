<template>
  <j-row :gutter='[24]'>
    <j-col :span='10'>
      <j-form-item
        name='readProperties'
        :rules="[{ required: true, message: $t('Device.ReadProperties.5425841-0') }]"
      >
        <j-select
          show-search
          mode='multiple'
          max-tag-count='responsive'
          :placeholder='$t('Device.ReadProperties.5425841-0')'
          style='width: 100%'
          v-model:value='readProperties'
          :options='properties'
          :filter-option='filterSelectNode'
          @change='change'
        />
      </j-form-item>
    </j-col>
    <j-col :span='14'>
      <j-form-item>{{ $t('Device.ReadProperties.5425841-1') }}</j-form-item>
    </j-col>
  </j-row>
</template>

<script setup lang='ts' name='ReadProperties'>
import { filterSelectNode } from '@/utils/comm'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
    extraStr += $t('Device.ReadProperties.5425841-2', [optionItems.length]);
  }
  emit('update:value', values)
  emit('update:action', $t('Device.ReadProperties.5425841-3', [extraStr]))
}

</script>

<style scoped>

</style>