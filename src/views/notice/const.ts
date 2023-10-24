import { getImage } from '@/utils/comm';

interface INoticeMethod {
    label: string;
    value: string;
}

// 通知方式
export const NOTICE_METHOD: INoticeMethod[] = [
    {
        label: '钉钉',
        value: 'dingTalk',
    },
    {
        label: '微信',
        value: 'weixin',
    },
    {
        label: '邮件',
        value: 'email',
    },
    {
        label: '语音',
        value: 'voice',
    },
    {
        label: '短信',
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
            label: '钉钉消息',
            value: 'dingTalkMessage',
            logo: getImage('/notice/dingtalk.png'),
        },
        {
            label: '群机器人消息',
            value: 'dingTalkRobotWebHook',
            logo: getImage('/notice/dingTalk-rebot.png'),
        },
    ],
    weixin: [
        {
            label: '企业消息',
            value: 'corpMessage',
            logo: getImage('/notice/weixin-corp.png'),
        },
        // {
        //   label: '服务号消息',
        //   value: 'officialMessage'
        //   logo: getImage('/notice/weixin-official.png'),
        // }
    ],
    voice: [
        {
            label: '阿里云语音',
            value: 'aliyun',
            logo: getImage('/notice/voice.png'),
        },
    ],
    sms: [
        {
            label: '阿里云短信',
            value: 'aliyunSms',
            logo: getImage('/notice/sms.png'),
        },
    ],
    webhook: [
        {
            label: 'WebHook',
            value: 'http',
            logo: getImage('/notice/webhook.png'),
        },
    ],
    email: [
        {
            label: '邮件',
            value: 'embedded',
            logo: getImage('/notice/email.png'),
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
    { label: '语音通知', value: 'voice' },
    { label: '语音验证码', value: 'tts' },
]