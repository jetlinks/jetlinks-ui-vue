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
          :rules='rules'
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
import { isArray } from 'lodash-es'

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

const rules = [
  {
    validator(_: any, v: any) {
      if (v !== undefined && !v.error) {
        if (!Object.keys(v).length) {
          return Promise.reject(new Error('该数据已发生变更，请重新配置'));
        }
        if (!v.column) {
          return Promise.reject(new Error('请选择参数'));
        }

        if (!v.termType) {
          return Promise.reject(new Error('请选择操作符'));
        }

        if (v.value === undefined) {
          return Promise.reject(new Error('请选择或输入参数值'));
        } else {
          if (
            isArray(v.value.value) &&
            v.value.value.some((_v: any) => _v === undefined)
          ) {
            return Promise.reject(new Error('请选择或输入参数值'));
          } else if (v.value.value === undefined) {
            return Promise.reject(new Error('请选择或输入参数值'));
          }
        }
      } else {
        return Promise.reject(new Error('请选择参数'));
      }
      return Promise.resolve();
    },
  }
]

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