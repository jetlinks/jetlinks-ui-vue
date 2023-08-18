<template>
    <j-modal
        class="add-bind-user-dialog-container"
        title="绑定"
        width="1440px"
        visible
        centered
        :confirmLoading="loading"
        @ok="confirm"
        @cancel="cancel"
    >
        <pro-search
            type="simple"
            :columns="columns"
            target="category"
            @search="(params:any)=>queryParams = {...params}"
            style="margin-bottom: 0;"
        />
        <div class="table">
            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="table.requestFun"
                :params="queryParams"
                :rowSelection="{
                    selectedRowKeys: table._selectedRowKeys,
                    onSelect: table.onSelectChange,
                    onSelectNone:() => table._selectedRowKeys = [],
                    onSelectAll:selectAll
                }"
                model="TABLE"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                style="max-height: 510px; overflow: auto; padding-top: 0;"
            />
        </div>
    </j-modal>
</template>

<script setup lang="ts">
import { bindUser_api, getBindUserList_api } from '@/api/system/department';
import { useDepartmentStore } from '@/store/department';
import { onlyMessage } from '@/utils/comm';

const department = useDepartmentStore();

const emits = defineEmits(['confirm', 'update:visible']);

const props = defineProps<{
    parentId: string;
    visible: boolean;
}>();
// 弹窗相关
const loading = ref(false);
const confirm = () => {
    if (table._selectedRowKeys && props.parentId) {
        loading.value = true;
        bindUser_api(props.parentId,table._selectedRowKeys)
            .then(() => {
                onlyMessage('操作成功');
                emits('confirm');
                emits('update:visible', false);
                // table._selectedRowKeys = [];
                table._selectedRowKeys = []
            })
            .finally(() => (loading.value = false));
    } else {
        // emits('update:visible', false);
        onlyMessage('请选择要绑定的用户', 'warning');
    }
};

const cancel = () => {
    emits('update:visible', false);
    department.setSelectedKeys([]);
};

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];
const queryParams = ref({});
const table = reactive({
    _selectedRowKeys: [] as string[],

    requestFun: async (oParams: any) => {
        if (props.parentId) {
            const params = {
                ...oParams,
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: [
                    ...oParams.terms,
                    {
                        terms: [
                            {
                                column: 'id$in-dimension$org$not',
                                value: props.parentId,
                            },
                        ],
                    },
                ],
            };
            const resp: any = await getBindUserList_api(params);
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
    onSelectChange: (row: any[],selected:Boolean) => {
        // console.log('手动选择改变: ', keys);
        // table._selectedRowKeys = keys;
        // department.setSelectedKeys(keys, keys.length ? 'concat' : '');
        const arr = new Set(table._selectedRowKeys)
        if(selected){
            arr.add(row.id)
        }else{
            arr.delete(row.id)
        }
        table._selectedRowKeys = [...arr.values()];
    },
});
const selectAll = (selected: Boolean, selectedRows: any,changeRows:any) => {
    if (selected) {
            changeRows.map((i: any) => {
                if (!table._selectedRowKeys.includes(i.id)) {
                    table._selectedRowKeys.push(i.id)
                }
            })
        } else {
            const arr = changeRows.map((item: any) => item.id)
            const _ids: string[] = [];
            table._selectedRowKeys.map((i: any) => {
                if (!arr.includes(i)) {   
                    _ids.push(i)
                }
            })
            table._selectedRowKeys = _ids;
        }     
}

// watch(
//     () => department.crossPageKeys,
//     (val: string[]) => {
//         // console.log('crossPageKeys: ', val);
//         table._selectedRowKeys = val;
//     },
// );
</script>

<style lang="less" scoped>
:deep(.add-bind-user-dialog-container) {
    .table {
        height: 600px;
        overflow-y: auto;
    }
}
</style>
