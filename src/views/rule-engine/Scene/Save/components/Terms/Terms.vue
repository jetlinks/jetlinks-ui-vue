<template>
  <div class='actions-terms'>
    <TitleComponent data='执行动作' style='font-size: 14px;' >
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
<!--    <template v-if='open'>-->
      <div>
        <j-tabs type="editable-card" v-model:activeKey="activeKey" @edit="addGroup" @tabClick="showEditCondition">
          <j-tab-pane
            v-for="(b, i) in group"
            :key="b.id"
            :closable="false"
          >
            <template #tab>
              <TermsTabPane :showClose="group.length > 1" @close="() => addGroup(b.id, 'close')">
                {{ b.branchName || `条件${i+1}` }}
              </TermsTabPane>
            </template>
            <template v-for='(item, index) in data.branches'>
              <template v-if="index >= b.start && index < (b.start + b.len)">
                <Branches
                  v-if='!!item'
                  :data='item'
                  :isFirst='index === b.start'
                  :name='index'
                  :branches_Index='item.branches_Index'
                  :groupLen="b.start + b.len"
                  :groupIndex="i"
                  :key='item.key'
                  :showGroupDelete="group.length !== 1"
                  @delete='branchesDelete'
                  @deleteAll='branchesDeleteAll'
                />
                <div v-else class='actions-terms-warp' :style='{ marginTop: data.branches.length === 2 ? 0 : 24 }'>
                  <div class='actions-terms-title' style='padding: 0;margin-bottom: 24px;'>
                    否则
                  </div>
                  <div class='actions-terms-options no-when'>
                    <AIcon type='PlusOutlined' class='when-add-button' @click='() => addBranches(b.start + b.len)' />
                  </div>
                </div>
              </template>
            </template>
          </j-tab-pane>
        </j-tabs>
      </div>

<!--    </template>-->
<!--    <div v-else class='actions-branches-item'>-->
<!--      <j-form-item-->
<!--        :name='["branches", 0, "then"]'-->
<!--        :rules='thenRules'-->
<!--      >-->
<!--        <Action-->
<!--          :name='0'-->
<!--          :openShakeLimit="true"-->
<!--          :thenOptions='data.branches[0]?.then'-->
<!--        />-->
<!--      </j-form-item>-->
<!--    </div>-->
  </div>
  <j-modal
    v-if="editConditionVisible"
    visible
    title="编辑"
    :keyboard="false"
    :maskClosable="false"
    @cancel="editConditionVisible = false"
    @ok="changeBranchName"
  >
    <j-form layout='vertical'>
      <j-form-item label="条件名称：" :required="true">
        <j-input v-model:value="conditionName"></j-input>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script setup lang='ts' name='Terms'>
import { storeToRefs } from 'pinia';
import { useSceneStore } from '@/store/scene'
import { cloneDeep } from 'lodash-es'
import { provide } from 'vue'
import { ContextKey, handleParamsData } from './util'
import { getParseTerm } from '@/api/rule-engine/scene'
import type { FormModelType } from '@/views/rule-engine/Scene/typings'
import Branches from './Branches.vue'
import {randomString} from "@/utils/utils";
import TermsTabPane from './TermsTabPane.vue'


const sceneStore = useSceneStore()
const { data } = storeToRefs(sceneStore)
const open = ref<boolean>(false)
const columnOptions = ref<any>([])
const group = ref<Array<{ id: string, len: number}>>([])
const activeKey = ref('')
const editConditionVisible = ref(false);
const conditionName = ref<any>('')

provide(ContextKey, columnOptions)

const change = (e: boolean) => {
  group.value = []
  activeKey.value = ''
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
            key: `params_${randomString()}`,
            type: 'and',
          },
        ],
        type: 'and',
        key: `terms_${randomString()}`,
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

const addBranches = (len: number) => {
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
    branchId: Math.floor(Math.random() * 100000000)
  }
  // const lastIndex = data.value.branches!.length - 1 || 0
  data.value.branches?.splice(len - 1, 1, branchesItem)
  data.value.options!.when.splice(len - 1, 1, {
    terms: []
  })
  // data.value.options!.when = []
}

