<template>
    <j-modal class="add-device-or-product-dialog-container" title="绑定" width="1440px" :maskClosable="false" @ok="confirm"
        :confirmLoading="loading" @cancel="cancel" visible>
        <h5 class="row">
            <AIcon type="ExclamationCircleOutlined" style="margin-right: 6px" />
            只能分配有“共享”权限的资产数据
        </h5>

        <div style="display: flex; margin-left: 24px;">
                <div class="row">
                <span style="margin-right: 8px">批量配置</span>
                <j-switch v-model:checked="bulkBool" checked-children="开" un-checked-children="关" style="width: 56px" />
            </div>
            <div v-show="bulkBool" style="margin-left: 30px;">
                <j-checkbox-group v-model:value="bulkList" :options="options" />
            </div>
        </div>

        <!-- <pro-search
            type="simple"
            :columns="searchColumns"
            target="category-bind-modal"
            @search="search"
        /> -->
        <j-pro-table
            ref="tableRef"
            :request="table.requestFun"
            :gridColumn="2"
            :params="queryParams"
            :rowSelection="{
                selectedRowKeys: table._selectedRowKeys.value,
                onSelect: table.onSelectChange,
                onSelectNone: table.cancelSelect,
                onSelectAll: selectAll
            }"
            :columns="columns"
            style="max-height: 500px; overflow:auto"
        >
            <template #headerTitle>
                <pro-search
                    type="simple"
                    :columns="searchColumns"
                    target="category-bind-modal"
                    @search="search"
                    style="width: 75%;"
                />
            </template>
            <template #card="slotProps">
                <CardBox :value="slotProps" :actions="[{ key: 1 }]" v-bind="slotProps" :active="table._selectedRowKeys.value.includes(slotProps.id)
                    " @click="table.onSelectChange" :status="slotProps.state?.value"
                    :statusText="slotProps.state?.text" :statusNames="{
                        online: 'processing',
                        offline: 'error',
                        notActive: 'warning',
                    }">
                    <template #img>
                        <slot name="img">
                            <img :src="getImage('/device-product.png')" style="cursor: pointer" />
                        </slot>
                    </template>
                    <template #content>
                        <h3 class="card-item-content-title" style='margin-bottom: 18px;'>
                            <Ellipsis style="width: calc(100% - 100px);">
                                {{ slotProps.name }}
                            </Ellipsis>
                        </h3>
                        <j-row>
                            <j-col :span="12">
                                <div class="card-item-content-text">ID</div>
                                <div style="cursor: pointer" class="card-item-content-value">
                                    {{ slotProps.id }}
                                </div>
                            </j-col>
                            <j-col :span="12">
                                <div class="card-item-content-text">
                                    资产权限
                                </div>
                                <div style="cursor: pointer" class="card-item-content-value"
                                    @click="(e) => e.stopPropagation()">
                                    <j-checkbox-group v-model:value="slotProps.selectPermissions
                                        " :options="slotProps.permissionList" />
                                </div>
                            </j-col>
                        </j-row>
                    </template>
                </CardBox>
            </template>

            <template #permission="slotProps">
                <div style="cursor: pointer" class="card-item-content-value" @click="(e) => e.stopPropagation()">
                    <j-checkbox-group v-model:value="slotProps.selectPermissions" :options="slotProps.permissionList" />
                </div>
            </template>
            <template #state="slotProps">
                <BadgeStatus :status="slotProps.state.value" :text="slotProps.state.text" :statusNames="{
                    online: 'processing',
                    offline: 'error',
                    notActive: 'warning',
                }"></BadgeStatus>
            </template>
            <template #registryTime="slotProps">
                <span>{{
                    dayjs(slotProps.registryTime).format('YYYY-MM-DD YY:mm:ss')
                }}</span>
            </template>
        </j-pro-table>
    </j-modal>
</template>

<script setup lang="ts">
import { getImage, onlyMessage } from '@/utils/comm';
import { uniq, intersection } from 'lodash-es';
import {
    getDeviceOrProductList_api,
    getDeviceList_api,
    getPermission_api,
    bindDeviceOrProductList_api,
    getBindingsPermission,
} from '@/api/system/department';
import { dictType } from '../typing';
import { useDepartmentStore } from '@/store/department';
import dayjs from 'dayjs';

const departmentStore = useDepartmentStore();

const emits = defineEmits(['confirm', 'update:visible','next']);
const props = defineProps<{
    visible: boolean;
    queryColumns: any[];
    parentId: string;
    allPermission: dictType;
    assetType: 'product' | 'device';
}>();
// 弹窗相关
const loading = ref(false);
// 资产咨询次数, 产品分配后自动进入的设备资产, 第一次需要带上产品id查询
const queryCount = ref(0);

