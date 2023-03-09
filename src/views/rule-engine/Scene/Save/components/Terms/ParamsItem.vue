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
        :tabsOptions='[
          { label: "手动输入", component: "input", key: "fixed" },
          { label: "指标值", component: "time", key: "manual" }
        ]'
        v-model:value='paramsValue.value.value'
        v-model:source='paramsValue.value.source'
      />
      <ParamsDropdown
        v-else
        icon='icon-canshu'
        placeholder='参数值'
        :options='valueOptions'
        :tabsOptions='[
          { label: "手动输入", component: "time", key: "fixed" },
          { label: "指标值", component: "input", key: "manual" },
        ]'
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

<script setup lang='ts' name='ParamsItem'>
import type { PropType } from 'vue'
import type { TermsType } from '@/views/rule-engine/Scene/typings'
import DropdownButton from '../DropdownButton'
import { getOption } from '../DropdownButton/util'
import ParamsDropdown, { DoubleParamsDropdown } from '../ParamsDropdown'
import { inject } from 'vue'
import { ContextKey } from './util'

const props = defineProps({
  isFirst: {
    type: Boolean,
    default: true
  },
  isLast: {
    type: Boolean,
    default: true
  },
  name: {
    type: Number,
    default: 0
  },
  value: {
    type: Object as PropType<TermsType>,
    default: () => ({
      column: '',
      type: '',
      termType: undefined,
      value: {
        source: 'fixed',
        value: undefined
      }
    })
  }
})

const paramsValue = reactive<TermsType>({
  column: props.value.column,
  type: props.value.type,
  termType: props.value.termType,
  value: props.value.value
})

const showDelete = ref(false)
const columnOptions: any = inject(ContextKey)
const options = ref<any>([])

const termTypeOptions = computed(() => {
  const option = getOption(columnOptions.value, paramsValue.column, 'column')
  return option && Object.keys(option).length ? option.termTypes : []
})

const tabsOptions = computed(() => {
  // 获取当前value对应的option
  return []
})

const showDouble = computed(() => {
  return paramsValue.termType ? ['nbtw', 'btw', 'in', 'nin'].includes(paramsValue.termType) : false
})

const mouseover = () => {
  if (props.name !== 0){
    showDelete.value = true
  }
}

const mouseout = () => {
  if (props.name !== 0){
    showDelete.value = false
  }
}

const columnSelect = () => {

}

const termsTypeSelect = () => {

}

const termAdd = () => {

}

const onDelete = () => {

}

const valueOptions = computed(() => {
  return []
})

nextTick(() => {
  Object.assign(paramsValue, props.value)
})

</script>

<style scoped>

</style>