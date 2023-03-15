import { getImage } from '@/utils/comm'

export const iconMap = new Map();
iconMap.set('trigger', getImage('/scene/action-bind-icon.png'));
iconMap.set('notify', getImage('/scene/action-notify-icon.png'));
iconMap.set('device', getImage('/scene/action-device-icon.png'));
iconMap.set('relieve', getImage('/scene/action-unbind-icon.png'));
iconMap.set('delay', getImage('/scene/action-delay-icon.png'));

export const itemNotifyIconMap = new Map();
itemNotifyIconMap.set(
  'dingTalk',
  getImage('/scene/notify-item-img/dingtalk.png'),
);
itemNotifyIconMap.set('weixin', getImage('/scene/notify-item-img/weixin.png'));
itemNotifyIconMap.set('email', getImage('/scene/notify-item-img/email.png'));
itemNotifyIconMap.set('voice', getImage('/scene/notify-item-img/voice.png'));
itemNotifyIconMap.set('sms', getImage('/scene/notify-item-img/sms.png'));
itemNotifyIconMap.set(
  'webhook',
  getImage('/scene/notify-item-img/webhook.png'),
);

export const typeIconMap = {
  READ_PROPERTY: 'icon-zhihangdongzuodu',
  INVOKE_FUNCTION: 'icon-zhihangdongzuoxie-1',
  WRITE_PROPERTY: 'icon-zhihangdongzuoxie',
};