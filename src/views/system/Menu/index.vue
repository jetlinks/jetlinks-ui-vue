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
                            <AIcon type="PlusOutlined" />{{ $t('Menu.index.159180-0') }}
                        </PermissionButton>
                        <j-button
                            v-if="admin"
                            style="margin-left: 12px"
                            @click="router.push('/system/Menu/Setting')"
                            >{{ $t('Menu.index.159180-1') }}</j-button
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
                            <j-tooltip>
                                <template #title>{{
                                    slotProps?.options?.LowCode
                                        ? $t('Menu.index.159180-2')
                                        : $t('Menu.index.159180-3')
                                }}</template>
                                <j-button
                                    style="padding: 0"
                                    type="link"
                                    @click="table.toDetails(slotProps)"
                                    :disabled="slotProps?.options?.LowCode"
                                >
                                    <AIcon type="EditOutlined" />
                                </j-button>
                            </j-tooltip>
                            <PermissionButton
                                type="link"
                                :hasPermission="`${permission}:add`"
                                :tooltip="{
                                    title:
                                        slotProps.level >= 3
                                            ? $t('Menu.index.159180-4')
                                            : $t('Menu.index.159180-5'),
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
                                :tooltip="{ title: $t('Menu.index.159180-6') }"
                                :popConfirm="{
                                    title: $t('Menu.index.159180-7'),
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const permission = 'system/Menu';

const router = useRouter();
const userInfoStore = useUserInfo();
const { userInfos } = storeToRefs(userInfoStore);

const admin = computed(() => {
    return userInfos.value?.username === 'admin';
});

const columns = [
    {
        title: $t('Menu.index.159180-8'),
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
        title: $t('Menu.index.159180-9'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
        // width: 220,
    },
    {
        title: $t('Menu.index.159180-10'),
        dataIndex: 'url',
        key: 'url',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Menu.index.159180-11'),
        dataIndex: 'sortIndex',
        key: 'sortIndex',
        ellipsis: true,
        search: {
            type: 'number',
        },
        width: 80,
    },
    {
        title: $t('Menu.index.159180-12'),
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
        // width: 200,
    },
    {
        title: $t('Menu.index.159180-13'),
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
        title: $t('Menu.index.159180-14'),
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
                            value: '%show":true%',
                            termType: 'like',
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
        const lastItem = resp.result[resp.result.length - 1];
        table.total = lastItem ? lastItem.sortIndex + 1 : 1;

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
        const sortIndex = row?.children?.length || 0;
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
                onlyMessage($t('Menu.index.159180-15'));
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
