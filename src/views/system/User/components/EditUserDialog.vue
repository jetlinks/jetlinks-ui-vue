<template>
    <a-modal
        v-model:visible="dialog.visible"
        :title="dialog.title"
        width="675px"
        @ok="dialog.handleOk"
        class="edit-dialog-container"
        :confirmLoading="dialog.loading"
        cancelText="取消"
        okText="确定"
    >
        <a-form ref="formRef" :model="form.data" layout="vertical">
            <a-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <a-col :span="12">
                    <a-form-item
                        name="name"
                        label="姓名"
                        :rules="[
                            { required: true, message: '请输入姓名' },
                            {
                                max: 64,
                                message: '最多可输入64个字符',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.name"
                            placeholder="请输入姓名"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        name="username"
                        label="用户名"
                        :rules="[
                            { required: true },
                            {
                                validator: form.rules.checkUserName,
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.username"
                            placeholder="请输入用户名"
                            :disabled="dialog.type === 'edit'"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row v-if="form.IsShow('add', 'reset')">
                <a-col :span="24">
                    <a-form-item
                        name="password"
                        label="密码"
                        :rules="[
                            { required: true },
                            {
                                validator: form.rules.checkPassword,
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <a-input-password
                            v-model:value="form.data.password"
                            placeholder="请输入密码"
                        />
                        <!-- <Progress
                            :percent="20"
                            :steps="5"
                            :strokeColor="{ from: '#ff5500', to: '#ff9300' }"
                        /> -->
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row v-if="form.IsShow('add', 'reset')">
                <a-col :span="24">
                    <a-form-item
                        name="confirmPassword"
                        label="确认密码"
                        :rules="[
                            { required: true, message: '请输入8~64位的密码' },
                            {
                                validator: form.rules.checkAgainPassword,
                                trigger: 'change',
                            },
                        ]"
                    >
                        <a-input-password
                            v-model:value="form.data.confirmPassword"
                            placeholder="请再次输入密码"
                            :maxlength="64"
                        />
                        <!-- <Progress
                            :percent="60"
                            :steps="5"
                            :strokeColor="{ from: '#ff5500', to: '#ff9300' }"
                        /> -->
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <a-col :span="12">
                    <a-form-item name="roleIdList" label="角色" class="flex">
                        <a-select
                            v-model:value="form.data.roleIdList"
                            mode="multiple"
                            style="width: 100%"
                            placeholder="请选择角色"
                            :options="form.roleOptions"
                        ></a-select>
                        <PermissionButton
                            :uhasPermission="`${rolePermission}:update`"
                            @click="form.clickAddItem('roleIdList', 'Role')"
                            class="add-item"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="orgIdList" label="组织" class="flex">
                        <a-tree-select
                            v-model:value="form.data.orgIdList"
                            show-search
                            style="width: 100%"
                            placeholder="请选择组织"
                            multiple
                            :tree-data="form.departmentOptions"
                            :fieldNames="{ label: 'name', value: 'id' }"
                        >
                            <template #title="{ name }">
                                {{ name }}
                            </template>
                        </a-tree-select>
                        <PermissionButton
                            :uhasPermission="`${deptPermission}:update`"
                            @click="form.clickAddItem('roleIdList', 'Role')"
                            class="add-item"
                        >
                            <AIcon type="PlusOutlined" />
                        </PermissionButton>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <a-col :span="12">
                    <a-form-item
                        name="telephone"
                        label="手机号"
                        :rules="[
                            {
                                pattern: /^1[3456789]\d{9}$/,
                                message: '请输入正确的手机号',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.telephone"
                            placeholder="请输入手机号"
                            :maxlength="64"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        name="email"
                        label="邮箱"
                        :rules="[
                            {
                                pattern:
                                    /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                                message: '请输入正确的邮箱',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.email"
                            placeholder="请输入邮箱"
                            :maxlength="64"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import { FormInstance, message } from 'ant-design-vue';
// import Progress from './Progress.vue';
import {
    validateField_api,
    getRoleList_api,
    getDepartmentList_api,
    addUser_api,
    updateUser_api,
    updatePassword_api,
    getUser_api,
} from '@/api/system/user';
import { Rule } from 'ant-design-vue/es/form';
import { DefaultOptionType } from 'ant-design-vue/es/vc-tree-select/TreeSelect';
import { AxiosResponse } from 'axios';

const deptPermission = 'system/Department';
const rolePermission = 'system/Role';

const emits = defineEmits(['confirm']);
// 弹窗相关
const dialog = reactive({
    title: '',
    visible: false,
    type: '' as modalType,
    loading: false,

    handleOk: () => {
        formRef.value?.validate().then(() => {
            form.submit(() => {
                dialog.changeVisible('', {} as any);
                emits('confirm');
            });
        });
    },
    /**
     * 设置表单类型
     * @param type 弹窗类型
     * @param defaultForm 表单回显对象
     */
    changeVisible: (type: modalType, defaultForm: formType) => {
        dialog.setTitle(type);
        form.getUserInfo(defaultForm.id || '', type);
        dialog.type = type;
        dialog.visible = type !== '';
    },
    setTitle: (type: modalType) => {
        if (type === 'add') dialog.title = '新增';
        else if (type === 'edit') dialog.title = '编辑';
        else if (type === 'reset') dialog.title = '重置密码';
        else dialog.title = '';
    },
});
// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});
const formRef = ref<FormInstance>();
const form = reactive({
    data: {} as formType,

    rules: {
        checkUserName: (_rule: Rule, value: string): Promise<any> =>
            new Promise((resolve, reject) => {
                console.log(_rule);
                if (dialog.type === 'edit') return resolve('');

                if (!value) return reject('请输入用户名');
                else if (value.length > 64) return reject('最多可输入64个字符');
                validateField_api('username', value).then((resp: any): any => {
                    resp.result.passed
                        ? resolve('')
                        : reject(resp.result.reason);
                });
            }),
        checkPassword: (_rule: Rule, value: string): Promise<any> =>
            new Promise((resolve, reject) => {
                if (!value) return reject('请输入8~64位的密码');
                else if (value.length > 64) return reject('最多可输入64个字符');
                else if (value.length < 8) return reject('密码不能少于8位');
                validateField_api('password', value).then((resp: any) => {
                    resp.result.passed
                        ? resolve('')
                        : reject(resp.result.reason);
                });
            }),
        checkAgainPassword: (_rule: Rule, value: string): Promise<any> => {
            if (!value) return Promise.reject('');
            return value === form.data.password
                ? Promise.resolve()
                : Promise.reject('两次密码输入不一致');
        },
        //
    },

    roleOptions: [] as optionType[],
    departmentOptions: [] as DefaultOptionType[],

    init: () => {
        form.getDepartmentList();
        form.getRoleList();
    },
    getUserInfo: (id: string, type: modalType) => {
        if (type === 'add') form.data = {} as formType;
        else if (type === 'reset') form.data = { id } as formType;
        else if (type === 'edit') {
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
                nextTick(() => {
                    formRef.value?.clearValidate();
                });
            });
        }
    },
    submit: (cb?: Function) => {
        let api: axiosFunType;
        let params = {};
        switch (dialog.type) {
            case 'add': {
                api = addUser_api;
                params = {
                    user: form.data,
                    orgIdList: form.data.orgIdList,
                    roleIdList: form.data.roleIdList,
                };
                break;
            }
            case 'edit': {
                api = updateUser_api;
                params = {
                    id: form.data.id,
                    user: form.data,
                    orgIdList: form.data.orgIdList,
                    roleIdList: form.data.roleIdList,
                };
                break;
            }
            case 'reset': {
                api = updatePassword_api;
                params = {
                    id: form.data.id,
                    password: form.data.password,
                };
                break;
            }
            default:
                return;
        }
        console.log(params);

        api(params).then(() => {
            message.success('操作成功');
            cb && cb();
        });
    },
    getRoleList: () => {
        getRoleList_api().then((resp: any) => {
            form.roleOptions = resp.result.map((item: dictType) => ({
                label: item.name,
                value: item.id,
            }));
        });
    },
    getDepartmentList: () => {
        getDepartmentList_api().then((resp: any) => {
            form.departmentOptions = resp.result;
        });
    },
    IsShow: (...typeList: modalType[]) => typeList.includes(dialog.type),
    clickAddItem: (prop: 'roleIdList' | 'orgIdList', target: string) => {
        const tab: any = window.open(`${origin}/#/system/${target}?save=true`);
        tab.onSaveSuccess = (value: string) => {
            form.data[prop] = [...(form.data[prop] || []), value];
            if (prop === 'roleIdList') form.getRoleList();
            else form.getDepartmentList();
        };
    },
});
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
                .ant-btn {
                    width: 32px;
                    height: 32px;
                    border: 1px solid #1d39c4;
                    color: #1d39c4;
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
</style>
