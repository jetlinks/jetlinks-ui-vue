<template>
    <j-modal
        :title="data.id ? '编辑' : '新增'"
        ok-text="确认"
        cancel-text="取消"
        :visible="true"
        width="700px"
        :confirm-loading="loading"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <a-spin :spinning="_loading">
            <j-form
                class="form"
                layout="vertical"
                :model="formData"
                name="basic"
                autocomplete="off"
            >
                <j-row :gutter="[24, 0]">
                    <j-col :span="24">
                        <j-form-item label="名称" v-bind="validateInfos.name">
                            <j-input
                                placeholder="请输入名称"
                                v-model:value="formData.name"
                        /></j-form-item>
                    </j-col>
                    <j-col :span="24"
                        ><j-form-item
                            label="所属产品"
                            v-bind="validateInfos.productId"
                        >
                            <j-select
                                v-model:value="formData.productId"
                                :options="productOptions"
                                placeholder="请选择所属产品"
                                allowClear
                                show-search
                                :filter-option="filterOption"
                            /> </j-form-item
                    ></j-col>
                    <j-col :span="12"
                        ><j-form-item
                            label="版本号"
                            v-bind="validateInfos.version"
                        >
                            <j-input
                                placeholder="请输入版本号"
                                v-model:value="formData.version" /></j-form-item
                    ></j-col>
                    <j-col :span="12"
                        ><j-form-item
                            label="版本序号"
                            v-bind="validateInfos.versionOrder"
                        >
                            <j-input-number
                                placeholder="请输入版本序号"
                                style="width: 100%"
                                :min="1"
                                :max="99999"
                                v-model:value="
                                    formData.versionOrder
                                " /></j-form-item
                    ></j-col>
                    <j-col :span="12"
                        ><j-form-item
                            label="签名方式"
                            v-bind="validateInfos.signMethod"
                        >
                            <j-select
                                v-model:value="formData.signMethod"
                                :options="[
                                    { label: 'MD5', value: 'md5' },
                                    { label: 'SHA256', value: 'sha256' },
                                ]"
                                placeholder="请选择签名方式"
                                allowClear
                                show-search
                                :filter-option="filterOption"
                                @change="changeSignMethod"
                            />
                        </j-form-item>
                    </j-col>
                    <j-col :span="12"
                        ><j-form-item v-bind="validateInfos.sign">
                            <template #label>
                                签名
                                <j-tooltip
                                    title="请输入本地文件进行签名加密后的值"
                                >
                                    <AIcon
                                        type="QuestionCircleOutlined"
                                        style="margin-left: 2px"
                                    />
                                </j-tooltip>
                            </template>
                            <j-input
                                placeholder="请输入签名"
                                v-model:value="formData.sign" /></j-form-item
                    ></j-col>
                    <j-col :span="24">
                        <j-form-item
                            label="固件上传"
                            v-bind="validateInfos.url"
                        >
                            <FileUpload
                                v-model:modelValue="formData.url"
                                v-model:extraValue="extraValue"
                            /> </j-form-item
                    ></j-col>
                    <j-col :span="24">
                        <j-form-item
                            label="其他配置"
                            v-bind="validateInfos.properties"
                        >
                            <j-form
                                :class="
                                    dynamicValidateForm.properties.length !==
                                        0 && 'formRef'
                                "
                                ref="formRef"
                                name="dynamic_form_nest_item"
                                :model="dynamicValidateForm"
                            >
                                <div
                                    class="formRef-content"
                                    v-for="(
                                        propertie, index
                                    ) in dynamicValidateForm.properties"
                                    :key="propertie.keyid"
                                >
                                    <j-form-item
                                        :label="index === 0 && 'Key'"
                                        class="formRef-form-item"
                                        :name="['properties', index, 'id']"
                                        :rules="{
                                            required: true,
                                            message: '请输入KEY',
                                        }"
                                    >
                                        <j-input
                                            v-model:value="propertie.id"
                                            placeholder="请输入KEY"
                                        />
                                    </j-form-item>
                                    <j-form-item
                                        :label="index === 0 && 'Value'"
                                        class="formRef-form-item"
                                        :name="['properties', index, 'value']"
                                        :rules="{
                                            required: true,
                                            message: '请输入VALUE',
                                        }"
                                    >
                                        <j-input
                                            v-model:value="propertie.value"
                                            placeholder="请输入VALUE"
                                        />
                                    </j-form-item>
                                    <j-form-item
                                        :label="index === 0 && '操作'"
                                        class="formRef-form-item"
                                        style="width: 10%"
                                    >
                                        <j-popconfirm
                                            title="确认删除吗？"
                                            ok-text="确认"
                                            cancel-text="取消"
                                            @confirm="removeList(propertie)"
                                        >
                                            <AIcon type="DeleteOutlined" />
                                        </j-popconfirm>
                                    </j-form-item>
                                </div>
                                <j-form-item class="formRef-form-item-add">
                                    <j-button
                                        type="dashed"
                                        block
                                        @click="addList"
                                    >
                                        <AIcon type="PlusOutlined" />
                                        添加
                                    </j-button>
                                </j-form-item>
                            </j-form>
                        </j-form-item></j-col
                    >
                    <j-col :span="24">
                        <j-form-item
                            label="说明"
                            v-bind="validateInfos.description"
                        >
                            <j-textarea
                                placeholder="请输入说明"
                                v-model:value="formData.description"
                                :maxlength="200"
                                :rows="3"
                                showCount
                            /> </j-form-item
                    ></j-col>
                </j-row>
            </j-form>
        </a-spin>
    </j-modal>
