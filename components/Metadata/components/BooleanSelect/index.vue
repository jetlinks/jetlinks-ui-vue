<template>
  <a-select
    v-bind="props"
    v-model:value="myValue"
    style="width: 100%;"
    :options="options"
    :getPopupContainer="(node) => tableWrapperRef || node"
    @change="change"
  >

  </a-select>
</template>

<script setup name="BooleanSelect">
import {useTableWrapper} from "../../context";
import {isBoolean} from "lodash-es";
import { selectProps } from 'ant-design-vue/lib/select'
import i18n from "@jetlinks-web-core/locales";

const props = defineProps({
  ...selectProps(),
  value: {
    type: [Boolean, Number, String],
    default: true
  },
  trueLabel: {
    type: String,
    default: i18n.global.t('Function.InputParams.551013-0'),
  },
  falseLabel: {
    type: String,
    default: i18n.global.t('Function.InputParams.551013-1'),
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
      label: props.trueLabel,
      value: _trueValue,
      baseValue: props.trueValue
    },
    {
      label: props.falseLabel,
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
