<template>
    <a-modal
        v-model:visible="dialog.visible"
        title="新增"
        width="1000px"
        @ok="dialog.handleOk"
    >
        <Search :columns="query.columns" type="simple" />

        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="getUserByRole_api"
            model="TABLE"
            :params="query.params"
            :rowSelection="{
                selectedRowKeys: table._selectedRowKeys,
                onChange: table.onSelectChange,
            }"
            @cancelSelect="table.cancelSelect"
        >
        </JTable>

        <template #footer>
            <a-button key="back" @click="dialog.visible = false">取消</a-button>
            <a-button key="submit" type="primary" @click="dialog.handleOk"
                >确定</a-button
            >
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { getUserByRole_api, bindUser_api } from '@/api/system/role';
import { message } from 'ant-design-vue';
const route = useRoute();

const emits = defineEmits(['refresh']);
const props = defineProps({
    open: Number,
});

const query = reactive({
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
    params: {
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            {
                terms: [
                    {
                        column: 'id$in-dimension$role$not',
                        value: route.params.id,
                    },
                ],
            },
        ],
    },
});
const tableRef = ref<Record<string, any>>({});
const table = reactive({
    _selectedRowKeys: [] as string[],
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
    tableData: [],
    onSelectChange: (keys: string[]) => {
        table._selectedRowKeys = [...keys];
    },
    cancelSelect: () => {
        table._selectedRowKeys = [];
    },
});

// 弹窗相关
const dialog = reactive({
    visible: false,
    handleOk: () => {
        if (table._selectedRowKeys.length < 1) {
            message.error('请至少选择一项');
        } else {
            bindUser_api(
                route.params.id as string,
                table._selectedRowKeys,
            ).then((resp) => {
                if (resp.status === 200) {
                    message.success('操作成功');
                    emits('refresh');
                    dialog.visible = false;
                }
            });
        }
    },
});

watch(
    () => props.open,
    () => {
        dialog.visible = true;
    },
);
</script>

<style scoped></style>
