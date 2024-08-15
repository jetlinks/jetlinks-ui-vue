<template>
    <page-container>
        <div class="apply-container">
            <pro-search
                :columns="columns"
                target="system-apply"
                @search="(params:any)=>queryParams = {...params}"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getApplyList_api"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    :params="queryParams"
                    :gridColumn="3"
                >
                    <template #headerTitle>
                        <div style="display: flex; align-items: center">
                            <PermissionButton
                                :hasPermission="`${permission}:add`"
                                type="primary"
                                @click="() => table.toAdd()"
                            >
                                <AIcon type="PlusOutlined" />{{ $t('Apply.index.996228-0') }}
                            </PermissionButton>
                            <p style="margin: 0 0 0 30px; color: #0000008c">
                                <AIcon
                                    type="ExclamationCircleOutlined"
                                    style="margin-right: 12px"
                                />
                                {{ $t('Apply.index.996228-1') }}
                            </p>
                        </div>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :value="slotProps"
                            :actions="table.getActions(slotProps, 'card')"
                            v-bind="slotProps"
                            :status="slotProps.state?.value"
                            :statusText="slotProps.state?.value==='enabled'?$t('Apply.index.996228-6'):$t('Apply.index.996228-7')"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                        >
                            <template #img>
                                <slot name="img">
                                    <img :src="getImage('/apply.png')" />
                                </slot>
                            </template>
                            <template #content>
                                <Ellipsis
                                    style="
                                        width: calc(100% - 100px);
                                        font-size: 16px;
                                        color: rgb(49, 94, 251);
                                        font-weight: 700;
                                        margin-bottom: 8px;
                                    "
                                >
                                    {{ slotProps.name }}
                                </Ellipsis>
                                <j-row>
                                    <j-col :span="12">
                                        <div class="card-item-content-text">
                                            {{ $t('Apply.index.996228-2') }}
                                        </div>
                                        <div>
                                            {{
                                                table.getTypeLabel(
                                                    slotProps.provider,
                                                )
                                            }}
                                        </div>
                                    </j-col>
                                    <j-col :span="12">
                                        <div class="card-item-content-text">
                                            {{ $t('Apply.index.996228-3') }}
                                        </div>
                                        <Ellipsis>
                                            {{ slotProps.description }}
                                        </Ellipsis>
                                    </j-col>
                                </j-row>
                            </template>
                            <template #actions="item">
                                <j-tooltip
                                    v-bind="item.tooltip"
                                    :title="item.disabled && item.tooltip.title"
                                >
                                    <j-dropdown
                                        placement="bottomRight"
                                        v-if="item.key === 'others'"
                                    >
                                        <j-button>
                                            <AIcon :type="item.icon" />
                                            <span>{{ item.text }}</span>
                                        </j-button>
                                        <template #overlay>
                                            <j-menu>
                                                <j-menu-item
                                                    v-for="(
                                                        o, i
                                                    ) in item.children"
                                                    :key="i"
                                                >
                                                    <j-tooltip
                                                        :title="
                                                            o?.tooltip?.title
                                                        "
                                                    >
                                                        <j-button
                                                            type="link"
                                                            @click="o.onClick"
                                                            :disabled="
                                                                o.disabled
                                                            "
                                                        >
                                                            <AIcon
                                                                :type="o.icon"
                                                            />
                                                            <span>{{
                                                                o.text
                                                            }}</span>
                                                        </j-button>
                                                    </j-tooltip>
                                                </j-menu-item>
                                            </j-menu>
                                        </template>
                                    </j-dropdown>
                                    <PermissionButton
                                        v-else
                                        :hasPermission="item.permission"
                                        :tooltip="item.tooltip"
                                        :pop-confirm="item.popConfirm"
                                        @click="item.onClick"
                                        :disabled="item.disabled"
                                    >
                                        <AIcon :type="item.icon" />
                                        <span v-if="item.key !== 'delete'">{{
                                            item.text
                                        }}</span>
                                    </PermissionButton>
                                </j-tooltip>
                            </template>

                            <!-- <template #mark>
                                <AIcon
                                    type="EyeOutlined"
                                    style="font-size: 24px"
                                    @click="
                                        () => table.toSave(slotProps.id, true)
                                    "
                                />
                            </template> -->
                        </CardBox>
                    </template>

                    <template #provider="slotProps">
                        {{ table.getTypeLabel(slotProps.provider) }}
                    </template>
                    <template #status="slotProps">
                        <BadgeStatus
                            :status="slotProps.state.value"
                            :text="slotProps.state.text"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                        ></BadgeStatus>
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <PermissionButton
                                v-for="i in table.getActions(
                                    slotProps,
                                    'table',
                                )"
                                :hasPermission="i.permission"
                                type="link"
                                :key="i.key"
                                :tooltip="i.tooltip"
                                :pop-confirm="i.popConfirm"
                                @click="i.onClick"
                                :disabled="i.disabled"
                            >
                                <AIcon :type="i.icon" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>
        </div>
        <div class="dialogs">
            <MenuDialog
                v-if="dialogVisible && current.provider !== 'third-party'"
                v-model:visible="dialogVisible"
                mode="edit"
                :data="current"
                @refresh="table.refresh"
            />
            <ThirdMenu
                v-if="dialogVisible && current.provider === 'third-party'"
                :data="current"
                mode="edit"
                @cancel="dialogVisible = false"
                @ok="
                    () => {
                        dialogVisible = false;
                        table.refresh;
                    }
                "
            />
        </div>
        <Add v-if="visible" @close="visible = false" />
    </page-container>
