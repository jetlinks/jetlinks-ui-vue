<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-link-access-config"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    model="CARD"
                    :columns="columns"
                    :request="list"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    gridColumn="2"
                    :gridColumns="[1, 2]"
                    :params="params"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            @click="handleAdd"
                            hasPermission="link/AccessConfig:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{ $t('AccessConfig.index.428280-0') }}
                        </PermissionButton>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :showStatus="true"
                            :value="slotProps"
                            :actions="getActions(slotProps)"
                            v-bind="slotProps"
                            :status="slotProps.state.value"
                            :statusText="slotProps.state.value==='enabled'?$t('AccessConfig.index.428280-6'):$t('AccessConfig.index.428280-5')"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                            @click="handleEye(slotProps)"
                        >
                            <template #img>
                                <slot name="img">
                                    <img
                                        :src="getImage('/device-access.png')"
                                    />
                                </slot>
                            </template>
                            <template #content>
                                <div class="card-item-content">
                                    <Ellipsis style="width: calc(100% - 100px)">
                                        <span class="card-title">
                                            {{ slotProps.name }}
                                        </span>
                                    </Ellipsis>
                                    <j-row class="card-item-content-box">
                                        <j-col
                                            :span="12"
                                            v-if="slotProps.channelInfo"
                                            class="card-item-content-text"
                                        >
                                            <Ellipsis
                                                style="
                                                    width: calc(100% - 100px);
                                                "
                                            >
                                                <div
                                                    class="card-item-content-text-title"
                                                >
                                                    {{
                                                        slotProps.channelInfo
                                                            .name
                                                    }}
                                                </div>
                                            </Ellipsis>
                                            <Ellipsis
                                                style="
                                                    width: calc(100% - 10px);
                                                    display: flex;
                                                    margin-top: 4px;
                                                "
                                                v-if="
                                                    slotProps.channelInfo
                                                        .addresses
                                                "
                                            >
                                                <j-badge
                                                    :status="
                                                        getStatus(slotProps)
                                                    "
                                                />
                                                <span>
                                                    {{
                                                        slotProps.channelInfo
                                                            .addresses[0]
                                                            .address
                                                    }}
                                                </span>
                                            </Ellipsis>
                                        </j-col>
                                        <j-col
                                            :span="12"
                                            v-if="slotProps.protocolDetail"
                                            class="card-item-content-text"
                                        >
                                            <div
                                                class="card-item-content-text-title"
                                            >
                                                {{ $t('AccessConfig.index.428280-1') }}
                                            </div>
                                            <Ellipsis
                                                style="width: calc(100% - 10px)"
                                                :lineClamp="2"
                                            >
                                                <div>
                                                    {{
                                                        slotProps.protocolDetail
                                                            .name
                                                    }}
                                                </div>
                                            </Ellipsis>
                                        </j-col>
                                    </j-row>
                                    <j-row>
                                        <j-col
                                            :span="24"
                                            class="card-item-content-description"
                                        >
                                            <j-tooltip>
                                                <template #title>
                                                    {{
                                                        getDescription(
                                                            slotProps,
                                                        )
                                                    }}
                                                </template>
                                                {{ getDescription(slotProps) }}
                                            </j-tooltip>
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
                                    :hasPermission="
                                        'link/AccessConfig:' + item.key
                                    "
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
                    <template #state="slotProps">
                        <j-badge
                            :text="slotProps.state.text"
                            :status="statusMap.get(slotProps.state.value)"
                        />
                    </template>
                </j-pro-table>
            </FullPage>
        </div>
        <Outline v-if="visibleOutline" :data="current" @closeDrawer="visibleOutline = false"></Outline>
    </page-container>
