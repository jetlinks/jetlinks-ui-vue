<template>
  <a-tooltip
    color="#ffffff"
    :visible="errorMap.visible"
    :get-popup-container="popContainer"
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
import {useInjectForm} from "./context";
import {get, isArray, throttle } from 'lodash-es'
import {onBeforeUnmount, computed} from "vue";
import {useTableWrapper} from "./utils";
import { useProvideFormItemContext } from 'ant-design-vue/es/form/FormItemContext'

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

const emit = defineEmits(['change'])

const tableWrapperRef = useTableWrapper()
const context = useInjectForm()

let hideTimer

const eventKey = computed(() => {
  const names = isArray(props.name) ? props.name : [props.name]
  return names.join('-')
})

const errorMap = reactive({
  message: '',
  visible: false
})

const filedId = computed(() => {
  const names = isArray(props.name) ? props.name : [props.name]
  return names.join('_')
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

const popContainer = (e) => {
  return e.parentNode
}

const removeTimer = () => {
  if (hideTimer) {
    hideTimer = null
  }
}
const showErrorTip = (msg) => {
  removeTimer()
  errorMap.message = msg
  errorMap.visible = true
}

const hideErrorTip = () => {
  errorMap.visible = false
  removeTimer()
  hideTimer = setTimeout(() => {
    errorMap.message = ''
  }, 300)
}
const validateRules = () => {
  let index = 0
  if (isArray(props.name)) {
    index = props.name[0]
  }
  const promise = context.validateItem({ [filedName.value]: filedValue.value }, index)
  promise.catch(res => {
    const error = res?.filter(item => item.field === filedName.value) || []
    if (error.length === 0) {
      hideErrorTip()
    } else {
      errorMap.message = error[0]?.message || errorMap.message
      errorMap.visible = !!error.length
    }
    return errorMap.message
  })

  return promise
}

const onFieldBlur = () => {
  // validateRules()
}

const onFieldChange = () => {
  validateRules()
  emit('change')
}

useProvideFormItemContext({
  id: filedId,
  onFieldChange,
  onFieldBlur,
}, computed(() => filedValue.value))

onBeforeUnmount(() => {
  context.removeField(eventKey.value)
})

// watch(() => filedValue.value ,() => {
//   console.log('tableFormItem--watch',filedValue.value)
//   validateRules()
// }, { deep: true })

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
