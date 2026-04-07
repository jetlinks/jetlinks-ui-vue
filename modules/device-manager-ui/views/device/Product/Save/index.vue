<!-- 新增、编辑产品 -->
<template>
    <a-modal
        :title="props.title"
        :maskClosable="false"
        destroy-on-close
        v-model:open="visible"
        @ok="submitData"
        @cancel="close"
        :okText="$t('Save.index.912481-0')"
        :cancelText="$t('Save.index.912481-1')"
        width="650px"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <a-form
                layout="vertical"
                :model="form"
                :rules="rules"
                ref="formRef"
            >
                <a-row type="flex">
                    <a-col flex="180px">
                        <a-form-item name="photoUrl">
                            <pro-upload
                                v-model="form.photoUrl"
                                :accept="
                                    imageTypes && imageTypes.length
                                        ? imageTypes.toString()
                                        : ''
                                "
                            />
                        </a-form-item>
                    </a-col>
                    <a-col flex="auto">
                        <a-form-item name="id" :validateFirst="true">
                            <template #label>
                                <span>ID</span>
                                <a-tooltip
                                    :title="$t('Save.index.912481-2')"
                                >
                                    <AIcon
                                        type="QuestionCircleOutlined"
                                        style="margin-left: 2px"
                                    />
                                </a-tooltip>
                            </template>
                            <a-input
                                v-model:value="form.id"
                                :placeholder="$t('Save.index.912481-3')"
                                :disabled="idDisabled || !showId"
                            />
                        </a-form-item>
                        <a-form-item :label="$t('Save.index.912481-4')" name="name">
                            <a-input
                                v-model:value="form.name"
                                :placeholder="$t('Save.index.912481-5')"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item v-if="type === 'iot'" :label="$t('Save.index.912481-6')" name="classifiedId">
                    <a-tree-select
                        showSearch
                        v-model:value="form.classifiedId"
                        :placeholder="$t('Save.index.912481-7')"
                        :tree-data="treeList"
                        @change="valueChange"
                        allow-clear
                        :fieldNames="{
                            label: 'name',
                            value: 'id',
                            children: 'children',
                        }"
                        :filterTreeNode="
                            (v, option) => filterSelectNode(v, option, 'name')
                        "
                    >
                        <template> </template>
                    </a-tree-select>
                </a-form-item>
                <a-form-item v-if="type === 'iot'" :label="$t('Save.index.912481-8')" name="deviceType">
                    <j-card-select
                        v-model:value="form.deviceType"
                        :options="deviceList"
                        :disabled="productStore.detail?.accessId ? true : false"
                        @change="changeDeviceType"
                    >
                        <template #itemRender="{node}">
                            <div class="select-item">
                                <div>
                                    <span>{{ node.label }}</span>
                                    <a-tooltip :title="node.tooltip"
                                        ><AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px"
                                        />
                                    </a-tooltip>
                                </div>
                                <img :src="node.iconUrl" alt="">
                            </div>
                        </template>
                    </j-card-select>
                </a-form-item>
                <a-form-item v-if="type === 'edge'" :label="$t('device.ProductSave.101005-2')" name="type">
                    <j-card-select
                        :showImage="false"
                        v-model:value="form.type"
                        :disabled="isAdd === 2"
                        :options="[
                        {
                            label: $t('device.ProductSave.101005-3'),
                            value: 'custom',
                            describe: $t('device.ProductSave.101005-4'),
                        },
                        {
                            label: $t('device.ProductSave.101005-5'),
                            value: 'template',
                            describe: $t('device.ProductSave.101005-6'),
                        },
                        ]"
                        :column="2"
                        @change="typeChange"
                    />
                    <div style="margin-top: 1rem; display: flex; gap: .75rem" v-if="form.type === 'template'">
                        <a-input
                            v-model:value="productName"
                            :disabled="true"
                            :placeholder="$t('device.ProductSave.101005-7')"
                        >
                        </a-input>
                        <a-button
                            @click="visibleClouds = true"
                            type="primary"
                            :disabled="isAdd === 2"
                        >
                            {{ $t('device.ProductSave.101005-8') }}
                        </a-button>
                    </div>
                </a-form-item>
                <a-form-item :label="$t('Save.index.912481-9')" name="description">
                    <a-textarea
                        :maxlength="200"
                        showCount
                        :auto-size="{ minRows: 4, maxRows: 5 }"
                        v-model:value="form.describe"
                        :placeholder="$t('Save.index.912481-10')"
                    />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
    <SaveProductCloud
        v-if="visibleClouds"
        @close="visibleClouds = false"
        @submit="choseCloudsProduct"
    />
    <DialogTips ref="dialogRef" />
