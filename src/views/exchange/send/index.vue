<template>
    <page-container>
        <pro-search :columns="columns" type="simple" @search="onSearch" />
        <FullPage>
            <j-pro-table
                :defaultParams="defaultParams"
                :pagination="{
                    pageSizeOptions: ['10', '20', '50', '80', '100'],
                    showSizeChanger: true,
                    showQuickJumper: false,
                    size: 'size',
                }"
                :columns="columns"
                :params="params"
                ref="tableRef"
                :request="query"
            >
                <template #headerTitle>
                    <j-space>
                        <j-button type="primary" @click="handleAdd"
                            >新增</j-button
                        >
                    </j-space>
                </template>
                <template #actions="slotProps">
                    <a @click="handleUpdate(slotProps)">编辑</a>
                    <j-divider type="vertical" />
                    <a @click="handleView(slotProps)">配置</a>
                    <j-divider type="vertical" />
                    <a
                        style="color: #f53f3f"
                        @click="handleDelete(slotProps.id)"
                        >删除</a
                    >
                </template>
                <template #state="slotProps">
                    <BadgeStatus
                        :status="slotProps.state?.value"
                        :text="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'warning',
                        }"
                    />
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        :showStatus="true"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'warning',
                        }"
                    >
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row>
                                <j-col :span="8">
                                    <div class="card-item-content-text">
                                        产品名称
                                    </div>
                                    <j-ellipsis
                                        style="width: calc(100% - 10px)"
                                    >
                                        <div>
                                            {{
                                                getProduct(slotProps.productId)
                                            }}
                                        </div>
                                    </j-ellipsis>
                                </j-col>
                                <j-col :span="8">
                                    <div class="card-item-content-text">
                                        说明
                                    </div>
                                    <j-ellipsis
                                        style="width: calc(100% - 10px)"
                                    >
                                        <div>{{ slotProps.description }}</div>
                                    </j-ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <PermissionButton
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                            >
                            <AIcon
                                    type="DeleteOutlined"
                                    v-if="item.key === 'delete'"
                                />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item?.text }}</span>
                                </template>
                            </PermissionButton>
                        </template>
                    </CardBox>
                </template>
            </j-pro-table>
        </FullPage>

        <!-- 新增和编辑 -->
        <j-modal
            :visible="modalState.openView"
            :title="modalState.title"
            :maskClosable="false"
            destroy-on-close
            width="500px"
            @ok="modalState.confirm"
            @cancel="modalState.cancel"
            :confirmLoading="modalState.confirmLoading"
            cancelText="取消"
            okText="确定"
        >
            <div style="margin-top: 10px">
                <j-form
                    layout="vertical"
                    :model="form"
                    :rules="rules"
                    ref="formRef"
                >
                    <j-row type="flex">
                        <j-col flex="auto">
                            <j-form-item label="名称" name="name">
                                <j-input
                                    v-model:value="form.name"
                                    placeholder="请输入名称"
                                />
                            </j-form-item>
                            <j-form-item label="链接地址" name="url">
                                <j-input
                                    v-model:value="form.url"
                                    placeholder="请输入链接地址"
                                />
                            </j-form-item>
                            <j-form-item label="Topic" name="topic">
                                <j-input
                                    v-model:value="form.topic"
                                    :disabled="!!form?.id"
                                    placeholder="请输入Topic"
                                />
                            </j-form-item>
                            <j-form-item label="group.id" name="groupId">
                                <j-input
                                    v-model:value="form.groupId"
                                    placeholder="请输入group.id"
                                />
                            </j-form-item>
                            <j-form-item name="productId">
                                <template #label>
                                    <span
                                        >选择产品
                                        <j-tooltip
                                            title="只能选择“正常”状态的产品"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-select
                                    showSearch
                                    :disabled="!!form?.id"
                                    @change="curProductChange"
                                    v-model:value="form.productId"
                                    placeholder="请选择状态为“正常”的产品"
                                >
                                    <j-select-option
                                        v-for="item in productList"
                                        :value="item.id"
                                        :key="item.id"
                                        :label="item.name"
                                        >{{ item.name }}</j-select-option
                                    >
                                </j-select>
                            </j-form-item>
                            <j-form-item name="deviceIds">
                                <template #label>
                                    <span>选择设备 </span>
                                </template>
                                <j-select
                                    showSearch
                                    :disabled="!!form?.id"
                                    v-model:value="form.deviceIds"
                                    placeholder="请选择设备"
                                    mode="multiple"
                                >
                                    <j-select-option
                                        v-for="item in deviceList"
                                        :value="item.id"
                                        :key="item.id"
                                        :label="item.name"
                                        >{{ item.name }}</j-select-option
                                    >
                                </j-select>
                            </j-form-item>
                        </j-col>
                    </j-row>
                    <j-form-item label="说明" name="description">
                        <j-textarea
                            :maxlength="200"
                            showCount
                            :auto-size="{ minRows: 4, maxRows: 5 }"
                            v-model:value="form.description"
                            placeholder="请输入说明"
                        />
                    </j-form-item>
                </j-form>
            </div>
        </j-modal>
    </page-container>
