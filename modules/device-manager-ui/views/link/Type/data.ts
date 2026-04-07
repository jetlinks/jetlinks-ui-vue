import i18n from "@jetlinks-web-core/locales";
export const ParserConfiguration = {
    delimited: '',
    lang: '',
    script: '',
    size: '',
    length: '4',
    offset: undefined,
    little: undefined,
};

export const Configuration = {
    parserType: undefined,
    port: undefined,
    host: undefined,
    publicPort: '',
    publicHost: '',
    remoteHost: '',
    remotePort: '',
    secure: false,
    username: '',
    password: '',
    topicPrefix: '',
    maxMessageSize: 8192,
    certId: undefined,
    privateKeyAlias: '',
    clientId: '',
    parserConfiguration: ParserConfiguration,
};

export const FormStates = {
    name: '',
    type: '',
    shareCluster: true,
    description: '',
};

export const FormStates2 = {
    serverId: undefined,
    configuration: Configuration,
};

export const TCPList = [
    'TCP_SERVER',
    'WEB_SOCKET_SERVER',
    'HTTP_SERVER',
    'MQTT_SERVER',
];
export const UDPList = ['UDP', 'COAP_SERVER'];

const VisibleMost = [
    'COAP_SERVER',
    'MQTT_SERVER',
    'WEB_SOCKET_SERVER',
    'TCP_SERVER',
    'UDP',
    'HTTP_SERVER',
];

export const VisibleData = {
    parserType: ['TCP_SERVER'],
    port: VisibleMost,
    host: VisibleMost,
    publicPort: VisibleMost,
    publicHost: VisibleMost,
    serverId: ['MQTT_CLIENT'],
    remoteHost: ['MQTT_CLIENT'],
    remotePort: ['MQTT_CLIENT'],
    secure: ['UDP', 'COAP_SERVER'],
    username: ['MQTT_CLIENT'],
    password: ['MQTT_CLIENT'],
    topicPrefix: ['MQTT_CLIENT'],
    maxMessageSize: ['MQTT_SERVER', 'MQTT_CLIENT'],
    clientId: ['MQTT_CLIENT'],
    delimited: ['DELIMITED'],
    lang: ['SCRIPT'],
    script: ['SCRIPT'],
    size: ['FIXED_LENGTH'],
    length: ['LENGTH_FIELD'],
    offset: ['LENGTH_FIELD'],
    little: ['LENGTH_FIELD'],
};

export const ParserTypeOptions = [
    { value: 'DIRECT', label: i18n.global.t('Type.data.652947-0') },
    { value: 'DELIMITED', label: i18n.global.t('Type.data.652947-1') },
    { value: 'SCRIPT', label: i18n.global.t('Type.data.652947-2') },
    { value: 'FIXED_LENGTH', label: i18n.global.t('Type.data.652947-3') },
    { value: 'LENGTH_FIELD', label: i18n.global.t('Type.data.652947-4') },
];
export const LengthOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '8', label: '8' },
];
export const LittleOptions = [
    { label: i18n.global.t('Type.data.652947-5'), value: 'false' },
    { label: i18n.global.t('Type.data.652947-6'), value: 'true' },
];

export const isVisible = (
    LastName: string,
    dependencies: string | boolean | undefined,
) => VisibleData[LastName].includes(dependencies);

export const Validator = {
    regIpv4: new RegExp(
        /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))\.){3}(([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
    ),
    regIPv6: new RegExp(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/),
    regDomain: new RegExp(
        // /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
      /^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
    ),
    regOnlyNumber: new RegExp(/^\d+$/),
};

const validateAddress = (_rule: any, value: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const _domainStr = value
        const _domain = _domainStr.replace(/^(https?|ftp):\/\/(www\.)?/i, '')
        if (
            Validator.regIpv4.test(value) ||
            Validator.regIPv6.test(value) ||
            Validator.regDomain.test(_domain)
        ) {
            return resolve('');
        } else {
            return value ? reject(i18n.global.t('Type.data.652947-7')) : resolve('');
        }
    });
};

const sizeValidator = (_rule:any, value: number):Promise<any> =>{
    return new Promise(async(resolve,reject)=>{
        const posReg = /^[1-9]\d*$/;
        // 38819 可以输入0
        if(posReg.test(value.toString()) && value >= 0 && value <=65535 ){
            return resolve('');
        }else {
            return reject(_rule.message);
        }
    })
}
export const Rules = {
    name: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-8'),
        },
        {
            max: 64,
            message: i18n.global.t('Type.data.652947-9'),
        },
    ],
    type: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-10'),
        },
    ],
    shareCluster: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-11'),
        },
    ],
    serverId: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-12'),
        },
    ],
    host: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-13'),
        },
    ],
    port: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-14'),
        },
    ],
    publicHost: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-15'),
        },
        {
            validator: validateAddress,
            message: i18n.global.t('Type.data.652947-7'),
        },
    ],
    publicPort: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-16'),
        },
        {
            pattern: Validator.regOnlyNumber,
            message: i18n.global.t('Type.data.652947-17'),
        },
    ],
    remoteHost: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-18'),
        },
        {
            validator: validateAddress,
            message: i18n.global.t('Type.data.652947-19'),
        },
    ],
    remotePort: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-20'),
        },
        {
            pattern: Validator.regOnlyNumber,
            message: i18n.global.t('Type.data.652947-17'),
        },
    ],
    clientId: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-21'),
        },
        {
            max: 64,
            message: i18n.global.t('Type.data.652947-9'),
        },
    ],
    username: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-22'),
        },
        {
            max: 64,
            message: i18n.global.t('Type.data.652947-9'),
        },
    ],
    password: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-23'),
        },
        {
            max: 64,
            message: i18n.global.t('Type.data.652947-9'),
        },
    ],
    topicPrefix: [
        {
            max: 64,
            message: i18n.global.t('Type.data.652947-9'),
        },
    ],
    maxMessageSize: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-24'),
        },
    ],
    secure: [
        {
            required: true,
        },
    ],
    certId: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-25'),
        },
    ],
    privateKeyAlias: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-26'),
        },
        {
            max: 64,
            message: i18n.global.t('Type.data.652947-9'),
        },
    ],
    parserType: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-27'),
        },
    ],
    delimited: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-28'),
        },
        {
            max: 64,
            message: i18n.global.t('Type.data.652947-9'),
        },
    ],
    lang: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-29'),
        },
        {
            max: 64,
            message: i18n.global.t('Type.data.652947-9'),
        },
    ],
    script: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-30'),
        },
    ],
    size: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-31'),
        },
        {
            validator:sizeValidator,
            message:i18n.global.t('Type.data.652947-32'),
            trigger:'change'
        }
    ],
    length: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-33'),
        },
    ],
    offset: [
        {
            pattern: Validator.regOnlyNumber,
            message: i18n.global.t('Type.data.652947-34'),
        },
    ],
    tagsFilter: [
        {
            required: true,
            message: i18n.global.t('Type.data.652947-12'),
        },
        {
          validator: (_rule: any, value: any) => {
            if (value?.length === 0) {
              return Promise.reject(i18n.global.t('Type.data.652947-12'));
            }
            return Promise.resolve();
          },
        }
    ]
};
