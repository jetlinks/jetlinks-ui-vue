<template>
  <a-form-item label="来源" :name="name.concat(['source'])" v-if="type === 'product'" :rules="[
    { required: true, message: '请选择来源' },
  ]">
    <a-select v-model:value="_value.source" :options="PropertySource" size="small" :disabled="metadataStore.model.action === 'edit'"></a-select>
  </a-form-item>
  <virtual-rule-param v-if="_value.source === 'rule'" v-model:value="_value.virtualRule" :name="name.concat(['virtualRule'])" :id="id" :showWindow="_value.source === 'rule'"></virtual-rule-param>
  <a-form-item label="读写类型" :name="name.concat(['type'])" :rules="[
    { required: true, message: '请选择读写类型' },
  ]">
    <a-select v-model:value="_value.type" :options="options" mode="multiple" size="small"></a-select>
  </a-form-item>
</template>
<script setup lang="ts" name="ExpandsForm">
import { useMetadataStore } from '@/store/metadata';
import { PropertySource } from '@/views/device/data';
import { PropType } from 'vue';
import VirtualRuleParam from '@/components/Metadata/VirtualRuleParam/index.vue';

type ValueType = Record<any, any>;
const props = defineProps({
  value: {
    type: Object as PropType<ValueType>,
    default: () => ({})
  },
  type: {
    type: String
  },
  name: {
    type: Array as PropType<string[]>,
    default: () => ([]),
    required: true
  },
  id: {
    type: String
  },
})

interface Emits {
  (e: 'update:value', data: ValueType): void;
}
const emit = defineEmits<Emits>()

const _value = computed({
  get: () => props.value,
  set: val => {
    emit('update:value', val)
  }
})

const options = [
  {
    label: '读',
    value: 'read',
  },
  {
    label: '写',
    value: 'write',
  },
  {
    label: '上报',
    value: 'report',
  },
]

const metadataStore = useMetadataStore()

onMounted(() => {
  if (props.type === 'product' || !props.value.source) {
    emit('update:value', { ...props.value, source: 'device' })
  }
})

</script>
<style lang="less" scoped></style>