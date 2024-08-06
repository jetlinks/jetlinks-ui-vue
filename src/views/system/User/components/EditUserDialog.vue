<template>
    <j-modal
        visible
        :title="dialogTitle"
        :maskClosable="false"
        width="675px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        class="edit-dialog-container"
        :confirmLoading="loading"
        :cancelText="$t('components.EditUserDialog.363802-0')"
        :okText="$t('components.EditUserDialog.363802-1')"
    >
        <j-form ref="formRef" :model="form.data" layout="vertical">
            <div class="formName" v-if="form.IsShow('add', 'edit')">{{ $t('components.EditUserDialog.363802-2') }}</div>
            <j-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <j-col :span="24">
                    <j-form-item
                        name="name"
                        :label="$t('components.EditUserDialog.363802-3')"
                        :rules="[
                            { required: true, message: $t('components.EditUserDialog.363802-4') },
                            {
                                max: 64,
                                message: $t('components.EditUserDialog.363802-5'),
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.name"
                            :placeholder="$t('components.EditUserDialog.363802-4')"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <j-col :span="12">
                    <j-form-item
                        name="telephone"
                        :label="$t('components.EditUserDialog.363802-6')"
                        :rules="[
                            {
                                pattern: /^1[3456789]\d{9}$/,
                                message: $t('components.EditUserDialog.363802-7'),
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.telephone"
                            :placeholder="$t('components.EditUserDialog.363802-8')"
                            :maxlength="64"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="email"
                        :label="$t('components.EditUserDialog.363802-9')"
                        :rules="[
                            {
                                pattern:
                                    /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                                message: $t('components.EditUserDialog.363802-10'),
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.email"
                            :placeholder="$t('components.EditUserDialog.363802-11')"
                            :maxlength="64"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <j-col :span="12">
                    <j-form-item name="roleIdList" :label="$t('components.EditUserDialog.363802-12')" class="flex"
                        :rules="[
                            { required: form.data.username !== 'admin', message: $t('components.EditUserDialog.363802-13') },
                        ]"
                    >
                        <j-tree-select
                            v-model:value="form.data.roleIdList"
                            multiple
                            show-search
                            style="width: calc(100% - 40px)"
                            :placeholder="$t('components.EditUserDialog.363802-13')"
                            :tree-data="form.roleOptions"
                            :fieldNames="{ label: 'name', value: 'id', children:'children' }"
                            :disabled="form.data.username === 'admin'"
                            :filterTreeNode="
                                (v, node) => filterSelectNode(v, node, 'name')
                            "
                        >
                        <template #title="{ name }">
                            <div style="width: calc(100% - 10px) ">
                                <Ellipsis>{{ name }}</Ellipsis>
                            </div>
                        </template>
                    </j-tree-select>
                        <PermissionButton
                            :hasPermission="`${rolePermission}:add`"
                            @click="form.clickAddItem('roleIdList', 'Role')"
                            v-if="form.data.username !== 'admin'"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item name="orgIdList" :label="$t('components.EditUserDialog.363802-14')" class="flex">
                        <j-tree-select
                            v-model:value="form.data.orgIdList"
                            show-search
                            style="width: calc(100% - 40px)"
                            :placeholder="$t('components.EditUserDialog.363802-15')"
                            :tree-data="form.departmentOptions"
                            :fieldNames="{ label: 'name', value: 'id' }"
                            multiple
                            :filterTreeNode="
                                (v: string, node: any) => filterSelectNode(v, node, 'name')
                            "
                        >
                            <template #title="{ name }">
                                {{ name }}
                            </template>
                        </j-tree-select>
                        <PermissionButton
                            :hasPermission="`${deptPermission}:add`"
                            @click="
                                form.clickAddItem('orgIdList', 'Department')
                            "
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </j-form-item>
                </j-col>
            </j-row>
            <div class="formName" v-if="form.IsShow('add', 'edit')">{{ $t('components.EditUserDialog.363802-16') }}</div>
            <j-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <j-col :span="24">
                    <j-form-item
                        name="username"
                        :label="$t('components.EditUserDialog.363802-17')"
                        :validateFirst="true"
                        :rules="[
                            { required: true, message: $t('components.EditUserDialog.363802-18') },
                            // {
                            //     validator: checkCh,
                            //     trigger: ['change', 'blur'],
                            // },
                            {
                                validator: form.rules.checkUserName,
                                trigger: 'blur',
                            }
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.username"
                            :placeholder="$t('components.EditUserDialog.363802-18')"
                            :disabled="props.type === 'edit'"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row v-if="form.IsShow('add', 'reset')">
                <j-col :span="24">
                    <j-form-item
                        name="password"
                        :label="$t('components.EditUserDialog.363802-19')"
                        :rules="[
                            { required: true, message: '' },
                            {
                                validator: form.rules.checkPassword,
                                trigger: 'change',
                            },
                        ]"
                    >
                        <j-input-password
                            v-model:value="form.data.password"
                            :placeholder="$t('components.EditUserDialog.363802-20')"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row v-if="form.IsShow('add', 'reset')">
                <j-col :span="24">
                    <j-form-item
                        name="confirmPassword"
                        :label="$t('components.EditUserDialog.363802-21')"
                        :rules="[
                            { required: true, message: '' },
                            {
                                validator: form.rules.checkAgainPassword,
                                trigger: 'blur',
                            },
                            {

                            }
                        ]"
                    >
                        <j-input-password
                            v-model:value="form.data.confirmPassword"
                            :placeholder="$t('components.EditUserDialog.363802-22')"
                            :maxlength="64"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import { FormInstance } from 'ant-design-vue';
