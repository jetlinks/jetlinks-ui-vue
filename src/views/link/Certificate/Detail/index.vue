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
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
                >
                    <a-form-item
                        label="证书标准"
                        name="type"
                        :rules="[
                            {
                                required: true,
                                message: '请选择证书标准',
                            },
                        ]"
                    >
                        <a-radio-group v-model:value="formData.type">
                            <a-radio-button
                                class="form-radio-button"
                                value="common"
                            >
                                <img :src="getImage('/certificate.png')" />
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-item>

                    <a-form-item
                        label="证书名称"
                        name="name"
                        :rules="[
                            {
                                required: true,
                                message: '请输入证书名称',
                            },
                        ]"
                    >
                        <a-input
                            placeholder="请输入证书名称"
                            v-model:value="formData.name"
                        />
                    </a-form-item>
                    <a-form-item
                        label="证书文件"
                        name="cert"
                        :rules="[
                            {
                                required: true,
                                message: '上传证书文件',
                            },
                        ]"
                    >
                        <CertificateFile
                            placeholder='证书格式以"-----BEGIN CERTIFICATE-----"开头，以"-----END CERTIFICATE-----"结尾"'
                        />
                    </a-form-item>
                    <a-form-item
                        label="证书私钥"
                        name="key"
                        :rules="[
                            {
                                required: true,
                                message: '请上传证书私钥',
                            },
                        ]"
                    >
                        <CertificateFile
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
<!-- export const ACCESS_TOKEN_KEY  = 'X-Access-Token' -->
<!-- export const ACCESS_TOKEN = 'device_token' -->

<script lang="ts" setup name="CertificateDetail">
import { message } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import CertificateFile from './CertificateFile.vue';

const formData = reactive({
    type: 'common',
    name: '',
    configs: {
        cert: '',
        key: '',
    },
    description: '',
});

const onFinish = (values: any) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const headers = {
    authorization: 'authorization-text',
};

const handleChange = (info: any) => {
    if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }
};
const fileList = ref([]);
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
