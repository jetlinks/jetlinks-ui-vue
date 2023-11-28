<template>
  <div class='terms-params-item'>
    <div v-if='!isFirst' class='term-type-warp'>
      <DropdownButton
        :options='[
            { label: "并且", value: "and" },
            { label: "或者", value: "or" },
          ]'
        type='type'
        v-model:value='paramsValue.type'
        @select='typeChange'
      />
    </div>
    <div
      class='params-item_button'
      @mouseover='mouseover'
      @mouseout='mouseout'
    >
      <DropdownButton
        :options='columnOptions'
        icon='icon-zhihangdongzuoxie-1'
        type='column'
        value-name='id'
        label-name='fullName'
        placeholder='请选择参数'
        v-model:value='paramsValue.column'
        component='treeSelect'
        @select='columnSelect'
      />
      <DropdownButton
        :options='termTypeOptions'
        type="termType"
        value-name='id'
        label-name='name'
        placeholder="操作符"
        v-model:value='paramsValue.termType'
        @select='termsTypeSelect'
      />
      <DoubleParamsDropdown
        v-if='showDouble'
        icon='icon-canshu'
        placeholder='参数值'
        value-name='id'
        label-name='name'
        :options='valueOptions'
        :metricOptions='valueColumnOptions'
        :tabsOptions='tabsOptions'
        v-model:value='paramsValue.value.value'
        v-model:source='paramsValue.value.source'
        @select='valueSelect'
      />
      <ParamsDropdown
        v-else
        icon='icon-canshu'
        placeholder='参数值'
        value-name='id'
        label-name='name'
        :options='valueOptions'
        :metricOptions='valueColumnOptions'
        :tabsOptions='tabsOptions'
        v-model:value='paramsValue.value.value'
        v-model:source='paramsValue.value.source'
        @select='valueSelect'
      />
      <j-popconfirm title='确认删除？' @confirm='onDelete'>
        <div v-show='showDelete' class='button-delete'> <AIcon type='CloseOutlined' /></div>
      </j-popconfirm>
    </div>
    <div class='term-add' @click.stop='termAdd' v-if='isLast'>
      <div class='terms-content'>
        <AIcon type='PlusOutlined' style='font-size: 12px' />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts' name='FilterCondition'>
import type { PropType } from 'vue'
import type { TermsType } from '@/views/rule-engine/Scene/typings'
import DropdownButton from '../../components/DropdownButton'
import { getOption } from '../../components/DropdownButton/util'
import ParamsDropdown, { DoubleParamsDropdown } from '../../components/ParamsDropdown'
import { inject } from 'vue'
import { useSceneStore } from 'store/scene'
import { storeToRefs } from 'pinia';
import { cloneDeep, flattenDeep, isArray, isObject, set } from 'lodash-es'
import { Form } from 'jetlinks-ui-components'
import {treeFilter} from "@/utils/comm";
import { timeTypeKeys } from '@/views/rule-engine/Scene/Save/components/Terms/util'

const sceneStore = useSceneStore()
const { data: formModel } = storeToRefs(sceneStore)

type Emit = {
  (e: 'update:value', data: TermsType): void
}

type TabsOption = {
  label: string;
  key: string;
  component: string
}

const props = defineProps({
  isFirst: {
    type: Boolean,
    default: true
  },
  isLast: {
    type: Boolean,
    default: true
  },
  showDeleteBtn: {
    type: Boolean,
    default: true
  },
  name: {
    type: Number,
    default: 0
  },
  termsName: {
    type: Number,
    default: 0
  },
  actionName: {
    type: Number,
    default: 0
  },
  thenName: {
    type: Number,
    default: 0
  },
  branchName: {
    type: Number,
    default: 0
  },
  value: {
    type: Object as PropType<TermsType>,
    default: () => ({
      column: '',
      type: 'and',
      termType: 'eq',
      value: {
        source: 'fixed',
        value: undefined
      }
    })
  }
})

const emit = defineEmits<Emit>()

