<template>
  <component
      :is="getComponentItem(itemType, components)"
      v-bind="omit(componentProps, 'options')"
      :options="options"
      v-model:value="formData"
      :disabled="getDisabled(oldData, data)"
  />
</template>

<script setup>
import {getComponentItem} from './setting'
import {isFunction, omit} from "lodash-es";

const props = defineProps({
  itemType: { //  组件类型
    type: String,
    default: () => 'input',
  },
  componentProps: {
    type: Object,
    default: () => ({})
  },
  components: {
    type: Object
  },
  data: {
    type: Object,
    default: () => ({})
  },
  oldData: {
    type: Object,
    default: () => ({})
  },
  name: {
    type: [String, Array],
  },
  getDisabled: {
    type: Function,
    default: () => false
  }
})
const emits = defineEmits(['update:value'])
const options = ref([])

const formData = computed({
  get: () => {
    if (typeof props.name === 'string') {
      return props.data[props.name]
    }
    return props.name.reduce((obj, key) => obj?.[key], props.data)
  },
  set: (newValue) => {
    if (typeof props.name === 'string') {
      props.data[props.name] = newValue
      return
    }

    // 数组路径深层赋值
    const lastIndex = props.name.length - 1
    const nestedObj = props.name.slice(0, lastIndex).reduce((obj, key) => {
      if (!obj[key]) obj[key] = {} // 自动创建中间对象
      return obj[key]
    }, props.data)

    nestedObj[props.name[lastIndex]] = newValue
  }
})

const oldValue = computed(() => {
  if (typeof props.name === 'string') {
    return props.oldData[props.name]
  }
  return props.name.reduce((obj, key) => obj?.[key], props.oldData)
})

const handleOptions = async (_options) => {
  if (_options) {
    if (Array.isArray(_options)) {
      options.value = _options
    } else if (isFunction(_options)) {
      options.value = await _options()
    }
  }
}

watch(() => props.componentProps, (val) => {
  handleOptions(val.options)
}, {
  deep: true,
  immediate: true
})
</script>

<style lang="less" scoped>

</style>
