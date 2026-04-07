<script setup name="Terms">
import ColumnSelect from './ColumnSelect.vue'
import TermTypeSelect from './TermTypeSelect.vue'
import ValueItem from './Value/index.vue'
import { useTermsValueContext, useTermsParse, useValueOptionsContext, useTermsEventContext } from './hooks'
import { doubleParamsKey, nullKeys } from './utils'
import { ValueProps } from './Value/utils'
import { omit } from 'lodash-es'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const emit = defineEmits(['change', 'update:value'])
const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  ...ValueProps()
})

const termsParse = useTermsParse()
const typeOptions = [
  { label: $t('ListItem.FilterCondition.9667711-7'), value: 'fixed', fieldName: 'fixed' },
  { label: $t('ListItem.FilterCondition.9667711-8'), value: 'upper', fieldName: 'upper' }
]

const options = computed(() => {
  const names = props.typeOptionsNames
  const keys = Object.keys(names)
  if (keys.length === 0) {
    return typeOptions
  }
  return typeOptions.map(item => {
    const newNode = {
      ...item
    }
    if (names[newNode.fieldName]) {
      newNode.value = names[newNode.fieldName]
    }
    return newNode
  })
})

const termsData = ref({
  column: undefined,
  termType: undefined,
  type: 'and',
  value: props.showValueType ? {
    source: 'fixed',
    value: undefined
  } : undefined
})

const valueParse = ref({
  options: [],
  map: new Map()
})

const columnDetail = computed(() => {
  const map = unref(termsParse.map)
  const detail = termsData.value.column ? map.get(termsData.value.column) : {}
  cleanValueParse()

  if (detail && detail.dataType === 'boolean' && !('others' in detail) ) {
    let map = new Map()
    valueParse.value.options = [
      { label: 'true', value: true, key: 'true' },
      { label: 'false', value: false, key: 'false' },
    ]
    map.set(true, valueParse.value.options[0])
    map.set(false, valueParse.value.options[1])
    valueParse.value.map = map
  } else if (detail?.others) {
    const others = detail.others
    let options = []
    let map = new Map()
    if ('bool' in others) {
      const bool = others.bool
      options = [
        { label: bool.trueText, value: bool.trueValue },
        { label: bool.falseText, value: bool.falseValue },
      ]
      map.set(options[0].value, options[0])
      map.set(options[1].value, options[1])
    } else if ('elements' in others) {
      const elements = others.elements
      options = elements.map(item => {
        const result = {
          label: item.text,
          value: item.value,
        }
        map.set(result.value, result)
        return result
      })
    }
    valueParse.value.options = options;
    valueParse.value.map = map
  }

  return detail
})

const showValue = computed(() => {
  return nullKeys.includes(termsData.value.termType)
})

const showDouble = computed(() => {
  return doubleParamsKey.includes(termsData.value.termType)
})

const cleanValueParse = () => {
  valueParse.value.options = []
  valueParse.value.map = new Map()
}

const onChange = () => {
  emit('change', unref(valueParse.value))
  emit('update:value', unref(valueParse.value))
}

const updateValue = (e) => {
  if (props.showValueType) {
    termsData.value.value.value = e
  } else {
    termsData.value.value = e
  }
}

const getValue = () => {
  return termsData.value.value
}

useTermsValueContext(termsData)
useValueOptionsContext(valueParse)
useTermsEventContext({
  onChange,
  updateValue,
  getValue
})

watch(() => props.value, (newValue) => {
  if (newValue) {
    termsData.value = newValue
  }
}, { immediate: true, deep: true})

</script>

<template>
  <a-space :size="4">
    <ColumnSelect :options="termsParse.options.value" :valueOptions="options" />
    <TermTypeSelect />
    <template v-if="!showValue">
      <ValueItem
        :columnDetail="columnDetail"
        :options="options"
        v-bind="omit(props, ['value'])"
      />
      <ValueItem
        v-if="showDouble"
        :columnDetail="columnDetail"
        :options="options"
        v-bind="omit(props, ['value'])"
        :index="1"
      />
    </template>
  </a-space>
</template>

<style scoped lang="less">

</style>
