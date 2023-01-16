<template>
    <a-card>
        <a-row :gutter="[24, 24]" style="padding: 24px">
            <a-col :span="12">
                <a-form
                    class="form"
                    layout="vertical"
                    :model="formData"
                    name="basic"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                >
                    <a-form-item label="证书标准" v-bind="validateInfos.type">
                        <a-radio-group v-model:value="formData.type">
                            <a-radio-button
                                class="form-radio-button"
                                value="common"
                            >
                                <img :src="getImage('/certificate.png')" />
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-item>

                    <a-form-item label="证书名称" v-bind="validateInfos.name">
                        <a-input
                            placeholder="请输入证书名称"
                            v-model:value="formData.name"
                        />
                    </a-form-item>
                    <a-form-item
                        label="证书文件"
                        v-bind="validateInfos['configs.cert']"
                    >
                        <CertificateFile
                            name="cert"
                            v-model:modelValue="formData.configs.cert"
                            placeholder='证书格式以"-----BEGIN CERTIFICATE-----"开头，以"-----END CERTIFICATE-----"结尾"'
                        />
                    </a-form-item>
                    <a-form-item
                        label="证书私钥"
                        v-bind="validateInfos['configs.key']"
                    >
                        <CertificateFile
                            name="key"
                            v-model:modelValue="formData.configs.key"
                            placeholder='证书私钥格式以"-----BEGIN (RSA|EC) PRIVATE KEY-----"开头，以"-----END(RSA|EC) PRIVATE KEY-----"结尾。'
                        />
                    </a-form-item>
                    <a-form-item label="说明" name="description">
                        <a-textarea
                            placeholder="请输入说明"
                            v-model:value="formData.description"
                            :maxlength="200"
                            :rows="3"
                            showCount
                        />
                    </a-form-item>

                    <a-form-item>
                        <a-button
                            class="form-submit"
                            html-type="submit"
                            type="primary"
                            @click.prevent="onSubmit"
                            :loading="loading"
                            >保存</a-button
                        >
                    </a-form-item>
                </a-form>
            </a-col>
            <a-col :span="12">
                <div class="doc">
                    <h1>1. 概述</h1>
                    <div>
                        证书由受信任的数字证书颁发机构CA，在验证服务器身份后颁发，具有服务器身份验证和数据传输加密功能，保障设备与平台间的数据传输安全。配置后可被网络组件引用。
                    </div>
                    <h1>2. 配置说明</h1>
                    <h2>1、证书文件</h2>
                    <div>
                        您可以使用文本编辑工具打开PEM或者CRT格式的证书文件，复制其中的内容并粘贴到该文本框，或者单击该文本框下的上传，并选择存储在本地计算机的证书文件，将文件内容上传到文本框。
                    </div>
                    <h2>2、证书私钥</h2>
                    <div>
                        填写证书私钥内容的PEM编码。
                        您可以使用文本编辑工具打开KEY格式的证书私钥文件，复制其中的内容并粘贴到该文本框，或者单击该文本框下的上传并选择存储在本地计算机的证书私钥文件，将文件内容上传到文本框。
                    </div>
                </div>
            </a-col>
        </a-row>
    </a-card>
</template>

<script lang="ts" setup name="CertificateDetail">
import { message, Form } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import CertificateFile from './CertificateFile.vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { save } from '@/api/link/certificate';

const router = useRouter();

const useForm = Form.useForm;

const fileLoading = ref(false);
const loading = ref(false);

const formData = reactive({
    type: 'common',
    name: '',
    configs: {
        cert: '',
        key: '',
    },
    description: '',
});

const { resetFields, validate, validateInfos } = useForm(
    formData,
    reactive({
        type: [{ required: true, message: '请选择证书标准', trigger: 'blur' }],
        name: [
            { required: true, message: '请输入证书名称', trigger: 'blur' },
            { max: 64, message: '最多可输入64个字符' },
        ],
        'configs.cert': [
            { required: true, message: '请输入或上传文件', trigger: 'blur' },
        ],
        'configs.key': [
            { required: true, message: '请输入或上传文件', trigger: 'blur' },
        ],
        description: [{ max: 200, message: '最多可输入200个字符' }],
    }),
);

const onSubmit = () => {
    validate()
        .then(async (res) => {
            const params = toRaw(formData);
            loading.value = true;
            const response = await save(params);
            if (response.status === 200) {
                message.success('操作成功');
                router.push('/link/certificate');
            }
            loading.value = false;
        })
        .catch((err) => {
            loading.value = false;
        });
};

const handleChange = (info: UploadChangeParam) => {
    fileLoading.value = true;
    if (info.file.status === 'done') {
        message.success('上传成功！');
        const result = info.file.response?.result;
        formData.configs.cert = result;
        fileLoading.value = false;
    }
};
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
    .form-upload-button {
        margin-top: 10px;
    }
    .form-submit {
        background-color: @primary-color !important;
    }
}

.doc {
    height: 100%;
    padding: 0 24px;
    overflow-y: auto;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fff;

    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;

        &:first-child {
            margin-top: 0;
        }
    }

    h2 {
        margin: 6px 10px;
        color: rgba(0, 0, 0, 0.8);
        font-weight: 400;
        font-size: 14px;
    }
}
</style>
