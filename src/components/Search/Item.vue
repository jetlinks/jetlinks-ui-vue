<template>
  <div class='JSearch-item'>
    <div class='JSearch-item--type' v-if='expand'>
      <a-select
        v-if='index !== 1 && index !== 4'
        :options='typeOptions'
        v-model:value='termsModel.type'
        style='width: 100%;'
      />
      <span v-else>
        {{
          index === 1 ? '第一组' : '第二组'
        }}
      </span>
    </div>
    <a-select
      class='JSearch-item--column'
      :options='columnOptions'
      v-model:value='termsModel.column'
    />
    <a-select
      class='JSearch-item--termType'
      :options='termTypeOptions'
      v-model:value='termsModel.termType'
    />
    <div class='JSearch-item--value'>
      <a-input
        v-if='component === componentType.input'
        v-model:value='termsModel.value'
        style='width: 100%'
        @change='(v) => valueChange(v)'
      />
      <a-select
        v-else-if='component === componentType.select'
        v-model:value='termsModel.value'
        :options='options'
        style='width: 100%'
        @change='(v) => valueChange(v)'
      />
      <a-input-number
        v-else-if='component === componentType.inputNumber'
        v-model:value='termsModel.value'
        style='width: 100%'
        @change='(v) => valueChange(v)'
      />
      <a-input-password
        v-else-if='component === componentType.password'
        v-model:value='termsModel.value'
        style='width: 100%'
        @change='(v) => valueChange(v)'
      />
      <a-switch
        v-else-if='component === componentType.switch'
        v-model:checked='termsModel.value'
        style='width: 100%'
        @change='(v) => valueChange(v)'
      />
      <a-radio-group
        v-else-if='component === componentType.radio'
        v-model:value='termsModel.value'
        style='width: 100%'
        @change='(v) => valueChange(v)'
      />
      <a-checkbox-group
        v-else-if='component === componentType.checkbox'
        v-model:value='termsModel.value'
        :options='options'
        style='width: 100%'
        @change='(v) => valueChange(v)'
      />
      <a-time-picker
        v-else-if='component === componentType.time'
        v-model:value='termsModel.value'
        style='width: 100%'
        @change='(v) => valueChange(v)'
      />
      <a-date-picker
        v-else-if='component === componentType.date'
        v-model:value='termsModel.value'
        style='width: 100%'
        @change='(v) => valueChange(v)'
      />
      <a-tree-select
        v-else-if='component === componentType.treeSelect'
        v-model:value='termsModel.value'
        :tree-data='options'
        style='width: 100%'
        @change='(v) => valueChange(v)'
      />
    </div>
  </div>
</template>

<script setup lang='ts' name='SearchItem'>
import { componentType } from 'components/Form'
import { typeOptions, termType } from './util'
import { PropType } from 'vue'
import type { SearchItemProps, SearchItemData, SearchProps } from './types'
import { cloneDeep, isArray, isFunction } from 'lodash-es'

type ItemDataProps = Omit<SearchItemData, 'title'>

type ItemType = SearchProps['type']

interface Emit {
  (e: 'change', data: ItemDataProps): void
}

const props = defineProps({
  columns: {
    type: Array as PropType<SearchItemProps[]>,
    default: () => [],
    required: true
  },
  index: {
    type: Number,
    default: 1
  },
  expand: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<Emit>()

const termsModel = reactive<ItemDataProps>({
  type: 'or',
  value: '',
  termType: 'eq',
  column: ''
})

const component = ref(componentType.input)

const options = ref<any[]>([])

const columnOptions = ref<({ label: string, value: string})[]>([])
const columnOptionMap = new Map()

const termTypeOptions = reactive(termType)

const getTermType = (type?: ItemType) => {
  switch (type) {
    case 'select':
    case 'treeSelect':
      return 'eq'
    case 'date':
    case 'time':
      return 'gt'
    default:
        return 'like'
  }
}

const getComponent = (type?: ItemType) => {
  switch (type) {
    case 'select':
      component.value = componentType.select
      break;
    case 'treeSelect':
      component.value = componentType.treeSelect
      break;
    case 'date':
      component.value = componentType.date
      break;
    case 'time':
      component.value = componentType.time
      break;
    case 'number':
      component.value = componentType.inputNumber
      break;
    default:
      component.value = componentType.input
      break;
  }
}

const handleItemOptions = (option?: any[] | Function) => {
  options.value = []
  if (isArray(option)) {
    options.value = option
  } else if (isFunction(option)) {
    option().then((res: any[]) => {
      options.value = res
    })
  }
}

const handleItem = () => {
  columnOptionMap.clear()
  columnOptions.value = []
  if (!props.columns.length) return

  // 获取第一个值
  const sortColumn = cloneDeep(props.columns)
  sortColumn?.sort((a, b) => a.sortIndex! - b.sortIndex!)

  const _index = props.index > sortColumn.length ? sortColumn.length - 1 : props.index
  const _itemColumn = sortColumn[_index - 1]

  termsModel.column = _itemColumn.column
  termsModel.termType = _itemColumn.defaultTermType || getTermType(_itemColumn.type)

  getComponent(_itemColumn.type) // 处理Item的组件类型

  // 处理options 以及 request
  if ('options' in _itemColumn) {
    handleItemOptions(_itemColumn.options)
  }

  columnOptions.value = props.columns.map(item => { // 对columns进行Map处理以及值处理
    columnOptionMap.set(item.column, item)
    return {
      label: item.title,
      value: item.column
    }
  })
}

const valueChange = (value: any) => {
  emit('change', {
    type: termsModel.type,
    value: termsModel.value,
    termType: termsModel.termType,
    column: termsModel.column,
  })
}

handleItem()

</script>

<style scoped lang='less'>
.JSearch-item {
  display: flex;
  gap: 16px;

  .JSearch-item--type {
    min-width: 80px;
    > span {
      line-height: 34px;
      font-weight: bold;
    }
  }

  .JSearch-item--column {
    min-width: 100px;
  }

  .JSearch-item--termType {
    min-width: 100px;
  }

  .JSearch-item--value {
    flex: 1 1 auto;
  }
}
</style>