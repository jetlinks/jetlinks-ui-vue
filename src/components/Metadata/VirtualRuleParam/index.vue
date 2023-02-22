<template>
  <a-form-item :name="name.concat(['script'])">
    <f-rule-editor v-model:value="value.script" :id="id" ></f-rule-editor>
  </a-form-item>
</template>
<script setup lang="ts" name="VirtualRuleParam">
import { PropType } from 'vue';
import FRuleEditor from '@/components/FRuleEditor/index.vue'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({
      type: 'script',
    })
  },
  name: {
    type: Array as PropType<string[]>,
    default: () => ([])
  },
  id: String
})

interface Emits {
  (e: 'update:value', data: Record<any, any>): void;
}
const emit = defineEmits<Emits>()

onMounted(() => {
  emit('update:value', {
    ...props.value,
    type: 'script'
  })
})
</script>
<style lang="less" scoped></style>