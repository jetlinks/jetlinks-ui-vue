<template>
    <div class="product-container">
        <pro-search
            :columns="columns"
            target="category-device"
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
                    // selectedRowKeys: table._selectedRowKeys.value,
                    // onChange:(keys:string[])=>table._selectedRowKeys.value = [...keys],
                    // onSelectNone: table.cancelSelect
                    selectedRowKeys: table._selectedRowKeys.value,
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
                            @click="table.clickAdd('handle')"
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
                                            @click="table.clickEdit()"
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
                        :actions="[{ key: 1 }]"
                        v-bind="slotProps"
                        :active="
                            table._selectedRowKeys.value.includes(slotProps.id)
                        "
                        @click="table.onSelectChange"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            online: 'processing',
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
                                :hasPermission="`${permission}:assert`"
                                @click="table.clickEdit(slotProps)"
                            >
                                <AIcon type="EditOutlined" />
                            </PermissionButton>

                            <PermissionButton
                                :hasPermission="`${permission}:bind`"
                                :popConfirm="{
                                    title: `是否解除绑定`,
                                    onConfirm: () =>
                                        table.clickUnBind(slotProps),
                                }"
                            >
                                <AIcon type="DisconnectOutlined" />
                            </PermissionButton>
                        </template>
                    </CardBox>
                </template>

                <template #permission="slotProps">
                    {{
                        table.permissionList.value.length &&
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
                            notActive: 'warning',
                        }"
                    ></BadgeStatus>
                </template>
                <template #registryTime="slotProps">
                    <span>{{
                        dayjs(slotProps.registryTime).format(
                            'YYYY-MM-DD YY:mm:ss',
                        )
                    }}</span>
                </template>
                <template #action="slotProps">
                    <j-space>
                        <PermissionButton
                            v-for="i in table.getActions(slotProps, 'table')"
                            :hasPermission="i.permission"
                            type="link"
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
                :parent-id="props.parentId"
                :all-permission="table.permissionList.value"
                asset-type="device"
                @confirm="table.refresh"
            />
            <EditPermissionDialog
                v-if="dialogs.editShow"
                v-model:visible="dialogs.editShow"
                :ids="dialogs.selectIds"
                :permission-list="dialogs.permissList"
                :parent-id="props.parentId"
                :all-permission="table.permissionList.value"
                asset-type="device"
                :defaultPermission="table.defaultPermission"
                @confirm="table.refresh"
            />
        </div>
    </div>
</template>

<script setup lang="ts" name="device">
import PermissionButton from '@/components/PermissionButton/index.vue';

import AddDeviceOrProductDialog from '../components/AddDeviceOrProductDialog.vue';
import EditPermissionDialog from '../components/EditPermissionDialog.vue';
import { getImage } from '@/utils/comm';
import {
    getDeviceList_api,
    getPermission_api,
    getPermissionDict_api,
    unBindDeviceOrProduct_api,
    getDeviceProduct_api,
    getBindingsPermission,
} from '@/api/system/department';
import { intersection } from 'lodash-es';

import type { dictType, optionsType } from '../typing';
import { message } from 'jetlinks-ui-components';
import { useDepartmentStore } from '@/store/department';
import dayjs from 'dayjs';

const departmentStore = useDepartmentStore();

const permission = 'system/Department';

const emits = defineEmits(['update:bindBool']);
const props = defineProps<{
    parentId: string;
    bindBool: boolean;
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
        title: '所属产品',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        search: {
            rename: 'productId$product-info',
            type: 'select',
            handleValue(value: string) {
                return value && value.length ? [{
                    column: 'id',
                    termType: 'in',
                    value: `${value.toString()}`
                }] : undefined;
            },
            options: () =>
                new Promise((resolve) => {
                    const params = {
                        paging: false,
                        'sorts[0].name': 'createTime',
                        'sorts[0].order': 'desc',
                    };
                    getDeviceProduct_api(params).then((resp: any) => {
                        const result = resp.result.map((item: any) => ({
                            label: item.name,
                            value: item.id,
                        }));
                        resolve(result);
                    });
                }),
        },
    },
    {
        title: '资产权限',
        dataIndex: 'permission',
        key: 'permission',
        ellipsis: true,
        scopedSlots: true,
        width: 300,
    },
    {
        title: '注册时间',
        dataIndex: 'registryTime',
        key: 'registryTime',
        ellipsis: true,
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'notActive' },
                { label: '离线', value: 'offline' },
                { label: '在线', value: 'online' },
            ],
        },
        scopedSlots: true,
    },

    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 150,
        scopedSlots: true,
    },
];
const queryParams = ref({});

