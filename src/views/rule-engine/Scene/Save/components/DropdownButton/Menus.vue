<template>
  <j-menu class='scene-dropdown-menus' @click='click' :selectedKeys='[myValue]'>
    <j-menu-item v-for='item in myOptions' :key='item.value' :title='item.label'>
      <Ellipsis >
        {{ item.label }}
      </Ellipsis>
    </j-menu-item>
  </j-menu>
</template>

<script lang='ts' setup name='DropdownMenus'>
import { isBoolean, isUndefined } from 'lodash-es'
import { getOption } from '../DropdownButton/util'

type ValueType = string| number | boolean
type Emits = {
  (e: 'update:value', value: ValueType): void
  (e: 'click', value: string, data: any): void
}

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: undefined
  },
  options: {
    type: Array,
    default: () => []
  },
  valueName: {
    type: String,
    default: 'value'
  }
})

const emit = defineEmits<Emits>()

const myOptions = computed(() => {
  return props.options.map((item: any) => {
    let _label = item.label || item.name
    let _value = isUndefined(item.value) ? item.id : item.value
    if (isBoolean(_value)) {
      _label = _value === true ? '是' : '否'
      _value = String(_value)
    }
    return {
      ...item,
      label: _label,
      value: _value
    }
  })
})

const myValue = ref(props.value)

const handleBoolean = (key: string) => {
  return key === 'false' ? false : true
}

const click = (e: any) => {
  const _key = ['true', 'false'].includes(e.key) ? handleBoolean(e.key) : e.key
  const option = getOption(myOptions.value, _key, props.valueName)
  myValue.value = _key
  emit('update:value', _key)
  emit('click', _key, {
    key: _key,
    ...option
  })
}

watch(() => props.value, () => {
  myValue.value = props.value
}, { immediate: true})
</script>

<style scoped lang='less'>
.scene-dropdown-menus {
  border: 0px;

  :deep(.ant-menu-item){
    height: 32px;
    line-height: 32px;
    padding: 0 4px;
    margin: 0;

    &:hover {
      background-color: @item-hover-bg;
      color: @text-color;
    }

    &.ant-menu-item-selected {
      background-color: @primary-1;
      color: @text-color;
    }
  }
}
</style>