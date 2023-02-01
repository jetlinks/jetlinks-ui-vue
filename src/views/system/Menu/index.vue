<template>
    <div class="menu-container">
        <Search :columns="query.columns" @search="query.search" />

        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="table.getList"
            model="TABLE"
            :params="query.params"
        >
            <template #headerTitle>
                <a-button
                    type="primary"
                    @click="table.toDetails({})"
                    style="margin-right: 10px"
                    ><plus-outlined />新增</a-button
                >
                <a-button>菜单实例</a-button>
            </template>
            <template #createTime="slotProps">
                {{ moment(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip>
                        <template #title>查看</template>
                        <a-button
                            style="padding: 0"
                            type="link"
                            @click="table.toDetails(slotProps)"
                        >
                        <search-outlined />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip>
                        <template #title>新增子菜单</template>
                        <a-button
                            style="padding: 0"
                            type="link"
                            @click="table.toDetails(slotProps)"
                        >
                        <plus-circle-outlined />
                        </a-button>
                    </a-tooltip>

                    <a-popconfirm
                        title="是否删除该菜单"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="table.clickDel(slotProps)"
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
    </div>
</template>

<script setup lang="ts">
import { getMenuTree_api } from '@/api/system/menu';
import {
    SearchOutlined,
    DeleteOutlined,
    PlusOutlined,
    PlusCircleOutlined
} from '@ant-design/icons-vue';
import moment from 'moment';

const router = useRouter();

// 筛选
const query = reactive({
    columns: [
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
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
            search: {
                type: 'string',
            },
        },
        {
            title: '页面地址',
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
            search: {
                type: 'string',
            },
        },
        {
            title: '排序',
            dataIndex: 'sortIndex',
            key: 'sortIndex',
            ellipsis: true,
            search: {
                type: 'number',
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            ellipsis: true,
            search: {
                type: 'date',
            },
        },
    ],
    params: {
        terms: [],
    },
    search: (params: any) => {
        query.params = params;
    },
});

const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = reactive({
    columns: [
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
            width: 300,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 220,
        },
        {
            title: '页面地址',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: '排序',
            dataIndex: 'sortIndex',
            key: 'sortIndex',
            width: 80,
        },
        {
            title: '说明',
            dataIndex: 'describe',
            key: 'describe',
            width: 200,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            scopedSlots: true,
            width: 180,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: true,
            width: 140,
        },
    ],
    tableData: [],
    total: 0,
    getList: async (_params: any) => {
        //过滤非集成的菜单
        const item = {
            terms: [
                {
                    terms: [
                        {
                            column: 'owner',
                            termType: 'eq',
                            value: 'iot',
                        },
                        {
                            column: 'owner',
                            termType: 'isnull',
                            value: '1',
                            type: 'or',
                        },
                    ],
                },
            ],
        };
        const params = {
            ..._params,
            terms:
                _params.terms && _params.length !== 0
                    ? [...query.params.terms, item]
                    : [item],
            sorts: [{ name: 'sortIndex', order: 'asc' }],
            paging: false,
        };
        const resp: any = await getMenuTree_api(params);
        const lastItem = resp.result[resp.result.length - 1];
        table.total = lastItem ? lastItem.sortIndex + 1 : 1;
        
        return {
            code: resp.message,
            result: {
                data: resp.result,
                pageIndex: 0,
                pageSize: 0,
                total: 0,
            },
            status: resp.status,
        };
    },
    // 跳转至详情页
    toDetails: (row: any) => {
        router.push(
            `/system/Menu/detail/${row.id || ':id'}?pid=${
                row.pid || ''
            }&basePath=${row.basePath || ''}&sortIndex=${table.total}`,
        );
    },
    // 删除
    clickDel: (row: any) => {
        // delPermission_api(row.id).then((resp: any) => {
        //     if (resp.status === 200) {
        //         tableRef.value?.reload();
        //         message.success('操作成功!');
        //     }
        // });
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
});
</script>

<style lang="less" scoped></style>
