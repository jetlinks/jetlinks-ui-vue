<!-- 物联卡管理 -->
<template>
  <page-container>
    <pro-search
        :columns="columns"
        target="iot-card-management-search"
        @search="handleSearch"
    />
    <FullPage>
      <j-pro-table
          :scroll="{ x: 1366 }"
          ref="cardManageRef"
          :columns="columns"
          :request="query"
          :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
          :rowSelection="
                    isCheck
                        ? {
                              selectedRowKeys: _selectedRowKeys,
                              onChange: onSelectChange,
                          }
                        : false
                "
          :params="params"
          :gridColumn="3"
      >
        <template #headerTitle>
          <j-space>
            <PermissionButton
                @click="handleAdd"
                :hasPermission="'iot-card/CardManagement:add'"
                type="primary"
            >
              <AIcon type="PlusOutlined"/>
              新增
            </PermissionButton>
            <BatchDropdown
                v-model:isCheck="isCheck"
                :actions="batchActions"
                @change="onCheckChange"
            />
          </j-space>
        </template>
        <template #card="slotProps">
          <CardBox
              :value="slotProps"
              @click="handleClick"
              :actions="getActions(slotProps, 'card')"
              v-bind="slotProps"
              :active="_selectedRowKeys.includes(slotProps.id)"
              :status="slotProps.cardStateType?.value"
              :statusText="slotProps.cardStateType?.text"
              :statusNames="{
                            using: 'processing',
                            toBeActivated: 'default',
                            deactivate: 'error',
                        }"
          >
            <template #img>
              <slot name="img">
                <img
                    :src="getImage('/iot-card/iot-card-bg.png')"
                />
              </slot>
            </template>
            <template #content>
                            <span style="font-size: 16px; font-weight: 600">
                                <Ellipsis style="width: calc(100% - 100px)">
                                    {{ slotProps.id }}
                                </Ellipsis>
                            </span>
              <j-row style="margin-top: 20px">
                <j-col :span="6">
                  <div class="card-item-content-text">
                    平台对接
                  </div>
                  <Ellipsis style="width: calc(100% - 20px)">
                    <div>
                      {{ slotProps.platformConfigName }}
                    </div>
                  </Ellipsis>
                </j-col>
                <j-col :span="6">
                  <div class="card-item-content-text">
                    运营商状态
                  </div>
                  <BadgeStatus
                      :status="slotProps.cardState?.value"
                      :text="slotProps.cardState?.text"
                      :statusNames="{
                                            using: 'processing',
                                            toBeActivated: 'default',
                                            deactivate: 'error',
                                        }"
                  />
                </j-col>
                <j-col :span="6">
                  <div class="card-item-content-text">
                    类型
                  </div>
                  <div>{{ slotProps.cardType.text }}</div>
                </j-col>
                <j-col :span="6">
                  <div class="card-item-content-text">
                    绑定设备
                  </div>
                  <Ellipsis>{{
                      slotProps.deviceName
                    }}
                  </Ellipsis>
                </j-col>
              </j-row>
              <j-divider style="margin: 12px 0"/>
              <div class="content-bottom">
                <div>
                  <div class="progress-text">
                    <div>
                      {{
                        slotProps.totalFlow
                            ? (
                                (slotProps.usedFlow /
                                    slotProps.totalFlow) *
                                100
                            ).toFixed(2)
                            : '0.00'
                      }}
                      %
                    </div>
                    <div class="card-item-content-text">
                      总共 {{ slotProps.totalFlow }} M
                    </div>
                  </div>
                  <j-progress
                      :strokeColor="'#ADC6FF'"
                      :showInfo="false"
                      :percent="
                                            slotProps.totalFlow
                                                ? (slotProps.usedFlow /
                                                      slotProps.totalFlow) *
                                                  100
                                                : 0
                                        "
                  />
                </div>
              </div>
            </template>
            <template #actions="item">
              <PermissionButton
                  :disabled="item.disabled"
                  :popConfirm="item.popConfirm"
                  :tooltip="{
                                    ...item.tooltip,
                                }"
                  @click="item.onClick"
                  :hasPermission="
                                    'iot-card/CardManagement:' + item.key
                                "
              >
                <AIcon
                    type="DeleteOutlined"
                    v-if="item.key === 'delete'"
                />
                <template v-else>
                  <AIcon :type="item.icon"/>
                  <span>{{ item?.text }}</span>
                </template>
              </PermissionButton>
            </template>
          </CardBox>
        </template>
        <template #deviceId="slotProps">
          {{ slotProps.deviceName }}
        </template>
        <template #totalFlow="slotProps">
          <div>
            {{
              slotProps.totalFlow
                  ? slotProps.totalFlow.toFixed(2) + ' M'
                  : ''
            }}
          </div>
        </template>
        <template #usedFlow="slotProps">
          <div>
            {{
              slotProps.usedFlow
                  ? slotProps.usedFlow.toFixed(2) + ' M'
                  : ''
            }}
          </div>
        </template>
        <template #residualFlow="slotProps">
          <div>
            {{
              slotProps.residualFlow
                  ? slotProps.residualFlow.toFixed(2) + ' M'
                  : ''
            }}
          </div>
        </template>
        <template #operatorName="slotProps">
          {{ OperatorMap[slotProps.operatorName] }}
        </template>
        <template #cardType="slotProps">
          {{ slotProps.cardType.text }}
        </template>
        <template #cardStateType="slotProps">
          <BadgeStatus
              :status="slotProps.cardStateType?.value"
              :text="slotProps.cardStateType?.text"
              :statusNames="{
                            using: 'processing',
                            toBeActivated: 'default',
                            deactivate: 'error',
                        }"
          />
        </template>
        <template #cardState="slotProps">
          <BadgeStatus
              v-if="slotProps.cardState?.state"
              :status="slotProps.cardState?.state"
              :text="slotProps.cardState?.text"
              :statusNames="{
                            using: 'processing',
                            toBeActivated: 'default',
                            deactivate: 'error',
                        }"
          />
        </template>
        <template #activationDate="slotProps">
          {{
            slotProps.activationDate
                ? dayjs(slotProps.activationDate).format(
                    'YYYY-MM-DD HH:mm:ss',
                )
                : ''
          }}
        </template>
        <template #updateTime="slotProps">
          {{
            slotProps.updateTime
                ? dayjs(slotProps.updateTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                )
                : ''
          }}
        </template>
        <template #action="slotProps">
          <j-space :size="16">
            <template
                v-for="i in getActions(slotProps, 'table')"
                :key="i.key"
            >
              <PermissionButton
                  :disabled="i.disabled"
                  :popConfirm="i.popConfirm"
                  :tooltip="{
                                    ...i.tooltip,
                                }"
                  @click="i.onClick"
                  type="link"
                  style="padding: 0px"
                  :hasPermission="
                                    i.key === 'view'
                                        ? true
                                        : 'iot-card/CardManagement:' + i.key
                                "
                  :danger="i.key === 'delete'"
              >
                <template #icon>
                  <AIcon :type="i.icon"/>
                </template>
              </PermissionButton>
            </template>
          </j-space>
        </template>
      </j-pro-table>
    </FullPage>
    <!-- 批量导入 -->
    <Import
        v-if="importVisible"
        @close="importVisible = false"
        @save="importSave"
    />
    <!-- 批量导出 -->
    <Export
        v-if="exportVisible"
        @close="exportVisible = false"
        :data="params"
    />
    <!-- 绑定设备 -->
    <BindDevice
        v-if="bindDeviceVisible"
        :cardId="cardId"
        @change="bindDevice"
    />
    <!-- 新增、编辑 -->
    <Save
        v-if="visible"
        :type="saveType"
        :data="current"
        @change="saveChange"
    />
    <!--   批量同步     -->
    <SyncModal v-if="syncVisible" :params="params" @close="syncClose"/>
  </page-container>
