<!-- 通知模板详情 -->
<template>
    <page-container>
        <j-card>
            <j-row>
                <j-col :span="10">
                    <j-form layout="vertical" :rules='formRules' ref='formRef' :model='formData'>
                        <j-form-item
                            :label="$t('Detail.index.214682-0')"
                            name='type'
                        >
                            <j-select
                                v-model:value="formData.type"
                                :placeholder="$t('Detail.index.214682-1')"
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
                        <j-form-item :label="$t('Detail.index.214682-2')" name='name'>
                            <j-input
                                v-model:value="formData.name"
                                :placeholder="$t('Detail.index.214682-3')"
                            />
                        </j-form-item>
                        <j-form-item
                            :label="$t('Detail.index.214682-4')"
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
                                :disabled="flag"
                            />
                        </j-form-item>
                        <j-form-item
                            :name="formData.provider === 'dingTalkRobotWebHook'? '':'configId'"
                            v-if="formData.type !== 'email'"
                        >
                            <template #label>
                                <span>
                                    {{ $t('Detail.index.214682-5') }}
                                    <j-tooltip
                                        :title="$t('Detail.index.214682-6')"
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
                                :placeholder="$t('Detail.index.214682-7')"
                                @change="handleConfigChange"
                                :disabled="flag"
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
                                            <j-tooltip :title="$t('Detail.index.214682-8')">
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
                                        :placeholder="$t('Detail.index.214682-9')"
                                    />
                                </j-form-item>
                                <j-row :gutter="10">
                                    <j-col :span="12">
                                        <j-form-item :label="$t('Detail.index.214682-10')">
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
                                                    {{ $t('Detail.index.214682-11') }}
                                                    <j-tooltip
                                                        :title="$t('Detail.index.214682-12')"
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
                                    :label="$t('Detail.index.214682-13')"
                                    :name='["template", "messageType"]'
                                >
                                    <j-select
                                        v-model:value="
                                            formData.template.messageType
                                        "
                                        :placeholder="$t('Detail.index.214682-14')"
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
                                        :label="$t('Detail.index.214682-15')"
                                        :name='["template", "markdown", "title"]'
                                    >
                                        <j-input
                                            v-model:value="
                                                formData.template.markdown.title
                                            "
                                            :placeholder="$t('Detail.index.214682-16')"
                                        />
                                    </j-form-item>
                                </template>
                                <template
                                    v-if="
                                        formData.template.messageType === 'link'
                                    "
                                >
                                    <j-form-item
                                        :label="$t('Detail.index.214682-15')"
                                        :name='["template", "link", "title"]'
                                    >
                                        <j-input
                                            v-model:value="
                                                formData.template.link.title
                                            "
                                            :placeholder="$t('Detail.index.214682-16')"
                                        />
                                    </j-form-item>
                                    <j-form-item :label="$t('Detail.index.214682-17')">
                                        <j-input
                                            v-model:value="
                                                formData.template.link.picUrl
                                            "
                                            :placeholder="$t('Detail.index.214682-18')"
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
                                    <j-form-item :label="$t('Detail.index.214682-19')">
                                        <j-input
                                            v-model:value="
                                                formData.template.link
                                                    .messageUrl
                                            "
                                            :placeholder="$t('Detail.index.214682-20')"
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
                                        <j-tooltip :title="$t('Detail.index.214682-8')">
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-input
                                    v-model:value="formData.template.agentId"
                                    :placeholder="$t('Detail.index.214682-9')"
                                />
                            </j-form-item>
                            <j-row :gutter="10">
                                <j-col :span="12">
                                    <j-form-item>
                                        <template #label>
                                            <span>
                                                {{ $t('Detail.index.214682-11') }}
                                                <j-tooltip
                                                    :title="$t('Detail.index.214682-21')"
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
                                    <j-form-item :label="$t('Detail.index.214682-10')">
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
                                        {{ $t('Detail.index.214682-22') }}
                                        <j-tooltip
                                            :title="$t('Detail.index.214682-23')"
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
                                        {{ $t('Detail.index.214682-15') }}
                                        <j-tooltip :title="$t('Detail.index.214682-24')">
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-input
                                    v-model:value="formData.template.subject"
                                    :placeholder="$t('Detail.index.214682-16')"
                                />
                            </j-form-item>
                            <j-form-item
                                :name='["template", "sendTo"]'
                            >
                                <template #label>
                                    <span>
                                        {{ $t('Detail.index.214682-25') }}
                                        <j-tooltip
                                            :title="$t('Detail.index.214682-26')"
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
                                    :placeholder="$t('Detail.index.214682-27')"
                                />
                            </j-form-item>
                            <j-form-item>
                                <template #label>
                                    <span>
                                        {{ $t('Detail.index.214682-28') }}
                                        <j-tooltip
                                            :title="$t('Detail.index.214682-29')"
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
                                        {{ $t('Detail.index.214682-4') }}
                                        <j-tooltip
                                            :title="$t('Detail.index.214682-30')"
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
                                    :placeholder="$t('Detail.index.214682-31')"
                                    @change="onVoiceTemplateTypeChange"
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
                                                {{ formData.template.templateType === 'voice' ? $t('Detail.index.214682-32') : $t('Detail.index.214682-33') }}
                                                <j-tooltip
                                                    :title="$t('Detail.index.214682-34')"
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
                                            :placeholder="$t('Detail.index.214682-35')"
                                        />
                                    </j-form-item>
                                </j-col>
                                <j-col :span="12">
                                    <j-form-item
                                        :name='["template", "calledNumber"]'
                                    >
                                        <template #label>
                                            <span>
                                                {{ $t('Detail.index.214682-36') }}
                                                <j-tooltip
                                                    :title="$t('Detail.index.214682-37')"
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
                                            :placeholder="$t('Detail.index.214682-38')"
                                        />
                                    </j-form-item>
                                </j-col>
                            </j-row>
                            <j-form-item
                                :name='["template", "calledShowNumbers"]'
                            >
                                <template #label>
                                    <span>
                                        {{ $t('Detail.index.214682-39') }}
                                        <j-tooltip
                                            :title="$t('Detail.index.214682-40')"
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
                                    :placeholder="$t('Detail.index.214682-41')"
                                />
                            </j-form-item>
                            <j-form-item
                                :name='["template", "playTimes"]'
                            >
                                <template #label>
                                    <span>
                                        {{ $t('Detail.index.214682-42') }}
                                        <j-tooltip :title="$t('Detail.index.214682-43')">
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-input-number
                                    v-model:value="formData.template.playTimes"
                                    :placeholder="$t('Detail.index.214682-44')"
                                    style="width: 100%"
                                />
                            </j-form-item>
                            <j-form-item
                                v-if="formData.template.templateType === 'tts'"
                                :name='["template", "ttsmessage"]'
                            >
                                <template #label>
                                    <span>
                                        {{ $t('Detail.index.214682-45') }}
                                        <j-tooltip
                                            :title="$t('Detail.index.214682-46')"
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
                                    :placeholder="$t('Detail.index.214682-47')"
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
                                                {{ $t('Detail.index.214682-48') }}
                                                <j-tooltip
                                                    :title="$t('Detail.index.214682-49')"
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
                                            :placeholder="$t('Detail.index.214682-50')"
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
                                                {{ $t('Detail.index.214682-11') }}
                                                <j-tooltip
                                                    :title="$t('Detail.index.214682-37')"
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
                                            :placeholder="$t('Detail.index.214682-51')"
                                        />
                                    </j-form-item>
                                </j-col>
                            </j-row>
                            <j-form-item
                                :name='["template", "signName"]'
                            >
                                <template #label>
                                    <span>
                                        {{ $t('Detail.index.214682-52') }}
                                        <j-tooltip
                                            :title="$t('Detail.index.214682-53')"
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
                                    :placeholder="$t('Detail.index.214682-54')"
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
                            <j-form-item :label="$t('Detail.index.214682-55')">
                                <j-radio-group
                                    v-model:value="
                                        formData.template.contextAsBody
                                    "
                                    style="margin-bottom: 20px"
                                >
                                    <j-radio :value="true">{{ $t('Detail.index.214682-56') }}</j-radio>
                                    <j-radio :value="false">{{ $t('Detail.index.214682-57') }}</j-radio>
                                </j-radio-group>
                                <j-textarea
                                    :placeholder="$t('Detail.index.214682-58')"
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
                                        language="JavaScript"
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
                                        {{ $t('Detail.index.214682-45') }}
                                        <j-tooltip
                                            :title="$t('Detail.index.214682-59')"
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
                                    :placeholder="$t('Detail.index.214682-60',['${name}','${time}'])"
                                />
                            </j-form-item>
                        </template>
                        <j-form-item
                            :label="$t('Detail.index.214682-63')"
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
                        <j-form-item :label="$t('Detail.index.214682-64')">
                            <j-textarea
                                v-model:value="formData.description"
                                show-count
                                :maxlength="200"
                                :rows="5"
                                :placeholder="$t('Detail.index.214682-65')"
                            />
                        </j-form-item>
                        <j-form-item>
                            <j-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="btnLoading"
                            >
                                {{ $t('Detail.index.214682-66') }}
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
import { UploadChangeParam } from 'ant-design-vue';
import { Form } from 'jetlinks-ui-components';
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const router = useRouter();
const route = useRoute();
const useForm = Form.useForm;
const formRef = ref()

