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
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
            :rowSelection="
                isCheck
                    ? {
                          selectedRowKeys: _selectedRowKeys,
                          onChange: onSelectChange,
                      }
                    : false
            "
            @cancelSelect="cancelSelect"
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
                        <AIcon type="PlusOutlined" />新增
                    </PermissionButton>
                    <BatchDropdown
                        v-model:isCheck="isCheck"
                        :actions="batchActions"
                        @change="onCheckChange"
                    />
                    <!-- <j-dropdown>
                        <j-button>
                            批量操作
                            <AIcon type="DownOutlined" />
                        </j-button>
                        <template #overlay>
                            <j-menu>
                                <j-menu-item>
                                    <PermissionButton
                                        @click="exportVisible = true"
                                        :hasPermission="'iot-card/CardManagement:export'"
                                    >
                                        <AIcon type="ExportOutlined" />
                                        批量导出
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item>
                                    <PermissionButton
                                        @click="importVisible = true"
                                        :hasPermission="'iot-card/CardManagement:import'"
                                    >
                                        <AIcon type="ImportOutlined" />批量导入
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item>
                                    <PermissionButton
                                        :popConfirm="{
                                            title: '确认激活吗？',
                                            onConfirm: handleActive,
                                        }"
                                        :hasPermission="'iot-card/CardManagement:active'"
                                    >
                                        <AIcon type="CheckCircleOutlined" />
                                        批量激活
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item>
                                    <PermissionButton
                                        :popConfirm="{
                                            title: '确认停用吗？',
                                            onConfirm: handleStop,
                                        }"
                                        ghost
                                        type="primary"
                                        :hasPermission="'iot-card/CardManagement:action'"
                                    >
                                        <AIcon type="StopOutlined" />
                                        批量停用
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item>
                                    <PermissionButton
                                        :popConfirm="{
                                            title: '确认复机吗？',
                                            onConfirm: handleResumption,
                                        }"
                                        ghost
                                        type="primary"
                                        :hasPermission="'iot-card/CardManagement:action'"
                                    >
                                        <AIcon type="PoweroffOutlined" />
                                        批量复机
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item>
                                    <PermissionButton
                                        :popConfirm="{
                                            title: '确认同步状态吗？',
                                            onConfirm: handleSync,
                                        }"
                                        ghost
                                        type="primary"
                                        :hasPermission="'iot-card/CardManagement:sync'"
                                    >
                                        <AIcon type="SwapOutlined" />
                                        同步状态
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item v-if="_selectedRowKeys.length > 0">
                                    <PermissionButton
                                        :popConfirm="{
                                            title: '确认删除吗？',
                                            onConfirm: handelRemove,
                                        }"
                                        ghost
                                        type="primary"
                                        :hasPermission="'iot-card/CardManagement:delete'"
                                    >
                                        <AIcon type="SwapOutlined" />
                                        批量删除
                                    </PermissionButton>
                                </j-menu-item>
                            </j-menu>
                        </template>
                    </j-dropdown> -->
                </j-space>
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    @click="handleClick"
                    :actions="getActions(slotProps, 'card')"
                    v-bind="slotProps"
                    :active="_selectedRowKeys.includes(slotProps.id)"
                    :status="slotProps.cardStateType.value"
                    :statusText="slotProps.cardStateType.text"
                    :statusNames="{
                        using: 'processing',
                        toBeActivated: 'default',
                        deactivate: 'error',
                    }"
                >
                    <template #img>
                        <slot name="img">
                            <img :src="getImage('/iot-card/iot-card-bg.png')" />
                        </slot>
                    </template>
                    <template #content>
                      <span style="font-size: 16px; font-weight: 600">
                        <Ellipsis style="width: calc(100% - 100px)">
                                {{ slotProps.id }}
                        </Ellipsis>
                      </span>
                        <j-row style="margin-top: 20px">
                            <j-col :span="8">
                                <div class="card-item-content-text">
                                    平台对接
                                </div>
                                <div>{{ slotProps.platformConfigName }}</div>
                            </j-col>
                            <j-col :span="6">
                                <div class="card-item-content-text">类型</div>
                                <div>{{ slotProps.cardType.text }}</div>
                            </j-col>
                            <j-col :span="6">
                                <div class="card-item-content-text">
                                    绑定设备
                                </div>
                                <Ellipsis>{{ slotProps.deviceName }}</Ellipsis>
                            </j-col>
                        </j-row>
                        <j-divider style="margin: 12px 0" />
                        <div class="content-bottom">
