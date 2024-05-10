<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="factory-manage"
            @search="onSearch"
        />
        <FullPage>
            <j-pro-table
                :defaultParams="{
                    pageSize: 20,
                }"
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
                        <j-button
                            myIcon="PlusOutlined"
                            type="primary"
                            @click="handleAdd"
                            >新增</j-button
                        >
                    </j-space>
                </template>
                <template #actions="slotProps">
                    <a @click="handleUpdate(slotProps)">编辑</a>
                    <j-divider type="vertical" />
                    <a @click="handleView(slotProps.id)">查看设备</a>
                    <j-divider type="vertical" />
                    <a
                        style="color: #f53f3f"
                        @click="handleDelete(slotProps.id)"
                        >删除</a
                    >
                </template>
                <template #card="slotProps">
                    <CardBox
                        :showStatus="false"
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                    >
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row>
                                <j-col :span="8">
                                    <div class="card-item-content-text">ID</div>
                                    <j-ellipsis
                                        style="width: calc(100% - 10px)"
                                    >
                                        <span>{{ slotProps.id }}</span>
                                    </j-ellipsis>
                                </j-col>
                                <j-col :span="8">
                                    <div class="card-item-content-text">
                                        地理位置
                                    </div>
                                    <j-ellipsis
                                        style="width: calc(100% - 10px)"
                                    >
                                        <div>{{ slotProps.position }}</div>
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
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                            >
                                <template #icon
                                    ><AIcon :type="item.icon"
                                /></template>
                                {{ item.text }}
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
                            <j-form-item label="地理位置" name="position">
                                <j-input
                                    v-model:value="form.position"
                                    placeholder="请输入地理位置"
                                />
                            </j-form-item>
                            <j-form-item label="链接地址" name="url">
                                <j-input
                                    v-model:value="form.url"
                                    placeholder="请输入链接地址"
                                />
                            </j-form-item>
                            <j-form-item label="端口" name="port">
                                <j-input
                                    v-model:value="form.port"
                                    placeholder="请输入端口"
                                />
                            </j-form-item>
                            <j-form-item label="appId" name="appId">
                                <j-input
                                    v-model:value="form.appId"
                                    placeholder="请输入appId"
                                />
                            </j-form-item>
                            <j-form-item label="appKey" name="appKey">
                                <j-input
                                    v-model:value="form.appKey"
                                    placeholder="请输入appKey"
                                />
                            </j-form-item>
                            <j-form-item
                                label="Topic"
                                name="topic"
                                :rules="[
                                    {
                                        required: true,
                                        validator: vailTopic,
                                        trigger: 'blur',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64位字符',
                                        trigger: 'change',
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="form.topic"
                                    :disabled="!!form?.id"
                                    placeholder="请输入Topic"
                                />
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
import { onlyMessage } from '@/utils/comm';
import {
    addFactory,
    editFactory,
    deleteFactory,
    queryFactoryList,
    getDeviceList_factory,
    isTopic,
} from '@/api/factory/factory';
import { omit, cloneDeep } from 'lodash-es';
import { FormState, ActionsType } from './typings';
import { isUrl, isPort } from '@/utils/regular';

const menuStory = useMenuStore();

const isAdd = ref<number>(0);
const params = ref<Record<string, any>>({});
const tableRef = ref<Record<string, any>>({});

const formRef = ref();

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

const validatorPort = (rule: any, value: any, callback: any) => {
    if (value === undefined || value === '' || value === null) {
        return Promise.reject('请输入端口号');
    } else {
        if (
            !(/^[1-9]\d*$/.test(value) && 1 <= 1 * value && 1 * value <= 65535)
        ) {
            return Promise.reject('请输入正确端口号(有效端口号范围(0到65535正整数))');
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

const data = reactive({
    form: {} as Partial<Record<string, any>>,
    rules: {
        name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 64, message: '最多可输入64位字符', trigger: 'change' },
        ],
        position: [
            { max: 64, message: '最多可输入64位字符', trigger: 'change' },
        ],
        url: [
            { required: true, trigger: 'blur', validator: validatorUrl },
            { max: 256, message: '最多可输入256位字符', trigger: 'change' },
        ],
        port: [
            { required: true, trigger: 'blur', validator: validatorPort },
            { max: 8, message: '最多可输入8位字符', trigger: 'change' },
        ],
        appId: [
            { required: true, message: '请输入appId', trigger: 'blur' },
            { max: 64, message: '最多可输入64位字符', trigger: 'change' },
        ],
        appKey: [
            { required: true, message: '请输入appKey', trigger: 'blur' },
            { max: 64, message: '最多可输入64位字符', trigger: 'change' },
        ],
        description: [
            { max: 200, message: '最多可输入200位字符', trigger: 'change' },
        ],
    },
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
                addFactory(addData).then((res: any) => {
                    if (res.status === 200) {
                        onlyMessage('添加成功！');
                        modalState.confirmLoading = false;
                        modalState.openView = false;
                        tableRef.value?.reload();
                    }
                });
            } else {
                editFactory(form.value).then((res: any) => {
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
        tableRef.value?.reload();
    },
});
const { form, rules } = toRefs(data);

const reset = () => {
    form.value = {
        id: '',
        name: '',
        position: '',
        url: '',
        port: '',
        appId: '',
        appKey: '',
        topic: '',
        description: '',
    };
    formRef.value?.resetFields();
};
// 搜索
const onSearch = (e: any) => {
    const newTerms = cloneDeep(e);
    if (newTerms.terms?.length) {
        newTerms.terms.forEach((a: any) => {
            a.terms = a.terms.map((b: any) => {
                if (b.column === 'id$dim-assets') {
                    const value = b.value;
                    b = {
                        column: 'id',
                        termType: 'dim-assets',
                        value: {
                            assetType: 'factory',
                            targets: [
                                {
                                    type: 'org',
                                    id: value,
                                },
                            ],
                        },
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

//查看设备
const handleView = (id: string) => {
    menuStory.jumpPage('factory/Detail', { id });
};
// 删除操作
const handleDelete = async (id: string) => {
    const terms = [
        {
            type: 'or',
            value: `%${id}%`,
            termType: 'like',
            column: 'factoryId',
        },
    ];
    let res: any = await getDeviceList_factory({ terms });
    if (res.result.data?.length === 0) {
        deleteFactory(id).then((response: any) => {
            if (response.status === 200) onlyMessage('删除成功！');
            tableRef.value?.reload();
        });
    } else {
        onlyMessage('删除失败,工厂下还存在设备', 'warning');
    }
};

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true,
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
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
        title: '地理位置',
        dataIndex: 'position',
        key: 'position',
        width: 220,
        ellipsis: true,
        search: {
            type: 'string',
        },
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
            text: '查看设备',
            tooltip: {
                title: '查看设备',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                menuStory.jumpPage('factory/Detail', { id: data.id });
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title: '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const terms = [
                        {
                            type: 'or',
                            value: `%${data.id}%`,
                            termType: 'like',
                            column: 'factoryId',
                        },
                    ];
                    let res: any = await getDeviceList_factory({ terms });
                    if (res.result.data?.length === 0) {
                        deleteFactory(data.id).then((response: any) => {
                            if (response.status === 200)
                                onlyMessage('删除成功！');
                            tableRef.value?.reload();
                        });
                    } else {
                        onlyMessage('删除失败,工厂下还存在设备', 'warning');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const query = (params: Record<string, any>) =>
    new Promise((resolve) => {
        queryFactoryList({
            pageIndex: params.pageIndex + 1,
            pageSize: params.pageSize,
            sorts: [
                {
                    name: 'createTime',
                    order: 'desc',
                },
            ],
            terms: params.terms,
        }).then((response: any) => {
            resolve({
                result: {
                    data: response.result?.data,
                    pageIndex: params.pageIndex || 0,
                    pageSize: params.pageSize || 20,
                    total: response.result?.total,
                },
                status: response.status,
            });
        });
    });
</script>

<style lang="less" scoped></style>
