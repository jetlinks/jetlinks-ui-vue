<script setup name="ValueFixed">
import { ValueItem } from '@jetlinks-web/components'

const asyncComponents = {
  time: defineAsyncComponent(() => import('./Time.vue')),
  BooleanMenu: defineAsyncComponent(() => import('./BooleanMenu.vue')),
  valueItem: ValueItem
}
const emit = defineEmits(['update:value', 'change'])

const props = defineProps({
  dataType: {
    type: String,
    default: undefined,
  },
  value: {
    type: [String, Number, Boolean, Object],
    default: undefined,
  },
  options: {
    type: Array,
    default: () => [],
  }
})

const myValue = ref()

const contentRef = computed(() => {
  if (['date', 'time'].includes(props.dataType)) {
    return asyncComponents.time
  }

  if ('boolean' === props.dataType) {
    return asyncComponents.BooleanMenu
  }

  return asyncComponents.valueItem
})

const onChange = (e) => {
  emit('update:value', e)
  emit('change', e)
}

watch(() => props.value, (newValue) => {
  myValue.value = newValue
}, { immediate: true })

</script>

<template>
  <div class="terms--value--fixed">
    <component
      v-if="contentRef && dataType"
      :is="contentRef"
      :itemType="dataType"
      :modelValue="myValue"
      :value="myValue"
      :options="options"
      format="HH:mm:ss"
      @change="onChange"
    >
    </component>
    <j-empty v-else />
  </div>
</template>

<style scoped lang="less">
.terms--value--fixed {
  padding: 8px;
  min-width: 200px;
  min-height: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
