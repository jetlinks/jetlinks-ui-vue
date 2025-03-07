<template>
    <page-container>
        <div class="menu-container">
            <pro-search
                :columns="columns"
                target="system-menu"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="table.getList"
                    model="TABLE"
                    :params="queryParams"
                    noPagination
                    v-model:expandedRowKeys="expandedRowKeys"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            :hasPermission="`${permission}:add`"
                            @click="table.toDetails({})"
                        >
                            <AIcon type="PlusOutlined" />新增
                        </PermissionButton>
                        <j-button
                            v-if="admin"
                            style="margin-left: 12px"
                            @click="router.push('/system/Menu/Setting')"
                            >菜单配置</j-button
                        >
                    </template>
                    <template #createTime="slotProps">
                        {{
                            dayjs(slotProps.createTime).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )
                        }}
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <!-- <j-tooltip>
                                <template #title>{{
                                    slotProps?.options?.LowCode
                                        ? '低码创建的菜单不支持编辑'
                                        : '编辑'
                                }}</template>
                                <j-button
                                    style="padding: 0"
                                    type="link"
                                    @click="table.toDetails(slotProps)"
                                    :disabled="slotProps?.options?.LowCode"
                                >
                                    <AIcon type="EditOutlined" />
                                </j-button>
                            </j-tooltip> -->
                            <PermissionButton
                                type="link"
                                :hasPermission="`${permission}:update`"
                                :tooltip="{
                                    title:
                                    slotProps?.options?.LowCode
                                        ? '低码创建的菜单不支持编辑'
                                        : '编辑'
                                }"
                                :disabled="slotProps?.options?.LowCode"
                                @click="table.toDetails(slotProps)"
                            >
                            <AIcon type="EditOutlined" />
                            </PermissionButton>
                            <PermissionButton
                                type="link"
                                :hasPermission="`${permission}:add`"
                                :tooltip="{
                                    title:
                                        slotProps.level >= 3
                                            ? '仅支持3级菜单'
                                            : '新增子菜单',
                                }"
                                :disabled="
                                    slotProps.level >= 3 ||
                                    slotProps?.options?.LowCode
                                "
                                @click="table.addChildren(slotProps)"
                            >
                                <AIcon type="PlusCircleOutlined" />
                            </PermissionButton>
                            <PermissionButton
                                type="link"
                                :hasPermission="`${permission}:delete`"
                                :tooltip="{ title: '删除' }"
                                :popConfirm="{
                                    title: `是否删除该菜单`,
                                    onConfirm: () => table.clickDel(slotProps),
                                }"
                            >
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Menu">
import PermissionButton from '@/components/PermissionButton/index.vue';
import { getMenuTree_api, delMenuInfo_api } from '@/api/system/menu';
import dayjs from 'dayjs';
import { useUserInfo } from '@/store/userInfo';
import { USER_CENTER_MENU_CODE, messageSubscribe } from '@/utils/consts';
import { storeToRefs } from 'pinia';
import { onlyMessage } from '@/utils/comm';

const permission = 'system/Menu';

const router = useRouter();
const userInfoStore = useUserInfo();
const { userInfos } = storeToRefs(userInfoStore);

const admin = computed(() => {
    return userInfos.value?.username === 'admin';
});

const columns = [
    {
        title: '编码',
        dataIndex: 'code',
        key: 'code',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
        width: 300,
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
        // width: 220,
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
        width: 80,
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
        // width: 200,
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
        search: {
            type: 'date',
        },
        width: 180,
        scopedSlots: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        scopedSlots: true,
        width: 150,
    },
];
const queryParams = ref({ terms: [] });
const expandedRowKeys = ref<string[]>([]);
const handleSearch = (e: any) => {
    queryParams.value = e;
    if (!e.terms.length) expandedRowKeys.value = [];
};

const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = reactive({
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
                {
                    type: 'or',
                    terms: [
                        {
                            value: '%show":false%',
                            termType: 'nlike',
                            column: 'options',
                        },
                    ],
                },
            ],
        };
        const params = {
            ..._params,
            terms:
                _params.terms && _params.length !== 0
                    ? [..._params.terms, item]
                    : [item],
            sorts: [{ name: 'sortIndex', order: 'asc' }],
            paging: false,
        };
        const resp: any = await getMenuTree_api(params);
        const menuArr = resp.result.filter(
            (i: any) => i.code !== 'account-center',
        );
        const lastItem = menuArr[menuArr.length - 1];
        console.log(lastItem, 'lastItem');
        //个人中心排序为9999需要做过滤特殊处理
        table.total = lastItem
            ? lastItem.sortIndex + 1 === 9999
                ? 10000
                : lastItem.sortIndex + 1
            : 1;

        return {
            code: resp.message,
            result: {
                data: resp.result?.filter(
                    (item: { code: string }) =>
                        ![USER_CENTER_MENU_CODE, messageSubscribe].includes(
                            item.code,
                        ),
                ),
                pageIndex: resp.pageIndex,
                pageSize: resp.pageSize,
                total: resp.total,
            },
            status: resp.status,
        };
    },
    addChildren: (row: any) => {
      let sortIndex = 0
      if (row && row.children) {
        sortIndex = row.children.filter(a => a.sortIndex !== 9999).sort((a, b) => a.sortIndex - b.sortIndex).pop().sortIndex
      }
      router.push(
        `/system/Menu/detail/:id?pid=${row.id}&basePath=${
          row.url || ''
        }&sortIndex=${sortIndex + 1}`,
      );
    },
    // 跳转至详情页
    toDetails: (row: any) => {
        router.push(
            `/system/Menu/detail/${row.id || ':id'}?pid=${
                row.pid || ''
            }&basePath=${row.url || ''}&sortIndex=${table.total}`,
        );
    },
    // 删除
    clickDel: (row: any) => {
        const response = delMenuInfo_api(row.id);
        response.then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                onlyMessage('操作成功!');
            }
        });
        return response;
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
});
</script>

<style lang="less" scoped>
.menu-container {
    width: 100%;
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