</template>

<script lang="ts" setup>
import { category, queryProductId, addProduct, editProduct, queryCloudsProduct } from '@device-manager-ui/api/product';
import { Form } from 'ant-design-vue';
import DialogTips from '../DialogTips/index.vue';
import { useProductStore } from '@device-manager-ui/store/product';
import { filterSelectNode, encodeQuery } from '@jetlinks-web-core/utils';
import { onlyMessage } from '@jetlinks-web/utils'
import { isInput } from '@device-manager-ui/utils/utils';
import type { Rule } from 'ant-design-vue/es/form';
import { device } from '@device-manager-ui/assets';
import { useI18n } from 'vue-i18n';
import { omit } from 'lodash-es';
import SaveProductCloud from './SaveProductCloud.vue';
import { ensureVisualizationDashboardProject } from '@device-manager-ui/utils/dashboardProject';

const { t: $t } = useI18n();

const productStore = useProductStore();
const emit = defineEmits(['success']);

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    isAdd: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
    },
  showId: {
      type: Boolean,
      default: true,
  }
});
const visibleClouds = ref();
const productName = ref();
const loading = ref<boolean>(false);
const dialogRef = ref();
const treeList = ref<Record<string, any>[]>([]);
const visible = ref<boolean>(false);
const formRef = ref();
const idDisabled = ref<boolean>(false);
const useForm = Form.useForm;
const photoValue = ref(device.deviceProduct);
const imageTypes = reactive([
    'image/jpeg',
    'image/png',
    // 'image/jpg',
    'image/jfif',
    'image/pjp',
    // 'image/pjpeg',
]);
const deviceList = ref([
    {
        label: $t('Save.index.912481-11'),
        value: 'device',
        iconUrl: device.deviceType1,
        tooltip: $t('Save.index.912481-12'),
    },
    {
        label: $t('Save.index.912481-13'),
        value: 'childrenDevice',
        iconUrl: device.deviceType2,
        tooltip: $t('Save.index.912481-14'),
    },
    {
        label: $t('Save.index.912481-15'),
        value: 'gateway',
        iconUrl: device.deviceType3,
        tooltip: $t('Save.index.912481-16'),
    },
]);

const form = reactive({
    id: undefined,
    name: '',
    classifiedId: undefined,
    classifiedName: '',
    deviceType: '',
    describe: undefined,
    photoUrl: device.deviceProduct,
    type: 'custom',
    masterProductId: undefined,
    edgeMasterId: undefined,
    metadata: undefined
});
/**
 * 校验id
 */
const validateInput = async (_rule: Rule, value: string) => {
    if (value) {
        if (!isInput(value)) {
            return Promise.reject($t('Save.index.912481-17'));
        } else {
            if (props.isAdd === 1) {
                const res = await queryProductId(value);
                if (res.success && res.result) {
                    return Promise.reject($t('Save.index.912481-18'));
                } else {
                    return Promise.resolve();
                }
            }
        }
    } else {
        return Promise.resolve();
    }
};
/**
 * 校验是否选择设备类型
 */
