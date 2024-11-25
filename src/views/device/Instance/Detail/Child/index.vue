<template>
    <div class="container">
        <div class="header">
            <div>
                <a-switch v-model:checked="_checked" @change="onChange" />
                <span class="header-action-text">实时保存</span>
                <span class="header-action-desc">实时保存映射关系至边端</span>
            </div>
            <a-space>
                <a-button v-if="!_checked" type="primary" @click="onSaveAll"
                    >保存</a-button
                >
            </a-space>
        </div>
        <div class="content">
            <div class="left">
                <div class="left-header">
                    <j-tooltip title="为网关设备下绑定的所有子设备列表">
                        云端设备列表
                        <AIcon
                            type="QuestionCircleOutlined"
                            style="margin-left: 2px; margin-right: 15px"
                        />
                    </j-tooltip>
                    <a-space>
                        <PermissionButton
                            :tooltip="{
                                title: '新增并绑定',
                            }"
                            type="link"
                            @click="onClick('add')"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                        <PermissionButton
                            :tooltip="{
                                title: '绑定',
                            }"
                            type="link"
                            @click="onClick('bind')"
                        >
                            <AIcon type="DisconnectOutlined" />
                        </PermissionButton>
                    </a-space>
                </div>
                <pro-search
                    :columns="searchColumns"
                    type="simple"
                    @search="handleSearch"
                />
                <div class="left-list">
                    <div style="min-height: 560px">
                        <a-dropdown
                            :trigger="['contextmenu']"
                            :visible="menuVisible"
                            @visible-change="handleVisible"
                        >
                            <template #overlay v-if="_customRow.id">
                                <a-menu>
                                    <a-menu-item
                                        v-for="item in action"
                                        :key="item.key"
                                    >
                                        <PermissionButton
                                            :disabled="item.disabled"
                                            :popConfirm="item.popConfirm"
                                            :tooltip="{
                                                ...item.tooltip,
                                            }"
                                            @click="item.onClick"
                                            type="link"
                                            style="padding: 0 5px"
                                            :danger="item.key === 'delete'"
                                        >
                                            <template #icon>
                                                <AIcon :type="item.icon" />
                                                {{ item.text }}
                                            </template>
                                        </PermissionButton>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                            <JProTable
                                ref="childDeviceRef"
                                :columns="columns"
                                :dataSource="_dataSource"
                                :noPagination="true"
                                :params="params"
                                :model="'TABLE'"
                                :scroll="{ y: 430 }"
                                :rowSelection="{
                                    selectedRowKeys: _selectedRowKeys,
                                    onChange: onSelectChange,
                                }"
                                :customRow="
                                    (record) => ({
                                        onContextmenu: (e) =>
                                            handleRow(e, record),
                                    })
                                "
                            >
                                <template #registryTime="slotProps">
                                    <j-ellipsis>
                                        {{
                                            slotProps.registryTime
                                                ? dayjs(
                                                      slotProps.registryTime,
                                                  ).format(
                                                      'YYYY-MM-DD HH:mm:ss',
                                                  )
                                                : '--'
                                        }}</j-ellipsis
                                    >
                                </template>
                                <template #id="scopedSlots">
                                    <div
                                        v-if="
                                            scopedSlots.Mappingtype !== 'auto'
                                        "
                                        class="renderId"
                                    >
                                        <a-badge
                                            :status="
                                                statusMap.get(
                                                    scopedSlots.state.value,
                                                )
                                            "
                                        />
                                        <a @click="onJump(scopedSlots.id)">
                                            <j-ellipsis style="width: 100px">
                                                {{ scopedSlots?.id }}
                                            </j-ellipsis>
                                        </a>
                                    </div>
                                    <div v-else>{{ '自动生成' }}</div>
                                </template>
                                <template #name="scopedSlots"
                                    ><j-ellipsis>{{
                                        scopedSlots.name || '--'
                                    }}</j-ellipsis></template
                                >
                                <template #productName="scopedSlots"
                                    ><j-ellipsis>{{
                                        scopedSlots.productName || '--'
                                    }}</j-ellipsis></template
                                >
                                <template #state="scopedSlots">
                                    <a-tooltip
                                        :title="scopedSlots.MappingError"
                                    >
                                        <a-tag
                                            :color="
                                                stateMap.get(
                                                    scopedSlots.MappingStatus,
                                                )?.status
                                            "
                                            >{{
                                                stateMap.get(
                                                    scopedSlots.MappingStatus,
                                                )?.text
                                            }}</a-tag
                                        >
                                    </a-tooltip>
                                </template>
                                <template #action="scopedSlots">
                                    <div
                                        v-if="!scopedSlots?.Mapping?.id"
                                        class="left-drag"
                                        @dragover.prevent
                                        @drop="(e) => onDrop(e, scopedSlots)"
                                    >
                                        从右侧拖拽卡片至此
                                    </div>
                                    <div
                                        v-else
                                        class="left-map"
                                        @dragover.prevent
                                        @drop="(e) => onCover(e, scopedSlots)"
                                    >
                                        <div style="display: flex">
                                            <a-badge
                                                :status="
                                                    statusMap.get(
                                                        scopedSlots?.Mapping
                                                            .state?.value,
                                                    )
                                                "
                                            />
                                            <j-ellipsis>
                                                {{
                                                    scopedSlots.Mapping.name
                                                }}({{
                                                    scopedSlots.Mapping.id
                                                }})</j-ellipsis
                                            >
                                        </div>

                                        <a-button
                                            v-if="!scopedSlots.loading"
                                            type="link"
                                            @click="onDelete(scopedSlots)"
                                        >
                                            <AIcon type="DeleteOutlined" />
                                        </a-button>

                                        <a-button
                                            v-if="
                                                !scopedSlots.loading &&
                                                scopedSlots.MappingStatus ===
                                                    'error'
                                            "
                                            type="link"
                                            style="padding: 0"
                                            @click="
                                                scopedSlots.action === 'drop'
                                                    ? onDrop('', scopedSlots)
                                                    : onDelete(scopedSlots)
                                            "
                                        >
                                            <AIcon type="RedoOutlined" />
                                        </a-button>
                                        <a-spin v-if="scopedSlots.loading" />
                                    </div>
                                </template>
                                <template #describe="scopedSlots">
                                    <j-ellipsis>{{
                                        scopedSlots.describe || '--'
                                    }}</j-ellipsis></template
                                >
                            </JProTable>
                        </a-dropdown>
                    </div>
                    <a-space class="left-state">
                        <a-badge status="success" text="在线" />
                        <a-badge status="error" text="离线" />
                        <a-badge status="warning" text="禁用" />
                    </a-space>
                    <div
                        class="left-bottom"
                        @dragover.prevent
                        @drop="onDropAuto"
                    >
                        未找到对应云端设备？拖动卡片到此处可在云端创建设备并自动绑定
                    </div>
                </div>
            </div>
            <div class="fold">
                <div
                    class="fold-item"
                    :style="fold ? { left: '12px' } : { left: '8px' }"
                    @click="onFold"
                >
                    <AIcon
                        :type="
                            fold ? 'CaretLeftOutlined' : 'CaretRightOutlined'
                        "
                        style="font-size: 24px"
                    />
                </div>
            </div>
            <div v-if="!fold" class="right">
                <div class="right-title">
                    <span>边端未映射设备列表</span>
                    <a-input-search
                        v-model:value="_search"
                        style="width: 200px"
                        placeholder="搜索"
                        enter-button
                        allow-clear
                        @search="onRightSearch"
                    />
                </div>
                <div class="right-list">
                    <template v-if="edgeList.length">
                        <div
                            v-for="item in edgeList"
                            class="right-item"
                            :draggable="true"
                            @dragstart="() => onStart(item)"
                            @click="onDetail(item)"
                        >
                            <div class="item-name">
                                <j-ellipsis>{{ item.name }}</j-ellipsis>
                            </div>
                            <div class="item-info">
                                <span>
                                    <j-ellipsis>ID:{{ item.id }}</j-ellipsis>
                                </span>
                                <span
                                    style="display: flex; align-items: center"
                                >
                                    <j-ellipsis
                                        >产品:{{ item.productName }}</j-ellipsis
                                    >
                                    <AIcon
                                        v-if="item.masterProductId"
                                        type="CloudOutlined"
                                        style="color: #4096ff; margin-left: 3px"
                                    />
                                </span>
                                <span>
                                    <j-ellipsis
                                        >说明:{{
                                            item.describe || '--'
                                        }}</j-ellipsis
                                    >
                                </span>
                            </div>
                        </div>
                        <div class="right-pagination"></div>
                    </template>
                    <template v-else>
                        <j-empty style="margin-top: 50%" />
                    </template>
                </div>
                <div class="right-bottom">
                    <AIcon type="CloudOutlined" style="color: #4096ff" />
                    <span style="color: #646c73; font-size: 12px">
                        此标志表示该设备所属产品由云端模板创建，支持直接在云端生成对应设备
                    </span>
                </div>
            </div>
            <div v-else class="right-fold"></div>
        </div>
        <Save v-if="visible" @close="onClose" />
        <Bind
            v-if="bindVisible"
            :parentIds="parentIds"
            @change="onClose"
            title="绑定平台设备"
        />
        <actionModal
            v-if="actionRef.visible"
            :type="actionRef.type"
            :rows="actionRef.rows"
            :batch="actionRef.batch"
            @close="onClose"
        />
        <DeviceDetail
            v-if="edgeVisible"
            :data="edgeCurrent"
            type="edge"
            :edgeId="route.params.id"
            @close="onDetailClose"
        />
    </div>
