<template>
    <div class="container">
      <div class="header">
        <div>
          <a-switch v-model:checked="_checked" @change="onChange"/>
          <span class="header-action-text">{{ $t('Child.index.135369-0') }}</span>
          <span class="header-action-desc">{{ $t('Child.index.135369-1') }}</span>
        </div>
        <a-space>
          <a-button v-if="!_checked" type="primary" @click="onSaveAll"
          >{{ $t('Child.index.135369-2') }}
          </a-button
          >
        </a-space>
      </div>
      <div class="content">
        <div class="left">
          <div class="left-header">
            <a-tooltip :title="$t('Child.index.135369-3')">
              {{ $t('Child.index.135369-4') }}
              <AIcon
                  type="QuestionCircleOutlined"
                  style="margin-left: 2px; margin-right: 15px"
              />
            </a-tooltip>
            <a-space>
              <j-permission-button
                  :tooltip="{
                                title: $t('Child.index.135369-5'),
                            }"
                  type="link"
                  @click="onClick('add')"
              >
                <AIcon type="PlusOutlined"/>
              </j-permission-button>
              <j-permission-button
                  :tooltip="{
                                title: $t('Child.index.135369-6'),
                            }"
                  type="link"
                  @click="onClick('bind')"
              >
                <AIcon type="DisconnectOutlined"/>
              </j-permission-button>
            </a-space>
          </div>
          <pro-search
              :columns="searchColumns"
              type="simple"
              @search="onSearch"
              style="margin-bottom: 0"
          />
          <div class="left-list">
            <div style="height: calc(100% - 106px);overflow-y: auto">
              <a-dropdown
                  :trigger="['contextmenu']"
                  :open="menuVisible"
                  @open-change="handleVisible"
              >
                <template #overlay v-if="_customRow.id">
                  <a-menu>
                    <a-menu-item
                        v-for="item in action"
                        :key="item.key"
                        style="width: 150px;"
                    >
                      <j-permission-button
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
                          <AIcon :type="item.icon"/>
                        </template>
                        {{ item.text }}
                      </j-permission-button>
                    </a-menu-item>
                  </a-menu>
                </template>
                <JProTable
                    ref="childDeviceRef"
                    :columns="columns"
                    :dataSource="_dataSource"
                    :noPagination="true"
                    :params="params"
                    :mode="'TABLE'"
                    type="TREE"
                    :scroll="{ x: 1500 }"
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
                                :height="430"
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
                      }}
                    </j-ellipsis
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
                        <j-ellipsis>
                          {{ scopedSlots?.id }}
                        </j-ellipsis>
                      </a>
                    </div>
                    <div v-else>{{ $t('Child.index.135369-7') }}</div>
                  </template>
                  <template #name="scopedSlots">
                    <j-ellipsis>{{
                        scopedSlots.name || '--'
                      }}
                    </j-ellipsis>
                  </template>
                  <template #productName="scopedSlots">
                    <j-ellipsis>{{
                        scopedSlots.productName || '--'
                      }}
                    </j-ellipsis>
                  </template>
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
                        }}
                      </a-tag
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
                      {{ $t('Child.index.135369-8') }}
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
                                                        scopedSlots?.Mapping.state
                                                            ?.value,
                                                    )
                                                "
                        />
                        <j-ellipsis>
                          {{
                            scopedSlots.Mapping.name
                          }}({{
                            scopedSlots.Mapping.id
                          }})
                        </j-ellipsis
                        >
                      </div>

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
                                                    : onDelete(scopedSlots, 'refresh')
                                            "
                      >
                        <AIcon type="RedoOutlined"/>
                      </a-button>
                      <a-button
                          v-if="!scopedSlots.loading"
                          type="link"
                          @click="onDelete(scopedSlots)"
                      >
                        <AIcon type="DeleteOutlined"/>
                      </a-button>
                      <a-spin v-if="scopedSlots.loading"/>
                    </div>
                  </template>
                  <template #describe="scopedSlots">
                    <j-ellipsis>{{
                        scopedSlots.describe || '--'
                      }}
                    </j-ellipsis>
                  </template
                  >
                </JProTable>
              </a-dropdown>
            </div>
            <a-space class="left-state">
              <a-badge status="success" :text="$t('Child.index.135369-9')"/>
              <a-badge status="error" :text="$t('Child.index.135369-10')"/>
              <a-badge status="warning" :text="$t('Child.index.135369-11')"/>
            </a-space>
            <div
                class="left-bottom"
                @dragover.prevent
                @drop="onDropAuto"
            >
              {{ $t('Child.index.135369-12') }}
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
            <span>{{ $t('Child.index.135369-13') }}</span>
            <a-input-search
                v-model:value="_search"
                style="width: 200px"
                :placeholder="$t('Child.index.135369-14')"
                enter-button
                allow-clear
                @search="onRightSearch"
            />
          </div>
          <div class="right-list">
            <template v-if="edgeList.length">
              <a-spin :spinning="dropLoading">
                <div
                    v-for="item in edgeList"
                    class="right-item"
                    :draggable="true"
                    @dragstart="() => onStart(item)"
                    @click="onDetail(item)"
                >
                  <div class="item-header">
                    <div class="item-name"><j-ellipsis>{{ item.name }}</j-ellipsis></div>
