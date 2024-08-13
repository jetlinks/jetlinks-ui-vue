<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-stream"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    model="CARD"
                    :columns="columns"
                    :gridColumn="2"
                    :gridColumns="[1, 2]"
                    :request="query"
                    :defaultParams="{
                        sorts: [{ name: 'id', order: 'desc' }],
                    }"
                    :params="params"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            @click="handlAdd"
                            hasPermission="media/Stream:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{ $t('Stream.index.217871-0') }}
                        </PermissionButton>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :showStatus="true"
                            :value="slotProps"
                            :actions="getActions(slotProps)"
                            v-bind="slotProps"
                            :status="slotProps.state.value"
                            :statusText="slotProps.state.text"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                            @click="handlEye(slotProps.id)"
                        >
                            <template #img>
                                <slot name="img">
                                    <img :src="getImage('/stream.png')" />
                                </slot>
                            </template>
                            <template #content>
                                <div class="card-item-content">
                                    <Ellipsis
                                        style="
                                            width: calc(100% - 100px);
                                            margin-bottom: 10px;
                                        "
                                    >
                                        <span
                                            style="
                                                font-size: 18px;
                                                font-weight: 800;
                                                line-height: 22px;
                                            "
                                        >
                                            {{ slotProps.name }}
                                        </span>
                                    </Ellipsis>
                                    <j-row class="card-item-content-box">
                                        <j-col
                                            :span="8"
                                            class="card-item-content-text"
                                        >
                                            <div class="card-item-content-text">
                                                {{ $t('Stream.index.217871-1') }}
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.provider
                                                    }}</template>
                                                    {{ slotProps.provider }}
                                                </j-tooltip>
                                            </div>
                                        </j-col>
                                        <j-col :span="8">
                                            <div class="card-item-content-text">
                                                RTP IP
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.configuration
                                                            ?.rtpIp
                                                    }}</template>
                                                    {{
                                                        slotProps.configuration
                                                            ?.rtpIp
                                                    }}
                                                </j-tooltip>
                                            </div>
                                        </j-col>
                                        <j-col :span="8">
                                            <div class="card-item-content-text">
                                                API HOST
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.configuration
                                                            ?.apiHost
                                                    }}</template>
                                                    {{
                                                        slotProps.configuration
                                                            ?.apiHost
                                                    }}
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
                                    :hasPermission="'media/Stream:' + item.key"
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
                </j-pro-table>
            </FullPage>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="StreamPage">
import type { ActionsType } from '@/components/Table/index';
import { getImage } from '@/utils/comm';
import { query, remove, disable, enalbe } from '@/api/media/stream';
import { onlyMessage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: $t('Stream.index.217871-2'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        scopedSlots: true,
    },
    {
        title: $t('Stream.index.217871-3'),
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: $t('Stream.index.217871-4'),
                    value: 'disabled',
                },
                {
                    label: $t('Stream.index.217871-5'),
                    value: 'enabled',
                },
            ],
        },
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) return [];
    const state = data.state.value;
    const stateText = state === 'enabled' ? $t('Stream.index.217871-13') : $t('Stream.index.217871-6');
    const actions = [
        {
            key: 'update',
            text: $t('Stream.index.217871-7'),
            tooltip: {
                title: $t('Stream.index.217871-7'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                handlEdit(data.id);
            },
        },
        {
            key: 'action',
            text: stateText,
            tooltip: {
                title: stateText,
            },
            icon: state === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: $t('Stream.index.217871-8', [stateText]),
                onConfirm: () => {
                    let response =
                        state === 'enabled'
                            ? disable(data.id)
                            : enalbe(data.id);
                    response.then((res) => {
                        if (res.success) {
                            onlyMessage($t('Stream.index.217871-9'), 'success');
                            tableRef.value?.reload();
                        }
                    });
                    return response;
                },
            },
        },
        {
            key: 'delete',
            text: $t('Stream.index.217871-10'),
            disabled: state === 'enabled',
            tooltip: {
                title: state === 'enabled' ? $t('Stream.index.217871-11') : $t('Stream.index.217871-10'),
            },
            popConfirm: {
                title: $t('Stream.index.217871-12'),
                onConfirm: () => {
                    const response = remove(data.id);
                    response.then((res) => {
                        if (res.success) {
                            onlyMessage($t('Stream.index.217871-9'), 'success');
                            tableRef.value.reload();
                        }
                    });
                    return response
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const handlAdd = () => {
    menuStory.jumpPage(`media/Stream/Detail`, { id: ':id' }, { view: false });
};
const handlEdit = (id: string) => {
    menuStory.jumpPage(`media/Stream/Detail`, { id }, { view: false });
};
const handlEye = (id: string) => {
    menuStory.jumpPage(`media/Stream/Detail`, { id }, { view: true });
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
