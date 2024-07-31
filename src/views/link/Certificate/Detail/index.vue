<template>
    <page-container>
        <FullPage>
            <j-card>
                <j-row :gutter="[24, 24]" style="padding: 24px">
                    <j-col :span="12">
                        <j-form class="form" layout="vertical" :model="formData" name="basic" :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 24 }" autocomplete="off" ref="formRef">
                            <j-form-item label="证书标准" name="type"
                                :rules="[{ required: true, message: '请选择证书标准', trigger: 'blur' }]">
                                <j-radio-group v-model:value="formData.type">
                                    <j-radio-button class="form-radio-button" value="common">
                                        <img :src="getImage('/certificate.png')" />
                                    </j-radio-button>
                                </j-radio-group>
                            </j-form-item>
                            <j-form-item label="证书名称" name="name" :rules="[
                                { required: true, message: '请输入证书名称', trigger: 'blur' },
                                { max: 64, message: '最多可输入64个字符' },
                            ]">
                                <j-input placeholder="请输入证书名称" v-model:value="formData.name" />
                            </j-form-item>
                            <j-form-item label="证书文件" :name="['configs','cert']" :rules="[
                                { required: true, message: '请输入或上传文件', trigger: 'change' },
                            ]">
                                <CertificateFile name="cert" v-model:modelValue="formData.configs.cert"
                                    placeholder="请输入证书文件" />
                            </j-form-item>
                            <j-form-item label="证书类型" name="mode"
                                :rules="[{ required: true, message: '请选择证书类型', trigger: 'blur' }]">
                                <j-radio-group v-model:value="formData.mode" button-style="solid">
                                    <j-radio-button value="client" style="margin-right: 30px;"
                                        size="large">客户端</j-radio-button>
                                    <j-radio-button value="server" size="large">服务端</j-radio-button>
                                </j-radio-group>
                            </j-form-item>
                            <!-- <j-form-item label="认证方式" v-if="formData.mode === 'client'" v-bind="validateInfos.authenticationMethod">
                                <j-radio-group button-style="solid" v-model:value="formData.authenticationMethod">
                                    <j-radio-button value="single" style="margin-right: 30px;" size="large">单向认证</j-radio-button>
                                    <j-radio-button value="binomial" size="large">双向认证</j-radio-button>
                                </j-radio-group>
                            </j-form-item> -->
                            <j-form-item label="证书私钥" v-if="formData.mode !== 'client'" :name="['configs','key']" :rules="[
                                { required: true, message: '请输入或上传文件', trigger: 'change' },
                            ]">
                                <CertificateFile name="key" v-model:modelValue="formData.configs.key"
                                    placeholder="请输入证书私钥" />
                            </j-form-item>
                            <j-form-item label="说明" name="description" :rules="[{ max: 200, message: '最多可输入200个字符' }]">
                                <j-textarea placeholder="请输入说明" v-model:value="formData.description" :maxlength="200"
                                    :rows="3" showCount />
                            </j-form-item>

                            <j-form-item>
                                <j-button v-if="view === 'false'" class="form-submit" html-type="submit" type="primary"
                                    @click.prevent="onSubmit" :loading="loading">保存</j-button>
                            </j-form-item>
                        </j-form>
                    </j-col>
                    <j-col :span="12">
                        <div class="doc">
                            <h1>1. 概述</h1>
                            <div>
                                证书由受信任的数字证书颁发机构CA，在验证服务器身份后颁发，具有服务器身份验证和数据传输加密功能，保障设备与平台间的数据传输安全。配置后可被网络组件引用。
                            </div>
                            <h1>2. 配置说明</h1>
                            <h2>1、证书文件</h2>
                            <div>
                                您可以使用文本编辑工具打开PEM格式的证书文件，复制其中的内容并粘贴到该文本框，或者单击该文本框下的上传，并选择存储在本地计算机的证书文件，将文件内容上传到文本框。
                            </div>
                            <h2>2、证书私钥</h2>
                            <div>
                                填写证书私钥内容的PEM编码。
                                您可以使用文本编辑工具打开KEY格式的证书私钥文件，复制其中的内容并粘贴到该文本框，或者单击该文本框下的上传并选择存储在本地计算机的证书私钥文件，将文件内容上传到文本框。
                            </div>
                        </div>
                    </j-col>
                </j-row>
            </j-card>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup name="CertificateDetail">
import { Form } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import CertificateFile from './CertificateFile.vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { save, update, queryDetail } from '@/api/link/certificate';
import { FormDataType, TypeObjType } from '../type';
import { onlyMessage } from '@/utils/comm';
import { cloneDeep } from 'lodash-es';

const router = useRouter();
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

// const useForm = Form.useForm;

const formRef = ref()
const fileLoading = ref(false);
const loading = ref(false);

const formData = ref<FormDataType>({
    type: 'common',
    name: '',
    configs: {
        cert: '',
        key: '',
    },
    description: '',
    mode: 'server',
    authenticationMethod: 'single'
});

// const rules = {
//         type: [{ required: true, message: '请选择证书标准', trigger: 'blur' }],
//         name: [
//             { required: true, message: '请输入证书名称', trigger: 'blur' },
//             { max: 64, message: '最多可输入64个字符' },
//         ],
//         'configs.cert': [
//             { required: true, message: '请输入或上传文件', trigger: 'blur' },
//         ],
//         'configs.key': [
//             { required: true, message: '请输入或上传文件', trigger: 'blur' },
//         ],
//         description: [{ max: 200, message: '最多可输入200个字符' }],
//         mode:[{ required: true, message: '请选择证书类型', trigger: 'blur' }],
//         authenticationMethod:[{ required: true, message: '请选择认证方式', trigger: 'blur' }]
// );

const onSubmit = () => {
    formRef.value.validate()
        .then(async (res) => {
            let params: any = toRaw(formData.value);
            if (formData.value.mode === 'client') {
                if (formData.value.authenticationMethod === 'binomial') {
                    params.configs.trust = params.configs.cert
                } else {
                    params.configs = {
                        // key:formData.value.configs.key,
                        trust: formData.value.configs.cert
                    }
                }
            }
            loading.value = true;
            const response =
                id === ':id'
                    ? await save(params).catch(() => { })
                    : await update({ ...params, id }).catch(() => { });
            if (response?.status === 200) {
                onlyMessage('操作成功', 'success');
                router.push('/iot/link/certificate');
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
        onlyMessage('上传成功！', 'success');
        const result = info.file.response?.result;
        formData.value.configs.cert = result;
        fileLoading.value = false;
    }
};

const detail = async (id: string) => {
    if (id !== ':id') {
        loading.value = true;
        const res: any = await queryDetail(id);
        if (res.success) {
            const result: any = res.result;
            const type = result.type.value as TypeObjType;
            formData.value = {
                ...result,
                configs: {
                    key: result.configs.key,
                    cert: result.configs?.cert ? result.configs?.cert : result.configs?.trust
                },
                mode: result.mode.value,
                authenticationMethod: result?.authenticationMethod?.value || 'single',
                type,
            };
        }
        loading.value = false;
    }
};

detail(id);
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
}
</style>
