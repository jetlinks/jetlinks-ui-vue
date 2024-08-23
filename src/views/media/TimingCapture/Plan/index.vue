<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="auto-video-plan"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="tableRef"
                :columns="columns"
                :request="queryList"
                model="CARD"
                :gridColumn="2"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                    terms: [{ column: 'type', value: 'photo',termType:'eq' }],
                }"
                :params="params"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="handleAdd"
                        hasPermission="media/Device:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增计划
                    </PermissionButton>
                </template>
                <template #card="slotProps">
                    <CardBox
                        @click="() => handleClick(slotProps)"
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :showStatus="true"
                        :status="slotProps.state.value"
                        :statusText="
                            slotProps.state.value === 'enabled'
                                ? '正常'
                                : '禁用'
                        "
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img :src="getImage('/device-media.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 700">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <a-row :gutter="16" style="margin-top: 10px;">
                                <a-col :span="8">
                                    <div class="card-item-content-text">
                                        计划ID
                                    </div>
                                    <Ellipsis style="width: calc(100% - 20px)">
                                        <div>{{ slotProps.id }}</div>
                                    </Ellipsis>
                                </a-col>
                                <a-col :span="8">
                                    <div class="card-item-content-text">
                                        创建时间
                                    </div>
                                    <span>{{
                                        dayjs(slotProps?.createTime).format(
                                            'YYYY-MM-DD HH:mm:ss',
                                        )
                                    }}</span>
                                </a-col>
                                <a-col :span="8">
                                    <div class="card-item-content-text">
                                        录像保存周期（天）
                                    </div>
                                    <Ellipsis
                                        style="width: calc(100% - 20px)"
                                        >{{
                                            slotProps?.others?.retention
                                        }}</Ellipsis
                                    >
                                </a-col>
                            </a-row>
                        </template>
                        <template #actions="item">
                            <PermissionButton
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="true"
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
            </JProTable>
        </FullPage>
    </page-container>
    <AddPlan v-if="addVisible" @closeModal="addVisible = false"></AddPlan>
</template>

<script setup lang="ts">
import { getImage, onlyMessage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';
import AddPlan from '@/views/media/TimingCapture/Plan/Add/index.vue';
import { queryList ,controlPlan,deletePlan} from '@/api/media/auto';
import dayjs from 'dayjs';

const addVisible = ref(false);
const params = ref();
const menuStory = useMenuStore();
const tableRef = ref();

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        fixed: 'left',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        search: {
            type: 'select',
            options: [
                { label: '启用', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
            ],
        },
    },
];

const getActions = (data, type) => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage('media/AutoVideo/Plan/Detail', {
                    id: data.id,
                });
            },
        },
        {
            key: 'action',
            text: data.state.value === 'enabled' ? '禁用' : '启用',
            tooltip: {
                title: data.state.value === 'enabled' ? '禁用' : '启用',
            },
            icon: data.state.value === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${data.state.value === 0 ? '禁用' : '启用'}?`,
                onConfirm: () => {
                    let response = undefined;
                    if (data.state.value === 'enabled') {
                        response = controlPlan(data.id,{
                            state:'disabled'
                        });
                    } else {
                        response = controlPlan(data.id,{
                            state:'enabled'
                        });
                    }
                    response.then((res) => {
                        if (res && res.status === 200) {
                            onlyMessage('操作成功！');
                            tableRef.value?.reload();
                        } else {
                            onlyMessage('操作失败！', 'error');
                        }
                    });
                    return response;
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title:
                    data.state.value === 'enabled' ? '请先禁用计划' : '删除',
            },
            disabled: data.state.value === 'enabled',
            popConfirm: {
                title: '确认删除?',
                onConfirm: () => {
                    const response = deletePlan(data.id);
                    response.then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage('操作成功！');
                            tableRef.value?.reload();
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
    return actions;
};

const handleAdd = () => {
    addVisible.value = true;
    // menuStory.jumpPage(
    //     'media/TimingCapture/Plan/Detail',
    //     {
    //         id: ':id',
    //     },
    //     { type: 'edit' },
    // );
};
const handleSearch = (e) => {
    params.value = e;
};

const handleClick = (data) => {};
</script>

<style lang="less" scoped></style>
