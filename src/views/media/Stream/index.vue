<template>
    <page-container>
        <div>
            <Search :columns="columns" target="search" @search="handleSearch" />

            <JTable
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
                    <a-button type="primary" @click="handlAdd"
                        ><plus-outlined />新增</a-button
                    >
                </template>
                <template #card="slotProps">
                    <CardBox
                        :showStatus="true"
                        :value="slotProps"
                        :actions="getActions(slotProps)"
                        v-bind="slotProps"
                        :class="
                            slotProps.state.value === 'disabled'
                                ? 'tableCardDisabled'
                                : 'tableCardEnabled'
                        "
                        :status="slotProps.state.value"
                        :statusText="slotProps.state.text"
                        :statusNames="{
                            enabled: 'success',
                            disabled: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img :src="getImage('/stream.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <div class="card-item-content">
                                <a
                                    @click="handlEye(slotProps.id)"
                                    class="card-item-content-title-a"
                                >
                                    {{ slotProps.name }}
                                </a>
                                <a-row class="card-item-content-box">
                                    <a-col
                                        :span="8"
                                        class="card-item-content-text"
                                    >
                                        <div class="card-item-content-text">
                                            服务商
                                        </div>
                                        <div class="card-item-content-text">
                                            <a-tooltip>
                                                <template #title>{{
                                                    slotProps.provider
                                                }}</template>
                                                {{ slotProps.provider }}
                                            </a-tooltip>
                                        </div>
                                    </a-col>
                                    <a-col :span="8">
                                        <div class="card-item-content-text">
                                            RTP IP
                                        </div>
                                        <div class="card-item-content-text">
                                            <a-tooltip>
                                                <template #title>{{
                                                    slotProps.configuration
                                                        ?.rtpIp
                                                }}</template>
                                                {{
                                                    slotProps.configuration
                                                        ?.rtpIp
                                                }}
                                            </a-tooltip>
                                        </div>
                                    </a-col>
                                    <a-col :span="8">
                                        <div class="card-item-content-text">
                                            API HOST
                                        </div>
                                        <div class="card-item-content-text">
                                            <a-tooltip>
                                                <template #title>{{
                                                    slotProps.configuration
                                                        ?.apiHost
                                                }}</template>
                                                {{
                                                    slotProps.configuration
                                                        ?.apiHost
                                                }}
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
            </JTable>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="AccessConfigPage">
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage } from '@/utils/comm';
import { query, remove, disable, enalbe } from '@/api/media/stream';
import { message } from 'ant-design-vue';
import Detail from './Detail/index.vue';

const tableRef = ref<Record<string, any>>({});
const router = useRouter();
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: '禁用',
                    value: 'disabled',
                },
                {
                    label: '正常',
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
    const actions = [
        {
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                handlEdit(data.id);
            },
        },
        {
            key: 'action',
            text: state === 'enabled' ? '禁用' : '启用',
            tooltip: {
                title: state === 'enabled' ? '禁用' : '启用',
            },
            icon: state === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${state === 'enabled' ? '禁用' : '启用'}?`,
                onConfirm: async () => {
                    let res =
                        state === 'enabled'
                            ? await disable(data.id)
                            : await enalbe(data.id);
                    if (res.success) {
                        message.success('操作成功');
                        tableRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            disabled: state === 'enabled',
            tooltip: {
                title: state === 'enabled' ? '正常的流媒体不能删除' : '删除',
            },
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
    router.push({
        path: `/iot/link/Stream/detail/:id`,
        query: { view: false },
    });
};
const handlEdit = (id: string) => {
    router.push({
        path: `/iot/link/Stream/detail/${id}`,
        query: { view: false },
    });
};
const handlEye = (id: string) => {
    router.push({
        path: `/iot/link/Stream/detail/${id}`,
        query: { view: true },
    });
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
        // color: #000 !important;
        font-weight: 700;
        font-size: 18px;
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
