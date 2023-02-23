<template>
  <Editor key="simple" @change="change" v-model:value="_value" :id="id" />
  {{ ruleEditorStore.state.model }}
  <Advance v-if="ruleEditorStore.state.model === 'advance'" :model="ruleEditorStore.state.model"
    :virtualRule="virtualRule" :id="id" @change="change" />
</template>
<script setup lang="ts" name="FRuleEditor">
import { useRuleEditorStore } from '@/store/ruleEditor'
import Editor from './Editor/index.vue'
import Advance from './Advance/index.vue'

interface Props {
  value: string;
  property?: string;
  virtualRule?: any;
  id?: string;
}

const props = defineProps<Props>()

interface Emits {
  (e: 'update:value', data: string): void;
}

const emit = defineEmits<Emits>()

const _value = computed({
  get: () => props.value,
  set: (val: string) => {
    emit('update:value', val)
  }
})

const ruleEditorStore = useRuleEditorStore()

const change = (v: string) => {
  ruleEditorStore.set('model', v);
}

onMounted(() => {
  ruleEditorStore.set('property', props.property)
  ruleEditorStore.set('code', props.value);
})
</script>
<style lang="less" scoped></style>