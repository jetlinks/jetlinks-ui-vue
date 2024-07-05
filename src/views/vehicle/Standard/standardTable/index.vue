<template>
    <div class="container">
        <pro-search
            :columns="columns"
            @search="(params:any)=>queryParams = {...params}"
            style="margin-bottom: 0"
        />
        <FullPage :extraHeight="24">
            <j-pro-table
                ref="tableRef"
                :request="request"
                :scroll="{
                    y: 610,
                }"
                model="TABLE"
                :params="queryParams"
                :columns="columns"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            @click="table.clickAdd"
                        >
                            <AIcon type="PlusOutlined" />新增
                        </PermissionButton>
                    </j-space>
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <PermissionButton
                            v-for="i in table.getActions(slotProps, 'table')"
                            type="link"
                            :key="i.key"
                            :tooltip="i?.tooltip"
                            :pop-confirm="i.popConfirm"
                            @click="i.onClick"
                        >
                            <span>{{ i.title }}</span>
                        </PermissionButton>
                    </j-space>
                </template>
            </j-pro-table>
        </FullPage>

        <div class="dialogs">
            <SaveDialog
                ref="saveRef"
                :isAdd="isAdd"
                :title="title"
                @success="refresh"
            ></SaveDialog>
        </div>
    </div>
</template>

<script setup lang="ts" name="standardTable">
import PermissionButton from '@/components/PermissionButton/index.vue';
import SaveDialog from '../components/SaveDialog.vue';
import { getImage, onlyMessage } from '@/utils/comm';
import { intersection } from 'lodash-es';

const title = ref('添加');
const isAdd = ref<number>(0);
const saveRef = ref();

const props = defineProps<{
    parentId: string;
}>();

/**
 * 刷新数据
 */
const refresh = () => {
    tableRef.value?.reload();
};

const request = (params: Record<string, any>) => {
    const data = [
        {
            id: '1111',
            name: '测试数据1',
            describe: '测试数据1',
        },
        {
            id: '2222',
            name: '测试数据2',
            describe: '测试数据2',
        },
        {
            id: '3333',
            name: '测试数据3',
            describe: '测试数据3',
        },
    ];
    return new Promise((resolve) => {
        resolve({
            code: 200,
            result: {
                pageIndex: params?.pageIndex || 0,
                pageSize: params?.pageSize || 12,
                total: data.length || 0,
                data: data,
            },
            status: 200,
        });
    });
};

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '标识',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 100,
        scopedSlots: true,
    },
];
const queryParams = ref({});
const currentForm = ref({});

const tableRef = ref();
const tableData = reactive({
    _selectedRowKeys: [] as string[],
    selectedRows: [] as any[],
    permissionList: [] as any[],
    defaultPermission: [] as string[],
});
const table = {
    init: () => {
        watch(
            () => props.parentId,
            () => {
                refresh();
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
                    key: 'edit',
                    title: '编辑',
                    tooltip: { title: '编辑' },
                    icon: 'EditOutlined',
                    onClick: () => table.clickEdit(data),
                },
                {
                    key: 'unbind',
                    title: '删除',
                    tooltip: { title: '删除' },
                    popConfirm: {
                        title: `是否删除`,
                        onConfirm: () => table.clickDelete(data),
                    },
                    icon: 'DeleteOutlined',
                },
            ];
    },
    clickAdd: async () => {
        isAdd.value = 1;
        title.value = '新增';
        nextTick(() => {
            saveRef.value.show(currentForm.value);
        });
    },

    clickEdit: async (row?: any) => {
        isAdd.value = 2;
        title.value = '编辑';
        nextTick(() => {
            saveRef.value.show(row);
        });
    },
    clickDelete: (row?: any) => {
        const id = row.id;
        console.log('删除成功', id);
    },
};

table.init();
watch(
    () => props.parentId,
    () => {
        tableData._selectedRowKeys = [];
        tableData.selectedRows = [];
    },
);
</script>

<style lang="less" scoped>
.container {
    :deep(.ant-table td) {
        white-space: nowrap;
    }
    :deep(.ant-table-tbody) {
        .ant-table-cell {
            .ant-space-item {
                .ant-btn-link {
                    padding: 0;
                }
            }
        }
    }
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
