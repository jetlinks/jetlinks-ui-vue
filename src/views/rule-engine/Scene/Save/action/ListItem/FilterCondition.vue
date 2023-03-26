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
        @change='typeChange'
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
import { flattenDeep, set } from 'lodash-es'
import { Form } from 'jetlinks-ui-components'

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
      type: '',
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
const termTypeOptions = ref<Array<{ id: string, name: string}>>([]) // 条件值
const valueOptions = ref<any[]>([]) // 默认手动输入下拉
const arrayParamsKey = ['nbtw', 'btw', 'in', 'nin']
const valueColumnOptions = ref([])

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
    if (option.type === 'boolean') {
      valueOptions.value = [
        { name: '是', id: true },
        { name: '否', id: false },
      ]
    } else if(option.type === 'enum') {
      valueOptions.value = option.options?.map((item: any) => ({ ...item, label: item.name, value: item.id})) || []
    } else{
      valueOptions.value = option.options || []
    }
    valueColumnOptions.value = columnOptions.value
  } else {
    termTypeOptions.value = []
    valueOptions.value = []
    valueColumnOptions.value = []
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
  paramsValue.termType = 'eq'
  paramsValue.value = {
    source: tabsOptions.value[0].key,
    value: undefined
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
  const value = arrayParamsKey.includes(e.key) ? [ undefined, undefined ] : undefined
  paramsValue.value = {
    source: tabsOptions.value[0].key,
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