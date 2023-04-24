<template>
  <div class='actions-terms'>
    <TitleComponent data='触发条件' style='font-size: 14px;' >
      <template #extra>
        <j-switch
          v-model:checked='open'
          @change='change'
          checkedChildren='开'
          unCheckedChildren='关'
          style='margin-left: 4px;'
        />
      </template>
    </TitleComponent>
    <template v-if='open'>
      <template v-for='(item, index) in data.branches'>
        <Branches
          v-if='!!item'
          :data='item'
          :isFirst='index === 0'
          :name='index'
          :key='item.key'
          @delete='branchesDelete'
          @deleteAll='branchesDeleteAll'
        />
        <div v-else class='actions-terms-warp' :style='{ marginTop: data.branches.length === 2 ? 0 : 24 }'>
          <div class='actions-terms-title' style='padding: 0;margin-bottom: 24px;'>
            否则
          </div>
          <div class='actions-terms-options no-when'>
            <AIcon type='PlusOutlined' class='when-add-button' @click='addBranches' />
          </div>
        </div>
      </template>
    </template>
    <div v-else class='actions-branches-item'>
      <j-form-item
        :name='["branches", 0, "then"]'
        :rules='thenRules'
      >
        <Action
          :name='0'
          :openShakeLimit="true"
          :thenOptions='data.branches[0]?.then'
        />
      </j-form-item>
    </div>
  </div>
</template>

<script setup lang='ts' name='Terms'>
import { storeToRefs } from 'pinia';
import { useSceneStore } from 'store/scene'
import { cloneDeep } from 'lodash-es'
import { provide } from 'vue'
import { ContextKey, handleParamsData, thenRules } from './util'
import { getParseTerm } from '@/api/rule-engine/scene'
import type { FormModelType } from '@/views/rule-engine/Scene/typings'
import Branches from './Branches.vue'
import Action from '../../action/index.vue'

const sceneStore = useSceneStore()
const { data } = storeToRefs(sceneStore)
const open = ref<boolean>(false)
const columnOptions = ref<any>([])

provide(ContextKey, columnOptions)

const change = (e: boolean) => {
  if (!e) {
    data.value.branches!.length = 1
    data.value.branches![0].when = []
  } else {
    data.value.branches!.push(null as any)
    data.value.branches![0].when = [
      {
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
          },
        ],
        type: 'and',
        key: 'terms_1',
      },
    ]
  }
}

const queryColumn = (dataModel: FormModelType) => {
  const cloneDevice = cloneDeep(dataModel)
  cloneDevice.branches = cloneDevice.branches?.filter(item => !!item)
  getParseTerm(cloneDevice).then(res => {
      columnOptions.value = handleParamsData(res.result as any[])
  })
}

const addBranches = () => {
  const branchesItem = {
    when: [],
    key: `branches_${new Date().getTime()}`,
    shakeLimit: {
      enabled: false,
      time: 1,
      threshold: 1,
      alarmFirst: false,
    },
    then: [],
  }
  const lastIndex = data.value.branches!.length - 1 || 0
  data.value.branches?.splice(lastIndex, 1, branchesItem)
  data.value.options!.when = []
}

const branchesDelete = (index: number) => {
  if (data.value.branches?.length === 2) {
    data.value.branches?.splice(index, 1, null as any)
  } else {
    data.value.branches?.splice(index, 1)
  }
  data.value.options?.when?.splice(index, 1)
}

const branchesDeleteAll = () => {

}

watchEffect(() => {
  if (data.value.trigger?.device) {
    queryColumn({ trigger: data.value.trigger })
  }
})

watchEffect(() => {
  if (data.value.branches?.filter(item => item).length) {
    open.value = !!data.value.branches[0].when.length
  } else {
    open.value = true
  }
})

</script>

<style scoped lang='less'>

</style>