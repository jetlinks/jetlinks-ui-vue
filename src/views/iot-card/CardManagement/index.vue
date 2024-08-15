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
                            <AIcon type="PlusOutlined" />{{ $t('CardManagement.index.237321-0') }}
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
                        :statusText="
                        slotProps.cardStateType?.value==='notReady'?$t('CardManagement.index.237321-18'):
                        slotProps.cardStateType?.value==='error'?$t('CardManagement.index.237321-19'):
                        slotProps.cardStateType?.value==='using'?$t('CardManagement.index.237321-20'):
                        slotProps.cardStateType?.value==='toBeActivated'?$t('CardManagement.index.237321-21'):
                        slotProps.cardStateType?.value==='deactivate'?$t('CardManagement.index.237321-22'):
                        $t('Cascade.index.755836-23')"
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
                                        {{ $t('CardManagement.index.237321-1') }}
                                    </div>
                                    <Ellipsis style="width: calc(100% - 20px)">
                                        <div>
                                            {{ slotProps.platformConfigName }}
                                        </div>
                                    </Ellipsis>
                                </j-col>
                                <j-col :span="6">
                                    <div class="card-item-content-text">
                                        {{ $t('CardManagement.index.237321-2') }}
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
                                        {{ $t('CardManagement.index.237321-3') }}
                                    </div>
                                    <div>{{ slotProps.cardType.text }}</div>
                                </j-col>
                                <j-col :span="6">
                                    <div class="card-item-content-text">
                                        {{ $t('CardManagement.index.237321-4') }}
                                    </div>
                                    <Ellipsis>{{
                                        slotProps.deviceName
                                    }}</Ellipsis>
                                </j-col>
                            </j-row>
                            <j-divider style="margin: 12px 0" />
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
                                            {{ $t('CardManagement.index.237321-5') }} {{ slotProps.totalFlow }} M
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
                                    <AIcon :type="item.icon" />
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
                        :status="slotProps.cardState?.value"
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
                                    <AIcon :type="i.icon" />
                                </template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </j-pro-table>
        </FullPage>
        <!-- {{ $t('CardManagement.index.237321-64') }} -->
        <Import
            v-if="importVisible"
            @close="importVisible = false"
            @save="importSave"
        />
        <!-- {{ $t('CardManagement.index.237321-63') }} -->
        <Export
            v-if="exportVisible"
            @close="exportVisible = false"
            :data="_selectedRowKeys"
        />
        <!-- {{ $t('CardManagement.index.237321-4') }} -->
        <BindDevice
            v-if="bindDeviceVisible"
            :cardId="cardId"
            @change="bindDevice"
        />
        <!-- {{ $t('CardManagement.index.237321-0') }}、{{ $t('CardManagement.index.237321-46') }} -->
        <Save
            v-if="visible"
            :type="saveType"
            :data="current"
            @change="saveChange"
        />
        <!--   批量同步     -->
        <SyncModal v-if="syncVisible" :params="params" @close="syncClose" />
    </page-container>
</template>

