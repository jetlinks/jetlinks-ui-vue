<!-- 通知配置详情 -->
<template>
    <page-container>
        <j-card>
            <j-row>
                <j-col :span="10">
                    <j-form layout="vertical">
                        <j-form-item
                            :label="$t('Detail.index.737432-0')"
                            v-bind="validateInfos.type"
                        >
                            <j-select
                                v-model:value="formData.type"
                                :placeholder="$t('Detail.index.737432-1')"
                                :disabled="_disabled"
                                @change="handleTypeChange"
                            >
                                <j-select-option
                                    v-for="(item, index) in NOTICE_METHOD"
                                    :key="index"
                                    :value="item.value"
                                >
                                    {{ item.label }}
                                </j-select-option>
                            </j-select>
                        </j-form-item>
                        <j-form-item :label="$t('Detail.index.737432-2')" v-bind="validateInfos.name">
                            <j-input
                                v-model:value="formData.name"
                                :placeholder="$t('Detail.index.737432-3')"
                            />
                        </j-form-item>
                        <j-form-item
                            :label="$t('Detail.index.737432-4')"
                            v-bind="validateInfos.provider"
                            v-if="formData.type !== 'email'"
                        >
                            <RadioCard
                                :options="msgType"
                                v-model="formData.provider"
                                @change="handleProviderChange"
                                :disabled="flag"
                            />
                        </j-form-item>
                        <!-- 钉钉 -->
                        <template v-if="formData.type === 'dingTalk'">
                            <template
                                v-if="formData.provider === 'dingTalkMessage'"
                            >
                                <j-form-item
                                    label="AppKey"
                                    v-bind="
                                        validateInfos['configuration.appKey']
                                    "
                                >
                                    <j-input
                                        v-model:value="
                                            formData.configuration.appKey
                                        "
                                        :placeholder="$t('Detail.index.737432-5')"
                                    />
                                </j-form-item>
                                <j-form-item
                                    label="AppSecret"
                                    v-bind="
                                        validateInfos['configuration.appSecret']
                                    "
                                >
                                    <j-input
                                        v-model:value="
                                            formData.configuration.appSecret
                                        "
                                        :placeholder="$t('Detail.index.737432-6')"
                                    />
                                </j-form-item>
                            </template>
                            <template
                                v-if="
                                    formData.provider === 'dingTalkRobotWebHook'
                                "
                            >
                                <j-form-item
                                    label="WebHook"
                                    v-bind="validateInfos['configuration.url']"
                                    :rules="[{ max: 64, message: $t('Detail.index.737432-7') }]"
                                >
                                    <j-input
                                        v-model:value="
                                            formData.configuration.url
                                        "
                                        :placeholder="$t('Detail.index.737432-8')"
                                    />
                                </j-form-item>
                            </template>
                        </template>
                        <!-- 微信 -->
                        <template v-if="formData.type === 'weixin'">
                            <j-form-item
                                label="corpId"
                                v-bind="validateInfos['configuration.corpId']"
                            >
                                <j-input
                                    v-model:value="
                                        formData.configuration.corpId
                                    "
                                    :placeholder="$t('Detail.index.737432-9')"
                                />
                            </j-form-item>
                            <j-form-item
                                label="corpSecret"
                                v-bind="
                                    validateInfos['configuration.corpSecret']
                                "
                            >
                                <j-input
                                    v-model:value="
                                        formData.configuration.corpSecret
                                    "
                                    :placeholder="$t('Detail.index.737432-10')"
                                />
                            </j-form-item>
                        </template>
                        <!-- 邮件 -->
                        <template v-if="formData.type === 'email'">
                            <j-form-item
                                :label="$t('Detail.index.737432-11')"
                                v-bind="validateInfos['configuration.host']"
                            >
                                <j-space>
                                    <j-auto-complete
                                        v-model:value="
                                            formData.configuration.host
                                        "
                                        :placeholder="$t('Detail.index.737432-12')"
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
                                    <j-input-number
                                        v-model:value="
                                            formData.configuration.port
                                        "
                                        :precision="0"
                                        :min="1"
                                        :max="65535"
                                    />
                                    <j-checkbox
                                        v-model:checked="
                                            formData.configuration.ssl
                                        "
                                        @change="handleSslChange"
                                    >
                                        {{ $t('Detail.index.737432-13') }}
                                    </j-checkbox>
                                </j-space>
                            </j-form-item>
                            <j-form-item
                                :label="$t('Detail.index.737432-14')"
                                v-bind="validateInfos['configuration.sender']"
                            >
                                <j-input
                                    v-model:value="
                                        formData.configuration.sender
                                    "
                                    placeholder="username@domain.com"
                                />
                            </j-form-item>
                            <j-form-item
                                :label="$t('Detail.index.737432-15')"
                                v-bind="validateInfos['configuration.username']"
                            >
                                <j-input
                                    v-model:value="
                                        formData.configuration.username
                                    "
                                    :placeholder="$t('Detail.index.737432-16')"
                                />
                            </j-form-item>
                            <j-form-item
                                :label="$t('Detail.index.737432-17')"
                                v-bind="validateInfos['configuration.password']"
                            >
                                <j-input
                                    v-model:value="
                                        formData.configuration.password
                                    "
                                    :placeholder="$t('Detail.index.737432-18')"
                                />
                            </j-form-item>
                        </template>
                        <!-- 语音/短信 -->
                        <template
                            v-if="
                                formData.type === 'voice' ||
                                formData.type === 'sms'
                            "
                        >
                            <j-form-item
                                label="RegionId"
                                v-bind="validateInfos['configuration.regionId']"
                            >
                                <j-select
                                    v-model:value="
                                        formData.configuration.regionId
                                    "
                                    :placeholder="$t('Detail.index.737432-19')"
                                >
                                    <j-select-option
                                        v-for="(item, index) in regionList"
                                        :key="index"
                                        :value="item.value"
                                    >
                                        {{ item.label }}
                                    </j-select-option>
                                </j-select>
                            </j-form-item>
                            <j-form-item
                                label="AccessKeyId"
                                v-bind="
                                    validateInfos['configuration.accessKeyId']
                                "
                            >
                                <j-input
                                    v-model:value="
                                        formData.configuration.accessKeyId
                                    "
                                    :placeholder="$t('Detail.index.737432-20')"
                                />
                            </j-form-item>
                            <j-form-item
                                label="Secret"
                                v-bind="validateInfos['configuration.secret']"
                            >
                                <j-input
                                    v-model:value="
                                        formData.configuration.secret
                                    "
                                    :placeholder="$t('Detail.index.737432-21')"
                                />
                            </j-form-item>
                        </template>
                        <!-- webhook -->
                        <template v-if="formData.type === 'webhook'">
                            <j-form-item
                                label="WebHook"
                                v-bind="validateInfos['configuration.url']"
                            >
                                <j-input
                                    v-model:value="formData.configuration.url"
                                    :placeholder="$t('Detail.index.737432-8')"
                                />
                            </j-form-item>
                            <j-form-item :label="$t('Detail.index.737432-22')">
                                <EditTable
                                    ref="editTable"
                                    :headers="
                                        formData.configuration.headers
                                    "
                                />
                            </j-form-item>
                        </template>
                        <j-form-item :label="$t('Detail.index.737432-23')">
                            <j-textarea
                                v-model:value="formData.description"
                                show-count
                                :maxlength="200"
                                :rows="5"
                                :placeholder="$t('Detail.index.737432-24')"
                            />
                        </j-form-item>
                        <j-form-item>
                            <j-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="btnLoading"
                            >
                                {{ $t('Detail.index.737432-25') }}
                            </j-button>
                        </j-form-item>
                    </j-form>
                </j-col>
                <j-col :span="12" :push="2">
                    <Doc :docData="formData" />
                </j-col>
            </j-row>
        </j-card>
    </page-container>
