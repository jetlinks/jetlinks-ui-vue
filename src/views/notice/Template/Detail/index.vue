<!-- 通知模板详情 -->
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
                                @change="handleProviderChange"
                            />
                        </a-form-item>
                        <a-form-item
                            v-bind="validateInfos.configId"
                            v-if="formData.type !== 'email'"
                        >
                            <template #label>
                                <span>
                                    绑定配置
                                    <a-tooltip
                                        title="使用固定的通知配置来发送此通知模版"
                                    >
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px"
                                        />
                                    </a-tooltip>
                                </span>
                            </template>
                            <a-select
                                v-model:value="formData.configId"
                                placeholder="请选择绑定配置"
                                @change="handleConfigChange"
                            >
                                <a-select-option
                                    v-for="(item, index) in configList"
                                    :key="index"
                                    :value="item.id"
                                >
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <!-- 钉钉 -->
                        <template v-if="formData.type === 'dingTalk'">
                            <template
                                v-if="formData.provider === 'dingTalkMessage'"
                            >
                                <a-form-item
                                    v-bind="validateInfos['template.agentId']"
                                >
                                    <template #label>
                                        <span>
                                            AgentID
                                            <a-tooltip title="应用唯一标识">
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </a-tooltip>
                                        </span>
                                    </template>
                                    <a-input
                                        v-model:value="
                                            formData.template.agentId
                                        "
                                        placeholder="请输入AppSecret"
                                    />
                                </a-form-item>
                                <a-row :gutter="10">
                                    <a-col :span="12">
                                        <a-form-item label="收信部门">
                                            <ToOrg
                                                v-model:toParty="
                                                    formData.template.toParty
                                                "
                                                :type="formData.type"
                                                :config-id="formData.configId"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item>
                                            <template #label>
                                                <span>
                                                    收信人
                                                    <a-tooltip
                                                        title="如果不填写该字段，将在使用此模板发送通知时进行指定"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </a-tooltip>
                                                </span>
                                            </template>
                                            <ToUser
                                                v-model:toUser="
                                                    formData.template.toUser
                                                "
                                                :type="formData.type"
                                                :config-id="formData.configId"
                                            />
                                        </a-form-item>
                                    </a-col>
                                </a-row>
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
                                        <a-input
                                            v-model:value="
                                                formData.template.markdown.title
                                            "
                                            placeholder="请输入标题"
                                        />
                                    </a-form-item>
                                </template>
                                <template
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
                                                formData.template.link.title
                                            "
                                            placeholder="请输入标题"
                                        />
                                    </a-form-item>
                                    <a-form-item label="图片链接">
                                        <a-input
                                            v-model:value="
                                                formData.template.link.picUrl
                                            "
                                            placeholder="请输入图片链接"
                                        >
                                            <template #addonAfter>
                                                <a-upload
                                                    name="file"
                                                    :action="FILE_UPLOAD"
                                                    :headers="{
                                                        [TOKEN_KEY]:
                                                            LocalStore.get(
                                                                TOKEN_KEY,
                                                            ),
                                                    }"
                                                    :showUploadList="false"
                                                    @change="
                                                        (e) =>
                                                            handleLinkChange(e)
                                                    "
                                                >
                                                    <AIcon
                                                        type="UploadOutlined"
                                                    />
                                                </a-upload>
                                            </template>
                                        </a-input>
                                    </a-form-item>
                                    <a-form-item label="内容链接">
                                        <a-input
                                            v-model:value="
                                                formData.template.link
                                                    .messageUrl
                                            "
                                            placeholder="请输入内容链接"
                                        />
                                    </a-form-item>
                                </template>
                            </template>
                        </template>
                        <!-- 微信 -->
                        <template v-if="formData.type === 'weixin'">
                            <a-form-item
                                v-bind="validateInfos['template.agentId']"
                            >
                                <template #label>
                                    <span>
                                        AgentId
                                        <a-tooltip title="应用唯一标识">
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </span>
                                </template>
                                <a-input
                                    v-model:value="formData.template.agentId"
                                    placeholder="请输入agentId"
                                />
                            </a-form-item>
                            <a-row :gutter="10">
                                <a-col :span="12">
                                    <a-form-item>
                                        <template #label>
                                            <span>
                                                收信人
                                                <a-tooltip
                                                    title="如果不填写该字段,将在使用此模版发送通知时进行指定。"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </a-tooltip>
                                            </span>
                                        </template>
                                        <ToUser
                                            v-model:toUser="
                                                formData.template.toUser
                                            "
                                            :type="formData.type"
                                            :config-id="formData.configId"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item label="收信部门">
                                        <ToOrg
                                            v-model:toParty="
                                                formData.template.toParty
                                            "
                                            :type="formData.type"
                                            :config-id="formData.configId"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-form-item>
                                <template #label>
                                    <span>
                                        标签推送
                                        <a-tooltip
                                            title="本企业微信的标签ID列表,最多支持100个,如果不填写该字段,将在使用此模版发送通知时进行指定"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </span>
                                </template>
                                <ToTag
                                    v-model:toTag="formData.template.toTag"
                                    :type="formData.type"
                                    :config-id="formData.configId"
                                />
                            </a-form-item>
                        </template>
                        <!-- 邮件 -->
                        <template v-if="formData.type === 'email'">
                            <a-form-item
                                v-bind="validateInfos['template.subject']"
                            >
                                <template #label>
                                    <span>
                                        标题
                                        <a-tooltip title="邮件标题">
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </span>
                                </template>
                                <a-input
                                    v-model:value="formData.template.subject"
                                    placeholder="请输入标题"
                                />
                            </a-form-item>
                            <a-form-item>
                                <template #label>
                                    <span>
                                        收件人
                                        <a-tooltip
                                            title="多个收件人用换行分隔 最大支持1000个号码"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </span>
                                </template>
                                <a-select
                                    mode="tags"
                                    :options="[]"
                                    v-model:value="formData.template.sendTo"
                                    placeholder="请选择收件人"
                                />
                            </a-form-item>
                            <a-form-item>
                                <template #label>
                                    <span>
                                        附件信息
                                        <a-tooltip
                                            title="附件只输入文件名称将在发送邮件时进行文件上传"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </span>
                                </template>
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
                                v-bind="validateInfos['template.templateType']"
                            >
                                <template #label>
                                    <span>
                                        类型
                                        <a-tooltip
                                            title="语音验证码类型可配置变量，并且只支持数字和英文字母"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </span>
                                </template>
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
                                        v-bind="
                                            validateInfos[
                                                'template.templateCode'
                                            ]
                                        "
                                    >
                                        <template #label>
                                            <span>
                                                模板ID
                                                <a-tooltip
                                                    title="阿里云内部分配的唯一ID标识"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </a-tooltip>
                                            </span>
                                        </template>
                                        <a-input
                                            v-model:value="
                                                formData.template.templateCode
                                            "
                                            placeholder="请输入模板ID"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item>
                                        <template #label>
                                            <span>
                                                被叫号码
                                                <a-tooltip
                                                    title="仅支持中国大陆号码"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </a-tooltip>
                                            </span>
                                        </template>
                                        <a-input
                                            v-model:value="
                                                formData.template.calledNumber
                                            "
                                            placeholder="请输入被叫号码"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-form-item>
                                <template #label>
                                    <span>
                                        被叫显号
                                        <a-tooltip
                                            title="必须是已购买的号码,用于呼叫号码显示"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </span>
                                </template>
                                <a-input
                                    v-model:value="
                                        formData.template.calledShowNumbers
                                    "
                                    placeholder="请输入被叫显号"
                                />
                            </a-form-item>
                            <a-form-item>
                                <template #label>
                                    <span>
                                        播放次数
                                        <a-tooltip title="语音文件的播放次数">
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </span>
                                </template>
                                <a-input
                                    v-model:value="formData.template.playTimes"
                                    placeholder="请输入播放次数"
                                />
                            </a-form-item>
                            <a-form-item
                                v-if="formData.template.templateType === 'tts'"
                            >
                                <template #label>
                                    <span>
                                        模版内容
                                        <a-tooltip
                                            title="语音验证码内容输入框，用于渲染验语音证码变量。"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </span>
                                </template>
                                <a-textarea
                                    v-model:value="formData.template.message"
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
                                        v-bind="validateInfos['template.code']"
                                    >
                                        <template #label>
                                            <span>
                                                模板
                                                <a-tooltip
                                                    title="阿里云短信平台自定义的模版名称"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </a-tooltip>
                                            </span>
                                        </template>
                                        <a-select
                                            v-model:value="
                                                formData.template.code
                                            "
                                            placeholder="请选择模板"
                                            @change="handleTemplateChange"
                                        >
                                            <a-select-option
                                                v-for="(
                                                    item, index
                                                ) in templateList"
                                                :key="index"
                                                :value="item.templateCode"
                                            >
                                                {{ item.templateName }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item>
                                        <template #label>
                                            <span>
                                                收信人
                                                <a-tooltip
                                                    title="仅支持中国大陆号码"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </a-tooltip>
                                            </span>
                                        </template>
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
                                v-bind="validateInfos['template.signName']"
                            >
                                <template #label>
                                    <span>
                                        签名
                                        <a-tooltip
                                            title="用于短信内容签名信息显示"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </a-tooltip>
                                    </span>
                                </template>
                                <a-select
                                    v-model:value="formData.template.signName"
                                    placeholder="请选择签名"
                                >
                                    <a-select-option
                                        v-for="(item, index) in signsList"
                                        :key="index"
                                        :value="item.signName"
                                    >
                                        {{ item.signName }}
                                    </a-select-option>
                                </a-select>
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
                        <a-form-item
                            v-if="
                                formData.type !== 'webhook' &&
                                formData.type !== 'voice'
                            "
                            v-bind="validateInfos['template.message']"
                        >
                            <template #label>
                                <span>
                                    模版内容
                                    <a-tooltip title="发送的内容，支持录入变量">
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px"
                                        />
                                    </a-tooltip>
                                </span>
                            </template>
                            <a-textarea
                                v-model:value="formData.template.message"
                                :maxlength="200"
                                :rows="5"
                                :disabled="formData.type === 'sms'"
                                placeholder="变量格式:${name};
    示例:尊敬的${name},${time}有设备触发告警,请注意处理"
                            />
                        </a-form-item>
                        <a-form-item
                            label="变量列表"
                            v-if="
                                formData.variableDefinitions &&
                                formData.variableDefinitions.length
                            "
                        >
                            <VariableDefinitions
                                v-model:variableDefinitions="
                                    formData.variableDefinitions
                                "
                            />
                        </a-form-item>
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
import { Form, UploadChangeParam } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import type { IVariableDefinitions, TemplateFormData } from '../types';
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
import Attachments from './components/Attachments.vue';
import VariableDefinitions from './components/VariableDefinitions.vue';
import ToUser from './components/ToUser.vue';
import ToOrg from './components/ToOrg.vue';
import ToTag from './components/ToTag.vue';

import { FILE_UPLOAD } from '@/api/comm';
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';

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
    template: {
        subject: '',
        sendTo: [],
        attachments: [],
        message: '',
        text: '',
    },
    name: '',
    type: 'email',
    provider: 'embedded',
    description: '',
    variableDefinitions: [],
    configId: '',
});