</template>
<script lang="ts" setup name="AccessConfigPage">
import type { ActionsType } from '@/components/Table/index';
import { getImage } from '@/utils/comm';
import {
    list,
    getProviders,
    remove,
    undeploy,
    deploy,
} from '@/api/link/accessConfig';
import { onlyMessage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';
import { accessConfigTypeFilter } from '@/utils/setting';
import { cloneDeep } from 'lodash-es';
import Outline from './Outline/index.vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const visibleOutline = ref(false);
const current = ref()
let providersList = ref<Record<string, any>>([]);

const statusMap = new Map();
statusMap.set('enabled', 'success');
statusMap.set('disabled', 'error');

const columns = [
    {
        title: $t('AccessConfig.index.428280-2'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        // scopedSlots: true,
    },
    {
        title: $t('AccessConfig.index.428280-3'),
        dataIndex: 'provider',
        key: 'provider',
        search: {
            type: 'select',
            options: async () => {
                const res: any = await getProviders();
                const providersOptions = accessConfigTypeFilter(
                    res.result || [],
                );
                return providersOptions.filter((i: any) => {
                    return i.id !== 'modbus-tcp' && i.id !== 'opc-ua';
                });
            },
        },
    },
    {
        title: $t('AccessConfig.index.428280-4'),
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: $t('AccessConfig.index.428280-5'),
                    value: 'disabled',
                },
                {
                    label: $t('AccessConfig.index.428280-6'),
                    value: 'enabled',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: $t('AccessConfig.index.428280-7'),
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('AccessConfig.index.428280-8'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) return [];
    const state = data.state.value;
    const stateText = state === 'enabled' ? $t('AccessConfig.index.428280-16') : $t('AccessConfig.index.428280-9');
    return [
        {
            key: 'update',
            text: $t('AccessConfig.index.428280-10'),
            tooltip: {
                title: $t('AccessConfig.index.428280-10'),
            },
            icon: 'EditOutlined',
            onClick: async () => {
                handleEdit(data.id);
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
                title: $t('AccessConfig.index.428280-11', [stateText]),
                onConfirm: () => {
                    let response =
                        state === 'enabled'
                            ? undeploy(data.id)
                            : deploy(data.id);
                    response.then((res) => {
                        if (res.success) {
                            onlyMessage($t('AccessConfig.index.428280-12'), 'success');
                            tableRef.value?.reload();
                        }
                    });
                    return response;
                },
            },
        },
        {
            key: 'delete',
            text: $t('AccessConfig.index.428280-13'),
            disabled: state === 'enabled',
            tooltip: {
                title: state === 'enabled' ? $t('AccessConfig.index.428280-14') : $t('AccessConfig.index.428280-13'),
            },
            popConfirm: {
                title: $t('AccessConfig.index.428280-15'),
                onConfirm: () => {
                    const response: any = remove(data.id);
                    response.then((res: any) => {
                        if (res.status === 200) {
                            onlyMessage($t('AccessConfig.index.428280-12'), 'success');
                            tableRef.value.reload();
                        } else {
                            onlyMessage(res?.message, 'error');
                        }
                    });
                    return response
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const getProvidersList = async () => {
    const res: any = await getProviders();
    providersList.value = res.result;
};
getProvidersList();

const handleAdd = () => {
    menuStory.jumpPage(
        `link/AccessConfig/Detail`,
        { id: ':id' },
        { view: false },
    );
};
const handleEdit = (id: string) => {
    menuStory.jumpPage(`link/AccessConfig/Detail`, { id }, { view: false });
};
const handleEye = (data: any) => {
    visibleOutline.value = true;
    current.value = data;
    // menuStory.jumpPage(`link/AccessConfig/Detail`, { id }, { view: true });
};

const getDescription = (slotProps: Record<string, any>) =>
    slotProps.description
        ? slotProps.description
        : providersList.value?.find(
              (item: Record<string, any>) => item.id === slotProps.provider,
          )?.description;

const getStatus = (slotProps: Record<string, any>) =>
    slotProps.channelInfo.addresses[0].health === -1 ? 'error' : 'processing';

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    const newTerms = cloneDeep(e);
    if (newTerms.terms?.length) {
        newTerms.terms.forEach((a: any) => {
            a.terms = a.terms.map((b: any) => {
                if (b.column === 'provider') {
                    if (b.value === 'collector-gateway') {
                        b.termType = b.termType === 'eq' ? 'in' : 'nin';
                        b.value = ['opc-ua', 'modbus-tcp', 'collector-gateway'];
                    } else if (
                        Array.isArray(b.value) &&
                        b.value.includes('collector-gateway')
                    ) {
                        b.value = ['opc-ua', 'modbus-tcp', ...b.value];
                    }
                }
                return b;
            });
        });
    }
    params.value = newTerms;
};
</script>
<style lang="less" scoped>
.table {
    max-height: 700px;
    overflow-y: auto;
    overflow-x: hidden;
}

.card-item-content {
    min-height: 100px;
    .card-title {
        font-size: 18px;
        font-weight: 800;
        line-height: 22px;
    }

    .card-item-content-box {
        min-height: 50px;
    }

    .card-item-content-text-title {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.75);
        opacity: 0.75;
    }
    .card-item-content-description {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: #666666;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }
}
</style>
