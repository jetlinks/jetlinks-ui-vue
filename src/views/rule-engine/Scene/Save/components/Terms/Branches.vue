<template>
  <div :class='WarpClass'>
    <div class='actions-terms-title'>
      {{ isFirst ? '当' : '否则' }}
    </div>
    <div :class='optionsClass'>
        <j-popconfirm
          title='确认删除？'
          @confirm='onDelete'
          :overlayStyle='{minWidth: "180px"}'
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
          <div class='terms-params-delete' v-show='showDelete && whenData.length'>
            <AIcon type='CloseOutlined' />
          </div>
        </j-popconfirm>

        <div class='actions-terms-list-content'>
          <template v-if='showWhen'>
            <j-scrollbar>
              <div style="display: flex; padding-top: 10px;">
                <WhenItem
                  v-for='(item, index) in whenData'
                  :key='item.key'
                  :name='index'
                  :showDeleteBtn='whenData.length !== 1'
                  :isFirst='index === 0'
                  :isLast='index === whenData.length -1'
                  :branchName='name'
                  :data='item'
                />

              </div>
            </j-scrollbar>
          </template>
          <div v-else style="display: flex; padding-top: 10px;">
            <span class='when-add' @click='addWhen' :style='{ padding: isFirst ? "16px 0" : 0 }'>
              <AIcon type='PlusCircleOutlined' style='padding: 4px' />
              添加过滤条件
            </span>
          </div>
        </div>
      </div>
      <div class='actions-branches'>
        <j-form-item
          :name='["branches", name, "then"]'
          :rules='rules'
        >
          <Action
            :name='name'
            :openShakeLimit="true"
            :thenOptions='FormModel.branches[name]?.then'
          />
        </j-form-item>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup name='Branches'>
import type { PropType } from 'vue'
import type { ActionBranchesProps } from '@/views/rule-engine/Scene/typings'
import WhenItem from './WhenItem.vue'
import { storeToRefs } from 'pinia';
import { useSceneStore } from 'store/scene'
import Action from '../../action/index.vue'
import { randomString } from '@/utils/utils'

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

const WarpClass = computed(() => {
  return {
    'actions-terms-warp': true,
    'first-children': props.isFirst,
    'terms-items': (FormModel.value.branches?.length || 0) > 0
  }
})

const onDelete = () => {
  if (FormModel.value.branches?.length == 2) {
    FormModel.value.branches?.splice(props.name, 1, null)
  } else {
    FormModel.value.branches?.splice(props.name, 1)
  }
}

const onDeleteAll = () => {
  if (FormModel.value.branches) {
    FormModel.value.branches.length = props.name
    FormModel.value.branches.push(null as any)
  }
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
        key: `params_${randomString()}`,
        type: 'and',
      }
    ],
    key: `terms_${randomString()}`
  }
  FormModel.value.branches?.[props.name].when?.push(terms)
  FormModel.value.branches?.push(null as any)
  FormModel.value.options!.when[props.name]?.terms.push({ termType: '并且', terms: [['','eq','','and']]})
}

const optionsClass = computed(() => {
  return {
    'actions-terms-options': true,
    border: !props.isFirst,
    error: error
  }
})

const rules = [{
  validator(_: string, value: any) {
    if (!value || (value && !value.length)) {
      return Promise.reject('至少配置一个执行动作')
    } else {
      const isActions = value.some((item: any) => item.actions && item.actions.length)
      return isActions ? Promise.resolve() : Promise.reject('至少配置一个执行动作');
    }
    return Promise.resolve();
  }
}]

</script>

<style scoped lang='less'>
.when-add {
  font-size: 14px;
  color: #2F54EB;
  cursor: pointer;
}
</style>