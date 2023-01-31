<template>
    <div class="page-container">
        <a-card style="margin-bottom: 20px">
            <Search :columns="columns" target="search" @search="handleSearch" />
        </a-card>
        <a-card>
            <JTable
                ref="tableRef"
                model="CARD"
                :columns="columns"
                :request="list"
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
                                <img :src="getImage('/device-access.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <div class="card-item-content">
                                <h3 class="card-item-content-title">
                                    <a href="">{{ slotProps.name }}</a>
                                </h3>
                                <a-row class="card-item-content-box">
                                    <a-col
                                        :span="12"
                                        v-if="slotProps.channelInfo"
                                        class="card-item-content-text"
                                    >
                                        <div class="card-item-content-text">
                                            {{ slotProps.channelInfo.name }}
                                        </div>
                                        <div
                                            class="card-item-content-text"
                                            v-if="
                                                slotProps.channelInfo.addresses
                                            "
                                        >
                                            <a-badge
                                                :status="
                                                    slotProps.channelInfo
                                                        .addresses[0].health ===
                                                    -1
                                                        ? 'error'
                                                        : 'success'
                                                "
                                            />
                                            <a-tooltip>
                                                <template #title>{{
                                                    slotProps.channelInfo
                                                        .addresses[0].address
                                                }}</template>
                                                {{
                                                    slotProps.channelInfo
                                                        .addresses[0].address
                                                }}
                                            </a-tooltip>
                                        </div>
                                    </a-col>
                                    <a-col
                                        :span="12"
                                        v-if="slotProps.protocolDetail"
                                    >
                                        <div class="card-item-content-text">
                                            协议
                                        </div>
                                        <div class="card-item-content-text">
                                            <a-tooltip>
                                                <template #title>{{
                                                    slotProps.protocolDetail
                                                        .name
                                                }}</template>
                                                {{
                                                    slotProps.protocolDetail
                                                        .name
                                                }}
                                            </a-tooltip>
                                        </div>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="24">
                                        <div class="card-item-content-text">
                                            <a-tooltip>
                                                <template #title>
                                                    {{
                                                        providersList.find(
                                                            (item) =>
                                                                item.id ===
                                                                slotProps.provider,
                                                        )?.description
                                                    }}</template
                                                >
                                                {{
                                                    providersList.find(
                                                        (item) =>
                                                            item.id ===
                                                            slotProps.provider,
                                                    )?.description
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
                <template #state="slotProps">
                    <a-badge
                        :text="slotProps.state.text"
                        :status="statusMap.get(slotProps.state.value)"
                    />
                </template>
            </JTable>
        </a-card>
    </div>
</template>
<script lang="ts" setup name="AccessConfigPage">
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage } from '@/utils/comm';
import { list, getProviders } from '@/api/link/accessConfig';
import { message } from 'ant-design-vue';

const tableRef = ref<Record<string, any>>({});
const router = useRouter();
const params = ref<Record<string, any>>({});

let providersList = ref([]);

const statusMap = new Map();
statusMap.set('enabled', 'success');
statusMap.set('disabled', 'error');

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        // scopedSlots: true,
    },
    {
        title: '网关类型',
        dataIndex: 'provider',
        key: 'provider',
        search: {
            type: 'select',
            // options: providersList,
            // options: getProvidersList
            options: async () => {
                const res = await getProviders();
                return (res?.result || []).map((item) => ({
                    lable: item.name,
                    value: item.id,
                }));
            },
        },
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
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) {
        return [];
    }
    return [
        {
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: async () => {
                handlEdit(data.id);
            },
        },
        {
            key: 'delete',
            text: '删除',
            popConfirm: {
                title: '确认删除?',
                okText: ' 确定',
                cancelText: '取消',
                onConfirm: async () => {
                    handlDelete(data.id);
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const getProvidersList = async () => {
    const res = await getProviders();
    providersList = res.result;
};
getProvidersList();

const handlAdd = () => {
    router.push('/link/accessConfig/detail/add');

    // router.push('/link/certificate/detail/add/new');
};

const handlEdit = (id: string) => {
    router.push(`/link/certificate/detail/edit/${id}`);
};

const handlDelete = async (id: string) => {
    const res = await remove(id);
    if (res.success) {
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

// const handlAdd = () => {
//     router.push({
//         path: '/link/accessConfig/detail/add',
//         query: {
//             id: '1610475400026861568',
//         },
//     });
// };
// const handlAdd = () => {
//   router.push('/link/accessConfig/detail/add');
// }
</script>
<style lang="less" scoped>
.page-container {
    background: #f0f2f5;
    padding: 24px;
}
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