const paramsValue = reactive<TermsType>({
  column: props.value.column,
  type: props.value.type,
  termType: props.value.termType,
  value: props.value.value
})
const formItemContext = Form.useInjectFormItemContext()
const showDelete = ref(false)
const columnOptions: any = inject('filter-params') //
const columnType = ref<string>()
const termTypeOptions = ref<Array<{ id: string, name: string}>>([]) // 条件值
const valueOptions = ref<any[]>([]) // 默认手动输入下拉
const arrayParamsKey = ['nbtw', 'btw', 'in', 'nin', 'contains_all', 'contains_any', 'not_contains']
const valueColumnOptions = ref<any[]>([])

const tabsOptions = ref<Array<TabsOption>>(
  [
    { label: '手动输入', key: 'fixed', component: 'string' },
    { label: '内置参数', key: 'upper', component: 'tree' }
  ]
)

const handOptionByColumn = (option: any) => {
  if (option) {
    termTypeOptions.value = option.termTypes || []
    tabsOptions.value[0].component = option.type
    columnType.value = option.type
    const _options = option.options
    if (option.type === 'boolean') {
      // 处理_options为Object时
      if (isObject(_options)) {
        const bool = (_options as any)?.bool
        valueOptions.value = [
          { label: bool.falseText, name: bool.falseText, value: bool.falseValue, id: bool.falseValue },
          { label: bool.trueText, name: bool.trueText, value: bool.trueValue, id: bool.trueValue },
        ]
      } else {
        valueOptions.value = _options?.map((item: any) => ({ ...item, label: item.name, value: item.id})) || [
          { label: '是', name: '是', value: 'true', id: 'true' },
          { label: '否', name: '否', value: 'false', id: 'false' },
        ]
      }
    } else if(option.type === 'enum') {
      valueOptions.value = _options?.elements?.map((item: any) => ({ ...item, label: item.text, value: item.value})) || []
    } else{
      valueOptions.value = _options?.map((item: any) => ({ ...item, label: item.name, value: item.id})) || []
    }
    valueColumnOptions.value = treeFilter(cloneDeep(columnOptions.value), option.type, 'type')
  } else {
    termTypeOptions.value = []
    valueOptions.value = []
    valueColumnOptions.value = []
  }
  if(paramsValue.termType){
    if (columnType.value ==='date') {
      if (timeTypeKeys.includes(paramsValue.termType)) {
        if (tabsOptions.value[0].component !== 'int') {
        }
        tabsOptions.value[0].component = 'int'
      } else if (!timeTypeKeys.includes(paramsValue.termType) && tabsOptions.value[0].component == 'int') {
        tabsOptions.value[0].component = 'date'
      }
    }
  }
}

watch(() => [columnOptions.value, paramsValue.column], () => {
  if (paramsValue.column) {
    const option = getOption(columnOptions.value, paramsValue.column, 'id')
    if (option && Object.keys(option).length) {
      handOptionByColumn(option)
      if (props.value.error) {
        emit('update:value', {
          ...props.value,
          error: false
        })
        formItemContext.onFieldChange()
      }
    } else {
      emit('update:value', {
        ...props.value,
        error: true
      })
      formItemContext.onFieldChange()
    }
  }
})

const showDouble = computed(() => {
  const isRange = paramsValue.termType ? arrayParamsKey.includes(paramsValue.termType) : false
  return isRange
})

const mouseover = () => {
  if (props.showDeleteBtn){
    showDelete.value = true
  }
}

const mouseout = () => {
  if (props.showDeleteBtn){
    showDelete.value = false
  }
}

const handleOptionsColumnsValue = (termsColumns: any[], _options: any) => {
  formModel.value.branches![props.branchName].then[props.thenName].actions[props.name].options!.termsColumns = termsColumns
  const flatten = new Set(flattenDeep(termsColumns))
  let newColumns = [...flatten.values()]
  if (_options?.otherColumns) {
    newColumns = [..._options?.otherColumns, ...newColumns]
  }
  formModel.value.branches![props.branchName].then[props.thenName].actions[props.name].options!.columns = newColumns
}

