<!-- 同步用户 -->
<template>
    <div>
        <a-modal
            open
            :title="$t('SyncUser.index.935207-0')"
            :footer="null"
            @cancel="$emit('cancel')"
            width="80%"
        >
            <a-row :gutter="10" class="model-body">
                <a-col :span="4">
                    <a-input
                        v-model:value="deptName"
                        @keyup.enter="getDepartment"
                        allowClear
                        :placeholder="$t('SyncUser.index.935207-1')"
                        style="margin-bottom: 8px"
                    >
                        <template #addonAfter>
                            <AIcon
                                type="SearchOutlined"
                                style="cursor: pointer"
                                @click="getDepartment"
                            />
                        </template>
                    </a-input>
                    <a-tree
                        :tree-data="deptTreeData"
                        :fieldNames="{ title: 'name', key: 'id' }"
                        :selectedKeys="[deptId]"
                        @select="onTreeSelect"
                        :showLine="{ showLeafIcon: false }"
                        :show-icon="true"
                    >
                    </a-tree>
                    <a-empty v-if="!deptTreeData.length" />
                </a-col>
                <a-col :span="20">
                    <a-button type="primary" @click="handleAutoBind">
                        {{ $t('SyncUser.index.935207-2') }}
                    </a-button>
                    <a-table
                        ref="tableRef"
                        :columns="columns"
                        :dataSource="dataSource"
                        :loading="tableLoading"
                        :pagination="{
                            total: dataSource.length,
                            current: current,
                            pageSize: pageSize,
                            pageSizeOptions: ['12', '24', '48', '96'],
                            showSizeChanger: true,
                            hideOnSinglePage: false,
                            showTotal: (total: number, range: number) => $t('SyncUser.index.935207-3', [range[0],range[1],total]),
                        }"
                        @change="handleTableChange"
                    >
                        <template #bodyCell="{ column, record, index }">
                            <template v-if="column.dataIndex === 'status'">
                                <a-space>
                                    <a-badge
                                        :status="record.status.value"
                                        :text="record.status.text"
                                    ></a-badge>
                                </a-space>
                            </template>
                            <template v-if="column.dataIndex === 'action'">
                                <a-space>
                                    <template
                                        v-for="i in getActions(record, 'table')"
                                        :key="i.key"
                                    >
                                        <j-permission-button
                                            :disabled="i.disabled"
                                            :popConfirm="i.popConfirm"
                                            :tooltip="{
                                                ...i.tooltip,
                                            }"
                                            @click="i.onClick"
                                            type="link"
                                            style="padding: 0 5px"
                                            :danger="i.key === 'delete'"
                                        >
                                            <template #icon
                                                ><AIcon :type="i.icon"
                                            /></template>
                                        </j-permission-button>
                                    </template>
                                </a-space>
                            </template>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-modal>

        <!-- {{ $t('SyncUser.index.935207-4') }} -->
        <a-modal
            v-model:open="bindVis"
            :title="$t('SyncUser.index.935207-4')"
            :maskClosable="false"
            :confirm-loading="confirmLoading"
            @cancel="handleCancel"
            @ok="handleBindSubmit"
        >
            <a-form layout="vertical">
                <a-form-item :label="$t('SyncUser.index.935207-5')" v-bind="validateInfos.userId">
                    <a-select
                        v-model:value="formData.userId"
                        :options="allUserList"
                        allowClear
                        show-search
                        option-filter-prop="children"
                        :filter-option="filterOption"
                        :placeholder="$t('SyncUser.index.935207-6')"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts" name="SyncUser">
import configApi from '../../../api/config';
import { PropType } from 'vue';
import { Form } from 'ant-design-vue';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const useForm = Form.useForm;

