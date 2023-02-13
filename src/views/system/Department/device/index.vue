<template>
    <div class="product-container">
        <Search :columns="query.columns" @search="query.search" />
        <JTable
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
                <a-space>
                    <a-button type="primary" @click="table.clickAdd">
                        <plus-outlined />资产分配
                    </a-button>
                    <a-dropdown trigger="hover">
                        <a-button>批量操作</a-button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <a-popconfirm
                                        title="是否批量解除绑定"
                                        ok-text="确定"
                                        cancel-text="取消"
                                        @confirm="table.clickUnBind()"
                                    >
                                        <a-button>
                                            <DisconnectOutlined /> 批量解绑
                                        </a-button>
                                    </a-popconfirm>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-button @click="table.clickEdit()">
                                        <EditOutlined /> 批量编辑
                                    </a-button>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </a-space>
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
                        <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">ID</div>
                                <div
                                    style="cursor: pointer"
                                    class="card-item-content-value"
                                >
                                    {{ slotProps.id }}
                                </div>
                            </a-col>
                            <a-col :span="12">
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
                            </a-col>
                        </a-row>
                    </template>
                    <template #actions>
                        <a-button
                            @click="table.clickEdit(slotProps)"
                            style="margin-right: 10px"
                        >
                            <AIcon type="EditOutlined" />
                        </a-button>
                        <a-popconfirm
                            title="是否解除绑定"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="table.clickUnBind(slotProps)"
                            ><a-button>
                                <AIcon type="DisconnectOutlined" />
                            </a-button>
                        </a-popconfirm>
                    </template>
                </CardBox>
            </template>
        </JTable>

        <div class="dialogs">
            <AddDeviceOrProductDialog
                ref="addDialogRef"
                :parent-id="props.parentId"
                :all-permission="table.permissionList.value"
                asset-type="device"
                @confirm="table.refresh"
            />
            <EditPermissionDialog
                ref="editDialogRef"
                :parent-id="props.parentId"
                :all-permission="table.permissionList.value"
                asset-type="device"
                @confirm="table.refresh"
            />
        </div>
    </div>
</template>

<script setup lang="ts" name="device">
import {
    PlusOutlined,
    EditOutlined,
    DisconnectOutlined,
} from '@ant-design/icons-vue';
import AddDeviceOrProductDialog from '../components/AddDeviceOrProductDialog.vue';
import EditPermissionDialog from '../components/EditPermissionDialog.vue';
import { getImage } from '@/utils/comm';
import {
    getDeviceList_api,
    getPermission_api,
    getPermissionDict_api,
    unBindDeviceOrProduct_api,
} from '@/api/system/department';
import { intersection } from 'lodash-es';

import { dictType } from '../typing.d.ts';
import { message } from 'ant-design-vue';

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
                        label: '在线',
                        value: 'online',
                    },
                    {
                        label: '离线',
                        value: 'offline',
                    },
                    {
                        label: '禁用',
                        value: 'notActive',
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
            (key) => permissionList.find((item) => item.id === key)?.name,
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
            getDeviceList_api(params).then((resp) => {
                type resultType = {
                    data: any[];
                    total: number;
                    pageSize: number;
                    pageIndex: number;
                };
                const { pageIndex, pageSize, total, data } =
                    resp.result as resultType;
                const ids = data.map((item) => item.id);
                getPermission_api('device',ids, parentId).then((perResp: any) => {
                    const permissionObj = {};
                    perResp.result.forEach((item: any) => {
                        permissionObj[item.assetId] = item.grantedPermissions;
                    });
                    data.forEach(
                        (item) => (item.permission = permissionObj[item.id]),
                    );

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
                });
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
                            assetType: 'device',
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
        addDialogRef.value && addDialogRef.value.openDialog();
    },
    clickEdit: (row?: any) => {
        const ids = row ? [row.id] : [...table._selectedRowKeys.value];
        if (row || table.selectedRows.length === 1) {
            const permissionList =
                row?.permission || table.selectedRows[0].permission;
            return (
                editDialogRef.value &&
                editDialogRef.value.openDialog(ids, permissionList)
            );
        } else if (table.selectedRows.length === 0) return;
        const permissionList = table.selectedRows.map(
            (item) => item.permission,
        );
        const mixPermissionList = intersection(...permissionList);

        editDialogRef.value &&
            editDialogRef.value.openDialog(ids, mixPermissionList);
    },
    clickUnBind: (row?: any) => {
        const ids = row ? [row.id] : [...table._selectedRowKeys.value];
        if (ids.length < 1) return message.warning('请勾选需要解绑的数据');
        const params = [
            {
                targetType: 'org',
                targetId: props.parentId,
                assetType: 'device',
                assetIdList: ids,
            },
        ];
        unBindDeviceOrProduct_api('device', params).then(() => {
            message.success('操作成功');
            table.refresh();
        });
    },
    refresh: () => {
        nextTick(() => {
            tableRef.value.reload();
        });
    },
};

const addDialogRef = ref();
const editDialogRef = ref();

table.init();
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
            .ant-btn {
                color: #252525;
            }
        }
    }
}
</style>
