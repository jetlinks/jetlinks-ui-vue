import { getImage } from "@/utils/comm";

const iconMap = new Map();
iconMap.set('notifier-dingTalk', getImage('/notice/dingtalk.png'));
iconMap.set('notifier-weixin', getImage('/notice/wechat.png'));
iconMap.set('notifier-email', getImage('/notice/email.png'));
iconMap.set('notifier-voice', getImage('/notice/voice.png'));
iconMap.set('notifier-sms', getImage('/notice/sms.png'));
iconMap.set('inside-mail', getImage('/notice/sms.png'));

const noticeType = new Map();
noticeType.set('notifier-dingTalk', 'dingtalk');
noticeType.set('notifier-weixin', 'wechat');
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

export { iconMap, noticeType, variableMap }