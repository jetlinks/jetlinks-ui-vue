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
        @select='typeSelect'
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
        value-name='column'
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
        :options='valueOptions'
        :metricOptions='metricOption'
        :tabsOptions='tabsOptions'
        v-model:value='paramsValue.value.value'
        v-model:source='paramsValue.value.source'
        @select='valueSelect'
      />
      <ParamsDropdown
        v-else
        icon='icon-canshu'
        placeholder='参数值'
        :options='valueOptions'
        :metricOptions='metricOption'
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

<script setup lang='ts' name='ParamsItem'>
import type { PropType } from 'vue'
import type { TermsType } from '@/views/rule-engine/Scene/typings'
import DropdownButton from '../DropdownButton'
import { getOption } from '../DropdownButton/util'
import ParamsDropdown, { DoubleParamsDropdown } from '../ParamsDropdown'
import { inject } from 'vue'
import { ContextKey } from './util'
import { useSceneStore } from 'store/scene'
import { storeToRefs } from 'pinia';
import { Form } from 'jetlinks-ui-components'

const sceneStore = useSceneStore()
const { data: formModel } = storeToRefs(sceneStore)
const formItemContext = Form.useInjectFormItemContext();

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
  branchName: {
    type: Number,
    default: 0
  },
  whenName: {
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
  column: props.value?.column,
  type: props.value?.type,
  termType: props.value?.termType,
  value: props.value?.value
})

const showDelete = ref(false)
const columnOptions: any = inject(ContextKey) //
const termTypeOptions = ref<Array<{ id: string, name: string}>>([]) // 条件值
const valueOptions = ref<any[]>([]) // 默认手动输入下拉
const metricOption = ref<any[]>([])  // 根据termType获取对应指标值
const tabsOptions = ref<Array<TabsOption>>([{ label: '手动输入', key: 'manual', component: 'string' }])
const arrayParamsKey = ['nbtw', 'btw', 'in', 'nin']
let metricsCacheOption: any[] = [] // 缓存指标值

const handOptionByColumn = (option: any) => {
  if (option) {
    termTypeOptions.value = option.termTypes || []
    metricsCacheOption = option.metrics || []
    tabsOptions.value.length = 1
    tabsOptions.value[0].component = option.dataType

    if (option.metrics && option.metrics.length) {
      tabsOptions.value.push(
        { label: '指标值', key: 'metric', component: 'select' }
      )
    }

    if (option.dataType === 'boolean') {
      valueOptions.value = [
        { label: '是', value: true },
        { label: '否', value: false },
      ]
    } else if(option.dataType === 'enum') {
      valueOptions.value = option.options?.map((item: any) => ({ ...item, label: item.name, value: item.id})) || []
    } else{
      valueOptions.value = option.options || []
    }
  } else {
    termTypeOptions.value = []
    metricsCacheOption = []
    valueOptions.value = []
  }
}

watchEffect(() => {
  if (!props.value.error && props.value.column) { // 新增不查找option
    const option = getOption(columnOptions.value, paramsValue.column, 'column')
    if (option) {
      handOptionByColumn(option)
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
  if (metricsCacheOption.length) {
    metricOption.value = metricsCacheOption.filter(item => isRange ? item.range : !item.range)
  } else {
    metricOption.value = []
  }
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

const columnSelect = (option: any) => {
  paramsValue.termType = 'eq'
  paramsValue.value = {
    source: tabsOptions.value[0].key,
    value: undefined
  }
  emit('update:value', { ...paramsValue })
  formItemContext.onFieldChange()
  formModel.value.options!.when[props.whenName].terms[props.termsName].terms[props.name][0] = option.name
  formModel.value.options!.when[props.whenName].terms[props.termsName].terms[props.name][1] = paramsValue.termType
}

const termsTypeSelect = (e: { key: string, name: string }) => {
  const value = arrayParamsKey.includes(e.key) ? [ undefined, undefined ] : undefined
  paramsValue.value = {
    source: tabsOptions.value[0].key,
    value: value
  }
  emit('update:value', { ...paramsValue })
  formItemContext.onFieldChange()
  formModel.value.options!.when[props.whenName].terms[props.termsName].terms[props.name][1] = e.name
}

const valueSelect = (_: any, label: string, labelObj: Record<number, any>) => {
  formItemContext.onFieldChange()
  formModel.value.options!.when[props.whenName].terms[props.termsName].terms[props.name][2] = labelObj
}

const typeSelect = (e: any) => {
  formModel.value.options!.when[props.whenName].terms[props.termsName].terms[props.name][3] = e.label
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
  formModel.value.branches?.[props.branchName]?.when?.[props.whenName]?.terms?.push(terms)
  formModel.value.options!.when[props.whenName].terms[props.termsName].terms[props.name].push(['', '', '', '并且'])
}

const onDelete = () => {
  formModel.value.branches?.[props.branchName]?.when?.[props.whenName]?.terms?.splice(props.name, 1)
  formModel.value.options!.when[props.whenName].terms[props.termsName].terms.splice(props.name, 1)
}

nextTick(() => {
  Object.assign(paramsValue, props.value)
})

</script>

<style scoped>

</style>