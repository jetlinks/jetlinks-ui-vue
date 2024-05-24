<template>
  <a-tooltip
    :visible="errorMap.visible"
    color="#ffffff"
  >
    <template #title>
      <span style="color: #1d2129">{{errorMap.message}}</span>
    </template>
    <div :id="eventKey">
      <slot />
    </div>
  </a-tooltip>
</template>

<script setup name="TableFormItem">

import {randomString} from "@/utils/utils";
import {useInjectForm} from "./context";
import {get, isArray } from 'lodash-es'
import {onBeforeUnmount} from "vue";

const props = defineProps({
  name: {
    type: [String, Array],
    default: undefined
  },
  required: {
    type: Boolean,
    default: false
  }
})

const eventKey = computed(() => {
  return filedName.value + '_' + randomString(12)
})

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
  return get(context.dataSource, props.name)
})

const validateRules = () => {
  let index = 0
  if (isArray(props.name)) {
    index = props.name[0]
  }
  const promise = context.validateItem({ [filedName.value]: filedValue.value }, index)
  promise.catch(res => {
    const error = res?.filter(item => item.field === filedName.value) || []

    errorMap.message = error[0]?.message || errorMap.message
    errorMap.visible = !!error.length
    return errorMap.message
  })

  return promise
}

const showErrorTip = (msg) => {
  errorMap.message = msg
  errorMap.visible = true
}

onBeforeUnmount(() => {
  context.removeField(eventKey.value)
  errorMap.message = ''
  errorMap.visible = false
})

watch(() => filedValue.value ,() => {
  validateRules()
})

watch(() => [filedName.value, props.name], () => {
  context.addField(eventKey.value, {
    filedName: filedName.value,
    eventKey: eventKey.value,
    names: props.name,
    validateRules,
    showErrorTip
  })
}, { immediate: true })

</script>

<style scoped>

</style>