</template>

<script setup name="Child">
import { stateMap, columns, statusMap} from './data';
import {
    queryNoPagingPost,
    addDevice,
    editDevice,
    _undeployCloud,
    _deployCloud,
    _unbindCloud,
    _deleteCloud,
} from '@/api/device/instance';
import { queryProductList } from '@/api/device/product';
import { useInstanceStore } from '@/store/instance';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import Save from './Save/index.vue';
import Bind from '../ChildDevice/BindChildDevice/index.vue';
import { _queryByEdge, _commandByEdge } from '@/api/edge/batch';
import { onlyMessage, LocalStore } from '@/utils/comm';
import { randomString } from '@/utils/utils';
import { cloneDeep } from 'lodash-es';
import { useMenuStore } from '@/store/menu';
import actionModal from './actionModal.vue';
import { Modal } from 'ant-design-vue';
import { TOKEN_KEY } from '@/utils/variable';
import { EventEmitter } from '@/utils/utils';
import DeviceDetail from '@/views/edge/Batch/task/Children/DeviceDetail/index.vue';

const props = defineProps({
    isRefresh: {
        type: Boolean,
        default: () => {},
    },
});

const instanceStore = useInstanceStore();
const _checked = ref(true);
const _selectedRowKeys = ref([]);
const childDeviceRef = ref();
const { detail } = storeToRefs(instanceStore);
const params = ref({});
const menuVisible = ref(false);
const _customRow = ref({});
const fold = ref(false);
const visible = ref(false);
const bindVisible = ref(false);
const parentIds = ref([instanceStore.detail.id]);
const _search = ref('');
const edgeList = ref([]);
const _edgeInitList = ref([]);
const _drop = ref({});
const _dropList = ref([]);
const _dataSource = ref([]);
const _bindInitList = ref([]);
const menuStory = useMenuStore();
const actionRef = reactive({
    visible: false,
    type: '',
    rows: [],
    batch: false,
});
const edgeVisible = ref(false);
const edgeCurrent = ref({});
const editStatus = ref(false);
const route = useRoute();