</template>

<script lang="ts" setup>
import { useMenuStore } from 'store/menu';
import { getImage, onlyMessage } from '@/utils/comm';
import {
    addDataSand,
    editDataSand,
    deleteDataSand,
    queryDataReceiveList,
    queryNoPagingPostDevice,
    _deploy
} from '@/api/exchange/receive';
import { isTopic } from '@/api/factory/factory';
import { queryNoPagingPost } from '@/api/device/product';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { isUrl } from '@/utils/regular';
import { ActionsType } from '../typings';
import { omit, cloneDeep } from 'lodash-es';
import { getDetails_api } from '@/api/system/basis';

const isAdd = ref<number>(0);
const params = ref<Record<string, any>>({});
const tableRef = ref<Record<string, any>>({});

const productList = ref<Record<string, any>[]>([]);
const deviceList = ref<Record<string, any>[]>([]);

const formRef = ref();
const data = reactive({
    form: {} as Partial<Record<string, any>>,
});

const modelRef = reactive({
    id: undefined,
    name: '',
    url: '',
    topic: '',
    productId: undefined,
    deviceIds: [],
    groupId: undefined,
    description: '',
});

const modalState = reactive({
    openView: false,
    title: '新增',
    confirmLoading: false,
    confirm() {
        formRef.value?.validate().then(() => {
            modalState.confirmLoading = true;
            let { id, ...addData } = form.value;
            if (isAdd.value === 1) {
                addDataSand(addData).then((res: any) => {
                    if (res.status === 200) {
                        onlyMessage('添加成功！');
                        modalState.confirmLoading = false;
                        modalState.openView = false;
                        tableRef.value?.reload();
                    }
                });
            } else {
                editDataSand(form.value).then((res: any) => {
                    if (res.status === 200) {
                        onlyMessage('修改成功！');
                        modalState.confirmLoading = false;
                        modalState.openView = false;
                        tableRef.value?.reload();
                    }
                });
            }
        });
    },
    cancel() {
        modalState.openView = false;
        formRef.value.resetFields();
    },
});
const { form } = toRefs(data);

const menuStory = useMenuStore();

const validatorUrl = (rule: any, value: any, callback: any) => {
    if (value === undefined || value === '' || value === null) {
        return Promise.reject('请输入链接地址');
    } else {
        if (!isUrl(value)) {
            return Promise.reject(
                '请输入正确的链接地址(例：http或https://www.baidu.com)',
            );
        }
        return Promise.resolve();
    }
};

const vailTopic = async (_: Record<string, any>, value: string) => {
    if (value) {
        let updateID = form.value.id;
        if (updateID) {
            const resp: any = await isTopic({
                topic: value,
                id: updateID,
            });
            if (resp.status === 200 && resp.result?.passed === false) {
                return Promise.reject('Topic重复');
            } else {
                return Promise.resolve();
            }
        } else {
            const resp: any = await isTopic({
                topic: value,
            });
            if (resp.status === 200 && resp.result?.passed === false) {
                return Promise.reject('Topic重复');
            } else {
                return Promise.resolve();
            }
        }
    } else {
        return Promise.resolve();
    }
};

