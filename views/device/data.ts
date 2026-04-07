import {isNoCommunity} from '@jetlinks-web-core/utils/utils';
import i18n from '@jetlinks-web-core/locales';

export const DataTypeList: { label: string; value: string }[] = [
    {
        value: 'int',
        label: `int(${i18n.global.t('Base.columns.448718-33')})`,
    },
    {
        value: 'long',
        label: `long(${i18n.global.t('Base.columns.448718-34')})`,
    },
    {
        value: 'float',
        label: `float(${i18n.global.t('Base.columns.448718-35')})`,
    },
    {
        value: 'double',
        label: `double(${i18n.global.t('Base.columns.448718-36')})`,
    },
    {
        value: 'string',
        label: `text(${i18n.global.t('Base.columns.448718-37')})`,
    },
    {
        value: 'boolean',
        label: `boolean(${i18n.global.t('Base.columns.448718-38')})`,
    },
    {
        value: 'date',
        label: `date(${i18n.global.t('Base.columns.448718-39')})`,
    },
    {
        value: 'enum',
        label: `enum(${i18n.global.t('Base.columns.448718-40')})`,
    },
    {
        value: 'array',
        label: `array(${i18n.global.t('Base.columns.448718-41')})`,
    },
    {
        value: 'object',
        label: `object(${i18n.global.t('Base.columns.448718-42')})`,
    },
    {
        value: 'file',
        label: `file(${i18n.global.t('Base.columns.448718-43')})`,
    },
    {
        value: 'password',
        label: `password(${i18n.global.t('Base.columns.448718-44')})`,
    },
    {
        value: 'geoPoint',
        label: `geoPoint(${i18n.global.t('Base.columns.448718-45')})`,
    },
];

export const PropertySource: { label: string; value: string }[] = isNoCommunity
    ? [
        {
            value: 'device',
            label: i18n.global.t('device.data.751276-13'),
        },
        {
            value: 'manual',
            label: i18n.global.t('device.data.751276-14'),
        },
        {
            value: 'rule',
            label: i18n.global.t('device.data.751276-15'),
        },
    ]
    : [
        {
            value: 'device',
            label: i18n.global.t('device.data.751276-13'),
        },
        {
            value: 'manual',
            label: i18n.global.t('device.data.751276-14'),
        },
    ];

export const FileTypeList: { label: string; value: string }[] = [
    {
        label: 'URL(链接)',
        value: 'url',
    },
    {
        label: 'Base64(Base64编码)',
        value: 'base64',
    },
    {
        label: 'binary',
        value: 'Binary(二进制)',
    },
];

export const EventLevel: { label: string; value: string }[] = [
    {
        label: i18n.global.t('device.data.751276-19'),
        value: 'ordinary',
    },
    {
        label: i18n.global.t('device.data.751276-20'),
        value: 'warn',
    },
    {
        value: 'urgent',
        label: i18n.global.t('device.data.751276-21'),
    },
];

export const getEventLevelMap = () => {
    return EventLevel.reduce((prev, next) => {
        prev[next.value] = next.label
        return prev
    }, {})
}

export const DateTypeList = [
    // {
    //   label: 'String类型的UTC时间戳 (毫秒)',
    //   value: 'string',
    // },
    {
        label: 'yyyy-MM-dd',
        value: 'yyyy-MM-dd',
    },
    {
        label: 'yyyy-MM-DD HH:mm:ss',
        value: 'yyyy-MM-DD HH:mm:ss',
    },
    // {
    //   label: 'yyyy-MM-dd HH:mm:ss EE',
    //   value: 'yyyy-MM-dd HH:mm:ss EE',
    // },
    // {
    //   label: 'yyyy-MM-dd HH:mm:ss zzz',
    //   value: 'yyyy-MM-dd HH:mm:ss zzz',
    // },
];

export const ExpandsTypeList = [
    {
        label: i18n.global.t('device.data.751276-22'),
        value: 'read',
    },
    {
        label: i18n.global.t('device.data.751276-23'),
        value: 'write',
    },
    {
        label: i18n.global.t('device.data.751276-24'),
        value: 'report',
    },
]


export const deviceStateList = [
    { label: i18n.global.t('Instance.index.133466-7'), value: 'notActive' },
    { label: i18n.global.t('Instance.index.133466-8'), value: 'offline' },
    { label: i18n.global.t('Instance.index.133466-9'), value: 'online' },
]

export const accessType = [
    'mqtt-server-gateway',
    'websocket-server',
    'coap-server-gateway',
    'plugin_gateway',
    'media-plugin',
    'tcp-server-gateway',
    'OneNet-platform',
    'Ctwing',
    'child-device',
    'http-server-gateway',
    'agent-media-device-gateway',
    'fixed-media',
    'udp-device-gateway',
    'onvif',
    'agent-device-gateway',
    'gb28181-2016',
    'collector-gateway',
    'mqtt-client-gateway',
    'OneNet',
    'composite-device-gateway'
]
