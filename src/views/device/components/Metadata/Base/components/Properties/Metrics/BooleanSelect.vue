<template>
  <j-select
      v-model:value="myValue"
      :options="[
          { label: '固定值', value: 'false' },
          { label: '范围值', value: 'true' },
      ]"
      :dropdownStyle="{
        zIndex: 1071
      }"
      :getPopupContainer="(node) => tableWrapperRef || node"
      @select="select"
  />
</template>

<script name="BooleanSelect" setup>
import {useTableWrapper} from "@/components/Metadata/Table/context";

const props = defineProps({
  value: {
    type: String,
    default: 'false'
  }
})

const emit = defineEmits(['update:value', 'select'])

const tableWrapperRef = useTableWrapper()
const myValue = ref()
const select = (e) => {
  emit('update:value', e === 'true')
  emit('select', e === 'true')
}

watch(() => JSON.stringify(props.value), () => {
  myValue.value = props.value ? 'true' : 'false'
}, { immediate: true })

</script>

<style scoped>

</style>
