<template>
  <a-modal
    open
    :title="$t('Detail.index.805835-0')"
    :width="1200"
    :closable="false"
    :maskClosable="false"
  >
    <div class="generalInfo">
      <div class="body-header">
        <a-space>
          <div class="header-title">
            <j-ellipsis>
              {{ data.name || '--' }}
            </j-ellipsis>
          </div>
          <div class="header-status bg-color-200">
            <j-badge-status
              :text="data.state?.text"
              :status="data.state?.value"
              :statusNames="{
                ...colorMap
              }"
            ></j-badge-status>
          </div>
        </a-space>
        <a-space>
          <div>
            {{ dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div class="body-count bg-color-200">
            <div>
              <a-space>
                <AIcon
                  type="icon-chanpin1"
                  style="font-size: 16px"
                />
                <label class="text-color-500">{{ $t('Save.index.646914-7') }}</label>
                <span class="text-color-900">{{ data.mode?.text }}</span>
              </a-space>
            </div>
          </div>
        </a-space>
      </div>
      <div>
        <j-ellipsis>{{ data.description }}</j-ellipsis>
      </div>
      <div class="progress">
        <div style="width: 100%">
          <div
            class="progress--warp"
            :style="progressStyles"
          ></div>
        </div>
      </div>
      <div style="margin-bottom: 16px">
        <a-space size="large">
          <a-space
            v-for="item in taskState.filter((item) => data[item.value])"
            :key="item.value"
          >
            <AIcon
              :type="iconMap[item.value]"
              :style="{ color: `${colorMap[item.value] ? colorMap[item.value] : '#646C73'}` }"
            ></AIcon>
            <label>
              {{ item.label }}
            </label>
            <span>
              {{ data[item.value] }}
            </span>
          </a-space>
        </a-space>
      </div>
      <div class="allOperation">
        <a-space>
          <template v-if="['product', 'firmware'].includes(types)">
            <j-permission-button
              @click="stopAll"
              :disabled="!historyList?.some((item) => item.state?.value === 'waiting')"
              hasPermission="device/Firmware:update"
            >
              <template #icon><AIcon type="PauseOutlined" /></template>
              {{ $t('Detail.index.805835-1') }}
            </j-permission-button>
            <j-permission-button
              hasPermission="device/Firmware:update"
              :disabled="!historyList?.some((item) => item.state?.value === 'canceled')"
              @click="startAll"
            >
              <template #icon><AIcon type="CaretRightOutlined" /></template>
              {{ $t('Detail.index.805835-2') }}
            </j-permission-button>
            <j-permission-button
              :disabled="!historyList?.some((item) => item.state?.value === 'failed')"
              hasPermission="device/Firmware:update"
              @click="batchRetry"
            >
              <template #icon><AIcon type="RedoOutlined" /></template>
              {{ $t('Detail.index.805835-3') }}
            </j-permission-button>
          </template>
          <j-permission-button
            hasPermission="device/Firmware:update"
            @click="refreshState"
          >
            <template #icon><AIcon type="RedoOutlined" /></template>
            {{ $t('Detail.index.805835-4') }}
          </j-permission-button>
        </a-space>
        <a-space style="float: right">
          <j-permission-button
            v-if="types === 'firmware'"
            hasPermission="device/Firmware:update"
            style="float: right"
            :disabled="historyList?.some((item) => ['waiting', 'processing'].includes(item.state?.value))"
            danger
            :popConfirm="{
              title: $t('Instance.index.133466-3'),
              onConfirm: () => {
                emit('delete', data.id)
              }
            }"
          >
            <template #icon><AIcon type="DeleteOutlined" /></template>
            {{ $t('Save.index.646914-24') }}
          </j-permission-button>
          <div v-if="types === 'device'">
            <AIcon type="InfoCircleOutlined"></AIcon>
            {{ $t('Firmware.index.858355-14') }}
          </div>
        </a-space>
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="historyList"
      :pagination="false"
      :rowClassName="rowClassName"
      :scroll="{
        y: 400
      }"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'deviceName' || column.dataIndex === 'productName'">
          <j-ellipsis style="width: 100%">{{ text }}</j-ellipsis>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          <j-ellipsis style="width: 100%">{{ dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}</j-ellipsis>
        </template>
        <template v-if="column.dataIndex === 'completeTime'">
          <j-ellipsis style="width: 100%">{{ text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '--' }}</j-ellipsis>
        </template>
        <template v-if="column.dataIndex === 'state'">
          <span :style="{ color: `${colorMap[text.value] ? colorMap[text.value] : '#646C73'}` }">
            <a-space>
              <AIcon :type="iconMap[text.value]"></AIcon>
              <span>{{ text.text }}</span>
            </a-space>
            <span v-if="text.value === 'failed'">：{{ record.errorReason }}</span>
            <span v-else-if="!['waiting', 'canceled'].includes(text.value)">：{{ record.progress }}%</span>
          </span>
        </template>
        <template v-if="column.dataIndex === 'version'">
          <j-ellipsis>
            {{ text || '--' }}
          </j-ellipsis>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <template v-if="['waiting', 'running'].includes(record.state.value)">
            <j-permission-button
              type="link"
              :hasPermission="record.hasEditPermission"
              :tooltip="{
                title: $t('Task.index.219743-11')
              }"
              @click="stopUpgrades(record.id)"
            >
              <template #icon>
                <AIcon type="PauseCircleOutlined" />
              </template>
            </j-permission-button>
          </template>
          <template v-if="record.state.value === 'canceled'">
            <j-permission-button
              type="link"
              :hasPermission="record.hasEditPermission"
              :tooltip="{
                title: $t('Task.index.219743-12')
              }"
              @click="startUpgrades(record.id)"
            >
              <template #icon>
                <AIcon type="PlayCircleOutlined" />
              </template>
            </j-permission-button>
          </template>
          <template v-if="record.state.value === 'failed'">
            <j-permission-button
              type="link"
              :tooltip="{
                title: $t('Task.index.219743-13')
              }"
              :hasPermission="record.hasEditPermission"
              @click="startUpgrades(record.id)"
            >
              <template #icon>
                <AIcon type="RedoOutlined" />
              </template>
            </j-permission-button>
          </template>
          <j-permission-button
            type="link"
            danger
            :disabled="['waiting', 'processing'].includes(record.state.value)"
            :hasPermission="record.hasDeletePermission"
            :tooltip="{
              title: $t('Task.index.219743-14')
            }"
            :popConfirm="{
              title: $t('Instance.index.133466-3'),
              onConfirm: () => {
                deleteUpgrades(record.id)
              }
            }"
          >
            <template #icon>
              <AIcon type="DeleteOutlined"></AIcon>
            </template>
          </j-permission-button>
        </template>
      </template>
    </a-table>
    <template #footer>
      <span class="tip">{{ $t('Detail.index.805835-8') }}</span>
      <a-button
        value="large"
        type="primary"
        @click="$emit('closeDetail')"
      >
        {{ $t('Detail.index.805835-9') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script setup name="TaskDetail">
import {
  historyPaginateNot,
  stopTask,
  startTask,
  startOneTask,
  stopOneTask,
  deleteHistory
} from '../../../../../api/firmware'
import dayjs from 'dayjs'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n'
import { theme } from 'ant-design-vue'

const { t: $t } = useI18n()
const { token } = theme.useToken()

const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
  deviceId: {
    type: String
  },
  taskState: {
    type: Array,
    default: () => []
  },
  types: {
    type: String,
    default: 'product'
  }
})
const emit = defineEmits(['closeDetail', 'refresh', 'delete'])
const columns = computed(() => {
  const arr = [
    {
      title: $t('Status.DiagnosticAdvice.980298-4'),
      dataIndex: 'deviceId',
      key: 'deviceId',
      ellipsis: true,
      width: 150
    },
    {
      title: $t('Detail.index.805835-10'),
      dataIndex: 'deviceName',
      key: 'deviceName'
    },
    {
      title: $t('Detail.index.805835-11'),
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: $t('Task.index.219743-4'),
      key: 'responseTimeoutSeconds',
      dataIndex: 'responseTimeoutSeconds'
    },
    {
      title: $t('Task.index.219743-5'),
      key: 'timeoutSeconds',
      dataIndex: 'timeoutSeconds'
    },
    {
      title: $t('Detail.index.805835-13'),
      key: 'completeTime',
      dataIndex: 'completeTime'
    },
    {
      title: $t('Detail.index.805835-14'),
      key: 'version',
      dataIndex: 'version',
      width: 100
    },
    {
      title: $t('Detail.index.805835-15'),
      dataIndex: 'state',
      width: 300,
      key: 'state'
    },
    {
      title: $t('Product.index.660348-11'),
      key: 'action',
      dataIndex: 'action'
    }
  ]
  if (props.data.mode?.value === 'pull') {
    arr.splice(3, 1)
  }
  return arr
})

