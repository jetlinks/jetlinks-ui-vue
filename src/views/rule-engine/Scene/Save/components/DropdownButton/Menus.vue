<template>
  <j-menu class='scene-dropdown-menus' @click='click' :selectedKeys='[myValue]'>
    <j-menu-item v-for='item in myOptions' :key='item.value' :title='item.label'>
      {{ item.label }}
    </j-menu-item>
  </j-menu>
</template>

<script lang='ts' setup name='DropdownMenus'>
import { isBoolean } from 'lodash-es'
import { getOption } from '../DropdownButton/util'

type ValueType = string| number | boolean
type Emits = {
  (e: 'update:value', value: ValueType): void
  (e: 'click', data: any): void
}

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: undefined
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits<Emits>()

const myOptions = computed(() => {
  return props.options.map((item: any) => {
    let _label = item.label || item.name
    if (isBoolean(item.value)) {
      _label = item.value === true ? '是' : '否'
    }
    return {
      ...item,
      label: _label,
      value: item.value || item.id,
    }
  })
})

const myValue = ref(props.value)

const click = (e: any) => {
  const option = getOption(myOptions.value, e.key)
  myValue.value = e.key
  emit('update:value', e.key)
  emit('click', {
    key: e.key,
    ...option
  })
}

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