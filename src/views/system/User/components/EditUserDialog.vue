<template>
    <a-modal
        visible
        :title="dialogTitle"
        :maskClosable="false"
        width="675px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        class="edit-dialog-container"
        :confirmLoading="loading"
        :cancelText="$t('components.EditUserDialog.939453-0')"
        :okText="$t('components.EditUserDialog.939453-1')"
    >
        <a-form ref="formRef" :model="form.data" layout="vertical">
            <div class="formName" v-if="form.IsShow('add', 'edit')">{{ $t('components.EditUserDialog.939453-2') }}</div>
            <a-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <a-col :span="24">
                    <a-form-item
                        name="name"
                        :label="$t('components.EditUserDialog.939453-3')"
                        :rules="[
                            { required: true, message: $t('components.EditUserDialog.939453-4') },
                            {
                                max: 64,
                                message: $t('components.EditUserDialog.939453-5'),
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.name"
                            :placeholder="$t('components.EditUserDialog.939453-4')"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <a-col :span="12">
                    <a-form-item
                        name="telephone"
                        :label="$t('components.EditUserDialog.939453-6')"
                        :rules="[
                            {
                                pattern: /^1[3456789]\d{9}$/,
                                message: $t('components.EditUserDialog.939453-7'),
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.telephone"
                            :placeholder="$t('components.EditUserDialog.939453-8')"
                            :maxlength="64"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        name="email"
                        :label="$t('components.EditUserDialog.939453-9')"
                        :rules="[
                            {
                                pattern:
                                    /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                                message: $t('components.EditUserDialog.939453-10'),
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.email"
                            :placeholder="$t('components.EditUserDialog.939453-11')"
                            :maxlength="64"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <a-col :span="12">
                    <a-form-item name="roleIdList" :label="$t('components.EditUserDialog.939453-12')" class="flex"
                        :rules="[
                            { required: form.data.username !== 'admin', message: $t('components.EditUserDialog.939453-13') },
                        ]"
                    >
                      <form-item-role :extraData="detail.roleList" :extraProps="{multiple: true}" :disabledData="disabledData.roles" v-model:value="form.data.roleIdList" :disabled="form.data.username === 'admin'" />
                      <div v-if="isNoCommunity" class="tip"><AIcon style="margin-right: 4px" type="ExclamationCircleOutlined" />{{$t('components.EditUserDialog.939453-33')}}</div>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="orgIdList" :label="$t('components.EditUserDialog.939453-14')" class="flex">
                      <form-item-org :extraData="detail.orgList" :extraProps="{multiple: true}" :disabledData="disabledData.orgIds" v-model:value="form.data.orgIdList" />
                      <div v-if="isNoCommunity" class="tip"><AIcon style="margin-right: 4px" type="ExclamationCircleOutlined" />{{$t('components.EditUserDialog.939453-33')}}</div>
                    </a-form-item>
                </a-col>
            </a-row>
          <a-row :gutter="24" v-if="form.IsShow('add', 'edit') && isNoCommunity">
            <a-col :span="12">
              <a-form-item name="positions" :label="$t('components.EditUserDialog.939453-31')">
                  <form-item-position :extraData="detail.positions" :extraProps="{disabled: form.data.username === 'admin', multiple: true}" v-model:value="form.data.positions" @change="onChange" />
              </a-form-item>
            </a-col>
          </a-row>
            <div class="formName" v-if="form.IsShow('add', 'edit')">{{ $t('components.EditUserDialog.939453-16') }}</div>
            <a-row :gutter="24" v-if="form.IsShow('add', 'edit')">
                <a-col :span="24">
                    <a-form-item
                        name="username"
                        :label="$t('components.EditUserDialog.939453-17')"
                        :validateFirst="true"
                        :rules="[
                            { required: true, message: $t('components.EditUserDialog.939453-18') },
                            {
                                validator: checkCh,
                                trigger: ['change', 'blur'],
                            },
                            {
                                validator: form.rules.checkUserName,
                                trigger: 'blur',
                            }
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.username"
                            :placeholder="$t('components.EditUserDialog.939453-18')"
                            :disabled="props.type === 'edit'"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row v-if="form.IsShow('add', 'reset')">
                <a-col :span="24">
                    <a-form-item
                        name="password"
                        :label="$t('components.EditUserDialog.939453-19')"
                        :rules="[
                            { required: true, message: '' },
                            {
                                validator: form.rules.checkPassword,
                                trigger: 'change',
                            },
                        ]"
                    >
                        <a-input-password
                            v-model:value="form.data.password"
                            :placeholder="$t('components.EditUserDialog.939453-20')"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row v-if="form.IsShow('add', 'reset')">
                <a-col :span="24">
                    <a-form-item
                        name="confirmPassword"
                        :label="$t('components.EditUserDialog.939453-21')"
                        :rules="[
                            { required: true, message: '' },
                            {
                                validator: form.rules.checkAgainPassword,
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <a-input-password
                            v-model:value="form.data.confirmPassword"
                            :placeholder="$t('components.EditUserDialog.939453-22')"
                            :maxlength="64"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue';
import {
    validateField_api,
    addUser_api,
    updateUser_api,
    updatePassword_api,
    getUser_api,
} from '@/api/system/user';
import { Rule } from 'ant-design-vue/es/form';
import { DefaultOptionType } from 'ant-design-vue/es/vc-tree-select/TreeSelect';
import { AxiosResponse } from 'axios';
import { passwordRegEx } from '@/utils/validate';
import { onlyMessage } from '@/utils/comm';
import {cloneDeep, flatten, map} from 'lodash-es';
import { useI18n } from 'vue-i18n';
import {queryPageNoPage} from "@/api/system/positions";
import {isNoCommunity} from '@/utils/utils';

const { t: $t } = useI18n();

const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    type: modalType;
    data: any;
    visible: boolean;
}>();
// 弹窗相关
const loading = ref(false);
const positionsMap = new Map()

const disabledData = reactive<{
  roles: any[],
  orgIds: any[]
}>({
  roles: [],
  orgIds: []
})
const detail = ref({})

const dialogTitle = computed(() => {
    if (props.type === 'add') return $t('components.EditUserDialog.939453-23');
    else if (props.type === 'edit') return $t('components.EditUserDialog.939453-24');
    else if (props.type === 'reset') return $t('components.EditUserDialog.939453-25');
    else return '';
});
const confirm = () => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(() => form.submit())
        .then((resp: any) => {
            if (resp.status === 200) {
                onlyMessage($t('components.EditUserDialog.939453-26'));
                emits('confirm');
                emits('update:visible', false);
            }
        })
        .finally(() => (loading.value = false));
};

