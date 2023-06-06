<template>
    <div class="product-container">
        <pro-search
            :columns="columns"
            target="category-product"
            @search="(params:any)=>queryParams = {...params}"
            style='margin-bottom: 0;'
        />
        <FullPage>
            <j-pro-table
                ref="tableRef"
                :request="table.requestFun"
                :gridColumn="2"
                :params="queryParams"
                :rowSelection="{
                    selectedRowKeys: tableData._selectedRowKeys,
                    onSelect: table.onSelect,
                    onSelectAll: table.onSelectAll,
                    onSelectNone: table.cancelSelect
                }"
                :columns="columns"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            :hasPermission="`${permission}:assert`"
                            type="primary"
                            @click="dialogs.addShow = true"
                        >
                            <AIcon type="PlusOutlined" />资产分配
                        </PermissionButton>
                        <j-dropdown trigger="hover">
                            <j-button>批量操作</j-button>
                            <template #overlay>
                                <j-menu>
                                    <j-menu-item>
                                        <PermissionButton
                                            :hasPermission="`${permission}:bind`"
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
                                            :hasPermission="`${permission}:assert`"
                                            @click="() => table.clickEdit()"
                                        >
                                            <AIcon
                                                type="EditOutlined"
                                            />批量编辑
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
                        :actions="table.getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :active="
                            tableData._selectedRowKeys.includes(slotProps.id)
                        "
                        @click="table.onSelectChange"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
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
                            <h3 class="card-item-content-title" style='margin-bottom: 18px;'>
                              <Ellipsis style="width: calc(100% - 100px);"
                              >
                                {{ slotProps.name }}
                              </Ellipsis>
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
                                            tableData.permissionList.length &&
                                            table.getPermissLabel(
                                                slotProps.permission,
                                            )
                                        }}
                                    </div>
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
                                                v-for="(o, i) in item.children"
                                                :key="i"
                                            >
                                                <j-button
                                                    type="link"
                                                    @click="o.onClick"
                                                >
                                                    <AIcon :type="o.icon" />
                                                    <span>{{ o.text }}</span>
                                                </j-button>
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
                    </CardBox>
                </template>

                <template #permission="slotProps">
                    {{
                        tableData.permissionList.length &&
                        table.getPermissLabel(slotProps.permission)
                    }}
                </template>
                <template #state="slotProps">
                    <BadgeStatus
                        :status="slotProps.state.value"
                        :text="slotProps.state.text"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
                        }"
                    ></BadgeStatus>
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <PermissionButton
                            v-for="i in table.getActions(slotProps, 'table')"
                            :hasPermission="i.permission"
                            type="link"
                            :key="i.key"
                            :tooltip="i?.tooltip"
                            :pop-confirm="i.popConfirm"
                            @click="i.onClick"
                            :disabled="i?.disabled"
                        >
                            <AIcon :type="i.icon" />
                        </PermissionButton>
                    </j-space>
                </template>
            </j-pro-table>
        </FullPage>

        <div class="dialogs">
            <AddDeviceOrProductDialog
                v-if="dialogs.addShow"
                v-model:visible="dialogs.addShow"
                :query-columns="columns"
                :parent-id="parentId"
                :all-permission="tableData.permissionList"
                asset-type="product"
                @confirm="table.addConfirm"
            />
            <EditPermissionDialog
                v-if="dialogs.editShow"
                v-model:visible="dialogs.editShow"
                :ids="dialogs.selectIds"
                :permission-list="dialogs.permissList"
                :parent-id="parentId"
                :all-permission="tableData.permissionList"
                asset-type="product"
                :defaultPermission="tableData.defaultPermission"
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
    getBindingsPermission,
} from '@/api/system/department';
import { intersection } from 'lodash-es';

import type { dictType } from '../typing.d.ts';
import { message } from 'jetlinks-ui-components';

const permission = 'system/Department';

const emits = defineEmits(['openDeviceBind']);
const props = defineProps<{
    parentId: string;
}>();

const columns = [
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
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '资产权限',
        dataIndex: 'permission',
        key: 'permission',
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        width: '80px',
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
        scopedSlots: true,
    },

    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 100,
        scopedSlots: true,
    },
];
const queryParams = ref({});

