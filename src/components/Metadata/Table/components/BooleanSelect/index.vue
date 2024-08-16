<template>
  <j-select
    v-model:value="myValue"
    style="width: 100%;"
    :options="options"
    :getPopupContainer="(node) => tableWrapperRef || node"
    @change="change"
  >

  </j-select>
</template>

<script setup name="BooleanSelect">
import {useTableWrapper} from "@/components/Metadata/Table/context";
import {isBoolean} from "lodash-es";
import { selectProps } from 'ant-design-vue/lib/select'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  ...selectProps(),
  value: {
    type: [Boolean, Number, String],
    default: true
  },
  trueLabel: {
    type: String,
  },
  falseLabel: {
    type: String,
  },
  trueValue: {
    type: [Boolean, Number, String],
    default: true,
  },
  falseValue: {
    type: [Boolean, Number, String],
    default: false
  }
})

const emit = defineEmits(['update:value', 'change'])
const tableWrapperRef = useTableWrapper()

const myValue = ref()

const options = computed(() => {

  const _trueValue = isBoolean(props.trueValue) ? String(props.trueValue) : props.trueValue
  const _falseValue = isBoolean(props.falseValue) ? String(props.falseValue) : props.falseValue
  return [
    {
      label: props.trueLabel||$t('BooleanSelect.index.43486105-0'),
      value: _trueValue,
      baseValue: props.trueValue
    },
    {
      label: props.falseLabel||$t('BooleanSelect.index.43486105-1'),
      value: _falseValue,
      baseValue: props.falseValue
    }
    ]
})
const change = (e) => {
  const item = options.value.find(item => item.value === myValue.value)
  emit('update:value', item.baseValue)
  emit('change', item.baseValue)
}

watch(() => [props.value, options.value], () => {
  const item = options.value.find(item => item.baseValue === props.value)
  myValue.value = item ? item.value : options.value[0].value

}, { immediate: true })

</script>

<style scoped>

</style>