</template>
<script lang="ts" setup>
import { Form } from 'jetlinks-ui-components';
import FileUpload from './FileUpload.vue';
import {
    save,
    update,
    queryProduct,
    validateVersion,
} from '@/api/device/firmware';
import type { FormInstance } from 'ant-design-vue';
import type { Properties } from '../type';
import { onlyMessage } from '@/utils/comm';

const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{ properties: Properties[] }>({
    properties: [],
});

const removeList = (item: Properties) => {
    let index = dynamicValidateForm.properties.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.properties.splice(index, 1);
    }
};
const addList = () => {
    dynamicValidateForm.properties.push({
        id: '',
        value: '',
        keyid: Date.now(),
    });
};

const loading = ref(false);
const _loading = ref(false);
const useForm = Form.useForm;

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    productOptions:{
        type: Array,
        default: []
    }
});

const emit = defineEmits(['change']);

const id = props.data.id;
const VersionOrder = props.data.versionOrder;
const VersionSign = props.data.sign;
const VersionUrl = props.data.url;

const formData: any = ref({
    name: '',
    productId: undefined,
    version: '',
    versionOrder: '',
    signMethod: undefined,
    sign: '',
    url: '',
    properties: [],
    description: '',
});

const extraValue: any = ref({});

const validatorSign = async (_: Record<string, any>, value: string) => {
    const { signMethod, url } = formData.value;
    if (id && VersionSign === value && VersionUrl === url) {
        return Promise.resolve();
    } else {
        if (value && !!signMethod && !!url && !!extraValue.value) {
            return extraValue.value[signMethod] !== value
                ? Promise.reject('签名不一致，请检查文件是否上传正确')
                : Promise.resolve();
        }
    }
};
const validatorVersionOrder = async (_: Record<string, any>, value: string) => {
    if (id && VersionOrder === value) {
        return Promise.resolve();
    } else {
        const { signMethod, productId } = formData.value;
        if (value && !!signMethod && productId) {
            const res = await validateVersion(productId, value);
            if (res.status === 200) {
                return res.result
                    ? Promise.reject('版本序号已存在')
                    : Promise.resolve();
            }
        }
    }
};

const validatorProductExist = async (_: Record<string, any>, value: string) => {
    if (!value) {
        return Promise.resolve();
    } else {
        const dt = props.productOptions.find((i: any) => i.value === value);
        if (dt) {
            return Promise.resolve();
        } else {
            return Promise.reject('当前产品不存在，请选择产品');
        }
    }
};

const validatorVersionValue = async (_rule: any, value: any) => {
    return new Promise(async (resolve, reject) => {
        const posReg = /^[1-9]\d*$/;
        if (posReg.test(value.toString())) {
            return resolve('');
        } else {
            return reject('请输入1~99999之间的正整数');
        }
    });
};
const { resetFields, validate, validateInfos } = useForm(
    formData,
    reactive({
        name: [
            { required: true, message: '请输入名称' },
            { max: 64, message: '最多可输入64个字符' },
        ],
        productId: [
            { required: true, message: '请选择所属产品' },
            { validator: validatorProductExist, trigger: 'blur' },
        ],
        version: [
            { required: true, message: '请输入版本号' },
            { max: 64, message: '最多可输入64个字符', trigger: 'change' },
        ],
        versionOrder: [
            { required: true, message: '请输入版本序号' },
            { validator: validatorVersionOrder, trigger: 'blur' },
            { validator: validatorVersionValue, trigger: 'change' },
        ],
        signMethod: [{ required: true, message: '请选择签名方式' }],
        sign: [
            { required: true, message: '请输入签名' },
            { validator: validatorSign },
        ],
        url: [{ required: true, message: '请上传文件' }],
        description: [{ max: 200, message: '最多可输入200个字符' }],
    }),
);

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleOk = async () => {
    const { properties }: any = await formRef.value?.validate();

    validate()
        .then(async (res: any) => {
            const product: any = props.productOptions.find(
                (item: any) => item?.value === res.productId,
            );
            const productName = product?.label || props.data?.url;
            const size = extraValue.value?.length || props.data?.size;

            const params = {
                ...toRaw(formData.value),
                properties: !!properties ? properties : [],
                productName,
                size,
            };
            loading.value = true;
            const response = !id
                ? await save(params).catch(() => {})
                : await update({ ...props.data, ...params }).catch(() => {});
            if (response?.status === 200) {
                onlyMessage('操作成功', 'success');

                emit('change', true);
            }
            loading.value = false;
        })
        .catch((err) => {
            loading.value = false;
        });
};

const handleCancel = () => {
    emit('change', false);
};

const changeSignMethod = () => {
    formData.value.sign = '';
    formData.value.url = '';
};

watch(
    () => props.data,
    (value) => {
        if (value.id) {
            formData.value = value;
            dynamicValidateForm.properties = value.properties;
        }
    },
    { immediate: true, deep: true },
);
watch(
    () => extraValue.value,
    () => validate('sign'),
    { deep: true },
);
</script>

<style lang="less" scoped>
.form {
    .form-radio-button {
        width: 148px;
        height: 80px;
        padding: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .form-url-button {
        margin-top: 10px;
    }
    .form-submit {
        background-color: @primary-color !important;
    }
}
.formRef {
    border: 1px dashed #d9d9d9;
    .formRef-title {
        display: flex;
        justify-content: space-between;
    }
    .formRef-content {
        padding: 10px;
        display: flex;
        margin-bottom: 10px;
        .formRef-form-item {
            width: 47%;
            padding-right: 10px;
        }
    }
    .formRef-form-item-add {
        margin-top: 20px;
    }
}
</style>
