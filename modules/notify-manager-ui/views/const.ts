
import { constImages } from "../assets/notice/index";
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
interface INoticeMethod {
    label: string;
    value: string;
}

// 通知方式
export const NOTICE_METHOD: INoticeMethod[] = [
    {
        label: $t('views.const.373821-0'),
        value: 'dingTalk',
    },
    {
        label: $t('views.const.373821-1'),
        value: 'weixin',
    },
    {
        label: $t('views.const.373821-2'),
        value: 'email',
    },
    {
        label: $t('views.const.373821-3'),
        value: 'voice',
    },
    {
        label: $t('views.const.373821-4'),
        value: 'sms',
    },
    {
        label: 'WebHook',
        value: 'webhook',
    },
];

// 类型
export const MSG_TYPE = {
    dingTalk: [
        {
            label: $t('views.const.373821-5'),
            value: 'dingTalkMessage',
            logo: constImages.dingtalk,
        },
        {
            label: $t('views.const.373821-6'),
            value: 'dingTalkRobotWebHook',
            logo: constImages.dingtalkRebot,
        },
    ],
    weixin: [
        {
            label: $t('views.const.373821-7'),
            value: 'corpMessage',
            logo: constImages.weixinCorp,
        },
        // {
        //   label: '服务号消息',
        //   value: 'officialMessage'
        //   logo: getImage('/notice/weixin-official.png'),
        // }
    ],
    voice: [
        {
            label: $t('views.const.373821-8'),
            value: 'aliyun',
            logo: constImages.voice,
        },
    ],
    sms: [
        {
            label: $t('views.const.373821-9'),
            value: 'aliyunSms',
            logo: constImages.sms,
        },
    ],
    webhook: [
        {
            label: 'WebHook',
            value: 'http',
            logo: constImages.webhook,
        },
    ],
    email: [
        {
            label: $t('views.const.373821-2'),
            value: 'embedded',
            logo: constImages.email,
        },
    ],
}

// 字段关系映射
// 配置
export const CONFIG_FIELD_MAP = {
    dingTalk: {
        dingTalkMessage: {
            appKey: undefined,
            appSecret: undefined,
        },
        dingTalkRobotWebHook: {
            url: undefined,
        }
    },
    weixin: {
        corpMessage: {
            corpId: undefined,
            corpSecret: undefined,
        },
        // officialMessage: {},
    },
    email: {
        embedded: {
            host: undefined,
            port: 25,
            ssl: false,
            sender: undefined,
            username: undefined,
            password: undefined,
        }
    },
    voice: {
        aliyun: {
            regionId: undefined,
            accessKeyId: undefined,
            secret: undefined,
        }
    },
    sms: {
        aliyunSms: {
            regionId: undefined,
            accessKeyId: undefined,
            secret: undefined,
        }
    },
    webhook: {
        http: {
            url: undefined,
            headers: [],
        }
    },

};

// 模板
export const TEMPLATE_FIELD_MAP = {
    dingTalk: {
        dingTalkMessage: {
            agentId: undefined,
            message: undefined,
            departmentIdList: undefined,
            userIdList: undefined
        },
        dingTalkRobotWebHook: {
            message: undefined,
            messageType: 'markdown',
            markdown: {
                text: undefined,
                title: undefined,
            },
            link: {
                title: undefined,
                picUrl: undefined,
                messageUrl: undefined,
                text: undefined,
            },
        }
    },
    weixin: {
        corpMessage: {
            agentId: undefined,
            message: undefined,
            toParty: undefined,
            toUser: undefined,
            toTag: undefined,
        },
        officialMessage: {},
    },
    email: {
        embedded: {
            subject: undefined,
            sendTo: [],
            attachments: [],
            message: undefined,
            text: undefined,
        }
    },
    voice: {
        aliyun: {
            templateType: 'tts',
            templateCode: undefined,
            ttsCode: undefined,
            // message: undefined,
            ttsmessage: undefined,
            playTimes: 1,
            calledShowNumbers: undefined,
            calledNumber: undefined,
        }
    },
    sms: {
        aliyunSms: {
            code: undefined,
            message: undefined,
            phoneNumber: undefined,
            signName: undefined,
        }
    },
    webhook: {
        http: {
            contextAsBody: true,
            body: undefined
        }
    },
};

// 钉钉机器人-消息类型
export const ROBOT_MSG_TYPE = [
    { label: 'markdown', value: 'markdown' },
    { label: 'text', value: 'text' },
    { label: 'link', value: 'link' },
]
// 语音通知类型
export const VOICE_TYPE = [
    { label: $t('views.const.373821-10'), value: 'voice' },
    { label: $t('views.const.373821-11'), value: 'tts' },
]
