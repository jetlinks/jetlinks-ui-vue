<template>
  <div :class='["actions-terms-warp", props.class]'>
    <div class='actions-terms-title'>
      {{ isFirst ? '当' : '否则' }}
    </div>
    <div :class='optionsClass'>
        <j-popconfirm
          title='确认删除？'
          @confirm='onDelete'
        >
          <div v-if='!isFirst' class='terms-params-delete danger show'>
            <AIcon type='DeleteOutlined' />
          </div>
        </j-popconfirm>
      <div
        class='actions-terms-list'
        @mouseover='mouseover'
        @mouseout='mouseout'
      >
        <j-popconfirm
          title='该操作将清空其它所有否则条件，确认删除？'
          placement="topRight"
          @confirm='onDeleteAll'
        >
          <div class='terms-params-delete' v-show='showDelete'>
            <AIcon type='CloseOutlined' />
          </div>
        </j-popconfirm>

        <div class='actions-terms-list-content'>
          <template v-if='showWhen'>
            <TermsItem
              v-for='(item, index) in whenData'
              :key='item.key'
              :name='index'
              :showDeleteBtn='whenData.length !== 1'
              :isFirst='index === 0'
              :isLast='index === whenData.length -1'
              :branchName='name'
              :whenName='index'
              :data='item'
              :isFrist='index === 0'
            />
          </template>
          <span v-else class='when-add' @click='addWhen' :style='{ padding: isFirst ? "16px 0" : 0 }'>
            <AIcon type='PlusCircleOutlined' style='padding: 4px' />
            添加过滤条件
          </span>
        </div>
      </div>
      <div class='actions-branches'>
        <j-form-item></j-form-item>
      </div>

    </div>
  </div>
</template>

<script lang='ts' setup name='Branchs'>
import type { PropType } from 'vue'
import type { ActionBranchesProps } from '@/views/rule-engine/Scene/typings'
import TermsItem from './TermsItem.vue'
import { storeToRefs } from 'pinia';
import { useSceneStore } from 'store/scene'

const sceneStore = useSceneStore()
const { data: FormModel } = storeToRefs(sceneStore)

const props = defineProps({
  isFirst: {
    type: Boolean,
    default: true
  },
  data: {
    type: Object as PropType<ActionBranchesProps>,
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
  }
})

const showDelete = ref(false)
const error = ref(false)

const showWhen = computed(() => {
  return props.data.when.length
})

const whenData = computed(() => {
  return props.data.when
})

const onDelete = () => {

}

const onDeleteAll = () => {

}

const mouseover = () => {
  if (!props.isFirst){
    showDelete.value = true
  }
}

const mouseout = () => {
  if (!props.isFirst){
    showDelete.value = false
  }
}

const addWhen = () => {
  const whenItem = {
    key: `when_${new Date().getTime()}`,
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
    ]
  }
  FormModel.value.branches?.[props.name].when.push(whenItem)
  FormModel.value.branches?.push(null)
}

const optionsClass = computed(() => {
  return {
    'actions-terms-options': true,
    border: !props.isFirst,
    error: error
  }
})

</script>

<style scoped lang='less'>
.when-add {
  font-size: 14px;
  color: #2F54EB;
  cursor: pointer;
}
</style>