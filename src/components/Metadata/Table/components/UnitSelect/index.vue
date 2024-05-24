<template>
  <a-select
    mode="tags"
    placeholder="请选择单位"
    style="width: 100%"
    v-model:value="myValue"
    @change="change"
  />
</template>

<script setup name="MetadataUnitSelect">
import {isArray, isFunction} from 'lodash-es'
import { Form } from 'ant-design-vue'

const props = defineProps({
  options: {
    type: [Array, Function],
    default: () => []
  },
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

const options = ref([])

const formItemContext = Form.useInjectFormItemContext();

const change = (v) => {
  const newValue = v.length > 1 ? v.pop() : v?.[0];
  myValue.value = [newValue];
  emit('update:value', newValue);
  emit('change', newValue);
  formItemContext.onFieldChange();
};

const initOptions = async () => {
  if (isArray(props.options)) {
    options.value = props.options;
  } else if (isFunction(props.options)) {
    options.value = await props.options();
  }
};

onMounted(() => {
  initOptions();
})

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
