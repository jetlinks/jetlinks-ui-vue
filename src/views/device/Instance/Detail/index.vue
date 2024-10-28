<template>
  <page-container
      :tabList="list"
      :showBack="true"
      :tabActiveKey="instanceStore.tabActiveKey"
      @tabChange="onTabChange"
  >
    <template #title>
      <div style="display: flex; align-items: center">
        <j-tooltip :title="instanceStore.current?.name">
          <div class="deviceDetailHead">
            {{ instanceStore.current?.name }}
          </div>
        </j-tooltip>
        <j-divider type="vertical"/>
        <j-space>
                    <span style="font-size: 14px; color: rgba(0, 0, 0, 0.85)">
                        状态：
                        <j-badge
                            :status="
                                statusMap.get(
                                    instanceStore.current?.state?.value,
                                )
                            "
                        />
                        {{ instanceStore.current?.state?.text }}
                    </span>
          <PermissionButton
              v-if="
                            instanceStore.current?.state?.value === 'notActive'
                        "
              type="link"
              style="margin-top: -5px; padding: 0 20px"
              :popConfirm="{
                            title: '确认启用设备',
                            onConfirm: handleAction,
                        }"
              hasPermission="device/Instance:action"
          >
            启用设备
          </PermissionButton>
          <PermissionButton
              v-if="instanceStore.current?.state?.value === 'online'"
              type="link"
              style="margin-top: -5px; padding: 0 20px"
              :popConfirm="{
                            title: '确认断开连接？',
                            onConfirm: handleDisconnect,
                        }"
              hasPermission="device/Instance:action"
          >
            断开连接
          </PermissionButton>
          <j-tooltip
              v-if="
                            instanceStore.current?.accessProvider ===
                                'child-device' &&
                            instanceStore.current?.state?.value === 'offline'
                        "
              :title="
                            instanceStore.current?.features?.find(
                                (item) => item?.id === 'selfManageState',
                            )
                                ? '该设备的在线状态与父设备(网关设备)保持一致'
                                : '该设备在线状态由设备自身运行状态决定，不继承父设备（网关设备）的在线状态'
                        "
          >
            <AIcon
                type="QuestionCircleOutlined"
                style="font-size: 14px"
            />
          </j-tooltip>
        </j-space>
      </div>
    </template>
    <template #content>
      <j-descriptions size="small" :column="4">
        <j-descriptions-item label="ID">{{
            instanceStore.current?.id
          }}
        </j-descriptions-item>
        <j-descriptions-item label="所属产品">
          <PermissionButton
              type="link"
              style="margin-top: -5px; padding: 0"
              @click="jumpProduct"
              hasPermission="device/Product:view"
          >
            {{ instanceStore.current?.productName }}
          </PermissionButton>
        </j-descriptions-item>
      </j-descriptions>
    </template>
    <template #extra>
      <j-space>
        <j-button
            @click="onClick"
            v-if="_arr.includes(instanceStore.current?.accessProvider || '')"
            type="primary" :disabled="instanceStore.current?.state?.value !== 'online'">远程访问
        </j-button>
        <img
            @click="handleRefresh"
            :src="getImage('/device/button.png')"
            style="margin-right: 20px; cursor: pointer"
        />
      </j-space>
    </template>
    <FullPage>
      <div style="padding: 24px; height: 100%">
        <component
            :is="tabs[instanceStore.tabActiveKey]"
            v-bind="{ type: 'device' }"
            @onJump="onTabChange"
        />
      </div>
    </FullPage>
  </page-container>
</template>

