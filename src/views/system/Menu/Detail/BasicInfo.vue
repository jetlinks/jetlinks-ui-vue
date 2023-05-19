<template>
    <div class="basic-info-container">
        <div class="card">
            <h3>基本信息</h3>
            <j-form ref="basicFormRef" :model="form.data" class="basic-form">
                <div class="row" style="display: flex">
                    <j-form-item
                        label="菜单图标"
                        name="icon"
                        :rules="[
                            {
                                required: true,
                                message: '请上传图标',
                                trigger: 'change',
                            },
                        ]"
                        style="flex: 0 0 186px"
                    >
                        <div class="icon-upload has-icon" v-if="form.data.icon">
                            <AIcon
                                :type="form.data.icon"
                                style="font-size: 90px"
                            />
                            <span class="mark" @click="dialogVisible = true"
                                >点击修改</span
                            >
                        </div>

                        <div
                            v-else
                            @click="dialogVisible = true"
                            class="icon-upload no-icon"
                        >
                            <span>
                                <AIcon
                                    type="PlusOutlined"
                                    style="font-size: 30px"
                                />
                                <p>点击选择图标</p>
                            </span>
                        </div>
                    </j-form-item>
                    <j-row :gutter="24" style="flex: 1 1 auto">
                        <j-col :span="12">
                            <j-form-item
                                label="名称"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入名称',
                                        trigger: 'change',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                        trigger: 'change',
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="form.data.name"
                                    placeholder="请输入名称"
                                />
                            </j-form-item>
                        </j-col>
                        <j-col :span="12">
                            <j-form-item
                                label="编码"
                                name="code"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入编码',
                                        trigger: 'change',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                        trigger: 'change',
                                    },
                                    {
                                        validator: form.checkCode,
                                        trigger: 'blur',
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="form.data.code"
                                    placeholder="请输入编码"
                                />
                            </j-form-item>
                        </j-col>
                        <j-col :span="12">
                            <j-form-item
                                label="页面地址"
                                name="url"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入页面地址',
                                    },
                                    { max: 128, message: '最多可输入128字符' },
                                    { pattern: /^\// ,message:'请正确填写地址，以/开头'},
                                ]"
                            >
                                <j-input
                                    v-model:value="form.data.url"
                                    placeholder="请输入页面地址"
                                />
                            </j-form-item>
                        </j-col>
                        <j-col :span="12">
                            <j-form-item
                                label="排序"
                                name="sortIndex"
                                :rules="[
                                    {
                                        pattern: /^[0-9]*[1-9][0-9]*$/,
                                        message: '请输入大于0的整数',
                                    },
                                ]"
                            >
                                <j-input-number
                                    v-model:value="form.data.sortIndex"
                                    placeholder="请输入排序"
                                    style="width: 100%"
                                />
                            </j-form-item>
                        </j-col>
                    </j-row>
                </div>

                <j-form-item label="说明" name="describe">
                    <j-textarea
                        v-model:value="form.data.describe"
                        :rows="4"
                        show-count
                        :maxlength="200"
                        placeholder="请输入说明"
                    />
                </j-form-item>
            </j-form>
        </div>
        <div class="card">
            <h3>权限配置</h3>
            <j-form
                ref="permissFormRef"
                :model="form.data"
                class="basic-form permiss-form"
            >
                <j-form-item name="accessSupport" required v-if="isNoCommunity">
                    <template #label>
                        <span style="margin-right: 3px">数据权限控制</span>
                        <j-tooltip title="此菜单页面数据所对应的资产类型">
                            <AIcon
                                type="QuestionCircleOutlined"
                                class="img-style"
                                style="color: #a6a6a6"
                            />
                        </j-tooltip>
                    </template>
                    <j-radio-group
                        v-model:value="form.data.accessSupport"
                        name="radioGroup"
                    >
                        <j-radio value="unsupported">不支持</j-radio>
                        <j-radio value="support">支持</j-radio>
                        <j-radio value="indirect">
                            <span style="margin-right: 3px">间接控制</span>
                            <j-tooltip
                                title="此菜单内的数据基于其他菜单的数据权限控制"
                            >
                                <AIcon
                                    type="QuestionCircleFilled"
                                    class="img-style"
                                />
                            </j-tooltip>
                        </j-radio>
                    </j-radio-group>

                    <j-form-item
                        name="assetType"
                        v-if="form.data.accessSupport === 'support'"
                        :rules="[{ required: true, message: '请选择资产类型' }]"
                        style="margin-top: 24px; margin-bottom: 0"
                    >
                        <j-select
                            v-model:value="form.data.assetType"
                            style="width: 500px"
                            placeholder="请选择资产类型"
                            show-search
                            :options="form.assetsType"
                        >
                            <!-- <j-select-option
                                v-for="item in form.assetsType"
                                :value="item.value"
                                >{{ item.label }}</j-select-option
                            > -->
                        </j-select>
                    </j-form-item>

                    <j-form-item
                        name="indirectMenus"
                        v-if="form.data.accessSupport === 'indirect'"
                        :rules="[{ required: true, message: '请选择关联菜单' }]"
                        style="margin-top: 24px; margin-bottom: 0"
                    >
                        <j-tree-select
                            v-model:value="form.data.indirectMenus"
                            style="width: 400px"
                            :dropdown-style="{
                                maxHeight: '400px',
                                overflow: 'auto',
                            }"
                            placeholder="请选择关联菜单"
                            multiple
                            show-search
                            :tree-data="form.treeData"
                            :field-names="{
                                children: 'children',
                                label: 'name',
                                value: 'id',
                            }"
                        >
                        </j-tree-select>
                    </j-form-item>
                </j-form-item>
                <j-form-item label="权限">
                    <PermissChoose
                        :first-width="3"
                        max-height="350px"
                        v-model:value="form.data.permissions"
                        :key="form.data.id || ''"
                    />
                </j-form-item>
            </j-form>

            <PermissionButton
                type="primary"
                :hasPermission="`${permission}:${
                    route.params.id === ':id' ? 'add' : 'update'
                }`"
                @click="form.clickSave"
                :loading='form.saveLoading'
            >
                保存
            </PermissionButton>
        </div>

        <!-- 弹窗 -->
        <ChooseIconDialog
            v-if="dialogVisible"
            v-model:visible="dialogVisible"
            @confirm="(typeStr:string)=>form.data.icon = typeStr"
        />
    </div>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import { FormInstance } from 'ant-design-vue';
import { message } from 'jetlinks-ui-components';
import ChooseIconDialog from '../components/ChooseIconDialog.vue';
import PermissChoose from '../components/PermissChoose.vue';
import {
    getMenuTree_api,
    getAssetsType_api,
    getMenuInfo_api,
    saveMenuInfo_api,
    addMenuInfo_api,
    validCode_api,
} from '@/api/system/menu';
import { Rule } from 'ant-design-vue/lib/form';
import { isNoCommunity } from '@/utils/utils';

const permission = 'system/Menu';
// 路由
const route = useRoute();
const router = useRouter();
const routeParams = {
    id: route.params.id === ':id' ? undefined : (route.params.id as string),
    ...route.query,
    url: route.query.basePath,
    parentId: route.query.pid,
};

// 表单
const basicFormRef = ref<FormInstance>();
const permissFormRef = ref<FormInstance>();
const form = reactive({
    data: {
        name: '',
        code: '',
        sortIndex: '',
        icon: '',
        describe: '',
        permissions: [],
        accessSupport: 'unsupported',
        assetType: undefined,
        indirectMenus: [],
        ...routeParams,
    } as formType,
    treeData: [], // 关联菜单
    assetsType: [] as assetType[], // 资产类型
    saveLoading: false,
    sourceCode: '', // 原本的code

    init: () => {
        // 获取菜单详情
        routeParams.id &&
            getMenuInfo_api(routeParams.id).then((resp: any) => {
                form.data = {
                    ...(resp.result as formType),
                    accessSupport:
                        resp.result?.accessSupport?.value || 'unsupported',
                };
                form.sourceCode = resp.result.code;
            });

        if (isNoCommunity) {
          // 获取关联菜单
          getMenuTree_api({ paging: false }).then((resp: any) => {
              form.treeData = resp.result;
          });
          // 获取资产类型
          getAssetsType_api().then((resp: any) => {
              form.assetsType = resp.result.map((item: any) => ({
                  label: item.name,
                  value: item.id,
              }));
          });
        }
    },
    checkCode: async (_rule: Rule, value: string): Promise<any> => {
        if (!value) return Promise.reject('');
        else if (value.length > 64) return Promise.reject('最多可输入64个字符');
        // 编辑时不校验原本的编码
        else if (routeParams.id && value === form.sourceCode)
            return Promise.resolve('');
        else {
            const resp: any = await validCode_api({
                code: value,
                owner: 'iot',
            });
            if (resp.result.passed) return Promise.resolve();
            else return Promise.reject('该编码重复');
        }
    },
    clickSave: () => {
        if (!basicFormRef || !permissFormRef) return;
        Promise.all([
            basicFormRef.value?.validate(),
            permissFormRef.value?.validate(),
        ])
            .then(() => {
                const api = routeParams.id ? saveMenuInfo_api : addMenuInfo_api;
                form.saveLoading = true;
                const accessSupportValue = form.data.accessSupport;
                const params = {
                    ...form.data,
                    accessSupport: {
                        value: accessSupportValue,
                        label:
                            accessSupportValue === 'unsupported'
                                ? '不支持'
                                : accessSupportValue === 'support'
                                ? '支持'
                                : '间接控制',
                    },
                    owner: 'iot',
                };
                api(params)
                    .then((resp: any) => {
                        if (resp.status === 200) {
                            message.success('操作成功！');
                            // 新增后刷新页面，编辑则不需要
                            if (!routeParams.id) {
                                router.push(
                                    `/system/Menu/detail/${resp.result.id}`,
                                );
                                routeParams.id = resp.result.id;
                                form.init();
                            }
                        } else {
                            message.error('操作失败！');
                        }
                    })
                    .finally(() => (form.saveLoading = false));
            })
            .catch((err) => {});
    },
});
form.init();

// 弹窗
const dialogVisible = ref(false);

type formType = {
    id?: string;
    name: string;
    code: string;
    url: string;
    sortIndex: string;
    icon: string;
    permissions: any[];
    describe: string;
    accessSupport: string;
    assetType: string | undefined;
    indirectMenus: any[];
    parentId?: string;
};

type assetType = {
    label: string;
    value: string;
};
</script>

<style lang="less" scoped>
.basic-info-container {
    .card {
        margin-bottom: 24px;
        padding: 24px;
        background-color: #fff;

        h3 {
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 4px 0 4px 12px;
            font-weight: bold;
            font-size: 16px;

            &::before {
                position: absolute;
                top: 5px px;
                left: 0;
                width: 4px;
                height: calc(100% - 10px);
                background-color: #1d39c4;
                border-radius: 2px;
                content: ' ';
            }
        }

        .basic-form {
            .ant-form-item {
                display: block;
                :deep(.ant-form-item-label) {
                    overflow: inherit;
                    .img-style {
                        cursor: help;
                    }
                    label::after {
                        display: none;
                    }
                }
                :deep(.ant-form-item-control-input-content) {
                    .icon-upload {
                        width: 160px;
                        height: 150px;
                        border: 1px dashed #d9d9d9;
                        font-size: 14px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        cursor: pointer;
                        transition: 0.5s;
                        &:hover {
                            border-color: #415ed1;
                        }
                    }
                    .has-icon {
                        position: relative;
                        text-align: center;

                        .mark {
                            position: absolute;
                            left: 0;
                            top: 0;
                            display: none;
                            background-color: rgba(0, 0, 0, 0.35);
                            color: #fff;
                            width: 100%;
                            height: 100%;
                            font-size: 16px;
                            align-items: center;
                            justify-content: center;
                        }
                        &:hover .mark {
                            display: flex;
                        }
                    }
                    .no-icon {
                        background-color: rgba(0, 0, 0, 0.06);
                    }
                }
            }
        }
    }
}
</style>
