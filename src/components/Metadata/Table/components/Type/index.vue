<template>
  <div :class="{'select-no-value': !value}">
    <a-select
      v-bind="props"
      allow-clear
      :value="myValue"
      style="width: 100%"
      placeholder="请选择数据类型"
      :dropdownStyle="{
        zIndex: 1071
      }"
      :options="options"
      :getPopupContainer="(node) => tableWrapperRef || node"
      @change="change"
    />
  </div>
</template>

<script setup name="MetadataType">
import { selectProps } from 'ant-design-vue/lib/select';
import defaultOptions from './data';
import {useTableWrapper} from "@/components/Metadata/Table/context";
import {BooleanValueMap} from "../utils";

const props = defineProps({
  ...selectProps(),
  filter: {
    type: Array ,
    default: () => [],
  },
  value: {
    type: Object,
    default: () => ({
      type: undefined
    })
  }
});

const emit = defineEmits(['update:value']);

const myValue = ref(props.value.type)

const options = computed(() => {
  return defaultOptions.filter(item => !props.filter.includes(item.value) )
})

const tableWrapperRef = useTableWrapper()
const change = (key) => {
  myValue.value = key
  const extra = {}
  let newValueType = { type: key }

  if (key === 'boolean') {
    const BooleanDefaultValue = BooleanValueMap()
    Object.keys(BooleanDefaultValue).forEach(key => {
      if (!props.value[key]) {
        extra[key] = BooleanDefaultValue[key]
      }
    })
    newValueType = Object.assign(newValueType, extra)
  }

  emit('update:value', newValueType)
}

watch(
  () => props.value,
  (newValue) => {
    myValue.value = newValue.type;
  },
);

</script>

<style scoped>

</style>
