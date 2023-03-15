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
import { ContextKey } from '../../components/Terms/util'
import { useSceneStore } from 'store/scene'
import { storeToRefs } from 'pinia';

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
  branchName: {
    type: Number,
    default: 0
  },
  thenName: {
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

const showDelete = ref(false)
const columnOptions: any = inject(ContextKey) //
const termTypeOptions = ref<Array<{ id: string, name: string}>>([]) // 条件值
const valueOptions = ref<any[]>([]) // 默认手动输入下拉
const metricOption = ref<any[]>([])  //
const tabsOptions = ref<Array<TabsOption>>([{ label: '内置参数', key: 'upper', component: 'tree' }])
// { label: '手动输入', key: 'fixed', component: 'string' },


const handOptionByColumn = (option: any) => {
  if (option) {
    termTypeOptions.value = option.termTypes || []
    metricOption.value = option.metrics || []
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
    metricOption.value = []
    valueOptions.value = []
  }
}

watchEffect(() => {
  const option = getOption(columnOptions.value, paramsValue.column, 'column')
  handOptionByColumn(option)
})

const showDouble = computed(() => {
  const isRange = paramsValue.termType ? ['nbtw', 'btw', 'in', 'nin'].includes(paramsValue.termType) : false
  if (metricOption.value.length) {
    metricOption.value = metricOption.value.filter(item => isRange ? item.range : !item.range)
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

const columnSelect = () => {
  paramsValue.termType = 'eq'
  paramsValue.value = {
    source: tabsOptions.value[0].key,
    value: undefined
  }
  emit('update:value', { ...paramsValue })
}

const termsTypeSelect = () => {
  paramsValue.value = {
    source: tabsOptions.value[0].key,
    value: undefined
  }
  emit('update:value', { ...paramsValue })
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
  formModel.value.branches?.[props.branchName]?.then?.[props.thenName]?.actions?.[props.name].terms?.push(terms)
}

const onDelete = () => {
  formModel.value.branches?.[props.branchName]?.then?.[props.thenName]?.actions?.[props.name].terms?.splice(props.name, 1)
}

nextTick(() => {
  Object.assign(paramsValue, props.value)
})
</script>

<style scoped>

</style>