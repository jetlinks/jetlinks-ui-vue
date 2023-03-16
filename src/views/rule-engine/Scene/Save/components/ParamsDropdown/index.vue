<template>
  <j-dropdown
    class='scene-select-value'
    trigger='click'
    v-model:visible='visible'
    @visibleChange='visibleChange'
  >
    <div @click.prevent='visible = true'>
      <slot :label='label'>
        <div class='dropdown-button value'>
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
                type='time'
                v-model:value='myValue'
                @change='timeChange'
              />
              <template
                v-else-if='["select","enum", "boolean"].includes(item.component)'
              >
                <DropdownMenus
                  v-if='(["metric", "upper"].includes(item.key) ?  metricOptions : options).length'
                  :options='["metric", "upper"].includes(item.key) ?  metricOptions : options'
                  @click='onSelect'
                />
                <div class='scene-select-empty' v-else>
                  <j-empty />
                </div>
              </template>
              <template v-else-if='item.component === "tree"'>
                <div style='min-width: 400px' v-if='(item.key === "upper" ?  metricOptions : options).length'>
                  <j-tree
                    :selectedKeys='myValue ? [myValue] : []'
                    :treeData='item.key === "upper" ?  metricOptions : options'
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
                <div class='scene-select-empty' v-else>
                  <j-empty />
                </div>
              </template>

              <ValueItem
                v-else
                v-model:modelValue='myValue'
                :itemType='item.component'
                :options='item.key === "upper" ?  metricOptions : options'
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
import { getOption } from '../DropdownButton/util'

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
  emit('update:source', mySource.value)
  emit('update:value', undefined)
  emit('select', {})
}

const treeSelect = (v: any, option: any) => {
  const node = option.node
  visible.value = false
  label.value = node.fullname || node.name
  emit('update:value', node[props.valueName])
  emit('select', node)
}

const valueItemChange = (e: string) => {
  label.value = e
  emit('update:value', e)
  emit('select', e)
}

const onSelect = (e: string, option: any) => {
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
  const _options = props.source === 'upper' ? props.metricOptions : props.options
  const option = getOption(_options, props.value as string, props.valueName) // 回显label值
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