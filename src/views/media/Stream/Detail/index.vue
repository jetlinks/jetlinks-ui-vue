<template>
    <page-container>
        <a-card>
            <a-form
                ref="formRef"
                class="form"
                layout="vertical"
                :model="formData"
                name="basic"
                autocomplete="off"
            >
                <a-row :gutter="[16, 0]">
                    <a-col :span="12">
                        <a-form-item
                            label="流媒体名称"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入流媒体名称',
                                },
                                {
                                    max: 64,
                                    message: '最大可输入64个字符',
                                },
                            ]"
                        >
                            <a-input
                                v-model:value="formData.name"
                                placeholder="请输入流媒体名称"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="服务商"
                            name="provider"
                            :rules="[
                                {
                                    required: true,
                                    message: '请选择服务商',
                                },
                            ]"
                        >
                            <a-select
                                ref="select"
                                v-model:value="formData.provider"
                                :options="options"
                                placeholder="请选择服务商"
                            ></a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="密钥"
                            :name="['configuration', 'secret']"
                            :rules="[
                                {
                                    max: 64,
                                    message: '最大可输入64个字符',
                                },
                            ]"
                        >
                            <a-input-password
                                placeholder="请输入密钥"
                                v-model:value="formData.configuration.secret"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" class="form-item">
                        <a-form-item
                            :name="['configuration', 'apiHost']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入API Host',
                                },
                                {
                                    pattern: regDomain,
                                    message: '请输入正确的IP地址或者域名',
                                },
                            ]"
                        >
                            <div class="form-label">
                                API Host
                                <span class="form-label-required">*</span>
                                <a-tooltip>
                                    <template #title>
                                        <p>调用流媒体接口时请求的服务地址</p>
                                    </template>
                                    <question-circle-outlined />
                                </a-tooltip>
                            </div>

                            <a-input
                                placeholder="请输入API Host"
                                v-model:value="formData.configuration.apiHost"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="4">
                        <a-form-item
                            class="form-item"
                            :name="['configuration', 'apiPort']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入端口',
                                },
                            ]"
                        >
                            <div class="form-label"></div>

                            <a-input-number
                                style="width: 100%"
                                :min="1"
                                :max="65535"
                                :precision="0"
                                placeholder="请输入输入端口"
                                v-model:value="formData.configuration.apiPort"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" class="form-item">
                        <a-form-item
                            :name="['configuration', 'rtpIp']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入RTP IP',
                                },
                                {
                                    pattern: regDomain,
                                    message: '请输入正确的IP地址或者域名',
                                },
                            ]"
                        >
                            <div class="form-label">
                                RTP IP
                                <span class="form-label-required">*</span>
                                <a-tooltip>
                                    <template #title>
                                        <p>
                                            视频设备将流推送到该IP地址下，部分设备仅支持IP地址，建议全是用IP地址
                                        </p>
                                    </template>
                                    <question-circle-outlined />
                                </a-tooltip>
                            </div>

                            <a-input
                                placeholder="请输入RTP IP"
                                v-model:value="formData.configuration.rtpIp"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="4" v-if="!checked">
                        <a-form-item
                            class="form-item"
                            :name="['configuration', 'rtpPort']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入端口',
                                },
                            ]"
                        >
                            <div class="form-label"></div>

                            <a-input-number
                                style="width: 100%"
                                :min="1"
                                :max="65535"
                                :precision="0"
                                placeholder="请输入端口"
                                v-model:value="formData.configuration.rtpPort"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="4" v-if="checked">
                        <a-form-item
                            class="form-item"
                            :name="['configuration', 'dynamicRtpPortRange0']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入起始端口',
                                },
                            ]"
                        >
                            <div class="form-label"></div>
                            <a-input-number
                                style="width: 100%"
                                :min="1"
                                :max="
                                    formData.configuration.dynamicRtpPortRange1
                                "
                                :precision="0"
                                placeholder="起始端口"
                                v-model:value="
                                    formData.configuration.dynamicRtpPortRange0
                                "
                            />
                        </a-form-item>
                    </a-col>
                    <div class="form-item-checked" v-if="checked">至</div>
                    <a-col :span="4" v-if="checked">
                        <a-form-item
                            class="form-item"
                            :name="['configuration', 'dynamicRtpPortRange1']"
                            :rules="[
                                {
                                    required: true,
                                    message: '请输入终止端口',
                                },
                            ]"
                        >
                            <div class="form-label"></div>
                            <a-input-number
                                style="width: 100%"
                                :min="
                                    formData.configuration.dynamicRtpPortRange0
                                "
                                :max="65535"
                                :precision="0"
                                placeholder="终止端口"
                                v-model:value="
                                    formData.configuration.dynamicRtpPortRange1
                                "
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="4">
                        <a-form-item
                            class="form-item-checked2"
                            :name="['configuration', 'dynamicRtpPort']"
                        >
                            <div class="form-label"></div>
                            <a-checkbox
                                v-model:checked="
                                    formData.configuration.dynamicRtpPort
                                "
                            >
                                动态端口
                            </a-checkbox>
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item>
                            <a-button
                                v-if="view === 'false'"
                                class="form-submit"
                                html-type="submit"
                                type="primary"
                                @click.prevent="onSubmit"
                                :loading="loading"
                                >保存</a-button
                            >
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>
    </page-container>