import {
    validateField_api,
    getRoleList_api,
    getDepartmentList_api,
    addUser_api,
    updateUser_api,
    updatePassword_api,
    getUser_api,
    getRoleList
} from '@/api/system/user';
import { Rule } from 'ant-design-vue/es/form';
import { DefaultOptionType } from 'ant-design-vue/es/vc-tree-select/TreeSelect';
import { AxiosResponse } from 'axios';
import { passwordRegEx } from '@/utils/validate';
import { filterSelectNode, onlyMessage } from '@/utils/comm';
import { uniqBy } from 'lodash-es';
import { storeToRefs } from 'pinia';

import { useI18n } from 'vue-i18n';
const { t: $t } = useI18n();
const deptPermission = 'system/Department';
const rolePermission = 'system/Role';

const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    type: modalType;
    data: any;
    visible: boolean;
}>();
// 弹窗相关
const loading = ref(false);
const dialogTitle = computed(() => {
    if (props.type === 'add') return $t('components.EditUserDialog.363802-23');
    else if (props.type === 'edit') return $t('components.EditUserDialog.363802-24');
    else if (props.type === 'reset') return $t('components.EditUserDialog.363802-25');
    else return '';
});
const confirm = () => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(() => form.submit())
        .then((resp: any) => {
            if (resp.status === 200) {
                onlyMessage($t('components.EditUserDialog.363802-26'));
                emits('confirm');
                emits('update:visible', false);
            }
        })
        .finally(() => (loading.value = false));
};

