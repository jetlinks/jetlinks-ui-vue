<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="list"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    :params="params"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            @click="handlAdd"
                            hasPermission="link/Protocol:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            新增
                        </PermissionButton>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :showStatus="false"
                            :value="slotProps"
                            :actions="getActions(slotProps, 'card')"
                            v-bind="slotProps"
                        >
                            <template #img>
                                <slot name="img">
                                    <img :src="getImage('/protocol.png')" />
                                </slot>
                            </template>
                            <template #content>
                                <div class="card-item-content">
                                    <Ellipsis
                                        style="margin-bottom: 18px;"
                                    >
                                        <span
                                            style="
                                                font-size: 16px;
                                                font-weight: 600;
                                            "
                                        >
                                            {{ slotProps.name }}
                                        </span>
                                    </Ellipsis>
                                    <j-row class="card-item-content-box">
                                        <j-col
                                            :span="12"
                                            class="card-item-content-text"
                                        >
                                            <div class="card-item-content-text">
                                                ID
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.id
                                                    }}</template>
                                                    {{ slotProps.id }}
                                                </j-tooltip>
                                            </div>
                                        </j-col>
                                        <j-col :span="12">
                                            <div class="card-item-content-text">
                                                类型
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.type
                                                    }}</template>
                                                    {{ slotProps.type }}
                                                </j-tooltip>
                                            </div>
                                        </j-col>
                                    </j-row>
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
                                    :hasPermission="'link/Protocol:' + item.key"
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
                    <template #action="slotProps">
                        <j-space>
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
                                    style="padding: 0px"
                                    @click="i.onClick"
                                    type="link"
                                    :danger="i.key === 'delete'"
                                    :hasPermission="'link/Protocol:' + i.key"
                                >
                                    <template #icon
                                        ><AIcon :type="i.icon"
                                    /></template>
                                </PermissionButton>
                            </template>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>
        </div>
        <Save v-if="visible" :data="current" @change="saveChange" />
    </page-container>
</template>
<script lang="ts" setup name="AccessConfigPage">
import type { ActionsType } from '@/components/Table/index';
import { getImage } from '@/utils/comm';
import { list, remove } from '@/api/link/protocol';
import { onlyMessage } from '@/utils/comm';
import Save from './Save/index.vue';
import _ from 'lodash';

const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const route = useRoute();
const visible = ref(false);
const current = ref({});

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        search: {
            type: 'string',
            defaultTermType: 'eq',
        },
        width: 200,
        fixed: 'left',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        search: {
            type: 'select',
            options: [
                {
                    label: 'jar',
                    value: 'jar',
                },
                {
                    label: 'local',
                    value: 'local',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 100,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
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
                handlEdit(data);
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
                onConfirm: async () => {
                    const res: any = await remove(data.id);
                    if (res.status === 200) {
                        onlyMessage('操作成功', 'success');
                        tableRef.value.reload();
                    } else {
                        onlyMessage(res?.message, 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const handlAdd = () => {
    current.value = {};
    visible.value = true;
};
const handlEdit = (data: object) => {
    current.value = _.cloneDeep(data);
    visible.value = true;
};

const saveChange = (value: object) => {
    visible.value = false;
    current.value = {};
    if (value) {
        onlyMessage('操作成功', 'success');
        tableRef.value.reload();
    }
};

watch(
    () => route.query?.save,
    (value) => {
        value === 'true' && handlAdd();
    },
    { deep: true, immediate: true },
);

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped>
.card-item-content {
    min-height: 100px;

    .card-item-content-box {
        min-height: 50px;
    }
    .card-item-content-text {
        color: rgba(0, 0, 0, 0.75);
        font-size: 12px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }
}
</style>
