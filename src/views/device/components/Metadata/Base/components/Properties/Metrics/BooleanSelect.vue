<template>
  <j-select
      v-model:value="myValue"
      :options="[
          { label: '固定值', value: 'false' },
          { label: '范围值', value: 'true' },
      ]"
      :get-popup-container="(node) => fullRef || node"
      @select="select"
  />
</template>

<script name="BooleanSelect" setup>
import { FULL_CODE } from 'jetlinks-ui-components/es/DataTable'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:value'])

const fullRef = inject(FULL_CODE);
const myValue = ref()
const select = (e) => {
  emit('update:value', {
    ...props.value,
    range: e === 'true',
    value: e === 'true' ? [undefined, undefined] : undefined
  })
}

watch(() => JSON.stringify(props.value), () => {
  myValue.value = `${props.value?.range}`
}, { immediate: true })

</script>

<style scoped>

</style>