<!--                            <div v-if="slotProps.usedFlow === 0">-->
<!--                                <span class="flow-text">-->
<!--                                    {{ slotProps.totalFlow }}-->
<!--                                </span>-->
<!--                                <span class="card-item-content-text">-->
<!--                                    M 使用流量</span-->
<!--                                >-->
<!--                            </div>-->
                            <div>
                                <div class="progress-text">
                                    <div>
                                        {{
                                            (
                                                (slotProps.usedFlow /
                                                    slotProps.totalFlow) *
                                                100
                                            ).toFixed(2)
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
                                        (slotProps.usedFlow /
                                            slotProps.totalFlow) *
                                        100
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
                        <!-- <a-tooltip
                            v-bind="item.tooltip"
                            :title="item.disabled && item.tooltip.title"
                        >
                            <a-popconfirm
                                v-if="item.popConfirm"
                                v-bind="item.popConfirm"
                                :disabled="item.disabled"
                            >
                                <a-button :disabled="item.disabled">
                                    <AIcon
                                        type="DeleteOutlined"
                                        v-if="item.key === 'delete'"
                                    />
                                    <template v-else>
                                        <AIcon :type="item.icon" />
                                        <span>{{ item.text }}</span>
                                    </template>
                                </a-button>
                            </a-popconfirm>
                            <template v-else>
                                <a-button
                                    :disabled="item.disabled"
                                    @click="item.onClick"
                                >
                                    <AIcon
                                        type="DeleteOutlined"
                                        v-if="item.key === 'delete'"
                                    />
                                    <template v-else>
                                        <AIcon :type="item.icon" />
                                        <span>{{ item.text }}</span>
                                    </template>
                                </a-button>
                            </template>
                                                        </j-tooltip> -->
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
            <template #operatorName='slotProps'>
              {{ OperatorMap[slotProps.operatorName]}}
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
        <!-- 批量导入 -->
        <Import v-if="importVisible" @close="importVisible = false"  @save="importSave"/>
        <!-- 批量导出 -->
        <Export
            v-if="exportVisible"
            @close="exportVisible = false"
            :data="_selectedRowKeys"
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
import { message } from 'jetlinks-ui-components';
import type { CardManagement } from './typing';
import { getImage } from '@/utils/comm';
import BindDevice from './BindDevice.vue';
import Import from './Import.vue';
import Export from './Export.vue';
import Save from './Save.vue';
import { useMenuStore } from 'store/menu';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import BatchDropdown from '@/components/BatchDropdown/index.vue';
import { BatchActionsType } from '@/components/BatchDropdown/types';
import {usePermissionStore} from "store/permission";
import {useRouterParams} from "@/utils/hooks/useParams";
import { OperatorList, OperatorMap } from '@/views/iot-card/data'

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
            defaultTermType: 'eq'
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
          rename: 'deviceName'
        }
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
        title: '运营商',
        dataIndex: 'operatorName',
        key: 'operatorName',
        width: 120,
        search: {
            type: 'select',
            options: OperatorList,
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
                { label: '年卡', value: 'year' },
                { label: '季卡', value: 'season' },
                { label: '月卡', value: 'month' },
                { label: '其他', value: 'other' },
            ],
        },
    },
    {
        title: '总流量',
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
        title: '状态',
        dataIndex: 'cardStateType',
        key: 'cardStateType',
        width: 180,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '激活', value: 'using' },
                { label: '未激活', value: 'toBeActivated' },
                { label: '停机', value: 'deactivate' },
                { label: '其它', value: 'using,toBeActivated,deactivate' },
            ]
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
  cardManageRef.value?.reload()
  importVisible.value = false
}

