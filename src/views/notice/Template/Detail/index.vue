<!-- 通知模板详情 -->
<template>
    <page-container>
        <j-card>
            <j-row>
                <j-col :span="10">
                    <j-form layout="vertical" :rules='formRules' ref='formRef' :model='formData'>
                        <j-form-item
                            label="通知方式"
                            name='type'
                        >
                            <j-select
                                v-model:value="formData.type"
                                placeholder="请选择通知方式"
                                :disabled="!!formData.id"
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
                        <j-form-item label="名称" name='name'>
                            <j-input
                                v-model:value="formData.name"
                                placeholder="请输入名称"
                            />
                        </j-form-item>
                        <j-form-item
                            label="类型"
                            name='provider'
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
                        </j-form-item>
                        <j-form-item
                            name='configId'
                            v-if="formData.type !== 'email'"
                        >
                            <template #label>
                                <span>
                                    绑定配置
                                    <j-tooltip
                                        title="使用固定的通知配置来发送此通知模板"
                                    >
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px"
                                        />
                                    </j-tooltip>
                                </span>
                            </template>
                            <j-select
                                v-model:value="formData.configId"
                                placeholder="请选择绑定配置"
                                @change="handleConfigChange"
                            >
                                <j-select-option
                                    v-for="(item, index) in configList"
                                    :key="index"
                                    :value="item.id"
                                >
                                    {{ item.name }}
                                </j-select-option>
                            </j-select>
                        </j-form-item>
                        <!-- 钉钉 -->
                        <template v-if="formData.type === 'dingTalk'">
                            <template
                                v-if="formData.provider === 'dingTalkMessage'"
                            >
                                <j-form-item
                                    :name='["template", "agentId"]'
                                >
                                    <template #label>
                                        <span>
                                            AgentId
                                            <j-tooltip title="应用唯一标识">
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-input
                                        v-model:value="
                                            formData.template.agentId
                                        "
                                        placeholder="请输入AgentId"
                                    />
                                </j-form-item>
                                <j-row :gutter="10">
                                    <j-col :span="12">
                                        <j-form-item label="收信部门">
                                            <ToOrg
                                                v-model:toParty="
                                                    formData.template
                                                        .departmentIdList
                                                "
                                                :type="formData.type"
                                                :config-id="formData.configId"
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="12">
                                        <j-form-item>
                                            <template #label>
                                                <span>
                                                    收信人
                                                    <j-tooltip
                                                        title="如果不填写该字段，将在使用此模板发送通知时进行指定"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <ToUser
                                                v-model:toUser="
                                                    formData.template.userIdList
                                                "
                                                :type="formData.type"
                                                :config-id="formData.configId"
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                            </template>
                            <template
                                v-if="
                                    formData.provider === 'dingTalkRobotWebHook'
                                "
                            >
                                <j-form-item
                                    label="消息类型"
                                    :name='["template", "messageType"]'
                                >
                                    <j-select
                                        v-model:value="
                                            formData.template.messageType
                                        "
                                        placeholder="请选择消息类型"
                                        @change="handleMessageTypeChange"
                                    >
                                        <j-select-option
                                            v-for="(
                                                item, index
                                            ) in ROBOT_MSG_TYPE"
                                            :key="index"
                                            :value="item.value"
                                        >
                                            {{ item.label }}
                                        </j-select-option>
                                    </j-select>
                                </j-form-item>
                                <template
                                    v-if="
                                        formData.template.messageType ===
                                        'markdown'
                                    "
                                >
                                    <j-form-item
                                        label="标题"
                                        :name='["template", "markdown", "title"]'
                                    >
                                        <j-input
                                            v-model:value="
                                                formData.template.markdown.title
                                            "
                                            placeholder="请输入标题"
                                        />
                                    </j-form-item>
                                </template>
                                <template
                                    v-if="
                                        formData.template.messageType === 'link'
                                    "
                                >
                                    <j-form-item
                                        label="标题"
                                        :name='["template", "link", "title"]'
                                    >
                                        <j-input
                                            v-model:value="
                                                formData.template.link.title
                                            "
                                            placeholder="请输入标题"
                                        />
                                    </j-form-item>
                                    <j-form-item label="图片链接">
                                        <j-input
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
                                        </j-input>
                                    </j-form-item>
                                    <j-form-item label="内容链接">
                                        <j-input
                                            v-model:value="
                                                formData.template.link
                                                    .messageUrl
                                            "
                                            placeholder="请输入内容链接"
                                        />
                                    </j-form-item>
                                </template>
                            </template>
                        </template>
                        <!-- 微信 -->
                        <template v-if="formData.type === 'weixin'">
                            <j-form-item
                                :name='["template", "agentId"]'
                            >
                                <template #label>
                                    <span>
                                        AgentId
                                        <j-tooltip title="应用唯一标识">
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-input
                                    v-model:value="formData.template.agentId"
                                    placeholder="请输入AgentId"
                                />
                            </j-form-item>
                            <j-row :gutter="10">
                                <j-col :span="12">
                                    <j-form-item>
                                        <template #label>
                                            <span>
                                                收信人
                                                <j-tooltip
                                                    title="如果不填写该字段,将在使用此模板发送通知时进行指定。"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </span>
                                        </template>
                                        <ToUser
                                            v-model:toUser="
                                                formData.template.toUser
                                            "
                                            :type="formData.type"
                                            :config-id="formData.configId"
                                        />
                                    </j-form-item>
                                </j-col>
                                <j-col :span="12">
                                    <j-form-item label="收信部门">
                                        <ToOrg
                                            v-model:toParty="
                                                formData.template.toParty
                                            "
                                            :type="formData.type"
                                            :config-id="formData.configId"
                                        />
                                    </j-form-item>
                                </j-col>
                            </j-row>
                            <j-form-item>
                                <template #label>
                                    <span>
                                        标签推送
                                        <j-tooltip
                                            title="本企业微信的标签ID列表,最多支持100个,如果不填写该字段,将在使用此模板发送通知时进行指定"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <ToTag
                                    v-model:toTag="formData.template.toTag"
                                    :type="formData.type"
                                    :config-id="formData.configId"
                                />
                            </j-form-item>
                        </template>
                        <!-- 邮件 -->
                        <template v-if="formData.type === 'email'">
                            <j-form-item
                                :name='["template", "subject"]'
                            >
                                <template #label>
                                    <span>
                                        标题
                                        <j-tooltip title="邮件标题">
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-input
                                    v-model:value="formData.template.subject"
                                    placeholder="请输入标题"
                                />
                            </j-form-item>
                            <j-form-item
                                :name='["template", "sendTo"]'
                            >
                                <template #label>
                                    <span>
                                        收件人
                                        <j-tooltip
                                            title="多个收件人用换行分隔 最大支持1000个号码"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-select
                                    mode="tags"
                                    v-model:value="formData.template.sendTo"
                                    placeholder="请输入收件人邮箱,多个收件人用换行分隔"
                                />
                            </j-form-item>
                            <j-form-item>
                                <template #label>
                                    <span>
                                        附件信息
                                        <j-tooltip
                                            title="附件只输入文件名称将在发送邮件时进行文件上传"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <Attachments
                                    v-model:attachments="
                                        formData.template.attachments
                                    "
                                />
                            </j-form-item>
                        </template>
                        <!-- 语音 -->
                        <template v-if="formData.type === 'voice'">
                            <j-form-item
                                :name='["template", "templateType"]'
                            >
                                <template #label>
                                    <span>
                                        类型
                                        <j-tooltip
                                            title="语音验证码类型可配置变量，并且只支持数字和英文字母"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-select
                                    v-model:value="
                                        formData.template.templateType
                                    "
                                    placeholder="请选择类型"
                                >
                                    <j-select-option
                                        v-for="(item, index) in VOICE_TYPE"
                                        :key="index"
                                        :value="item.value"
                                    >
                                        {{ item.label }}
                                    </j-select-option>
                                </j-select>
                            </j-form-item>
                            <j-row :gutter="10">
                                <j-col :span="12">
                                    <j-form-item
                                       :name='["template", "templateCode"]'
                                    >
                                        <template #label>
                                            <span>
                                                模板ID
                                                <j-tooltip
                                                    title="阿里云内部分配的唯一ID标识"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </span>
                                        </template>
                                        <j-input
                                            v-model:value="
                                                formData.template.templateCode
                                            "
                                            placeholder="请输入模板ID"
                                        />
                                    </j-form-item>
                                </j-col>
                                <j-col :span="12">
                                    <j-form-item
                                        :name='["template", "calledNumber"]'
                                    >
                                        <template #label>
                                            <span>
                                                被叫号码
                                                <j-tooltip
                                                    title="仅支持中国大陆号码"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </span>
                                        </template>
                                        <j-input
                                            v-model:value="
                                                formData.template.calledNumber
                                            "
                                            placeholder="请输入被叫号码"
                                        />
                                    </j-form-item>
                                </j-col>
                            </j-row>
                            <j-form-item
                                :name='["template", "calledShowNumbers"]'
                            >
                                <template #label>
                                    <span>
                                        被叫显号
                                        <j-tooltip
                                            title="必须是已购买的号码,用于呼叫号码显示"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-input
                                    v-model:value="
                                        formData.template.calledShowNumbers
                                    "
                                    placeholder="请输入被叫显号"
                                />
                            </j-form-item>
                            <j-form-item
                                :name='["template", "playTimes"]'
                            >
                                <template #label>
                                    <span>
                                        播放次数
                                        <j-tooltip title="语音文件的播放次数">
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-input-number
                                    v-model:value="formData.template.playTimes"
                                    placeholder="请输入播放次数"
                                    style="width: 100%"
                                />
                            </j-form-item>
                            <j-form-item
                                v-if="formData.template.templateType === 'tts'"
                                :name='["template", "ttsmessage"]'
                            >
                                <template #label>
                                    <span>
                                        模板内容
                                        <j-tooltip
                                            title="语音验证码内容输入框，用于渲染验语音证码变量。"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-textarea
                                    v-model:value="formData.template.ttsmessage"
                                    :rows="5"
                                    placeholder="内容中的变量将用于阿里云语音验证码"
                                />
                            </j-form-item>
                        </template>
                        <!-- 短信 -->
                        <template v-if="formData.type === 'sms'">
                            <j-row :gutter="10">
                                <j-col :span="12">
                                    <j-form-item
                                        :name='["template", "code"]'
                                    >
                                        <template #label>
                                            <span>
                                                模板
                                                <j-tooltip
                                                    title="阿里云短信平台自定义的模板名称"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </span>
                                        </template>
                                        <j-select
                                            v-model:value="
                                                formData.template.code
                                            "
                                            placeholder="请选择模板"
                                            @change="handleTemplateChange"
                                        >
                                            <j-select-option
                                                v-for="(
                                                    item, index
                                                ) in templateList"
                                                :key="index"
                                                :value="item.templateCode"
                                            >
                                                {{ item.templateName }}
                                            </j-select-option>
                                        </j-select>
                                    </j-form-item>
                                </j-col>
                                <j-col :span="12">
                                    <j-form-item
                                        :name='["template", "phoneNumber"]'
                                    >
                                        <template #label>
                                            <span>
                                                收信人
                                                <j-tooltip
                                                    title="仅支持中国大陆号码"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </span>
                                        </template>
                                        <j-input
                                            v-model:value="
                                                formData.template.phoneNumber
                                            "
                                            placeholder="请输入收信人"
                                        />
                                    </j-form-item>
                                </j-col>
                            </j-row>
                            <j-form-item
                                :name='["template", "signName"]'
                            >
                                <template #label>
                                    <span>
                                        签名
                                        <j-tooltip
                                            title="用于短信内容签名信息显示"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-select
                                    v-model:value="formData.template.signName"
                                    placeholder="请选择签名"
                                >
                                    <j-select-option
                                        v-for="(item, index) in signsList"
                                        :key="index"
                                        :value="item.signName"
                                    >
                                        {{ item.signName }}
                                    </j-select-option>
                                </j-select>
                            </j-form-item>
                        </template>
                        <!-- webhook -->
                        <template v-if="formData.type === 'webhook'">
                            <j-form-item label="请求体">
                                <j-radio-group
                                    v-model:value="
                                        formData.template.contextAsBody
                                    "
                                    style="margin-bottom: 20px"
                                >
                                    <j-radio :value="true">默认</j-radio>
                                    <j-radio :value="false">自定义</j-radio>
                                </j-radio-group>
                                <j-textarea
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
                            </j-form-item>
                        </template>
                        <template
                            v-if="
                                formData.type !== 'webhook' &&
                                formData.type !== 'voice'
                            "
                        >
                            <j-form-item
                                :name='["template", "message"]'
                            >
                                <template #label>
                                    <span>
                                        模板内容
                                        <j-tooltip
                                            title="发送的内容，支持录入变量"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-textarea
                                    v-model:value="formData.template.message"
                                    :rows="5"
                                    :disabled="formData.type === 'sms'"
                                    placeholder="变量格式:${name};
    示例:尊敬的${name},${time}有设备触发告警,请注意处理"
                                />
                            </j-form-item>
                        </template>
                        <j-form-item
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
                        </j-form-item>
                        <j-form-item label="说明">
                            <j-textarea
                                v-model:value="formData.description"
                                show-count
                                :maxlength="200"
                                :rows="5"
                                placeholder="请输入说明"
                            />
                        </j-form-item>
                        <j-form-item>
                            <j-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="btnLoading"
                            >
                                保存
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
import { getImage } from '@/utils/comm';
import { UploadChangeParam } from 'ant-design-vue';
import { message, Form } from 'jetlinks-ui-components';
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
import { phoneRegEx } from '@/utils/validate';
import type { Rule } from 'ant-design-vue/es/form';
import { cloneDeep } from 'lodash-es';