//列表数据
const historyList = ref()
//总进度
const general = reactive({
  total: 0,
  percent: 0
})
const rowClassName = (record, index) => {
  return record.deviceId === props.deviceId ? 'heightLightRow' : ''
}

const colorMap = {
  waiting: token.value.colorPrimary,
  processing: token.value.colorWarning,
  failed: token.value.colorError,
  success: token.value.colorSuccess
}

const iconMap = {
  processing: 'ClockCircleFilled',
  success: 'CheckCircleFilled',
  canceled: 'PauseCircleFilled',
  waiting: 'icon-paiduizhong',
  failed: 'InfoCircleFilled'
}

const progressStyles = computed(() => {
  const value = {
    primary: ((props.data?.waiting || 0) / props.data?.total) * 100,
    success: ((props.data?.success || 0) / props.data?.total) * 100,
    error: ((props.data?.failed || 0) / props.data?.total) * 100,
    warning: ((props.data?.processing || 0) / props.data?.total) * 100
  }
  const color = {
    primary: token.value.colorPrimary,
    success: token.value.colorSuccess,
    error: token.value.colorError,
    warning: token.value.colorWarning
  }
  const bgi = Object.keys(value).reduce((prev, key, index) => {
    const v = Object.values(value)
      .splice(0, index + 1)
      .reduce((a, b) => a + b, 0)
    prev += `${color[key]} 0, ${color[key]} ${v}%,`
    return prev
  }, '')

  return {
    'background-image': 'linear-gradient(270deg,' + bgi + '#EFF0F1 0, #EFF0F1 100%)'
  }
})