const onSelectChange = (keys) => {
    _selectedRowKeys.value = [...keys];
};


const searchColumns = [
    {
        title: '平台设备名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '平台设备ID',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true,
        search: {
            type: 'string',
            // defaultTermType: 'eq',
        },
    },
    {
        title: '所属产品',
        dataIndex: 'productName',
        key: 'productName',
        scopedSlots: true,
        search: {
            type: 'select',
            rename: 'productId',
            options: () =>
                new Promise((resolve) => {
                    queryNoPagingPost({ paging: false }).then((resp) => {
                        resolve(
                            resp.result.map((item) => ({
                                label: item.name,
                                value: item.id,
                            })),
                        );
                    });
                }),
        },
    },
    {
        title: '注册时间',
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
          search: {
            type: 'date',
        },
    },
  
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'string',
        },
    },
]
const handleSearch = async (e) => {
    if (instanceStore.detail.id && e) {
        const terms = [
            {
                column: 'parentId',
                value: instanceStore.detail.id,
                termType: 'eq',
                type: 'and',
            },
        ];
        if (e?.terms?.length) {
            terms.push(e.terms[0]);
        }
        const res = await queryNoPagingPost({
            paging: false,
            // sorts: [{ name: 'createTime', order: 'desc' }],
            terms: terms,
        });

        if (res.success) {
            try {
                const resp = await _queryByEdge(instanceStore.detail.id, {
                    terms: [{ column: 'key', value: '', termType: 'notnull' }],
                });
                if (resp.success) {
                    _dropList.value = [...resp.result];
                    _bindInitList.value = [...resp.result];
                }
                _dataSource.value = res.result.map((item) => {
                    const isMap = _dropList.value?.find(
                        (i) => i.id === item.id || i.mappingId === item.id,
                    );
                    if (isMap?.id) {
                        return {
                            ...item,
                            MappingStatus: 'success',
                            Mapping: isMap,
                        };
                    } else {
                        return {
                            ...item,
                            MappingStatus: 'none',
                        };
                    }
                });
            } catch (error) {
                _dataSource.value = res.result.map((item) => {
                    const isMap = _dropList.value?.find(
                        (i) => i.id === item.id || i.mappingId === item.id,
                    );
                    if (isMap?.id) {
                        return {
                            ...item,
                            MappingStatus: 'success',
                            Mapping: isMap,
                        };
                    } else {
                        return {
                            ...item,
                            MappingStatus: 'none',
                        };
                    }
                });
            }

            console.log('_dataSource.value====', _dataSource.value);
            console.log('res.resulte====', res.result);
        }
    }
};