const router = useRouter();
const route = useRoute();
const useForm = Form.useForm;
const formRef = ref()
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
        text: ''
    },
    name: '',
    type: 'email',
    provider: 'embedded',
    description: '',
    variableDefinitions: [],
    configId: '',
});

/**
 * 重置字段值
 */
const resetPublicFiles = () => {
    formData.value.template = {};
    switch (formData.value.provider) {
        case 'dingTalkMessage':
            formData.value.template.agentId = undefined;
            formData.value.template.message = undefined;
            formData.value.template.departmentIdList = undefined;
            formData.value.template.userIdList = undefined;
            break;
        case 'dingTalkRobotWebHook':
            formData.value.template.message = undefined;
            formData.value.template.messageType = 'markdown';
            formData.value.template.markdown = {
                text: undefined,
                title: undefined,
            };
            break;
        case 'corpMessage':
            formData.value.template.agentId = undefined;
            formData.value.template.message = undefined;
            formData.value.template.toParty = undefined;
            formData.value.template.toUser = undefined;
            formData.value.template.toTag = undefined;
            break;
        case 'embedded':
            formData.value.template.subject = undefined;
            formData.value.template.message = undefined;
            formData.value.template.text = undefined;
            formData.value.template.sendTo = [];
            formData.value.template.attachments = [];
            break;
        case 'aliyun':
            formData.value.template.templateType = 'tts';
            formData.value.template.templateCode = undefined;
            formData.value.template.ttsCode = undefined;
            // formData.value.template.message = undefined;
            formData.value.template.ttsmessage = undefined;
            formData.value.template.playTimes = 1;
            formData.value.template.calledShowNumbers = undefined;
            formData.value.template.calledNumber = undefined;
            break;
        case 'aliyunSms':
            formData.value.template.code = undefined;
            formData.value.template.message = undefined;
            formData.value.template.phoneNumber = undefined;
            formData.value.template.signName = undefined;
            break;
        case 'http':
            formData.value.template.contextAsBody = true;
            formData.value.template.body = undefined;
            break;
    }

    formData.value.configId = undefined;
    formData.value.variableDefinitions = [];
    handleMessageTypeChange();
    // console.log('formData.value.template: ', formData.value.template);
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

        if (val !== 'email') getConfigList();

        if (val === 'sms') {
            getTemplateList();
            getSignsList();
        }
    },
);

