import i18n from '@/i18n'
import { getImage } from '@/utils/comm';
const $t = i18n.global.t

// 平台类型
export const platformTypeList = [
  {
    label: $t('iot-card.data.165902-0'),
    value: 'onelink',
    imgUrl: getImage('/iot-card/onelink.png'),
    imgSize: ['78px', '20px'],
  },
  {
    label: $t('iot-card.data.165902-1'),
    value: 'ctwing',
    imgUrl: getImage('/iot-card/ctwingcmp.png'),
    imgSize: ['52px', '25px'],
  },
  {
    label: $t('iot-card.data.165902-2'),
    value: 'unicom',
    imgUrl: getImage('/iot-card/unicom.png'),
    imgSize: ['56px', '41px'],
  },
];

export const OperatorMap = {
  onelink: $t('iot-card.data.165902-3'),
  ctwing: $t('iot-card.data.165902-4'),
  unicom: $t('iot-card.data.165902-5'),
}

//运营商
export const OperatorList = [
  {
    label: $t('iot-card.data.165902-3'),
    value: 'onelink',
  },
  {
    label: $t('iot-card.data.165902-4'),
    value: 'ctwing',
  },
  {
    label: $t('iot-card.data.165902-5'),
    value: 'unicom',
  },
];

// 类型
export const TypeList = [
  {
    label: $t('iot-card.data.165902-6'),
    value: 'year',
  },
  {
    label: $t('iot-card.data.165902-7'),
    value: 'season',
  },
  {
    label: $t('iot-card.data.165902-8'),
    value: 'month',
  },
  {
    label: $t('iot-card.data.165902-9'),
    value: 'other',
  },
];

// 支付方式
export const PaymentMethod = [
  {
    label: $t('iot-card.data.165902-10'),
    value: 'ALIPAY_WAP',
  },
  {
    label: $t('iot-card.data.165902-11'),
    value: 'ALIPAY_WEB',
  },
  {
    label: $t('iot-card.data.165902-12'),
    value: 'WEIXIN_JSAPI',
  },
  {
    label: $t('iot-card.data.165902-13'),
    value: 'WEIXIN_NATIVE',
  },
];