const rules = {
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    url: [{ required: true, trigger: 'blur', validator: validatorUrl }],
    topic: [
        { required: true, trigger: 'blur', validator: vailTopic },
        { max: 32, message: '最多可输入32位字符', trigger: 'change' },
    ],
    productId: [
        { required: true, message: '请选择产品', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    deviceIds: [
        {
            required: true,
            message: '请选择产品下设备',
            type: 'array',
        },
    ],
    groupId: [
        { required: true, message: '请输入group.id', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    description: [
        { max: 200, message: '最多可输入200位字符', trigger: 'change' },
    ],
};

const reset = () => {
    form.value = {
        id: '',
        name: '',
        url: '',
        topic: '',
        productId: '',
        deviceIds: [],
        groupId: '',
        description: '',
        type: 'sand',
        state: 'enabled',
    };
    formRef.value?.resetFields();
};

const defaultParams = ref({
    pageSize: 20,
    pageIndex: 0,
    terms: [
        {
            type: 'or',
            value: 'sand',
            termType: 'eq',
            column: 'type',
        },
    ],
});

// 搜索
const onSearch = (e: any) => {
    const newTerms = cloneDeep(e);
    if (newTerms.terms?.length) {
        newTerms.terms.forEach((a: any) => {
            a.terms = a.terms.map((b: any) => {
                if (b.column === 'type') {
                    const value = b.value;
                    b = {
                        type: 'or',
                        value: `${value}`,
                        termType: 'eq',
                        column: 'type',
                    };
                }
                return b;
            });
        });
    }
    params.value = newTerms;
};

//新增
const handleAdd = () => {
    isAdd.value = 1;
    modalState.title = '新增';
    modalState.openView = true;
    reset();
};

// 编辑操作
const handleUpdate = (data: any) => {
    isAdd.value = 2;
    form.value = data;
    modalState.title = '编辑';
    modalState.openView = true;
};

//查看配置
const handleView = (data: any) => {
    console.log(data);
    menuStory.jumpPage(
        'exchange/send/Detail',
        {
            id: data.id,
            productId: data.productId,
            ids: data.deviceIds,
        },
        {
            id: data.id,
            productId: data.productId,
            ids: data.deviceIds,
        },
    );
};
// 删除操作
const handleDelete = async (id: string) => {
    deleteDataSand(id).then((response: any) => {
        if (response.status === 200) onlyMessage('删除成功！');
    });
};

//获取卡片字段产品名称
const getProduct = (productId: string) => {
    const getList: any = productList.value.find(
        (item: any) => item.id === productId,
    );
    return getList?.name;
};

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 220,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '链接地址',
        dataIndex: 'url',
        key: 'url',
        width: 220,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'disabled' },
                { label: '正常', value: 'enabled' },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                isAdd.value = 2;
                modalState.title = '编辑';
                modalState.openView = true;
                form.value = data;
            },
        },
        {
            key: 'view',
            text: '配置',
            tooltip: {
                title: '配置',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'exchange/send/Detail',
                    {
                        id: data.id,
                        productId: data.productId,
                        ids: data.deviceIds,
                    },
                    {
                        id: data.id,
                        productId: data.productId,
                        ids: data.deviceIds,
                    },
                );
            },
        },
        {
            key: 'action',
            text: data.state.value === 'enabled' ? '禁用' : '启用',
            tooltip: {
                title: data.state.value === 'enabled' ? '禁用' : '启用',
            },
            icon: data.state.value === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${data.state.value === 'enabled' ? '禁用' : '启用'}?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state.value === 'enabled') {
                        response = await _deploy(data.id,{state: 'disabled'});
                    } else {
                        response = await _deploy(data.id,{state: 'enabled'});
                    }
                    if (response && response.status === 200) {
                        onlyMessage('操作成功！');
                        tableRef.value?.reload();
                    } else {
                        onlyMessage('操作失败！', 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            disabled: data.state.value === 'enabled',
            tooltip: {
                title: data.state.value === 'enabled'
                        ? '已启用的设备不能删除'
                        : '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    deleteDataSand(data.id).then((response: any) => {
                        if (response.status === 200) {
                            onlyMessage('删除成功！')
                            tableRef.value?.reload();
                        } else {
                            onlyMessage('操作失败！', 'error');
                        }
                    });
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const query = (params: Record<string, any>) =>
    new Promise((resolve) => {
        queryDataReceiveList({
            pageIndex: params.pageIndex + 1,
            pageSize: params.pageSize,
            sorts: [
                {
                    name: 'createTime',
                    order: 'desc',
                },
            ],
            terms: params.terms,
        })
            .then((response: any) => {
                resolve({
                    result: {
                        data: response.result?.data,
                        pageIndex: params.pageIndex || 0,
                        pageSize: params.pageSize || 20,
                        total: response.result?.total,
                    },
                    status: response.status,
                });
            })
            .catch((error: any) => {
                console.log(error);
            });
    });

//监听产品select选项变动,清空设备多选框
const curProductChange = (val: any) => {
    form.value.deviceIds = [];
};
watch(
    () => form.value.productId,
    (newValue, oldValue) => {
        const setData = {
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    terms: [
                        {
                            column: 'productId',
                            termType: 'eq',
                            type: 'or',
                            value: `${newValue}`,
                        },
                    ],
                },
            ],
        };
        queryNoPagingPostDevice(setData).then((resp) => {
            if (resp.status === 200) {
                deviceList.value = resp.result as Record<string, any>[];
            }
        });
    },
);
onMounted(() => {
    queryNoPagingPost({
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            {
                terms: [
                    {
                        termType: 'eq',
                        column: 'state',
                        value: 1,
                    },
                ],
            },
        ],
    }).then((resp) => {
        if (resp.status === 200) {
            productList.value = resp.result as Record<string, any>[];
        }
    });
});
</script>

<style lang="less" scoped></style>
