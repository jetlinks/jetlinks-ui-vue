<template>
    <page-container class="apply-container">
        <div class="apply-container">
            <Search :columns="columns" @search="search" />

            <JTable
                ref="tableRef"
                :columns="columns"
                :request="getApplyList_api"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :gridColumn="3"
            >
                <template #headerTitle>
                    <div style="display: flex; align-items: center">
                        <PermissionButton
                            :uhasPermission="`${permission}:add`"
                            type="primary"
                            @click="() => table.toSave()"
                        >
                            <AIcon type="PlusOutlined" />新增
                        </PermissionButton>
                        <p style="margin: 0 0 0 30px; color: #0000008c">
                            <AIcon
                                type="ExclamationCircleOutlined"
                                style="margin-right: 12px"
                            />
                            应用管理将多个应用系统的登录简化为一次登录，实现多处访问、集中管控的业务场景。
                        </p>
                    </div>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="table.getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'success',
                            disabled: 'error',
                        }"
                        hasMark
                    >
                        <template #img>
                            <slot name="img">
                                <img :src="getImage('/apply.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <h3 class="card-item-content-title">
                                {{ slotProps.name }}
                            </h3>
                            <a-row>
                                <a-col :span="12">
                                    <div class="card-item-content-text">
                                        类型
                                    </div>
                                    <div>
                                        {{
                                            table.getTypeLabel(
                                                slotProps.provider,
                                            )
                                        }}
                                    </div>
                                </a-col>
                                <a-col :span="12">
                                    <div class="card-item-content-text">
                                        说明
                                    </div>
                                    <div>{{ slotProps.description }}</div>
                                </a-col>
                            </a-row>
                        </template>
                        <template #actions="item">
                            <a-tooltip
                                v-bind="item.tooltip"
                                :title="item.disabled && item.tooltip.title"
                            >
                                <a-dropdown
                                    placement="bottomRight"
                                    v-if="item.key === 'others'"
                                >
                                    <a-button>
                                        <AIcon :type="item.icon" />
                                        <span>{{ item.text }}</span>
                                    </a-button>
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item
                                                v-for="(o, i) in item.children"
                                                :key="i"
                                            >
                                                <a-button
                                                    type="link"
                                                    @click="o.onClick"
                                                >
                                                    <AIcon :type="o.icon" />
                                                    <span>{{ o.text }}</span>
                                                </a-button>
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                                <PermissionButton
                                    v-else
                                    :uhasPermission="item.permission"
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
                            </a-tooltip>
                        </template>

                        <template #mark>
                            <AIcon
                                type="EyeOutlined"
                                style="font-size: 24px"
                                @click="() => table.toSave(slotProps.id, true)"
                            />
                        </template>
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
                            enabled: 'success',
                            disabled: 'error',
                        }"
                    ></BadgeStatus>
                </template>
                <template #action="slotProps">
                    <a-space :size="16">
                        <PermissionButton
                            v-for="i in table.getActions(slotProps, 'table')"
                            :uhasPermission="i.permission"
                            type="link"
                            :tooltip="i.tooltip"
                            :pop-confirm="i.popConfirm"
                            @click="i.onClick"
                            :disabled="i.disabled"
                        >
                            <AIcon :type="i.icon" />
                        </PermissionButton>
                    </a-space>
                </template>
            </JTable>
        </div>
        <div class="dialogs">
            <MenuDialog ref="dialogRef" mode="edit" />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Apply">
