<template>
  <j-dropdown class='scene-select' trigger='click'>
    <div :class='dropdownButtonClass'>
      <span :style='LabelStyle'>
        {{ label }}
      </span>
    </div>
    <template #overlay>
      <template v-if='options.length'>
        <j-menu v-if='component === "select"' @click='menuSelect'>
          <j-menu-item v-for='item in options' :key='item.value'>{{ item.label }}</j-menu-item>
        </j-menu>
        <j-tree
          :selectedKeys='selectValue ? [selectValue] : []'
          :treeData='options'
          @select='treeSelect'
        />
      </template>
      <div class='scene-select-empty' v-else>
        <j-empty />
      </div>
    </template>
  </j-dropdown>
</template>

<script lang='ts' setup name='DropdownButton'>
import type { PropType } from 'vue'

type LabelType = string | number | undefined

type DropdownButtonOptions = {
  label: string;
  value: string;
  children?: DropdownButtonOptions[];
  [key: string]: any;
};

type Emit = {
  (e: 'update:value', data: string | number): void
  (e: 'select', data: DropdownButtonOptions | undefined ): void
}

const props = defineProps({
  placeholder: {
    type: String,
    default: undefined
  },
  value: {
    type: [String, Number],
    default: undefined
  },
  options: {
    type: Array as PropType<Array<DropdownButtonOptions>>,
    default: () => []
  },
  type: {
    type: String,
    default: 'column' // 'column' | 'termType' | 'value' | 'type'
  },
  component: {
    type: String,
    default: 'select' // 'select' | 'treeSelect'
  }
})

const emit = defineEmits<Emit>()

const label = ref<LabelType>(props.placeholder)
const selectValue = ref(props.value)
const flatMapTree = new Map()

const LabelStyle = computed(() => {
  return {
    color: selectValue.value ? '#' : '#'
  }
})

const dropdownButtonClass = computed(() => ({
  'dropdown-button': true,
  'column': props.type === 'column',
  'termType': props.type === 'termType',
  'value': props.type === 'value',
  'type': props.type === 'type',
}))

const getOption = (key?: string | number): DropdownButtonOptions | undefined => {
  let option
  for(let i = props.options.length - 1; i >= 0; i --) {
    const cacheOption = props.options[i]
    if (cacheOption.value === key) {
      option = {
        ...cacheOption
      }
      break
    }
  }
  return option
}

const treeSelect = () => {

}

const menuSelect = (v: any) => {
  const option = getOption(props.value)
  emit('update:value', v.key)
  emit('select', option)
}

watch([props.options, props.value], () => {
  const option = getOption(props.value)
  console.log(props.value)
  if (option) {
    label.value = option.label
  } else {
    label.value = props.value || props.placeholder
  }
}, { immediate: true })

</script>

<style scoped lang='less'>
.dropdown-button {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
}

.column {
  color: #00a4fe;
  background-color: rgba(154, 219, 255, 0.3);
  border-color: rgba(0, 164, 254, 0.3);
}

.termType {
  color: #2f54eb;
  background-color: rgba(163, 202, 255, 0.3);
  border-color: rgba(47, 84, 235, 0.3);
}

.value {
  color: #692ca7;
  background-color: rgba(188, 125, 238, 0.1);
  border-color: rgba(188, 125, 238, 0.5);
}

.type {
  padding: 5px 10px;
}
</style>