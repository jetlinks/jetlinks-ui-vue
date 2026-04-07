<template>
    <a-modal
        :title="data.id ? $t('Save.index.978508-0') : $t('Save.index.978508-1')"
        :ok-text="$t('Save.index.978508-2')"
        :cancel-text="$t('Save.index.978508-3')"
        :open="true"
        width="700px"
        :confirm-loading="loading"
        :maskClosable="false"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <a-spin :spinning="_loading">
            <a-form
                class="form"
                layout="vertical"
                :model="formData"
                name="basic"
                autocomplete="off"
            >
                <a-row :gutter="[24, 0]">
                    <a-col :span="24">
                        <a-form-item :label="$t('Save.index.978508-4')" v-bind="validateInfos.name">
                            <a-input
                                :placeholder="$t('Save.index.978508-5')"
                                v-model:value="formData.name"
                        /></a-form-item>
                    </a-col>
                    <a-col :span="24"
                        ><a-form-item
                            :label="$t('Save.index.978508-6')"
                            v-bind="validateInfos.productId"
                        >
                            <a-select
                                v-model:value="formData.productId"
                                :options="productOptions"
                                :placeholder="$t('Save.index.978508-7')"
                                allowClear
                                show-search
                                :filter-option="filterOption"
                            /> </a-form-item
                    ></a-col>
                    <a-col :span="12"
                        ><a-form-item
                            :label="$t('Save.index.978508-8')"
                            v-bind="validateInfos.version"
                        >
                            <a-input
                                :placeholder="$t('Save.index.978508-9')"
                                v-model:value="formData.version" /></a-form-item
                    ></a-col>
                    <a-col :span="12"
                        ><a-form-item
                            :label="$t('Save.index.978508-10')"
                            v-bind="validateInfos.versionOrder"
                        >
                            <a-input-number
                                :placeholder="$t('Save.index.978508-11')"
                                style="width: 100%"
                                :min="1"
                                :max="99999"
                                v-model:value="
                                    formData.versionOrder
                                " /></a-form-item
                    ></a-col>
                    <a-col :span="12"
                        ><a-form-item
                            :label="$t('Save.index.978508-12')"
                            v-bind="validateInfos.signMethod"
                        >
                            <a-select
                                v-model:value="formData.signMethod"
                                :options="[
                                    { label: 'MD5', value: 'md5' },
                                    { label: 'SHA256', value: 'sha256' },
                                ]"
                                :placeholder="$t('Save.index.978508-13')"
                                allowClear
                                show-search
                                :filter-option="filterOption"
                                @change="changeSignMethod"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12"
                        ><a-form-item v-bind="validateInfos.sign">
                            <template #label>
                                {{ $t('Save.index.978508-14') }}
                                <a-tooltip
                                    :title="$t('Save.index.978508-15')"
                                >
                                    <AIcon
                                        type="QuestionCircleOutlined"
                                        style="margin-left: 2px"
                                    />
                                </a-tooltip>
                            </template>
                            <a-input
                                :placeholder="$t('Save.index.978508-16')"
                                v-model:value="formData.sign" /></a-form-item
                    ></a-col>
                    <a-col :span="24">
                        <a-form-item
                            :label="$t('Save.index.978508-17')"
                            v-bind="validateInfos.url"
                        >
                            <FileUpload
                                v-model:modelValue="formData.url"
                                v-model:extraValue="extraValue"
                            /> </a-form-item
                    ></a-col>
                    <a-col :span="24">
                        <a-form-item :label="$t('Save.index.978508-35')" v-bind="validateInfos.size">
                            <a-input-number style="width: 100%;" v-model:value="formData.size" :placeholder="$t('Save.index.978508-34')" :min="0" addon-after="Byte"></a-input-number>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                            :label="$t('Save.index.978508-18')"
                            v-bind="validateInfos.properties"
                        >
                            <a-form
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
                                    <a-form-item
                                        :label="index === 0 && 'Key'"
                                        class="formRef-form-item"
                                        :name="['properties', index, 'id']"
                                        :rules="{
                                            required: true,
                                            message: $t('Save.index.978508-19'),
                                        }"
                                    >
                                        <a-input
                                            v-model:value="propertie.id"
                                            :placeholder="$t('Save.index.978508-19')"
                                        />
                                    </a-form-item>
                                    <a-form-item
                                        :label="index === 0 && 'Value'"
                                        class="formRef-form-item"
                                        :name="['properties', index, 'value']"
                                        :rules="{
                                            required: true,
                                            message: $t('Save.index.978508-20'),
                                        }"
                                    >
                                        <a-input
                                            v-model:value="propertie.value"
                                            :placeholder="$t('Save.index.978508-20')"
                                        />
                                    </a-form-item>
                                    <a-form-item
                                        :label="index === 0 && $t('Save.index.978508-21')"
                                        class="formRef-form-item-action"
                                    >
                                        <j-permission-button
                                            type="text"
                                            :popConfirm="{
                                                title: $t('Save.index.978508-22'),
                                                onConfirm: () =>
                                                    removeList(propertie),
                                            }"
                                        >
                                            <AIcon type="DeleteOutlined"
                                        /></j-permission-button>
                                    </a-form-item>
                                </div>
                                <a-form-item class="formRef-form-item-add">
                                    <a-button
                                        type="dashed"
                                        block
                                        @click="addList"
                                    >
                                        <AIcon type="PlusOutlined" />
                                        {{ $t('Save.index.978508-23') }}
                                    </a-button>
                                </a-form-item>
                            </a-form>
                        </a-form-item></a-col
                    >
                    <a-col :span="24">
                        <a-form-item
                            :label="$t('Save.index.978508-24')"
                            v-bind="validateInfos.description"
                        >
                            <a-textarea
                                :placeholder="$t('Save.index.978508-25')"
                                v-model:value="formData.description"
                                :maxlength="200"
                                :rows="3"
                                showCount
                            /> </a-form-item
                    ></a-col>
                </a-row>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<script lang="ts" setup>
