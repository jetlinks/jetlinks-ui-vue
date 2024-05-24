<template>
  <a-select
    v-bind="props"
    v-model:value="myValue"
    style="width: 100%"
    placeholder="请选择数据类型"
    :options="options"
    @change="change"
  />
</template>

<script setup name="MetadataType">
import { selectProps } from 'ant-design-vue/lib/select';
import defaultOptions from './data';
import {difference} from "lodash-es";

const props = defineProps({
  ...selectProps(),
  filter: {
    type: Array ,
    default: () => [],
  },
});

const emit = defineEmits(['update:value']);

const myValue = ref(props.value)

const options = computed(() => difference(defaultOptions, props.filter))

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
