<template>
    <page-container>
        <FullPage>
            <j-card>
                <j-form
                    ref="formRef"
                    class="form"
                    layout="vertical"
                    :model="formData"
                    name="basic"
                    autocomplete="off"
                >
                    <j-row :gutter="[16, 0]">
                        <j-col :span="12">
                            <j-form-item
                                :label="$t('Detail.index.217872-0')"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.217872-1'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('Detail.index.217872-2'),
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="formData.name"
                                    :placeholder="$t('Detail.index.217872-1')"
                                />
                            </j-form-item>
                        </j-col>
                        <j-col :span="12">
                            <j-form-item
                                :label="$t('Detail.index.217872-3')"
                                name="provider"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.217872-4'),
                                    },
                                ]"
                            >
                                <j-select
                                    ref="select"
                                    v-model:value="formData.provider"
                                    :options="options"
                                    :placeholder="$t('Detail.index.217872-4')"
                                ></j-select>
                            </j-form-item>
                        </j-col>
                        <j-col :span="12">
                            <j-form-item
                                :label="$t('Detail.index.217872-5')"
                                :name="['configuration', 'secret']"
                                :rules="[
                                    {
                                        max: 64,
                                        message: $t('Detail.index.217872-2'),
                                    },
                                ]"
                            >
                                <j-input-password
                                    :placeholder="$t('Detail.index.217872-6')"
                                    v-model:value="
                                        formData.configuration.secret
                                    "
                                />
                            </j-form-item>
                        </j-col>
                        <j-col :span="8" class="form-item">
                            <j-form-item
                                :name="['configuration', 'apiHost']"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.217872-7'),
                                    },
                                    {
                                        validator: validateAddress,
                                        message: $t('Detail.index.217872-8'),
                                    },
                                ]"
                            >
                                <template #label>
                                    API Host
                                    <j-tooltip
                                        :title="$t('Detail.index.217872-9')"
                                    >
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px"
                                        />
                                    </j-tooltip>
                                </template>
                                <j-input
                                    :placeholder="$t('Detail.index.217872-7')"
                                    v-model:value="
                                        formData.configuration.apiHost
                                    "
                                />
                            </j-form-item>
                        </j-col>
                        <j-col :span="4">
                            <j-form-item
                                class="form-item"
                                :name="['configuration', 'apiPort']"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.217872-10'),
                                    },
                                ]"
                            >
                                <div class="form-label"></div>

                                <j-input-number
                                    style="width: 100%"
                                    :min="1"
                                    :max="65535"
                                    :precision="0"
                                    :placeholder="$t('Detail.index.217872-11')"
                                    v-model:value="
                                        formData.configuration.apiPort
                                    "
                                />
                            </j-form-item>
                        </j-col>
                        <j-col :span="8" class="form-item">
                            <j-form-item
                                :name="['configuration', 'rtpIp']"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.217872-12'),
                                    },
                                    {
                                        validator: validateAddress,
                                        message: $t('Detail.index.217872-8'),
                                    },
                                ]"
                            >
                                <template #label>
                                    RTP IP
                                    <j-tooltip
                                        :title="$t('Detail.index.217872-13')"
                                    >
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px"
                                        />
                                    </j-tooltip>
                                </template>
                                <j-input
                                    :placeholder="$t('Detail.index.217872-12')"
                                    v-model:value="formData.configuration.rtpIp"
                                />
                            </j-form-item>
                        </j-col>
                        <j-col :span="4" v-if="!checked">
                            <j-form-item
                                class="form-item"
                                :name="['configuration', 'rtpPort']"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.217872-10'),
                                    },
                                ]"
                            >
                                <div class="form-label"></div>

                                <j-input-number
                                    style="width: 100%"
                                    :min="1"
                                    :max="65535"
                                    :precision="0"
                                    :placeholder="$t('Detail.index.217872-10')"
                                    v-model:value="
                                        formData.configuration.rtpPort
                                    "
                                />
                            </j-form-item>
                        </j-col>
                        <j-col :span="4" v-if="checked">
                            <j-form-item
                                class="form-item"
                                :name="[
                                    'configuration',
                                    'dynamicRtpPortRange0',
                                ]"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.217872-14'),
                                    },
                                ]"
                            >
                                <div class="form-label"></div>
                                <j-input-number
                                    style="width: 100%"
                                    :min="1"
                                    :max="
                                        formData.configuration
                                            .dynamicRtpPortRange1 || 65535
                                    "
                                    :precision="0"
                                    :placeholder="$t('Detail.index.217872-15')"
                                    v-model:value="
                                        formData.configuration
                                            .dynamicRtpPortRange0
                                    "
                                />
                            </j-form-item>
                        </j-col>
                        <div class="form-item-checked" v-if="checked">{{ $t('Detail.index.217872-16') }}</div>
                        <j-col :span="4" v-if="checked">
                            <j-form-item
                                class="form-item"
                                :name="[
                                    'configuration',
                                    'dynamicRtpPortRange1',
                                ]"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Detail.index.217872-17'),
                                    },
                                ]"
                            >
                                <div class="form-label"></div>
                                <j-input-number
                                    style="width: 100%"
                                    :min="
                                        formData.configuration
                                            .dynamicRtpPortRange0 || 1
                                    "
                                    :max="65535"
                                    :precision="0"
                                    :placeholder="$t('Detail.index.217872-18')"
                                    v-model:value="
                                        formData.configuration
                                            .dynamicRtpPortRange1
                                    "
                                />
                            </j-form-item>
                        </j-col>
                        <j-col :span="4">
                            <j-form-item
                                class="form-item-checked2"
                                :name="['configuration', 'dynamicRtpPort']"
                            >
                                <div class="form-label"></div>
                                <j-checkbox
                                    v-model:checked="
                                        formData.configuration.dynamicRtpPort
                                    "
                                >
                                    {{ $t('Detail.index.217872-19') }}
                                </j-checkbox>
                            </j-form-item>
                        </j-col>

                        <j-col :span="24">
                            <j-form-item>
                                <j-button
                                    v-if="view === 'false'"
                                    html-type="submit"
                                    type="primary"
                                    @click.prevent="onSubmit"
                                    :loading="loading"
                                    >{{ $t('Detail.index.217872-20') }}</j-button
                                >
                            </j-form-item>
                        </j-col>
                    </j-row>
                </j-form>
            </j-card>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup name="StreamDetail">
import { onlyMessage } from '@/utils/comm';
import { queryProviders, queryDetail, save, update } from '@/api/media/stream';
import type { FormInstance } from 'ant-design-vue';

import { FormDataType } from '../type';
import { testIpv4_6 } from '@/utils/validate';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const router = useRouter();
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const formRef = ref<FormInstance>();

const loading = ref(false);
const options = ref([]);
const checked = ref(false);

const Validator = {
    regDomain: new RegExp(
        /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
    ),
    regOnlyNumber: new RegExp(/^\d+$/),
};

const validateAddress = (_rule: any, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (
            testIpv4_6(value) ||
            Validator.regDomain.test(value)
        ) {
            return resolve('');
        } else {
            return value ? reject($t('Detail.index.217872-8')) : resolve('');
        }
    });

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
    let data: any = await formRef.value?.validate();
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
        onlyMessage($t('Detail.index.217872-21'), 'success');
        router.push('/iot/link/Stream');
    }
    loading.value = false;
};

const detail = async (id: string) => {
    loading.value = true;
    const resp: any = await queryProviders();
    options.value = resp.result.map((item: any) => ({
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
    }
}
</style>
