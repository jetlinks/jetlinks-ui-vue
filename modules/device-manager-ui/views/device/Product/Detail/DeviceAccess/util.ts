//引导页数据
export const steps = [
  {
    element: '.objectModel',
    popover: {
      className: 'driver',
      title: `<div id='title'>配置物模型</div><div id='guide'>1/3</div>`,
      description: `配置产品物模型，实现设备在云端的功能描述。`,
      position: 'bottom',
    },
  },
  {
    element: '.ant-switch',
    popover: {
      className: 'driver',
      title: `<div id='title'>启用产品</div><div id='guide'>2/3</div>`,
      description: '启用产品后，可在产品下新增设备。',
      position: 'bottom',
    },
  },
  {
    element: '.ant-descriptions-item-label',
    popover: {
      className: 'driver',
      title: `<div id='title'>添加设备</div><div id='guide'>3/3</div>`,
      description: '添加设备，并连接到平台。',
      position: 'bottom',
    },
  },
];

export const steps1 = [
  {
    element: '.config',
    popover: {
      className: 'driver',
      title: `<div id='title'>填写配置</div><div id='guide'>1/4</div>`,
      description: `填写设备接入所需的配置参数。`,
      position: 'right',
    },
  },
  {
    element: '.objectModel',
    popover: {
      className: 'driver',
      title: `<div id='title'>配置物模型</div><div id='guide'>2/4</div>`,
      description: `配置产品物模型，实现设备在云端的功能描述。`,
      position: 'bottom',
    },
  },
  {
    element: '.ant-switch',
    popover: {
      className: 'driver',
      title: `<div id='title'>启用产品</div><div id='guide'>3/4</div>`,
      description: '启用产品后，可在产品下新增设备。',
      position: 'bottom',
    },
  },
  {
    element: '.ant-descriptions-item-label',
    popover: {
      className: 'driver',
      title: `<div id='title'>添加设备</div><div id='guide'>4/4</div>`,
      description: '添加设备，并连接到平台。',
      position: 'bottom',
    },
  },
];