</template>

<script setup lang="ts">
import type {ActionsType} from '@/components/Table';
import dayjs from 'dayjs';
import {
  query,
  queryPlatformNoPage,
  changeDeploy,
  unDeploy,
  resumption,
  del,
  changeDeployBatch,
  unDeployBatch,
  resumptionBatch,
  sync,
  removeCards,
  unbind,
} from '@/api/iot-card/cardManagement';
import type {CardManagement} from './typing';
import {getImage, onlyMessage} from '@/utils/comm';
import BindDevice from './BindDevice.vue';
import Import from './Import.vue';
import Export from './Export.vue';
import Save from './Save.vue';
import {useMenuStore} from 'store/menu';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import BatchDropdown from '@/components/BatchDropdown/index.vue';
import {BatchActionsType} from '@/components/BatchDropdown/types';
import {usePermissionStore} from 'store/permission';
import {useRouterParams} from '@/utils/hooks/useParams';
import {OperatorMap} from '@/views/iot-card/data';
import SyncModal from './Sync.vue';
import {OperatorList} from '../data';

const router = useRouter();
const menuStory = useMenuStore();
const cardManageRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);
// const _selectedRow = ref<any[]>([]);
const bindDeviceVisible = ref<boolean>(false);
const visible = ref<boolean>(false);
const exportVisible = ref<boolean>(false);
const importVisible = ref<boolean>(false);
const cardId = ref<any>();
const current = ref<Partial<CardManagement>>({});
const saveType = ref<string>('');
const isCheck = ref<boolean>(false);
const syncVisible = ref(false);