const validateDeviceType = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject($t('Save.index.912481-19'));
    } else {
        return Promise.resolve();
    }
};

/**
 * 来自模板添加校验
 */
const validateType = async (_rule, value) => {
  if (value === "template") {
    if (productName.value) {
      return Promise.resolve("");
    } else {
      return Promise.reject($t('device.ProductSave.101005-7'));
    }
  } else {
    return Promise.resolve("");
  }
};

const rules = reactive({
    id: [
        { validator: validateInput, trigger: 'blur' },
        { max: 64, message: $t('Save.index.912481-20'), trigger: 'change' },
    ],
    name: [
        { required: true, message: $t('Save.index.912481-5'), trigger: 'blur' },
        { max: 64, message: $t('Save.index.912481-20'), trigger: 'change' },
    ],
    deviceType: [
        {
            required: true,
            validator: validateDeviceType,
        },
    ],
    description: [
        { max: 200, message: $t('Save.index.912481-21'), trigger: 'blur' },
    ],
    type: [
        {
            required: true,
            message: $t('device.ProductSave.101005-9'),
            trigger: "blur",
        },
        {
            validator: validateType,
            trigger: "change",
        },
    ],
});

const valueChange = (value: string, label: string) => {
    form.classifiedName = label[0];
};

const typeChange = () => {
  formRef.value?.clearValidate();
};
/**
 * 查询产品分类
 */
const queryProductTree = async () => {
    category(encodeQuery({ sorts: { sortIndex: 'asc' } })).then((resp) => {
        if (resp.status === 200) {
            treeList.value = resp.result;
            treeList.value = dealProductTree(treeList.value);
        }
    });
};
/**
 * 处理产品分类key
 */
const dealProductTree = (arr: any) => {
    return arr.map((element: any) => {
        element.key = element.id;
        if (element.children) {
            element.children = dealProductTree(element.children);
        }
        return element;
    });
};
/**
 * 显示弹窗
 */
const show = async (data: any) => {
    if (props.isAdd === 2) {
        productStore.refresh(data.id);
        form.name = data.name;
        form.classifiedId = data.classifiedId || undefined;
        form.classifiedName = data.classifiedName;
        form.photoUrl = data.photoUrl || photoValue.value;
        form.deviceType = data.deviceType.value;
        form.describe = data.describe;
        form.id = data.id;
        idDisabled.value = true;
        form.type =
        data?.masterProductId && data?.edgeMasterId
            ? "template"
            : "custom";
        if (form.type === "template") {
        const res = await queryCloudsProduct(data?.edgeMasterId, {
            terms: [
            {
                type: "or",
                value: data?.masterProductId,
                termType: "eq",
                column: "id",
            },
            ],
        }).catch(() => {
            productName.value = data?.masterProductId;
        });
        if (res.success) {
            productName.value =
            res.result?.data[0]?.name || data?.masterProductId;
        }
        }
    } else if (props.isAdd === 1) {
        productStore.reSet();
        form.name = '';
        form.classifiedId = undefined;
        form.classifiedName = '';
        form.photoUrl = device.deviceProduct;
        form.deviceType = props.type === 'edge' ? 'childrenDevice' : '';
        form.describe = undefined;
        form.id = undefined;
        idDisabled.value = false;
        form.type = 'custom';
        productName.value = '';
    }
    visible.value = true;
};

/**
 * 关闭弹窗
 */
const close = () => {
    visible.value = false;
};
const { resetFields, validate, validateInfos, clearValidate } = useForm(
    form,
    rules,
);
//边端新增产品从云端选择产品
const choseCloudsProduct = (data) => {
    form.masterProductId = data.masterProductId;
    form.edgeMasterId = data.edgeMasterId;
    productName.value = data.productName;
    form.metadata = data.metadata;
    formRef.value.validateFields('type')
    visibleClouds.value = false;
};