/**
 * 重置公用字段值
 */
const resetPublicFiles = () => {
    formData.value.template.message = '';
    formData.value.configId = undefined;

    if (
        formData.value.type === 'dingTalk' ||
        formData.value.type === 'weixin'
    ) {
        formData.value.template.toTag = undefined;
        formData.value.template.toUser = undefined;
        formData.value.template.agentId = undefined;
    }
    if (formData.value.type === 'weixin')
        formData.value.template.toParty = undefined;
    if (formData.value.type === 'email')
        formData.value.template.toParty = undefined;
    // formData.value.description = '';
};

// 根据通知方式展示对应的字段
watch(
    () => formData.value.type,
    (val) => {
        msgType.value = MSG_TYPE[val];
        formData.value.provider =
            route.params.id !== ':id'
                ? formData.value.provider
                : msgType.value[0].value;
        // formData.value.provider = formData.value.provider || msgType.value[0].value;
        // console.log('formData.value.template: ', formData.value.template);

        // formData.value.template =
        //     TEMPLATE_FIELD_MAP[val][formData.value.provider];

        if (val !== 'email') getConfigList();
        // clearValid();
        // console.log('formData.value: ', formData.value);

        if (val === 'sms') {
            getTemplateList();
            getSignsList();
        }
    },
);