<!--                    <div class="item-tag">节点名称XXXX</div>-->
                  </div>
                  <div class="item-info">
                                    <span>
                                        <j-ellipsis
                                        >ID:{{ item.id }}</j-ellipsis
                                        >
                                    </span>
                    <span
                        style="
                                            display: flex;
                                            align-items: center;
                                        "
                    >
                                        <j-ellipsis
                                        >{{ $t('Child.index.135369-15') }}{{
                                            item.productName
                                          }}</j-ellipsis
                                        >
                                        <AIcon
                                            v-if="item.masterProductId"
                                            type="CloudOutlined"
                                            style="
                                                color: #4096ff;
                                                margin-left: 3px;
                                            "
                                        />
                                    </span>
                    <span>
                                        <j-ellipsis
                                        >{{ $t('Child.index.135369-16') }}{{
                                            item.describe || '--'
                                          }}</j-ellipsis
                                        >
                                    </span>
                  </div>
                </div>
              </a-spin>
              <div class="right-pagination"></div>
            </template>
            <template v-else>
              <div style="margin-top: 30%">
                <j-empty>
                    <template #description>
                        <p>暂无数据</p>
                        <span style="color: #999">请点击右上角「刷新按钮」，同步网关状态</span>
                    </template>
                </j-empty>
              </div>
            </template>
          </div>
          <div class="right-bottom">
            <AIcon type="CloudOutlined" style="color: #4096ff"/>
            <span style="color: #646c73; font-size: 12px">
                        {{ $t('Child.index.135369-17') }}
                    </span>
          </div>
        </div>
        <div v-else class="right-fold"></div>
      </div>
    </div>
        <Save v-if="visible" @close="onClose" />
        <Bind
            v-if="bindVisible"
            :parentIds="parentIds"
            :title="$t('Child.index.135369-18')"
            @change="onClose"
        />
        <actionModal
            v-if="actionRef.visible"
            :type="actionRef.type"
            :rows="actionRef.rows"
            :batch="actionRef.batch"
            :is-map="isMap"
            @close="onClose"
        />
<!--        <DeviceDetail-->
<!--            v-if="edgeVisible"-->
<!--            :data="edgeCurrent"-->
<!--            type="edge"-->
<!--            :edgeId="route.params.id"-->
<!--            @close="onDetailClose"-->
<!--        />-->
</template>

<script setup name="Child">
import { stateMap, columns, statusMap } from './data';
import {
    queryNoPagingPost,
    getProductListNoPage,
    addDevice,
    editDevice,
    _queryByEdge,
    _commandByEdge
} from '../../../../../api/instance';
import { queryProductList } from '../../../../../api/product';
import { useInstanceStore } from '../../../../../store/instance';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import Save from './Save/index.vue';
import Bind from '../ChildDevice/BindChildDevice/index.vue';
import {randomString, onlyMessage, getToken} from '@jetlinks-web/utils';
import { cloneDeep } from 'lodash-es';
import { useMenuStore } from '@jetlinks-web-core/store/menu';
import actionModal from './actionModal.vue';
import { Modal } from 'ant-design-vue';
import { EventEmitter } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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
const isMap = ref(false);
const dropLoading = ref(false);
const isToDetail = ref(false)

const onSelectChange = (keys) => {
    _selectedRowKeys.value = [...keys];
};

