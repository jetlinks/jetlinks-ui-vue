<template>
  <div class='event_container'>
    <pro-search
      class='device-running-search'
      :columns='columns'
      target='device-instance-running-events'
      @search='handleSearch'
      type='simple'
      ref='searchRef'
    />
    <div style='min-height: 0; flex: 1;'>
      <JProTable
        ref='eventsRef'
        :columns='columns'
        :request='_getEventList'
        mode='TABLE'
        :params='params'
        :bodyStyle="{ padding: '0 0 0 24px' }"
        :scroll="{ x: 'max-content' }"
      >
        <template v-for='i in objectKey' #[i.key]='slotProps'>
          <j-ellipsis>
            <span @click='detail(slotProps[i.dataIndex])'>{{ JSON.stringify(slotProps[i.dataIndex]) }}</span>
          </j-ellipsis>
        </template>
        <template #timestamp='slotProps'>
          {{ dayjs(slotProps.timestamp).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #action='slotProps'>
          <a-button type='link' @click='detail(slotProps)'>
            <AIcon type='SearchOutlined' />
          </a-button>
        </template>
      </JProTable>
    </div>
  </div>
  <a-modal
    :width='600'
    v-model:open='visible'
    :title="$t('Event.index.277611-0')"
    class='device-running-event-modal'
  >
    <JsonViewer
      :value='info'
      style='max-height: calc(100vh - 400px); overflow: auto'
    />
    <template #footer>
      <a-button type='primary' @click='visible = false'>{{ $t('Event.index.277611-1') }}</a-button>
    </template>
  </a-modal>
</template>

<script lang='ts' setup>
import dayjs from 'dayjs'
import { getEventList } from '../../../../../../api/instance'
import { useInstanceStore } from '../../../../../../store/instance'
import { JsonViewer } from 'vue3-json-viewer'
import { cloneDeep, omit } from 'lodash-es'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
  data: {
    type: Object,
    default: () => {
    }
  }
})
const instanceStore = useInstanceStore()
const searchRef = ref()
const defaultColumns = [
  {
    title: $t('Event.index.277611-2'),
    dataIndex: 'timestamp',
    key: 'timestamp',
    scopedSlots: true,
    width: 200,
    search: {
      type: 'date'
    }
  },
  {
    title: $t('Event.index.277611-3'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: true,
    fixed: 'right',
    width: 100
  }
]

const params = ref<Record<string, any>>({})
const visible = ref<boolean>(false)
const info = ref<Record<string, any>>({})
const objectKey = ref<any[]>([])

const componentsType = {
  int: 'number',
  long: 'number',
  float: 'number',
  double: 'number',
  string: 'string',
  array: 'string',
  password: 'string',
  enum: 'select',
  boolean: 'select',
  date: 'date',
  object: 'string',
  geoPoint: 'string',
  file: 'string',
  time: 'time'
}

const _getEventList = (_params: any) => getEventList(instanceStore.current.id || '', props.data.id || '', _params)

const columns = computed(() => {
  const eventNotQueryable = (instanceStore.current.features || []).find((i: any) => i.id === 'eventNotQueryable')
  const arr = []
  if (!eventNotQueryable && props.data?.valueType?.type === 'object') {
    const eventProperties = cloneDeep(props.data.valueType?.properties || [])
    eventProperties.reverse().map((i: any) => {
      const obj = {
        key: i.id,
        title: i.name,
        dataIndex: `${i.id}_format`,
        scopedSlots: true,
        ellipsis: true
      }
      if (['object', 'array'].includes(i.valueType?.type)) {
        objectKey.value.push({
          key: i.id,
          dataIndex: `${i.id}_format`
        })
        obj.search = {
          type: 'string',
          rename: i.id
        }
      } else {
        const __arr = i?.valueType?.type === 'boolean' ? [
          {
            label: i?.valueType.falseText,
            value: i?.valueType.falseValue
          },
          {
            label: i?.valueType.trueText,
            value: i?.valueType.trueValue
          }
        ] : (i?.valueType?.elements || []).map((item: any) => {
          return {
            label: item.text,
            value: item.value
          }
        })
        if (!eventNotQueryable) {
          obj.search = {
            type: componentsType?.[i?.valueType?.type] || 'string',
            rename: i.id,
            options: __arr
          }
        }
      }
      arr.push(obj)
    })
  } else {
    arr.push({
      title: $t('Event.index.277611-4'),
      dataIndex: 'value'
    })
  }
  nextTick(() => {
    searchRef.value?.reset?.()
  })
  return [...arr, ...defaultColumns]
})

const handleSearch = (_params: any) => {
  params.value = _params
}

const detail = (_info: any) => {
  info.value = omit(_info, ['column', 'key', 'index'])
  visible.value = true
}
</script>

<style lang='less'>
.device-running-search {
  margin: 0 0 24px 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.device-running-event-modal {
  .ant-modal-body {
    padding: 0 20px;
  }
}

.event_container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