const formRef = ref<FormInstance>();
const form = reactive({
    data: {} as formType,
    rules: {
        checkUserName: (_rule: Rule, value: string): Promise<any> =>
            new Promise((resolve, reject) => {
                if(props.type==='edit') return resolve('')
                else if(!value) return reject($t('components.EditUserDialog.363802-18'));
                else if (value.length > 64) return reject($t('components.EditUserDialog.363802-5'));
                validateField_api('username', value).then((resp: any): any => {
                    resp.result.passed
                        ? resolve('')
                        : reject(resp.result.reason);
                });
            }),
        checkPassword: (_rule: Rule, value: string): Promise<any> =>
            new Promise((resolve, reject) => {
                if (!value) return reject($t('components.EditUserDialog.363802-20'));
                else if (value.length > 64) return reject($t('components.EditUserDialog.363802-5'));
                else if (value.length < 8) return reject($t('components.EditUserDialog.363802-27'));
                else if (!passwordRegEx(value))
                    return reject($t('components.EditUserDialog.363802-28'));
                validateField_api('password', value).then((resp: any) => {
                    resp.result.passed
                        ? resolve('')
                        : reject(resp.result.reason);
                });
            }),
        checkAgainPassword: (_rule: Rule, value: string): Promise<any> => {
            if (!value) return Promise.reject($t('components.EditUserDialog.363802-22'));
            return value === form.data.password
                ? Promise.resolve()
                : Promise.reject($t('components.EditUserDialog.363802-29'));
        },
    },

    roleOptions: [],
    departmentOptions: [] as DefaultOptionType[],

    _departmentOptions: [] as DefaultOptionType[],

    init: () => {
        form.getDepartmentList();
        form.getRoleList();
        form.getUserInfo();
    },
    getUserInfo: () => {
        const id = props.data.id || '';

        if (props.type === 'add') form.data = {} as formType;
        else if (props.type === 'reset') form.data = { id } as formType;
        else if (props.type === 'edit') {
            getUser_api(id).then((resp: any) => {
                form.data = {
                    ...(resp.result as formType),
                    orgIdList: resp.result.orgList.map(
                        (item: dictType) => item.id,
                    ),
                    roleIdList: resp.result.roleList.map(
                        (item: dictType) => item.id,
                    ),
                };
                form.data.roleIdList = resp.result?.roleList?.map((i: any) => {
                    return i.id
                });
                form._departmentOptions = resp.result?.orgList
                nextTick(() => {
                    formRef.value?.clearValidate();
                });
            });
        }
    },
    submit: (): Promise<any> => {
        let api: axiosFunType;
        let params = {};

        if (props.type === 'add') {
            api = addUser_api;
            params = {
                user: form.data,
                orgIdList: form.data.orgIdList,
                roleIdList: form.data.roleIdList,
            };
        } else if (props.type === 'edit') {
            api = updateUser_api;
            params = {
                id: form.data.id,
                user: form.data,
                orgIdList: form.data.orgIdList,
                roleIdList: form.data.roleIdList,
            };
        } else if (props.type === 'reset') {
            api = updatePassword_api;
            params = {
                id: form.data.id,
                password: form.data.password,
            };
        } else return Promise.reject();
        return api(params);
    },
    getRoleList: () => {
        getRoleList({ sorts: [{ name: 'createTime', order: 'desc' }] }).then((resp: any) => {
           if(resp.status === 200){
            form.roleOptions =  dealRoleList(resp.result)
           }
        });
    },
    getDepartmentList: () => {
        getDepartmentList_api({
        paging: false,
        sorts: [{ name: 'sortIndex', order: 'asc' }],
    }).then((resp: any) => {
            form.departmentOptions = resp.result.sort((a: any, b: any) =>
                a.sortIndex === b.sortIndex
                    ? b.createTime - a.createTime
                    : a.sortIndex - b.sortIndex,
            ); // 报存源数据;
        });
    },
    IsShow: (...typeList: modalType[]) => typeList.includes(props.type),
    clickAddItem: (prop: 'roleIdList' | 'orgIdList', target: string) => {
        const tab: any = window.open(`${origin}/#/system/${target}?save=true`);
        tab.onTabSaveSuccess = (value: string) => {
            form.data[prop] = [...(form.data[prop] || []), value];
            if (prop === 'roleIdList') form.getRoleList();
            else form.getDepartmentList();
        };
    },
});
const checkCh = async(_rule:Rule,value:string) => {
                if (/[\u4e00-\u9fa5]/.test(value)) return Promise.reject($t('components.EditUserDialog.363802-30'));
                else return Promise.resolve('')
            }
const  dealRoleList = (data:any) =>{
    return data.map((item:any)=>{
        return {
            name: item.groupName,
            id: item.groupId,
            disabled: true,
            children: item?.roles ?  item.roles.map((i:any)=>{
            return {
                name:i.name,
                id:i.id
            }
        }) : []
        }
    })
}
// 组织已删除在仍显示在列表中
// const _departmentOptions = computed(() => {
//     return uniqBy([...form.departmentOptions, ...form._departmentOptions], 'id')
// })

form.init();

interface AxiosResponseRewrite<T = any[]> extends AxiosResponse<T, any> {
    result: T;
    success: boolean;
}
type axiosFunType = (data: any) => Promise<AxiosResponseRewrite<unknown>>;
type modalType = '' | 'add' | 'edit' | 'reset';
type formType = {
    id?: string;
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    roleIdList: string[];
    orgIdList: string[];
    telephone: string;
    email: string;
};
type dictType = {
    id: string;
    name: string;
    children?: dictType;
};
type optionType = {
    value: string;
    label: string;
};
</script>

<style lang="less" scoped>
.edit-dialog-container {
    .ant-form-item {
        &.flex {
            :deep(.ant-form-item-control-input-content) {
                display: flex;
                .ant-select {
                    flex: 1;
                }
                .ant-tooltip-disabled-compatible-wrapper {
                    .ant-btn {
                        color: rgba(0, 0, 0, 0.25);
                        border-color: #d9d9d9;
                        background: #f5f5f5;
                        text-shadow: none;
                        box-shadow: none;
                    }
                }
                .ant-btn {
                    width: 32px;
                    height: 32px;
                    border: 1px solid @primary-color;
                    color: @primary-color;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 8px;
                    cursor: pointer;
                }
            }
        }
    }
}
.formName{
    margin-bottom: 10px;
    font-size: 16px;
    &::before{
    width: 2px;
    background-color: rgb(184, 184, 184);
    display: inline-block;
    height: 13px;
    margin-right: 3px;
    content:''
    }
}
</style>
