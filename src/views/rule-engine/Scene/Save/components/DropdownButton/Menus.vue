<template>
  <j-menu class='scene-dropdown-menus' @click='click' :selectedKeys='[myValue]'>
    <j-menu-item v-for='item in myOptions' :key='item[valueName]' :value='item.value' :title='item.label'>
      <div>
        <Ellipsis >
          {{ item.label }}
        </Ellipsis>
      </div>
    </j-menu-item>
  </j-menu>
</template>

<script lang='ts' setup name='DropdownMenus'>
import { isArray, isBoolean, isString, isUndefined } from 'lodash-es'
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
    if (isArray(_value)) {
      _value = JSON.stringify(_value)
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
  let _key = ['true', 'false'].includes(e.item?.value) ? handleBoolean(e.item?.value) : e.item?.value
  const findKeyValue = e.key
  const findKey = ['true', 'false'].includes(findKeyValue) ? handleBoolean(findKeyValue) : findKeyValue
  const option = getOption(myOptions.value, findKey, props.valueName)
  myValue.value = findKeyValue
  emit('update:value', _key)
  emit('click', _key, {
    key: _key,
    ...option
  })
}

watch(() => props.value, () => {
  if (isBoolean(props.value)) {
    myValue.value = isBoolean(props.value)
  } else if (isArray(props.value)) {
    myValue.value = JSON.stringify(props.value)
  } else {
    myValue.value = props.value
  }
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