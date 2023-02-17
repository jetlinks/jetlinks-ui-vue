const configuration = {
    parserType: undefined,
    port: undefined,
    host: '0.0.0.0',
    publicPort: '',
    publicHost: '',
    remoteHost: '',
    remotePort: '',
    secure: false,
    username: '',
    password: '',
    topicPrefix: '',
    maxMessageSize: '',
    certId: '',
    privateKeyAlias: '',
    clientId: '',
    parserConfiguration: {
        delimited: '',
        lang: '',
        script: '',
        size: '',
        length: '4',
        offset: '0',
        little: 'false',
    },
};

export const FormStates = {
    name: '',
    type: 'UDP',
    shareCluster: true,
    // configuration,
    description: '',
};

export const FormStates2 = {
    serverId: undefined,
    configuration,
};



// export const DefaultCluster = {

// }
export const DefaultFormStates = {
    ...FormStates,
    cluster: [{ ...FormStates2, id: 1 }],
};

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
    remoteHost: ['MQTT_CLIENT'],
    remotePort: ['MQTT_CLIENT'],
    secure: ['TCP_SERVER', 'UDP', 'COAP_SERVER'],
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
    secureSpan12: ['MQTT_CLIENT', 'MQTT_SERVER'],
};

export const ParserTypeOptions = [
    { value: 'DIRECT', label: '不处理' },
    { value: 'DELIMITED', label: '分隔符' },
    { value: 'SCRIPT', label: '自定义脚本' },
    { value: 'FIXED_LENGTH', label: '固定长度' },
    { value: 'LENGTH_FIELD', label: '长度字段' },
];
export const LengthOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '8', label: '8' },
];
export const LittleOptions = [
    { label: '大端', value: 'false' },
    { label: '小端', value: 'true' },
];

export const isVisible = (
    LastName: string,
    dependencies: string | boolean | undefined,
) => VisibleData[LastName].includes(dependencies);

export const Validator = {
    regIp: new RegExp(
        /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/,
    ),
    regDomain: new RegExp(
        /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/,
    ),
    regOnlyNumber: new RegExp(/^\d+$/),
};
