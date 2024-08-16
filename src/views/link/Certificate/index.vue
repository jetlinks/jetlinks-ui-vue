<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-certificate"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    model="TABLE"
                    :columns="columns"
                    :request="query"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    :params="params"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            @click="handlAdd"
                            hasPermission="link/Certificate:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{ $t('Certificate.index.786731-0') }}
                        </PermissionButton>
                    </template>
                    <template #type="slotProps">
                        <span>{{ slotProps.type.text }}</span>
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <template
                                v-for="i in getActions(slotProps)"
                                :key="i.key"
                            >
                                <PermissionButton
                                    :disabled="i.disabled"
                                    :popConfirm="i.popConfirm"
                                    :tooltip="{
                                        ...i.tooltip,
                                    }"
                                    style="padding: 0px"
                                    @click="i.onClick"
                                    type="link"
                                    :danger="i.key === 'delete'"
                                    :hasPermission="'link/Certificate:' + i.key"
                                >
                                    <template #icon
                                        ><AIcon :type="i.icon"
                                    /></template>
                                </PermissionButton>
                            </template>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="CertificatePage">
import type { ActionsType } from '@/components/Table/index';
import { query, remove } from '@/api/link/certificate';
import { onlyMessage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: $t('Certificate.index.786731-1'),
        dataIndex: 'type',
        key: 'type',
        fixed: 'left',
        width: 200,
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                {
                    label: $t('Certificate.index.786731-2'),
                    value: 'common',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: $t('Certificate.index.786731-3'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Certificate.index.786731-4'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Certificate.index.786731-5'),
        key: 'action',
        fixed: 'right',
        width: 80,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) {
        return [];
    }
    return [
        // {
        //     key: 'view',
        //     text: '查看',
        //     tooltip: {
        //         title: '查看',
        //     },
        //     icon: 'EyeOutlined',
        //     onClick: async () => {
        //         handlEye(data.id);
        //     },
        // },
        {
            key: 'update',
            text: $t('Certificate.index.786731-6'),
            tooltip: {
                title: $t('Certificate.index.786731-6'),
            },
            icon: 'EditOutlined',
            onClick: async () => {
                handlEdit(data.id);
            },
        },
        {
            key: 'delete',
            text: $t('Certificate.index.786731-7'),
            tooltip: {
                title: $t('Certificate.index.786731-7'),
            },
            popConfirm: {
                title: $t('Certificate.index.786731-8'),
                okText: ' 确定',
                cancelText: $t('Certificate.index.786731-10'),
                onConfirm: async () => {
                    return handleDelete(data.id);
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const handlAdd = () => {
    menuStory.jumpPage(
        `link/Certificate/Detail`,
        { id: ':id' },
        { view: false },
    );
};

const handlEye = (id: string) => {
    menuStory.jumpPage(`link/Certificate/Detail`, { id }, { view: true });
};

const handlEdit = (id: string) => {
    menuStory.jumpPage(`link/Certificate/Detail`, { id }, { view: false });
};

const handleDelete = (id: string) => {
    const response = remove(id);
    response.then((res) => {
        if (res.success) {
            onlyMessage($t('Certificate.index.786731-11'), 'success');
            tableRef.value.reload();
        }
    });
    return response
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>

<style lang="less" scoped></style>
