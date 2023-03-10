<template>
  <j-dropdown
    class='scene-select-value'
    trigger='click'
    v-model:visible='visible'
    @visibleChange='visibleChange'
  >
    <div>
      <slot :label='label'>
        <div class='dropdown-button value' @click.prevent='visible = true'>
            <AIcon v-if='!!icon' :type='icon' />
            {{ label }}
        </div>
      </slot>
    </div>
    <template #overlay>
      <div class='scene-select-content'>
        <j-tabs
          @change='tabsChange'
          v-model:activeKey='mySource'
        >
          <j-tab-pane v-for='item in tabsOptions' :tab='item.label' :key='item.key'>
            <div class='select-box-content'>
              <DropdownTimePicker
                v-if='["time","date"].includes(item.component)'
                :type='item.component'
                v-model:value='myValue'
                @change='timeChange'
              />
              <DropdownMenus
                v-if='["select","enum", "boolean"].includes(item.component)'
                :options='["metric", "upper"].includes(item.key) ?  metricOption : options'
                @change='onSelect'
              />
              <div
                v-else-if='item.component === "tree"'
                style='min-width: 400px'
              >
                <j-tree
                  :selectedKeys='myValue ? [myValue] : []'
                  :treeData='item.key === "upper" ?  metricOption : options'
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
              <ValueItem
                v-else
                v-model:modelValue='myValue'
                :itemType='getComponent(item.component)'
                :options='item.key === "upper" ?  metricOption : options'
                @change='valueItemChange'
              />
            </div>
          </j-tab-pane>
        </j-tabs>
      </div>
    </template>
  </j-dropdown>
</template>

<script lang='ts' setup name='ParamsDropdown'>
import ValueItem from '@/components/ValueItem/index.vue'
import type { ValueType } from './typings'
import { defaultSetting } from './typings'
import { DropdownMenus, DropdownTimePicker} from '../DropdownButton'
import { getComponent, getOption } from '../DropdownButton/util'

const valueItemKey = ['int', 'int','long','float','double','string', 'password']

type Emit = {
  (e: 'update:value', data: ValueType): void
  (e: 'update:source', data: string): void
  (e: 'select', data: any): void
  (e: 'tabChange', data: any): void
}

const props = defineProps({
  ...defaultSetting
})

const emit = defineEmits<Emit>()

const myValue = ref<ValueType>(props.value)
const mySource = ref<string>(props.source)
const label = ref<any>(props.placeholder)
const visible = ref(false)

nextTick(() => {
  mySource.value = props.source
  myValue.value = props.value
})

const tabsChange = (e: string) => {
  mySource.value = e
  myValue.value = undefined
}

const updateValue = () => {
  emit('update:source', mySource.value)
  emit('update:value', myValue.value)
}

const treeSelect = (e: any) => {
  visible.value = false
  label.value = e.fullname || e.name
  emit('update:value', e[props.valueName])
  emit('select', e)
}

const valueItemChange = (e: string) => {
  console.log('valueItemSelect', e)
  label.value = e
  emit('update:value', e)
  emit('select', e)
}

const sonSelect = (e: string, option: any) => {
  visible.value = false
  label.value = option.label
  emit('update:value', e)
  emit('select', e)
}

const timeChange = (e: any) => {
  label.value = e
  visible.value = false
  emit('update:value', e)
  emit('select', e)
}

const visibleChange = (v: boolean) => {
  visible.value = v
}

watchEffect(() => {
  const option = getOption(props.options, props.value as string, props.valueName) // 回显label值
  myValue.value = props.value
  mySource.value = props.source
  if (option) {
    label.value = option[props.labelName] || option.name
  } else {
    label.value = props.value || props.placeholder
  }
})

</script>

<style scoped lang='less'>
@import '../DropdownButton/index.less';
.manual-time-picker {
  position: absolute;
  top: -2px;
  left: 0;
  border: none;
  visibility: hidden;
  :deep(.ant-picker-input) {
    display: none;
  }
}
</style>