const branchesDelete = (index: number) => {
  if (data.value.branches?.length === 2) {
    data.value.branches?.splice(index, 1, null as any)
  } else {
    data.value.branches?.splice(index, 1)
  }
  data.value.options?.when?.splice(index, 1)
}

const addGroup = (targetKey: string, action: string) => {
  if (action === 'add') {
    const lastGroup = group.value[group.value.length - 1]
    const lastIndex = (lastGroup?.groupIndex || group.value.length) + 1
    const branchName =  '条件' +  lastIndex
    const key = `branches_${randomString()}`

    const branchesItem: any = {
      when: [
        {
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
            },
          ],
          type: 'and',
          key: `terms_${randomString()}`,
        },
      ],
      key: key,
      shakeLimit: {
        enabled: false,
        time: 1,
        threshold: 1,
        alarmFirst: false,
      },
      then: [],
      executeAnyway: true,
      branchId: Math.floor(Math.random() * 100000000),
      branchName
    }
    data.value.branches?.push(branchesItem, null)
    // data.value.branches?.push(null as any)
    activeKey.value = `group_${branchesItem.key}`
    data.value.options!.when.push({
      terms: [{
        terms: [['','eq','','and']],
      }],
      branchName,
      key,
      executeAnyway: true,
      groupIndex: lastIndex
    })
  } else {
    const index = group.value.findIndex(item => item.id === targetKey)
    groupDelete(group.value[index], index)
  }
}

const branchesDeleteAll = () => {

}

const groupDelete = (g: any, index: number) => {
  let _index = index - 1
  if (_index < 0) { // 左移
    _index = 0
  }

  group.value.splice(index, 1)
  data.value.branches.splice(g.start, g.len)
  data.value.options!.when.splice(g.start, g.len)
  activeKey.value = group.value[_index].id
}

const showEditCondition = (key:any) =>{
  if(key === activeKey.value){
    editConditionVisible.value = true;
    conditionName.value = group.value.find((i:any)=>{
      return i.id === key
    })?.branchName
  }
}

const changeBranchName = () =>{
  let _activeKey = activeKey.value.replace('group_', '')
  data.value.branches?.forEach((item:any)=>{
     if(item?.key === _activeKey){
      item.branchName = conditionName.value
     }
  })

  data.value.options!.when.forEach(item => {
    if (item.key === _activeKey) {
      item.branchName = conditionName.value
    }
  })

  editConditionVisible.value =false
}
watchEffect(() => {
  if (data.value.trigger?.device) {
    queryColumn({ trigger: data.value.trigger })
  }
})

watchEffect(() => {
  const branches = data.value.branches

  if (data.value.branches?.filter(item => item).length) {
    open.value = !!data.value.branches[0].when.length
  } else {
    open.value = true
  }

  let _group = []
  if (branches) {
    branches.forEach((item, index) => {
      // if (index === 0) {
      //   _group.push({
      //     id: `group_${item.key}`,
      //     len: 0,
      //     start: 0,
      //   })
      // }

      const lastIndex = _group.length - 1
      const whenItem = data.value.options!.when.find(whenItem => item && whenItem.key === item.key)

      if (index === 0 || item?.executeAnyway) {
        _group[lastIndex + 1] = {
          id: `group_${item.key}`,
          len: 1,
          start: index,
          branchName: item.branchName,
          groupIndex: whenItem?.groupIndex
        }
      } else {
        _group[lastIndex].len += 1
      }
    })

    branches.filter(item => item).forEach((item, index) => {
      item.branches_Index = index
    })

    group.value = _group
    if (!activeKey.value) {
      activeKey.value = _group[0].id
    }
  }
})

</script>

<style scoped lang='less'>
.actions-terms {
  :deep(.ant-tabs-tab-active) {
    .ant-tabs-tab-remove {
      color: #fff;
    }
  }
}
</style>
