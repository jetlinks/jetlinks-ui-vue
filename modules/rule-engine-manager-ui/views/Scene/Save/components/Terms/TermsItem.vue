<template>
  <a-form-item
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
        :branches_Index='branches_Index'
    />
  </a-form-item>
</template>

<script setup lang='ts' name='TermsItem'>
import type { PropType } from 'vue'
import type { TermsType } from '../../../typings';
import { storeToRefs } from 'pinia';
import { useSceneStore } from '../../../../../store/scene'
import ParamsItem from './ParamsItem.vue'
import { isArray, isNil } from 'lodash-es'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
  branches_Index: {
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
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-0')));
        }
        if (!v.column) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-1')));
        }
        if (!v.termType) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-2')));
        }
        if (v.termType === 'complex_exists') {
          if(Object.keys(v.value.value).length === 0) {
            return Promise.reject(new Error($t('Terms.TermsItem.9093428-3-1')));
          }
          if(isNil(v.value?.value?.aggregation?.[0]?.value?.value) && !v.value?.value?.filter?.length) {
            return Promise.reject(new Error($t('Terms.TermsItem.9093428-3-1')));
          }
        }
        if (['in', 'nin'].includes(v.termType)) {
          if(Object.keys(v.value.value).length === 0) {
            return Promise.reject(new Error($t('Terms.TermsItem.9093428-3')));
          }
        }
        if (v.value?.value === undefined) {
          if (v.value?.filter?.length) {
            return Promise.resolve();
          }
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-3')));
        }
        if (
          isArray(v.value.value) &&
          v.value.value.some((_v: any) => _v === undefined)
        ) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-3')));
        }
      } else {
        if (v?.error) { // 数据发生变化
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-0')))
        }
        return Promise.reject(new Error($t('Terms.TermsItem.9093428-1')));
      }
      return Promise.resolve();
    },
    trigger: 'change'
  }
]

</script>

<style scoped>

</style>