</template>

<script setup lang="ts" name="Apply">
import PermissionButton from '@/components/PermissionButton/index.vue';
import MenuDialog from './componenets/MenuDialog.vue';
import ThirdMenu from './componenets/ThirdMenu.vue';
import {
    getApplyList_api,
    changeApplyStatus_api,
    delApply_api,
    queryType,
} from '@/api/system/apply';
import { getImage, onlyMessage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import Add from './Save/Add.vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const menuStory = useMenuStore();
const permission = 'system/Apply';

const typeOptions = ref<any[]>([]);
const visible = ref<boolean>(false);
const addMenuVisible = ref<boolean>(false);

const columns = [
    {
        title: $t('Apply.index.996228-4'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },

    {
        title: $t('Apply.index.996228-2'),
        dataIndex: 'provider',
        key: 'provider',
        ellipsis: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    queryType().then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.name,
                                value: item.provider,
                            })),
                        );
                    });
                }),
        },
        scopedSlots: true,
    },
    {
        title: $t('Apply.index.996228-5'),
        dataIndex: 'status',
        key: 'status',
        ellipsis: true,
        search: {
            rename: 'state',
            type: 'select',
            options: [
                {
                    label: $t('Apply.index.996228-6'),
                    value: 'enabled',
                },
                {
                    label: $t('Apply.index.996228-7'),
                    value: 'disabled',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: $t('Apply.index.996228-3'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Apply.index.996228-8'),
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
        width: '200px',
        fixed: 'right',
    },
];
const queryParams = ref({});

const tableRef = ref();
const current = ref<any>({});
const table = {
    refresh: () => {
        tableRef.value.reload(queryParams.value);
        // window.location.reload();
    },
    toAdd: () => {
        visible.value = true;
    },
    toSave: (id?: string, view = false) => {
        if (id) menuStory.jumpPage('system/Apply/Save', {}, { id, view });
        else menuStory.jumpPage('system/Apply/Save');
    },
    changeStatus: (row: any) => {
        const state = row.state.value === 'enabled' ? 'disabled' : 'enabled';
        const response = changeApplyStatus_api(row.id, { state });
        response.then((resp: any) => {
            if (resp.status === 200) {
                onlyMessage($t('Apply.index.996228-9'));
                table.refresh();
            }
        });
        return response;
    },
    clickDel: (row: any) => {
        const response = delApply_api(row.id);
        response.then((resp: any) => {
            if (resp.status === 200) {
                onlyMessage($t('Apply.index.996228-9'));
                table.refresh();
            }
        });
        return response;
    },
    getActions: (
        data: Partial<Record<string, any>>,
        type: 'card' | 'table',
    ) => {
        if (!data) return [];
        const disabled = data.state.value === 'enabled';

        const result = [
            {
                permission: `${permission}:update`,
                key: 'edit',
                text: $t('Apply.index.996228-10'),
                tooltip: {
                    title: $t('Apply.index.996228-10'),
                },
                icon: 'EditOutlined',
                onClick: () => table.toSave(data.id),
            },
            {
                permission: `${permission}:action`,
                key: 'action',
                text: disabled ? $t('Apply.index.996228-22') : $t('Apply.index.996228-11'),
                tooltip: {
                    title: disabled ? $t('Apply.index.996228-22') : $t('Apply.index.996228-11'),
                },
                popConfirm: {
                    title: `${disabled ? $t('Apply.index.996228-12') : $t('Apply.index.996228-13')}`,
                    onConfirm: () => table.changeStatus(data),
                },
                icon: disabled ? 'StopOutlined' : 'PlayCircleOutlined',
            },
            {
                permission: `${permission}:delete`,
                key: 'delete',
                text: $t('Apply.index.996228-14'),
                tooltip: {
                    title: disabled ? $t('Apply.index.996228-15') : $t('Apply.index.996228-14'),
                },
                popConfirm: {
                    title: $t('Apply.index.996228-16'),
                    onConfirm: () => table.clickDel(data),
                },
                disabled,
                icon: 'DeleteOutlined',
            },
        ] as any[];
        const otherServers = data.integrationModes.map(
            (item: any) => item.value as string,
        );
        const others = {
            key: 'others',
            text: $t('Apply.index.996228-17'),
            icon: 'EllipsisOutlined',
            children: [] as any[],
        };
        // 有集成菜单权限
        if (otherServers.includes('page'))
            others.children?.push({
                permission: [`${permission}:add`, `${permission}:update`],
                key: 'page',
                text: $t('Apply.index.996228-18'),
                tooltip: {
                    title: !disabled ? $t('Apply.index.996228-19') : $t('Apply.index.996228-18'),
                },
                icon: 'MenuUnfoldOutlined',
                disabled: !disabled,
                onClick: () => {
                    selectId.value = data.id;
                    selectProvider.value = data.provider;
                    current.value = data;
                    dialogVisible.value = true;
                },
            });
        // 有api操作权限
        if (otherServers.includes('apiServer'))
            others.children?.push(
                {
                    permission: [`${permission}:add`, `${permission}:update`],
                    key: 'empowerment',
                    text: $t('Apply.index.996228-20'),
                    tooltip: {
                        title: $t('Apply.index.996228-20'),
                    },
                    icon: 'icon-fuquan',
                    onClick: () => {
                        menuStory.jumpPage(
                            'system/Apply/Api',
                            {},
                            { code: data.id },
                        );
                    },
                },
                {
                    permission: [`${permission}:add`, `${permission}:update`],
                    key: 'viewApi',
                    text: $t('Apply.index.996228-21'),
                    tooltip: {
                        title: $t('Apply.index.996228-21'),
                    },
                    icon: 'icon-chakanAPI',
                    onClick: () => {
                        menuStory.jumpPage(
                            'system/Apply/View',
                            {},
                            { code: data.id },
                        );
                    },
                },
            );
        // 其他不为空
        if (others.children.length > 0) {
            if (type === 'card') {
                result.splice(result.length - 1, 0, others);
            } else {
                result.splice(result.length - 1, 0, ...others.children);
            }
        }

        return result;
    },
    getTypeLabel: (val: string) => {
        if (!val) return '';
        return typeOptions.value?.find((item) => item?.value === val)?.label;
    },
};
const dialogVisible = ref(false);
const selectId = ref<string>('');
const selectProvider = ref<any>('');
onMounted(() => {
    queryType().then((resp: any) => {
        if (resp.status === 200) {
            const arr = resp.result.map((item: any) => ({
                label: item.name,
                value: item.provider,
            }));
            typeOptions.value = arr;
        }
    });
});
</script>

<style lang="less" scoped>
.apply-container {
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
