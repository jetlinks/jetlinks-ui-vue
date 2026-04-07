<template>
  <a-drawer open @close="emits('close')" :width="1000" :title="$t('Detail.index.427958-29')">
    <pro-search
        :columns="columns"
        target="iot-card-management-sync-record-search"
        @search="handleSearch"
        style="padding: 0"
        type="simple"
    />
    <FullPage>
      <j-pro-table
          v-if="data.id"
          :columns="columns"
          :request="querySyncLog"
          :defaultParams="{
          sorts: [{ name: 'responseTime', order: 'desc' }]
        }"
          :params="params"
          mode="TABLE"
          style="padding: 0"
      >
<!--        <template #headerCell="{ column }">-->
<!--          <template v-if="column.key === 'usedFlow'">-->
<!--            {{$t('Detail.index.427958-11')}}-->
<!--            <a-tooltip :title="data.comboType?.value !== 'pool' ? $t('CardManagement.index.427944-84') : $t('CardManagement.index.427944-85')">-->
<!--              <AIcon-->
<!--                  type="ExclamationCircleOutlined"-->
<!--                  style="padding-left: 12px;"-->
<!--              />-->
<!--            </a-tooltip>-->
<!--          </template>-->
<!--        </template>-->
        <template #responseTime="slotProps">
          {{slotProps.responseTime ? dayjs(slotProps.responseTime).format('YYYY-MM-DD HH:mm:ss') : "--"}}
        </template>
        <template #source="slotProps">
          {{slotProps.source === 'manual' ? $t('CardManagement.index.427944-82') : $t('CardManagement.index.427944-83')}}
        </template>
        <template #flowPercentage="slotProps">
          {{slotProps.flowPercentage !== undefined ? `${slotProps.flowPercentage.toFixed(2)}%` : '--'}}
        </template>
        <template #usedFlow="slotProps">
          {{slotProps.usedFlow !== undefined ? `${slotProps.usedFlow.toFixed(2)}M` : '--'}}
        </template>
        <template #residualFlow="slotProps">
          {{slotProps.residualFlow !== undefined ? `${slotProps.residualFlow.toFixed(2)}M` : '--'}}
        </template>
        <template #poolResidualFlow="slotProps">
          {{slotProps.poolResidualFlow !== undefined ? `${slotProps.poolResidualFlow.toFixed(2)}M` : '--'}}
        </template>
        <template #poolTotalFlow="slotProps">
          {{slotProps.poolTotalFlow !== undefined ? `${slotProps.poolTotalFlow.toFixed(2)}M` : '--'}}
        </template>
        <template #totalFlow="slotProps">
          {{slotProps.totalFlow !== undefined ? `${slotProps.totalFlow.toFixed(2)}M` : '--'}}
        </template>
        <template #exceeded="slotProps">
          {{ ((slotProps.usedFlow || 0) - (slotProps.totalFlow || 0)) > 0 ? `${((slotProps.usedFlow || 0) - (slotProps.totalFlow || 0))}M` : "--" }}
        </template>
      </j-pro-table>
      <j-empty v-else/>
    </FullPage>
  </a-drawer>
</template>

<script setup>
import {querySyncLog} from "@device-manager-ui/api/iot-card/cardManagement";
import {useI18n} from "vue-i18n";
import dayjs from "dayjs";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['close'])

const {t: $t} = useI18n();

const columns = computed(() => {
  const flag = props.data.comboType?.value === 'pool'
  const arr = flag ? [
    {
      title: $t('TrafficPoolManagement.Detail.index.390590-43'),
      dataIndex: 'poolResidualFlow',
      key: 'poolResidualFlow',
      ellipsis: true,
      scopedSlots: true,
      width: 120,
      search: {
        type: 'number',
      }
    },
    {
      title: $t('TrafficPoolManagement.Detail.index.390590-42'),
      key: 'poolTotalFlow',
      dataIndex: 'poolTotalFlow',
      ellipsis: true,
      scopedSlots: true,
      search: {
        type: 'number',
      }
    },
  ] : [
    {
      title: $t('Detail.index.427958-12'),
      dataIndex: 'residualFlow',
      key: 'residualFlow',
      ellipsis: true,
      scopedSlots: true,
      width: 120,
      search: {
        type: 'number',
      }
    },
    {
      title: $t('CardManagement.index.427944-12'),
      key: 'totalFlow',
      dataIndex: 'totalFlow',
      ellipsis: true,
      scopedSlots: true,
      search: {
        type: 'number',
      }
    },
  ]
  return [
    {
      title: $t('CardManagement.index.427944-16'),
      dataIndex: 'responseTime',
      key: 'responseTime',
      scopedSlots: true,
      width: 180,
      search: {
        type: 'date'
      }
    },
    {
      title: $t('CardManagement.Sync.427942-4'),
      dataIndex: 'source',
      key: 'source',
      width: 120,
      ellipsis: true,
      scopedSlots: true,
      search: {
        type: 'select',
        options: [
          {
            label: $t('CardManagement.index.427944-82'),
            value: 'manual'
          },
          {
            label: $t('CardManagement.index.427944-83'),
            value: 'auto'
          }
        ]
      }
    },
    {
      title: $t('Detail.index.427958-11'),
      dataIndex: 'usedFlow',
      key: 'usedFlow',
      width: 120,
      ellipsis: true,
      scopedSlots: true,
      search: {
        type: 'number',
      }
    },
    {
      title: $t('CardManagement.Sync.427942-3'),
      dataIndex: 'exceeded',
      key: 'exceeded',
      ellipsis: true,
      scopedSlots: true,
      width: 120,
    },
    ...arr,
    {
      title: $t('CardManagement.Sync.427942-5'),
      dataIndex: 'flowPercentage',
      key: 'flowPercentage',
      ellipsis: true,
      scopedSlots: true,
      width: 100,
    },
  ]
})

const params = ref({
  "terms": [
    {
      "value": false,
      "termType": "eq",
      "column": "error",
      "terms": [
        {
          "value": props.data?.id,
          "termType": "eq",
          "column": "cardId",
        }
      ]
    }
  ]
})
const handleSearch = (e) => {
  params.value = {
    "terms": [
      {


        "value": false,
        "termType": "eq",
        "column": "error",
        "terms": [
          {
            "value": props.data?.id,
            "termType": "eq",
            "column": "cardId",
            "terms": e.terms || []
          }
        ]
      },
    ]
  }
}
</script>

<style lang="less" scoped>

</style>