import { Form } from 'ant-design-vue';
import FileUpload from './FileUpload.vue';
import {
    save,
    update,
    validateVersion,
} from '../../../../api/firmware';
import type { FormInstance } from 'ant-design-vue';
import type { Properties } from '../type';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
    productOptions: {
        type: Array,
        default: [],
    },
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
    size: ''
});

const extraValue: any = ref({});

const validatorSign = async (_: Record<string, any>, value: string) => {
    const { signMethod, url } = formData.value;
    if (id && VersionSign === value && VersionUrl === url) {
        return Promise.resolve();
    } else {
        if (value && !!signMethod && !!url && !!extraValue.value) {
            return extraValue.value[signMethod] !== value
                ? Promise.reject($t('Save.index.978508-26'))
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
                    ? Promise.reject($t('Save.index.978508-27'))
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
            return Promise.reject($t('Save.index.978508-28'));
        }
    }
};

const validatorVersionValue = async (_rule: any, value: any) => {
    return new Promise(async (resolve, reject) => {
        const posReg = /^[1-9]\d*$/;
        if (posReg.test(value.toString())) {
            return resolve('');
        } else {
            return reject($t('Save.index.978508-29'));
        }
    });
};
const { resetFields, validate, validateInfos } = useForm(
    formData,
    reactive({
        name: [
            { required: true, message: $t('Save.index.978508-5') },
            { max: 64, message: $t('Save.index.978508-30') },
        ],
        productId: [
            { required: true, message: $t('Save.index.978508-7') },
            { validator: validatorProductExist, trigger: 'blur' },
        ],
        version: [
            { required: true, message: $t('Save.index.978508-9') },
            { max: 64, message: $t('Save.index.978508-30'), trigger: 'change' },
        ],
        versionOrder: [
            { required: true, message: $t('Save.index.978508-11') },
            { validator: validatorVersionOrder, trigger: 'blur' },
            { validator: validatorVersionValue, trigger: 'change' },
        ],
        size:[
            {
                required: true, message: $t('Save.index.978508-34')
            }
        ],
        signMethod: [{ required: true, message: $t('Save.index.978508-13') }],
        sign: [
            { required: true, message: $t('Save.index.978508-16') },
            // { validator: validatorSign },
        ],
        url: [{ required: true, message: $t('Save.index.978508-31') }],
        description: [{ max: 200, message: $t('Save.index.978508-32') }],
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
            const params = {
                ...toRaw(formData.value),
                properties: !!properties ? properties : [],
                productName,
            };
            loading.value = true;
            const response = !id
                ? await save(params).catch(() => {})
                : await update({ ...props.data, ...params }).catch(() => {});
            if (response?.status === 200) {
                onlyMessage($t('Save.index.978508-33'), 'success');

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
    formData.value.size = undefined
};

watch(
    () => props.data,
    (value) => {
        if (value.id) {
            formData.value = value;
            dynamicValidateForm.properties = value.properties
        }
    },
    { immediate: true, deep: true },
);
watch(
    () => extraValue.value,
    () => {
        validate('sign')
        formData.value.size = extraValue.value?.length
    },
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
        .formRef-form-item-action {
            width: 10%;
        }
    }
    .formRef-form-item-add {
        margin-top: 20px;
    }
}
</style>
