import { getImage } from "@jetlinks-web/utils";

const iconMap = new Map();
iconMap.set('notifier-dingTalk', getImage('/notice-rule/dingtalk.png'));
iconMap.set('notifier-weixin', getImage('/notice-rule/wechat.png'));
iconMap.set('notifier-email', getImage('/notice-rule/email.png'));
iconMap.set('notifier-voice', getImage('/notice-rule/voice.png'));
iconMap.set('notifier-sms', getImage('/notice-rule/sms.png'));
iconMap.set('inside-mail', getImage('/notice-rule/inside-mail.png'));

const noticeType = new Map();
noticeType.set('notifier-dingTalk', 'dingTalk');
noticeType.set('notifier-weixin', 'weixin');
noticeType.set('notifier-email', 'email');
noticeType.set('notifier-voice', 'voice');
noticeType.set('notifier-sms', 'sms');
noticeType.set('inside-mail', 'inside-mail');

const variableMap = new Map();
variableMap.set('notifier-dingTalk', 'userIdList');
variableMap.set('notifier-weixin', 'toUser');
variableMap.set('notifier-email', 'sendTo');
variableMap.set('notifier-voice', 'calledNumber');
variableMap.set('notifier-sms', 'phoneNumber');

const _variableMap = new Map();
_variableMap.set('dingTalk', 'userIdList');
_variableMap.set('weixin', 'toUser');
_variableMap.set('email', 'sendTo');
_variableMap.set('voice', 'calledNumber');
_variableMap.set('sms', 'phoneNumber');

export { iconMap, noticeType, variableMap, _variableMap }