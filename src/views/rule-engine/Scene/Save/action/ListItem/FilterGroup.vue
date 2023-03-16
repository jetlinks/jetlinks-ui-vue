<template>
  <div class='terms-params filter-group'>
    <div class='terms-params-warp'>
      <div v-if='!isFirst' class='term-type-warp'>
        <DropdownButton
          :options='[
              { label: "并且", value: "and" },
              { label: "或者", value: "or" },
            ]'
          type='type'
          v-model:value='formModel.branches[branchName].then[thenName].actions[actionName].terms[name].type'
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
          v-for='(item, index) in termsOptions'
          :name='["branches", branchName, "then", thenName, "actions", actionName, "terms", name, "terms", index]'
          :rules='rules'
        >
          <FilterItem
            v-model:value='formModel.branches[branchName].then[thenName].actions[actionName].terms[name].terms[index]'
            :isFirst='index === 0'
            :isLast='index === termsOptions.length - 1'
            :showDeleteBtn='termsOptions.length !== 1'
            :name='index'
            :termsName='name'
            :actionName='actionName'
            :thenName='thenName'
            :branchName='branchName'
          />
        </j-form-item>
      </div>
      <div v-if='isLast' class='terms-group-add'>
        <div class='terms-content'>
          <AIcon type='PlusOutlined' style='font-size: 12px;padding-right: 4px;' />
          <span>分组</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts' name='FilterGroup'>
import { storeToRefs } from 'pinia';
import { useSceneStore } from 'store/scene'
import DropdownButton from '../../components/DropdownButton'
import FilterItem from './FilterCondition.vue'
import { isArray } from 'lodash-es'
import { queryBuiltInParams } from '@/api/rule-engine/scene'
import { provide } from 'vue'

const sceneStore = useSceneStore()
const { data: formModel } = storeToRefs(sceneStore)

const columnOptions = ref<any>([])


provide('filter-params', columnOptions)

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
  branchName: {
    type: Number,
    default: 0
  },
  thenName: {
    type: Number,
    default: 0
  },
  actionName: {
    type: Number,
    default: 0
  }
})

const termsOptions = computed(() => {
  return formModel.value.branches![props.branchName].then[props.thenName].actions[props.actionName].terms?.[props.name].terms
})

const showDelete = ref(false)

const mouseover = () => {
  showDelete.value = true
}

const mouseout = () => {
  showDelete.value = false
}

const onDelete = () => {

}

const getParams = () => {
  const params = {
    branch: props.branchName,
    branchGroup: props.thenName,
    action: props.actionName
  }
  const data = formModel.value.branches!.filter(item => !!item)
  queryBuiltInParams({
    ...formModel.value,
    branches: data,
  }, params).then(res => {
    if (res.success) {
      columnOptions.value = res.result
    }
  })
}

const rules = [
  {
    validator(_: any, v?: Record<string, any>) {
      // console.log('-----v',v)
      if (v !== undefined) {
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
  },
]

nextTick(() => {
  getParams()
})

</script>

<style scoped>

</style>