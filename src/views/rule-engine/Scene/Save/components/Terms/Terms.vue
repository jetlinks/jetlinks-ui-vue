<template>
  <div class='actions-terms'>
    <TitleComponent data='触发条件' style='font-size: 14px;' >
      <template #extra>
        <j-switch
          :checked='open'
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
          <div class='actions-terms-title' style='padding: 0'>
            否则
          </div>
          <div class='actions-terms-options no-when'>
            <AIcon type='PlusOutlined' class='when-add-button' @click='addBranches' />
          </div>
        </div>
      </template>
    </template>
    <j-form-item
      v-else
      :name='["branches", 0, "then"]'
      :rules='rules'
    >

    </j-form-item>
  </div>
</template>

<script setup lang='ts' name='Terms'>
import { storeToRefs } from 'pinia';
import { useSceneStore } from 'store/scene'
import { cloneDeep } from 'lodash-es'
import { provide } from 'vue'
import { ContextKey } from './util'
import { getParseTerm } from '@/api/rule-engine/scene'
import type { FormModelType } from '@/views/rule-engine/Scene/typings'
import Branches from './Branchs.vue'

const sceneStore = useSceneStore()
const { data } = storeToRefs(sceneStore)

const open = ref(false)
const columnOptions = ref<any>([])


provide(ContextKey, columnOptions)

const change = (e: boolean) => {
  open.value = e
}

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

const handleParamsData = (data: any[]): any[] => {
  return data?.map(item => {
    return {
      ...item,
      key: item.column,
      disabled: !!item.children,
      children: handleParamsData(item.children)
    }
  }) || []
}

const queryColumn = (dataModel: FormModelType) => {
  const cloneDevice = cloneDeep(dataModel)
  cloneDevice.branches = cloneDevice.branches?.filter(item => !!item)
  getParseTerm(cloneDevice).then(res => {
      columnOptions.value = handleParamsData(res.result as any[])
  })
}

const addBranches = () => {

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
  console.log(data.value.trigger, data.value.trigger?.device)
  if (data.value.trigger?.device) {
    queryColumn(data.value)
  }
})

watchEffect(() => {
  open.value = !(
    data.value.branches &&
    data.value.branches?.length === 1
  )
})

</script>

<style scoped lang='less'>

</style>