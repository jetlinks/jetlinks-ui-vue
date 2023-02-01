<!-- 新增、编辑产品 -->
<template>
    <a-modal
        :title="props.title"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        @ok="submitData"
        @cancel="close"
        okText="确定"
        cancelText="取消"
        v-bind="layout"
        width="650px"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <a-form
                :layout="'vertical'"
                :model="form"
                :rules="rules"
                ref="formRef"
            >
                <a-row type="flex">
                    <a-col flex="180px">
                        <a-form-item name="photoUrl">
                            <JUpload v-model="form.photoUrl" />
                        </a-form-item>
                        <!-- <a-form-item>
                            <div class="upload-image-warp-logo">
                                <div class="upload-image-border-logo">
                                    <a-upload
                                        name="file"
                                        :action="FILE_UPLOAD"
                                        :headers="headers"
                                        :showUploadList="false"
                                        :beforeUpload="beforeUpload"
                                        @change="handleChange"
                                        :accept="
                                            imageTypes && imageTypes.length
                                                ? imageTypes.toString()
                                                : ''
                                        "
                                    >
                                        <div class="upload-image-content-logo">
                                            <div
                                                class="loading-logo"
                                                v-if="logoLoading"
                                            >
                                                <LoadingOutlined
                                                    style="font-size: 28px"
                                                />
                                            </div>
                                            <div
                                                class="upload-image"
                                                v-if="photoValue"
                                                :style="
                                                    photoValue
                                                        ? `background-image: url(${photoValue});`
                                                        : ''
                                                "
                                            ></div>
                                            <div
                                                v-if="photoValue"
                                                class="upload-image-mask"
                                            >
                                                点击修改
                                            </div>
                                            <div v-else>
                                                <div v-if="logoLoading">
                                                    <LoadingOutlined
                                                        style="font-size: 28px"
                                                    />
                                                </div>
                                                <div v-else>
                                                    <PlusOutlined
                                                        style="font-size: 28px"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </a-upload>
                                    <div v-if="logoLoading">
                                        <div class="upload-loading-mask">
                                            <LoadingOutlined
                                                v-if="logoLoading"
                                                style="font-size: 28px"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a-form-item> -->
                    </a-col>
                    <a-col flex="auto">
                        <a-form-item name="id">
                            <template #label>
                                <span>ID</span>
                                <a-tooltip
                                    title="若不填写，系统将自动生成唯一ID"
                                >
                                    <AIcon
                                        type="QuestionCircleOutlined"
                                        style="margin-left: 2px"
                                    />
                                </a-tooltip>
                            </template>
                            <a-input
                                v-model:value="form.id"
                                placeholder="请输入ID"
                                :disabled="disabled"
                            />
                        </a-form-item>
                        <a-form-item label="名称" name="name">
                            <a-input
                                v-model:value="form.name"
                                placeholder="请输入名称"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="产品分类" name="classifiedId">
                    <a-tree-select
                        showSearch
                        v-model:value="form.classifiedId"
                        placeholder="请选择产品分类"
                        :tree-data="treeList"
                        @change="valueChange"
                        :fieldNames="{ label: 'name', value: 'id' }"
                        :filterTreeNode="
                            (v, option) => filterSelectNode(v, option)
                        "
                    >
                        <template> </template>
                    </a-tree-select>
                </a-form-item>
                <a-form-item label="设备类型" name="deviceType">
                    <a-radio-group
                        v-model:value="form.deviceType"
                        style="width: 100%"
                        @change="changeValue"
                    >
                        <a-row :span="24" :gutter="10">
                            <a-col
                                :span="8"
                                v-for="item in deviceList"
                                :key="item.value"
                            >
                                <div class="button-style">
                                    <a-radio-button
                                        :value="item.value"
                                        style="height: 100%; width: 100%"
                                        :disabled="disabled"
                                    >
                                        <div class="card-content">
                                            <a-row :gutter="20">
                                                <a-col :span="10">
                                                    <!-- 图片 -->
                                                    <div class="img-style">
                                                        <img :src="item.logo" />
                                                    </div>
                                                </a-col>
                                                <a-col :span="14">
                                                    <span class="card-style">
                                                        {{ item.label }}
                                                    </span>
                                                </a-col>
                                            </a-row>

                                            <!-- 勾选 -->
                                            <div
                                                v-if="
                                                    form.deviceType ===
                                                    item.value
                                                "
                                                class="checked-icon"
                                            >
                                                <div>
                                                    <CheckOutlined />
                                                </div>
                                            </div>
                                        </div>
                                    </a-radio-button>
                                </div>
                            </a-col>
                        </a-row>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="说明" name="describe">
                    <a-textarea
                        v-model:value="form.describe"
                        placeholder="请输入说明"
                    />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
    <DialogTips ref="dialogRef" />
