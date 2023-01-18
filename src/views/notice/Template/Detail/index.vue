<!-- 通知模板详情 -->
<template>
    <div class="page-container">
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
                            v-if="
                                formData.type !== 'email' &&
                                formData.type !== 'webhook'
                            "
                        >
                            <RadioCard
                                :options="msgType"
                                v-model="formData.provider"
                            />
                        </a-form-item>
                        <a-form-item
                            label="绑定配置"
                            v-bind="validateInfos.configId"
                            v-if="formData.type !== 'email'"
                        >
                            <a-select
                                v-model:value="formData.configId"
                                placeholder="请选择绑定配置"
                            >
                                <a-select-option
                                    v-for="(item, index) in ROBOT_MSG_TYPE"
                                    :key="index"
                                    :value="item.value"
                                >
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <!-- 钉钉 -->
                        <template v-if="formData.type === 'dingTalk'">
                            <template
                                v-if="formData.provider === 'dingTalkMessage'"
                            >
                                <a-form-item
                                    label="AgentId"
                                    v-bind="validateInfos['template.agentId']"
                                >
                                    <a-input
                                        v-model:value="
                                            formData.template.agentId
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
                                    label="消息类型"
                                    v-bind="
                                        validateInfos['template.messageType']
                                    "
                                >
                                    <a-select
                                        v-model:value="
                                            formData.template.messageType
                                        "
                                        placeholder="请选择消息类型"
                                    >
                                        <a-select-option
                                            v-for="(
                                                item, index
                                            ) in ROBOT_MSG_TYPE"
                                            :key="index"
                                            :value="item.value"
                                        >
                                            {{ item.label }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <template
                                    v-if="
                                        formData.template.messageType ===
                                        'markdown'
                                    "
                                >
                                    <a-form-item
                                        label="标题"
                                        v-bind="
                                            validateInfos[
                                                'template.markdown.title'
                                            ]
                                        "
                                    >
                                        <!-- <a-input
                                            v-model:value="
                                                formData.template.markdown
                                                    ?.title
                                            "
                                            placeholder="请输入标题"
                                        /> -->
                                    </a-form-item>
                                </template>
                                <!-- <template
                                    v-if="
                                        formData.template.messageType === 'link'
                                    "
                                >
                                    <a-form-item
                                        label="标题"
                                        v-bind="
                                            validateInfos['template.link.title']
                                        "
                                    >
                                        <a-input
                                            v-model:value="
                                                formData.template.link?.title
                                            "
                                            placeholder="请输入标题"
                                        />
                                    </a-form-item>
                                    <a-form-item label="图片链接">
                                        <a-input
                                            v-model:value="
                                                formData.template.link?.picUrl
                                            "
                                            placeholder="请输入图片链接"
                                        />
                                    </a-form-item>
                                    <a-form-item label="内容链接">
                                        <a-input
                                            v-model:value="
                                                formData.template.link
                                                    ?.messageUrl
                                            "
                                            placeholder="请输入内容链接"
                                        />
                                    </a-form-item>
                                </template> -->
                            </template>
                        </template>
                        <!-- 微信 -->
                        <template v-if="formData.type === 'weixin'">
                            <a-form-item
                                label="AgentId"
                                v-bind="validateInfos['template.agentId']"
                            >
                                <a-input
                                    v-model:value="formData.template.agentId"
                                    placeholder="请输入agentId"
                                />
                            </a-form-item>
                            <a-row :gutter="10">
                                <a-col :span="12">
                                    <a-form-item label="收信人">
                                        <a-select
                                            v-model:value="
                                                formData.template.toUser
                                            "
                                            placeholder="请选择收信人"
                                        >
                                            <a-select-option
                                                v-for="(
                                                    item, index
                                                ) in ROBOT_MSG_TYPE"
                                                :key="index"
                                                :value="item.value"
                                            >
                                                {{ item.label }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item label="收信部门">
                                        <a-select
                                            v-model:value="
                                                formData.template.toParty
                                            "
                                            placeholder="请选择收信部门"
                                        >
                                            <a-select-option
                                                v-for="(
                                                    item, index
                                                ) in ROBOT_MSG_TYPE"
                                                :key="index"
                                                :value="item.value"
                                            >
                                                {{ item.label }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-form-item label="标签推送">
                                <a-select
                                    v-model:value="formData.template.toTag"
                                    placeholder="请选择标签推送"
                                >
                                    <a-select-option
                                        v-for="(item, index) in ROBOT_MSG_TYPE"
                                        :key="index"
                                        :value="item.value"
                                    >
                                        {{ item.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </template>
                        <!-- 邮件 -->
                        <template v-if="formData.type === 'email'">
                            <a-form-item
                                label="标题"
                                v-bind="validateInfos['template.subject']"
                            >
                                <a-input
                                    v-model:value="formData.template.subject"
                                    placeholder="请输入标题"
                                />
                            </a-form-item>
                            <a-form-item label="收件人">
                                <a-select
                                    v-model:value="formData.template.sendTo"
                                    placeholder="请选择收件人"
                                >
                                    <a-select-option
                                        v-for="(item, index) in ROBOT_MSG_TYPE"
                                        :key="index"
                                        :value="item.value"
                                    >
                                        {{ item.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item label="附件信息">
                                <Attachments
                                    v-model:attachments="
                                        formData.template.attachments
                                    "
                                />
                            </a-form-item>
                        </template>
                        <!-- 语音 -->
                        <template v-if="formData.type === 'voice'">
                            <a-form-item
                                label="类型"
                                v-bind="validateInfos['template.templateType']"
                            >
                                <a-select
                                    v-model:value="
                                        formData.template.templateType
                                    "
                                    placeholder="请选择类型"
                                >
                                    <a-select-option
                                        v-for="(item, index) in VOICE_TYPE"
                                        :key="index"
                                        :value="item.value"
                                    >
                                        {{ item.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-row :gutter="10">
                                <a-col :span="12">
                                    <a-form-item
                                        label="模板ID"
                                        v-bind="
                                            validateInfos[
                                                'template.templateCode'
                                            ]
                                        "
                                    >
                                        <a-input
                                            v-model:value="
                                                formData.template.templateCode
                                            "
                                            placeholder="请输入模板ID"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item label="被叫号码">
                                        <a-input
                                            v-model:value="
                                                formData.template.calledNumber
                                            "
                                            placeholder="请输入被叫号码"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-form-item label="被叫显号">
                                <a-input
                                    v-model:value="
                                        formData.template.calledShowNumbers
                                    "
                                    placeholder="请输入被叫显号"
                                />
                            </a-form-item>
                            <a-form-item label="播放次数">
                                <a-input
                                    v-model:value="formData.template.playTimes"
                                    placeholder="请输入播放次数"
                                />
                            </a-form-item>
                            <a-form-item
                                label="模板内容"
                                v-if="formData.template.templateType === 'tts'"
                            >
                                <a-textarea
                                    v-model:value="formData.template.ttsCode"
                                    show-count
                                    :rows="5"
                                    placeholder="内容中的变量将用于阿里云语音验证码"
                                />
                            </a-form-item>
                        </template>
                        <!-- 短信 -->
                        <template v-if="formData.type === 'sms'">
                            <a-row :gutter="10">
                                <a-col :span="12">
                                    <a-form-item
                                        label="模板"
                                        v-bind="validateInfos['template.code']"
                                    >
                                        <a-select
                                            v-model:value="
                                                formData.template.code
                                            "
                                            placeholder="请选择模板"
                                        >
                                            <a-select-option
                                                v-for="(
                                                    item, index
                                                ) in ROBOT_MSG_TYPE"
                                                :key="index"
                                                :value="item.value"
                                            >
                                                {{ item.label }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item label="收信人">
                                        <a-input
                                            v-model:value="
                                                formData.template.phoneNumber
                                            "
                                            placeholder="请输入收信人"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-form-item
                                label="签名"
                                v-bind="validateInfos['template.signName']"
                            >
                                <a-input
                                    v-model:value="formData.template.signName"
                                    placeholder="请输入签名"
                                />
                            </a-form-item>
                        </template>
                        <!-- webhook -->
                        <template v-if="formData.type === 'webhook'">
                            <a-form-item label="请求体">
                                <a-radio-group
                                    v-model:value="
                                        formData.template.contextAsBody
                                    "
                                    style="margin-bottom: 20px"
                                >
                                    <a-radio :value="true">默认</a-radio>
                                    <a-radio :value="false">自定义</a-radio>
                                </a-radio-group>
                                <a-textarea
                                    v-model:value="formData.template.body"
                                    placeholder="请求体中的数据来自于发送通知时指定的所有变量"
                                    v-if="formData.template.contextAsBody"
                                    disabled
                                    :rows="5"
                                />
                                <div v-else style="height: 400px">
                                    <MonacoEditor
                                        theme="vs"
                                        v-model:modelValue="
                                            formData.template.body
                                        "
                                    />
                                </div>
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
    </div>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';
import { Form } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { TemplateFormData } from '../types';
import {
    NOTICE_METHOD,
    TEMPLATE_FIELD_MAP,
    MSG_TYPE,
    ROBOT_MSG_TYPE,
    VOICE_TYPE,
} from '@/views/notice/const';
import templateApi from '@/api/notice/template';
import Doc from './doc/index';
import MonacoEditor from '@/components/MonacoEditor/index.vue';
import Attachments from './components/Attachments.vue'

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
const formData = ref<TemplateFormData>({
    template: {},
    name: '',
    type: 'email',
    provider: 'embedded',
    description: '',
    variableDefinitions: [],
});

// 根据通知方式展示对应的字段
watch(
    () => formData.value.type,
    (val) => {
        // formData.value.template = TEMPLATE_FIELD_MAP[val];
        msgType.value = MSG_TYPE[val];

        formData.value.provider = msgType.value[0].value;
        console.log('formData.value.template: ', formData.value.template);
    },
);

computed(() => {
    console.log('formData.value.type: ', formData.value.type);
    Object.assign(
        formData.value.template,
        TEMPLATE_FIELD_MAP[formData.value.type][formData.value.provider],
    );
});

// 验证规则
const formRules = ref({
    type: [{ required: true, message: '请选择通知方式' }],
    name: [
        { required: true, message: '请输入名称' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    provider: [{ required: true, message: '请选择类型' }],
    configId: [{ required: true, message: '请选择绑定配置' }],
    // 钉钉
    'template.agentId': [{ required: true, message: '请输入agentId' }],
    'template.messageType': [{ required: true, message: '请选择消息类型' }],
    'template.markdown.title': [{ required: true, message: '请输入标题' }],
    // 'template.url': [{ required: true, message: '请输入WebHook' }],
    // 微信
    // 'template.agentId': [{ required: true, message: '请输入agentId' }],
    // 邮件
    'template.subject': [{ required: true, message: '请输入标题' }],
    // 阿里云语音
    'template.templateType': [{ required: true, message: '请选择类型' }],
    'template.templateCode': [{ required: true, message: '请输入模板ID' }],
    // 短信
    'template.code': [{ required: true, message: '请选择模板' }],
    'template.signName': [{ required: true, message: '请输入签名' }],
    // webhook
    description: [{ max: 200, message: '最多可输入200个字符' }],
});

const { resetFields, validate, validateInfos, clearValidate } = useForm(
    formData.value,
    formRules.value,
);
watch(
    () => formData.value.type,
    () => {
        clearValidate();
    },
    { deep: true },
);

const getDetail = async () => {
    const res = await templateApi.detail(route.params.id as string);
    // console.log('res: ', res);
    formData.value = res.result;
    // console.log('formData.value: ', formData.value);
};
// getDetail();

/**
 * 表单提交
 */
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
    validate()
        .then(async () => {
            console.log('formData.value: ', formData.value);
            btnLoading.value = true;
            // let res;
            // if (!formData.value.id) {
            //     res = await templateApi.save(formData.value);
            // } else {
            //     res = await templateApi.update(formData.value);
            // }
            // // console.log('res: ', res);
            // if (res?.success) {
            //     message.success('保存成功');
            //     router.back();
            // }
            btnLoading.value = false;
        })
        .catch((err) => {
            console.log('err: ', err);
        });
};
</script>

<style lang="less" scoped>
.page-container {
    background: #f0f2f5;
    padding: 24px;
}
</style>
