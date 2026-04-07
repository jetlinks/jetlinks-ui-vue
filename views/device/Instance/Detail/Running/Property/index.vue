<template>
  <a-spin :spinning='loading'>
    <JProTable
      ref='tableRef'
      :columns='columns'
      :request='query'
      modeValue='CARD'
      :params='_params'
      :gridColumns='[2, 4]'
      :bodyStyle="{ padding: '0 0 0 20px' }"
      :scroll='{y : 450}'
    >
      <template #headerLeftRender>
        <a-input-search
          :placeholder="$t('Save.index.912481-5')"
          style='width: 300px; margin-bottom: 10px'
          @search='onSearch'
          v-model:value='value'
          :allowClear='true'
        />
      </template>
      <template #card='slotProps'>
        <PropertyCard
          :data='{ ...slotProps, ...propertyValue[slotProps?.id] }'
          :actions='getActions(slotProps, metric)'
        />
      </template>
      <template #value='slotProps'>
        <ValueRender
          type='table'
          :data='slotProps'
          :value='propertyValue[slotProps?.id]'
        />
      </template>
      <template #time='slotProps'>
        {{ propertyValue[slotProps?.id]?.timeString || '--' }}
      </template>
      <template #action='slotProps'>
        <a-space :size='16'>
          <template v-for='i in getActions(slotProps, metric)' :key='i.key'>
            <a-tooltip v-bind='i.tooltip' v-if="i.key !== 'edit'">
              <a-button
                style='padding: 0'
                type='link'
                :disabled='i.disabled'
                @click='i.onClick && i.onClick(slotProps)'
              >
                <AIcon :type='i.icon' />
              </a-button>
            </a-tooltip>
            <j-permission-button
              :disabled='i.disabled'
              v-else
              :popConfirm='i.popConfirm'
              :tooltip='i.tooltip'
              @click='i.onClick && i.onClick(slotProps)'
              type='link'
              style='padding: 0px'
            >
              <template #icon>
                <AIcon :type='i.icon' />
              </template>
            </j-permission-button>
          </template>
        </a-space>
      </template>
    </JProTable>
  </a-spin>
  <Save v-if='editVisible' @close='editVisible = false' :data='currentInfo' />
  <Indicators
    v-if='indicatorVisible'
    @close='indicatorVisible = false'
    :data='currentInfo'
  />
  <Detail
    v-if='detailVisible'
    :data='currentInfo'
    @close='detailVisible = false'
  />
</template>