//查询任务升级记录列表
const queryHistoryList = async () => {
  const params = {
    paging: false,
    sorts: [
      { name: 'createTime', order: 'desc' },
      { name: 'upgradeTime', order: 'desc' },
      { name: 'id', order: 'desc' }
    ],
    terms: [
      {
        terms: [
          {
            column: 'taskId',
            value: props?.data?.id
          }
        ]
      },
      {
        terms: [
          {
            column: 'deviceId',
            value: props?.deviceId
          }
        ]
      }
    ]
  }
  const res = await historyPaginateNot(params)
  if (res.status === 200) {
    historyList.value = res.result
    general.total = res.result.length
    let progress = 0
    res.result.forEach((item) => {
      item?.state?.value === 'success' ? (progress += 1) : ''
    })
    general.percent = (progress / general.total).toFixed(2) * 100
  }
}
const refreshState = async () => {
  emit('refresh')
  await queryHistoryList()
  onlyMessage($t('Detail.index.805835-16'))
}
//全部开始
const startAll = async () => {
  // const state =
  //     props.data?.mode?.value === 'push'
  //         ? ['canceled', 'failed']
  //         : ['canceled'];
  const res = await startTask(props.data.id, ['canceled'])
  if (res.success) {
    onlyMessage($t('Detail.index.805835-16'), 'success')
    queryHistoryList()
    emit('refresh')
  }
}
//全部重试
const batchRetry = async () => {
  const res = await startTask(props.data.id, ['failed'])
  if (res.success) {
    onlyMessage($t('Detail.index.805835-16'), 'success')
    queryHistoryList()
    emit('refresh')
  }
}
//全部停止
const stopAll = async () => {
  const res = await stopOneTask(
    historyList.value.filter((item) => item.state.value === 'waiting').map((item) => item.id)
  )
  if (res.success) {
    onlyMessage($t('Detail.index.805835-16'), 'success')
    queryHistoryList()
    emit('refresh')
  }
}
//升级某个记录
const startUpgrades = async (id) => {
  const res = await startOneTask([id])
  if (res.success) {
    onlyMessage($t('Detail.index.805835-16'), 'success')
    queryHistoryList()
    emit('refresh')
  }
}
//停止某个记录
const stopUpgrades = async (id) => {
  const res = await stopOneTask([id])
  if (res.success) {
    onlyMessage($t('Detail.index.805835-16'), 'success')
    queryHistoryList()
    emit('refresh')
  }
}

//删除某个记录
const deleteUpgrades = async (id) => {
  if (historyList.value.length === 1) {
    emit('delete', props.data.id)
    return
  }
  const res = await deleteHistory(id)
  if (res.success) {
    refreshState()
  }
}

onMounted(() => {
  queryHistoryList()
})
</script>
<style lang="less" scoped>
.generalInfo {
  margin-bottom: 30px;
  .progress {
    width: 100%;
    line-height: 32px;
    display: flex;
  }
  .allOperation {
    margin-bottom: 20px;
  }
}
.tip {
  color: rgb(170, 170, 170);
  margin-right: 10px;
}
.state {
  display: flex;
}
.progress--warp {
  height: 6px;
  border-radius: 3px;
  position: relative;
  margin: 16px 0;
}
.body-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: space-between;
  .header-title {
    font-size: 16px;
    color: @font-gray-900;
    font-weight: 500;
    max-width: 300px;
  }

  .header-status {
    padding: 2px 8px;
    border-radius: 4px;
  }

  .header-action {
    margin-left: auto;
  }
  .body-count {
    display: flex;
    padding: 8px 24px;
    border-radius: 6px;
    > div {
      flex: 1;
      min-width: 0;
    }
  }
}
</style>
<style>
.heightLightRow {
  background-color: #e6f4ff;
}
</style>
