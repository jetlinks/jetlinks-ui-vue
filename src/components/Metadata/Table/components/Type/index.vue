<template>
  <a-select
    v-bind="props"
    v-model:value="myValue"
    style="width: 100%"
    placeholder="请选择数据类型"
    :dropdownStyle="{
      zIndex: 1071
    }"
    :options="options"
    :getPopupContainer="(node) => tableWrapperRef || node"
    @change="change"
  />
</template>

<script setup name="MetadataType">
import { selectProps } from 'ant-design-vue/lib/select';
import defaultOptions from './data';
import {useTableWrapper} from "@/components/Metadata/Table/utils";

const props = defineProps({
  ...selectProps(),
  filter: {
    type: Array ,
    default: () => [],
  },
  value: {
    type: Array,
    default: () => [],
  }
});

const emit = defineEmits(['update:value']);

const myValue = ref(props.value)

const options = computed(() => {
  return defaultOptions.filter(item => !props.filter.includes(item.value) )
})

const tableWrapperRef = useTableWrapper()
const change = (key) => {
  myValue.value = key
  emit('update:value', key)
}

watch(
  () => props.value,
  (newValue) => {
    myValue.value = newValue;
  },
);

</script>

<style scoped>

</style>
