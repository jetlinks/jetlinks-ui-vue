<template>
  <div>
    <pro-search type='simple' :columns='columns' @search='handleSearch'></pro-search>
    <a-table
        :columns='columns'
        size='small'
        rowKey='id'
        :dataSource='dataSource?.data'
        @change='onChange'
        :pagination="{
                current: (dataSource?.pageIndex || 0) + 1,
                pageSize: dataSource?.pageSize || 12,
                showSizeChanger: true,
                showLessItems: true,
                total: dataSource?.total || 0,
                pageSizeOptions: ['12', '24', '48', '96'],
            }"
        :scroll='{y: 400}'
    >
      <template #bodyCell='{ column, record }'>
        <template v-if="column.key === 'timestamp'">
          {{ dayjs(record.timestamp).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.key === 'value'">
          <ValueRender
              type='table'
              :data='_props.data'
              :value='{ ...record }'
          />
        </template>
        <template v-if='column.key === data?.id'>
          <ValueRender
              type='table'
              :data='_props.data'
              :value='{ ...record }'
          />
        </template>
        <template v-if="column.key === 'numberValue'">
          <ValueRender
              type='table'
              :data='_props.data'
              :value='{ ...record }'
          />
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button
                v-if="
                                showLoad ||
                                (!getType(record?.value) &&
                                    data?.valueType?.bodyType === 'base64')
                            "
                type='link'
                @click='_download(record)'
            >
              <AIcon type='DownloadOutlined'
              />
            </a-button>
            <a-button type='link' @click='showDetail(record)'
            >
              <AIcon type='SearchOutlined'
              />
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal
      :title="$t('Event.index.277611-0')"
      :open='visible'
      @ok='visible = false'
      @cancel='visible = false'
  >
    <div>{{ current?.propertyName }}</div>
    <JsonViewer
        v-if="
                data?.valueType?.type === 'object' ||
                data?.valueType?.type === 'array'
            "
        :expand-depth='5'
        :value='current.formatValue'
    />
    <a-textarea
        v-else-if="data?.valueType?.type === 'file'"
        :value='current.formatValue'
        :row='3'
    />
    <a-input v-else disabled :value='current.formatValue' />
  </a-modal>
</template>

<script lang='ts' setup>
import { getPropertyData } from '../../../../../../../api/instance'
import { useInstanceStore } from '../../../../../../../store/instance'
import dayjs from 'dayjs'
import { getType } from '../index'
import ValueRender from '../ValueRender.vue'
import { JsonViewer } from 'vue3-json-viewer'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const _props = defineProps({
  data: {
    type: Object,
    default: () => {
    }
  },
  time: {
    type: Array,
    default: () => []
  }
})

const instanceStore = useInstanceStore()
const dataSource = ref({
  pageIndex: 0,
  pageSize: 12,
  data: [],
  total: 0
})
const current = ref<any>({})
const visible = ref<boolean>(false)
const params = ref()
const valueType = {
  int: 'number',
  float: 'number',
  short: 'number',
  double: 'number',
  string: 'string',
  boolean: 'select',
  long: 'number',
  date: 'date',
  enum: 'select'
}

const columns = computed(() => {
  const propertyQueryById = (instanceStore.current.features || []).find((i: any) => i.id === 'propertyQueryById')
  const arr: any[] = [
    {
      title: $t('Log.index.848256-1'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      ellipsis: true,
      search: {
        type: 'date'
      }
    },
    {
      title: _props.data?.name || '',
      dataIndex: !!propertyQueryById ? _props.data?.id : ['int', 'float', 'short', 'double'].includes(_props.data.valueType?.type) ? 'numberValue' : 'value',
      key: !!propertyQueryById ? _props.data?.id : ['int', 'float', 'short', 'double'].includes(_props.data.valueType?.type) ? 'numberValue' : 'value',
      ellipsis: true,
      search: {
        type: valueType[_props.data?.valueType?.type as keyof typeof valueType] || 'string',
        options: _props.data.valueType.type === 'boolean'
            ? [
              {
                label: _props.data?.valueType?.trueText,
                value: _props.data?.valueType?.trueValue
              },
              {
                label: _props.data?.valueType?.falseText,
                value: _props.data?.valueType?.falseValue
              }
            ]
            : _props.data?.valueType?.elements?.map((item: any) => {
              return { label: item.text, value: item.value }
            })
      }
    }

  ]
  if (['int', 'float', 'short', 'double'].includes(_props.data.valueType?.type)) {
    arr.push({
      title: $t('Log.index.848256-6'),
      dataIndex: 'originValue',
      key: 'originValue',
      ellipsis: true
    })
  }
  if (_props.data?.valueType?.type != 'geoPoint') {
    arr.push({
      title: $t('Product.index.660348-11'),
      dataIndex: 'action',
      key: 'action'
    })
  }

  return arr
})

const showLoad = computed(() => {
  return (
      _props.data.valueType?.type === 'file' &&
      _props.data?.valueType?.bodyType === 'binary'
  )
})

const handleSearch = (e: any) => {
  params.value = e
  if (e && _props.time?.length) {
    queryPropertyData({
      pageSize: dataSource.value.pageSize || 12,
      pageIndex: 0
    }, e)
  }
}
const showDetail = (item: any) => {
  visible.value = true
  current.value = item
}

const queryPropertyData = async (params: any, terms?: any) => {
  const resp = await getPropertyData(
      instanceStore.current.id,
      _props.data.id,
      {
        ...params,
        sorts: [
          {
            name: 'timestamp',
            order: 'desc'
          }
        ],
        terms: [
          {
            terms: [
              {
                column: 'timestamp',
                termType: 'btw',
                value: _props.time
              }
            ]
          },
          terms ? { ...terms } : {}
        ]
      }
  )
  if (resp.status === 200) {
    dataSource.value = resp.result as any
  }
}

watch(
    () => [_props.data.id, _props.time],
    ([newVal]) => {
      if (newVal && _props.time?.length) {
        queryPropertyData({
          pageSize: 12,
          pageIndex: 0
        })
      }
    },
    {
      deep: true,
      immediate: true
    }
)

const onChange = (_page: any) => {
  queryPropertyData({
    pageSize: _page.pageSize,
    pageIndex: dataSource.value.pageSize === _page.pageSize ? (_page.current ? _page.current - 1 : 0) : 0
  }, params.value)
}

const _download = (record: any) => {
  const downNode = document.createElement('a')
  downNode.download = `${instanceStore.current.name}-${
      _props.data.name
  }${dayjs(new Date().getTime()).format('YYYY-MM-DD-HH-mm-ss')}.txt`
  downNode.style.display = 'none'
  //字符串内容转成Blob地址
  const blob = new Blob([record.value])
  downNode.href = URL.createObjectURL(blob)
  //触发点击
  document.body.appendChild(downNode)
  downNode.click()
  //移除
  document.body.removeChild(downNode)
}
</script>

<style lang='less' scoped>
:deep(.ant-pagination-item) {
  display: none !important;
}

:deep(.ant-pagination-jump-next) {
  display: none !important;
}

:deep(.ant-pagination-jump-prev) {
  display: none !important;
}

:deep(.JSearch-warp) {
  padding: 0 !important;
}
</style>