</template>

<script setup lang="ts">
import { getImage, onlyMessage } from '@/utils/comm';
import { Form } from 'jetlinks-ui-components';
import type { ConfigFormData } from '../types';
import {
    NOTICE_METHOD,
    CONFIG_FIELD_MAP,
    MSG_TYPE,
} from '@/views/notice/const';
import regionList from './regionId';
import EditTable from './components/EditTable.vue';
import configApi from '@/api/notice/config';
import Doc from './doc/index';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const router = useRouter();
const route = useRoute();
const useForm = Form.useForm;
const flag = ref<boolean>(false)
const editTable = ref();

// 消息类型
const msgType = ref([
    {
        label: $t('Detail.index.737432-26'),
        value: 'dingTalkMessage',
        logo: getImage('/notice/dingtalk.png'),
    },
    {
        label: $t('Detail.index.737432-27'),
        value: 'dingTalkRobotWebHook',
        logo: getImage('/notice/dingTalk-rebot.png'),
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
    type: [{ required: true, message: $t('Detail.index.737432-1') }],
    name: [
        { required: true, message: $t('Detail.index.737432-3') },
        { max: 64, message: $t('Detail.index.737432-7') },
    ],
    provider: [{ required: true, message: $t('Detail.index.737432-28') }],
    // 钉钉
    'configuration.appKey': [
        { required: true, message: $t('Detail.index.737432-5'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.737432-7'), trigger: 'change' },
    ],
    'configuration.appSecret': [
        { required: true, message: $t('Detail.index.737432-6'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.737432-7'), trigger: 'change' },
    ],
    // 'configuration.url': [{ required: true, message: $t('Detail.index.737432-8') }],
    // 微信
    'configuration.corpId': [
        { required: true, message: $t('Detail.index.737432-9'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.737432-7') },
    ],
    'configuration.corpSecret': [
        { required: true, message: $t('Detail.index.737432-10'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.737432-7') },
    ],
    // 阿里云语音/短信
    'configuration.regionId': [
        { required: true, message: $t('Detail.index.737432-29'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.737432-7') },
    ],
    'configuration.accessKeyId': [
        { required: true, message: $t('Detail.index.737432-20'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.737432-7') },
    ],
    'configuration.secret': [
        { required: true, message: $t('Detail.index.737432-21'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.737432-7') },
    ],
    // 邮件
    'configuration.host': [{ required: true, message: $t('Detail.index.737432-12'), trigger: 'blur' }],
    'configuration.sender': [
        { required: true, message: $t('Detail.index.737432-30'), trigger: 'blur' },
        // { max: 64, message: $t('Detail.index.737432-7') },
        {
            pattern:
                /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: $t('Detail.index.737432-31'),
        },
    ],
    'configuration.username': [
        { required: true, message: $t('Detail.index.737432-16'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.737432-7') },
    ],
    'configuration.password': [
        { required: true, message: $t('Detail.index.737432-18'), trigger: 'blur' },
        { max: 64, message: $t('Detail.index.737432-7') },
    ],
    // webhook
    'configuration.url': [
        { required: true, message: $t('Detail.index.737432-8'), trigger: 'blur' },
        // {
        //     pattern:
        //         /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[j-z]{2,6}\/?/,
        //     message: 'Webhook需要是一个合法的URL',
        // },
    ],
    description: [{ max: 200, message: $t('Detail.index.737432-32') }],
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
                onlyMessage($t('Detail.index.737432-33'));
                if (route.query?.notifyType) {
                    // @ts-ignore
                    if((window as any).onTabSaveSuccess){
                        (window as any).onTabSaveSuccess(res.result);
                        setTimeout(() => window.close(), 300);
                    }
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
                onlyMessage($t('Detail.index.737432-33'));
                if (route.query?.notifyType) {
                    // @ts-ignore
                    if((window as any).onTabSaveSuccess){
                        (window as any).onTabSaveSuccess(res.result);
                        setTimeout(() => window.close(), 300);
                    }
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
