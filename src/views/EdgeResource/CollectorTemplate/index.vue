<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="edge-resource-collector-template"
            @search="handleSearch"
        />
        <full-page>
            <JProTable
                ref="tableRef"
                :columns="columns"
                :request="queryPage"
                :params="params"
                :defaultParams="{
                    sort: [{ name: 'createTime', order: 'desc' }],
                    terms: [{column: 'targetType', value: 'entityTemplate:Collector'}]
                }"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            hasPermission="EdgeResource/CollectorTemplate:add"
                            @click="handleAdd"
                        >
                            <template #icon
                            >
                                <AIcon type="PlusOutlined"
                                />
                            </template>
                            新增
                        </PermissionButton>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error'
                        }"
                        @click="handleView(slotProps.id)"
                    >
                        <template #img>
                            <img
                                :width="80"
                                :height="80"
                                :src="
                                    slotProps?.photoUrl ||
                                    getImage('/device-gateway.png')
                                "
                            />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row :gutter="16" style="margin-top: 18px">
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        模板ID
                                    </div>
                                    <Ellipsis>
                                        <span>
                                            {{ slotProps.targetId }}
                                        </span>
                                    </Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        通讯协议
                                    </div>
                                    <Ellipsis style="width: 100%">
                                        {{ JSON.parse(slotProps.metadata || '{}').category || '--' }}
                                    </Ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <PermissionButton
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="'EdgeResource/CollectorTemplate:' + item.key"
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
                <template #state="slotProps">
                    <BadgeStatus
                        :status="slotProps.state?.value"
                        :text="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error'
                        }"
                    />
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
                                style="padding: 0 5px"
                                :danger="i.key === 'delete'"
                                :hasPermission="
                                    i.key === 'view'
                                        ? true : 'EdgeResource/CollectorTemplate:' + i.key"
                            >
                                <template #icon>
                                    <AIcon :type="i.icon"/>
                                </template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
        </full-page>
    </page-container>
    <Save v-if="saveVisible" :data="currentData" @close="saveVisible = false" @save="handleSave"/>
    <Issue v-if="issueVisible" :data="currentData" @close="issueVisible = false"/>
</template>

<script setup lang="ts">
import Save from './Save/index.vue';
import Issue from '@/views/EdgeResource/AiModel/Issue/index.vue';
import {queryPage, remove, update} from '@/api/edge-resource';
import {getImage, onlyMessage} from "@/utils/comm";
import BadgeStatus from "components/BadgeStatus/index.vue";
import { useMenuStore } from "store/menu";

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        search: {
            type: 'string'
        }
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        search: {
            type: 'string'
        }
    },
    {
        title: '类型',
        dataIndex: 'targetType',
        key: 'targetType',
        width: 200,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {label: '启用', value: 'enabled'},
                {label: '禁用', value: 'disabled'},
            ]
        }
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        width: 200
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 150,
        scopedSlots: true
    }
]

const tableRef = ref();
const saveVisible = ref(false);
const issueVisible = ref(false);
const currentData = ref({});
const params = ref();
const menuStore = useMenuStore();

const getActions = (data, type) => {
    const actions = [
        {
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                currentData.value = data;
                saveVisible.value = true;
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disabled' ? '禁用' : '启用',
            tooltip: {
                title: data.state?.value !== 'disabled' ? '禁用' : '启用',
            },
            icon:
                data.state.value !== 'disabled'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${
                    data.state.value !== 'disabled' ? '禁用' : '启用'
                }?`,
                onConfirm: () => {
                    const state = data.state.value === 'disabled' ? 'enabled' : 'disabled';
                    update(data.id, {state}).then(() => {
                        onlyMessage('操作成功');
                        tableRef.value?.reload();
                    });
                },
            },
        },
        {
            key: 'issue',
            text: '下发',
            tooltip: {
                title: data.state.value === 'disabled' ? '请先启用，再下发' : '下发',
            },
            disabled: data.state?.value === 'disabled',
            icon: 'DownSquareOutlined',
            onClick: () => {
                currentData.value = data;
                issueVisible.value = true;
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title: data.state?.value === 'enabled' ? '请先禁用，再删除' : '删除',
            },
            disabled: data.state?.value === 'enabled',
            icon: 'DeleteOutlined',
            popConfirm: {
                title: '确认删除?',
                onConfirm: () => {
                    remove(data.id).then(() => {
                        onlyMessage('操作成功');
                        tableRef.value?.reload();
                    })
                },
            },
        }
    ];
    if(type === 'table') {
        actions.unshift({
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id);
            }
        },)
    }
    return actions
}

const handleSearch = (e: any) => {
    params.value = e;
}

const handleAdd = () => {
    currentData.value = {};
    saveVisible.value = true;
}

const handleSave = () => {
    tableRef.value?.reload();
    saveVisible.value = false;
}

const handleView = (id: string) => {
    menuStore.jumpPage('EdgeResource/CollectorTemplate/Detail', {id});
}
</script>

<style scoped lang="less">

</style>