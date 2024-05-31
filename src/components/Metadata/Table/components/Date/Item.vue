<template>
  <a-form-item
    label="时间格式"
    required
    :name="name"
    :rules="[
            {
                required: true,
                message: '请选择时间格式',
            },
      ]"
  >
    <AutoComplete
      v-model:value="date"
      :options="options"
      mode="tags"
      placeholder="请选择时间格式"
      :dropdownMenuStyle="{ zIndex: 1071}"
      :getPopupContainer="(node) => tableWrapperRef || node"
      @change="change"
    />
  </a-form-item>
</template>

<script setup name="MetadataDateItem">
import { AutoComplete } from 'jetlinks-ui-components'
import {useTableWrapper} from "components/Metadata/Table/utils";

const props = defineProps({
  value: {
    type: String,
    default: undefined,
  },
  name: {
    type: String,
    default: 'format',
  },
});

const emit = defineEmits(['update:value']);

const options = [
  { label: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
  { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
  { label: 'hh:mm:ss', value: 'hh:mm:ss' },
];

const date = ref(props.value);

const tableWrapperRef = useTableWrapper()
const change = () => {
  emit('update:value', date.value);
};

watch(
  () => props.value,
  () => {
    date.value = props.value;
  }
);

</script>

<style scoped>

</style>
