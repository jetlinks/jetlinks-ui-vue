<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-protocol"
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
                            {{ $t('Protocol.index.871190-0') }}
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
                                    <Ellipsis style="margin-bottom: 18px">
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
                                                {{ $t('Protocol.index.871190-1') }}
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
import _ from 'lodash-es';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
        title: $t('Protocol.index.871190-2'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: $t('Protocol.index.871190-1'),
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
        title: $t('Protocol.index.871190-3'),
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: $t('Protocol.index.871190-4'),
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
            text: $t('Protocol.index.871190-5'),
            tooltip: {
                title: $t('Protocol.index.871190-5'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                handlEdit(data);
            },
        },
        {
            key: 'delete',
            text: $t('Protocol.index.871190-6'),
            tooltip: {
                title: $t('Protocol.index.871190-6'),
            },
            popConfirm: {
                title: $t('Protocol.index.871190-7'),
                onConfirm:  () => {
                    const response: any = remove(data.id);
                    response.then((res)=>{
                        if (res.status === 200) {
                        onlyMessage($t('Protocol.index.871190-8'), 'success');
                        tableRef.value.reload();
                    } else {
                        onlyMessage(res?.message, 'error');
                    }
                    })
                    return response
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
        onlyMessage($t('Protocol.index.871190-8'), 'success');
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
