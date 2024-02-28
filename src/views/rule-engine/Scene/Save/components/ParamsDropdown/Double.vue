<template>
  <ParamsDropdown
    v-for="(i,index) in myValue"
    v-model:value='myValue[index]'
    v-model:source='mySource'
    :valueName='valueName'
    :labelName='labelName'
    :options='options'
    :icon='icon'
    :placeholder='placeholder'
    :tabs-options='tabsOptions'
    :metricOptions='metricOptions'
    @select='(v, l) => onSelect(v, l, index)'
    @tabChange='tabChange'
  />
  <!-- <ParamsDropdown
    v-model:value='myValue[1]'
    v-model:source='mySource'
    :valueName='valueName'
    :labelName='labelName'
    :icon='icon'
    :placeholder='placeholder'
    :tabs-options='tabsOptions'
    :metricOptions='metricOptions'
    :options='options'
    @select='(v, l) => onSelect(v, l,1)'
    @tabChange='tabChange'
  /> -->
  <j-button @click="addDropdown" v-if="['contains_all', 'contains_any', 'not_contains'].includes(props.termType)" class="operation">+</j-button>
  <j-button @click="deleteDropdown" v-if="['contains_all', 'contains_any', 'not_contains'].includes(props.termType) && myValue?.length > 2" class="operation">-</j-button>
</template>

<script lang='ts' setup name='DoubleParamsDropdown'>
import ParamsDropdown from './index.vue'
import { defaultSetting, ValueType } from './typings'

type Emit = {
  (e: 'update:value', data: ValueType): void
  (e: 'update:source', data: string): void
  (e: 'select', data: any, label?: string, labelObj?: Record<number, any>): void
}

const props = defineProps({
  ...defaultSetting,
  termType:{
    type: String,
  }
})

const label: Record<number, any> = {
  0: undefined,
  1: undefined
}

const emit = defineEmits<Emit>()

const myValue = ref<ValueType>(props.value || [undefined, undefined] as any)
const mySource = ref<string>(props.source)

const onSelect = (v: any, _label: string, index: number) => {
  emit('update:value', myValue.value)
  label[index] = _label
  emit('select', myValue.value, _label, label)
}

const addDropdown = () =>{
  myValue.value.push(undefined)
}
const deleteDropdown = () =>{
  myValue.value.pop()
}

const tabChange = (e: string) => {
  emit('update:source', e)
}

watch(() => props.value, () => {
  myValue.value = props.value
})
</script>

<style scoped>

</style>