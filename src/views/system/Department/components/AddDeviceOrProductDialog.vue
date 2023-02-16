<template>
    <a-modal
        class="add-device-or-product-dialog-container"
        title="绑定"
        width="1440px"
        @ok="dialog.handleOk"
        :confirmLoading="dialog.loading.value"
        cancelText="取消"
        okText="确定"
        v-model:visible="dialog.visible.value"
        destroyOnClose
    >
        <h5 class="row">
            <exclamation-circle-outlined style="margin-right: 6px" />
            只能分配有“共享”权限的资产数据
        </h5>

        <div class="row">
            <span style="margin-right: 8px">批量配置</span>
            <a-switch
                v-model:checked="bulkBool"
                checked-children="开"
                un-checked-children="关"
                style="width: 56px"
            />
        </div>
        <div v-show="bulkBool">
            <a-checkbox-group v-model:value="bulkList" :options="options" />
        </div>

        <Search :columns="props.queryColumns" @search="query.search" />

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
                                    @click="(e) => e.stopPropagation()"
                                >
                                    <a-checkbox-group
                                        v-model:value="
                                            slotProps.selectPermissions
                                        "
                                        :options="slotProps.permissionList"
                                    />
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
import { uniq, intersection } from 'lodash-es';
import {
    getDeviceOrProductList_api,getDeviceList_api,
    getPermission_api,
    bindDeviceOrProductList_api,
} from '@/api/system/department';
import { message } from 'ant-design-vue';

const emits = defineEmits(['confirm']);
const props = defineProps<{
    queryColumns: any[];
    parentId: string;
    allPermission: dictType;
    assetType: 'product' | 'device';
}>();
// 弹窗相关
const dialog = {
    visible: ref<boolean>(false),
    loading: ref<boolean>(false),
    handleOk: () => {
        if (table.selectedRows.length < 1) {
            return message.warning('请先勾选数据');
        }

        const params = table.selectedRows.map((item: any) => ({
            targetType: 'org',
            targetId: props.parentId,
            assetType: props.assetType,
            assetIdList: [item.id],
            permission: item.selectPermissions,
        }));

        dialog.loading.value = true;
        bindDeviceOrProductList_api(props.assetType, params)
            .then(() => {
                message.success('操作成功');
                emits('confirm');
                dialog.changeVisible();
            })
            .finally(() => {
                dialog.loading.value = false;
            });
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
const table: any = {
    _selectedRowKeys: ref<string[]>([]), // 选中项的id
    backRowKeys: [] as string[], // 旧选中项的id
    selectedRows: [] as any[], // 选中项
    tableData: [] as any[], // 列表的浅拷贝

    init: () => {
        watch(
            [bulkBool, bulkList, () => table._selectedRowKeys],
            (n) => {
                const nValue = n[2].value;
                const oValue = table.backRowKeys;

                table.selectedRows.forEach((item: any) => {
                    // 启用批量设置
                    if (bulkBool.value) {
                        // 将已勾选的权限和批量设置的权限进行合并，并与自己可选的权限进行比对，取交集作为当前选中的权限
                        let newPermission = uniq([
                            ...item.selectPermissions,
                            ...bulkList.value,
                        ]);
                        const allPermissions = item.permissionList.map(
                            (item: any) => item.value,
                        );
                        newPermission = intersection(
                            newPermission,
                            allPermissions,
                        );
                        item.selectPermissions = newPermission;
                        // 禁用单独勾选
                        item.permissionList.forEach((permission: any) => {
                            permission.disabled = true;
                        });
                    } else {
                        // 取消批量设置
                        // 放开自己权限的勾选限制，查看为必选
                        item.permissionList.forEach((permission: any) => {
                            permission.disabled = permission.value === 'read';
                        });
                    }
                });
                // 取消勾选时触发
                if (nValue && nValue.length < oValue.length) {
                    // 拿到取消选中的项的id
                    const removedKeys = oValue.filter(
                        (key: string) => !nValue.includes(key),
                    );
                    // 将取消勾选的项的权限重置
                    removedKeys.forEach((removedKey: string) => {
                        const removedItem = table.tableData.find(
                            (item: any) => item.id === removedKey,
                        );
                        removedItem.permissionList.forEach(
                            (permission: any) => (permission.disabled = true),
                        );
                        removedItem.selectPermissions = ['read'];
                    });
                }
            },
            { deep: true },
        );
    },
    // 选中
    onSelectChange: (row: any) => {
        // 若该项的可选权限中没有分享权限，则不支持任何操作
        if (!row.permissionList.find((item: any) => item.value === 'share'))
            return;
        const selectedRowKeys = table._selectedRowKeys.value;
        const index = selectedRowKeys.indexOf(row.id);

        table.backRowKeys = [...selectedRowKeys];
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
        table.backRowKeys = [...table._selectedRowKeys.value];
        table._selectedRowKeys.value = [];
        table.selectedRows = [];
    },
    // 获取并整理数据
    getData: (params: object, parentId: string) =>
        new Promise((resolve) => {
            const api = props.assetType === 'product' ? getDeviceOrProductList_api: getDeviceList_api;
            api(params).then((resp: any) => {
                type resultType = {
                    data: any[];
                    total: number;
                    pageSize: number;
                    pageIndex: number;
                };
                const { pageIndex, pageSize, total, data } =
                    resp.result as resultType;
                const ids = data.map((item) => item.id);
                getPermission_api(props.assetType,ids, parentId).then((perResp: any) => {
                    const permissionObj = {};
                    perResp.result.forEach((item: any) => {
                        permissionObj[item.assetId] = props.allPermission
                            .filter((permission) =>
                                item.allPermissions.includes(permission.id),
                            )
                            .map((item) => ({
                                label: item.name,
                                value: item.id,
                                disabled: true,
                            }));
                    });
                    data.forEach((item) => {
                        item.permissionList = permissionObj[item.id];
                        item.selectPermissions = ['read'];

                        // 产品的状态进行转换处理
                        if(props.assetType === 'product') {
                            item.state = {
                                value: item.state === 1 ? 'online': item.state === 0 ? 'offline': '',
                                text: item.state === 1 ? '正常': item.state === 0 ? '禁用': ''
                            }
                        }
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
            table.tableData = resp.result.data;
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
table.init();

// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});
</script>

<style lang="less" scoped>
.add-device-or-product-dialog-container {
    .ant-spin-nested-loading {
        height: calc(100vh - 400px);
        overflow-y: auto;
    }
    h5 {
        padding: 12px;
        background-color: #f6f6f6;
        font-size: 14px;
    }
    .row {
        margin-bottom: 12px;
    }
}
</style>
