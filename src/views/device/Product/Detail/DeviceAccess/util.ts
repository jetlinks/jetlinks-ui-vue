import i18n from '@/i18n'
const $t = i18n.global.t
//引导页数据
export const steps = [
  {
    element: '.objectModel',
    popover: {
      className: 'driver',
      title: `<div id='title'>${$t('DeviceAccess.util.064569-0')}</div><div id='guide'>1/3</div>`,
      description:$t('DeviceAccess.util.064569-1'),
      position: 'bottom',
    },
  },
  {
    element: '.ant-switch',
    popover: {
      className: 'driver',
      title: `<div id='title'>${$t('DeviceAccess.util.064569-2')}</div><div id='guide'>2/3</div>`,
      description: $t('DeviceAccess.util.064569-3'),
      position: 'bottom',
    },
  },
  {
    element: '.ant-descriptions-item-label',
    popover: {
      className: 'driver',
      title: `<div id='title'>${$t('DeviceAccess.util.064569-4')}</div><div id='guide'>3/3</div>`,
      description: $t('DeviceAccess.util.064569-5'),
      position: 'bottom',
    },
  },
];

export const steps1 = [
  {
    element: '.config',
    popover: {
      className: 'driver',
      title: `<div id='title'>${$t('DeviceAccess.util.064569-6')}</div><div id='guide'>1/4</div>`,
      description: $t('DeviceAccess.util.064569-7'),
      position: 'right',
    },
  },
  {
    element: '.objectModel',
    popover: {
      className: 'driver',
      title: `<div id='title'>${$t('DeviceAccess.util.064569-0')}</div><div id='guide'>2/4</div>`,
      description: $t('DeviceAccess.util.064569-1'),
      position: 'bottom',
    },
  },
  {
    element: '.ant-switch',
    popover: {
      className: 'driver',
      title: `<div id='title'>${$t('DeviceAccess.util.064569-2')}</div><div id='guide'>3/4</div>`,
      description: $t('DeviceAccess.util.064569-3'),
      position: 'bottom',
    },
  },
  {
    element: '.ant-descriptions-item-label',
    popover: {
      className: 'driver',
      title: `<div id='title'>${$t('DeviceAccess.util.064569-4')}</div><div id='guide'>4/4</div>`,
      description: $t('DeviceAccess.util.064569-5'),
      position: 'bottom',
    },
  },
];