const ensureProductDashboardProject = async (productId: string) => {
    try {
        await ensureVisualizationDashboardProject({
            entityId: productId,
            projectName: String(form.name || ''),
            groupId: productId,
            groupName: String(form.name || ''),
            configuration: {
                initDataConfigured: true,
                productDashboard: true,
                productId,
            },
        });
    } catch (e) {
        console.warn($t('device.ProductSave.101005-0'), e);
        onlyMessage($t('device.ProductSave.101005-1'), 'warning');
    }
};
/**
 * 提交表单数据
 */
const submitData = () => {
    formRef.value
        .validate()
        .then(async () => {
            // 新增
          loading.value = true
            if (props.isAdd === 1) {
                if (form.id === '') {
                    form.id = undefined;
                }
                const res = await addProduct(omit(toRaw(form), "type")).finally(()=>{
                    loading.value = false
                });
                if (res.success) {
                    // 新增产品成功后，同步创建产品仪表盘项目（失败不阻断）
                    if (res.result?.id) {
                        await ensureProductDashboardProject(String(res.result.id));
                    }
                    onlyMessage($t('Save.index.912481-22'));
                    visible.value = false;
                    emit('success');
                    dialogRef.value.show(res.result.id);
                } else {
                    onlyMessage($t('Save.index.912481-23'), 'error');
                }
            } else if (props.isAdd === 2) {
                // 编辑
                form.classifiedId = form.classifiedId || ''
                form.classifiedName = form.classifiedName || ''
                const res = await editProduct(form).finally(() => {
                  loading.value = false
                });
                if (res.success) {
                    onlyMessage($t('Save.index.912481-22'));
                    emit('success');
                    visible.value = false;
                } else {
                    onlyMessage($t('Save.index.912481-23'), 'error');
                }
            }
        })
        .catch((err: any) => {});
};
/**
 * 初始化
 */
queryProductTree();

const changeDeviceType = (value: Array<string>) => {
    form.deviceType = value[0];
};

defineExpose({
    show: show,
});
</script>
<style scoped lang="less">
.card-style {
    position: relative;
    top: 19px;
}
.select-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.upload-image-warp-logo {
    display: flex;
    justify-content: flex-start;
    .upload-image-border-logo {
        position: relative;
        overflow: hidden;
        border: 1px dashed #d9d9d9;
        transition: all 0.3s;
        width: 160px;
        height: 150px;
        &:hover {
            border: 1px dashed #1890ff;
            display: flex;
        }
        .upload-image-content-logo {
            align-items: center;
            justify-content: center;
            position: relative;
            display: flex;
            flex-direction: column;
            width: 160px;
            height: 150px;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.06);
            cursor: pointer;
            .loading-logo {
                position: absolute;
                top: 50%;
            }
            .loading-icon {
                position: absolute;
            }
            .upload-image {
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: cover;
            }
            .upload-image-icon {
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: inherit;
            }
            .upload-image-mask {
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0;
                left: 0;
                display: none;
                width: 100%;
                height: 100%;
                color: #fff;
                font-size: 16px;
                background-color: rgba(0, 0, 0, 0.35);
            }
            &:hover .upload-image-mask {
                display: flex;
            }
        }
    }
}
.button-style {
    background-color: #fff;
    height: 66px;
    overflow: hidden;
    .card-content {
        width: 100%;
        .img-style {
            position: relative;
            top: 16px;
        }
        .checked-icon {
            position: absolute;
            right: -22px;
            bottom: -22px;
            z-index: 2;

            width: 44px;
            height: 44px;
            color: #fff;
            background-color: @primary-color-active;
            transform: rotate(-45deg);

            > div {
                position: relative;
                height: 100%;
                transform: rotate(45deg);

                > span {
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    font-size: 12px;
                }
            }
        }
        &.checked {
            position: relative;
            color: @primary-color-active;
            border-color: @primary-color-active;

            > .checked-icon {
                display: block;
            }
        }
    }
}
</style>
