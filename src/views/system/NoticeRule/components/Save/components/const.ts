import { getImage } from '@jetlinks-web/utils';
import i18n from '@/locales';
interface INoticeMethod {
    label: string;
    value: string;
}
// 通知方式
export const NOTICE_METHOD: INoticeMethod[] = [
    {
        label: i18n.global.t('components.const.001562-0'),
        value: 'dingTalk',
    },
    {
        label: i18n.global.t('components.const.001562-1'),
        value: 'weixin',
    },
    {
        label: i18n.global.t('components.const.001562-2'),
        value: 'email',
    },
    {
        label: i18n.global.t('components.const.001562-3'),
        value: 'voice',
    },
    {
        label: i18n.global.t('components.const.001562-4'),
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
            label: i18n.global.t('components.const.001562-5'),
            value: 'dingTalkMessage',
            logo: getImage('/notice/dingtalk.png'),
        },
        {
            label: i18n.global.t('components.const.001562-6'),
            value: 'dingTalkRobotWebHook',
            logo: getImage('/notice/dingTalk-rebot.png'),
        },
    ],
    weixin: [
        {
            label: i18n.global.t('components.const.001562-7'),
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
            label: i18n.global.t('components.const.001562-8'),
            value: 'aliyun',
            logo: getImage('/notice/voice.png'),
        },
    ],
    sms: [
        {
            label: i18n.global.t('components.const.001562-9'),
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
            label: i18n.global.t('components.const.001562-2'),
            value: 'embedded',
            logo: getImage('/notice/email.png'),
        },
    ],
}