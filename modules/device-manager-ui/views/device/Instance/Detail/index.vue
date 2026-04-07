<template>
  <j-page-container
    :tabList="mergedOptions"
    :showBack="true"
    :tabActiveKey="instanceStore.tabActiveKey"
    @tabChange="onTabChange"
  >
    <template #title>
      <div style="display: flex; align-items: center">
        <a-tooltip :title="instanceStore.current?.name">
          <div class="deviceDetailHead">
            {{ instanceStore.current?.name }}
          </div>
        </a-tooltip>
        <a-divider type="vertical" />
        <a-space>
          <span style="font-size: 14px; color: rgba(0, 0, 0, 0.85)">
            {{ $t('Detail.index.957187-0') }}
            <a-badge :status="statusMap.get(instanceStore.current?.state?.value)" />
            {{ instanceStore.current?.state?.text }}
          </span>
          <slot
            v-if="instanceStore.current?.state?.value === 'notActive'"
            name="activeDevice"
          ></slot>
          <j-permission-button
            v-if="instanceStore.current?.state?.value === 'notActive' && !slots.activeDevice"
            type="link"
            style="margin-top: -5px; padding: 0 20px"
            :popConfirm="{
              title: $t('Detail.index.957187-1'),
              onConfirm: handleAction
            }"
            hasPermission="device/Instance:action"
          >
            {{ $t('Detail.index.957187-2') }}
          </j-permission-button>
          <slot
            v-if="instanceStore.current?.state?.value === 'online'"
            name="activeDevice"
          ></slot>
          <j-permission-button
            v-if="instanceStore.current?.state?.value === 'online' && !slots.disconnect"
            type="link"
            style="margin-top: -5px; padding: 0 20px"
            :popConfirm="{
              title: $t('Detail.index.957187-3'),
              onConfirm: handleDisconnect
            }"
            hasPermission="device/Instance:action"
          >
            {{ $t('Detail.index.957187-4') }}
          </j-permission-button>
          <a-tooltip
            v-if="
              instanceStore.current?.accessProvider === 'child-device' &&
              instanceStore.current?.state?.value === 'offline'
            "
            :title="
              instanceStore.current?.features?.find((item) => item?.id === 'selfManageState')
                ? $t('Detail.index.957187-7')
                : $t('Detail.index.957187-8')
            "
          >
            <AIcon
              type="QuestionCircleOutlined"
              style="font-size: 14px"
            />
          </a-tooltip>
        </a-space>
      </div>
    </template>
    <template #content>
      <a-descriptions
        size="small"
        :column="4"
      >
        <a-descriptions-item label="ID">{{ instanceStore.current?.id }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Detail.index.957187-9')">
          <slot name="productName"></slot>
          <j-permission-button
            v-if="!slots.productName"
            type="link"
            style="margin-top: -5px; padding: 0"
            @click="jumpProduct"
            hasPermission="device/Product:view"
          >
            {{ instanceStore.current?.productName }}
          </j-permission-button>
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <template #extra>
      <a-space>
        <a-button
          @click="onClick"
          v-if="_arr.includes(instanceStore.current?.accessProvider || '') && userStore.isAdmin"
          type="primary"
          :disabled="instanceStore.current?.state?.value !== 'online'"
        >
          {{ $t('Detail.index.957187-10') }}
        </a-button>

        <a-tooltip :title="$t('Detail.index.957187-30')">
          <img
            @click="handleRefresh"
            :src="device.button"
            style="margin-right: 20px; cursor: pointer"
            alt=""
          />
        </a-tooltip>
      </a-space>
    </template>
    <full-page>
      <div
        :style="contentStyle"
        class="device-detail-content-wrap"
      >
        <RegistryComponent
          code="detail-tabs"
          :activeKey="instanceStore.tabActiveKey"
        >
          <component
            ref="componentRef"
            :key="instanceStore.tabActiveKey"
            :is="tabs[instanceStore.tabActiveKey]"
            v-bind="{ type: 'device', isRefresh: isRefresh }"
            @onJump="onTabChange"
          />
        </RegistryComponent>
      </div>
    </full-page>
  </j-page-container>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '../../../../store/instance'
import { _deploy, _disconnect } from '../../../../api/instance'
import { onlyMessage } from '@jetlinks-web/utils'
import { openEdgeUrl, isNoCommunity } from '@jetlinks-web-core/utils/utils'
import { wsClient } from '@jetlinks-web/core'
import { useRouterParams } from '@jetlinks-web/hooks'
import { EventEmitter } from '@jetlinks-web/utils'
import { useSystemStore, useMenuStore, useAuthStore, useAIStore, useUserStore } from '@jetlinks-web-core/store'
import { device } from '../../../../assets'
import { useI18n } from 'vue-i18n'
import { tabs } from './asyncComponent'
import { useMircoAppData } from '@jetlinks-web-core/hooks/useMircoApp'
import { useRegistryOptions } from '@jetlinks-web-core/hooks'

const { data: platform } = useMircoAppData('platformName')
import { deviceStateList } from '@device-manager-ui/views/device/data'
import { isApplyDashboard } from '@device-manager-ui/utils/dashboardProject'

const { t: $t } = useI18n()
const menuStory = useMenuStore()
const userStore = useUserStore()
const { showThreshold } = useSystemStore()
const route = useRoute()
const routerParams = useRouterParams()
const instanceStore = useInstanceStore()
const slots = useSlots()

const statusMap = new Map()

statusMap.set('online', 'success')
statusMap.set('offline', 'error')
statusMap.set('notActive', 'warning')

const statusTextMap = new Map()
statusTextMap.set('online', $t('DashBoard.index.954313-11'))
statusTextMap.set('offline', $t('DashBoard.index.954313-12'))
statusTextMap.set('notActive', $t('DashBoard.index.954313-10'))

const statusRef = ref()
const componentRef = ref()

const initList = [
  {
    key: 'Info',
    tab: $t('Detail.index.957187-11')
  },
  {
    key: 'Running',
    tab: $t('Detail.index.957187-12')
  },
  {
    key: 'Metadata',
    tab: $t('Detail.index.957187-13')
  },
  {
    key: 'Function',
    tab: $t('Detail.index.957187-14')
  },
  {
    key: 'Log',
    tab: $t('Detail.index.957187-15')
  }
  // {
  //     key: 'DeviceRelationship',
  //     tab: '设备关系',
  // },
]

const list = ref([...initList])
const isRefresh = ref(false)
const aiStore = useAIStore()
const permissionStore = useAuthStore()
const { mergedOptions } = useRegistryOptions({ baseOptions: list, code: 'detail-tabs' })

const _arr = ['agent-device-gateway', 'agent-media-device-gateway']

const contentStyle = computed(() => {
  if (instanceStore.tabActiveKey === 'Dashboard') {
    return {
      height: '100%',
      padding: '0',
      overflow: 'hidden'
    } as any
  }
  return {
    height: '100%',
    padding: '24px',
    overflowY: 'auto'
  } as any
})

const getStatus = (id: string) => {
  if (statusRef.value) {
    statusRef.value.unsubscribe()
  }
  statusRef.value = wsClient
    .getWebSocket(`instance-editor-info-status-${id}`, `/dashboard/device/status/change/realTime`, {
      deviceId: id
    })
    .subscribe((message: any) => {
      if (message.payload?.value?.type !== instanceStore.current?.state.value) {
        // instanceStore.refresh(id);
        // 调用detail接口无法实时更新状态，所以这里手动更新
        instanceStore.setState({
          value: message.payload?.value?.type,
          text: statusTextMap.get(message.payload?.value?.type) || ''
        })
      }
    })
}

const getDetail = () => {
  if (platform !== 'edge') {
    list.value.push({
      key: 'DeviceRelationship',
      tab: $t('Detail.index.957187-31')
    })
  }
  const keys = list.value.map((i) => i.key)
  if (permissionStore.hasPermission('rule-engine/Alarm/Log:view') && showThreshold) {
    list.value.push({
      key: 'AlarmRecord',
      tab: $t('Detail.index.957187-16')
    })
    if (isNoCommunity) {
      list.value.push({
        key: 'Invalid',
        tab: $t('Detail.index.957187-29')
      })
    }
  }
  if (permissionStore.hasPermission('iot-card/CardManagement:view') && isNoCommunity) {
    list.value.push({
      key: 'CardManagement',
      tab: $t('Detail.index.957187-17')
    })
  }

  if (instanceStore.current?.features?.some((item) => item.id === 'deviceShadow-manager') && isNoCommunity) {
    list.value.push({
      key: 'Shadow',
      tab: $t('Detail.index.957187-18')
    })
  }
  if (
    permissionStore.hasPermission('device/Firmware:view') &&
    instanceStore.current?.features?.find((item: any) => item?.id === 'supportFirmware') &&
    isNoCommunity
  ) {
    list.value.push({
      key: 'Firmware',
      tab: $t('Detail.index.957187-19')
    })
  }
  if (
    instanceStore.current?.protocol &&
    !['modbus-tcp', 'opc-ua'].includes(instanceStore.current?.protocol) &&
    !keys.includes('Diagnose')
  ) {
    list.value.push({
      key: 'Diagnose',
      tab: $t('Detail.index.957187-20')
    })
  }
  if (
    instanceStore.current?.features?.find((item: any) => item?.id === 'transparentCodec') &&
    !keys.includes('Parsing')
  ) {
    list.value.push({
      key: 'Parsing',
      tab: $t('Detail.index.957187-21')
    })
  }
  if (instanceStore.current?.protocol === 'modbus-tcp' && !keys.includes('Modbus')) {
    list.value.push({
      key: 'Modbus',
      tab: $t('Detail.index.957187-22')
    })
  }
  if (instanceStore.current?.protocol === 'opc-ua' && !keys.includes('OPCUA')) {
    list.value.push({
      key: 'OPCUA',
      tab: $t('Detail.index.957187-22')
    })
  }
  if (instanceStore.current?.protocol === 'collector-gateway' && !keys.includes('GateWay')) {
    list.value.push({
      key: 'GateWay',
      tab: $t('Detail.index.957187-22')
    })
  }
  if (
    instanceStore.current?.deviceType?.value === 'gateway' &&
    !keys.includes('ChildDevice') &&
    !keys.includes('Child')
  ) {
    const providers = ['agent-device-gateway', 'agent-media-device-gateway']
    if (providers.includes(instanceStore.current?.accessProvider!)) {
      list.value.push({
        key: 'Child',
        tab: $t('Detail.index.957187-23')
      })
    } else {
      // 产品类型为网关的情况下才显示此模块
      list.value.push({
        key: 'ChildDevice',
        tab: $t('Detail.index.957187-23')
      })
    }
  }
  if (
    instanceStore.current?.accessProvider === 'edge-child-device' &&
    instanceStore.current?.parentId &&
    !keys.includes('EdgeMap')
  ) {
    list.value.push({
      key: 'EdgeMap',
      tab: $t('Detail.index.957187-24')
    })
  }

  if (
    instanceStore.current?.features?.find((item: any) => item?.id === 'diffMetadataSameProduct') &&
    !keys.includes('MetadataMap')
  ) {
    list.value.push({ key: 'MetadataMap', tab: $t('Detail.index.957187-25') })
  }

  if (_arr.includes(instanceStore.current?.accessProvider) && !keys.includes('Terminal')) {
    list.value.push({ key: 'Terminal', tab: $t('Detail.index.957187-26') })
  }

  // 仪表盘

  if (isApplyDashboard() && !list.value.some((i) => i.key === 'Dashboard')) {
    list.value.push({ key: 'Dashboard', tab: $t('Detail.index.957187-32') })
  }
}

const initPage = async (newId: any) => {
  // 刷新整个页面，防止前一个数据还有残留
  instanceStore.tabActiveKey = 'Info'
  list.value = [...initList]
  instanceStore.setCurrent({ id: newId })
  await instanceStore.refresh(String(newId))
  getStatus(String(newId))
  getDetail()
}

onBeforeRouteUpdate((to: any) => {
  if (to.params?.id !== instanceStore.current.id && to.name === 'device/Instance/Detail') {
    // location.reload()
    initPage(to.params?.id)
  }
})

const getDetailFn = async () => {
  const _id = route.params?.id
  instanceStore.tabActiveKey = routerParams.params.value.tab || 'Info'
  if (_id) {
    await instanceStore.refresh(String(_id))
    getStatus(String(_id))
    list.value = [...initList]
    getDetail()
    // instanceStore.tabActiveKey = routerParams.params.value.tab || 'Info';
  }
  // else {
  //     instanceStore.tabActiveKey = routerParams.params.value.tab || 'Info';
  // }
}

const onTabChange = (e: string) => {
  if (instanceStore.tabActiveKey === 'Metadata') {
    EventEmitter.emit('MetadataTabs', () => {
      instanceStore.tabActiveKey = e
    })
  } else if (instanceStore.tabActiveKey === 'Child') {
    EventEmitter.emit('ChildTabs', () => {
      instanceStore.tabActiveKey = e
    })
  } else {
    instanceStore.tabActiveKey = e
  }
}

const handleAction = () => {
  if (instanceStore.current?.id) {
    const response = _deploy(instanceStore.current?.id)
    response.then((resp) => {
      if (resp.status === 200) {
        onlyMessage($t('Detail.index.957187-27'))
        instanceStore.refresh(instanceStore.current?.id)
      }
    })
    return response
  }
}

const handleDisconnect = () => {
  if (instanceStore.current?.id) {
    const response = _disconnect(instanceStore.current?.id)
    response.then((resp) => {
      if (resp.status === 200) {
        onlyMessage($t('Detail.index.957187-27'))
        instanceStore.refresh(instanceStore.current?.id)
      }
    })
    return response
  }
}

const handleRefresh = async () => {
  if (instanceStore.current?.id) {
    await instanceStore.refresh(instanceStore.current?.id)
    onlyMessage($t('Detail.index.957187-28'))
  }
  if (instanceStore.tabActiveKey === 'Child') {
    componentRef.value?.handleRefresh()
  }
}

const jumpProduct = () => {
  menuStory.jumpPage('device/Product/Detail', {
    params: {
      id: instanceStore.current?.productId
    }
  })
}

const onClick = async () => {
  await openEdgeUrl(instanceStore.current.id)
}

onMounted(async () => {
  await getDetailFn()
  aiStore.queryAgent('deviceDetailChat', { deviceId: instanceStore.current?.id })
})

onUnmounted(() => {
  instanceStore.current = {} as any
  statusRef.value && statusRef.value.unsubscribe()
  aiStore.hideAiButton()
})

defineExpose({
  handleAction,
  handleDisconnect,
  jumpProduct
})
</script>

<style lang="less" scoped>
.deviceDetailHead {
  max-width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.device-detail-content-wrap {
  :deep(> div) {
    height: 100%;
  }
}
</style>
