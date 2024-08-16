<template>
    <page-container>
        <FullPage>
            <j-card>
                <j-row :gutter="[24, 24]" style="padding: 24px">
                    <j-col :span="12">
                        <j-form class="form" layout="vertical" :model="formData" name="basic" :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 24 }" autocomplete="off" ref="formRef">
                            <j-form-item :label="$t('Detail.index.786732-0')" name="type"
                                :rules="[{ required: true, message: $t('Detail.index.786732-1'), trigger: 'blur' }]">
                                <j-radio-group v-model:value="formData.type">
                                    <j-radio-button class="form-radio-button" value="common">
                                        <img :src="getImage('/certificate.png')" />
                                    </j-radio-button>
                                </j-radio-group>
                            </j-form-item>
                            <j-form-item :label="$t('Detail.index.786732-2')" name="name" :rules="[
                                { required: true, message: $t('Detail.index.786732-3'), trigger: 'blur' },
                                { max: 64, message: $t('Detail.index.786732-4') },
                            ]">
                                <j-input :placeholder="$t('Detail.index.786732-3')" v-model:value="formData.name" />
                            </j-form-item>
                            <j-form-item :label="$t('Detail.index.786732-5')" :name="['configs','cert']" :rules="[
                                { required: true, message: $t('Detail.index.786732-6'), trigger: 'change' },
                            ]">
                                <CertificateFile name="cert" v-model:modelValue="formData.configs.cert"
                                    :placeholder="$t('Detail.index.786732-7')" />
                            </j-form-item>
                            <j-form-item :label="$t('Detail.index.786732-8')" name="mode"
                                :rules="[{ required: true, message: $t('Detail.index.786732-9'), trigger: 'blur' }]">
                                <j-radio-group v-model:value="formData.mode" button-style="solid">
                                    <j-radio-button value="client" style="margin-right: 30px;"
                                        size="large">{{ $t('Detail.index.786732-10') }}</j-radio-button>
                                    <j-radio-button value="server" size="large">{{ $t('Detail.index.786732-11') }}</j-radio-button>
                                </j-radio-group>
                            </j-form-item>
                            <!-- <j-form-item label="认证方式" v-if="formData.mode === 'client'" v-bind="validateInfos.authenticationMethod">
                                <j-radio-group button-style="solid" v-model:value="formData.authenticationMethod">
                                    <j-radio-button value="single" style="margin-right: 30px;" size="large">单向认证</j-radio-button>
                                    <j-radio-button value="binomial" size="large">双向认证</j-radio-button>
                                </j-radio-group>
                            </j-form-item> -->
                            <j-form-item :label="$t('Detail.index.786732-12')" v-if="formData.mode !== 'client'" :name="['configs','key']" :rules="[
                                { required: true, message: $t('Detail.index.786732-6'), trigger: 'change' },
                            ]">
                                <CertificateFile name="key" v-model:modelValue="formData.configs.key"
                                    :placeholder="$t('Detail.index.786732-13')" />
                            </j-form-item>
                            <j-form-item :label="$t('Detail.index.786732-14')" name="description" :rules="[{ max: 200, message: $t('Detail.index.786732-15') }]">
                                <j-textarea :placeholder="$t('Detail.index.786732-16')" v-model:value="formData.description" :maxlength="200"
                                    :rows="3" showCount />
                            </j-form-item>

                            <j-form-item>
                                <j-button v-if="view === 'false'" class="form-submit" html-type="submit" type="primary"
                                    @click.prevent="onSubmit" :loading="loading">{{ $t('Detail.index.786732-17') }}</j-button>
                            </j-form-item>
                        </j-form>
                    </j-col>
                    <j-col :span="12">
                        <div class="doc">
                            <h1>{{ $t('Detail.index.786732-18') }}</h1>
                            <div>
                                {{ $t('Detail.index.786732-19') }}
                            </div>
                            <h1>{{ $t('Detail.index.786732-20') }}</h1>
                            <h2>1、{{ $t('Detail.index.786732-5') }}</h2>
                            <div>
                                {{ $t('Detail.index.786732-22') }}
                            </div>
                            <h2>2、{{ $t('Detail.index.786732-12') }}</h2>
                            <div>
                                {{ $t('Detail.index.786732-24') }}
                                {{ $t('Detail.index.786732-25') }}
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
//         type: [{ required: true, message: $t('Detail.index.786732-1'), trigger: 'blur' }],
//         name: [
//             { required: true, message: $t('Detail.index.786732-3'), trigger: 'blur' },
//             { max: 64, message: $t('Detail.index.786732-4') },
//         ],
//         'configs.cert': [
//             { required: true, message: $t('Detail.index.786732-6'), trigger: 'blur' },
//         ],
//         'configs.key': [
//             { required: true, message: $t('Detail.index.786732-6'), trigger: 'blur' },
//         ],
//         description: [{ max: 200, message: $t('Detail.index.786732-15') }],
//         mode:[{ required: true, message: $t('Detail.index.786732-9'), trigger: 'blur' }],
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
                onlyMessage($t('Detail.index.786732-26'), 'success');
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
        onlyMessage($t('Detail.index.786732-27'), 'success');
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
                authenticationMethod: result.authenticationMethod?.value,
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
