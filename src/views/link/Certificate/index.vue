<template>
    <page-container>
        <div>
            <Search :columns="columns" target="search" @search="handleSearch" />
            <JTable
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
                    <a-button type="primary" @click="handlAdd"
                        ><plus-outlined />新增</a-button
                    >
                </template>
                <template #type="slotProps">
                    <span>{{ slotProps.type.text }}</span>
                </template>
                <template #action="slotProps">
                    <a-space :size="16">
                        <a-tooltip
                            v-for="i in getActions(slotProps)"
                            :key="i.key"
                            v-bind="i.tooltip"
                        >
                            <a-popconfirm
                                v-if="i.popConfirm"
                                v-bind="i.popConfirm"
                            >
                                <a-button
                                    :disabled="i.disabled"
                                    style="padding: 0"
                                    type="link"
                                    ><AIcon :type="i.icon"
                                /></a-button>
                            </a-popconfirm>
                            <a-button
                                style="padding: 0"
                                type="link"
                                v-else
                                @click="i.onClick && i.onClick(slotProps)"
                            >
                                <a-button
                                    :disabled="i.disabled"
                                    style="padding: 0"
                                    type="link"
                                    ><AIcon :type="i.icon"
                                /></a-button>
                            </a-button>
                        </a-tooltip>
                    </a-space>
                </template>
            </JTable>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="CertificatePage">
import type { ActionsType } from '@/components/Table/index.vue';
import { save, query, remove } from '@/api/link/certificate';
import { message } from 'ant-design-vue';

const tableRef = ref<Record<string, any>>({});
const router = useRouter();
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: '证书标准',
        dataIndex: 'type',
        key: 'type',
        search: {
            type: 'select',
            options: [
                {
                    label: '证书标准',
                    value: 'common',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '证书名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) {
        return [];
    }
    return [
        {
            key: 'eye',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: async () => {
                handlEye(data.id);
            },
        },
        {
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: async () => {
                handlEdit(data.id);
            },
        },
        {
            key: 'delete',
            text: '删除',
            popConfirm: {
                title: '确认删除?',
                okText: ' 确定',
                cancelText: '取消',
                onConfirm: async () => {
                    handlDelete(data.id);
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const handlAdd = () => {
    router.push({
        path: `/iot/link/certificate/detail/:id`,
        query: { view: false },
    });
};

const handlEye = (id: string) => {
    router.push({
        path: `/iot/link/certificate/detail/${id}`,
        query: { view: true },
    });
};

const handlEdit = (id: string) => {
    router.push({
        path: `/iot/link/certificate/detail/${id}`,
        query: { view: false },
    });
};

const handlDelete = async (id: string) => {
    const res = await remove(id);
    if (res.success) {
        message.success('操作成功');
        tableRef.value.reload();
    }
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