const tableRef = ref();
const tableData = reactive({
    _selectedRowKeys: [] as string[],
    selectedRows: [] as any[],
    permissionList: [] as any[],
    defaultPermission: [] as string[]
});
const table = {
    init: () => {
        table.getPermissionDict();
        watch(
            () => props.parentId,
            () => {
                table.refresh();
            },
        );
    },

    getActions: (
        data: Partial<Record<string, any>>,
        type: 'card' | 'table',
    ) => {
        if (!data) return [];
        else
            return [
                {
                    permission: `${permission}:assert`,
                    key: 'edit',
                    tooltip: { title: '编辑' },
                    icon: 'EditOutlined',
                    onClick: () => table.clickEdit(data),
                },
                {
                    permission: `${permission}:bind`,
                    key: 'unbind',
                    tooltip: { title: '解除绑定' },
                    popConfirm: {
                        title: `是否解除绑定`,
                        onConfirm: () => table.clickUnBind(data),
                    },
                    icon: 'DisconnectOutlined',
                },
            ];
    },

    // 获取权限数据字典
    getPermissionDict: () => {
        getPermissionDict_api().then((resp: any) => {
            tableData.permissionList = resp.result;
        });
    },
    // 获取权限名称
    getPermissLabel: (values: string[]) => {
        const permissionList = tableData.permissionList;
        if (permissionList.length < 1 || values.length < 1) return '';
        const result = values.map(
            (key) => permissionList.find((item: any) => item.id === key)?.name,
        );
        return result.join(',');
    },
    // 选中
    onSelectChange: (row: any) => {
        const index = tableData._selectedRowKeys.indexOf(row.id);

        if (index === -1) {
            tableData._selectedRowKeys.push(row.id);
            tableData.selectedRows.push(row);
        } else {
            tableData._selectedRowKeys.splice(index, 1);
            tableData.selectedRows.splice(index, 1);
        }
    },
    // 取消全选
    cancelSelect: () => {
        // console.log(1111);
        tableData._selectedRowKeys = [];
        tableData.selectedRows = [];
    },
    onSelect: (record: any, selected: boolean) => {
        const arr = [...tableData._selectedRowKeys]
        const _index = arr.findIndex(item => item === record?.id)
        if (selected) {
            if (!(_index > -1)) {
                tableData._selectedRowKeys.push(record.id)
                tableData.selectedRows.push(record)
            }
        } else {
            if (_index > -1) { // 去掉数据
                tableData._selectedRowKeys.splice(_index, 1)
                tableData.selectedRows.splice(_index, 1)
            }
        }
    },
    onSelectAll: (selected: boolean, _: any[], changeRows: any) => {
        if (selected) {
            changeRows.map((i: any) => {
                if (!tableData._selectedRowKeys.includes(i.id)) {
                    tableData._selectedRowKeys.push(i.id)
                    tableData.selectedRows.push(i)
                }
            })
        } else {
            const arr = changeRows.map((item: any) => item.id)
            const _arr: string[] = [];
            const _ids: string[] = [];
            [...tableData.selectedRows].map((i: any) => {
                if (!arr.includes(i?.id)) {
                    _arr.push(i)
                    _ids.push(i.id)
                }
            })
            tableData._selectedRowKeys = _ids
            tableData.selectedRows = _arr
        }
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
    queryPermissionList: async (ids: string[]) => {
        const resp: any = await getBindingsPermission('product', ids)
        if(resp.status === 200){
            const arr = resp.result.map((item: any) => {
                return item?.permissionInfoList?.map((i: any) => i?.id)
            })
            return intersection(...arr)
        }
        return []
    },
    clickEdit: async (row?: any) => {
        const ids = row ? [row.id] : [...tableData._selectedRowKeys];
        if (ids.length < 1) return message.warning('请勾选需要编辑的数据');
        tableData.defaultPermission = row ? row?.permission : intersection(...tableData.selectedRows.map(
            (item) => item.permission,
        )) as string[]
        const _result = await table.queryPermissionList(ids)
        dialogs.selectIds = ids;
        dialogs.permissList = _result as string[];
        dialogs.editShow = true;
    },
    clickUnBind: (row?: any) => {
        const ids = row ? [row.id] : [...tableData._selectedRowKeys];
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
            tableData._selectedRowKeys = [];
            message.success('操作成功');
            table.refresh();
        });
    },
    refresh: () => {
        nextTick(() => {
            tableRef.value.reload();
            table.cancelSelect()
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

watch(
    () => props.parentId,
    () => {
        tableData._selectedRowKeys = [];
        tableData.selectedRows = [];
    },
);

watch(
    () => dialogs.addShow,
    (val: boolean) => {
        if (!val) tableData.selectedRows = [];
    },
);
</script>

<style lang="less" scoped>
.product-container {
    :deep(.ant-table-tbody) {
        .ant-table-cell {
            .ant-space-item {
                .ant-btn-link {
                    padding: 0;
                }
            }
        }
    }
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