const handleData = (data: string[], newData: string[], key: string) => {
  // 删除原本的数据，然后加入新的数据
  const _dataSet = new Set(data || []);
  (disabledData[key] || []).map((i: string) => {
    if(_dataSet.has(i)){
      _dataSet.delete(i)
    }
  })
  disabledData[key] = [...new Set(newData)]
  return [...new Set([...newData, ..._dataSet])]
}

const onChange = (value: string[]) => {
  const arr = (value || []).map(i => {
    return positionsMap.get(i) || i
  })

  const roles = map(flatten(map(arr, 'roles')), 'id').filter(i => i);
  const orgIds = map(arr, 'orgId').filter(i => i);

  form.data.roleIdList = handleData(form.data.roleIdList, roles, 'roles')
  form.data.orgIdList = handleData(form.data.orgIdList, orgIds, 'orgIds')
}

const formRef = ref<FormInstance>();
const _roleDetail = ref([] as any[]);
const form = reactive({
    data: {} as formType,
    rules: {
        checkUserName: (_rule: Rule, value: string): Promise<any> =>
            new Promise((resolve, reject) => {
                if(props.type==='edit') return resolve('')
                else if(!value) return reject($t('components.EditUserDialog.939453-18'));
                else if (value.length > 64) return reject($t('components.EditUserDialog.939453-5'));
                validateField_api('username', value).then((resp: any): any => {
                    resp.result.passed
                        ? resolve('')
                        : reject(resp.result.reason);
                });
            }),
        checkPassword: (_rule: Rule, value: string): Promise<any> =>
            new Promise((resolve, reject) => {
                if (!value) return reject($t('components.EditUserDialog.939453-20'));
                else if (value.length > 64) return reject($t('components.EditUserDialog.939453-5'));
                else if (value.length < 8) return reject($t('components.EditUserDialog.939453-27'));
                else if (!passwordRegEx(value))
                    return reject($t('components.EditUserDialog.939453-28'));
                validateField_api('password', value).then((resp: any) => {
                    resp.result.passed
                        ? resolve('')
                        : reject(resp.result.reason);
                });
            }),
        checkAgainPassword: (_rule: Rule, value: string): Promise<any> => {
            if (!value) return Promise.reject($t('components.EditUserDialog.939453-22'));
            return value === form.data.password
                ? Promise.resolve()
                : Promise.reject($t('components.EditUserDialog.939453-29'));
        },
    },

    roleOptions: [],
    _departmentOptions: [] as DefaultOptionType[],

    init: () => {
        form.getUserInfo();
    },
    getUserInfo: () => {
        const id = props.data.id || '';
        if (props.type === 'add') form.data = {} as formType;
        else if (props.type === 'reset') form.data = { id } as formType;
        else if (props.type === 'edit') {
            getUser_api(id).then((resp: any) => {
                detail.value = resp.result;
                _roleDetail.value = resp.result.roleList;
                form.data = {
                    ...(resp.result as formType),
                    orgIdList: resp.result.orgList.map(
                        (item: dictType) => item.id,
                    ),
                    roleIdList: resp.result.roleList.map(
                        (item: dictType) => item.id,
                    ),
                  positions: resp.result.positions?.map(item => item.id)
                };
                onChange(form.data.positions)

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
        const { positions, ...extraFormData} = form.data
        if (props.type === 'add') {
            api = addUser_api;
            params = {
                user: extraFormData,
                orgIdList: form.data.orgIdList,
                roleIdList: form.data.roleIdList,
                positions: positions,
            };
        } else if (props.type === 'edit') {
            api = updateUser_api;
            params = {
                id: form.data.id,
                user: extraFormData,
                orgIdList: form.data.orgIdList,
                roleIdList: form.data.roleIdList,
                positions: positions,
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
    IsShow: (...typeList: modalType[]) => typeList.includes(props.type),
});
const checkCh = async(_rule:Rule,value:string) => {
                if (/[\u4e00-\u9fa5]/.test(value)) return Promise.reject($t('components.EditUserDialog.939453-30'));
                else return Promise.resolve('')
            }

// 组织已删除在仍显示在列表中
// const _departmentOptions = computed(() => {
//     return uniqBy([...form.departmentOptions, ...form._departmentOptions], 'id')
// })

const hasNodeWithId = (arr: any, id: any)=>{
    for (let item of arr) {
        if (item.id === id) {
            return true;
        }
        if (item.children && hasNodeWithId(item.children, id)) {
            return true;
        }
    }
    return false;
}

onMounted(() => {
  if(isNoCommunity) {
    queryPageNoPage({
      paging: false,
      sorts: [{name: 'sortIndex', order: 'asc'}]
    }).then(resp => {
      if(resp.success){
        resp.result.map(i => {
          positionsMap.set(i.id, i)
        })
      }
    })
  }
  form.init();
})

watch(
    () => _roleDetail.value,
    (val) => {
        if (val && form.roleOptions.length) {
            const tree = cloneDeep(form.roleOptions);
            val.forEach((item: any) => {
                if (!hasNodeWithId(tree, item.id)) {
                    form.roleOptions.push(item);
                }
            });
        }
    },
    { immediate: true },
);

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
    positions: string[];
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

.tip {
  color: rgba(0,0,0,.65);
  margin-top: 4px;
}
</style>
