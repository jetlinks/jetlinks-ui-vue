import { notifyImages } from '../assets/scene/notify/index'

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
            logo: notifyImages.dingTalk,
        },
        {
            label: '群机器人消息',
            value: 'dingTalkRobotWebHook',
            logo: notifyImages.dingTalkRebot,
        },
    ],
    weixin: [
        {
            label: '企业消息',
            value: 'corpMessage',
            logo: notifyImages.weixinCorp,
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
            logo: notifyImages.voice,
        },
    ],
    sms: [
        {
            label: '阿里云短信',
            value: 'aliyunSms',
            logo: notifyImages.sms,
        },
    ],
    webhook: [
        {
            label: 'WebHook',
            value: 'http',
            logo: notifyImages.webhook,
        },
    ],
    email: [
        {
            label: '邮件',
            value: 'embedded',
            logo: notifyImages.email,
        },
    ],
}