const onSaveAll = async (cb) => {
    const _arr = _dataSource.value
        .map((item) => {
            if (
                item.MappingStatus === 'warning' ||
                item.MappingStatus === 'success'
            ) {
                return {
                    deviceId: item.Mapping.id,
                    key: item.id,
                };
            }
        })
        .filter((item) => item?.deviceId);
    const _none = _bindInitList.value.map((item) => item?.id);
    const _auto = _dataSource.value.filter(
        (item) => item?.Mappingtype === 'auto',
    );
    if (_none.length) {
        await _commandByEdge(instanceStore.detail.id, 'BatchUnbindDevice', {
            deviceId: _none,
        });
    }
    if (_auto.length) {
        const objs = _auto.map((item) => ({
            id: item.id,
            name: item.name,
            parentId: instanceStore.detail.id,
            productId: item.Mapping.masterProductId,
            productName: item.Mapping.productName,
        }));
        await editDevice(objs);
    }

    const res = await _commandByEdge(
        instanceStore.detail.id,
        'BatchBindDevice',
        {
            bindInfo: _arr,
        },
    ).finally(() => {
        cb && cb?.();
    });
    if (res.success) {
        handleRefresh();
        onlyMessage('操作成功');
    }
};

const onChange = (checked) => {
    if (checked) {
        onSaveAll();
    }
};

const onClick = (type) => {
    if (type === 'add') {
        visible.value = true;
    } else {
        bindVisible.value = true;
    }
};

const handleRow = (e, record) => {
    e.preventDefault();
    menuVisible.value = true;
    _customRow.value = record;
};

const handleVisible = (e) => {
    menuVisible.value = e;
    _customRow.value = {};
};

const action = computed(() =>
    _selectedRowKeys.value?.length > 0
        ? getActions('batch', _customRow.value)
        : getActions('action', _customRow.value),
);

