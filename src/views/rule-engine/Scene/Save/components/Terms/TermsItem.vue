<template>
  <j-form-item
      :name='["branches", branchName, "when", whenName, "terms", props.name]'
      :rules='rules'
  >
    <ParamsItem
        v-model:value='formModel.branches[branchName].when[whenName].terms[props.name]'
        :isFirst='isFirst'
        :isLast='isLast'
        :showDeleteBtn='showDeleteBtn'
        :termsName='name'
        :whenName='whenName'
        :branchName='branchName'
    />
  </j-form-item>
</template>

<script setup lang='ts' name='TermsItem'>
import type { PropType } from 'vue'
import type { TermsType } from '@/views/rule-engine/Scene/typings'
import { storeToRefs } from 'pinia';
import { useSceneStore } from 'store/scene'
import ParamsItem from './ParamsItem.vue'
import { isArray } from 'lodash-es'
import { randomString } from '@/utils/utils'

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
    validator: async (_: any, v: any) => {
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
        if (v.value?.value === undefined) {
          return Promise.reject(new Error('请选择或输入参数值'));
        }
        if (
          isArray(v.value.value) &&
          v.value.value.some((_v: any) => _v === undefined)
        ) {
          return Promise.reject(new Error('请选择或输入参数值'));
        }
      } else {
        if (v?.error) { // 数据发生变化
          return Promise.reject(new Error('该数据已发生变更，请重新配置'))
        }
        return Promise.reject(new Error('请选择参数'));
      }
      return Promise.resolve();
    },
  }
]

</script>

<style scoped>

</style>