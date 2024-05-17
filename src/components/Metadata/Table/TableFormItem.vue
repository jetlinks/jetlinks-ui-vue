<template>
  <a-tooltip
    :visible="errorMap.visible"
    color="#ffffff"
  >
    <template #title>
      <span style="color: #1d2129">{{errorMap.message}}</span>
    </template>
    <slot />
  </a-tooltip>
</template>

<script setup name="TableFormItem">

import {randomString} from "@/utils/utils";
import {useInjectForm} from "./context";
import {get, isArray, debounce} from 'lodash-es'

const props = defineProps({
  name: {
    type: [String, Array],
    default: undefined
  },
  rules: {
    type: Array,
    default: []
  }
})

const eventKey = `table-form-${randomString(4)}`

const context = useInjectForm()

const errorMap = reactive({
  message: '',
  visible: false
})

const filedName = computed(() => {
  const names = isArray(props.name) ? props.name : [props.name]
  const _rules = context.rules.value
  let tempKey = undefined

  for (const key of names) {
    if (key in _rules) {
      tempKey = key
    }
  }

  return tempKey
})

const filedValue = computed(() => {
  return get(context.dataSource.value, props.name)
})

const validateRules = debounce(() => {
  const promise = context.validateItem({ [filedName.value]: filedValue.value })
  promise.then(res => {
    const error = res?.filter(item => item.field === filedName.value) || []

    errorMap.message = error[0]?.message || errorMap.message
    errorMap.visible = !!error.length
  })

  return promise
}, 100)

watch(() => filedValue.value ,() => {
  validateRules()
})

watch(() => filedName.value, () => {
  context.addField(eventKey, {
    filedName,
    validateRules
  })
}, { immediate: true })

</script>

<style scoped>

</style>
