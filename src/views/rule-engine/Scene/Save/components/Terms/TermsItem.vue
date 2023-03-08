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
          v-for='(item, index) in data.terms'
          :key='item.key'
          :name='["branches", branchName, "when", whenName, "terms", index]'
        >
          <ParamsItem
            v-model:value='formModel.branches[branchName].when[whenName].terms[index]'
            :isFirst='index === 0'
            :isLast='index === data.terms.length - 1'
            :name='index'
            @change='paramsChange'
            @delete='paramsDelete'
            @add='paramsAdd'
          />
        </j-form-item>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts' name='TermsItem'>
import type { PropType } from 'vue'
import type { TermsType } from '@/views/rule-engine/Scene/typings'
import DropdownButton from '../DropdownButton.vue'
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

const mouseover = () => {
  console.log(props.whenName)
  if (props.whenName !== 0){
    showDelete.value = true
  }
}

const mouseout = () => {
  console.log(props.whenName)
  if (props.whenName !== 0){
    showDelete.value = false
  }
}

const onDelete = () => {

}

const onDeleteAll = () => {

}

const paramsChange = () => {

}

const paramsDelete = () => {

}

const paramsAdd = () => {

}

</script>

<style scoped>

</style>