<script lang='ts' setup>
import { cloneDeep, groupBy, throttle, toArray } from 'lodash-es'
import { PropertyData } from '../../../typings'
import PropertyCard from './PropertyCard.vue'
import ValueRender from './ValueRender.vue'
import Save from './Save.vue'
import Detail from './Detail/index.vue'
import Indicators from './Indicators.vue'
import { getProperty, queryPropertyMetric } from '../../../../../../api/instance'
import { dashboard } from '../../../../../../api/dashboard'
import { useInstanceStore } from '../../../../../../store/instance'
import { wsClient } from '@jetlinks-web/core'
import { map } from 'rxjs/operators'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const columns = [
  {
    title: $t('Product.index.660348-28'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true
  },
  {
    title: $t('Properties.OtherSetting.237457-26'),
    dataIndex: 'value',
    key: 'value',
    scopedSlots: true
  },
  {
    title: $t('BasicInfo.indev.028379-6'),
    dataIndex: 'time',
    key: 'time',
    scopedSlots: true
  },
  {
    title: $t('Product.index.660348-11'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: true
  }
]

const _data = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const value = ref<string>('')
const dataSource = ref<PropertyData[]>([])
const _dataSource = ref<PropertyData[]>([])
const editVisible = ref<boolean>(false) // 编辑
const detailVisible = ref<boolean>(false) // 详情
const currentInfo = ref<Record<string, any>>({})
const instanceStore = useInstanceStore()
const indicatorVisible = ref<boolean>(false) // 指标
const loading = ref<boolean>(false)
const propertyValue = ref<Record<string, any>>({})
const _params = reactive({
  name: ''
})
const tableRef = ref()
const subRef = ref()
const metric = ref([])

// const list = ref<any[]>([]);

const getActions = (data: Partial<Record<string, any>>, _metric: string[]) => {
  const arr = []
  if (data.expands?.type?.includes('write')) {
    arr.push({
      key: 'edit',
      tooltip: {
        title: $t('Property.index.076208-0')
      },
      icon: 'EditOutlined',
      onClick: () => {
        editVisible.value = true
        currentInfo.value = data
      }
    })
  }
  if (
    _metric.includes(data.id) &&
    [
      'int',
      'long',
      'float',
      'double',
      'string',
      'boolean',
      'date'
    ].includes(data.valueType?.type || '')
  ) {
    arr.push({
      key: 'metrics',
      tooltip: {
        title: $t('Property.index.076208-1')
      },
      icon: 'ClockCircleOutlined',
      onClick: () => {
        indicatorVisible.value = true
        currentInfo.value = data
      }
    })
  }
  if (data.expands?.type?.includes('read')) {
    arr.push({
      key: 'read',
      tooltip: {
        title: $t('Property.index.076208-2')
      },
      icon: 'SyncOutlined',
      onClick: async () => {
        if (instanceStore.current.id && data.id) {
          const resp = await getProperty(
            instanceStore.current.id,
            data.id
          )
          if (resp.status === 200) {
            onlyMessage($t('Product.index.660348-18'))
          }
        }
      }
    })
  }
  arr.push({
    key: 'detail',
    text: $t('Event.index.277611-0'),
    tooltip: {
      title: $t('Event.index.277611-0')
    },
    icon: 'BarsOutlined',
    onClick: () => {
      detailVisible.value = true
      currentInfo.value = data
    }
  })
  return arr
}

const valueChange = (arr: Record<string, any>[]) => {
  (arr || [])
    .sort((a: any, b: any) => a.timestamp - b.timestamp)
    .forEach((item: any) => {
      const { value } = item
      propertyValue.value[value?.property] = { ...item, ...value }
    })
}

let messageCache = new Map()

const throttleFn = throttle(() => {
  const _list = [...messageCache.values()]
  valueChange(_list)
}, 500)

const subscribeProperty = () => {
  const id = `instance-info-property-${instanceStore.current.id}-${
    instanceStore.current.productId
  }-${dataSource.value.map((i: Record<string, any>) => i.id).join('-')}`
  const topic = `/dashboard/device/${instanceStore.current.productId}/properties/realTime`
  subRef.value = wsClient.getWebSocket(id, topic, {
    deviceId: instanceStore.current.id,
    properties: dataSource.value.map((i: Record<string, any>) => i.id),
    history: 1
  })
    ?.pipe(map((res: any) => res.payload))
    .subscribe((payload) => {
      if (payload.value?.property) {
        messageCache.set(payload.value?.property, payload)
        throttleFn()
      }
      // unref(list)
      //     .sort((a: any, b: any) => a.timestamp - b.timestamp)
      //     .forEach((item: any) => {
      //         const { value } = item;
      //         propertyValue.value[value?.property] = {
      //             ...item,
      //             ...value,
      //         };
      //     });
      // list.value = [...list.value, payload];
      // throttle(valueChange(list.value), 500);
    })
}

const getDashboard = async () => {
  if (!dataSource.value?.length) return
  const param = [
    {
      dashboard: 'device',
      object: instanceStore.current.productId,
      measurement: 'properties',
      dimension: 'history',
      params: {
        deviceId: instanceStore.current.id,
        history: 1,
        properties: dataSource.value.map((i: any) => i.id)
      }
    }
  ]
  loading.value = true
  const resp: Record<string, any> = await dashboard(param)
  if (resp.status === 200) {
    const t1 = (resp.result || []).map((item: any) => {
      return {
        timeString: item.data?.timeString,
        timestamp: item.data?.timestamp,
        ...item?.data?.value
      }
    })
    const obj = {}
    toArray(groupBy(t1, 'property'))
      .map((item) => {
        return {
          list: item.sort((a, b) => b.timestamp - a.timestamp),
          property: item[0].property
        }
      })
      .forEach((i) => {
        obj[i.property] = i.list[0]
      })
    propertyValue.value = { ...unref(propertyValue), ...obj }
  }
  subRef.value && subRef.value?.unsubscribe()
  subscribeProperty()
  loading.value = false
}

const query = (params: Record<string, any>) =>
  new Promise((resolve) => {
    const _from = params.pageIndex * params.pageSize
    const _to = (params.pageIndex + 1) * params.pageSize
    let arr = cloneDeep(_dataSource.value)
    if (params?.name) {
      const li = _dataSource.value.filter((i: any) => {
        return i?.name.indexOf(params.name) !== -1
      })
      arr = cloneDeep(li)
    }
    dataSource.value = arr.slice(_from, _to)
    messageCache.clear()
    resolve({
      result: {
        data: dataSource.value,
        pageIndex: params.pageIndex || 0,
        pageSize: params.pageSize || 12,
        total: arr.length
      },
      success: true,
      status: 200
    })
    getDashboard()
  })

const getMetric = async (arr = []) => {
  const resp = await queryPropertyMetric(instanceStore.current.id, arr)
  if (resp.success) {
    metric.value = resp.result.filter((i: any) => i.metrics.length).map((item: any) => item.property)
  }
}

watch(
  () => _data.data,
  (newVal) => {
    if (newVal.length) {
      _dataSource.value = newVal as PropertyData[]
      _params.name = ''
      getMetric(newVal.map(i => i.id))
      tableRef.value?.reload()
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const onSearch = () => {
  _params.name = value.value
}

onUnmounted(() => {
  subRef.value && subRef.value?.unsubscribe()
})
</script>

<style scoped lang='less'>
</style>
