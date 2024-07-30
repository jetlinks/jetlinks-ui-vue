import { getImage } from '@/utils/comm'
import NoticeApi from '@/api/notice/config'
import { getParams } from '@/views/rule-engine/Scene/Save/util'
import { getOption } from '@/views/rule-engine/Scene/Save/components/DropdownButton/util'
import {cloneDeep, isArray, omit} from "lodash-es";

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

export const CHECK_FILTER_KEY = Symbol('check-filter-key')

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


export const analysisFilterTerms = (terms: any) => {
  if (terms.terms?.length) {
    const realTerms = terms.terms[0]
    const alarmTerms = terms.terms[1]
    return {
      ...omit(realTerms, ['terms']),
      alarm: alarmTerms.value.value
    }
  }
  return terms
}

export const handleFilterTerms = (terms: any) => {
  const {alarm, ...extra} = cloneDeep(terms)
  if (terms.hasOwnProperty('alarm')) {
    const column = extra.column
    const identifying = column.split('.')[0]
    return {
      terms: [
        extra,
        {
          column: `${identifying}.alarmConfigId`,
          value: {
            source: 'fixed',
            value: alarm
          },
          type: 'and',
          termType: 'eq'
        }
      ]
    }
  }
  return terms
}

const termsValidator = (terms: any) => {
  if (!terms.column) {
    return Promise.reject(new Error('请选择参数'));
  }

  if (!terms.termType) {
    return Promise.reject(new Error('请选择操作符'));
  }

  if (terms.value.value === undefined) {
    return Promise.reject(new Error('请选择或输入参数值'));
  } else {
    if (
        isArray(terms.value.value) &&
        terms.value.value.some((_v: any) => _v === undefined) || terms.value.value === undefined
    ) {
      return Promise.reject(new Error('请选择或输入参数值'));
    }
  }

  return Promise.resolve();
}

export const filterTermsValidator = (terms: any) => {
  if (terms.terms?.length) {
    const realTerms = terms.terms[0]
    const alarmTerms = terms.terms[1]

    if (!alarmTerms.value.value) {
      return Promise.reject(new Error('请选择告警配置'))
    }
    return termsValidator(realTerms)
  } else {
    return termsValidator(terms)
  }
}


export const useCheckFilter = () =>  inject(CHECK_FILTER_KEY, {})
