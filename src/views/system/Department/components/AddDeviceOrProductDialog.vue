<template>
    <a-modal
        class="add-device-or-product-dialog-container"
        title="绑定"
        width="1440px"
        @ok="dialog.handleOk"
        cancelText="取消"
        okText="确定"
        v-model:visible="dialog.visible.value"
    >
        <a-row>
            <exclamation-circle-outlined /> 只能分配有“共享”权限的资产数据
        </a-row>

        <a-row>
            <span>批量配置</span>
            <a-switch v-model:checked="bulkBool" />
        </a-row>
        <a-row v-show="bulkBool">
            <a-checkbox-group v-model:value="bulkList" :options="options" />
        </a-row>

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
                                        table.getPermissLabel(
                                            slotProps.permission,
                                        )
                                    }}
                                </div>
                            </a-col>
                        </a-row>
                    </template>
                </CardBox>
            </template>
        </JTable>
    </a-modal>
</template>

<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { getImage } from '@/utils/comm';
import {
    getDeviceOrProductList_api,
    getPermission_api,
} from '@/api/system/department';
const props = defineProps<{
    parentId: string;
    allPermission: dictType;
    assetType: 'product' | 'device';
}>();
// 弹窗相关
const dialog = {
    visible: ref<boolean>(false),
    handleOk: () => {
        // formRef.value?.validate().then(() => {
        //     form.submit();
        // });
        dialog.changeVisible();
    },
    // 控制弹窗的打开与关闭
    changeVisible: () => {
        dialog.visible.value = !dialog.visible.value;
    },
};

const bulkBool = ref<boolean>(true);
const bulkList = ref<string[]>(['read']);
const options = computed(() =>
    props.allPermission.map((item) => ({
        label: item.name,
        value: item.id,
        disabled: item.id === 'read',
    })),
);

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
const table = {
    _selectedRowKeys: ref<string[]>([]),
    selectedRows: [] as any[],

    // 获取权限名称
    getPermissLabel: (values: string[]) => {
        const permissionList = props.allPermission;
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
            getDeviceOrProductList_api(params).then((resp: any) => {
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
                        permissionObj[item.assetId] =
                            props.allPermission.filter((permission) =>
                                item.allPermissions.includes(
                                    (permissionId: string) =>
                                        permissionId === permission.id,
                                ),
                            );
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
            const terms = [
                {
                    terms: [
                        {
                            column: 'id',
                            termType: 'dim-assets$not',
                            value: {
                                assetType: props.assetType,
                                targets: [
                                    {
                                        type: 'org',
                                        id: props.parentId,
                                    },
                                ],
                            },
                        },
                    ],
                },
            ];
            if (oParams.terms && oParams.terms.length > 0)
                terms.unshift({ terms: oParams.terms });
            const params = {
                ...oParams,
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms,
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
};

// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});
</script>

<style lang="less" scoped>
.add-device-or-product-dialog-container {
    .ant-spin-nested-loading {
        height: calc(100vh - 440px);
        overflow-y: auto;
    }
}
</style>
