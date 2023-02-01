<template>
    <div class="button-mange-container">
        <JTable
            ref="tableRef"
            :columns="table.columns"
            model="TABLE"
            :dataSource="table.data"
        >
            <template #headerTitle>
                <a-button
                    type="primary"
                    style="margin-right: 10px"
                    @click="() => dialog.openDialog()"
                    ><plus-outlined />新增</a-button
                >
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip>
                        <template #title>编辑</template>
                        <a-button
                            style="padding: 0"
                            type="link"
                            @click="() => dialog.openDialog(slotProps)"
                        >
                            <edit-outlined />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip>
                        <template #title>查看</template>
                        <a-button
                            style="padding: 0"
                            type="link"
                            @click="() => dialog.openDialog(slotProps)"
                        >
                            <edit-outlined />
                        </a-button>
                    </a-tooltip>

                    <a-popconfirm
                        title="确认删除"
                        ok-text="确定"
                        cancel-text="取消"
                        :disabled="slotProps.status"
                    >
                        <a-tooltip>
                            <template #title>删除</template>
                            <a-button style="padding: 0" type="link">
                                <delete-outlined />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>
                </a-space>
            </template>
        </JTable>

        <div class="dialog">
            <ButtonAddDialog ref="dialogRef" @confirm="dialog.confirm" />
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons-vue';
import ButtonAddDialog from '../components/ButtonAddDialog.vue';

import { getMenuInfo_api } from '@/api/system/menu';

// 路由
const route = useRoute();
const routeParams = {
    id: route.params.id === ':id' ? '' : (route.params.id as string),
    ...route.query,
};

// 弹窗相关
const dialogRef = ref<any>(null);
const dialog = {
    // 打开弹窗
    openDialog: (row?: object) => {
        dialogRef.value && dialogRef.value.openDialog(row);
    },
    confirm: () => {},
};
// 表格相关
const table = reactive({
    columns: [
        {
            title: '编码',
            dataIndex: 'id',
            key: 'id',
            width: 220,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 300,
        },
        {
            title: '说明',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: true,
            width: 240,
        },
    ],
    data: [] as tableDataItem[],
    getList: () => {
        routeParams.id &&
            getMenuInfo_api(routeParams.id).then((resp: any) => {
                table.data = resp.result.buttons as tableDataItem[];
            });
    },
});
table.getList();
type tableDataItem = {
    id: string;
    name: string;
    description?: string;
    permissions: object[];
};
</script>

<style scoped></style>
