<template>
    <a-modal
        class="add-bind-user-dialog-container"
        title="绑定"
        width="1440px"
        @ok="dialog.handleOk"
        centered
        :confirmLoading="dialog.loading.value"
        cancelText="取消"
        okText="确定"
        v-model:visible="dialog.visible.value"
    >
        <Search :columns="query.columns" @search="query.search" />
        <div class="table">
            <JTable
                ref="tableRef"
                :columns="table.columns"
                :request="table.requestFun"
                :params="query.params"
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
    </a-modal>
</template>

<script setup lang="ts">
import { bindUser_api, getBindUserList_api } from '@/api/system/department';
import { message } from 'ant-design-vue';

const emits = defineEmits(['confirm']);

const props = defineProps({
    parentId: String,
});
// 弹窗相关
const dialog = {
    loading: ref<boolean>(false),
    visible: ref<boolean>(false),
    handleOk: () => {
        if (table._selectedRowKeys.length && props.parentId) {
            bindUser_api(props.parentId, table._selectedRowKeys).then(() => {
                emits('confirm');
                message.success('操作成功');
                dialog.changeVisible();
            });
        } else {
            dialog.changeVisible();
        }
    },
    // 控制弹窗的打开与关闭
    changeVisible: () => {
        if (!dialog.visible.value) query.search({});
        dialog.visible.value = !dialog.visible.value;
    },
};
// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});

const query = {
    columns: [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
    ],
    params: ref({}),
    search: (params: any) => {
        query.params.value = params;
    },
};
const table = reactive({
    columns: [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
    ],
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