<script setup lang="ts">
import type { ActionsType } from '@/components/Table';
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
import type { CardManagement } from './typing';
import { getImage, onlyMessage } from '@/utils/comm';
import BindDevice from './BindDevice.vue';
import Import from './Import.vue';
import Export from './Export.vue';
import Save from './Save.vue';
import { useMenuStore } from 'store/menu';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import BatchDropdown from '@/components/BatchDropdown/index.vue';
import { BatchActionsType } from '@/components/BatchDropdown/types';
import { usePermissionStore } from 'store/permission';
import { useRouterParams } from '@/utils/hooks/useParams';
import { OperatorMap } from '@/views/iot-card/data';
import SyncModal from './Sync.vue';
import { OperatorList } from '../data';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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
        title: $t('CardManagement.index.237321-6'),
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
        title: $t('CardManagement.index.237321-4'),
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
        title: $t('CardManagement.index.237321-1'),
        dataIndex: 'platformConfigName',
        key: 'platformConfigName',
        width: 200,
        search: {
            rename: 'platformConfigId',
            type: 'select',
            options: async () => {
                return new Promise((resolve) => {
                    queryPlatformNoPage({
                        sorts: [{ name: 'createTime', order: 'desc' }],
                        terms: [{ column: 'state', value: 'enabled' }],
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
        title: $t('CardManagement.index.237321-7'),
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
        title: $t('CardManagement.index.237321-3'),
        dataIndex: 'cardType',
        key: 'cardType',
        scopedSlots: true,
        width: 120,
        search: {
            type: 'select',
            options: [
                { label: $t('CardManagement.index.237321-8'), value: 'year' },
                { label: $t('CardManagement.index.237321-9'), value: 'season' },
                { label: $t('CardManagement.index.237321-10'), value: 'month' },
                { label: $t('CardManagement.index.237321-11'), value: 'other' },
            ],
        },
    },
    {
        title: $t('CardManagement.index.237321-12'),
        key: 'totalFlow',
        dataIndex: 'totalFlow',
        width: 120,
        scopedSlots: true,
    },
    {
        title: $t('CardManagement.index.237321-13'),
        dataIndex: 'usedFlow',
        width: 120,
        scopedSlots: true,
    },
    {
        title: $t('CardManagement.index.237321-14'),
        dataIndex: 'residualFlow',
        width: 120,
        scopedSlots: true,
    },
    {
        title: $t('CardManagement.index.237321-15'),
        dataIndex: 'activationDate',
        key: 'activationDate',
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('CardManagement.index.237321-16'),
        dataIndex: 'updateTime',
        key: 'updateTime',
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('CardManagement.index.237321-17'),
        dataIndex: 'cardStateType',
        key: 'cardStateType',
        width: 180,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('CardManagement.index.237321-18'), value: 'notReady' },
                { label: $t('CardManagement.index.237321-19'), value: 'error' },
                { label: $t('CardManagement.index.237321-20'), value: 'using' },
                { label: $t('CardManagement.index.237321-21'), value: 'toBeActivated' },
                { label: $t('CardManagement.index.237321-22'), value: 'deactivate' },
                { label: $t('CardManagement.index.237321-23'), value: 'other' },
            ],
        },
    },
    {
        title: $t('CardManagement.index.237321-2'),
        dataIndex: 'cardState',
        key: 'cardState',
        width: 180,
        scopedSlots: true,
    },
    {
        title: $t('CardManagement.index.237321-2'),
        dataIndex: 'operatorState',
        key: 'operatorState',
        hidden: true,
        search: {
            type: 'select',
            options: [
                { label: $t('CardManagement.index.237321-24'), value: 'using' },
                { label: $t('CardManagement.index.237321-25'), value: 'testActivation' },
                { label: $t('CardManagement.index.237321-26'), value: 'disassemble' },
                { label: $t('CardManagement.index.237321-27'), value: 'deactivate' },
                { label: $t('CardManagement.index.237321-28'), value: 'operatorManagement' },
                { label: $t('CardManagement.index.237321-29'), value: 'beActivated' },
                { label: $t('CardManagement.index.237321-30'), value: 'toBeActivated' },
                { label: $t('CardManagement.index.237321-31'), value: 'testToActivation' },
                { label: $t('CardManagement.index.237321-32'), value: 'testable' },
                { label: $t('CardManagement.index.237321-33'), value: 'inStock' },
                { label: $t('CardManagement.index.237321-34'), value: 'preSeller' },
                { label: $t('CardManagement.index.237321-35'), value: 'oneWayShutdown' },
                { label: $t('CardManagement.index.237321-36'), value: 'preSale' },
                { label: $t('CardManagement.index.237321-37'), value: 'transfer' },
                { label: $t('CardManagement.index.237321-38'), value: 'dormant' },
                { label: $t('CardManagement.index.237321-39'), value: 'activatable' },
                { label: $t('CardManagement.index.237321-40'), value: 'expired' },
                { label: $t('CardManagement.index.237321-41'), value: 'cleared' },
                { label: $t('CardManagement.index.237321-42'), value: 'replaced' },
                { label: $t('CardManagement.index.237321-43'), value: 'stock' },
                { label: $t('CardManagement.index.237321-44'), value: 'start' },
            ],
        },
    },
    {
        title: $t('CardManagement.index.237321-45'),
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
            text: $t('CardManagement.index.237321-46'),
            tooltip: {
                title: $t('CardManagement.index.237321-46'),
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
            text: data.deviceId ? $t('CardManagement.index.237321-47') : $t('CardManagement.index.237321-4'),
            tooltip: {
                title: data.deviceId ? $t('CardManagement.index.237321-47') : $t('CardManagement.index.237321-4'),
            },
            icon: data.deviceId ? 'DisconnectOutlined' : 'LinkOutlined',
            popConfirm: data.deviceId
                ? {
                      title: $t('CardManagement.index.237321-48'),
                      okText: $t('CardManagement.index.237321-49'),
                      cancelText: $t('CardManagement.index.237321-50'),
                      onConfirm: () => {
                          const response = unbind(data.id);
                          response.then((resp: any) => {
                              if (resp.status === 200) {
                                  onlyMessage($t('CardManagement.index.237321-51'));
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
                    ? $t('CardManagement.index.237321-72')
                    : data.cardStateType?.value === 'deactivate'
                    ? $t('CardManagement.index.237321-52')
                    : $t('CardManagement.index.237321-53'),
            tooltip: {
                title:
                    data.cardStateType?.value === 'toBeActivated'
                        ? $t('CardManagement.index.237321-72')
                        : data.cardStateType?.value === 'deactivate'
                        ? $t('CardManagement.index.237321-52')
                        : $t('CardManagement.index.237321-53'),
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
                        ? $t('CardManagement.index.237321-54')
                        : data.cardStateType?.value === 'deactivate'
                        ? $t('CardManagement.index.237321-55')
                        : $t('CardManagement.index.237321-56'),
                okText: $t('CardManagement.index.237321-49'),
                cancelText: $t('CardManagement.index.237321-50'),
                onConfirm: () => {
                    let response;
                    if (data.cardStateType?.value === 'toBeActivated') {
                        response = changeDeploy(data.id);
                        response.then((resp) => {
                            if (resp.status === 200) {
                                onlyMessage($t('CardManagement.index.237321-51'));
                                cardManageRef.value?.reload();
                            }
                        });
                    } else if (data.cardStateType?.value === 'deactivate') {
                        response = resumption(data.id);
                        response.then((resp) => {
                            if (resp.status === 200) {
                                onlyMessage($t('CardManagement.index.237321-51'));
                                cardManageRef.value?.reload();
                            }
                        });
                    } else {
                        response = unDeploy(data.id);
                        response.then((resp) => {
                            if (resp.status === 200) {
                                onlyMessage($t('CardManagement.index.237321-51'));
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
            text: $t('CardManagement.index.237321-57'),
            tooltip: {
                title: $t('CardManagement.index.237321-57'),
            },
            popConfirm: {
                title: $t('CardManagement.index.237321-58'),
                okText: $t('CardManagement.index.237321-49'),
                cancelText: $t('CardManagement.index.237321-50'),
                onConfirm: () => {
                    const response: any = del(data.id);
                    response.then((resp: any) => {
                        if (resp.status === 200) {
                            onlyMessage($t('CardManagement.index.237321-51'));
                            const index = _selectedRowKeys.value.findIndex(
                                (id: any) => id === data.id,
                            );
                            if (index !== -1) {
                                _selectedRowKeys.value.splice(index, 1);
                            }
                            cardManageRef.value?.reload();
                        } else {
                            onlyMessage($t('CardManagement.index.237321-59'), 'error');
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
                text: $t('CardManagement.index.237321-60'),
                tooltip: {
                    title: $t('CardManagement.index.237321-60'),
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
    params.value = { terms: e?.terms || [] };
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
        return onlyMessage($t('CardManagement.index.237321-61'), 'warning');
    }
    if (
        _selectedRowKeys.value.length >= 10 &&
        _selectedRowKeys.value.length <= 100
    ) {
        changeDeployBatch(_selectedRowKeys.value).then((res: any) => {
            if (res.status === 200) {
                onlyMessage($t('CardManagement.index.237321-51'));
            }
        });
    } else {
        onlyMessage(
            $t('CardManagement.index.237321-62'),
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
                onlyMessage($t('CardManagement.index.237321-51'));
            }
        });
        return response;
    } else {
        onlyMessage(
            $t('CardManagement.index.237321-62'),
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
                onlyMessage($t('CardManagement.index.237321-51'));
            }
        });
        return response;
    } else {
        onlyMessage(
            $t('CardManagement.index.237321-62'),
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
    //     onlyMessage($t('CardManagement.index.237321-61'), 'error');
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
        onlyMessage($t('CardManagement.index.237321-61'), 'error');
        return;
    }
    const response = removeCards(
        _selectedRowKeys.value.map((v) => ({ id: v })),
    );
    response.then((resp) => {
        if (resp.status === 200) {
            onlyMessage($t('CardManagement.index.237321-51'));
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
        text: $t('CardManagement.index.237321-63'),
        permission: 'iot-card/CardManagement:export',
        icon: 'ExportOutlined',
        onClick: () => {
            exportVisible.value = true;
        },
    },
    {
        key: 'import',
        text: $t('CardManagement.index.237321-64'),
        permission: 'iot-card/CardManagement:import',
        icon: 'ImportOutlined',
        onClick: () => {
            importVisible.value = true;
        },
    },
    {
        key: 'stop',
        text: $t('CardManagement.index.237321-65'),
        permission: 'iot-card/CardManagement:action',
        icon: 'StopOutlined',
        selected: {
            popConfirm: {
                title: $t('CardManagement.index.237321-66'),
                onConfirm: handleStop,
            },
        },
    },
    {
        key: 'resumption',
        text: $t('CardManagement.index.237321-67'),
        ghost: true,
        type: 'primary',
        permission: 'iot-card/CardManagement:action',
        icon: 'PoweroffOutlined',
        selected: {
            popConfirm: {
                title: $t('CardManagement.index.237321-68'),
                onConfirm: handleResumption,
            },
        },
    },
    {
        key: 'sync',
        text: $t('CardManagement.index.237321-69'),
        ghost: true,
        type: 'primary',
        permission: 'iot-card/CardManagement:sync',
        icon: 'SwapOutlined',
        onClick: handleSync,
    },
    {
        key: 'delete',
        text: $t('CardManagement.index.237321-70'),
        danger: true,
        permission: 'iot-card/CardManagement:delete',
        icon: 'StopOutlined',
        selected: {
            popConfirm: {
                title: $t('CardManagement.index.237321-71'),
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