import PermissionButton from '@/components/PermissionButton/index.vue';
import MenuDialog from './componenets/MenuDialog.vue';
import {
    getApplyList_api,
    changeApplyStatus_api,
    delApply_api,
} from '@/api/system/apply';
import { ActionsType } from '@/components/Table';
import { getImage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
import { message } from 'ant-design-vue';

const menuStory = useMenuStore();
const permission = 'system/User';
const typeOptions = [
    {
        label: '内部独立应用',
        value: 'internal-standalone',
    },
    {
        label: '微信网站应用',
        value: 'wechat-webapp',
    },
    {
        label: '内部集成应用',
        value: 'internal-integrated',
    },
    {
        label: '钉钉企业内部应用',
        value: 'dingtalk-ent-app',
    },
    {
        label: '第三方应用',
        value: 'third-party',
    },
];
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },

    {
        title: '类型',
        dataIndex: 'provider',
        key: 'provider',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'select',
            options: typeOptions,
        },
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        ellipsis: true,
        search: {
            rename: 'status',
            type: 'select',
            options: [
                {
                    label: '正常',
                    value: 'enabled',
                },
                {
                    label: '禁用',
                    value: 'disabled',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
    },
];
const params = ref({});
const search = (newParams: any) => (params.value = { ...newParams });

const tableRef = ref();
const dialogRef = ref();
const table = {
    refresh: () => {
        tableRef.value.reload();
    },
    toSave: (id?: string, view = false) => {
        if (id) menuStory.jumpPage('system/Apply/Save', {}, { id, view });
        else menuStory.jumpPage('system/Apply/Save');
    },
    changeStatus: (row: any) => {
        const state = row.state.value === 'enabled' ? 'disabled' : 'enabled';
        changeApplyStatus_api(row.id, { state }).then((resp: any) => {
            if (resp.status === 200) {
                message.success('操作成功');
                table.refresh();
            }
        });
    },
    clickDel: (row: any) => {
        delApply_api(row.id).then((resp: any) => {
            if (resp.status === 200) {
                message.success('操作成功');
                table.refresh();
            }
        });
    },
    getActions: (
        data: Partial<Record<string, any>>,
        type: 'card' | 'table',
    ) => {
        if (!data) return [];
        const disabled = data.state.value === 'enabled';

        const result = [
            {
                permission: true,
                key: 'edit',
                text: '编辑',
                tooltip: {
                    title: '编辑',
                },
                icon: 'EditOutlined',
                onClick: () => table.toSave(data.id),
            },
            {
                permission: true,
                key: 'action',
                text: disabled ? '禁用' : '启用',
                tooltip: {
                    title: disabled ? '禁用' : '启用',
                },
                popConfirm: {
                    title: `确认${disabled ? '禁用' : '启用'}`,
                    onConfirm: () => table.changeStatus(data),
                },
                icon: disabled ? 'StopOutlined' : 'PlayCircleOutlined',
            },
            {
                permission: true,
                key: 'delete',
                text: '删除',
                tooltip: {
                    title: disabled ? '请先禁用再删除' : '删除',
                },
                popConfirm: {
                    title: '确认删除?',
                    onConfirm: () => table.clickDel(data),
                },
                disabled,
                icon: 'DeleteOutlined',
            },
        ] as ActionsType[];
        const otherServers = data.integrationModes.map(
            (item: any) => item.value as string,
        );
        const others = {
            key: 'others',
            text: '其他',
            icon: 'EllipsisOutlined',
            children: [] as ActionsType[],
        };
        // 有集成菜单权限
        if (otherServers.includes('page'))
            others.children?.push({
                permission: true,
                key: 'page',
                text: '集成菜单',
                tooltip: {
                    title: '集成菜单',
                },
                icon: 'MenuUnfoldOutlined',
                onClick: () => {
                    dialogRef.value &&
                        dialogRef.value.openDialog(data.id, data.provider);
                },
            });
        // 有api操作权限
        if (otherServers.includes('apiServer'))
            others.children?.push(
                {
                    permission: true,
                    key: 'empowerment',
                    text: '赋权',
                    tooltip: {
                        title: '赋权',
                    },
                    icon: 'icon-fuquan',
                    onClick: () => {},
                },
                {
                    permission: true,
                    key: 'viewApi',
                    text: '查看API',
                    tooltip: {
                        title: '查看API',
                    },
                    icon: 'icon-chakanAPI',
                    onClick: () => {},
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
        return typeOptions.find((item) => item.value === val)?.label;
    },
};
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