const columns = [
  {
    title: '卡号',
    dataIndex: 'id',
    key: 'id',
    width: 200,
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string',
    },
  },
  {
    title: 'ICCID',
    dataIndex: 'iccId',
    key: 'iccId',
    ellipsis: true,
    width: 200,
    search: {
      type: 'string',
    },
  },
  {
    title: '绑定设备',
    dataIndex: 'deviceId',
    key: 'deviceId',
    ellipsis: true,
    scopedSlots: true,
    width: 200,
    search: {
      type: 'string',
      rename: 'deviceName',
    },
  },
  {
    title: '平台对接',
    dataIndex: 'platformConfigName',
    key: 'platformConfigName',
    width: 200,
    search: {
      rename: 'platformConfigId',
      type: 'select',
      options: async () => {
        return new Promise((resolve) => {
          queryPlatformNoPage({
            sorts: [{name: 'createTime', order: 'desc'}],
            terms: [{column: 'state', value: 'enabled'}],
          }).then((resp: any) => {
            const list = resp.result.map((item: any) => ({
              label: item.name,
              value: item.id,
            }));
            resolve(list);
          });
        });
      },
    },
  },
  {
    title: '运营商',
    dataIndex: 'operatorName',
    key: 'operatorName',
    width: 120,
    search: {
      type: 'select',
      options: async () => {
        return OperatorList;
      },
    },
  },
  {
    title: '类型',
    dataIndex: 'cardType',
    key: 'cardType',
    scopedSlots: true,
    width: 120,
    search: {
      type: 'select',
      options: [
        {label: '年卡', value: 'year'},
        {label: '季卡', value: 'season'},
        {label: '月卡', value: 'month'},
        {label: '其他', value: 'other'},
      ],
    },
  },
  {
    title: '总流量',
    key: 'totalFlow',
    dataIndex: 'totalFlow',
    width: 120,
    scopedSlots: true,
  },
  {
    title: '使用流量',
    dataIndex: 'usedFlow',
    width: 120,
    scopedSlots: true,
  },
  {
    title: '剩余流量',
    dataIndex: 'residualFlow',
    width: 120,
    scopedSlots: true,
  },
  {
    title: '激活日期',
    dataIndex: 'activationDate',
    key: 'activationDate',
    scopedSlots: true,
    width: 200,
    search: {
      type: 'date',
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    scopedSlots: true,
    width: 200,
    search: {
      type: 'date',
    },
  },
  {
    title: '平台状态',
    dataIndex: 'cardStateType',
    key: 'cardStateType',
    width: 180,
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {label: '未同步', value: 'notReady'},
        {label: '同步失败', value: 'error'},
        {label: '激活', value: 'using'},
        {label: '待激活', value: 'toBeActivated'},
        {label: '停机', value: 'deactivate'},
        {label: '其它', value: 'other'},
      ],
    },
  },
  {
    title: '运营商状态',
    dataIndex: 'cardState',
    key: 'cardState',
    width: 180,
    scopedSlots: true,
  },
  {
    title: '运营商状态',
    dataIndex: 'operatorState',
    key: 'operatorState',
    // hidden: true,
    hideInTable: true,
    search: {
      type: 'select',
      options: [
        {label: '激活(正常)', value: 'using'},
        {label: '测试激活', value: 'testActivation'},
        {label: '拆机', value: 'disassemble'},
        {label: '停用(已停用)', value: 'deactivate'},
        {label: '运营商管理状态', value: 'operatorManagement'},
        {label: '可激活(电信)', value: 'beActivated'},
        {label: '待激活', value: 'toBeActivated'},
        {label: '测试去激活', value: 'testToActivation'},
        {label: '可测试', value: 'testable'},
        {label: '库存(移动)', value: 'inStock'},
        {label: '预销户', value: 'preSeller'},
        {label: '单向停机', value: 'oneWayShutdown'},
        {label: '预销号', value: 'preSale'},
        {label: '过户', value: 'transfer'},
        {label: '休眠', value: 'dormant'},
        {label: '可激活(联通)', value: 'activatable'},
        {label: '已失效', value: 'expired'},
        {label: '已清除', value: 'cleared'},
        {label: '已更换', value: 'replaced'},
        {label: '库存（联通）', value: 'stock'},
        {label: '开始', value: 'start'},
      ],
    },
  },
  {
    title: '同步状态',
    dataIndex: 'syncCardStatus',
    key: 'syncCardStatus',
    search: {
      type: 'select',
      options: [
        {label: '未同步', value: 'notSync'},
        {label: '等待中', value: 'waiting'},
        {label: '进行中', value: 'running'},
        {label: '同步失败', value: 'failed'},
        {label: '同步成功', value: 'success'},
      ],
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
    scopedSlots: true,
  },
];
const btnHasPermission = usePermissionStore().hasPermission;
const paltformPermission = btnHasPermission(`iot-card/Platform:add`);
const importSave = () => {
  cardManageRef.value?.reload();
  importVisible.value = false;
};

