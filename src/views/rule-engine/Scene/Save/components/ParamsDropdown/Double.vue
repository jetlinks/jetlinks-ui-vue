<template>
  <ParamsDropdown
    v-model:value='myValue[0]'
    v-model:source='mySource'
    :options='options'
    :icon='icon'
    :placeholder='placeholder'
    :tabs-options='tabsOptions'
    @select='onSelect'
  />
  <ParamsDropdown
    v-model:value='myValue[1]'
    v-model:source='mySource'
    :icon='icon'
    :placeholder='placeholder'
    :tabs-options='tabsOptions'
    :options='options'
    @select='onSelect'
  />
</template>

<script lang='ts' setup name='DoubleParamsDropdown'>
import ParamsDropdown from './index.vue'
import { defaultSetting, ValueType } from './typings'

type Emit = {
  (e: 'update:value', data: ValueType): void
  (e: 'update:source', data: string): void
  (e: 'select', data: any): void
}

const props = defineProps({
  ...defaultSetting
})

const emit = defineEmits<Emit>()

const myValue = ref<ValueType>(props.value)
const mySource = ref<string>(props.source)

const onSelect = () => {

}

</script>

<style scoped>

</style>