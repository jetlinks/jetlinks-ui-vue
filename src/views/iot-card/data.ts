import { getImage } from '@/utils/comm';

// 平台类型
export const platformTypeList = [
  {
    label: '移动OneLink',
    value: 'onelink',
    imgUrl: getImage('/iot-card/onelink.png'),
    imgSize: ['78px', '20px'],
  },
  {
    label: '电信Ctwing',
    value: 'ctwing',
    imgUrl: getImage('/iot-card/ctwingcmp.png'),
    imgSize: ['52px', '25px'],
  },
  {
    label: '联通Unicom',
    value: 'unicom',
    imgUrl: getImage('/iot-card/unicom.png'),
    imgSize: ['56px', '41px'],
  },
];

export const OperatorMap = {
  onelink: '移动',
  ctwing: '电信',
  unicom: '联通',
}

//运营商
export const OperatorList = [
  {
    label: '移动',
    value: 'onelink',
  },
  {
    label: '电信',
    value: 'ctwing',
  },
  {
    label: '联通',
    value: 'unicom',
  },
];

// 类型
export const TypeList = [
  {
    label: '年卡',
    value: 'year',
  },
  {
    label: '季卡',
    value: 'season',
  },
  {
    label: '月卡',
    value: 'month',
  },
  {
    label: '其他',
    value: 'other',
  },
];

// 支付方式
export const PaymentMethod = [
  {
    label: '支付宝手机网站支付',
    value: 'ALIPAY_WAP',
  },
  {
    label: '支付宝网页及时到账支付',
    value: 'ALIPAY_WEB',
  },
  {
    label: '微信公众号支付',
    value: 'WEIXIN_JSAPI',
  },
  {
    label: '微信扫码支付',
    value: 'WEIXIN_NATIVE',
  },
];
