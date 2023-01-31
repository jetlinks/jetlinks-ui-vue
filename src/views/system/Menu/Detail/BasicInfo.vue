<template>
    <div class="basic-info-container">
        <a-card>
            <h3>基本信息</h3>
            <a-form :model="form.data" class="basic-form">
                <div class="row" style="display: flex">
                    <a-form-item
                        label="菜单图标"
                        name="icon"
                        :rules="[
                            {
                                required: true,
                                message: '请上传图标',
                            },
                        ]"
                        style="flex: 0 0 186px"
                    >
                        <div class="icon-upload has-icon" v-if="form.data.icon">
                            <svg aria-hidden="true">
                                <use :xlinkHref="`#${form.data.icon}`" />
                            </svg>
                            <span class="mark">点击修改</span>
                        </div>

                        <div v-else class="icon-upload no-icon">
                            <span>
                                <plus-outlined style="font-size: 30px" />
                                <p>点击选择图标</p>
                            </span>
                        </div>
                    </a-form-item>
                    <a-row :gutter="24" style="flex: 1 1 auto">
                        <a-col :span="12">
                            <a-form-item
                                label="名称"
                                name="name"
                                :rules="[
                                    { required: true, message: '请输入名称' },
                                    { max: 64, message: '最多可输入64个字符' },
                                ]"
                            >
                                <a-input v-model:value="form.data.name" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="编码"
                                name="code"
                                :rules="[
                                    { required: true, message: '请输入编码' },
                                    { max: 64, message: '最多可输入64个字符' },
                                ]"
                            >
                                <a-input v-model:value="form.data.code" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="页面地址"
                                name="url"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入页面地址',
                                    },
                                    { max: 128, message: '最多可输入128字符' },
                                ]"
                            >
                                <a-input v-model:value="form.data.url" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                label="排序"
                                name="sortIndex"
                                :rules="[
                                    {
                                        pattern: /^[0-9]*[1-9][0-9]*$/,
                                        message: '请输入大于0的整数',
                                    },
                                ]"
                            >
                                <a-input v-model:value="form.data.sortIndex" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>

                <a-form-item label="说明" name="describe">
                    <a-textarea
                        v-model:value="form.data.describe"
                        :rows="4"
                        placeholder="请输入说明"
                    />
                </a-form-item>
            </a-form>
        </a-card>
        <a-card>
            <h3>权限配置</h3>
            <a-form :model="form.data" class="basic-form permiss-form">
                <a-form-item name="accessSupport" required>
                    <template #label>
                        <span style="margin-right: 3px">数据权限控制</span>
                        <a-tooltip title="此菜单页面数据所对应的资产类型">
                            <question-circle-outlined
                                class="img-style"
                                style="color: #a6a6a6"
                            />
                        </a-tooltip>
                    </template>
                    <a-radio-group
                        v-model:value="form.data.accessSupport"
                        name="radioGroup"
                    >
                        <a-radio value="unsupported">不支持</a-radio>
                        <a-radio value="support">支持</a-radio>
                        <a-radio value="indirect">
                            <span style="margin-right: 3px">间接控制</span>
                            <a-tooltip
                                title="此菜单内的数据基于其他菜单的数据权限控制"
                            >
                                <question-circle-filled class="img-style" />
                            </a-tooltip>
                        </a-radio>
                    </a-radio-group>

                    <a-form-item
                        name="assetType"
                        v-if="form.data.accessSupport === 'support'"
                        :rules="[{ required: true, message: '请选择资产类型' }]"
                        style="margin-top: 24px; margin-bottom: 0"
                    >
                        <a-select
                            v-model:value="form.data.assetType"
                            style="width: 500px"
                            placeholder="请选择资产类型"
                        >
                            <a-select-option
                                v-for="item in form.assetsType"
                                :value="item.value"
                                >{{ item.label }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>

                    <a-form-item
                        name="indirectMenus"
                        v-if="form.data.accessSupport === 'indirect'"
                        :rules="[{ required: true, message: '请选择关联菜单' }]"
                        style="margin-top: 24px; margin-bottom: 0"
                    >
                        <a-tree-select
                            v-model:value="form.data.indirectMenus"
                            style="width: 400px"
                            :dropdown-style="{
                                maxHeight: '400px',
                                overflow: 'auto',
                            }"
                            placeholder="请选择关联菜单"
                            multiple
                            show-search
                            tree-default-expand-all
                            :tree-data="form.treeData"
                        >
                            <template #title="{ value: val, title }">
                                <b
                                    v-if="val === 'parent 1-1'"
                                    style="color: #08c"
                                    >{{ val }}</b
                                >
                                <template v-else>{{ title }}</template>
                            </template>
                        </a-tree-select>
                    </a-form-item>
                </a-form-item>
                <a-form-item label="权限">
                    <a-input
                        v-model:value="form.data.permissions"
                        style="width: 300px"
                        allowClear
                        placeholder="请输入权限名称"
                    />
                </a-form-item>
            </a-form>

            <a-button type="primary" @click="clickSave">保存</a-button>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import {
    PlusOutlined,
    QuestionCircleFilled,
    QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import {
    getMenuTree_api,
    getAssetsType_api,
    getMenuDetail_api,
} from '@/api/system/menu';
import { exportPermission_api } from '@/api/system/permission';

const route = useRoute();
const routeParams = {
    id: route.params.id === ':id' ? '' : (route.params.id as string),
    ...route.query,
    url: route.query.basePath,
};

const form = reactive({
    data: {
        name: '',
        code: '',
        sortIndex: '',
        icon: '',
        describe: '',
        permissions: '',
        accessSupport: '',
        assetType: undefined,
        indirectMenus: [],
        ...routeParams,
    } as formType,

    treeData: [], // 关联菜单
    assetsType: [] as assetType[], // 资产类型
    premissonList: [], // 权限列表

    init: () => {
        // 获取菜单详情
        routeParams.id &&
            getMenuDetail_api(routeParams.id).then((resp) => {
                console.log('菜单详情', resp);
            });
        // 获取权限列表
        // exportPermission_api()
        // 获取关联菜单
        getMenuTree_api({ paging: false }).then((resp) => {
            console.log('关联菜单', resp);
        });
        // 获取资产类型
        getAssetsType_api().then((resp:any) => {
            form.assetsType = resp.result.map((item:any)=>({label:item.name,value:item.id}))
        });
    },
});
form.init();
const clickSave = () => {};

type formType = {
    name: string;
    code: string;
    url: string;
    sortIndex: string;
    icon: string;
    permissions: string;
    describe: string;
    accessSupport: string;
    assetType: string | undefined;
    indirectMenus: any[];
};

type assetType = {
    label: string;
    value: string;
};
</script>

<style lang="less" scoped>
.basic-info-container {
    .ant-card {
        margin-bottom: 24px;

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