const getActions = (type, data) => {
    const actions = [
        {
            key: 'view',
            text: '解绑',
            tooltip: {
                title: '解绑',
            },
            icon: 'DisconnectOutlined',
            onClick: async () => {
                menuVisible.value = false;
                actionRef.visible = true;
                actionRef.type = 'unbind';
                actionRef.rows = [_customRow.value?.id];
            },
        },

        {
            key: 'action',
            text: data.state?.value !== 'notActive' ? '禁用' : '启用',
            tooltip: {
                title: data.state?.value !== 'notActive' ? '禁用' : '启用',
            },
            icon:
                data.state.value !== 'notActive'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            onClick: async () => {
                menuVisible.value = false;
                actionRef.visible = true;
                actionRef.rows = [_customRow.value?.id];
                if (data.state?.value !== 'notActive') {
                    actionRef.type = 'undeploy';
                } else {
                    actionRef.type = 'deploy';
                }
            },
        },
        {
            key: 'delete',
            text: '删除',
            disabled: data.state?.value !== 'notActive',
            tooltip: {
                title:
                    data.state.value !== 'notActive'
                        ? '已启用的设备不能删除'
                        : '删除',
            },
            onClick: async () => {
                menuVisible.value = false;
                actionRef.visible = true;
                actionRef.rows = [_customRow.value?.id];
                actionRef.type = 'delete';
            },
            icon: 'DeleteOutlined',
        },
    ];
    const batchActions = [
        {
            key: 'unbind',
            text: '批量解绑',
            tooltip: {
                title: detail.value.state?.value === 'online' ? '批量解绑' : '网关不在线，暂无法操作',
            },
            disabled: detail.value.state?.value !== 'online',
            icon: 'DisconnectOutlined',
            onClick: () => {
                if (_checked.value) {
                    menuVisible.value = false;
                    actionRef.visible = true;
                    actionRef.type = 'unbind';
                    actionRef.rows = _selectedRowKeys.value;
                    actionRef.batch = true;
                } else {
                    onSaveAll(() => {
                        menuVisible.value = false;
                        actionRef.visible = true;
                        actionRef.type = 'unbind';
                        actionRef.rows = _selectedRowKeys.value;
                        actionRef.batch = true;
                    });
                }
            },
        },

        {
            key: 'undeploy',
            text: '批量禁用',
            tooltip: {
                title: detail.value.state?.value === 'online' ? '批量禁用' : '网关不在线，暂无法操作',
            },
            disabled: detail.value.state?.value !== 'online',
            icon: 'StopOutlined',
            onClick: () => {
                if (_checked.value) {
                    menuVisible.value = false;
                    actionRef.visible = true;
                    actionRef.type = 'undeploy';
                    actionRef.rows = _selectedRowKeys.value;
                    actionRef.batch = true;
                } else {
                    onSaveAll(() => {
                        menuVisible.value = false;
                        actionRef.visible = true;
                        actionRef.type = 'undeploy';
                        actionRef.rows = _selectedRowKeys.value;
                        actionRef.batch = true;
                    });
                }
            },
        },
        {
            key: 'deploy',
            text: '批量启用',
            tooltip: {
                title: detail.value.state?.value === 'online' ? '批量禁用' : '网关不在线，暂无法操作',
            },
            disabled: detail.value.state?.value !== 'online',
            icon: 'CheckCircleOutlined',
            onClick: () => {
                if (_checked.value) {
                    menuVisible.value = false;
                    actionRef.visible = true;
                    actionRef.type = 'deploy';
                    actionRef.rows = _selectedRowKeys.value;
                    actionRef.batch = true;
                } else {
                    onSaveAll(() => {
                        menuVisible.value = false;
                        actionRef.visible = true;
                        actionRef.type = 'deploy';
                        actionRef.rows = _selectedRowKeys.value;
                        actionRef.batch = true;
                    });
                }
            },
        },
        {
            key: 'delete',
            text: '批量删除',
            tooltip: {
                title: detail.value.state?.value === 'online' ? '批量禁用' : '网关不在线，暂无法操作',
            },
            disabled: detail.value.state?.value !== 'online',
            onClick: async () => {
                if (_checked.value) {
                    menuVisible.value = false;
                    actionRef.visible = true;
                    actionRef.type = 'delete';
                    actionRef.rows = _selectedRowKeys.value;
                    actionRef.batch = true;
                } else {
                    onSaveAll(() => {
                        menuVisible.value = false;
                        actionRef.visible = true;
                        actionRef.type = 'delete';
                        actionRef.rows = _selectedRowKeys.value;
                        actionRef.batch = true;
                    });
                }
            },
            icon: 'DeleteOutlined',
        },
    ];

    if (type === 'batch') {
        return batchActions;
    } else {
        return actions;
    }
};

