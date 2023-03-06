<template>
    <div class="product-container">
        <Search :columns="query.columns" @search="query.search" />
        <j-pro-table
            ref="tableRef"
            :request="table.requestFun"
            :gridColumn="2"
            model="CARD"
            :params="query.params.value"
            :rowSelection="{
                selectedRowKeys: table._selectedRowKeys.value,
            }"
            @cancelSelect="table.cancelSelect"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton
                        :uhasPermission="`${permission}:assert`"
                        type="primary"
                        @click="table.clickAdd"
                    >
                        <AIcon type="PlusOutlined" />资产分配
                    </PermissionButton>
                    <j-dropdown trigger="hover">
                        <j-button>批量操作</j-button>
                        <template #overlay>
                            <j-menu>
                                <j-menu-item>
                                    <PermissionButton
                                        :uhasPermission="`${permission}:bind`"
                                        :popConfirm="{
                                            title: `是否批量解除绑定`,
                                            onConfirm: () =>
                                                table.clickUnBind(),
                                        }"
                                    >
                                        <AIcon
                                            type="DisconnectOutlined"
                                        />批量解绑
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item>
                                    <PermissionButton
                                        :uhasPermission="`${permission}:assert`"
                                        @click="() => table.clickEdit()"
                                    >
                                        <AIcon type="EditOutlined" />批量编辑
                                    </PermissionButton>
                                </j-menu-item>
                            </j-menu>
                        </template>
                    </j-dropdown>
                </j-space>
            </template>

            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    :actions="[{ key: 1 }]"
                    v-bind="slotProps"
                    :active="
                        table._selectedRowKeys.value.includes(slotProps.id)
                    "
                    @click="table.onSelectChange"
                    :status="slotProps.state?.value"
                    :statusText="slotProps.state?.text"
                    :statusNames="{
                        online: 'success',
                        offline: 'error',
                        notActive: 'warning',
                    }"
                >
                    <template #img>
                        <slot name="img">
                            <img
                                :src="getImage('/device-product.png')"
                                style="cursor: pointer"
                            />
                        </slot>
                    </template>
                    <template #content>
                        <h3 class="card-item-content-title">
                            {{ slotProps.name }}
                        </h3>
                        <j-row>
                            <j-col :span="12">
                                <div class="card-item-content-text">ID</div>
                                <div
                                    style="cursor: pointer"
                                    class="card-item-content-value"
                                >
                                    {{ slotProps.id }}
                                </div>
                            </j-col>
                            <j-col :span="12">
                                <div class="card-item-content-text">
                                    资产权限
                                </div>
                                <div
                                    style="cursor: pointer"
                                    class="card-item-content-value"
                                >
                                    {{
                                        table.permissionList.value.length &&
                                        table.getPermissLabel(
                                            slotProps.permission,
                                        )
                                    }}
                                </div>
                            </j-col>
                        </j-row>
                    </template>
                    <template #actions>
                        <PermissionButton
                            :uhasPermission="`${permission}:assert`"
                            @click="() => table.clickEdit(slotProps)"
                        >
                            <AIcon type="EditOutlined" />
                        </PermissionButton>

                        <PermissionButton
                            :uhasPermission="`${permission}:bind`"
                            :popConfirm="{
                                title: `是否解除绑定`,
                                onConfirm: () => table.clickUnBind(slotProps),
                            }"
                        >
                            <AIcon type="DisconnectOutlined" />
                        </PermissionButton>
                    </template>
                </CardBox>
            </template>
        </j-pro-table>

        <div class="dialogs">
            <AddDeviceOrProductDialog
                v-if="dialogs.addShow"
                v-model:visible="dialogs.addShow"
                :query-columns="query.columns"
                :parent-id="props.parentId"
                :all-permission="table.permissionList.value"
                asset-type="product"
                @confirm="table.addConfirm"
            />
            <EditPermissionDialog
                v-if="dialogs.editShow"
                v-model:visible="dialogs.editShow"
                :ids="dialogs.selectIds"
                :permission-list="dialogs.permissList"
                :parent-id="props.parentId"
                :all-permission="table.permissionList.value"
                asset-type="product"
                @confirm="table.refresh"
            />
            <NextDialog
                v-if="dialogs.nextShow"
                v-model:visible="dialogs.nextShow"
                @confirm="emits('openDeviceBind')"
            />
        </div>
    </div>
</template>

<script setup lang="ts" name="product">
import PermissionButton from '@/components/PermissionButton/index.vue';

import AddDeviceOrProductDialog from '../components/AddDeviceOrProductDialog.vue';
import EditPermissionDialog from '../components/EditPermissionDialog.vue';
import NextDialog from '../components/NextDialog.vue';
import { getImage } from '@/utils/comm';
import {
    getDeviceOrProductList_api,
    getPermission_api,
    getPermissionDict_api,
    unBindDeviceOrProduct_api,
} from '@/api/system/department';
import { intersection } from 'lodash-es';

import type { dictType } from '../typing.d.ts';
import { message } from 'ant-design-vue';

const permission = 'system/Department';

const emits = defineEmits(['openDeviceBind']);
const props = defineProps<{
    parentId: string;
}>();
const query = {
    columns: [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'select',
                options: [
                    {
                        label: '正常',
                        value: 1,
                    },
                    {
                        label: '禁用',
                        value: 0,
                    },
                ],
            },
        },
    ],
    params: ref({}),
    search: (params: any) => {
        query.params.value = params;
    },
};

