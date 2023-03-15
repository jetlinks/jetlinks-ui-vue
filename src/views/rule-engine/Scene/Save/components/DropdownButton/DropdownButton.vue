<template>
  <j-dropdown
    class='scene-select'
    trigger='click'
    v-model:visible='visible'
    @visibleChange='visibleChange'
  >
    <div @click.prevent='visible = true'>
      <slot :label='label'>
        <div :class='dropdownButtonClass' >
            <AIcon v-if='!!icon' :type='icon' />
            {{ label }}
        </div>
      </slot>
    </div>
    <template #overlay>
      <div class='scene-select-content'>
        <DropdownTimePicker
          v-if='["date","time"].includes(component)'
          :type='component'
          @change='timeSelect'
        />
        <template v-else-if='options.length'>
          <drop-menus
            v-if='component === "select"'
            :value='selectValue'
            :options='options'
            @click='menuSelect'
          />
          <div style='min-width: 400px' v-else>
            <j-tree
              :selectedKeys='selectValue ? [selectValue] : []'
              :treeData='options'
              @select='treeSelect'
              :height='450'
              :virtual='true'
            >
              <template #title="{ name, description }">
                <j-space>
                  {{ name }}
                  <span v-if='description' class='tree-title-description'>{{ description }}</span>
                </j-space>
              </template>
            </j-tree>
          </div>
        </template>
        <div class='scene-select-empty' v-else>
          <j-empty />
        </div>
      </div>
    </template>
  </j-dropdown>
</template>

<script lang='ts' setup name='DropdownButton'>
import type { PropType } from 'vue'
import DropMenus from './Menus.vue'
import DropdownTimePicker from './Time.vue'
import { getOption } from './util'
import type { DropdownButtonOptions } from './util'

type LabelType = string | number | boolean | undefined

type Emit = {
  (e: 'update:value', data: string | number): void
  (e: 'select', data: DropdownButtonOptions | string | undefined ): void
}

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: undefined
  },
  value: {
    type: [String, Number, Boolean],
    default: undefined
  },
  valueName: {
    type: String,
    default: 'value'
  },
  labelName: {
    type: String,
    default: 'label'
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
  },
})

const emit = defineEmits<Emit>()

const label = ref<LabelType>(props.placeholder)
const selectValue = ref(props.value)
const visible = ref(false)

const visibleChange = (v: boolean) => {
  visible.value = v
}

const dropdownButtonClass = computed(() => ({
  'dropdown-button': true,
  'column': props.type === 'column',
  'termType': props.type === 'termType',
  'value': props.type === 'value',
  'type': props.type === 'type',
}))

const treeSelect = (v: any, option: any) => {
  const node = option.node
  visible.value = false
  label.value = node.fullname || node.name
  selectValue.value = v[0]
  emit('update:value', node[props.valueName])
  emit('select', node)
}

const timeSelect = (v: string) => {
  selectValue.value = v
  visible.value = false
  emit('update:value', v)
  emit('select', v)
}

const menuSelect = (v: string, option: any) => {
  selectValue.value  = v
  visible.value = false
  emit('update:value', v)
  emit('select', option)
}

watchEffect(() => {
  const option = getOption(props.options, props.value, props.valueName)
  selectValue.value = props.value
  if (option) {
    label.value = option[props.labelName] || option.name
  } else {
    label.value = props.value || props.placeholder
  }
})

</script>

<style scoped lang='less'>
@import './index.less';
</style>