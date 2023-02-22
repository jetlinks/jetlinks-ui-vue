<!-- 通知配置详情 -->
<template>
    <page-container>
        <a-card>
            <a-row>
                <a-col :span="10">
                    <a-form layout="vertical">
                        <a-form-item
                            label="通知方式"
                            v-bind="validateInfos.type"
                        >
                            <a-select
                                v-model:value="formData.type"
                                placeholder="请选择通知方式"
                                :disabled="!!formData.id"
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
                        <a-form-item label="名称" v-bind="validateInfos.name">
                            <a-input
                                v-model:value="formData.name"
                                placeholder="请输入名称"
                            />
                        </a-form-item>
                        <a-form-item
                            label="类型"
                            v-bind="validateInfos.provider"
                            v-if="formData.type !== 'email'"
                        >
                            <RadioCard
                                :options="msgType"
                                v-model="formData.provider"
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
                                        placeholder="请输入AppKey"
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
                                        placeholder="请输入AppSecret"
                                    />
                                </a-form-item>
                            </template>
                            <template
                                v-if="
                                    formData.provider === 'dingTalkRobotWebHook'
                                "
                            >
                                <a-form-item
                                    label="webHook"
                                    v-bind="validateInfos['configuration.url']"
                                >
                                    <a-input
                                        v-model:value="
                                            formData.configuration.url
                                        "
                                        placeholder="请输入webHook"
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
                                    placeholder="请输入corpId"
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
                                    placeholder="请输入corpSecret"
                                />
                            </a-form-item>
                        </template>
                        <!-- 邮件 -->
                        <template v-if="formData.type === 'email'">
                            <a-form-item
                                label="服务器地址"
                                v-bind="validateInfos['configuration.host']"
                            >
                                <a-space>
                                    <a-input
                                        v-model:value="
                                            formData.configuration.host
                                        "
                                        placeholder="请输入服务器地址"
                                    />
                                    <a-input-number
                                        v-model:value="
                                            formData.configuration.port
                                        "
                                    />
                                    <a-checkbox
                                        v-model:value="
                                            formData.configuration.ssl
                                        "
                                    >
                                        开启SSL
                                    </a-checkbox>
                                </a-space>
                            </a-form-item>
                            <a-form-item
                                label="发件人"
                                v-bind="validateInfos['configuration.sender']"
                            >
                                <a-input
                                    v-model:value="
                                        formData.configuration.sender
                                    "
                                    placeholder="请输入发件人"
                                />
                            </a-form-item>
                            <a-form-item
                                label="用户名"
                                v-bind="validateInfos['configuration.username']"
                            >
                                <a-input
                                    v-model:value="
                                        formData.configuration.username
                                    "
                                    placeholder="请输入用户名"
                                />
                            </a-form-item>
                            <a-form-item
                                label="密码"
                                v-bind="validateInfos['configuration.password']"
                            >
                                <a-input
                                    v-model:value="
                                        formData.configuration.password
                                    "
                                    placeholder="请输入密码"
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
                                    placeholder="请选择RegionId"
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
                                    placeholder="请输入AccessKeyId"
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
                                    placeholder="Secret"
                                />
                            </a-form-item>
                        </template>
                        <!-- webhook -->
                        <template v-if="formData.type === 'webhook'">
                            <a-form-item
                                label="Webhook"
                                v-bind="validateInfos['configuration.url']"
                            >
                                <a-input
                                    v-model:value="formData.configuration.url"
                                    placeholder="请输入Webhook"
                                />
                            </a-form-item>
                            <a-form-item label="请求头">
                                <EditTable
                                    v-model:headers="
                                        formData.configuration.headers
                                    "
                                />
                            </a-form-item>
                        </template>
                        <a-form-item label="说明">
                            <a-textarea
                                v-model:value="formData.description"
                                show-count
                                :maxlength="200"
                                :rows="5"
                                placeholder="请输入说明"
                            />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ offset: 0, span: 3 }">
                            <a-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="btnLoading"
                                style="width: 100%"
                            >
                                保存
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-col>
                <a-col :span="12" :push="2">
                    <Doc :docData="formData" />
                </a-col>
            </a-row>
        </a-card>
    </page-container>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';
import { Form } from 'ant-design-vue';
import { message } from 'ant-design-vue';
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

const router = useRouter();
const route = useRoute();
const useForm = Form.useForm;

// 消息类型
const msgType = ref([
    {
        label: '钉钉消息',
        value: 'dingTalkMessage',
        logo: getImage('/notice/dingtalk.png'),
    },
    {
        label: '群机器人消息',
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

        formData.value.provider = msgType.value[0].value;

        formData.value.configuration =
            CONFIG_FIELD_MAP[val][formData.value.provider];

        clearValid();
    },
);

watch(
    () => formData.value.provider,
    (val) => {
        formData.value.configuration =
            CONFIG_FIELD_MAP[formData.value.type][val];

        clearValid();
    },
);

// 验证规则
const formRules = ref({
    type: [{ required: true, message: '请选择通知方式' }],
    name: [
        { required: true, message: '请输入名称' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    provider: [{ required: true, message: '请选择类型' }],
    // 钉钉
    'configuration.appKey': [
        { required: true, message: '请输入AppKey' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    'configuration.appSecret': [
        { required: true, message: '请输入AppSecret' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    // 'configuration.url': [{ required: true, message: '请输入WebHook' }],
    // 微信
    'configuration.corpId': [
        { required: true, message: '请输入corpId' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    'configuration.corpSecret': [
        { required: true, message: '请输入corpSecret' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    // 阿里云语音/短信
    'configuration.regionId': [
        { required: true, message: '请输入RegionId' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    'configuration.accessKeyId': [
        { required: true, message: '请输入AccessKeyId' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    'configuration.secret': [
        { required: true, message: '请输入Secret' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    // 邮件
    'configuration.host': [{ required: true, message: '请输入服务器地址' }],
    'configuration.sender': [{ required: true, message: '请输入发件人' }],
    'configuration.username': [
        { required: true, message: '请输入用户名' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    'configuration.password': [
        { required: true, message: '请输入密码' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    // webhook
    'configuration.url': [
        { required: true, message: '请输入Webhook' },
        {
            pattern:
                /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/,
            message: 'Webhook需要是一个合法的URL',
        },
    ],
    description: [{ max: 200, message: '最多可输入200个字符' }],
});

const { resetFields, validate, validateInfos, clearValidate } = useForm(
    formData.value,
    formRules.value,
);

const clearValid = () => {
    setTimeout(() => {
        clearValidate();
    }, 200);
};

const getDetail = async () => {
    if (route.params.id === ':id') return;
    const res = await configApi.detail(route.params.id as string);
    // console.log('res: ', res);
    formData.value = res.result;
    // console.log('formData.value: ', formData.value);
};
getDetail();

/**
 * 表单提交
 */
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
    // const form = useForm(formData.value, formRules.value);
    // form.
    validate()
        .then(async () => {
            // console.log('formData.value: ', formData.value);
            btnLoading.value = true;
            let res;
            if (!formData.value.id) {
                res = await configApi.save(formData.value);
            } else {
                res = await configApi.update(formData.value);
            }
            // console.log('res: ', res);
            if (res?.success) {
                message.success('保存成功');
                router.back();
            }
        })
        .catch((err) => {
            console.log('err: ', err);
        })
        .finally(() => {
            btnLoading.value = false;
        });
};
</script>