const routerParams = useRouterParams()

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
                      onConfirm: async () => {
                          unbind(data.id).then((resp: any) => {
                              if (resp.status === 200) {
                                  message.success('操作成功');
                                  cardManageRef.value?.reload();
                              }
                          });
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
                onConfirm: async () => {
                    if (data.cardStateType?.value === 'toBeActivated') {
                        changeDeploy(data.id).then((resp) => {
                            if (resp.status === 200) {
                                message.success('操作成功');
                                cardManageRef.value?.reload();
                            }
                        });
                    } else if (data.cardStateType?.value === 'deactivate') {
                        resumption(data.id).then((resp) => {
                            if (resp.status === 200) {
                                message.success('操作成功');
                                cardManageRef.value?.reload();
                            }
                        });
                    } else {
                        unDeploy(data.id).then((resp) => {
                            if (resp.status === 200) {
                                message.success('操作成功');
                                cardManageRef.value?.reload();
                            }
                        });
                    }
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
                onConfirm: async () => {
                    const resp: any = await del(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功');
                        cardManageRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
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
    const newParams = (e?.terms as any[])?.map(item1 => {
      item1.terms = item1.terms.map((item2: any) => {
        if (['cardStateType'].includes(item2.column) && !(['using', 'toBeActivated', 'deactivate'].includes(item2.value))) { // 处理其它状态
          item2.termType = 'nin'
        }
        return item2
      })
      return item1
    })
    params.value = { terms: newParams || [] };
};

const onSelectChange = (keys: string[], rows: []) => {
    _selectedRowKeys.value = [...keys];
    // _selectedRow.value = [...rows];
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
};

const handleClick = (dt: any) => {
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
      return message.warn('请选择数据');
    }
    if (
        _selectedRowKeys.value.length >= 10 &&
        _selectedRowKeys.value.length <= 100
    ) {
        changeDeployBatch(_selectedRowKeys.value).then((res: any) => {
            if (res.status === 200) {
                message.success('操作成功');
            }
        });
    } else {
        message.warn('仅支持同一个运营商下且最少10条数据,最多100条数据');
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
        unDeployBatch(_selectedRowKeys.value).then((res: any) => {
            if (res.status === 200) {
                message.success('操作成功');
            }
        });
    } else {
        message.warn('仅支持同一个运营商下且最少10条数据,最多100条数据');
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
        resumptionBatch(_selectedRowKeys.value).then((res: any) => {
            if (res.status === 200) {
                message.success('操作成功');
            }
        });
    } else {
        message.warn('仅支持同一个运营商下且最少10条数据,最多100条数据');
    }
};

/**
 * 同步状态
 */
const handleSync = () => {
    sync().then((res: any) => {
        if (res.status === 200) {
            cardManageRef.value?.reload();
            message.success('同步状态成功');
        }
    });
};

/**
 * 批量删除
 */
const handelRemove = async () => {
    if (!_selectedRowKeys.value.length) {
        message.error('请选择数据');
        return;
    }
    const resp = await removeCards(_selectedRowKeys.value.map( v => ({ id:v })));
    if (resp.status === 200) {
        message.success('操作成功');
        _selectedRowKeys.value = [];
        // _selectedRow.value = [];
        cardManageRef.value?.reload();
    }
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
    // {
    //     key: 'active',
    //     text: '批量激活',
    //     permission: 'iot-card/CardManagement:active',
    //     icon: 'CheckCircleOutlined',
    //     selected: {
    //         popConfirm: {
    //             title: '确认激活吗？',
    //             onConfirm: handleActive,
    //         },
    //     },
    // },
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
        popConfirm: {
            title: '确认同步状态吗？',
            onConfirm: handleSync,
        },
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

onMounted(() => {
  if (routerParams.params.value.type === 'add' && paltformPermission) {
    handleAdd()
  }
})
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
