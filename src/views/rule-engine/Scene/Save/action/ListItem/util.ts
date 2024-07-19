import { getImage } from '@/utils/comm'
import NoticeApi from '@/api/notice/config'
import { getParams } from '@/views/rule-engine/Scene/Save/util'
import { getOption } from '@/views/rule-engine/Scene/Save/components/DropdownButton/util'

export const iconMap = new Map();
iconMap.set('trigger', 'icon-chufagaojing');
iconMap.set('notify', 'icon-xiaoxitongzhi');
iconMap.set('device', 'icon-shebeishuchu');
iconMap.set('relieve', 'icon-jiechugaojing');
iconMap.set('delay', 'icon-yanchizhihang');

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

export const getBuildInData = async (params: any, data: any) => {
  const buildInData = await getParams(params, unref(data));

  return function(upperKey: string, key: string ) {
    return getOption(buildInData, upperKey, key)
  }
}

export const getNotifyVariablesUser = (isRelationUser: boolean = false): Promise<{ platform: any[], relation: any[] }> => {
  return new Promise(async (resolve) => {
    let relationResp = undefined;
    const platformResp = await NoticeApi.getPlatformUsers({
      paging: false,
      sorts: [{ name: 'name', order: 'asc' }],
    });
    if (isRelationUser) {
      relationResp = await NoticeApi.getRelationUsers({
        paging: false,
        sorts: [{ name: 'name', order: 'asc' }],
      });
    }

    resolve({
      platform: platformResp.result || [],
      relation: relationResp?.result || []
    })
  })
}