const tableRef = ref();
const table = {
    _selectedRowKeys: ref<string[]>([]),
    selectedRows: [] as any[],
    permissionList: ref<dictType>([]),
    defaultPermission: [] as string[],

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
    onSelect: (record: any, selected: boolean) => {
        const arr = [...table._selectedRowKeys.value]
        const _index = arr.findIndex(item => item === record?.id)
        if (selected) {
            if (!(_index > -1)) {
                table._selectedRowKeys.value.push(record.id)
                table.selectedRows.push(record)
            }
        } else {
            if (_index > -1) { // 去掉数据
                table._selectedRowKeys.value.splice(_index, 1)
                table.selectedRows.splice(_index, 1)
            }
        }
    },
    onSelectAll: (selected: boolean, _: any[], changeRows: any) => {
        if (selected) {
            changeRows.map((i: any) => {
                if (!table._selectedRowKeys.value.includes(i.id)) {
                    table._selectedRowKeys.value.push(i.id)
                    table.selectedRows.push(i)
                }
            })
        } else {
            const arr = changeRows.map((item: any) => item.id)
            const _arr: string[] = [];
            const _ids: string[] = [];
            [...table.selectedRows].map((i: any) => {
                if (!arr.includes(i?.id)) {
                    _arr.push(i)
                    _ids.push(i.id)
                }
            })
            table._selectedRowKeys.value = _ids
            table.selectedRows = _arr
        }
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
                getPermission_api('device', ids, parentId).then(
                    (perResp: any) => {
                        const permissionObj = {};
                        perResp.result.forEach((item: any) => {
                            permissionObj[item.assetId] =
                                item.grantedPermissions;
                        });
                        data.forEach(
                            (item) =>
                                (item.permission = permissionObj[item.id]),
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
    clickAdd: (type?: string) => {
        // 设备资产分配弹窗操作类型: type = 'handle': 手动点击资产分配按钮, !type产品资产分配后, 自动弹出设备资产分配
        departmentStore.setType(type);
        dialogs.addShow = true;
    },
    queryPermissionList: async (ids: string[]) => {
        const resp: any = await getBindingsPermission('device', ids)
        if(resp.status === 200){
            const arr = resp.result.map((item: any) => {
                return item?.permissionInfoList?.map((i: any) => i?.id)
            })
            return intersection(...arr)
        }
        return []
    },
    clickEdit: async (row?: any) => {
        const ids = row ? [row.id] : [...table._selectedRowKeys.value];
        if (ids.length < 1) return message.warning('请勾选需要编辑的数据');

        table.defaultPermission = row ? row?.permission : intersection(...table.selectedRows.map(
            (item) => item.permission,
        )) as string[]

        const _result = await table.queryPermissionList(ids)
        dialogs.selectIds = ids;
        dialogs.permissList = _result as string[];
        dialogs.editShow = true;
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
            table.cancelSelect()
        });
    },
};

const dialogs = reactive({
    selectIds: [] as string[],
    permissList: [] as string[],
    addShow: false,
    editShow: false,
});

table.init();
watchEffect(() => {
    props.bindBool && table.clickAdd();
    emits('update:bindBool', false);
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