// 验证规则
const formRules = {
    type: [{ required: true, message: '请选择通知方式' }],
    name: [
        { required: true, message: '请输入名称' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    provider: [{ required: true, message: '请选择类型' }],
    configId: [{ required: true, message: '请选择绑定配置' }],
    template: {
      agentId: [
        { required: true, message: '请输入AgentId' },
        { max: 64, message: '最多可输入64个字符' },
      ],
      messageType: [{ required: true, message: '请选择消息类型' }],
      markdown: {
        title: [
          { required: true, message: '请输入标题' },
          { max: 64, message: '最多可输入64个字符' },
        ]
      },
      link: {
        title: [
          { required: true, message: '请输入标题' },
          { max: 64, message: '最多可输入64个字符' },
        ]
      },
      subject: [
        { required: true, message: '请输入标题' },
        { max: 64, message: '最多可输入64个字符' },
      ],
      sendTo: [
        {
          validator(_rule: Rule, value: string[]) {
            const regEmail =
              /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            let error;
            if (value) {
              value.some((item: string) => {
                if (!regEmail.test(item)) {
                  error = item;
                  return true;
                }
                return false;
              });
            }
            if (error)
              return Promise.reject(error ? `${error}邮件格式错误` : '');
            else return Promise.resolve();
          },
        }
      ],
      templateType: [{ required: true, message: '请选择类型' }],
      templateCode: [{ required: true, message: '请输入模板ID' }],
      calledNumber: [
        { max: 64, message: '最多可输入64个字符' },
        {
          validator(_rule: Rule, value: string) {
            if (!value) return Promise.resolve();
            if (!phoneRegEx(value)) return Promise.reject('请输入有效号码');
            return Promise.resolve();
          },
        }
      ],
      calledShowNumbers: [
        { required: true, message: '请输入被叫显号' },
        { max: 64, message: '最多可输入64个字符' },
        {
          validator(_rule: Rule, value: string) {
            if (!value) return Promise.resolve();
            if (!phoneRegEx(value)) return Promise.reject('请输入有效号码');
            return Promise.resolve();
          },
        }
      ],
      playTimes: [
        {
          validator(_rule: Rule, value: number) {
            if (value < 1 || value > 3)
              return Promise.reject('仅支持1～3次');
            else return Promise.resolve();
          },
        }
      ],
      code: [{ required: true, message: '请选择模板'}],
      signName: [{ required: true, message: '请输入签名' }],
      phoneNumber: [
        { max: 64, message: '最多可输入64个字符' },
        {
          validator(_rule: Rule, value: string) {
            if (!value) return Promise.resolve();
            if (!phoneRegEx(value))
              return Promise.reject('该字段不是有效的手机号');
            return Promise.resolve();
          },
        }
      ],
      message: [
        {
          required: true,
          message: '请输入模板内容',
        },
        { max: 500, message: '最多可输入500个字符' },
      ],
      ttsmessage: [
        { max: 500, message: '最多可输入500个字符' }
      ]
    },
    description: [{ max: 200, message: '最多可输入200个字符' }],
}

// const { validate, validateInfos } = useForm(
//     formData.value,
//     formRules,
// );

// 字段提取变量
watch(
    [
        () => formData.value.template.markdown?.title,
        () => formData.value.template.link?.title,
        () => formData.value.template.subject,
        () => formData.value.template.message,
        () => formData.value.template.ttsmessage,
        () => formData.value.template.body,
    ],
    () => {
        variableReg();
    },
);

/**
 * 将需要提取变量的字段值拼接为一个字符串, 用于统一提取变量
 */
const spliceStr = () => {
    let variableFieldsStr = formData.value.template.message;
    if (formData.value.provider === 'dingTalkRobotWebHook') {
        if (formData.value.template.messageType === 'markdown')
            variableFieldsStr += formData.value.template.markdown
                ?.title as string;
        if (formData.value.template.messageType === 'link')
            variableFieldsStr += formData.value.template.link?.title as string;
    }
    if (formData.value.provider === 'embedded')
        variableFieldsStr += formData.value.template.subject as string;
    if (formData.value.provider === 'http')
        variableFieldsStr += formData.value.template.body as string;
    if (formData.value.provider === 'aliyun')
        variableFieldsStr += formData.value.template.ttsmessage as string;

    return variableFieldsStr || '';
};

/**
 * 根据字段输入内容, 提取变量
 * @param value
 */
const variableReg = () => {
    const _val = spliceStr();
    // 已经存在的变量
    const oldKey = formData.value.variableDefinitions?.map((m) => m.id);
    // 正则提取${}里面的值
    const pattern = /(?<=\$\{).*?(?=\})/g;
    const titleList = _val.match(pattern)?.filter((f) => f);
    const newKey = [...new Set(titleList)];
    const result = newKey?.map((m) =>
        oldKey.includes(m)
            ? formData.value.variableDefinitions.find((item) => item.id === m)
            : {
                  id: m,
                  name: '',
                  type: 'string',
                  format: '%s',
              },
    );
    formData.value.variableDefinitions = result as IVariableDefinitions[];
};

/**
 * 钉钉机器人 消息类型选择改变
 */
const handleMessageTypeChange = () => {
    if (formData.value.type !== 'dingTalk') return;
    delete formData.value.template.markdown;
    delete formData.value.template.link;
    delete formData.value.template.text;
    if (formData.value.template.messageType === 'link') {
        formData.value.template.link = {
            title: '',
            picUrl: '',
            messageUrl: '',
            text: formData.value.template.message as string,
        };
    }
    if (formData.value.template.messageType === 'markdown') {
        formData.value.template.markdown = {
            title: '',
            text: formData.value.template.message as string,
        };
    }
    if (formData.value.template.messageType === 'text') {
        formData.value.template.text = {
            content: formData.value.template.message as string,
        };
    }
    // formData.value.variableDefinitions = [];
};

/**
 * 获取详情
 */
const getDetail = async () => {
    if (route.params.id !== ':id') {
        const res = await templateApi.detail(route.params.id as string);
        // formData.value = res.result;
        Object.assign(formData.value, res.result);
        // 阿里云语音模板内容字段采用别名
        if (formData.value.provider === 'aliyun') {
            formData.value.template.ttsmessage = res.result.template.message;
        }
        // console.log('res.result: ', res.result);
        // formData.value = cloneDeep(res.result);
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
    const { result } = await templateApi.getConfig({
        terms,
        sorts: [{ name: 'createTime', order: 'desc' }],
    });
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
    if (!formData.value.configId) return
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
    if (!formData.value.configId) return
    const id = formData.value.configId || undefined;
    const { result } = await templateApi.getSigns(id);
    signsList.value = result;
};

/**
 * 表单提交
 */
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
    // 变量列表存在, 且存在空值
    if (
        formData.value.variableDefinitions.length &&
        formData.value.variableDefinitions.some((s: any) => !s.name)
    )
        return;
    if (formData.value.type === 'email') {
        formData.value.template.text = formData.value.template.message;
        // 邮件没有配置字段
        delete formData.value.configId;
    }
    if (formData.value.template.messageType === 'markdown')
        delete formData.value.template.link;
    if (formData.value.template.messageType === 'link')
        delete formData.value.template.markdown;
    if (formData.value.provider === 'aliyun') {
        formData.value.template.ttsCode = formData.value.template.templateCode;
        // 语音message字段与其他类型的message字段重名, 但语音不需要必填验证
        // 取别名ttsmessage, 验证通过之后, 赋值回message字段, 并删除别名字段
        formData.value.template.message = formData.value.template.ttsmessage;
        delete formData.value.template.ttsmessage;
    }

    if (formData.value.provider === 'dingTalkRobotWebHook') {
      if (formData.value.template?.messageType === 'text') {
        formData.value.template.text!.content = formData.value.template.message as string
      }
      if (formData.value.template.messageType === 'markdown') {
        formData.value.template.markdown!.text = formData.value.template.message
      }
    }

  formRef.value?.validate()
    .then(async () => {
      btnLoading.value = true;

      const res = formData.value.id
        ? await templateApi.update(formData.value)
        : await templateApi.save(formData.value);

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