const tableRef = ref();
const table = {
    _selectedRowKeys: ref<string[]>([]),
    selectedRows: [] as any[],
    permissionList: ref<dictType>([]),

    init: () => {
        table.getPermissionDict();
        watch(
            () => props.parentId,
            () => {
                table.refresh();
            },
        );
    },

    // 获取权限数据字典
    getPermissionDict: () => {
        getPermissionDict_api().then((resp: any) => {
            table.permissionList.value = resp.result;
        });
    },
    // 获取权限名称
    getPermissLabel: (values: string[]) => {
        const permissionList = table.permissionList.value;
        if (permissionList.length < 1 || values.length < 1) return '';
        const result = values.map(
            (key) => permissionList.find((item:any) => item.id === key)?.name,
        );
        return result.join(',');
    },
    // 选中
    onSelectChange: (row: any) => {
        const selectedRowKeys = table._selectedRowKeys.value;
        const index = selectedRowKeys.indexOf(row.id);

        if (index === -1) {
            selectedRowKeys.push(row.id);
            table.selectedRows.push(row);
        } else {
            selectedRowKeys.splice(index, 1);
            table.selectedRows.splice(index, 1);
        }
    },
    // 取消全选
    cancelSelect: () => {
        table._selectedRowKeys.value = [];
        table.selectedRows = [];
    },
    // 获取并整理数据
    getData: (params: object, parentId: string) =>
        new Promise((resolve) => {
            getDeviceOrProductList_api(params).then((resp) => {
                type resultType = {
                    data: any[];
                    total: number;
                    pageSize: number;
                    pageIndex: number;
                };
                const { pageIndex, pageSize, total, data } =
                    resp.result as resultType;
                const ids = data.map((item) => item.id);
                getPermission_api('product', ids, parentId).then(
                    (perResp: any) => {
                        const permissionObj = {};
                        perResp.result.forEach((item: any) => {
                            permissionObj[item.assetId] =
                                item.grantedPermissions;
                        });
                        data.forEach((item) => {
                            item.permission = permissionObj[item.id];
                            item.state = {
                                value:
                                    item.state === 1
                                        ? 'online'
                                        : item.state === 0
                                        ? 'offline'
                                        : '',
                                text:
                                    item.state === 1
                                        ? '正常'
                                        : item.state === 0
                                        ? '禁用'
                                        : '',
                            };
                        });

                        resolve({
                            code: 200,
                            result: {
                                data: data,
                                pageIndex,
                                pageSize,
                                total,
                            },
                            status: 200,
                        });
                    },
                );
            });
        }),
    // 整理参数并获取数据
    requestFun: async (oParams: any) => {
        table._selectedRowKeys.value = [];
        table.selectedRows = [];
        if (props.parentId) {
            const params = {
                ...oParams,
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: [
                    ...oParams.terms,
                    {
                        column: 'id',
                        termType: 'dim-assets',
                        value: {
                            assetType: 'product',
                            targets: [
                                {
                                    type: 'org',
                                    id: props.parentId,
                                },
                            ],
                        },
                    },
                ],
            };
            const resp: any = await table.getData(params, props.parentId);
            return {
                code: resp.status,
                result: resp.result,
                status: resp.status,
            };
        } else {
            return {
                code: 200,
                result: {
                    data: [],
                    pageIndex: 0,
                    pageSize: 0,
                    total: 0,
                },
                status: 200,
            };
        }
    },
    clickAdd: () => {
        dialogs.addShow = true;
    },
    clickEdit: (row?: any) => {
        const ids = row ? [row.id] : [...table._selectedRowKeys.value];

        if (row || table.selectedRows.length === 1) {
            const permissionList =
                row?.permission || table.selectedRows[0].permission;
            dialogs.selectIds = ids;
            dialogs.permissList = permissionList;
            dialogs.editShow = true;
            return;
        } else if (table.selectedRows.length === 0) return;
        const permissionList = table.selectedRows.map(
            (item) => item.permission,
        );
        const mixPermissionList = intersection(...permissionList) as string[];

        dialogs.selectIds = ids;
        dialogs.permissList = mixPermissionList;
        dialogs.editShow = true;
    },
    clickUnBind: (row?: any) => {
        const ids = row ? [row.id] : [...table._selectedRowKeys.value];
        if (ids.length < 1) return message.warning('请勾选需要解绑的数据');
        const params = [
            {
                targetType: 'org',
                targetId: props.parentId,
                assetType: 'product',
                assetIdList: ids,
            },
        ];
        unBindDeviceOrProduct_api('product', params).then(() => {
            message.success('操作成功');
            table.refresh();
        });
    },
    refresh: () => {
        nextTick(() => {
            tableRef.value.reload();
        });
    },
    addConfirm: () => {
        table.refresh();
        dialogs.nextShow = true;
    },
};

table.init();

const dialogs = reactive({
    selectIds: [] as string[],
    permissList: [] as string[],
    addShow: false,
    editShow: false,
    nextShow: false,
});
</script>

<style lang="less" scoped>
.product-container {
    .card {
        .card-warp {
            &.active {
                .card-item-content-value {
                    color: #2f54eb;
                }
            }
        }
        .card-tools {
            span {
                color: #252525;
            }
        }
    }
}
</style>