const onFold = () => {
    fold.value = !fold.value;
};

const onClose = () => {
    visible.value = false;
    bindVisible.value = false;
    actionRef.visible = false;
    _selectedRowKeys.value = [];
    actionRef.batch = false;
    handleRefresh();
};

const onDetail = (item) => {
    setTimeout(() => {
        edgeVisible.value = true;
        edgeCurrent.value = item;
    }, 300);
};

const onDetailClose = async () => {
    // edgeVisible.value = false;
    await instanceStore.refresh(route.params?.id).finally(() => {
        edgeVisible.value = false;
    });
};

const onRightSearch = (e) => {
    if (e) {
        edgeList.value = _edgeInitList.value.filter(
            (i) => i.name.indexOf(e) > -1,
        );
    } else {
        edgeList.value = _edgeInitList.value;
    }
};
//边端未映射
const getNoMapping = async () => {
    const res = await _queryByEdge(instanceStore.detail.id, {
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [{ column: 'key', value: '', termType: 'isnull' }],
    });
    if (res.success) {
        edgeList.value = [...res.result];
        _edgeInitList.value = [...res.result];
    }
};
const handleRefresh = () => {
    getNoMapping();
    handleSearch(true);
};

const onJump = (id) => {
    menuStory.jumpPage('device/Instance/Detail', { id });
};

//开始拖拽
const onStart = (item) => {
    _drop.value = item;
};
//拖拽结束
const onDrop = async (e, item) => {
    if (_checked.value) {
        item.loading = true;
        item.Mapping = _drop.value;
        const res = await _commandByEdge(
            instanceStore.detail.id,
            'BindMasterDevice',
            {
                deviceId: _drop.value.id,
                masterDeviceId: item.id,
            },
        )
            .finally(() => {
                item.loading = false;
            })
            .catch((e) => {
                item.MappingStatus = 'error';
                item.MappingError = e.message;
            });
        if (res.success) {
            item.MappingStatus = 'success';
            handleRefresh();
        } else {
            item.MappingStatus = 'error';
        }
    } else {
        item.Mapping = _drop.value;
        item.MappingStatus = 'warning';
        item.action = 'drop';
        edgeList.value = edgeList.value.filter((i) => i.id !== _drop.value.id);
        _edgeInitList.value = _edgeInitList.value.filter(
            (i) => i.id !== _drop.value.id,
        );
        _dropList.value.push(item);
        editStatus.value = true;
    }
};
//覆盖操作
const onCover = async (e, item) => {
    const coverData = cloneDeep(item.Mapping);
    if (_checked.value) {
        item.loading = true;
        item.Mapping = _drop.value;
        const res = await _commandByEdge(
            instanceStore.detail.id,
            'BindMasterDevice',
            {
                deviceId: _drop.value.id,
                masterDeviceId: item.id,
            },
        ).finally(() => {
            item.loading = false;
        });
        if (res.success) {
            item.MappingStatus = 'success';
            handleRefresh();
        } else {
            item.MappingStatus = 'error';
        }
    } else {
        item.Mapping = {
            ..._drop.value,
        };
        item.MappingStatus = 'warning';
        item.action = 'drop';
        edgeList.value.unshift(coverData);
        edgeList.value = edgeList.value.filter((i) => i.id !== _drop.value.id);
        _edgeInitList.value = _edgeInitList.value.filter(
            (i) => i.id !== _drop.value.id,
        );
        editStatus.value = true;
    }
};