</template>

<script lang="ts" setup name="CertificateDetail">
import { message, Form } from 'ant-design-vue';
import { queryProviders, queryDetail, save, update } from '@/api/media/stream';
import type { FormInstance } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

import { FormDataType } from '../type';

const router = useRouter();
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const formRef = ref<FormInstance>();

const loading = ref(false);
const options = ref([]);
const checked = ref(false);
const regDomain =
    /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;

const formData = ref<FormDataType>({
    name: '',
    provider: undefined,
    configuration: {
        secret: '',
        apiHost: '',
        apiPort: '',
        rtpIp: '',
        rtpPort: '',
        dynamicRtpPort: false,
        // dynamicRtpPortRange: [],
        dynamicRtpPortRange0: '',
        dynamicRtpPortRange1: '',
    },
});

const onSubmit = async () => {
    let data = await formRef.value?.validate();
    let params = { ...data };
    const { configuration } = data;
    if (configuration.dynamicRtpPort) {
        const { dynamicRtpPortRange0, dynamicRtpPortRange1 } = configuration;
        delete configuration.dynamicRtpPortRange0;
        delete configuration.dynamicRtpPortRange1;
        params.configuration = {
            ...configuration,
            dynamicRtpPortRange: [dynamicRtpPortRange0, dynamicRtpPortRange1],
        };
    }

    loading.value = true;
    const response =
        id === ':id' ? await save(params) : await update({ ...params, id });
    if (response.status === 200) {
        message.success('操作成功');
        router.push('/iot/link/Stream');
    }
    loading.value = false;
};

const detail = async (id: string) => {
    loading.value = true;
    const resp = await queryProviders();
    options.value = resp.result.map((item) => ({
        value: item.id,
        label: item.name,
    }));
    if (id !== ':id') {
        const res = await queryDetail(id);
        if (res.success) {
            const result = res.result as any;
            formData.value = { ...result };

            const { configuration } = result;
            if (configuration.dynamicRtpPort) {
                const { dynamicRtpPortRange } = configuration;
                delete configuration.dynamicRtpPortRange;
                formData.value.configuration = {
                    ...configuration,
                    dynamicRtpPortRange0: dynamicRtpPortRange[0],
                    dynamicRtpPortRange1: dynamicRtpPortRange[1],
                };
            }
        }
    }
    loading.value = false;
};
detail(id);

watch(
    () => formData.value.configuration.dynamicRtpPort,
    (value) => {
        checked.value = value;
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
.form {
    .form-submit {
        background-color: @primary-color !important;
    }
    .form-item-checked {
        padding: 0;
        padding-top: 35px;
    }
    .form-item-checked2 {
        padding-top: 5px;
    }
    .form-label {
        height: 30px;
        padding-bottom: 8px;
        .form-label-required {
            color: red !important;
            margin: 0 4px 0 -2px;
        }
    }
}
</style>
