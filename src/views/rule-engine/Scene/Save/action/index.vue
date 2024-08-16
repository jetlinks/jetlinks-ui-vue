<template>
  <div class='actions'>
    <div class='actions-title'>
      <span>{{ $t('action.index.5425971-0') }}</span>
      <ShakeLimit
        v-if='props.openShakeLimit'
        v-model:value='FormModel.branches[name].shakeLimit'
      />
    </div>
    <div class='actions-warp'>
      <j-collapse v-model:activeKey='activeKeys'>
        <j-collapse-panel key='1'>
          <template #header>
                          <span>
                              {{ $t('action.index.5425971-1') }}
                              <span class='panel-tip'>
                                  {{ $t('action.index.5425971-2') }}
                              </span>
                          </span>
          </template>
          <div class='actions-list'>
            <List
              type='serial'
              :branchesName='name'
              :parallel='false'
              :actions='
                                  serialArray.length ? serialArray[0].actions : []
                              '
              @add='(_item) => onAdd(_item, false)'
              @delete='(_key) => onDelete(_key, false)'
            />
          </div>
        </j-collapse-panel>
        <j-collapse-panel key='2'>
          <template #header>
                          <span>
                              {{ $t('action.index.5425971-3') }}
                              <span class='panel-tip'>
                                  {{ $t('action.index.5425971-4') }}
                              </span>
                          </span>
          </template>
          <div class='actions-list'>
            <List
              type='parallel'
              :branchesName='name'
              :parallel='true'
              :actions='
                                  parallelArray.length
                                      ? parallelArray[0].actions
                                      : []
                              '
              @add='(_item) => onAdd(_item, true)'
              @delete='(_key) => onDelete(_key, true)'
            />
          </div>
        </j-collapse-panel>
      </j-collapse>
    </div>
  </div>
</template>

<script lang='ts' setup>
import ShakeLimit from '../components/ShakeLimit/index.vue'
import { List } from './ListItem'
import { BranchesThen } from '../../typings'
import { PropType } from 'vue'
import { randomString } from '@/utils/utils'
import { storeToRefs } from 'pinia'
import { useSceneStore } from 'store/scene'
import { Form } from 'jetlinks-ui-components'
import { Modal } from 'ant-design-vue'
import {queryAlarmCount, queryAlarmPage} from "@/api/rule-engine/scene";
import {unBindAlarm, unBindAlarmMultiple} from "@/api/rule-engine/configuration";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const sceneStore = useSceneStore()
const { data: FormModel } = storeToRefs(sceneStore)

const formItemContext = Form.useInjectFormItemContext();
const props = defineProps({
  name: {
    type: Number,
    default: 0
  },
  thenOptions: {
    type: Array as PropType<BranchesThen[]>,
    default: () => []
  },
  openShakeLimit: {
    type: Boolean,
    default: false
  },
  groupIndex: {
    type: Number,
    default: 0
  },
})

const emit = defineEmits(['update', 'add'])

const activeKeys = ref<string[]>(['1'])
const parallelArray = ref<BranchesThen[]>([])
const serialArray = ref<BranchesThen[]>([])
const lock = ref<boolean>(false)

watch(
  () => props.thenOptions,
  (newVal) => {
    parallelArray.value = newVal.filter((item) => item.parallel)
    serialArray.value = newVal.filter((item) => !item.parallel)

    const isSerialActions = serialArray.value.some((item) => {
      return !!item.actions.length
    })

    const isParallelActions = parallelArray.value.some((item) => !!item.actions?.length)

    if (!lock.value && isParallelActions) {
      activeKeys.value = !serialArray.value.length || !isSerialActions ? ['2'] : ['1', '2']
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const onDelete = async (_key: string, _parallel: boolean) => {
  const thenName = props.thenOptions.findIndex(item => item.parallel === _parallel)
  const actionIndex = FormModel.value.branches?.[props.name].then?.[thenName].actions.findIndex(item => item.key === _key)

  if (actionIndex !== -1) {

    const actionItem = FormModel.value.branches?.[props.name].then?.[thenName].actions[actionIndex]

    if (actionItem.executor === 'alarm') {
      const _branchId = FormModel.value.branches?.[props.name].branchId
      const resp = await queryAlarmPage({
        terms: [
          {
            terms: [
              {
                column: 'id$rule-bind-alarm',
                value: `${FormModel.value.id}:${actionItem.actionId || _branchId}`,
              },
              {
                column: 'id$rule-bind-alarm',
                value: `${FormModel.value.id}:${-1}`,
                type: 'or'
              },
            ],
          },
        ]
      })
      if (resp.success && resp.result.total) {
        Modal.confirm({
          title: $t('action.index.5425971-5', [resp.result.total]),
          onOk() {
            const _data = resp.result.data.map(item => {
                return {
                  "alarmId": item.id,
                  "ruleId": FormModel.value.id,
                  "branchIndex": actionItem.actionId
                }
            })
            unBindAlarmMultiple(_data)
            FormModel.value.branches?.[props.name].then?.[thenName].actions.splice(actionIndex!, 1)
            formItemContext.onFieldChange()
          }
        })
      } else {
        FormModel.value.branches?.[props.name].then?.[thenName].actions.splice(actionIndex!, 1)
        formItemContext.onFieldChange()
      }
    } else {
      FormModel.value.branches?.[props.name].then?.[thenName].actions.splice(actionIndex!, 1)
      formItemContext.onFieldChange()
    }
  }
}

const onAdd = (actionItem: any, _parallel: boolean) => {
  const thenName = props.thenOptions.findIndex(item => item.parallel === _parallel)
  if (thenName !== -1) { // 编辑
    // const cacheAction =  props.thenOptions[thenName].actions
    // const indexOf = cacheAction?.findIndex(item => item.key === actionItem.key) || -1
    // if (indexOf !== -1) {
    //   FormModel.value.branches?.[props.name].then?.[thenName].actions.splice(indexOf, 1, actionItem)
    // } else {
    //   FormModel.value.branches?.[props.name].then?.[thenName].actions.push(actionItem)
    // }
    FormModel.value.branches?.[props.name].then?.[thenName].actions.push(actionItem)
  } else { // 新增
    const newThenItem = {
      parallel: _parallel,
      key: randomString(),
      actions: [actionItem]
    }
    FormModel.value.branches?.[props.name].then.push(newThenItem)
  }
  formItemContext.onFieldChange()
}

</script>

<style lang='less' scoped>
.actions {
  .actions-title {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 16px;
    font-weight: 800;
    font-size: 14px;
    line-height: 32px;
  }

  .actions-warp {
    .actions-list {
      width: 100%;
    }
  }

  .panel-tip {
    padding-left: 8px;
    color: rgba(#000, 0.45);
  }
}
</style>
