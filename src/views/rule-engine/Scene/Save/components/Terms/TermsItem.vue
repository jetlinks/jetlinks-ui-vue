<template>
  <div class='terms-params'>
    <div class='terms-params-warp'>
      <div v-if='!isFirst' class='term-type-warp'>
        <DropdownButton
          :options='[
            { label: "并且", value: "and" },
            { label: "或者", value: "or" },
          ]'
          type='type'
          v-model:value='formModel.branches[branchName].when[whenName].type'
        />
      </div>
      <div
        class='terms-params-content'
        @mouseover='mouseover'
        @mouseout='mouseout'
      >
        <j-popconfirm
          title='确认删除？'
          @confirm='onDelete'
        >
          <div v-show='showDelete' class='terms-params-delete'>
            <AIcon type='CloseOutlined' />
          </div>
        </j-popconfirm>

        <j-form-item
          v-for='(item, index) in termsData'
          :key='item.key'
          :name='["branches", branchName, "when", whenName, "terms", index]'
        >
          <ParamsItem
            v-model:value='formModel.branches[branchName].when[whenName].terms[index]'
            :isFirst='index === 0'
            :isLast='index === termsData.length - 1'
            :showDeleteBtn='termsData.length !== 1'
            :name='index'
            :termsName='name'
            :whenName='whenName'
            :branchName='branchName'
            @change='paramsChange'
          />
        </j-form-item>
      </div>
      <div class='terms-group-add' @click='addTerms' v-if='isLast'>
        <div class='terms-content'>
          <AIcon type='PlusOutlined' />
          <span>分组</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts' name='TermsItem'>
import type { PropType } from 'vue'
import type { TermsType } from '@/views/rule-engine/Scene/typings'
import DropdownButton from '../DropdownButton'
import { storeToRefs } from 'pinia';
import { useSceneStore } from 'store/scene'
import ParamsItem from './ParamsItem.vue'

const sceneStore = useSceneStore()
const { data: formModel } = storeToRefs(sceneStore)

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
  data: {
    type: Object as PropType<TermsType>,
    default: () => ({
      when: [],
      shakeLimit: {},
      then: []
    })
  },
  class: {
    type: String,
    default: ''
  },
  name: {
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
  }
})

const showDelete = ref(false)

const termsData = computed(() => {
  return props.data.terms
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

const onDelete = () => {
  formModel.value.branches?.[props.branchName]?.when?.splice(props.name, 1)
}

const paramsChange = () => {

}

const addTerms = () => {
  const terms = {
    type: 'and',
    terms: [
      {
        column: undefined,
        value: {
          source: 'fixed',
          value: undefined
        },
        termType: undefined,
        key: 'params_1',
        type: 'and',
      }
    ],
    key: `terms_${new Date().getTime()}`
  }
  formModel.value.branches?.[props.branchName]?.when?.push(terms)
}

</script>

<style scoped>

</style>