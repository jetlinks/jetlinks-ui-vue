<template>
    <page-container>
        <div>
            <Search :columns="columns" target="search" @search="handleSearch" />

            <JTable
                ref="tableRef"
                :columns="columns"
                :gridColumn="3"
                :request="query"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
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
                        :actions="getActions(slotProps, 'card')"
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
                                <img :src="getImage('/network.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <div class="card-item-content">
                                <!-- <a
                                    @click="handlEye(slotProps.id)"
                                    class="card-item-content-title-a"
                                >
                                    {{ slotProps.name }}
                                </a> -->
                                <h3
                                    @click="handlEye(slotProps.id)"
                                    class="card-item-content-title card-item-content-title-a"
                                >
                                    {{ slotProps.name }}
                                </h3>
                                <a-row class="card-item-content-box">
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
                                    <a-col :span="12">
                                        <div class="card-item-content-text">
                                            详情
                                        </div>
                                        <div class="card-item-content-text">
                                            <a-tooltip>
                                                <template #title>{{
                                                    getDetails(slotProps)
                                                }}</template>
                                                <span class="details-text">{{
                                                    getDetails(slotProps)
                                                }}</span>
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
                <template #state="slotProps">
                    <a-badge
                        :text="slotProps.state.text"
                        :status="statusMap.get(slotProps.state.value)"
                    />
                </template>
                <template #shareCluster="slotProps">
                    {{
                        slotProps.shareCluster === true
                            ? '共享配置'
                            : '独立配置'
                    }}
                </template>
                <template #type="slotProps">
                    {{ slotProps.typeObject.name }}
                </template>
                <template #details="slotProps">
                    {{ getDetails(slotProps) }}
                </template>
            </JTable>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="TypePage">
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage } from '@/utils/comm';
import { supports, query, remove, start, shutdown } from '@/api/link/type';
import { message } from 'ant-design-vue';

const tableRef = ref<Record<string, any>>({});
const router = useRouter();
const params = ref<Record<string, any>>({});
const options = ref([]);

const statusMap = new Map();
statusMap.set('enabled', 'success');
statusMap.set('disabled', 'error');

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        width: 250,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        width: 150,
        search: {
            type: 'select',
            options: options,
        },
        scopedSlots: true,
    },
    {
        title: '集群',
        dataIndex: 'shareCluster',
        key: 'shareCluster',
        width: 120,
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '共享配置', value: true },
                { label: '独立配置', value: false },
            ],
        },
    },
    {
        title: '详情',
        dataIndex: 'details',
        key: 'details',
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '正常', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
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
    const state = data.state.value;
    const actions = [
        {
            key: 'eye',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: async () => {
                handlEye(data.id);
            },
        },
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
                            ? await shutdown(data.id)
                            : await start(data.id);
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
                title:
                    state === 'enabled' ? '请先禁用该组件，再删除。' : '删除',
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
    return type === 'table'
        ? actions
        : actions.filter((item) => item.key !== 'eye');
};

const handlAdd = () => {
    router.push({
        path: `/iot/link/type/detail/:id`,
        query: { view: false },
    });
};

const handlEye = (id: string) => {
    router.push({
        path: `/iot/link/type/detail/${id}`,
        query: { view: true },
    });
};

const handlEdit = (id: string) => {
    router.push({
        path: `/iot/link/type/detail/${id}`,
        query: { view: false },
    });
};

const handlDelete = async (id: string) => {
    const res = await remove(id);
    if (res.success) {
        message.success('操作成功');
        tableRef.value.reload();
    }
};

const getDetails = (slotProps: Partial<Record<string, any>>) => {
    const { typeObject, shareCluster, configuration, cluster } = slotProps;
    const headers =
        typeObject.name.replace(/[^a-zA-Z]/g, '').toLowerCase() + '://';
    const content = !!shareCluster
        ? (configuration.publicHost || configuration.remoteHost) +
          ':' +
          (configuration.publicPort || configuration.remotePort)
        : (cluster[0].configuration.publicHost ||
              cluster[0].configuration.remoteHost) +
          ':' +
          (cluster[0].configuration.publicPort ||
              cluster[0].configuration.remotePort);

    return headers + content;
};

const getSupports = async () => {
    const res = await supports();
    options.value = res.result.map((item) => ({
        value: item.id,
        label: item.name,
    }));
};
getSupports();

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
.details-text {
    font-weight: 700;
    font-size: 14px;
}
</style>
