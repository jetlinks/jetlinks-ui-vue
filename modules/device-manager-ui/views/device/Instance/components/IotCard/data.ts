import { iotCard } from '../../../../../assets';
import i18n from '@jetlinks-web-core/locales';

// 平台类型
export const platformTypeList = [
  {
    label: i18n.global.t('IotCard.data.563392-0'),
    value: 'onelink',
    imgUrl: iotCard.onelink,
    imgSize: ['78px', '20px'],
  },
  {
    label: i18n.global.t('IotCard.data.563392-1'),
    value: 'ctwing',
    imgUrl: iotCard.ctwingcmp,
    imgSize: ['52px', '25px'],
  },
  {
    label: i18n.global.t('IotCard.data.563392-2'),
    value: 'unicom',
    imgUrl: iotCard.unicom,
    imgSize: ['56px', '41px'],
  },
];

export const OperatorMap = {
  onelink: i18n.global.t('IotCard.data.563392-3'),
  ctwing: i18n.global.t('IotCard.data.563392-4'),
  unicom: i18n.global.t('IotCard.data.563392-5'),
}

//运营商
export const OperatorList = [
  {
    label: i18n.global.t('IotCard.data.563392-3'),
    value: 'onelink',
  },
  {
    label: i18n.global.t('IotCard.data.563392-4'),
    value: 'ctwing',
  },
  {
    label: i18n.global.t('IotCard.data.563392-5'),
    value: 'unicom',
  },
];

// 类型
export const TypeList = [
  {
    label: i18n.global.t('IotCard.data.563392-6'),
    value: 'year',
  },
  {
    label: i18n.global.t('IotCard.data.563392-7'),
    value: 'season',
  },
  {
    label: i18n.global.t('IotCard.data.563392-8'),
    value: 'month',
  },
  {
    label: i18n.global.t('IotCard.data.563392-9'),
    value: 'other',
  },
];

// 支付方式
export const PaymentMethod = [
  {
    label: i18n.global.t('IotCard.data.563392-10'),
    value: 'ALIPAY_WAP',
  },
  {
    label: i18n.global.t('IotCard.data.563392-11'),
    value: 'ALIPAY_WEB',
  },
  {
    label: i18n.global.t('IotCard.data.563392-12'),
    value: 'WEIXIN_JSAPI',
  },
  {
    label: i18n.global.t('IotCard.data.563392-13'),
    value: 'WEIXIN_NATIVE',
  },
];
