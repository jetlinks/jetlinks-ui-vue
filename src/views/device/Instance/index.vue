<template>
    <JTable 
        ref="instanceRef" 
        :columns="columns" 
        :request="query" 
        :defaultParams="{sorts: [{name: 'createTime', order: 'desc'}]}" 
        :rowSelection="{
            selectedRowKeys: _selectedRowKeys,
            onChange: onSelectChange
        }"
        @cancelSelect="cancelSelect"
        :params="params"
    >
        <template #headerTitle>
            <a-space>
                <a-button type="primary" @click="handleAdd">新增</a-button>
                <a-dropdown>
                    <a-button>批量操作 <AIcon type="DownOutlined" /></a-button>
                    <template #overlay>
                    <a-menu>
                        <a-menu-item>
                            <a-button @click="exportVisible = true"><AIcon type="ExportOutlined" />批量导出设备</a-button>
                        </a-menu-item>
                        <a-menu-item>
                            <a-button @click="importVisible = true"><AIcon type="ImportOutlined" />批量导入设备</a-button>
                        </a-menu-item>
                        <a-menu-item>
                            <a-popconfirm @confirm="activeAllDevice" title="确认激活全部设备？">
                                <a-button type="primary" ghost><AIcon type="CheckCircleOutlined" />激活全部设备</a-button>
                            </a-popconfirm>
                        </a-menu-item>
                        <a-menu-item>
                            <a-button @click="syncDeviceStatus" type="primary"><AIcon type="SyncOutlined" />同步设备状态</a-button>
                        </a-menu-item>
                        <a-menu-item v-if="_selectedRowKeys.length">
                            <a-popconfirm @confirm="delSelectedDevice" title="已启用的设备无法删除，确认删除选中的禁用状态设备？">
                                <a-button type="primary" danger><AIcon type="DeleteOutlined" />删除选中设备</a-button>
                            </a-popconfirm>
                        </a-menu-item>
                        <a-menu-item v-if="_selectedRowKeys.length" title="确认激活选中设备?">
                            <a-popconfirm @confirm="activeSelectedDevice" >
                                <a-button type="primary"><AIcon type="CheckOutlined" />激活选中设备</a-button>
                            </a-popconfirm>
                        </a-menu-item>
                        <a-menu-item v-if="_selectedRowKeys.length">
                            <a-popconfirm @confirm="disabledSelectedDevice" title="确认禁用选中设备?">
                                <a-button type="primary" danger><AIcon type="StopOutlined" />禁用选中设备</a-button>
                            </a-popconfirm>
                        </a-menu-item>
                    </a-menu>
                    </template>
                </a-dropdown>
            </a-space>
        </template>
        <template #card="slotProps">
            <CardBox
                :value="slotProps"
                @click="handleClick"
                :actions="getActions(slotProps, 'card')"
                v-bind="slotProps"
                :active="_selectedRowKeys.includes(slotProps.id)"
                :status="slotProps.state.value"
                :statusText="slotProps.state.text"
                :statusNames="{
                    online: 'success',
                    offline: 'error',
                    notActive: 'warning',
                }"
            >
                <template #img>
                    <slot name="img">
                        <img :src="getImage('/device/instance/device-card.png')" />
                    </slot>
                </template>
                <template #content>
                    <h3 @click="handleView(slotProps.id)">{{ slotProps.name }}</h3>
                    <a-row>
                        <a-col :span="12">
                            <div class="card-item-content-text">设备类型</div>
                            <div>{{slotProps.deviceType.text}}</div>
                        </a-col>
                        <a-col :span="12">
                            <div class="card-item-content-text">产品名称</div>
                            <div>{{slotProps.productName}}</div>
                        </a-col>
                    </a-row>
                </template>
                <template #actions="item">
                    <a-tooltip v-bind="item.tooltip" :title="item.disabled && item.tooltip.title">
                        <a-popconfirm
                            v-if="item.popConfirm"
                            v-bind="item.popConfirm"
                            :disabled="item.disabled"
                        >
                            <a-button :disabled="item.disabled">
                                <AIcon type="DeleteOutlined" v-if="item.key === 'delete'"  />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item.text }}</span>
                                </template>
                            </a-button>
                        </a-popconfirm>
                        <template v-else>
                            <a-button :disabled="item.disabled" @click="item.onClick">
                                <AIcon type="DeleteOutlined" v-if="item.key === 'delete'"  />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item.text }}</span>
                                </template>
                            </a-button>
                        </template>
                    </a-tooltip>
                </template>
            </CardBox>
        </template>
        <template #state="slotProps">
            <a-badge :text="slotProps.state.text" :status="statusMap.get(slotProps.state.value)" />
        </template>
        <template #action="slotProps">
            <a-space :size="16">
                <a-tooltip
                    v-for="i in getActions(slotProps, 'table')"
                    :key="i.key"
                    v-bind="i.tooltip"
                >
                    <a-popconfirm v-if="i.popConfirm" v-bind="i.popConfirm" :disabled="i.disabled">
                        <a-button
                            :disabled="i.disabled"
                            style="padding: 0"
                            type="link"
                            ><AIcon :type="i.icon"
                        /></a-button>
                    </a-popconfirm>
                    <a-button
                        style="padding: 0"
                        type="link"
                        v-else
                        @click="i.onClick && i.onClick(slotProps)"
                    >
                        <a-button
                            :disabled="i.disabled"
                            style="padding: 0"
                            type="link"
                            ><AIcon :type="i.icon"
                        /></a-button>
                    </a-button>
                </a-tooltip>
            </a-space>
        </template>
    </JTable>
    <Import v-if="importVisible" @close="importVisible = false" />
    <Export v-if="exportVisible" @close="exportVisible = false" :data="params" />
    <Process v-if="operationVisible" @close="operationVisible = false" :api="api" :type="type" />