const routerParams = useRouterParams();

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
  if (!data) return [];
  const arr = [
    {
      key: 'update',
      text: '编辑',
      tooltip: {
        title: '编辑',
      },
      icon: 'EditOutlined',
      onClick: () => {
        visible.value = true;
        current.value = data;
        saveType.value = 'edit';
      },
    },
    {
      key: 'bind',
      text: data.deviceId ? '解绑设备' : '绑定设备',
      tooltip: {
        title: data.deviceId ? '解绑设备' : '绑定设备',
      },
      icon: data.deviceId ? 'DisconnectOutlined' : 'LinkOutlined',
      popConfirm: data.deviceId
          ? {
            title: '确认解绑设备？',
            okText: '确定',
            cancelText: '取消',
            onConfirm: () => {
              const response = unbind(data.id);
              response.then((resp: any) => {
                if (resp.status === 200) {
                  onlyMessage('操作成功');
                  cardManageRef.value?.reload();
                }
              });
              return response;
            },
          }
          : undefined,
      onClick: () => {
        if (!data.deviceId) {
          bindDeviceVisible.value = true;
          cardId.value = data.id;
        }
      },
    },
    {
      key:
          data.cardStateType?.value === 'toBeActivated'
              ? 'active'
              : 'action',
      text:
          data.cardStateType?.value === 'toBeActivated'
              ? '激活'
              : data.cardStateType?.value === 'deactivate'
                  ? '复机'
                  : '停用',
      tooltip: {
        title:
            data.cardStateType?.value === 'toBeActivated'
                ? '激活'
                : data.cardStateType?.value === 'deactivate'
                    ? '复机'
                    : '停用',
      },
      icon:
          data.cardStateType?.value === 'toBeActivated'
              ? 'CheckCircleOutlined'
              : data.cardStateType?.value === 'deactivate'
                  ? 'PoweroffOutlined'
                  : 'StopOutlined',
      popConfirm: {
        title:
            data.cardStateType?.value === 'toBeActivated'
                ? '确认激活？'
                : data.cardStateType?.value === 'deactivate'
                    ? '确认复机？'
                    : '确认停用?',
        okText: '确定',
        cancelText: '取消',
        onConfirm: () => {
          let response;
          if (data.cardStateType?.value === 'toBeActivated') {
            response = changeDeploy(data.id);
            response.then((resp) => {
              if (resp.status === 200) {
                onlyMessage('操作成功');
                cardManageRef.value?.reload();
              }
            });
          } else if (data.cardStateType?.value === 'deactivate') {
            response = resumption(data.id);
            response.then((resp) => {
              if (resp.status === 200) {
                onlyMessage('操作成功');
                cardManageRef.value?.reload();
              }
            });
          } else {
            response = unDeploy(data.id);
            response.then((resp) => {
              if (resp.status === 200) {
                onlyMessage('操作成功');
                cardManageRef.value?.reload();
              }
            });
          }
          return response;
        },
      },
    },
    {
      key: 'delete',
      text: '删除',
      tooltip: {
        title: '删除',
      },
      popConfirm: {
        title: '确认删除?',
        okText: '确定',
        cancelText: '取消',
        onConfirm: () => {
          const response: any = del(data.id);
          response.then((resp: any) => {
            if (resp.status === 200) {
              onlyMessage('操作成功');
              const index = _selectedRowKeys.value.findIndex(
                  (id: any) => id === data.id,
              );
              if (index !== -1) {
                _selectedRowKeys.value.splice(index, 1);
              }
              cardManageRef.value?.reload();
            } else {
              onlyMessage('操作失败！', 'error');
            }
          });
          return response;
        },
      },
      icon: 'DeleteOutlined',
    },
  ];
  if (type === 'card') {
    return arr;
  } else {
    return [
      {
        key: 'view',
        text: '查看',
        tooltip: {
          title: '查看',
        },
        icon: 'EyeOutlined',
        onClick: () => {
          menuStory.jumpPage('iot-card/CardManagement/Detail', {
            id: data.id,
          });
        },
      },
      ...arr,
    ];
  }
};