const flag = ref<boolean>(false)
// 消息类型
const msgType = ref([
    {
        label: $t('Detail.index.214682-67'),
        value: 'dingTalkMessage',
        logo: getImage('/notice/dingtalk.png'),
    },
    {
        label: $t('Detail.index.214682-68'),
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

    if(route.query?.notifierId){
        formData.value.configId = route.query?.notifierId as string
        flag.value = true
    } else {
        formData.value.configId = undefined;
    }
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
                : msgType.value?.[0]?.value;

        if (val !== 'email') getConfigList();

        if (val === 'sms') {
            getTemplateList();
            getSignsList();
        }
    },
);

// 验证规则
const formRules = {
    type: [{ required: true, message: $t('Detail.index.214682-1') }],
    name: [
        { required: true, message: $t('Detail.index.214682-3') },
        { max: 64, message: $t('Detail.index.214682-69') },
    ],
    provider: [{ required: true, message: $t('Detail.index.214682-31') }],
    configId: [{ required: true, message: $t('Detail.index.214682-7') }],
    template: {
      agentId: [
        { required: true, message: $t('Detail.index.214682-9') },
        { max: 64, message: $t('Detail.index.214682-69') },
      ],
      messageType: [{ required: true, message: $t('Detail.index.214682-14') }],
      markdown: {
        title: [
          { required: true, message: $t('Detail.index.214682-16') },
          { max: 64, message: $t('Detail.index.214682-69') },
        ]
      },
      link: {
        title: [
          { required: true, message: $t('Detail.index.214682-16') },
          { max: 64, message: $t('Detail.index.214682-69') },
        ]
      },
      subject: [
        { required: true, message: $t('Detail.index.214682-16') },
        { max: 64, message: $t('Detail.index.214682-69') },
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
              return Promise.reject(error ? $t('Detail.index.214682-70', [error]) : '');
            else return Promise.resolve();
          },
        }
      ],
      templateType: [{ required: true, message: $t('Detail.index.214682-31') }],
      templateCode: [{ required: true, message: $t('Detail.index.214682-35') }],
      calledNumber: [
        { max: 64, message: $t('Detail.index.214682-69') },
        {
          validator(_rule: Rule, value: string) {
            if (!value) return Promise.resolve();
            if (!phoneRegEx(value)) return Promise.reject($t('Detail.index.214682-71'));
            return Promise.resolve();
          },
        }
      ],
      calledShowNumbers: [
        // { required: true, message: $t('Detail.index.214682-41') },
        { max: 64, message: $t('Detail.index.214682-69') },
        {
          validator(_rule: Rule, value: string) {
            if (!value) return Promise.resolve();
            if (!phoneRegEx(value)) return Promise.reject($t('Detail.index.214682-71'));
            return Promise.resolve();
          },
        }
      ],
      playTimes: [
        {
          validator(_rule: Rule, value: number) {
            if (value < 1 || value > 3)
              return Promise.reject($t('Detail.index.214682-72'));
            else return Promise.resolve();
          },
        }
      ],
      code: [{ required: true, message: $t('Detail.index.214682-50')}],
      signName: [{ required: true, message: $t('Detail.index.214682-54') }],
      phoneNumber: [
        { max: 64, message: $t('Detail.index.214682-69') },
        {
          validator(_rule: Rule, value: string) {
            if (!value) return Promise.resolve();
            if (!phoneRegEx(value))
              return Promise.reject($t('Detail.index.214682-73'));
            return Promise.resolve();
          },
        }
      ],
      message: [
        {
          required: true,
          message: $t('Detail.index.214682-74'),
        },
        { max: 500, message: $t('Detail.index.214682-75') },
      ],
      ttsmessage: [
        { max: 500, message: $t('Detail.index.214682-75') }
      ]
    },
    description: [{ max: 200, message: $t('Detail.index.214682-76') }],
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

const onVoiceTemplateTypeChange = () => {
    formData.value.template.ttsmessage = undefined
    formData.value.variableDefinitions = []
}

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
      if (formData.value.template.messageType === 'link'){
        formData.value.template.link!.text = formData.value.template.message
      }
    }

  formRef.value?.validate()
    .then(async () => {
      btnLoading.value = true;

      const res = formData.value.id
        ? await templateApi.update(formData.value)
        : await templateApi.save(formData.value);

      if (res?.success) {
        onlyMessage($t('Detail.index.214682-77'));
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
    .catch((err) => {
      console.log('err: ', err);
    })
    .finally(() => {
      btnLoading.value = false;
    });
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
    if(route.query?.notifierId){
        formData.value.configId = route.query?.notifierId as string
        flag.value = true
    }
})
</script>
