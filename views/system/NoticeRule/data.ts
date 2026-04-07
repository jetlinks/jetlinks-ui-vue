import { DingTalk, Wechat, Email, Sms, Voice, InsideMail } from '@jetlinks-web-core/assets'

const iconMap = new Map();
iconMap.set('notifier-dingTalk', DingTalk);
iconMap.set('notifier-weixin', Wechat);
iconMap.set('notifier-email', Email);
iconMap.set('notifier-voice', Voice);
iconMap.set('notifier-sms', Sms);
iconMap.set('inside-mail', InsideMail);

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