</template>

<script lang="ts" setup>
import { category } from '@/api/device/product';
import { Form } from 'ant-design-vue';
import { getImage } from '@/utils/comm.ts';
import { message } from 'ant-design-vue';
import DialogTips from '../DialogTips/index.vue';
import { filterTreeSelectNode, filterSelectNode } from '@/utils/comm';
import { FILE_UPLOAD } from '@/api/comm';
import { isInput } from '@/utils/regular';
import type { Rule } from 'ant-design-vue/es/form';
import { queryProductId } from '@/api/device/product';
import {
    SearchOutlined,
    CheckOutlined,
    DeleteOutlined,
} from '@ant-design/icons-vue';

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    title: {
        type: String,
        defult: '',
    },
    isAdd: {
        type: Number,
        default: 0,
    },
});
const loading = ref<boolean>(false);
const dialogRef = ref();
const treeList = ref<Record<string, any>[]>([]);
const visible = ref<boolean>(false);
const logoLoading = ref<boolean>(false);
const formRef = ref();
const disabled = ref<boolean>(false);
const useForm = Form.useForm;
const _selectedRowKeys = ref([]);
const photoValue = ref('/images/device-product.png');
const imageTypes = reactive([
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/jfif',
    'image/pjp',
    'image/pjpeg',
]);
const deviceList = ref([
    {
        label: '直连设备',
        value: 'device',
        logo: getImage('/device-type-1.png'),
    },
    {
        label: '网关子设备',
        value: 'childrenDevice',
        logo: getImage('/device-type-2.png'),
    },
    {
        label: '网关设备',
        value: 'gateway',
        logo: getImage('/device/device-type-3.png'),
    },
]);

const form = reactive({
    id: '',
    name: '',
    classifiedId: '',
    classifiedName: '',
    deviceType: '',
    describe: '',
    photoUrl: getImage('/device/instance/device-card.png'),
});
/**
 * 校验id
 */
const validateInput = async (_rule: Rule, value: string) => {
    if (value) {
        if (!isInput(value)) {
            return Promise.reject('请输入英文或者数字或者-或者_');
        } else {
            const res = await queryProductId(value);
            if (res.status === 200 && res.result) {
                return Promise.reject('ID重复');
            } else {
                return Promise.resolve();
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
        return Promise.reject('请选择设备类型');
    } else {
        return Promise.resolve();
    }
};
const rules = reactive({
    id: [{ validator: validateInput, trigger: 'blur' }],
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    deviceType: [
        {
            required: true,
            validator: validateDeviceType,
            trigger: 'blur',
        },
    ],
});

const valueChange = (value: string, label: string) => {
    form.classifiedName = label[0];
};
/**
 * 查询产品分类
 */
const queryProductTree = async () => {
    category({
        paging: false,
    }).then((resp) => {
        if (resp.status === 200) {
            treeList.value = resp.result;
        }
    });
};
watch(
    () => props.isAdd,
    () => {
        // queryProductTree();
    },
    { immediate: true, deep: true },
);
/**
 * 显示弹窗
 */
const show = (data: any) => {
    if (props.isAdd === 2) {
        form.name = data.name;
        form.classifiedId = data.classifiedId;
        form.classifiedName = data.classifiedName;
        form.photoUrl = data.photoUrl || photoValue.value;
        form.deviceType = data.deviceType.value;
        form.describe = form.describe;
        form.id = data.id;
        disabled.value = true;
    } else if (props.isAdd === 1) {
        form.name = '';
        form.classifiedId = '';
        form.classifiedName = '';
        form.photoUrl = getImage('/device/instance/device-card.png');
        form.deviceType = '';
        form.describe = '';
        form.id = '';
        disabled.value = false;
        dialogRef.value.show();
    }
    // visible.value = true;
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
/**
 * 提交表单数据
 */
const submitData = () => {
    formRef.value
        .validate()
        .then(async () => {})
        .catch((err: any) => {});
};
/**
 * 初始化
 */
// queryProductTree();
defineExpose({
    show: show,
});
</script>
<style scoped lang="less">
.card-style {
    position: relative;
    top: 19px;
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
            color: #2f54eb;
            // background-color: #2f54eb;
            transform: rotate(-45deg);

            > div {
                position: relative;
                height: 100%;
                transform: rotate(45deg);
                background-color: transparent;
            }
        }
    }
    // &:hover {
    //     color: #2f54eb;
    //     border: 1px solid #2f54eb;
    // }
}
</style>