// watch(
//     () => formData.value.provider,
//     (val) => {
//         formData.value.template = TEMPLATE_FIELD_MAP[formData.value.type][val];

//         clearValid();
//     },
// );

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
    'template.message': [{ required: true, message: '请输入' }],
});

const { resetFields, validate, validateInfos, clearValidate } = useForm(
    formData.value,
    formRules.value,
);

watch(
    () => formData.value.template.message,
    (val) => {
        if (!val) return;
        // 已经存在的变量
        const oldKey = formData.value.variableDefinitions?.map((m) => m.id);
        // 正则提取${}里面的值
        const pattern = /(?<=\$\{).*?(?=\})/g;
        const titleList = val.match(pattern)?.filter((f) => f);
        const newKey = [...new Set(titleList)];
        const result = newKey?.map((m) =>
            oldKey.includes(m)
                ? formData.value.variableDefinitions.find(
                      (item) => item.id === m,
                  )
                : {
                      id: m,
                      name: '',
                      type: 'string',
                      format: '%s',
                  },
        );
        formData.value.variableDefinitions = result as IVariableDefinitions[];
    },
    { deep: true },
);

// const clearValid = () => {
//     setTimeout(() => {
//         formData.value.variableDefinitions = [];
//         clearValidate();
//     }, 200);
// };

