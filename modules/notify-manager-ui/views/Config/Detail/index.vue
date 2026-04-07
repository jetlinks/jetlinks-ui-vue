<!-- 通知配置详情 -->
<template>
    <j-page-container>
        <a-card>
            <a-row>
                <a-col :span="10">
                    <a-form layout="vertical">
                        <a-form-item
                            :label="$t('Detail.index.707691-0')"
                            v-bind="validateInfos.type"
                        >
                            <a-select
                                v-model:value="formData.type"
                                :placeholder="$t('Detail.index.707691-1')"
                                :disabled="_disabled"
                                @change="handleTypeChange"
                            >
                                <a-select-option
                                    v-for="(item, index) in NOTICE_METHOD"
                                    :key="index"
                                    :value="item.value"
                                >
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item :label="$t('Detail.index.707691-2')" v-bind="validateInfos.name">
                            <a-input
                                v-model:value="formData.name"
                                :placeholder="$t('Detail.index.707691-3')"
                            />
                        </a-form-item>
                        <a-form-item
                            :label="$t('Detail.index.707691-4')"
                            v-bind="validateInfos.provider"
                            v-if="formData.type !== 'email'"
                        >
                            <RadioCard
                                :options="msgType"
                                v-model="formData.provider"
                                @change="handleProviderChange"
                                :disabled="flag"
                            />
                        </a-form-item>
                        <!-- 钉钉 -->
                        <template v-if="formData.type === 'dingTalk'">
                            <template
                                v-if="formData.provider === 'dingTalkMessage'"
                            >
                                <a-form-item
                                    label="AppKey"
                                    v-bind="
                                        validateInfos['configuration.appKey']
                                    "
                                >
                                    <a-input
                                        v-model:value="
                                            formData.configuration.appKey
                                        "
                                        :placeholder="$t('Detail.index.707691-5')"
                                    />
                                </a-form-item>
                                <a-form-item
                                    label="AppSecret"
                                    v-bind="
                                        validateInfos['configuration.appSecret']
                                    "
                                >
                                    <a-input
                                        v-model:value="
                                            formData.configuration.appSecret
                                        "
                                        :placeholder="$t('Detail.index.707691-6')"
                                    />
                                </a-form-item>
                            </template>
                            <template
                                v-if="
                                    formData.provider === 'dingTalkRobotWebHook'
                                "
                            >
                                <a-form-item
                                    label="WebHook"
                                    v-bind="validateInfos['configuration.url']"
                                    :rules="[{ max: 64, message: $t('Detail.index.707691-7') }]"
                                >
                                    <a-input
                                        v-model:value="
                                            formData.configuration.url
                                        "
                                        :placeholder="$t('Detail.index.707691-8')"
                                    />
                                </a-form-item>
                            </template>
                        </template>
                        <!-- 微信 -->
                        <template v-if="formData.type === 'weixin'">
                            <a-form-item
                                label="corpId"
                                v-bind="validateInfos['configuration.corpId']"
                            >
                                <a-input
                                    v-model:value="
                                        formData.configuration.corpId
                                    "
                                    :placeholder="$t('Detail.index.707691-9')"
                                />
                            </a-form-item>
                            <a-form-item
                                label="corpSecret"
                                v-bind="
                                    validateInfos['configuration.corpSecret']
                                "
                            >
                                <a-input
                                    v-model:value="
                                        formData.configuration.corpSecret
                                    "
                                    :placeholder="$t('Detail.index.707691-10')"
                                />
                            </a-form-item>
                        </template>
                        <!-- 邮件 -->
                        <template v-if="formData.type === 'email'">
                            <a-form-item
                                :label="$t('Detail.index.707691-11')"
                                v-bind="validateInfos['configuration.host']"
                            >
                                <a-space>
                                    <a-auto-complete
                                        v-model:value="
                                            formData.configuration.host
                                        "
                                        :placeholder="$t('Detail.index.707691-12')"
                                        style="width: 180px"
                                        :options="[
                                            {
                                                label: 'smtp.163.com',
                                                value: 'smtp.163.com',
                                            },
                                            {
                                                label: 'pop.163.com',
                                                value: 'pop.163.com',
                                            },
                                            {
                                                label: 'smtp.exmail.qq.com',
                                                value: 'smtp.exmail.qq.com',
                                            },
                                            {
                                                label: 'pop.exmail.qq.com',
                                                value: 'pop.exmail.qq.com',
                                            },
                                            {
                                                label: 'smtp.qq.com',
                                                value: 'smtp.qq.com',
                                            },
                                            {
                                                label: 'pop.qq.com',
                                                value: 'pop.qq.com',
                                            },
                                            {
                                                label: 'smtpdm.aliyun.com',
                                                value: 'smtpdm.aliyun.com',
                                            },
                                            {
                                                label: 'smtp.126.com',
                                                value: 'smtp.126.com',
                                            },
                                            {
                                                label: 'pop.126.com',
                                                value: 'pop.126.com',
                                            },
                                        ]"
                                    />
                                    <a-input-number
                                        v-model:value="
                                            formData.configuration.port
                                        "
                                        :precision="0"
                                        :min="1"
                                        :max="65535"
                                    />
                                    <a-checkbox
                                        v-model:checked="
                                            formData.configuration.ssl
                                        "
                                        @change="handleSslChange"
                                    >
                                        {{ $t('Detail.index.707691-13') }}
                                    </a-checkbox>
                                </a-space>
                            </a-form-item>
                            <a-form-item
                                :label="$t('Detail.index.707691-14')"
                                v-bind="validateInfos['configuration.sender']"
                            >
                                <a-input
                                    v-model:value="
                                        formData.configuration.sender
                                    "
                                    placeholder="username@domain.com"
                                />
                            </a-form-item>
                            <a-form-item
                                :label="$t('Detail.index.707691-15')"
                                v-bind="validateInfos['configuration.username']"
                            >
                                <a-input
                                    v-model:value="
                                        formData.configuration.username
                                    "
                                    :placeholder="$t('Detail.index.707691-16')"
                                />
                            </a-form-item>
                            <a-form-item
                                :label="$t('Detail.index.707691-17')"
                                v-bind="validateInfos['configuration.password']"
                            >
                                <a-input
                                    v-model:value="
                                        formData.configuration.password
                                    "
                                    :placeholder="$t('Detail.index.707691-18')"
                                />
                            </a-form-item>
                        </template>
                        <!-- 语音/短信 -->
                        <template
                            v-if="
                                formData.type === 'voice' ||
                                formData.type === 'sms'
                            "
                        >
                            <a-form-item
                                label="RegionId"
                                v-bind="validateInfos['configuration.regionId']"
                            >
                                <a-select
                                    v-model:value="
                                        formData.configuration.regionId
                                    "
                                    :placeholder="$t('Detail.index.707691-19')"
                                >
                                    <a-select-option
                                        v-for="(item, index) in regionList"
                                        :key="index"
                                        :value="item.value"
                                    >
                                        {{ item.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item
                                label="AccessKeyId"
                                v-bind="
                                    validateInfos['configuration.accessKeyId']
                                "
                            >
                                <a-input
                                    v-model:value="
                                        formData.configuration.accessKeyId
                                    "
                                    :placeholder="$t('Detail.index.707691-20')"
                                />
                            </a-form-item>
                            <a-form-item
                                label="Secret"
                                v-bind="validateInfos['configuration.secret']"
                            >
                                <a-input
                                    v-model:value="
                                        formData.configuration.secret
                                    "
                                    :placeholder="$t('Detail.index.707691-21')"
                                />
                            </a-form-item>
                        </template>
                        <!-- webhook -->
                        <template v-if="formData.type === 'webhook'">
                            <a-form-item
                                label="WebHook"
                                v-bind="validateInfos['configuration.url']"
                            >
                                <a-input
                                    v-model:value="formData.configuration.url"
                                    :placeholder="$t('Detail.index.707691-8')"
                                />
                            </a-form-item>
                            <a-form-item :label="$t('Detail.index.707691-22')">
                                <EditTable
                                    ref="editTable"
                                    :headers="
                                        formData.configuration.headers
                                    "
                                />
                            </a-form-item>
                        </template>
                        <a-form-item :label="$t('Detail.index.707691-23')">
                            <a-textarea
                                v-model:value="formData.description"
                                show-count
                                :maxlength="200"
                                :rows="5"
                                :placeholder="$t('Detail.index.707691-24')"
                            />
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="btnLoading"
                            >
                                {{ $t('Detail.index.707691-25') }}
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-col>
                <a-col :span="12" :push="2">
                    <Doc :docData="formData" />
                </a-col>
            </a-row>
        </a-card>
    </j-page-container>
</template>

<script setup lang="ts">
import { onlyMessage } from '@jetlinks-web/utils';
import { Form } from 'ant-design-vue';
import type { ConfigFormData } from '../types';
import { NOTICE_METHOD , CONFIG_FIELD_MAP , MSG_TYPE } from '../../const';
import regionList from './regionId';
import EditTable from './components/EditTable.vue';
import configApi from '../../../api/config';
import Doc from './doc/index';
import { configImages } from '../../../assets/notice/index';
import RadioCard from '../../../components/RadioCard/index.vue'
import { useI18n } from 'vue-i18n';
import { useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
const router = useRouter();
const route = useRoute();
const useForm = Form.useForm;
const flag = ref<boolean>(false)
const editTable = ref();

// 消息类型
const msgType = ref([
    {
        label: $t('Detail.index.707691-26'),
        value: 'dingTalkMessage',
        logo: configImages.dingtalk,
    },
    {
        label: $t('Detail.index.707691-27'),
        value: 'dingTalkRobotWebHook',
        logo: configImages.dingTalkRebot,
    },
]);

// 表单数据
const formData = ref<ConfigFormData>({
    configuration: {
        host: '',
        port: 25,
        ssl: false,
        sender: '',
        username: '',
        password: '',
    },
    description: '',
    name: '',
    provider: 'embedded',
    type: 'email',
});

const { onBack } = useTabSaveSuccessBack()

// 根据通知方式展示对应的字段
watch(
    () => formData.value.type,
    (val) => {
        msgType.value = MSG_TYPE[val];

        formData.value.provider =
            route.params.id !== ':id'
                ? formData.value.provider
                : msgType.value[0].value;
    },
);

// 验证规则
const formRules = ref({
    type: [{ required: true, message: $t('Detail.index.707691-1') }],
    name: [
        { required: true, message: $t('Detail.index.707691-3') },
        { max: 64, message: $t('Detail.index.707691-7') },
    ],
    provider: [{ required: true, message: $t('Detail.index.707691-28') }],
    // 钉钉
    'configuration.appKey': [
        { required: true, message: $t('Detail.index.707691-5'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.707691-7'), trigger: 'change' },
    ],
    'configuration.appSecret': [
        { required: true, message: $t('Detail.index.707691-6'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.707691-7'), trigger: 'change' },
    ],
    // 'configuration.url': [{ required: true, message: $t('Detail.index.707691-8') }],
    // 微信
    'configuration.corpId': [
        { required: true, message: $t('Detail.index.707691-9'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.707691-7') },
    ],
    'configuration.corpSecret': [
        { required: true, message: $t('Detail.index.707691-10'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.707691-7') },
    ],
    // 阿里云语音/短信
    'configuration.regionId': [
        { required: true, message: $t('Detail.index.707691-29'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.707691-7') },
    ],
    'configuration.accessKeyId': [
        { required: true, message: $t('Detail.index.707691-20'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.707691-7') },
    ],
    'configuration.secret': [
        { required: true, message: $t('Detail.index.707691-21'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.707691-7') },
    ],
    // 邮件
    'configuration.host': [{ required: true, message: $t('Detail.index.707691-12'), trigger: 'blur' }],
    'configuration.sender': [
        { required: true, message: $t('Detail.index.707691-30'), trigger: 'blur' },
        // { max: 64, message: $t('Detail.index.707691-7') },
        {
            pattern:
                /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: $t('Detail.index.707691-31'),
        },
    ],
    'configuration.username': [
        { required: true, message: $t('Detail.index.707691-16'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.707691-7') },
    ],
    'configuration.password': [
        { required: true, message: $t('Detail.index.707691-18'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.707691-7') },
    ],
    // webhook
    'configuration.url': [
        { required: true, message: $t('Detail.index.707691-8'), trigger: 'blur' },
        // {
        //     pattern:
        //         /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[j-z]{2,6}\/?/,
        //     message: 'Webhook需要是一个合法的URL',
        // },
    ],
    description: [{ max: 200, message: $t('Detail.index.707691-32') }],
});

const { resetFields, validate, validateInfos, clearValidate } = useForm(
    formData.value,
    formRules.value,
);

const getDetail = async () => {
    if (route.params.id === ':id') return;
    const res = await configApi.detail(route.params.id as string);
    // formData.value = res.result;
    Object.assign(formData.value, res.result);
};
getDetail();

/**
 * 通知方式改变
 */
const handleTypeChange = () => {
    setTimeout(() => {
        formData.value.configuration =
            CONFIG_FIELD_MAP[formData.value.type][formData.value.provider];
        resetPublicFiles();
    }, 0);
};

const _disabled = computed(() => {
    return !!formData.value?.id || route.query?.notifyType
})

/**
 * 通知类型改变
 */
const handleProviderChange = () => {
    formData.value.configuration =
        CONFIG_FIELD_MAP[formData.value.type][formData.value.provider];
    resetPublicFiles();
};

const handleSslChange = () => {
    formData.value.configuration.port = formData.value.configuration.ssl
        ? 465
        : 25;
};

/**
 * 重置字段值
 */
const resetPublicFiles = () => {
    switch (formData.value.provider) {
        case 'dingTalkMessage':
            formData.value.configuration.appKey = undefined;
            formData.value.configuration.appSecret = undefined;
            break;
        case 'dingTalkRobotWebHook':
            formData.value.configuration.url = undefined;
            break;
        case 'corpMessage':
            formData.value.configuration.corpId = undefined;
            formData.value.configuration.corpSecret = undefined;
            break;
        case 'embedded':
            formData.value.configuration.host = undefined;
            formData.value.configuration.port = 25;
            formData.value.configuration.ssl = false;
            formData.value.configuration.sender = undefined;
            formData.value.configuration.username = undefined;
            formData.value.configuration.password = undefined;
            break;
        case 'aliyun':
            formData.value.configuration.regionId = undefined;
            formData.value.configuration.accessKeyId = undefined;
            formData.value.configuration.secret = undefined;
            break;
        case 'aliyunSms':
            formData.value.configuration.regionId = undefined;
            formData.value.configuration.accessKeyId = undefined;
            formData.value.configuration.secret = undefined;
            break;
        case 'http':
            formData.value.configuration.url = undefined;
            formData.value.configuration.headers = [];
            break;
    }
};

/**
 * 表单提交
 */
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
    if(formData.value.type === 'webhook') {
        Promise.all([editTable.value.validate(),validate()]).then(async (result:any) => {
            formData.value.configuration.headers = result[0]
            btnLoading.value = true;
            let res;
            if (!formData.value.id) {
                res = await configApi.save(formData.value);
            } else {
                res = await configApi.update(formData.value);
            }
            if (res?.success) {
                onlyMessage($t('Detail.index.707691-33'));
                if (route.query?.notifyType) {
                    // @ts-ignore
                    onBack(res.result)
                } else {
                    router.back();
                }
            }
        })
        .catch((err:any) => {
            console.log('err: ', err);
        })
        .finally(() => {
            btnLoading.value = false;
        });
    }else{
        validate()
        .then(async () => {
            btnLoading.value = true;
            let res;
            if (!formData.value.id) {
                res = await configApi.save(formData.value);
            } else {
                res = await configApi.update(formData.value);
            }
            if (res?.success) {
                onlyMessage($t('Detail.index.707691-33'));
                if (route.query?.notifyType) {
                    // @ts-ignore
                    onBack(res.result)
                } else {
                    router.back();
                }
            }
        })
        .catch((err:any) => {
            console.log('err: ', err);
        })
        .finally(() => {
            btnLoading.value = false;
        });
    }
};

watchEffect(() => {
    if(route.query?.notifyType) {
        formData.value.type = route.query.notifyType as string;
        if(route.query.notifyType === 'dingTalk') {
            formData.value.provider = 'dingTalkMessage';
            flag.value = true
        } else {
            flag.value = false
        }
        handleTypeChange()
    }
})
</script>
