<template>
    <JTable ref="instanceRef" :columns="columns" :request="query" :defaultParams="{sorts: [{name: 'createTime', order: 'desc'}]}" :params="{pageIndex: 0, pageSize: 12}">
        <template #headerTitle>
            <a-space>
                <a-button type="primary" @click="handleAdd">新增</a-button>
                <a-dropdown>
                    <a-button>批量操作 <AIcon type="DownOutlined" /></a-button>
                    <template #overlay>
                    <a-menu>
                        <a-menu-item>
                            <a href="javascript:;">1st menu item</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="javascript:;">2nd menu item</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="javascript:;">3rd menu item</a>
                        </a-menu-item>
                    </a-menu>
                    </template>
                </a-dropdown>
            </a-space>
        </template>
        <template #card="slotProps">
            <CardBox
                :value="slotProps"
                @click="handleView"
                :actions="getActions(slotProps, 'card')"
                v-bind="slotProps"
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
                    <h3>{{ slotProps.name }}</h3>
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
</template>

<script setup lang="ts">
import { query, _delete, _deploy, _undeploy } from '@/api/device/instance'
import type { ActionsType } from '@/components/Table/index.vue'
import { getImage } from '@/utils/comm';
import { message } from "ant-design-vue";

const instanceRef = ref<Record<string, any>>({});

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

const handleAdd = () => {
    message.warn('123')
}

const handleView = (dt: any) => {
    
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

</script>