type Emits = {
    (e: 'cancel'): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

// 左侧部门
const deptTreeData = ref([]);
const deptName = ref('');
const deptId = ref('');

/**
 * 获取部门
 */
const getDepartment = async () => {
    let res = null;
    if (props.data.type === 'dingTalk') {
        res = await configApi.dingTalkDept(props.data.id);
    } else if (props.data.type === 'weixin') {
        res = await configApi.weChatDept(props.data.id);
    }
    let _result = res?.result;
    if (deptName.value) {
        _result = res?.result?.filter(
            (f: any) => f.name.indexOf(deptName.value) > -1,
        );
    }

    deptTreeData.value = _result;
    if(_result.length){
        deptId.value = _result[0]?.id;
    }
};

/**
 * 部门点击
 */
const onTreeSelect = (keys: any) => {
    if (keys.length) {
        deptId.value = keys[0];
        pageSize.value = 12;
        current.value = 1;
    }
};

// 右侧表格

const columns = [
    {
        title: props.data.type === 'weixin' ? $t('SyncUser.index.935207-7') : $t('SyncUser.index.935207-8'),
        dataIndex: 'thirdPartyUserName',
        key: 'thirdPartyUserName',
    },
    {
        title: $t('SyncUser.index.935207-5'),
        dataIndex: 'userName',
        key: 'userName',
        scopedSlots: true,
    },
    {
        title: $t('SyncUser.index.935207-9'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
    },
    {
        title: $t('SyncUser.index.935207-10'),
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
    },
];
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): any[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'bind',
            text: $t('SyncUser.index.935207-11'),
            tooltip: {
                title: $t('SyncUser.index.935207-11'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                handleBind(data);
            },
        },
        {
            key: 'unbind',
            text: $t('SyncUser.index.935207-12'),
            icon: 'DisconnectOutlined',
            popConfirm: {
                title: $t('SyncUser.index.935207-13'),
                onConfirm: () => {
                    const response = configApi.unBindUser(
                        { bindingId: data.bindId },
                        data.bindId,
                    );
                    response.then(() => {
                        onlyMessage($t('SyncUser.index.935207-14'));
                        getTableData();
                    });
                    return response;
                },
            },
        },
    ];
    if (data.status.value === 'success') return actions;
    return actions.filter((i: any) => i.key !== 'unbind');
};

/**
 * 自动绑定
 */
const handleAutoBind = async () => {
    await getTableData([
        {
            column: `id$user-third$${props.data.type}_${props.data.provider}$not`,
        },
    ]);
    const params = dataSource.value
        .filter((f: any) => f.userId && f.status.value === 'error')
        .map((m: any) => ({
            userId: m.userId,
            providerName: m.thirdPartyUserName,
            thirdPartyUserId: m.thirdPartyUserId,
        }));

    if (props.data.type === 'dingTalk') {
        configApi.dingTalkBindUser(params, props.data.id).then(() => {
            onlyMessage($t('SyncUser.index.935207-14'));
            getTableData();
        });
    } else if (props.data.type === 'weixin') {
        configApi.weChatBindUser(params, props.data.id).then(() => {
            onlyMessage($t('SyncUser.index.935207-14'));
            getTableData();
        });
    }
};

/**
 * 获取钉钉/微信部门用户
 */
const getDeptUsers = async () => {
    let res = null;
    if (props.data.type === 'dingTalk') {
        res = await configApi.getDingTalkUsers(props.data.id, deptId.value);
    } else if (props.data.type === 'weixin') {
        res = await configApi.getWeChatUsers(props.data.id, deptId.value);
    }
    return res?.result;
};
/**
 * 获取已经绑定的用户
 */
const getBindUsers = async () => {
    let res = null;
    if (props.data.type === 'dingTalk') {
        res = await configApi.getDingTalkBindUsers(props.data.id);
    } else if (props.data.type === 'weixin') {
        res = await configApi.getWeChatBindUsers(props.data.id);
    }
    return res?.result;
};
/**
 * 获取所有用户未绑定的用户
 */
const allUserList = ref([]);
const getAllUsers = async (terms?: any) => {
    const params = {
        paging: false,
        terms,
    };
    const { result } = await configApi.getPlatformUsers(params);
    allUserList.value = result.map((m: any) => ({
        label: m.name + ` (${m.username})`,
        value: m.id,
        ...m,
    }));
    return result;
};

/**
 * 处理列表数据
 */