const searchColumns = [
    {
        title: $t('Child.index.135369-19'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Child.index.135369-20'),
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true,
        search: {
            type: 'string',
            // defaultTermType: 'eq',
        },
    },
    {
        title: $t('Child.index.135369-21'),
        dataIndex: 'productName',
        key: 'productName',
        scopedSlots: true,
        search: {
            type: 'select',
            rename: 'productId',
            options: () =>
                new Promise((resolve) => {
                    getProductListNoPage({
                        paging: false,
                        sorts: [{ name: 'createTime', order: 'desc' }],
                        terms: [
                            {
                                termType: 'eq',
                                column: 'deviceType',
                                value: 'childrenDevice',
                            },
                        ],
                    }).then((resp) => {
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
        title: $t('Child.index.135369-22'),
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },

    {
        title: $t('Child.index.135369-23'),
        dataIndex: 'describe',
        key: 'describe',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'string',
        },
    },
];
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
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: terms,
        }).finally(() => {
            editStatus.value = false;
        });

        if (res.success) {
            try {
                const resp = await _queryByEdge(instanceStore.detail.id, {
                    sorts: [{ name: '_bind.createTime', order: 'desc' }],
                    terms: [{ column: 'key', value: '', termType: 'notnull' }],
                });
                if (resp.success) {
                    _dropList.value = [...resp.result];
                    _bindInitList.value = [...resp.result];
                }
                _dataSource.value = [];
                _dropList.value?.forEach((i) => {
                    const isMap = res.result.find(
                        (item) => i.id === item.id || i.mappingId === item.id,
                    );
                    if(isMap?.id) {
                        _dataSource.value.push({
                            ...isMap,
                            MappingStatus: 'success',
                            Mapping: i,
                        })
                    }
                })

                res.result.forEach((item) => {
                    const isMap = _dropList.value?.find(
                        (i) => i.id === item.id || i.mappingId === item.id,
                    );
                    if (!isMap?.id) {
                        _dataSource.value.push({
                            ...item,
                            MappingStatus: 'none',
                        })
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
        }
    }
};

const onSearch = (e) => {
    TabsChange(() => {
        handleSearch(e);
    });
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
        cb && (typeof cb === 'function' && cb?.());
    });
    if (res.success) {
        handleRefresh();
        onlyMessage($t('Child.index.135369-24'));
    }
};

const onChange = (checked) => {
    if (checked) {
        onSaveAll();
    }
};

const onClick = (type) => {
    TabsChange(() => {
        if (type === 'add') {
            visible.value = true;
        } else {
            bindVisible.value = true;
        }
    });
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
            text: $t('Child.index.135369-25'),
            tooltip: {
                title:
                    detail.value.state?.value !== 'online'
                        ? $t('Child.index.135369-26')
                        : $t('Child.index.135369-25'),
            },
            disabled: detail.value.state?.value !== 'online',
            icon: 'DisconnectOutlined',
            onClick: async () => {
                menuVisible.value = false;
                actionRef.visible = true;
                actionRef.type = 'unbind';
                isMap.value = false;
                actionRef.rows = [_customRow.value?.id];
            },
        },

        {
            key: 'action',
            text: data.state?.value !== 'notActive' ? $t('Child.index.135369-11') : $t('Child.index.135369-27'),
            tooltip: {
                title:
                    detail.value.state?.value !== 'online'
                        ? $t('Child.index.135369-26')
                        : data.state?.value !== 'notActive'
                            ? $t('Child.index.135369-11')
                            : $t('Child.index.135369-27'),
            },
            disabled: detail.value.state?.value !== 'online',
            icon:
                data.state.value !== 'notActive'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            onClick: async () => {
                menuVisible.value = false;
                actionRef.visible = true;
                actionRef.rows = [_customRow.value?.id];
                if (data?.MappingStatus === 'success') {
                    isMap.value = true;
                }
                if (data.state?.value !== 'notActive') {
                    actionRef.type = 'undeploy';
                } else {
                    actionRef.type = 'deploy';
                }
            },
        },
        {
            key: 'delete',
            text: $t('Child.index.135369-28'),
            disabled:
                detail.value.state?.value !== 'online' ||
                data.state?.value !== 'notActive',
            tooltip: {
                title:
                    detail.value.state?.value !== 'online'
                        ? $t('Child.index.135369-26')
                        : data.state.value !== 'notActive'
                            ? $t('Child.index.135369-29')
                            : $t('Child.index.135369-28'),
            },
            onClick: async () => {
                menuVisible.value = false;
                actionRef.visible = true;
                actionRef.rows = [_customRow.value?.id];
                actionRef.type = 'delete';
                if (data?.MappingStatus === 'success') {
                    isMap.value = true;
                }
            },
            icon: 'DeleteOutlined',
        },
    ];
    const batchActions = [
        {
            key: 'unbind',
            text: $t('Child.index.135369-30'),
            tooltip: {
                title:
                    detail.value.state?.value === 'online'
                        ? $t('Child.index.135369-30')
                        : $t('Child.index.135369-26'),
            },
            disabled: detail.value.state?.value !== 'online',
            icon: 'DisconnectOutlined',
            onClick: () => {
                isMap.value = false;
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
            text: $t('Child.index.135369-31'),
            tooltip: {
                title:
                    detail.value.state?.value === 'online'
                        ? $t('Child.index.135369-31')
                        : $t('Child.index.135369-26'),
            },
            disabled: detail.value.state?.value !== 'online',
            icon: 'StopOutlined',
            onClick: () => {
                isMap.value = true;
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
            text: $t('Child.index.135369-32'),
            tooltip: {
                title:
                    detail.value.state?.value === 'online'
                        ? $t('Child.index.135369-31')
                        : $t('Child.index.135369-26'),
            },
            disabled: detail.value.state?.value !== 'online',
            icon: 'CheckCircleOutlined',
            onClick: () => {
                isMap.value = true;
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
            text: $t('Child.index.135369-33'),
            tooltip: {
                title:
                    detail.value.state?.value === 'online'
                        ? $t('Child.index.135369-31')
                        : $t('Child.index.135369-26'),
            },
            disabled: detail.value.state?.value !== 'online',
            onClick: async () => {
                isMap.value = true;
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
    isMap.value = false;
    editStatus.value = false;
    handleRefresh();
};

const onDetail = (item) => {
    setTimeout(() => {
        edgeVisible.value = true;
        edgeCurrent.value = item;
    },300);
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
    isToDetail.value = true;
    TabsChange(() => {
        window.location.hash = route.path.replace(`/${route.params.id}`, `/${id}`)
        menuStory.jumpPage('device/Instance/Detail', { params: {id} });
    });
};

//开始拖拽
const onStart = (item) => {
    _drop.value = item;
};
//拖拽结束
const onDrop = async (e, item) => {
    if (_checked.value) {
        item.loading = true;
        dropLoading.value = true;
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
                dropLoading.value = false;
            })
            .catch((e) => {
                item.MappingStatus = 'error';
                item.MappingError = e.message;
                edgeList.value = edgeList.value.filter(
                    (i) => i.id !== _drop.value.id,
                );
                _edgeInitList.value = _edgeInitList.value.filter(
                    (i) => i.id !== _drop.value.id,
                );
            });
        if (res.success) {
            item.MappingStatus = 'success';
            handleRefresh();
        } else {
            item.MappingStatus = 'error';
        }
    } else {
        const _data = _dataSource.value.find((i) => i.id === item.id);
        if(_data) {
            _data.Mapping = _drop.value;
            _data.MappingStatus = 'warning';
            _data.action = 'drop';
        }
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
        // item.Mapping = {
        //     ..._drop.value,
        // };
        // item.MappingStatus = 'warning';
        // item.action = 'drop';
        _dataSource.value.forEach(i => {
          if(i.id === item.id){
            i.Mapping = _drop.value;
            i.MappingStatus = 'warning';
            i.action = 'drop';
          }
        })
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
    if (item.id && item.parentId) {
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
                    item.Mapping = {}
                    item.MappingStatus = 'none'
                    setTimeout(() => {
                        item.loading = false;
                    }, 500);
                })
                .catch((e) => {
                    item.MappingStatus = 'error';
                    item.MappingError = e.message;
                });
        } else {
            edgeList.value.unshift(item.Mapping);
            _edgeInitList.value.unshift(item.Mapping);
            if (item.MappingStatus === 'error') {
                item.Mapping = {};
                item.MappingStatus = 'none';
            } else {
                _dataSource.value?.forEach(
                    (i) => {
                        if(i.Mapping?.id === item.Mapping?.id) {
                            i.Mapping = {};
                            i.MappingStatus = 'none';
                        }
                    },
                );
                _dropList.value = _dropList.value.filter(
                    (i) => i.Mapping?.id !== item.Mapping?.id,
                );
            }
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
                    onlyMessage($t('Child.index.135369-34'), 'error');
                }
            }
        });
    } else {
        onlyMessage(
            $t('Child.index.135369-35'),
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
    if (editStatus.value && getToken()) {
        const modal = Modal.confirm({
            content: $t('Child.index.135369-36'),
            okText: $t('Child.index.135369-2'),
            cancelText: $t('Child.index.135369-37'),
            zIndex: 1400,
            closable: true,
            onOk: () => {
                onSaveAll(()=>next?.());
            },
            onCancel: (e) => {
                if (!e.triggerCancel) {
                    // 取消按钮
                    modal.destroy();
                    next?.();
                } else {
                    // 右上角取消按钮
                    modal.destroy();
                }
            },
        });
    } else {
        next?.();
    }
};

onBeforeRouteUpdate((to, from, next) => {
    // 设备管理内路由跳转
    if(isToDetail.value){
        next;
    }else{
        TabsChange(next);
    }
});

onBeforeRouteLeave((to, from, next) => {
    // 设备管理外路由跳转
    if(isToDetail.value){
        next
    }else{
        TabsChange(next);
    }
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

watchEffect(() => {
  console.log(edgeList.value, '123')
})

defineExpose({
    handleRefresh
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
