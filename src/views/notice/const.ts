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
        label: 'webhook',
        value: 'webhook',
    },
];

// 消息类型
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
            label: 'webhook',
            value: 'http',
            logo: getImage('/notice/webhook.png'),
        },
    ],
    email: [
        {
            label: 'email',
            value: 'embedded',
            logo: getImage('/notice/email.png'),
        },
    ],
}

// 字段关系映射
// 配置
export const CONFIG_FIELD_MAP = {
    dingTalk: {
        appKey: undefined,
        appSecret: undefined,
        url: undefined,
    },
    weixin: {
        corpId: undefined,
        corpSecret: undefined,
    },
    email: {
        host: undefined,
        port: 25,
        ssl: false,
        sender: undefined,
        username: undefined,
        password: undefined,
    },
    voice: {
        regionId: undefined,
        accessKeyId: undefined,
        secret: undefined,
    },
    sms: {
        regionId: undefined,
        accessKeyId: undefined,
        secret: undefined,
    },
    webhook: {
        url: undefined,
        headers: [],
    },
}; 