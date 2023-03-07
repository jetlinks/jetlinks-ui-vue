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
        :options='options'
        type='column'
        placeholder='请选择参数'
        v-model:value='paramsValue.column'
        component='treeSelect'
        @select='columnSelect'
      />
      <DropdownButton
        :options='termTypeOptions'
        type="termType"
        placeholder="操作符"
        v-model:value='paramsValue.termsType'
        @select='termsTypeSelect'
      />
      <termplate v-if='showDouble'>

      </termplate>
      <j-popconfirm title='确认删除？' @confirm='onDelete'>
        <div v-show='showDelete' class='button-delete'> <AIcon type='CloseOutlined' /></div>
      </j-popconfirm>
    </div>
    <div class='term-add' @click.stop='termAdd'>
      <div class='terms-content'>
        <AIcon type='PlusOutlined' style='font-size: 12px' />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts' name='ParamsItem'>
import type { PropType } from 'vue'
import type { TermsType } from '@/views/rule-engine/Scene/typings'
import DropdownButton from '../DropdownButton.vue'
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
      termsType: undefined,
      value: undefined
    })
  }
})

const paramsValue = reactive<TermsType>({
  column: '',
  type: '',
  termType: undefined,
  value: undefined
})

const showDelete = ref(false)
const columnOptions = inject(ContextKey)

const options = computed(() => {
  function handleOptions() {

  }

  return []
})

const termTypeOptions = computed(() => {

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

onMounted(() => {
  Object.assign(paramsValue, props.value)
})

</script>

<style scoped>

</style>