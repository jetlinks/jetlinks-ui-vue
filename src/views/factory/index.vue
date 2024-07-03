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
                    <j-space>
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                :disabled="i.disabled"
                                :popConfirm="i.popConfirm"
                                :hasPermission="
                                    i.key === 'view'
                                        ? true
                                        : 'device/Product:' + i.key
                                "
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                :danger="i.key === 'delete'"
                            >
                                <template #icon
                                    ><AIcon
                                        style="font-size: 13px"
                                        :type="i.icon"
                                /></template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :showStatus="false"
                        :value="slotProps"
                        @click="handleSee(slotProps)"
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
                            <j-form-item name="applicationId">
                                <template #label>
                                    <span
                                        >选择内部应用
                                        <j-tooltip
                                            title="选择配置好的应用管理,实现总工厂跳转子工厂功能"
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
                                    v-model:value="form.applicationId"
                                    placeholder="请选择内部独立应用"
                                >
                                    <j-select-option
                                        v-for="item in paramsAppList"
                                        :value="item.id"
                                        :key="item.id"
                                        :label="item.name"
                                        >{{ item.name }}</j-select-option
                                    >
                                </j-select>
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
    getSubFactoryToken,
    getQueryApply,
    getQueryFacApply,
} from '@/api/factory/factory';
import { omit, cloneDeep } from 'lodash-es';
import { ActionsType } from './typings';
// import { isUrl, isPort } from '@/utils/regular';
import { BASE_API_PATH } from '@/utils/variable';
import { LocalStore } from '@/utils/comm';

const menuStory = useMenuStore();

const isAdd = ref<number>(0);
const params = ref<Record<string, any>>({});
const tableRef = ref<Record<string, any>>({});

const paramsAppList = ref<any>([]);
const queryAppList = ref<any>([]);
const SelFactoryList = ref<any>([]);

const formRef = ref();

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
        applicationId: [
            { required: true, message: '请选择内部独立应用', trigger: 'blur' },
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
                addFactory(addData)
                    .then((res: any) => {
                        if (res.status === 200) {
                            onlyMessage('添加成功！');
                            modalState.confirmLoading = false;
                            modalState.openView = false;
                            paramsAppList.value = queryAppList.value;
                            tableRef.value?.reload();
                        }
                    })
                    .catch(() => {
                        modalState.confirmLoading = false;
                    });
            } else {
                editFactory(form.value)
                    .then((res: any) => {
                        if (res.status === 200) {
                            onlyMessage('修改成功！');
                            modalState.confirmLoading = false;
                            modalState.openView = false;
                            paramsAppList.value = queryAppList.value;
                            tableRef.value?.reload();
                        }
                    })
                    .catch(() => {
                        modalState.confirmLoading = false;
                    });
            }
        });
    },
    cancel() {
        modalState.openView = false;
        modalState.confirmLoading = false;
        tableRef.value?.reload();
    },
});
const { form, rules } = toRefs(data);

const reset = () => {
    form.value = {
        id: '',
        name: '',
        position: '',
        applicationId: '',
        applicationName: '',
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
    paramsAppList.value = filteredItems.value;
    modalState.openView = true;
    modalState.confirmLoading = false;
    reset();
};

//查看子工厂
const handleSee = (data: any) => {
    const getData = queryAppList.value;
    if (data.applicationId) {
        const getAppData = getData.find(
            (item: any) => item.id === data.applicationId,
        );
        if (getAppData.apiServer?.redirectUri) {
            const url = getAppData.apiServer?.redirectUri;
            const openUrl = `${url}/#/user/login?id=${data.id}&factory=${data.id}`;
            // LocalStore.set('onLogin', 'no');
            // console.log('openUrl', openUrl);
            // window.open(`${url}${BASE_API_PATH}/application/sso/${getAppData.id}/login`,'_blank');
            window.open(openUrl, '_blank');
        } else {
            onlyMessage('内部应用未配置正确,请检查', 'error');
        }
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
        width: 220,
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
                paramsAppList.value = queryAppList.value;
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

const filteredItems = computed(() => {
    return queryAppList.value.filter(
        (item: any) => !SelFactoryList.value.includes(item.id),
    );
});

onMounted(() => {
    getQueryApply().then((res: any) => {
        if (res.result) {
            console.log('res.result', res.result);
            queryAppList.value = res.result;
            paramsAppList.value = queryAppList.value;
        }
    });

    getQueryFacApply().then((resp: any) => {
        console.log('resp', resp);
        SelFactoryList.value = resp.result;
    });
});
</script>

<style lang="less" scoped></style>
