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
        @change='(v) => valueChange(v)'
      />
      <a-select
        v-else-if='component === componentType.select'
        v-model:value='termsModel.value'
        :options='options'
        @change='(v) => valueChange(v)'
      />
      <a-inputnumber
        v-else-if='component === componentType.inputNumber'
        v-model:value='termsModel.value'
        @change='(v) => valueChange(v)'
      />
      <a-input-password
        v-else-if='component === componentType.password'
        v-model:value='termsModel.value'
        @change='(v) => valueChange(v)'
      />
      <a-switch
        v-else-if='component === componentType.switch'
        v-model:checked='termsModel.value'
        @change='(v) => valueChange(v)'
      />
      <a-radio-group
        v-else-if='component === componentType.radio'
        v-model:value='termsModel.value'
        @change='(v) => valueChange(v)'
      />
      <a-checkbox-group
        v-else-if='component === componentType.checkbox'
        v-model:value='termsModel.value'
        :options='options'
        @change='(v) => valueChange(v)'
      />
      <a-time-picker
        v-else-if='component === componentType.time'
        v-model:value='termsModel.value'
        @change='(v) => valueChange(v)'
      />
      <a-date-picker
        v-else-if='component === componentType.date'
        v-model:value='termsModel.value'
        @change='(v) => valueChange(v)'
      />
      <a-tree-select
        v-else-if='component === componentType.tree'
        v-model:value='termsModel.value'
        :tree-data='options'
        @change='(v) => valueChange(v)'
      />
    </div>
  </div>
</template>

<script setup lang='ts' name='SearchItem'>
import { componentType } from 'components/Form'
import { typeOptions, termType } from './util'
import { PropType } from 'vue'
import type { SearchItemProps, SearchItemData } from './types'
import { cloneDeep } from 'lodash-es'

type ItemDataProps = Omit<SearchItemData, 'title'>

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

const options = ref([])

const columnOptions = ref<({ label: string, value: string})[]>([])
const columnOptionMap = new Map()

const termTypeOptions = reactive(termType)

const getTermType = (type: string) => {
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
  termsModel.termType = _itemColumn.defaultTermType || getTermType(_itemColumn.type as string)

  columnOptions.value = props.columns.map(item => {
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