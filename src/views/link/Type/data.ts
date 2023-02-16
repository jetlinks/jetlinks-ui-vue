export const FormStates = {
    name: '',
    type: 'UDP',
    shareCluster: true,
    parserType: '',
    configuration: {
        port: '',
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
            length: '',
            offset: '',
            little: '',
        },
    },
    description: '',
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
    // configuration: {
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
    // certId: '',
    // privateKeyAlias: '',
    clientId: ['MQTT_CLIENT'],
    // parserConfiguration: {
    delimited: ['DELIMITED'],
    lang: ['SCRIPT'],
    script: ['SCRIPT'],
    size: ['FIXED_LENGTH'],
    length: ['LENGTH_FIELD'],
    offset: ['LENGTH_FIELD'],
    little: ['LENGTH_FIELD'],
    // },

    // },
};

export const ParserTypeOptions = [
    { value: 'DIRECT', label: '不处理' },
    { value: 'DELIMITED', label: '分隔符' },
    { value: 'SCRIPT', label: '自定义脚本' },
    { value: 'FIXED_LENGTH', label: '固定长度' },
    { value: 'LENGTH_FIELD', label: '长度字段' },
];

export const isVisible = (LastName: string, dependencies: string | boolean) =>
    VisibleData[LastName].includes(dependencies);
