<template>
  <j-modal
    visible
    :title="$t('TriggerAlarm.AlarmModal.5425858-0')"
    :width="1000"
    :keyboard="false"
    :mask="false"
    :maskClosable="false"
    :loading="loading"
    @cancel="onCancel"
    @ok="onOk"
  >
    <pro-search :columns="columns" type="simple" @search="handleSearch" style="padding: 0"/>
    <j-scrollbar :maxHeight="500">
      <JProTable
        model="CARD"
        :columns="columns"
        :request="queryAlarmPage"
        :bodyStyle="{ padding: 0 }"
        :gridColumn="3"
        :defaultParams="{
                  sorts: [{ name: 'createTime', order: 'desc' }],
                  terms: [
                      {
                          terms: [
                              {
                                  column: 'id$rule-bind-alarm$not',
                                  value: `${id}:${actionId || branchId}`,
                              },
                              {
                                column: 'branchIndex$rule-bind-alarm$not',
                                value: `${id}:${-1}`,
                                type: 'and'
                              },
                              {
                                column: targetType === 'device' ? 'targetType$in' : 'targetType',
                                value: targetType === 'device' ? [] : 'other',
                                type: 'and'
                              }
                          ],
                      },
                  ],
              }"
        :rowSelection="{
          selectedRowKeys: selectKeys,
          onSelectNone: cancelSelect
        }"
        :params="params"
      >
        <template #card="slotProps">
          <CardBox
            :value="slotProps"
            :active="selectKeys.includes(slotProps.id)"
            :status="slotProps.state?.value"
            :statusText="slotProps.state?.text"
            :statusNames="{
              enabled: 'processing',
              disabled: 'error',
            }"
            :scroll="{ y: 510 }"
            @click="handleClick"
          >
            <template #img>
              <slot name="img">
                <img
                  src="/images/alarm/alarm-config.png"
                />
              </slot>
            </template>
            <template #content>
              <div style="margin-top: 36px; display: flex;gap: 6px;line-height: 1">
                <LevelIcon :level="slotProps.level" />
                <div style="flex: 1 1 0;min-width: 0">
                  <Ellipsis>
                    {{ slotProps.name }}
                  </Ellipsis>
                </div>
              </div>
            </template>
          </CardBox>
        </template>
      </JProTable>
    </j-scrollbar>
  </j-modal>
</template>

<script setup name="AlarmModal">
import {queryAlarmPage} from '@/api/rule-engine/scene';
import { useAlarmLevel, useRequest } from '@/hook'
import {bindScene, getTargetTypes} from "@/api/rule-engine/configuration";
import {onlyMessage} from "@/utils/comm";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  actionId: {
    type: String,
    default: undefined
  },
  branchId: {
    type: String,
    default: '',
  },
  targetType: {
    type: String
  }
});

const emit = defineEmits(['cancel', 'ok'])

const params = ref({})
const selectKeys = ref([])

const { run, loading } = useRequest(bindScene, {
  immediate: false,
  onSuccess() {
    emit('ok')
    onlyMessage($t('TriggerAlarm.AlarmModal.5425858-1'))
  }
})

const { levelMap, levelList } = useAlarmLevel()

const columns = [
  {
    title: $t('TriggerAlarm.AlarmModal.5425858-2'),
    dataIndex: 'targetType',
    search: {
      type: 'select',
      options: async () => {
        const resp = await getTargetTypes()
        if (resp.success) {
          return resp.result.filter(item => {
            return props.targetType === 'device' || item.id === 'other'
          }).map(item => ({ label: item.name, value: item.id }))
        } else {
          return []
        }
      },
    }
  },
  {
    title: $t('TriggerAlarm.AlarmModal.5425858-3'),
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'string',
    },
    width: 220,
    ellipsis: true,
  },
  {
    title: $t('TriggerAlarm.AlarmModal.5425858-4'),
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {
          label: $t('TriggerAlarm.AlarmModal.5425858-5'),
          value: 'enabled',
        },
        {
          label: $t('TriggerAlarm.AlarmModal.5425858-6'),
          value: 'disabled',
        },
      ],
    },
    width: 90,
  },
  {
    title: $t('TriggerAlarm.AlarmModal.5425858-7'),
    dataIndex: 'level',
    key: 'level',
    scopedSlots: true,
    search: {
      type: 'select',
      options: async () => {
        return levelList.value
      },
    },
    width: 200,
  },

]

const handleSearch = (e) => {
  params.value = e
}

const handleClick = (record) => {
  const selectSet = new Set(selectKeys.value)

  if (selectSet.has(record.id)) {
    selectSet.delete(record.id)
  } else {
    selectSet.add(record.id)
  }

  selectKeys.value = [...selectSet.values()]
}

const cancelSelect = () => {
  selectKeys.value = []
}

const onCancel = () => {
  emit('cancel')
}

const onOk = async () => {
  if (selectKeys.value.length) {
    run(selectKeys.value.map(key => {
      return {
        alarmId: key,
        ruleId: props.id,
        branchIndex: props.actionId
      }
    }))
  } else {
    onlyMessage($t('TriggerAlarm.AlarmModal.5425858-8'), 'warning')
  }

}

</script>

<style scoped>

</style>
