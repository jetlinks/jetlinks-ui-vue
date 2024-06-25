<template>
  <Select
    placeholder="请选择单位"
    style="width: 100%"
    mode="tags"
    v-model:value="myValue"
    :dropdownStyle="{
      zIndex: 1071
    }"
    :getPopupContainer="(node) => tableWrapperRef || node"
    :options="options"
    optionFilterProp="label"
    @change="change"
  />
</template>

<script setup name="MetadataUnitSelect">
import { Form, Select } from 'ant-design-vue'
import {useTableWrapper} from "@/components/Metadata/Table/utils";
import {useGetUnit} from "@/views/device/components/Metadata/Base/columns";

const props = defineProps({
  value: {
    type: [String, Number],
    default: undefined
  },
  size: {
    type: String,
    default: 'middle'
  },
  name: {
    type: String,
    default: 'maxLength'
  },
  rules: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:value', 'change'])

const myValue = ref(props.value)

const options = useGetUnit()

const formItemContext = Form.useInjectFormItemContext();

const tableWrapperRef = useTableWrapper()
const change = (v) => {
  const newValue = v.length > 1 ? v.pop() : v?.[0];
  myValue.value = [newValue];
  emit('update:value', newValue);
  emit('change', newValue);
  formItemContext.onFieldChange();
};

const filterOption = (v, option) => {
  return option.label.includes(v)
}

watch(
  () => props.value,
  (newV) => {
    myValue.value = newV ? [newV] : undefined;
  },
  { immediate: true },
);

</script>

<style scoped>

</style>
