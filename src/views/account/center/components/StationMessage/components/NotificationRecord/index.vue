<template>
  <div class="notification-record-container">
    <pro-search
      :columns="columns"
      :target="type"
      style="padding: 0"
      @search="(e) => (queryParams = e)"
    />
    <j-pro-table
      ref="tableRef"
      :columns="columns"
      :request="getList_api"
      mode="TABLE"
      :params="queryParams"
      :bodyStyle="{ padding: 0 }"
      :defaultParams="defaultParams"
      :scroll="{ y: 420 }"
    >
<!--      <template #headerRightRender>-->
<!--        <a-popconfirm title="确认全部已读？" @confirm="on">-->
<!--          <a-button type="link">全部已读</a-button>-->
<!--        </a-popconfirm>-->
<!--      </template>-->
      <template #topicProvider="slotProps">
        {{ slotProps.topicName }}
      </template>
      <template #notifyTime="slotProps">
        {{ dayjs(slotProps.notifyTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #state="slotProps">
        <j-badge-status
          :status="slotProps.state.value"
          :text="slotProps.state.text"
          :statusNames="{
            read: 'success',
            unread: 'error',
          }"
        ></j-badge-status>
      </template>
      <template #action="slotProps">
        <a-space :size="16">
          <j-permission-button
            type="link"
            :popConfirm="{
              title: $t('NotificationRecord.index.803553-0', [slotProps.state.value === 'read' ? $t('NotificationRecord.index.803553-8') : $t('NotificationRecord.index.803553-9')]),
              onConfirm: () => changeStatus(slotProps),
            }"
            :tooltip="{
              title: slotProps.state.value === 'read' ? $t('NotificationRecord.index.803553-1') : $t('NotificationRecord.index.803553-2'),
            }"
          >
            <AIcon type="icon-a-PIZHU1" />
          </j-permission-button>
          <j-permission-button
            type="link"
            :tooltip="{
              title: $t('NotificationRecord.index.803553-3'),
            }"
            @click="view(slotProps)"
          >
            <AIcon type="SearchOutlined" />
          </j-permission-button>
        </a-space>
      </template>
    </j-pro-table>
    <ViewDialog
      v-if="viewVisible"
      v-model:visible="viewVisible"
      :data="viewItem"
      :type="type"
    />
  </div>
</template>

<script setup lang="ts" name="NotificationRecord">
import ViewDialog from './components/ViewDialog.vue'
import { getList_api, changeStatus_api } from '@/api/account/notificationRecord'
import dayjs from 'dayjs'
import { useUserStore } from '@/store/user'
import { useRouterParams } from '@jetlinks-web/hooks'
import { getTypeListNew } from '@/api/account/notificationSubscription'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const user = useUserStore()

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  children: {
    type: Array,
    default: () => ([])
  }
})

const getType = computed(() => {
  return props.children.map(item => item.provider)
  // if (props.type === 'system-business') {
  //   return ['device-transparent-codec']
  // } else if (props.type === 'system-monitor') {
  //   return ['system-event']
  // } else if (props.type === 'workflow-notification') {
  //   return [
  //     'workflow-task-cc',
  //     'workflow-task-todo',
  //     'workflow-task-reject',
  //     'workflow-process-finish',
  //     'workflow-process-repealed',
  //     'workflow-task-transfer-todo',
  //   ]
  // } else {
  //   return [
  //     'alarm',
  //     'alarm-product',
  //     'alarm-device',
  //     'alarm-other',
  //     'alarm-org',
  //   ]
  // }
})

const columns = [
  {
    title: $t('NotificationRecord.index.803553-4'),
    dataIndex: 'topicProvider',
    key: 'topicProvider',
    search: {
      type: 'select',
      termFilter: ['in', 'nin'],
      options: () =>
      getTypeListNew(props.type).then((resp: any) => {
                    return resp.result
                        .map((item: any) => ({
                            label: item.name,
                            value: item.id,
            }))
        }),
    },
    scopedSlots: true,
    ellipsis: true,
  },
  {
    title: $t('NotificationRecord.index.803553-5'),
    dataIndex: 'message',
    key: 'message',
    search: {
      type: 'string',
    },
    scopedSlots: true,
    ellipsis: true,
  },
  {
    title: $t('NotificationRecord.index.803553-6'),
    dataIndex: 'notifyTime',
    key: 'notifyTime',
    search: {
      type: 'date',
    },
    scopedSlots: true,
    ellipsis: true,
  },
  {
    title: $t('NotificationRecord.index.803553-7'),
    dataIndex: 'state',
    key: 'state',
    search: {
      type: 'select',
      termFilter: ['in', 'nin'],
      options: [
        {
          label: $t('NotificationRecord.index.803553-8'),
          value: 'unread',
        },
        {
          label: $t('NotificationRecord.index.803553-9'),
          value: 'read',
        },
      ],
    },
    scopedSlots: true,
    ellipsis: true,
  },
  {
    title: $t('NotificationRecord.index.803553-10'),
    dataIndex: 'action',
    key: 'action',
    ellipsis: true,
    scopedSlots: true,
    width: '200px',
  },
]

const viewVisible = ref<boolean>(false)
const viewItem = ref<any>({})

const routerParams = useRouterParams()

const defaultParams = {
  sorts: [{ name: 'notifyTime', order: 'desc' }],
  terms: [
    {
      terms: [
        {
          column: 'topicProvider',
          value: getType.value,
          termType: 'in',
        },
      ],
      type: 'and',
    },
  ],
}
const queryParams = ref({})

const tableRef = ref()

const view = (row: any) => {
  viewItem.value = row
  viewVisible.value = true
}
const refresh = () => {
  tableRef.value && tableRef.value.reload()
}

const changeStatus = (row: any) => {
  const type = row.state.value === 'read' ? '_unread' : '_read'
  changeStatus_api(type, [row.id]).then((resp: any) => {
    if (resp.status === 200) {
      onlyMessage($t('NotificationRecord.index.803553-11'))
      refresh()
      user.updateAlarm()
    }
  })
}

watch(() => user.messageInfo?.id, (val) => {
  if(val){
    view(user.messageInfo)
  }
}, {
  immediate: true
})

// const onAllRead = async () => {
//     const resp = await changeAllStatus('_read', getType.value);
//     if (resp.status === 200) {
//         onlyMessage($t('NotificationRecord.index.803553-11'));
//         refresh();
//         user.updateAlarm();
//     }
// };

onMounted(() => {
  if (routerParams.params?.value.row) {
    view(routerParams.params?.value.row)
  }
})

onUnmounted(() => {
  user.messageInfo = {}
  viewVisible.value = false
  routerParams?.clear?.()
})
</script>

<style lang="less" scoped>
.notification-record-container {
  :deep(.ant-table-tbody) {
    .ant-table-cell {
      .ant-space-item {
        .ant-btn-link {
          padding: 0;
        }
      }
    }
  }
}
</style>