const onDelete = (item) => {
    item.action = 'delete';
    if (item.id) {
        if (_checked.value) {
            item.loading = true;

            _commandByEdge(instanceStore.detail.id, 'UnbindDevice', {
                key: item.id,
            })
                .then((res) => {
                    if (res.success) {
                        item.MappingStatus = 'none';
                        handleRefresh();
                    } else {
                        item.MappingStatus = 'error';
                    }
                })
                .finally(() => {
                    item.loading = false;
                    // item.MappingStatus = 'error';
                })
                .catch((e) => {
                    item.MappingStatus = 'error';
                    item.MappingError = e.message;
                });
        } else {
            edgeList.value.unshift(item.Mapping);
            _edgeInitList.value.unshift(item.Mapping);
            if (item.Mappingtype === 'auto') {
                _dataSource.value = _dataSource.value.filter(
                    (i) => i.Mapping?.id !== item.Mapping?.id,
                );
                _dropList.value = _dropList.value.filter(
                    (i) => i.id !== item.id,
                );
            } else {
                item.Mapping = {};
                item.MappingStatus = 'none';
            }
            editStatus.value = true;
        }
    } else {
        edgeList.value.unshift(item.Mapping);
        _edgeInitList.value.unshift(item.Mapping);
        _dataSource.value = _dataSource.value.filter(
            (i) => i.Mapping?.id !== item.Mapping?.id,
        );
        _dropList.value = _dropList.value.filter(
            (i) => i.Mapping?.id !== item.Mapping?.id,
        );
    }
};
//拖拽自动生成
const onDropAuto = () => {
    if (_drop.value.masterProductId) {
        queryProductList({
            terms: [
                {
                    column: 'id',
                    value: _drop.value.masterProductId,
                    termType: 'eq',
                },
            ],
        }).then((res) => {
            if (res.success) {
                if (res.result.data.length > 0) {
                    const obj = {
                        id: randomString(12),
                        name: _drop.value.name,
                        Mappingtype: 'auto',
                        Mapping: _drop.value,
                        MappingStatus: 'warning',
                    };
                    edgeList.value = edgeList.value.filter(
                        (i) => i.id !== _drop.value.id,
                    );
                    _edgeInitList.value = _edgeInitList.value.filter(
                        (i) => i.id !== _drop.value.id,
                    );
                    _dataSource.value.unshift(obj);
                    _dropList.value.unshift(obj);
                    if (_checked.value) {
                        onAuto(obj);
                    }
                } else {
                    onlyMessage('云端产品不存在', 'error');
                }
            }
        });
    } else {
        onlyMessage(
            '该设备所属产品不是由云端模板创建，不支持支持直接在云端生成对应设备',
            'warning',
        );
    }
};

const onAuto = async (item) => {
    const deviceInfo = {
        id: item.id,
        name: item.name,
        parentId: instanceStore.detail.id,
        productId: item.Mapping.masterProductId,
        productName: item.Mapping.productName,
    };

    const res = await addDevice(deviceInfo);
    if (res.success) {
        item.loading = true;
        const resp = await _commandByEdge(
            instanceStore.detail.id,
            'BindMasterDevice',
            {
                deviceId: _drop.value.id,
                masterDeviceId: item.id,
            },
        )
            .finally(() => {
                item.loading = false;
            })
            .catch((e) => {
                item.MappingStatus = 'error';
                item.MappingError = e.message;
            });
        if (resp.success) {
            item.MappingStatus = 'success';
            handleRefresh();
        } else {
            item.MappingStatus = 'error';
        }
    }
};

//离开页面
const TabsChange = (next) => {
    if (editStatus.value && LocalStore.get(TOKEN_KEY)) {
        const modal = Modal.confirm({
            content: '页面改动数据未保存',
            okText: '保存',
            cancelText: '不保存',
            zIndex: 1400,
            closable: true,
            onOk: () => {
                onSaveAll();
                next?.();
            },
            onCancel: (e) => {
                modal.destroy();
                next?.();
            },
        });
    } else {
        next?.();
    }
};

onBeforeRouteUpdate((to, from, next) => {
    // 设备管理内路由跳转
    TabsChange(next);
});

onBeforeRouteLeave((to, from, next) => {
    // 设备管理外路由跳转
    TabsChange(next);
});

watch(
    () => props.isRefresh,
    (val) => {
        handleRefresh();
    },
    { immediate: true },
);

onMounted(() => {
    EventEmitter.subscribe(['ChildTabs'], TabsChange);
    if (instanceStore.detail.id) {
        getNoMapping();
        handleRefresh();
    }
});
onUnmounted(() => {
    editStatus.value = false;
    EventEmitter.unSubscribe(['ChildTabs'], TabsChange);
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