const dataSource = ref<any>([]);
const tableLoading = ref(false);
const getTableData = (terms?: any) => {
    tableLoading.value = true;
    Promise.all<any>([getDeptUsers(), getBindUsers(), getAllUsers(terms)])
        .then((res) => {
            dataSource.value = [];
            const [deptUsers, bindUsers, unBindUsers] = res;
            (deptUsers || []).forEach((deptUser: any) => {
                // 未绑定的用户
                let unBindUser = unBindUsers.find(
                    (f: any) => f.id === deptUser?.id,
                );
                // 绑定的用户
                const bindUser = bindUsers.find(
                    (f: any) => f.thirdPartyUserId === deptUser.id,
                );
                if (bindUser) {
                    unBindUser = unBindUsers.find(
                        (f: any) => f.id === bindUser.userId,
                    );
                }
                dataSource.value.push({
                    thirdPartyUserId: deptUser.id,
                    thirdPartyUserName: deptUser.name,
                    bindId: bindUser?.id,
                    userId: unBindUser?.id,
                    userName: unBindUser
                        ? `${unBindUser.name}(${unBindUser.username})`
                        : bindUser?.providerName,
                    status: {
                        text: bindUser?.providerName ? $t('SyncUser.index.935207-15') : $t('SyncUser.index.935207-16'),
                        value: bindUser?.providerName ? 'success' : 'error',
                    },
                });
            });
            // console.log('dataSource.value: ', dataSource.value);
        })
        .finally(() => {
            tableLoading.value = false;
        });
};

/**
 * 前端分页
 */
const current = ref(1);
const pageSize = ref(12);
const handleTableChange = (pagination: any) => {
    current.value = pagination.current;
    pageSize.value = pagination.pageSize;
};

/**
 * 绑定用户
 */
const bindVis = ref(false);
const confirmLoading = ref(false);
const formData = ref({
    userId: '',
    thirdPartyUserId: '',
    thirdPartyUserName: '',
    bindId: '',
});
const formRules = ref({
    userId: [{ required: true, message: $t('SyncUser.index.935207-6'), trigger: 'change' }],
});

const { resetFields, validate, validateInfos, clearValidate } = useForm(
    formData.value,
    formRules.value,
);

const handleBind = (row: any) => {
    bindVis.value = true;
    // formData.value = row;
    Object.assign(formData.value, row);
    getAllUsers([
        {
            column: `id$user-third$${props.data.type}_${props.data.provider}$not`,
        },
    ]);
};

/**
 * 绑定用户, 用户下拉筛选
 */
const filterOption = (input: string, option: any) => {
    const text = option?.componentOptions?.children?.[0]?.text || option.label;
    return text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

/**
 * 绑定提交
 */
const handleBindSubmit = () => {
    validate().then(async () => {
        const params = {
            providerName: formData.value.thirdPartyUserName,
            thirdPartyUserId: formData.value.thirdPartyUserId,
            userId: formData.value.userId,
            id: formData.value.bindId,
        };
        confirmLoading.value = true;
        if (props.data.type === 'dingTalk') {
            configApi
                .dingTalkBindUser([params], props.data.id)
                .then(() => {
                    onlyMessage($t('SyncUser.index.935207-14'));
                    bindVis.value = false;
                    getTableData();
                })
                .finally(() => {
                    confirmLoading.value = false;
                });
        } else if (props.data.type === 'weixin') {
            configApi
                .weChatBindUser([params], props.data.id)
                .then(() => {
                    onlyMessage($t('SyncUser.index.935207-14'));
                    bindVis.value = false;
                    getTableData();
                })
                .finally(() => {
                    confirmLoading.value = false;
                });
        }
    });
};
const handleCancel = () => {
    bindVis.value = false;
    resetFields();
};

watch(
    () => deptId.value,
    () => {
        getTableData();
    },
    // { immediate: true },
);
watch(
    () => deptName.value,
    (val: any) => {
        if (!val) getDepartment();
    },
);
onMounted(() => {
    getDepartment();
});
</script>

<style lang="less" scoped>
.model-body {
    height: 600px;
    overflow-y: auto;
    &:deep(.ant-pagination-item) {
        display: none;
    }
}
</style>
