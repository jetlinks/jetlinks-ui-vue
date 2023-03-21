<template>
    <j-modal
        class="add-bind-user-dialog-container"
        title="绑定"
        width="1440px"
        visible
        centered
        :confirmLoading="loading"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
    >
        <pro-search
            :columns="columns"
            target="category"
            @search="(params:any)=>queryParams = {...params}"
        />
        <div class="table">
            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="table.requestFun"
                :params="queryParams"
                :rowSelection="{
                    selectedRowKeys: table._selectedRowKeys,
                    onChange: table.onSelectChange,
                }"
                @cancelSelect="table.cancelSelect"
                model="TABLE"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
            />
        </div>
    </j-modal>
</template>

<script setup lang="ts">
import { bindUser_api, getBindUserList_api } from '@/api/system/department';
import { message } from 'jetlinks-ui-components';

const emits = defineEmits(['confirm', 'update:visible']);

const props = defineProps<{
    parentId: string;
    visible: boolean;
}>();
// 弹窗相关
const loading = ref(false);
const confirm = () => {
    if (table._selectedRowKeys.length && props.parentId) {
        loading.value = true;
        bindUser_api(props.parentId, table._selectedRowKeys)
            .then(() => {
                message.success('操作成功');
                emits('confirm');
                emits('update:visible', false);
            })
            .finally(() => (loading.value = false));
    } else {
        emits('update:visible', false);
    }
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
        table.cancelSelect();
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
    onSelectChange: (keys: string[]) => {
        table._selectedRowKeys = keys;
    },
    cancelSelect: () => {
        table._selectedRowKeys = [];
    },
});
</script>

<style lang="less" scoped>
:deep(.add-bind-user-dialog-container) {
    .table {
        height: 600px;
        overflow-y: auto;
    }
}
</style>