<script lang="ts" setup>
import {useInstanceStore} from '@/store/instance';
import Info from './Info/index.vue';
import Running from './Running/index.vue';
import Metadata from '../../components/Metadata/index.vue';
import MetadataMap from './MetadataMap/index.vue';
import ChildDevice from './ChildDevice/index.vue';
import Diagnose from './Diagnose/index.vue';
import Function from './Function/index.vue';
import Modbus from './Modbus/index.vue';
import OPCUA from './OPCUA/index.vue';
import EdgeMap from './EdgeMap/index.vue';
import Parsing from './Parsing/index.vue';
import GateWay from './GateWay/index.vue';
import Log from './Log/index.vue';
import AlarmRecord from './AlarmRecord/index.vue';
import Firmware from './Firmware/index.vue';
import Shadow from './Shadow/index.vue';
import Terminal from './Terminal/index.vue';
import CardManagement from '@/views/iot-card/CardManagement/Detail/index.vue';
import {_deploy, _disconnect} from '@/api/device/instance';
import {getImage, onlyMessage} from '@/utils/comm';
import {getWebSocket} from '@/utils/websocket';
import {useMenuStore} from '@/store/menu';
import {useRouterParams} from '@/utils/hooks/useParams';
import {EventEmitter} from '@/utils/utils';
import {usePermissionStore} from '@/store/permission';
import {isNoCommunity} from '@/utils/utils';
import {useSystem} from '@/store/system';

const menuStory = useMenuStore();
const {showThreshold} = useSystem();
const route = useRoute();
const routerParams = useRouterParams();
const instanceStore = useInstanceStore();

const statusMap = new Map();

statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const statusRef = ref();

const initList = [
  {
    key: 'Info',
    tab: '实例信息',
  },
  {
    key: 'Running',
    tab: '运行状态',
  },
  {
    key: 'Metadata',
    tab: '物模型',
  },
  {
    key: 'Function',
    tab: '设备功能',
  },
  {
    key: 'Log',
    tab: '日志管理',
  },
  {
    key: 'Shadow',
    tab: '设备影子'
  }
];

const list = ref([...initList]);

const tabs = {
  Info,
  Metadata,
  Running,
  ChildDevice,
  Diagnose,
  Function,
  Modbus,
  OPCUA,
  EdgeMap,
  Parsing,
  Log,
  MetadataMap,
  GateWay,
  AlarmRecord,
  CardManagement,
  Firmware,
  Shadow,
  Terminal
};

const permissionStore = usePermissionStore();
const _arr = ['agent-device-gateway', 'agent-media-device-gateway']
const getStatus = (id: string) => {
  statusRef.value = getWebSocket(
      `instance-editor-info-status-${id}`,
      `/dashboard/device/status/change/realTime`,
      {
        deviceId: id,
      },
  ).subscribe((message: any) => {
    if (
        message.payload?.value?.type !== instanceStore.current?.state.value
    ) {
      instanceStore.refresh(id);
    }
  });
};

const getDetail = () => {
  const keys = list.value.map((i) => i.key);
  if (permissionStore.hasPermission('rule-engine/Alarm/Log:view') && isNoCommunity && showThreshold) {
    list.value.push({
      key: 'AlarmRecord',
      tab: '预处理数据',
    });
  }
  if (permissionStore.hasPermission('iot-card/CardManagement:view') && isNoCommunity) {
    list.value.push({
      key: 'CardManagement',
      tab: '物联网卡',
    });
  }

  if (instanceStore.current?.features.some(item => item.id === 'deviceShadow-manager') && isNoCommunity) {
    list.value.push({
      key: 'Shadow',
      tab: '设备影子'
    })
  }
  if (
      permissionStore.hasPermission('device/Firmware:view') &&
      instanceStore.current?.features?.find(
          (item: any) => item?.id === 'supportFirmware',
      ) && isNoCommunity
  ) {
    list.value.push({
      key: 'Firmware',
      tab: '远程升级',
    });
  }
  if (
      instanceStore.current?.protocol &&
      !['modbus-tcp', 'opc-ua'].includes(instanceStore.current?.protocol) &&
      !keys.includes('Diagnose')
  ) {
    list.value.push({
      key: 'Diagnose',
      tab: '设备诊断',
    });
  }
  if (
      instanceStore.current?.features?.find(
          (item: any) => item?.id === 'transparentCodec',
      ) &&
      !keys.includes('Parsing')
  ) {
    list.value.push({
      key: 'Parsing',
      tab: '数据解析',
    });
  }
  if (
      instanceStore.current?.protocol === 'modbus-tcp' &&
      !keys.includes('Modbus')
  ) {
    list.value.push({
      key: 'Modbus',
      tab: '数采映射',
    });
  }
  if (
      instanceStore.current?.protocol === 'opc-ua' &&
      !keys.includes('OPCUA')
  ) {
    list.value.push({
      key: 'OPCUA',
      tab: '数采映射',
    });
  }
  if (
      instanceStore.current?.protocol === 'collector-gateway' &&
      !keys.includes('GateWay')
  ) {
    list.value.push({
      key: 'GateWay',
      tab: '数采映射',
    });
  }
  if (
      instanceStore.current?.deviceType?.value === 'gateway' &&
      !keys.includes('ChildDevice')
  ) {
    // 产品类型为网关的情况下才显示此模块
    list.value.push({
      key: 'ChildDevice',
      tab: '子设备',
    });
  }
  if (
      instanceStore.current?.accessProvider === 'edge-child-device' &&
      instanceStore.current?.parentId &&
      !keys.includes('EdgeMap')
  ) {
    list.value.push({
      key: 'EdgeMap',
      tab: '边缘端映射',
    });
  }

  if (
      instanceStore.current?.features?.find(
          (item: any) => item?.id === 'diffMetadataSameProduct',
      ) &&
      !keys.includes('MetadataMap')
  ) {
    list.value.push({key: 'MetadataMap', tab: '物模型映射'});
  }

  if (
      _arr.includes(instanceStore.current?.accessProvider) &&
      !keys.includes('Terminal')
  ) {
    list.value.push({key: 'Terminal', tab: '远程终端'});
  }
};