</template>

<script setup lang="ts">
import { query, _delete, _deploy, _undeploy, batchUndeployDevice, batchDeployDevice, batchDeleteDevice } from '@/api/device/instance'
import type { ActionsType } from '@/components/Table/index.vue'
import { getImage, LocalStore } from '@/utils/comm';
import { message } from "ant-design-vue";
import Import from './Import/index.vue'
import Export from './Export/index.vue'
import Process from './Process/index.vue'
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';

const instanceRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({pageIndex: 0, pageSize: 12})
const _selectedRowKeys = ref<string[]>([])
const importVisible = ref<boolean>(false)
const exportVisible = ref<boolean>(false)
const current = ref<Record<string, any>>({})
const operationVisible = ref<boolean>(false)
const api = ref<string>('')
const type = ref<string>('')

const statusMap = new Map();
statusMap.set('online', 'processing');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe'
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true
    }   
]

const paramsFormat = (config: any, _terms: any, name?: string) => {
    if (config?.terms && Array.isArray(config.terms) && config?.terms.length > 0) {
      (config?.terms || []).map((item: any, index: number) => {
        if (item?.type) {
          _terms[`${name ? `${name}.` : ''}terms[${index}].type`] = item.type;
        }
        paramsFormat(item, _terms, `${name ? `${name}.` : ''}terms[${index}]`);
      });
    } else if (!config?.terms && Object.keys(config).length > 0) {
      Object.keys(config).forEach((key) => {
        if (config[key]) {
          _terms[`${name ? `${name}.` : ''}${key}`] = config[key];
        }
      });
    }
  }

const handleParams = (config: any) => {
    const _terms: any = {};
    paramsFormat(config, _terms);
    const url = new URLSearchParams();
    Object.keys(_terms).forEach((key) => {
      url.append(key, _terms[key]);
    });
    return url.toString();
  }

/**
 * 新增
 */
const handleAdd = () => {
    message.warn('新增')
}

/**
 * 查看
 */
const handleView = (dt: any) => {
    // message.warn('查看')
}

const getActions = (data: Partial<Record<string, any>>, type: 'card' | 'table'): ActionsType[] => {
    if(!data) return []
    const actions = [
        {
            key: 'view',
            text: "查看",
            tooltip: {
                title: '查看'
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data)
            }
        },
        {
            key: 'edit',
            text: "编辑",
            tooltip: {
                title: '编辑'
            },
            icon: 'EditOutlined',
            onClick: () => {
                message.warn('edit')
            }
        },
        {
            key: 'action',
            text: data.state.value !== 'notActive' ? "禁用" : "启用",
            tooltip: {
                title: data.state.value !== 'notActive' ? "禁用" : "启用",
            },
            icon: data.state.value !== 'notActive' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${data.state.value !== 'notActive' ? "禁用" : "启用"}?`,
                onConfirm: async () => {
                    let response = undefined
                    if(data.state.value !== 'notActive') {
                        response = await _undeploy(data.id)
                    } else {
                        response = await _deploy(data.id)
                    }
                    if(response && response.status === 200) {
                        message.success('操作成功！')
                        instanceRef.value?.reload()
                    } else {
                        message.error('操作失败！')
                    }
                }
            }
        },
        {
            key: 'delete',
            text: "删除",
            disabled: data.state.value !== 'notActive',
            tooltip: {
                title: data.state.value !== 'notActive' ? '已启用的设备不能删除' : '删除'
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const resp = await _delete(data.id)
                    if(resp.status === 200) {
                        message.success('操作成功！')
                        instanceRef.value?.reload()
                    } else {
                        message.error('操作失败！')
                    }
                }
            },
            icon: 'DeleteOutlined'
        }
    ]
    if(type === 'card') return actions.filter((i: ActionsType) => i.key !== 'view')
    return actions
}

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys]
}

const cancelSelect = () => {
    _selectedRowKeys.value = []
}

const handleClick = (dt: any) => {
    if(_selectedRowKeys.value.includes(dt.id)) {
        const _index = _selectedRowKeys.value.findIndex(i => i === dt.id)
        _selectedRowKeys.value.splice(_index, 1)
    } else {
        _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id]
    }
}

const activeAllDevice = () => {
    type.value = 'active'
    const activeAPI = `/${BASE_API_PATH}/device-instance/deploy?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}&${handleParams(params)}`;
    api.value = activeAPI
    operationVisible.value = true
}

const syncDeviceStatus = () => {
    type.value = 'sync'
    const syncAPI = `/${BASE_API_PATH}/device-instance/state/_sync?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}&${handleParams(params)}`;
    api.value = syncAPI
    operationVisible.value = true
}

const delSelectedDevice = async () => {
    const resp = await batchDeleteDevice(_selectedRowKeys.value)
    if(resp.status === 200){
        message.success('操作成功！')
        _selectedRowKeys.value = []
        instanceRef.value?.reload()
    }
}

const activeSelectedDevice = async () => {
    const resp = await batchDeployDevice(_selectedRowKeys.value)
    if(resp.status === 200){
        message.success('操作成功！')
        _selectedRowKeys.value = []
        instanceRef.value?.reload()
    }
}

const disabledSelectedDevice = async () => {
    const resp = await batchUndeployDevice(_selectedRowKeys.value)
    if(resp.status === 200){
        message.success('操作成功！')
        _selectedRowKeys.value = []
        instanceRef.value?.reload()
    }
}
</script>