<template>
    <page-container>
        <div>
            <Search :columns="columns" target="search" @search="handleSearch" />

            <JTable
                ref="tableRef"
                :columns="columns"
                :request="list"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
            >
                <template #headerTitle>
                    <a-button type="primary" @click="handlAdd"
                        ><AIcon type="PlusOutlined" />新增</a-button
                    >
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
                                <h3 class="card-item-content-title card-item-content-title-a">
                                    {{ slotProps.name }}
                                </h3>
                                <a-row class="card-item-content-box">
                                    <a-col
                                        :span="12"
                                        class="card-item-content-text"
                                    >
                                        <div class="card-item-content-text">
                                            ID
                                        </div>
                                        <div class="card-item-content-text">
                                            <a-tooltip>
                                                <template #title>{{
                                                    slotProps.id
                                                }}</template>
                                                {{ slotProps.id }}
                                            </a-tooltip>
                                        </div>
                                    </a-col>
                                    <a-col :span="12">
                                        <div class="card-item-content-text">
                                            类型
                                        </div>
                                        <div class="card-item-content-text">
                                            <a-tooltip>
                                                <template #title>{{
                                                    slotProps.type
                                                }}</template>
                                                {{ slotProps.type }}
                                            </a-tooltip>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </template>
                        <template #actions="item">
                            <a-tooltip
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
                            </a-tooltip>
                        </template>
                    </CardBox>
                </template>
                <template #action="slotProps">
                    <a-space :size="16">
                        <a-tooltip
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                            v-bind="i.tooltip"
                        >
                            <a-popconfirm
                                v-if="i.popConfirm"
                                v-bind="i.popConfirm"
                                :disabled="i.disabled"
                            >
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
        </div>
        <Save v-if="visible" :data="current" @change="saveChange" />
    </page-container>
</template>
<script lang="ts" setup name="AccessConfigPage">
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage } from '@/utils/comm';
import { list, remove } from '@/api/link/protocol';
import { message } from 'ant-design-vue';
import Save from './Save/index.vue';
import _ from 'lodash';

const tableRef = ref<Record<string, any>>({});
const router = useRouter();
const params = ref<Record<string, any>>({});

const visible = ref(false);
const current = ref({});

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        search: {
            type: 'string',
        },
        width: 200,
        fixed: 'left',
        // scopedSlots: true,
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
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
        width: 200,
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
            key: 'edit',
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
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const res = await remove(data.id);
                    if (res.success) {
                        message.success('操作成功');
                        tableRef.value.reload();
                    } else {
                        message.error('操作失败！');
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
        message.success('操作成功');
        tableRef.value.reload();
    }
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped>
.tableCardDisabled {
    width: 100%;
    background: url('/images/access-config-diaabled.png') no-repeat;
    background-size: 100% 100%;
}

.tableCardEnabled {
    width: 100%;
    background: url('/images/access-config-enabled.png') no-repeat;
    background-size: 100% 100%;
}

.card-item-content {
    min-height: 100px;

    .card-item-content-title-a {
        color: #000 !important;
        font-weight: 700;
        font-size: 16px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }
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