const handleSearch = (e: any) => {
  params.value = {terms: e?.terms || []};
};

const onSelectChange = (keys: string[], rows: []) => {
  _selectedRowKeys.value = [...keys];
  // _selectedRow.value = [...rows];
};

const cancelSelect = () => {
  _selectedRowKeys.value = [];
};

const handleClick = (dt: any) => {
  if (!dt?.cardStateType) {
    return;
  }
  if (isCheck.value) {
    if (_selectedRowKeys.value.includes(dt.id)) {
      const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
      _selectedRowKeys.value.splice(_index, 1);
    } else {
      _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
    }
  } else {
    menuStory.jumpPage('iot-card/CardManagement/Detail', {
      id: dt.id,
    });
  }
};

const onCheckChange = () => {
  _selectedRowKeys.value = [];
};

/**
 * 新增
 */
const handleAdd = () => {
  visible.value = true;
  current.value = {};
  saveType.value = 'add';
};

/**
 * 新增、编辑关闭弹窗
 * @param val 加载表格
 */
const saveChange = (val: any) => {
  visible.value = false;
  current.value = {};
  if (val) {
    cardManageRef.value?.reload();
  }
};

/**
 * 绑定设备关闭窗口
 * @param val
 */
const bindDevice = (val: boolean) => {
  bindDeviceVisible.value = false;
  cardId.value = '';
  if (val) {
    cardManageRef.value?.reload();
  }
};

/**
 * 批量激活
 */
const handleActive = () => {
  if (!_selectedRowKeys.value.length) {
    return onlyMessage('请选择数据', 'warning');
  }
  if (
      _selectedRowKeys.value.length >= 10 &&
      _selectedRowKeys.value.length <= 100
  ) {
    changeDeployBatch(_selectedRowKeys.value).then((res: any) => {
      if (res.status === 200) {
        onlyMessage('操作成功');
      }
    });
  } else {
    onlyMessage(
        '仅支持同一个运营商下且最少10条数据,最多100条数据',
        'warning',
    );
  }
};

/**
 * 批量停用
 */
