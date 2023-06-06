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
          v-model:value='formModel.branches[branchName].when[name].type'
          @select='typeChange'
        />
      </div>
      <div
          class='terms-params-content'
          @mouseover='mouseover'
          @mouseout='mouseout'
      >
        <j-popconfirm
            title='确认删除？'
            :overlayStyle='{minWidth: "180px"}'
            @confirm='onDelete'
        >
          <div v-show='showDelete' class='terms-params-delete'>
            <AIcon type='CloseOutlined' />
          </div>
        </j-popconfirm>
        <TermsItem
          v-for='(item, index) in termsData'
          :key='item.key'
          :branchName='branchName'
          :whenName='props.name'
          :name='index'
          :showDeleteBtn='termsData.length > 1'
          :isFirst='index === 0'
          :isLast='index === termsData.length -1'
          :data='item'
        />
      </div>
      <div class='terms-group-add' @click='addWhen' v-if='isLast'>
        <div class='terms-content'>
          <AIcon type='PlusOutlined' />
          <span>分组</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts' name='WhenItem'>
import type { PropType } from 'vue'
import TermsItem from './TermsItem.vue'
import { TermsType } from '@/views/rule-engine/Scene/typings'
import { useSceneStore } from 'store/scene'
import DropdownButton from '../DropdownButton'
import { storeToRefs } from 'pinia';
import { randomString } from '@/utils/utils'

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
  showDeleteBtn: {
    type: Boolean,
    default: true
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
  isLast: {
    type: Boolean,
    default: true
  }
})

const showDelete = ref(false)

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

const termsData = computed(() => {
  return props.data.terms
})

const typeChange = (e: any) => {
  formModel.value.options!.when[props.name].terms[props.name].termType = e.label
}

const onDelete = () => {
  formModel.value.branches?.[props.branchName]?.when?.splice(props.name, 1)
  formModel.value.options!.when[props.branchName].terms.splice(props.name, 1)
}

const addWhen = () => {
  const terms = {
    type: 'and',
    terms: [
      {
        column: undefined,
        value: {
          source: 'manual',
          value: undefined
        },
        termType: undefined,
        key: `params_${randomString()}`,
        type: 'and',
      }
    ],
    key: `terms_${randomString()}`
  }
  formModel.value.branches?.[props.branchName]?.when?.push(terms)
  formModel.value.options?.when?.[props.branchName]?.terms.push({ termType: '并且', terms: [['','eq','','and']]})
}

</script>

<style scoped>

</style>