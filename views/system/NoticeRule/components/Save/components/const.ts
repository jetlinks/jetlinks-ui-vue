import i18n from '@jetlinks-web-core/locales';
import { DingTalk, DingTalkRebot, Email, Sms, Voice, Webhook, WeixinCorp } from '@jetlinks-web-core/assets/notice'

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
            logo: DingTalk,
        },
        {
            label: i18n.global.t('components.const.001562-6'),
            value: 'dingTalkRobotWebHook',
            logo: DingTalkRebot,
        },
    ],
    weixin: [
        {
            label: i18n.global.t('components.const.001562-7'),
            value: 'corpMessage',
            logo: WeixinCorp,
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
            logo: Voice,
        },
    ],
    sms: [
        {
            label: i18n.global.t('components.const.001562-9'),
            value: 'aliyunSms',
            logo: Sms,
        },
    ],
    webhook: [
        {
            label: 'WebHook',
            value: 'http',
            logo: Webhook,
        },
    ],
    email: [
        {
            label: i18n.global.t('components.const.001562-2'),
            value: 'embedded',
            logo: Email,
        },
    ],
}
