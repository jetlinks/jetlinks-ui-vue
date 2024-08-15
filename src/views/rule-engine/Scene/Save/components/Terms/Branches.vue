<template>
  <div :class='WarpClass'>
    <div class='actions-terms-title'>
      {{ isFirst ? $t('Terms.Branches.5425717-0') : $t('Terms.Branches.5425717-1') }}
    </div>
    <div :class='optionsClass'>
        <ConfirmModal :title="$t('Terms.Branches.5425717-2')" v-if='!isFirst' :onConfirm="onDelete" className="terms-params-delete danger show">
          <AIcon type='DeleteOutlined' />
        </ConfirmModal>
      <div
        class='actions-terms-list'
        @mouseover='mouseover'
        @mouseout='mouseout'
      >
        <ConfirmModal title="{{ $t('Terms.Branches.5425717-3') }}" :show='showDelete && whenData.length' :onConfirm="onDeleteAll" className="terms-params-delete">
          <AIcon type='CloseOutlined' />
        </ConfirmModal>
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
                  :branches_Index='branches_Index'
                  :data='item'
                />

              </div>
            </j-scrollbar>
          </template>
          <div v-else style="display: flex; padding-top: 10px;">
            <span class='when-add' @click='addWhen' :style='{ padding: isFirst ? "16px 0" : 0 }'>
              <AIcon type='PlusCircleOutlined' style='padding: 4px' />
              {{ $t('Terms.Branches.5425717-4') }}
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
            :groupIndex="groupIndex"
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
import {randomNumber, randomString} from '@/utils/utils'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
  },
  branches_Index: {
    type: Number,
    default: 0
  },
  groupLen: {
    type: Number,
    default: 0
  },
  groupIndex: {
    type: Number,
    default: 0
  },
  showGroupDelete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['deleteGroup', 'delete'])

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
  // if (FormModel.value.branches?.length == 2) {
  //   FormModel.value.branches?.splice(props.name, 1)
  // } else {
  //   FormModel.value.branches?.splice(props.name, 1)
  // }
  emit('delete')
}

const onDeleteAll = () => {
  if (FormModel.value.branches) {
    // FormModel.value.branches.length = props.name
    // FormModel.value.branches.push(null as any)
    FormModel.value.branches[props.name].when = []
    FormModel.value.options.when[props.branches_Index].terms = []
    if(FormModel.value.branches[props.name + 1] === null){
      FormModel.value.branches.splice(props.name + 1 , 1)
    }
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
    key: `terms_${randomString()}`,
  }
  FormModel.value.branches?.[props.name].when?.push(terms)
  if(FormModel.value.branches?.length <= props.name + 1){
    FormModel.value.branches?.splice(props.groupLen, 0, null)
  }
  FormModel.value.options!.when[props.branches_Index]?.terms.push({ termType: '并且', terms: [['','eq','','and']]})
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
      return Promise.reject($t('Terms.Branches.5425717-5'))
    } else {
      const isActions = value.some((item: any) => item.actions && item.actions.length)
      return isActions ? Promise.resolve() : Promise.reject($t('Terms.Branches.5425717-5'));
    }
    return Promise.resolve();
  }
}]

const deleteGroup = () => {
  emit('deleteGroup')
}

</script>

<style scoped lang='less'>
.when-add {
  font-size: 14px;
  color: #2F54EB;
  cursor: pointer;
}
</style>
