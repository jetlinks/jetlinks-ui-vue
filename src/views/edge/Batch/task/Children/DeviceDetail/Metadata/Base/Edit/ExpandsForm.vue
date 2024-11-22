<template>
  <j-form-item label="来源" :name="name.concat(['source'])" v-if="type === 'product'" :rules="[
    { required: true, message: '请选择来源' },
  ]">
    <j-select v-model:value="_value.source" :options="PropertySource" size="small"
      :disabled="metadataStore.model.action === 'edit'" @change="changeSource"></j-select>
  </j-form-item>
  <virtual-rule-param v-if="type === 'product' && _value.source === 'rule'" v-model:value="_value.virtualRule"
    :name="name.concat(['virtualRule'])" :id="id" :showWindow="_value.source === 'rule'"></virtual-rule-param>
  <j-form-item label="读写类型" :name="name.concat(['type'])" :rules="[
    { required: true, message: '请选择读写类型' },
  ]">
    <j-select v-model:value="_value.type" :options="ExpandsTypeList" mode="multiple" size="small" :disabled="['manual', 'rule'].includes(_value.source)"></j-select>
  </j-form-item>
  <j-form-item label="其它配置" v-if="config.length > 0">
    <j-form-item v-for="(item, index) in config" :key="index">
      <config-param v-model:value="_value" :config="item" :name="name"></config-param>
    </j-form-item>
  </j-form-item>
  <j-form-item
    v-if="type === 'product' && ['int', 'float', 'double', 'long', 'date', 'string', 'boolean'].includes(valueType.type)"
    :name="name.concat(['metrics'])" :rules="[
      { validator: () => validateMetrics(_value.metrics), message: '请输入指标配置' }
    ]">
    <template #label>
      <j-space>
        指标配置
        <j-tooltip title="场景联动页面可引用指标配置作为触发条件">
              <AIcon type="QuestionCircleOutlined" style="color: rgb(136, 136, 136); font-size: 12px;"/>
            </j-tooltip>
      </j-space>
    </template>
    <metrics-param v-model:value="_value.metrics" :type="valueType.type" :enum="valueType"
      :name="name.concat(['metrics'])"></metrics-param>
  </j-form-item>
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
    emit('update:value', { source: 'device', ...props.value })
  }
})

const validateMetrics = (value: Record<any, any>[]) => {
  const flag = value.every((item) => {
    return item.id && item.name && item.value;
  });
  if (!flag) {
    return Promise.reject(new Error('请输入指标配置'));
  }
  return Promise.resolve();
}

const changeSource = (val: string) => {
  if (val === 'manual') {
    _value.value.type = ['write']
  } else if (val === 'rule') {
    _value.value.type = ['report']
  } else {
    _value.value.type = []
  }
}

</script>
<style lang="less" scoped></style>