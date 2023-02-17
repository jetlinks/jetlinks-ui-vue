<template>
  <a-select v-model:value="_value" mode="tags" :options="options" :size="size" @change="change"></a-select>
</template>
<script setup lang="ts" name="InputSelect">
import { SizeType } from 'ant-design-vue/es/config-provider';
import { DefaultOptionType, SelectValue } from 'ant-design-vue/es/select';
import { PropType } from 'vue';
type valueType = string | number
type Emits = {
  (e: 'update:value', data: valueType | undefined): void;
  (e: 'change'): void;
};
const emit = defineEmits<Emits>();
const props = defineProps({
  value: [String, Number],
  options: {
    type: Array as PropType<DefaultOptionType[]> | undefined,
  },
  size: String as PropType<SizeType>
})
const _value = ref<valueType[]>();
watch(
  () => props.value,
  (val) => {
    _value.value = val ? [val] : undefined
  },
  { immediate: true }
)

const change = (value: SelectValue) => {
  const _val = (value as valueType[])
  if (_val.length > 1) {
    emit('update:value', _val.slice(_val.length - 1)?.[0])
  } else {
    emit('update:value', value?.[0])
  }
}
</script>
<style scoped lang="less">
</style>