const handleStop = () => {
  if (
      _selectedRowKeys.value.length >= 10 &&
      _selectedRowKeys.value.length <= 100
  ) {
    const response = unDeployBatch(_selectedRowKeys.value);
    response.then((res: any) => {
      if (res.status === 200) {
        onlyMessage('操作成功');
      }
    });
    return response;
  } else {
    onlyMessage(
        '仅支持同一个运营商下且最少10条数据,最多100条数据',
        'warning',
    );
  }
};

/**
 * 批量复机
 */
const handleResumption = () => {
  if (
      _selectedRowKeys.value.length >= 10 &&
      _selectedRowKeys.value.length <= 100
  ) {
    const response = resumptionBatch(_selectedRowKeys.value);
    response.then((res: any) => {
      if (res.status === 200) {
        onlyMessage('操作成功');
      }
    });
    return response;
  } else {
    onlyMessage(
        '仅支持同一个运营商下且最少10条数据,最多100条数据',
        'warning',
    );
  }
};

/**
 * 同步状态
 */
const handleSync = async () => {
  syncVisible.value = true;
  // if (!_selectedRowKeys.value.length) {
  //     onlyMessage('请选择数据', 'error');
  //     return;
  // }

  // const api = `${BASE_API_PATH}/network/card/state/_sync`
  // const _source = new EventSourcePolyfill(api)
  //
  // _source.onmessage = (e: any) => {
  //   console.log(e)
  // }
  //
  // const resp = await sync(
  //     _selectedRowKeys.value.map((v) => ({ id: v })),
  // );
  //
  //     if (resp.status === 200) {
  //         _selectedRowKeys.value = [];
  //         cardManageRef.value?.reload();
  //         onlyMessage('同步状态成功');
  //     }
};

/**
 * 批量删除
 */
const handelRemove = () => {
  if (!_selectedRowKeys.value.length) {
    onlyMessage('请选择数据', 'error');
    return;
  }
  const response = removeCards(
      _selectedRowKeys.value.map((v) => ({id: v})),
  );
  response.then((resp) => {
    if (resp.status === 200) {
      onlyMessage('操作成功');
      _selectedRowKeys.value = [];
      // _selectedRow.value = [];
      cardManageRef.value?.reload();
    }
  });
  return response;
};
const batchActions: BatchActionsType[] = [
  {
    key: 'export',
    text: '批量导出',
    permission: 'iot-card/CardManagement:export',
    icon: 'ExportOutlined',
    onClick: () => {
      exportVisible.value = true;
    },
  },
  {
    key: 'import',
    text: '批量导入',
    permission: 'iot-card/CardManagement:import',
    icon: 'ImportOutlined',
    onClick: () => {
      importVisible.value = true;
    },
  },
  {
    key: 'stop',
    text: '批量停用',
    permission: 'iot-card/CardManagement:action',
    icon: 'StopOutlined',
    selected: {
      popConfirm: {
        title: '确认停用吗？',
        onConfirm: handleStop,
      },
    },
  },
  {
    key: 'resumption',
    text: '批量复机',
    ghost: true,
    type: 'primary',
    permission: 'iot-card/CardManagement:action',
    icon: 'PoweroffOutlined',
    selected: {
      popConfirm: {
        title: '确认复机吗？',
        onConfirm: handleResumption,
      },
    },
  },
  {
    key: 'sync',
    text: '同步状态',
    ghost: true,
    type: 'primary',
    permission: 'iot-card/CardManagement:sync',
    icon: 'SwapOutlined',
    onClick: handleSync,
  },
  {
    key: 'delete',
    text: '批量删除',
    danger: true,
    permission: 'iot-card/CardManagement:delete',
    icon: 'StopOutlined',
    selected: {
      popConfirm: {
        title: '确认删除吗？',
        onConfirm: handelRemove,
      },
    },
  },
];

const syncClose = () => {
  syncVisible.value = false;
  cardManageRef.value?.reload();
};

onMounted(() => {
  if (routerParams.params.value.type === 'add' && paltformPermission) {
    handleAdd();
  }
});
</script>

<style scoped lang="less">
.content-bottom {
  height: 38px;
}

.flow-text {
  font-size: 20px;
  font-weight: 600;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.ant-progress-inner) {
  border-radius: 0px;
}

:deep(.ant-progress-bg) {
  border-radius: 0px;
}
</style>
