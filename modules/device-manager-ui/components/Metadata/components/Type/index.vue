<template>
  <div :class="{'select-no-value': !value}">
    <a-select
      v-bind="omit(props, 'value')"
      allow-clear
      :value="myValue"
      style="width: 100%"
      :placeholder="$t('Type.index.270840-0')"
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
import {useTableWrapper} from "../../context";
import { BooleanValueMap } from "../utils";
import {omit} from "lodash-es";

const props = defineProps({
  ...selectProps(),
  filter: {
    type: Array,
    default: () => [],
  },
  value: {
    type: Object,
    default: () => ({
      type: undefined
    })
  },
});

const emit = defineEmits(['update:value', 'valueChange']);

const myValue = ref(props.value.type)

const options = computed(() => {
  return defaultOptions.filter(item => !props.filter.includes(item.value))
})

const tableWrapperRef = useTableWrapper()
const change = (key) => {
  myValue.value = key
  const extra = {}
  let newValueType = {type: key}

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
  emit('valueChange', newValueType)
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
