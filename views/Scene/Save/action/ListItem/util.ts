import i18n from '@jetlinks-web-core/locales/index'
import { sceneImages } from '../../../../../assets/index';
import { getPlatformUsers , getRelationUsers } from '../../../../../api/others'
import { getParams } from '../../util'
import { getOption } from '../../components/DropdownButton/util'
import {cloneDeep, isArray, omit} from "lodash-es";
const $t = i18n.global.t
export const iconMap = new Map();
iconMap.set('trigger', 'icon-chufagaojing');
iconMap.set('notify', 'icon-xiaoxitongzhi');
iconMap.set('device', 'icon-shebeishuchu');
iconMap.set('relieve', 'icon-jiechugaojing');
iconMap.set('delay', 'icon-yanchizhihang');
iconMap.set('device-data', 'icon-shebei');
iconMap.set('collector', 'icon-collector-output');

export const itemNotifyIconMap = new Map();
itemNotifyIconMap.set(
  'dingTalk',
  sceneImages.dingTalk,
);
itemNotifyIconMap.set('weixin', sceneImages.weixin);
itemNotifyIconMap.set('email',sceneImages.email);
itemNotifyIconMap.set('voice', sceneImages.voice);
itemNotifyIconMap.set('sms', sceneImages.sms);
itemNotifyIconMap.set(
  'webhook',
  sceneImages.webhook,
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
    const platformResp = await getPlatformUsers({
      paging: false,
      sorts: [{ name: 'name', order: 'asc' }],
    });
    if (isRelationUser) {
      relationResp = await getRelationUsers({
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
  const {alarm, valueBackups,...extra} = cloneDeep(terms)
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
            value: alarm,
            valueBackups: valueBackups
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
    return Promise.reject(new Error($t('ListItem.util.9667814-0')));
  }

  if (!terms.termType) {
    return Promise.reject(new Error($t('ListItem.util.9667814-1')));
  }

  if (terms.termType === 'isnull') {
    return Promise.resolve();
  }

  if (terms.value.value === undefined) {
    return Promise.reject(new Error($t('ListItem.util.9667814-2')));
  } else {
    if (
        isArray(terms.value.value) &&
        (terms.value.value.some((_v: any) => _v === undefined) || !terms.value.value.length) || terms.value.value === undefined
    ) {
      return Promise.reject(new Error($t('ListItem.util.9667814-2')));
    }
  }

  return Promise.resolve();
}

export const filterTermsValidator = (terms: any) => {
  if (terms.terms?.length) {
    const realTerms = terms.terms[0]
    const alarmTerms = terms.terms[1]

    // if (!alarmTerms.value.value) {
    //   return Promise.reject(new Error($t('ListItem.util.9667814-3')))
    // }
    return termsValidator(realTerms)
  } else {
    return termsValidator(terms)
  }
}


export const useCheckFilter = () =>  inject(CHECK_FILTER_KEY, {})