/**
 * 获取详情
 */
const getDetail = async () => {
    if (route.params.id !== ':id') {
        const res = await templateApi.detail(route.params.id as string);
        // formData.value = res.result;
        Object.assign(formData.value, res.result);
        // console.log('formData.value: ', formData.value);
    }
};
getDetail();

/**
 * 获取绑定配置
 */
const configList = ref();
const getConfigList = async () => {
    const terms = [
        { column: 'type$IN', value: formData.value.type },
        { column: 'provider', value: formData.value.provider },
    ];
    const { result } = await templateApi.getConfig({ terms });
    configList.value = result;
};

/**
 * 通知方式改变
 */
const handleTypeChange = () => {
    setTimeout(() => {
        formData.value.template =
            TEMPLATE_FIELD_MAP[formData.value.type][formData.value.provider];
        resetPublicFiles();
    }, 0);
};

/**
 * 通知类型改变
 */
const handleProviderChange = () => {
    formData.value.template =
        TEMPLATE_FIELD_MAP[formData.value.type][formData.value.provider];
    console.log('formData.value.template: ', formData.value.template);
    getConfigList();
    resetPublicFiles();
};

/**
 * link消息类型 图片链接
 */
const handleLinkChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
        formData.value.template.link.picUrl = info.file.response?.result;
    }
};

/**
 * 配置选择改变
 */
const handleConfigChange = () => {
    getTemplateList();
    getSignsList();
};

/**
 * 获取阿里模板
 */
const templateList = ref();
const getTemplateList = async () => {
    const id = formData.value.configId || undefined;
    const { result } = await templateApi.getAliTemplate(id);
    templateList.value = result;
};

/**
 * 短信模板改变
 */
const handleTemplateChange = () => {
    formData.value.template.message = templateList.value.find(
        (f: any) => formData.value.template.code === f.templateCode,
    )?.templateContent;
};

/**
 * 获取签名
 */
const signsList = ref();
const getSignsList = async () => {
    const id = formData.value.configId || undefined;
    const { result } = await templateApi.getSigns(id);
    signsList.value = result;
};

/**
 * 表单提交
 */
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
    if (formData.value.type === 'email') delete formData.value.configId;
    if (formData.value.template.messageType === 'markdown')
        delete formData.value.template.link;
    if (formData.value.template.messageType === 'link')
        delete formData.value.template.markdown;
    // console.log('formData.value: ', formData.value);
    validate()
        .then(async () => {
            formData.value.template.ttsCode =
                formData.value.template.templateCode;
            btnLoading.value = true;
            let res;
            if (!formData.value.id) {
                res = await templateApi.save(formData.value);
            } else {
                res = await templateApi.update(formData.value);
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

// test
// watch(
//     () => formData.value,
//     (val) => {
//         console.log('formData.value: ', val);
//     },
//     { deep: true },
// );
// test
</script>