const confirm = () => {
    if (table.selectedRows.length < 1) {
        return onlyMessage('请先勾选数据', 'warning');
    }

    const params = table.selectedRows.map((item: any) => ({
        targetType: 'org',
        targetId: props.parentId,
        assetType: props.assetType,
        assetIdList: [item.id],
        // 保存时, 过滤没有的权限
        permission: item.selectPermissions.filter((f: any) =>
            item.permissionList.map((m: any) => m.value).includes(f),
        ),
    }));

    // 分配产品资产后, 进入设备资产分配
    // departmentStore.setProductId(table.selectedRows.map((item: any) => item.id));

    loading.value = true;
    bindDeviceOrProductList_api(props.assetType, params)
        .then(() => {
            onlyMessage('操作成功');
            emits('confirm');
            emits('next',table.selectedRows.map((item: any) => item.id))
            if(props.assetType === 'device'){
                departmentStore.setProductId(undefined)
            }
            emits('update:visible', false);
        })
        .finally(() => {
            loading.value = false;
        });
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

const columns = props.queryColumns.filter(
    (item) => item.dataIndex !== 'action',
);

const searchColumns = computed(() => {
    return props.queryColumns.map(item => {
        if (departmentStore.productId) {    
            if (item.dataIndex === 'productName') {
                item.search.first = true
                item.search.componentProps = {
                    mode: 'multiple',
                    "max-tag-count": "responsive"
                }
                item.search.defaultTermType = 'eq'
                item.search.defaultOnceValue = departmentStore.productId

            } else if (item.search && 'first' in item.search) {
                delete item.search.first
            }
         }
        else{
            if (item.dataIndex === 'productName'){
                item.search.defaultOnceValue = ''
            }
        }
        return item
    })
})

const queryParams = ref({});
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
                        // fix: bug#10756
                        item.selectPermissions = n[1];
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
                if (!nValue.length) {
                    // 列表取消全部选择
                    table.tableData.forEach((item: any) => {
                        item.selectPermissions = ['read'];
                    });
                }
            },
            { deep: true },
        );
    },
    // 选中
    onSelectChange: (row: any) => {
        // 若该项的可选权限中没有分享权限，则不支持任何操作
        if (!row.permissionList.find((item: any) => item.value === 'share')) {
            onlyMessage('该资产不支持共享', 'warning');
            return;
        }
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
        table._selectedRowKeys.value = selectedRowKeys
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
            const api =
                props.assetType === 'product'
                    ? getDeviceOrProductList_api
                    : getDeviceList_api;
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
                // 资产权限排序: 查看/编辑/删除/共享
                const idxMap = {
                    read: 0,
                    save: 1,
                    delete: 2,
                    share: 3,
                };
                // fix: bug#10706
                getBindingsPermission(props.assetType, ids).then(
                    (perResp: any) => {
                        data.forEach((item) => {
                            item.permissionList = perResp.result
                                .find((f: any) => f?.assetId === item.id)
                                ?.permissionInfoList?.map((m: any) => ({
                                    label: m.name,
                                    value: m.id,
                                    disabled: true,
                                }));
                            item.selectPermissions = ['read'];
                            // 资产排序
                            item.permissionList = item.permissionList
                                ?.map((m: any) => {
                                    return {
                                        ...m,
                                        idx: idxMap[m.value],
                                    };
                                })
                                ?.sort((a: any, b: any) => a.idx - b.idx);
                            // 产品的状态进行转换处理
                            if (props.assetType === 'product') {
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
                            }
                        });
                        resolve({
                            code: 200,
                            result: {
                                data: data.sort(
                                    (a, b) =>  b.createTime - a.createTime
                                ),
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
        queryCount.value += 1;
        if (props.parentId) {
            let terms = [{
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
                type: 'and'
            }]

            // if (
            //     props.assetType !== 'device' ||
            //     !departmentStore.productId ||
            //     queryCount.value > 1 ||
            //     departmentStore.optType === 'handle'
            // ) {
            //     // 非设备|产品id不存在|有其他查询操作(queryCount+1)|设备页面手动点击资产分配, 均删除产品带入的id
            //     terms[0].terms.pop();
            // }
            if (oParams.terms && oParams.terms.length > 0) {
                terms = [...oParams.terms, ...terms]
            }

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
// const selectRow = (rows: any[], check: boolean) => {
//     const okRows = rows.filter(
//         (item) =>
//             !!item.permissionList.find(
//                 (permiss: any) => permiss.value === 'share',
//             ),
//     );
//     table.selectedRows = okRows;
//     table._selectedRowKeys.value = okRows.map((item) => item.id);
// };
// fix: bug#10749
const selectChange = (record: any,selected: boolean,selectedRows: any,) => {
    const arr = new Set(table._selectedRowKeys.value);
    if(selected){
        arr.add(record.id)
    }else{
        arr.delete(record.id)
    }
    table._selectedRowKeys.value = [...arr.values()]
};

const selectAll = (selected: Boolean, selectedRows: any,changeRows:any) => {
    if (selected) {
            changeRows.map((i: any) => {
                if (!table._selectedRowKeys.value.includes(i.id)) {
                    table._selectedRowKeys.value.push(i.id)
                    table.selectedRows.push(i)
                }
            })
        } else {
            const arr = changeRows.map((item: any) => item.id)
            const _ids: string[] = [];
            const _row: any[] = [];
            table.selectedRows.map((i: any) => {
                if (!arr.includes(i.id)) {   
                    _ids.push(i.id)
                    _row.push(i)
                }
            })
            table._selectedRowKeys.value = _ids;
            table.selectedRows = _row;
        }     
}
const cancel = () => {
    departmentStore.setProductId(undefined)
    console.log(departmentStore.productId)
    emits('update:visible', false)
}

const search = (query: any) => {
    queryParams.value = query
}
// onUnmounted(()=>{
//     if(props.assetType ==='device'){
//         departmentStore.setProductId(undefined)
//     }
// })
</script>

<style lang="less" scoped>
.add-device-or-product-dialog-container {
    .ant-spin-nested-loading {
        height: calc(100vh - 400px);
        overflow-y: auto;
    }

    h5 {
        padding: 12px;
        padding-left: 24px;
        background-color: #f6f6f6;
        font-size: 14px;
    }

    .row {
        margin-bottom: 12px;
    }
}
:deep(.jtable-body-header-left){
    width: 80%;
}
</style>
