<template>
  <a-form-item label="来源" :name="name.concat(['source'])" v-if="type === 'product'" :rules="[
    { required: true, message: '请选择来源' },
  ]">
    <a-select v-model:value="_value.source" :options="PropertySource" size="small"
      :disabled="metadataStore.model.action === 'edit'"></a-select>
  </a-form-item>
  <virtual-rule-param v-if="_value.source === 'rule'" v-model:value="_value.virtualRule"
    :name="name.concat(['virtualRule'])" :id="id" :showWindow="_value.source === 'rule'"></virtual-rule-param>
  <a-form-item label="读写类型" :name="name.concat(['type'])" :rules="[
    { required: true, message: '请选择读写类型' },
  ]">
    <a-select v-model:value="_value.type" :options="ExpandsTypeList" mode="multiple" size="small"></a-select>
  </a-form-item>
  <a-form-item label="其他配置" v-if="config.length > 0">
    <a-form-item v-for="(item, index) in config" :key="index">
      <config-param v-model:value="_value" :config="item" :name="name"></config-param>
    </a-form-item>
  </a-form-item>
  <a-form-item v-if="type === 'product' && ['int', 'float', 'double', 'long', 'date', 'string', 'boolean'].includes(valueType.type)"
    label="指标配置" :name="name.concat(['metrics'])">
    <metrics-param v-model:value="_value.metrics" :type="valueType.type" :enum="valueType" :name="name.concat(['metrics'])"></metrics-param>
  </a-form-item>
</template>
<script setup lang="ts" name="ExpandsForm">
import { useMetadataStore } from '@/store/metadata';
import { ExpandsTypeList, PropertySource } from '@/views/device/data';
import { PropType } from 'vue';
import VirtualRuleParam from '@/components/Metadata/VirtualRuleParam/index.vue';
import ConfigParam from '@/components/Metadata/ConfigParam/index.vue'
import MetricsParam from '@/components/Metadata/MetricsParam/index.vue'

type ValueType = Record<any, any>;
const props = defineProps({
  value: {
    type: Object as PropType<ValueType>,
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
  config: {
    type: Array as PropType<ValueType[]>,
    default: () => ([])
  },
  valueType: {
    type: Object,
    default: () => ({})
  }
})

interface Emits {
  (e: 'update:value', data: ValueType): void;
}
const emit = defineEmits<Emits>()

// const _value = computed({
//   get: () => props.value || {},
//   set: val => {
//     emit('update:value', val)
//   }
// })
const _value = ref<ValueType>({})
watchEffect(() => {
  _value.value = props.value || {}
})

watch(_value,
  () => {
    emit('update:value', _value.value)
  },
  { deep: true, immediate: true })

const metadataStore = useMetadataStore()

onMounted(() => {
  if (props.type === 'product' || !props.value?.source) {
    emit('update:value', { ...props.value, source: 'device' })
  }
})

</script>
<style lang="less" scoped></style>