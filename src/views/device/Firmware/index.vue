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
                <template #productId="slotProps">
                    <span>{{ slotProps.productName }}</span>
                </template>
                <template #createTime="slotProps">
                    <span>{{
                        moment(slotProps.createTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )
                    }}</span>
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
        <Save v-if="visible" :data="current" @change="saveChange" />
    </page-container>
</template>
<script lang="ts" setup name="FirmwarePage">
import type { ActionsType } from '@/components/Table/index.vue';
import { query, queryProduct, remove } from '@/api/device/firmware';
import { message } from 'ant-design-vue';
import moment from 'moment';
import _ from 'lodash';
import Save from './Save/index.vue';
import { useMenuStore } from 'store/menu';
import type { FormDataType } from './type';

const menuStory = useMenuStore();

const tableRef = ref<Record<string, any>>({});
const router = useRouter();
const params = ref<Record<string, any>>({});

const productOptions = ref([]);
const visible = ref(false);
const current = ref({});

const columns = [
    {
        title: '固件名称',
        key: 'name',
        dataIndex: 'name',
        fixed: 'left',
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '固件版本',
        dataIndex: 'version',
        key: 'version',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属产品',
        dataIndex: 'productId',
        key: 'productId',
        ellipsis: true,
        width: 200,
        scopedSlots: true,
        search: {
            type: 'select',
            options: productOptions,
        },
    },
    {
        title: '签名方式',
        dataIndex: 'signMethod',
        key: 'signMethod',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {
                    label: 'MD5',
                    value: 'md5',
                },
                {
                    label: 'SHA256',
                    value: 'sha256',
                },
            ],
        },
        width: 150,
    },
    {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        search: {
            type: 'time',
        },
        width: 200,
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
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
            key: 'FileTextOutlined',
            text: '升级任务',
            tooltip: {
                title: '升级任务',
            },
            icon: 'FileTextOutlined',
            onClick: async () => {
                handlUpdate(data);
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
                handlEdit(data);
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

const handlUpdate = (data: FormDataType) => {
    menuStory.jumpPage(
        'device/Firmware/Task',
        {},
        {
            id: data.id,
            productId: data.productId,
        },
    );
};

const handlAdd = () => {
    current.value = {};
    visible.value = true;
};
const handlEdit = (data: FormDataType) => {
    current.value = _.cloneDeep(data);
    visible.value = true;
};

const saveChange = (value: FormDataType) => {
    visible.value = false;
    current.value = {};
    if (value) {
        message.success('操作成功');
        tableRef.value.reload();
    }
};

const handlDelete = async (id: string) => {
    const res = await remove(id);
    if (res.success) {
        message.success('操作成功');
        tableRef.value.reload();
    }
};

onMounted(() => {
    queryProduct({
        paging: false,
        sorts: [{ name: 'name', order: 'desc' }],
    }).then((resp) => {
        const list = resp.result.filter((it) => {
            return _.map(it?.features || [], 'id').includes('supportFirmware');
        });
        productOptions.value = list.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    });
});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>

<style lang="less" scoped></style>
