<template>
  <j-select
    v-model:value="myValue"
    style="width: 100%;"
    :options="[
        { label: '不必填', value: 'false'},
        { label: '必填', value: 'true'},
    ]"
    :getPopupContainer="(node) => tableWrapperRef || node"
    @change="change"
  >

  </j-select>
</template>

<script setup name="BooleanSelect">
import {useTableWrapper} from "@/components/Metadata/Table/utils";

const props = defineProps({
  value: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits(['update:value'])
const tableWrapperRef = useTableWrapper()

const myValue = ref()

const change = (e) => {
  emit('update:value', myValue.value === 'true')
}

watch(() => props.value, () => {
  myValue.value = props.value === true ? 'true' : 'false'
}, { immediate: true })

</script>

<style scoped>

</style>
