<template>
    <a-modal
        class="edit-dialog-container"
        :title="$t('components.ThirdMenu.045501-0')"
        visible
        width="800px"
        :maskClosable="false"
        @cancel="cancel"
        @ok="cancel"
    >
        <div style="display: flex">
            <div class="menuList">
                {{ $t('components.ThirdMenu.045501-1') }}
                <div class="content">
                    <j-permission-button
                        type="link"
                        :hasPermission="`${permission}:add`"
                        @click="addMenu"
                    >
                        {{ $t('components.ThirdMenu.045501-2') }}
                    </j-permission-button>
                    <div class="treeContainer">
                        <a-tree
                            :fieldNames="{
                                title: 'name',
                                key: 'id',
                                children: 'children',
                            }"
                            :treeData="treeData"
                        >
                            <template #title="data">
                                <div class="tree-item">
                                    <div class="title">
                                        <j-ellipsis>{{ data.name }}</j-ellipsis>
                                    </div>
                                    <div class="menuControls">
                                        <j-permission-button
                                            v-if="data.options?.owner"
                                            type="link"
                                            :hasPermission="`${permission}:update`"
                                            :tooltip="$t('components.ThirdMenu.045501-3')"
                                            @click="() => editMenu(data)"
                                        >
                                            <AIcon type="EditOutlined" />
                                        </j-permission-button>
                                        <j-permission-button
                                            type="link"
                                            :hasPermission="`${permission}:add`"
                                            :tooltip="{
                                                title:
                                                    data.level >= 3
                                                        ? $t('components.ThirdMenu.045501-4')
                                                        : $t('components.ThirdMenu.045501-5'),
                                            }"
                                            :disabled="
                                                data.level >= 3 ||
                                                data.options?.LowCode
                                            "
                                            @click="() => addChildrenMenu(data)"
                                        >
                                            <AIcon type="PlusCircleOutlined" />
                                        </j-permission-button>
                                        <j-permission-button
                                            v-if="data.options?.owner"
                                            type="link"
                                            :hasPermission="`${permission}:delete`"
                                            :tooltip="$t('components.ThirdMenu.045501-6')"
                                            :popConfirm="{
                                                title: $t('components.ThirdMenu.045501-7'),
                                                onConfirm: () =>
                                                    deleteMenu(data),
                                            }"
                                        >
                                            <AIcon type="DeleteOutlined" />
                                        </j-permission-button>
                                    </div>
                                </div>
                            </template>
                        </a-tree>
                    </div>
                </div>
            </div>
            <div class="configuration" v-if="showControls">
                {{ $t('components.ThirdMenu.045501-8') }}
                <div class="content">
                    <div class="saveBtn">
                        <j-permission-button
                            type="primary"
                            :hasPermission="`${permission}:${
                                editType === 'add' ? 'add' : 'update'
                            }`"
                            :loading="saveLoading"
                            @click="saveMenu"
                        >
                            {{ $t('components.ThirdMenu.045501-9') }}
                        </j-permission-button>
                    </div>
                    <a-form
                        ref="basicFormRef"
                        :model="formData"
                        class="basic-form"
                        layout="vertical"
                    >
                        <div class="row" style="display: flex">
                            <a-form-item
                                ref="uploadIcon"
                                :label="$t('components.ThirdMenu.045501-10')"
                                name="icon"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('components.ThirdMenu.045501-11'),
                                        trigger: 'change',
                                    },
                                ]"
                                style="flex: 0 0 186px"
                            >
                                <div
                                    class="icon-upload has-icon"
                                    v-if="formData.icon"
                                >
                                    <AIcon
                                        :type="formData.icon"
                                        style="font-size: 90px"
                                    />
                                    <span
                                        class="mark"
                                        @click="dialogVisible = true"
                                        >{{ $t('components.ThirdMenu.045501-12') }}</span
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
                                        <p>{{ $t('components.ThirdMenu.045501-13') }}</p>
                                    </span>
                                </div>
                            </a-form-item>
                            <a-row>
                                <a-col :span="24">
                                    <a-form-item
                                        :label="$t('components.ThirdMenu.045501-14')"
                                        name="name"
                                        :rules="[
                                            {
                                                required: true,
                                                message: $t('components.ThirdMenu.045501-15'),
                                            },
                                            {
                                                max: 64,
                                                message: $t('components.ThirdMenu.045501-16'),
                                            },
                                        ]"
                                    >
                                        <a-input
                                            v-model:value="formData.name"
                                            :placeholder="$t('components.ThirdMenu.045501-15')"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="24">
                                    <a-form-item
                                        :label="$t('components.ThirdMenu.045501-17')"
                                        name="code"
                                        :validateFirst="true"
                                        :rules="[
                                            {
                                                required: true,
                                                message: $t('components.ThirdMenu.045501-18'),
                                            },
                                            {
                                                max: 64,
                                                message: $t('components.ThirdMenu.045501-16'),
                                            },
                                            {
                                                validator: checkCode,
                                                trigger: 'blur',
                                            },
                                        ]"
                                    >
                                        <a-input
                                            v-model:value="formData.code"
                                            :placeholder="$t('components.ThirdMenu.045501-18')"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </div>
                        <a-form-item
                            :label="$t('components.ThirdMenu.045501-19')"
                            name="url"
                            :validateFirst="true"
                            :rules="[
                                {
                                    required: true,
                                    message: $t('components.ThirdMenu.045501-20'),
                                },
                                { max: 128, message: $t('components.ThirdMenu.045501-21') },
                                {
                                    pattern: /^\//,
                                    message: $t('components.ThirdMenu.045501-22'),
                                },
                            ]"
                        >
                            <a-input
                                v-model:value="formData.url"
                                :placeholder="$t('components.ThirdMenu.045501-20')"
                            />
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div>
        <ChooseIconDialog
            v-if="dialogVisible"
            v-model:visible="dialogVisible"
            :icon="formData.icon"
            @save="(typeStr: string) => choseIcon(typeStr)"
        />
    </a-modal>
</template>

<script name="ThirdMenu" setup lang="ts">
import {
    getMenuTree_api,
    validCode_api,
    addMenuInfo_api,
    saveMenuInfo_api,
    getMenuInfo_api,
    delMenuInfo_api,
} from '@/api/system/menu';
import { USER_CENTER_MENU_CODE, messageSubscribe } from '@/utils/consts';
import ChooseIconDialog from '../../Menu/components/ChooseIconDialog.vue';
import { Rule } from 'ant-design-vue/lib/form';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(['cancel']);
const permission = 'system/Menu';
const basicFormRef = ref();
const treeData = ref([]);
const formData = ref<any>({
    icon: '',
    name: '',
    code: '',
    url: '',
    sortIndex: 0,
});
const sourceCode = ref();
const dialogVisible = ref(false);
const uploadIcon = ref();
const showControls = ref(false);
const editType = ref();
const saveLoading = ref(false);
const rootMenuTotal = ref<Number>(0);
const queryParams = {
    sorts: [{ name: 'sortIndex', order: 'asc' }],
    paging: false,
    terms: [
        {
            terms: [
                {
                    column: 'owner',
                    termType: 'eq',
                    value: 'iot',
                },
                {
                    column: 'owner',
                    termType: 'isnull',
                    value: '1',
                    type: 'or',
                },
            ],
        },
        {
            terms: [
                {
                    terms: [
                        {
                            value: '%show":false%',
                            termType: 'nlike',
                            column: 'options',
                            type: 'and',
                        },
                        {
                            value: '%owner"%',
                            termType: 'nlike',
                            column: 'options',
                            type: 'and',
                        },
                    ],
                },
                {
                    terms: [
                        {
                            value: `%owner\":\"${props.data.id}%`,
                            termType: 'like',
                            column: 'options',
                        },
                    ],
                    type: 'or',
                },
            ],
        },
    ],
};
const addChildrenMenu = (data: any) => {
    basicFormRef.value?.clearValidate();
    initFormData();
    showControls.value = true;
    editType.value = 'add';
    formData.value.parentId = data?.id;
    formData.value.url = data?.url;
    formData.value.sortIndex = data?.children?.length + 1 || 0;
};
const addMenu = () => {
    initFormData();
    formData.value.sortIndex = rootMenuTotal.value;
    sourceCode.value = '';
    showControls.value = true;
    editType.value = 'add';
};
const editMenu = (data: any) => {
    basicFormRef.value?.clearValidate();
    initFormData();
    showControls.value = true;
    editType.value = 'edit';
    getMenuInfo_api(data.id).then((res: any) => {
        formData.value = res.result;
        sourceCode.value = res.result?.code;
    });
};
const deleteMenu = (data: any) => {
    const response = delMenuInfo_api(data.id);
    response.then((resp: any) => {
        if (resp.status === 200) {
            onlyMessage($t('components.ThirdMenu.045501-23'));
            queryMenu();
        }
    });
    return response;
};
const initFormData = () => {
    formData.value = {
        icon: '',
        name: '',
        code: '',
        url: '',
    };
};
const choseIcon = (typeStr: string) => {
    dialogVisible.value = false;
    formData.value.icon = typeStr;
    uploadIcon.value?.clearValidate();
};
const saveMenu = () => {
    basicFormRef.value.validate().then(() => {
        const api =
            editType.value === 'add' ? addMenuInfo_api : saveMenuInfo_api;
        saveLoading.value = true;
        const params = {
            ...formData.value,
            owner: 'iot',
            appId: props.data.id,
            options: { show: true, owner: props.data?.id },
        };
        api(params)
            .then((res) => {
                if (res.status === 200) {
                    onlyMessage($t('components.ThirdMenu.045501-23'));
                    queryMenu();
                } else {
                    onlyMessage($t('components.ThirdMenu.045501-24'));
                }
            })
            .finally(() => (saveLoading.value = false));
    });
};
const checkCode = async (_rule: Rule, value: string): Promise<any> => {
    if (!value) return Promise.reject('');
    else if (value.length > 64) return Promise.reject($t('components.ThirdMenu.045501-16'));
    // 编辑时不校验原本的编码
    else if ((editType.value === 'edit' && value === sourceCode.value))
        return Promise.resolve('');
    else {
        const resp: any = await validCode_api({
            code: value,
            owner: 'iot',
        });
        if (resp.result.passed) return Promise.resolve();
        else return Promise.reject($t('components.ThirdMenu.045501-25'));
    }
};
const cancel = () => {
    emit('cancel');
};
const queryMenu = () => {
    getMenuTree_api(queryParams).then((res: any) => {
        treeData.value = res.result?.filter(
            (item: { code: string }) =>
                ![USER_CENTER_MENU_CODE, messageSubscribe].includes(item.code),
        );
        const lastItem = res.result[res.result.length - 1];
        rootMenuTotal.value = lastItem ? lastItem.sortIndex + 1 : 1;
    });
};
onMounted(() => {
    queryMenu();
});
</script>

<style lang="less" scoped>
.menuList {
    width: 35%;
    margin-right: 20px;
}
.configuration {
    width: 60%;
}
.content {
    border: 0.3px solid rgb(220, 220, 220);
    position: relative;
    .saveBtn {
        position: absolute;
        right: 20px;
        top: 10px;
    }
    .basic-form {
        height: 432px;
        padding: 32px 20px;
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
    .treeContainer {
        height: 400px;
        overflow-y: auto;
    }
    .tree-item {
        display: flex;
        position: relative;
        align-items: stretch;
        justify-content: space-around;
        .title {
            flex: 1;
            min-width: 80px;
            margin-right: 80px;
        }
        .menuControls {
            position: absolute;
            right: 10px;
            display: none;
            font-size: 14px;
            :deep(.ant-btn-link) {
                padding: 0 4px;
                height: 24px;
            }
        }
    }
}

:deep(.ant-tree-treenode) {
    width: 100%;
    .ant-tree-node-content-wrapper {
        flex: 1 1 auto;
    }
    .ant-tree-title {
        &:hover {
            .menuControls {
                display: block;
            }
        }
    }
}
</style>