const initPage = async (newId: any) => {
  await instanceStore.refresh(String(newId));
  getStatus(String(newId));
  list.value = [...initList];
  getDetail();
  instanceStore.tabActiveKey = 'Info';
};

onBeforeRouteUpdate((to: any) => {
  if (
      to.params?.id !== instanceStore.current.id &&
      to.name === 'device/Instance/Detail'
  ) {
    initPage(to.params?.id);
  }
});

const getDetailFn = async () => {
  const _id = route.params?.id;
  if (_id) {
    await instanceStore.refresh(String(_id));
    getStatus(String(_id));
    list.value = [...initList];
    getDetail();
    instanceStore.tabActiveKey = routerParams.params.value.tab || 'Info';
  } else {
    instanceStore.tabActiveKey = routerParams.params.value.tab || 'Info';
  }
};

const onTabChange = (e: string) => {
  if (instanceStore.tabActiveKey === 'Metadata') {
    EventEmitter.emit('MetadataTabs', () => {
      instanceStore.tabActiveKey = e;
    });
  } else {
    instanceStore.tabActiveKey = e;
  }
};

const handleAction = () => {
  if (instanceStore.current?.id) {
    const response = _deploy(instanceStore.current?.id);
    response.then((resp) => {
      if (resp.status === 200) {
        onlyMessage('操作成功！');
        instanceStore.refresh(instanceStore.current?.id);
      }
    });
    return response;
  }
};

const handleDisconnect = () => {
  if (instanceStore.current?.id) {
    const response = _disconnect(instanceStore.current?.id);
    response.then((resp) => {
      if (resp.status === 200) {
        onlyMessage('操作成功！');
        instanceStore.refresh(instanceStore.current?.id);
      }
    });
    return response;
  }
};

const handleRefresh = async () => {
  if (instanceStore.current?.id) {
    await instanceStore.refresh(instanceStore.current?.id);
    onlyMessage('操作成功');
  }
};

const jumpProduct = () => {
  menuStory.jumpPage('device/Product/Detail', {
    id: instanceStore.current?.productId,
  });
};

const onClick = () => {
  menuStory.jumpPage('edge/Device/Remote', {
    id: instanceStore.current.id,
  });
}

onMounted(() => {
  getDetailFn();
});

onUnmounted(() => {
  instanceStore.current = {} as any;
  statusRef.value && statusRef.value.unsubscribe();
});
</script>

<style lang="less" scoped>
.deviceDetailHead {
  max-width: 400px;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
