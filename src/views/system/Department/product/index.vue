<template>
    <div class="product-container">
        <Search :columns="query.columns" @search="query.search" />
        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="table.requestFun"
            :gridColumn="2"
            model="CARD"
            :params="query.params.value"
            :rowSelection="{
                selectedRowKeys: table._selectedRowKeys,
                onChange: table.onSelectChange,
            }"
        >
            <template #headerTitle>
                <a-space>
                    <a-button type="primary" @click="table.clickAdd">
                        新增
                    </a-button>
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
                            <img :src="getImage('/device-product.png')" />
                        </slot>
                    </template>
                    <template #content>
                        <h3 class="card-item-content-title">
                            {{ slotProps.name }}
                        </h3>
                        <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">ID</div>
                                <div>{{ slotProps.deviceType?.text }}</div>
                            </a-col>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    资产权限
                                </div>
                                <div>
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
                        <a-button @click="table.clickEdit(slotProps)">
                            <AIcon type="EditOutlined" />
                        </a-button>
                        <a-popconfirm
                            title="是否解除绑定"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="table.clickUnBind"
                            ><a-button>
                                <AIcon type="DisconnectOutlined" />
                            </a-button>
                        </a-popconfirm>
                    </template>
                </CardBox>
            </template>
        </JTable>
    </div>
</template>

<script setup lang="ts" name="product">
import { ActionsType } from '@/components/Table';
import { getImage } from '@/utils/comm';

import {
    getDeviceOrProductList_api,
    getPermission_api,
    getPermissionDict_api,
} from '@/api/system/department';

const props = defineProps({
    parentId: String,
});
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
    columns: [],
    _selectedRowKeys: ref<string[]>([]),
    permissionList: ref<dictType>([]),

    init: () => {
        table.getPermissionDict();
        watch(
            () => props.parentId,
            () => {
                nextTick(() => {
                    tableRef.value.reload();
                });
            },
        );
    },

    getPermissionDict: () => {
        getPermissionDict_api().then((resp: any) => {
            table.permissionList.value = resp.result;
        });
    },
    getPermissLabel: (values: string[]) => {
        const permissionList = table.permissionList.value;
        if (permissionList.length < 1 || values.length < 1) return '';
        const result = values.map(
            (key) => permissionList.find((item) => item.id === key)?.name,
        );
        return result.join(',');
    },
    onSelectChange: (keys: string[]) => {
        table._selectedRowKeys.value = [...keys];
    },
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
                getPermission_api(ids, parentId).then((perResp: any) => {
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
            console.log(resp.result);

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
    clickAdd: () => {},
    clickEdit: (row: any) => {},
    clickUnBind: (row: any) => {},
};

table.init();

type dictType = {
    id: string;
    name: string;
}[];
</script>

<style scoped></style>