const columnSelect = (e: any) => {
  const dataType = e.type
  const hasTypeChange = dataType !== tabsOptions.value[0].component
  let termTypeChange = false

  // 如果参数类型未发生变化，则不修改操作符以及值
  const termTypes = e.termTypes
  if (!termTypes.some((item: {id: string}) => paramsValue.termType === item.id)) { // 修改操作符
    termTypeChange = true
    paramsValue.termType = termTypes?.length ? termTypes[0].id : 'eq'
  }

  if (hasTypeChange) {
    paramsValue.termType = termTypes?.length ? termTypes[0].id : 'eq'
    paramsValue.value = {
      source: tabsOptions.value[0].key,
      value: undefined
    }
  } else if (termTypeChange) {
    const oldValue = isArray(paramsValue.value!.value) ? paramsValue.value!.value[0] : paramsValue.value!.value
    const value = arrayParamsKey.includes(e.key) ? [ oldValue, undefined ] : oldValue
    paramsValue.value = {
      source: paramsValue.value?.source || tabsOptions.value[0].key,
      value: value
    }
  }

  const columns = e.metadata === true ? [e.column] : []
  const _options = formModel.value.branches![props.branchName].then[props.thenName].actions[props.actionName].options
  const termsColumns = _options?.termsColumns || []
  set(
    termsColumns,
    [props.termsName, props.name],
    columns
  )
  handleOptionsColumnsValue(termsColumns, _options)
  emit('update:value', { ...paramsValue })
  formItemContext.onFieldChange()
  formModel.value.branches![props.branchName].then[props.thenName].actions[props.actionName].options!.terms[props.termsName].terms[props.name][0] = e.name
}

const termsTypeSelect = (e: { key: string, name: string }) => {
  const oldValue = isArray(paramsValue.value!.value) ? paramsValue.value!.value[0] : paramsValue.value!.value
  let value = arrayParamsKey.includes(e.key) ? [ oldValue, undefined ] : oldValue

  // 如果上次的值 在 timeTypeKeys中 则不变
  if (columnType.value ==='date') {
    if (timeTypeKeys.includes(e.key)) {
      if (tabsOptions.value[0].component !== 'int') {
        value = undefined
      }
      tabsOptions.value[0].component = 'int'
    } else if (!timeTypeKeys.includes(e.key) && tabsOptions.value[0].component == 'int') {
      value = undefined
      tabsOptions.value[0].component = 'date'
    }
  }

  paramsValue.value = {
    source: paramsValue.value?.source || tabsOptions.value[0].key,
    value: value
  }
  emit('update:value', { ...paramsValue })
  formItemContext.onFieldChange()
  formModel.value.branches![props.branchName].then[props.thenName].actions[props.actionName].options!.terms[props.termsName].terms[props.name][1] = e.name
}

const valueSelect = (_: any, label: string, labelObj: Record<number, any>) => {
  emit('update:value', { ...paramsValue })
  formItemContext.onFieldChange()
  formModel.value.branches![props.branchName].then[props.thenName].actions[props.actionName].options!.terms[props.termsName].terms[props.name][2] = labelObj
}

const typeChange = (e: any) => {
  paramsValue.type = e.value
  emit('update:value', { ...paramsValue })
  formModel.value.branches![props.branchName].then[props.thenName].actions[props.actionName].options!.terms[props.termsName].terms[props.name][3] = e.label
}

const termAdd = () => {
  const terms = {
    column: undefined,
    value: {
      source: 'fixed',
      value: undefined
    },
    termType: undefined,
    type: 'and',
    key: `params_${new Date().getTime()}`
  }
  formModel.value.branches?.[props.branchName]?.then?.[props.thenName]?.actions?.[props.actionName].terms?.[props.termsName].terms?.push(terms)
}

const onDelete = () => {
  const key = formModel.value.branches?.[props.branchName]?.then?.[props.thenName]?.actions?.[props.actionName].terms?.[props.termsName].terms?.[props.name].key
  formModel.value.branches?.[props.branchName]?.then?.[props.thenName]?.actions?.[props.actionName].terms?.[props.termsName].terms?.splice(props.name, 1)
  const _options = formModel.value.branches![props.branchName].then[props.thenName].actions[props.name].options
  const termsColumns = _options?.termsColumns || []
  set(
    termsColumns,
    [props.termsName, props.name],
    []
  )
  handleOptionsColumnsValue(termsColumns, _options)
}

nextTick(() => {
  Object.assign(paramsValue, props.value)
})
</script>

<style scoped>

</style>
