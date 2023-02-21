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

export const Rules = {
    name: [
        {
            required: true,
            message: '请输入名称',
        },
        {
            max: 64,
            message: '最大可输入64个字符',
        },
    ],
    type: [
        {
            required: true,
            message: '请选择类型',
        },
    ],
    shareCluster: [
        {
            required: true,
            message: '请选择集群',
        },
    ],
    host: [
        {
            required: true,
            message: '请选择本地地址',
        },
    ],
    port: [
        {
            required: true,
            message: '请选择本地端口',
        },
    ],
    publicHost: [
        {
            required: true,
            message: '请输入公网地址',
        },
        {
            pattern: Validator.regIp || Validator.regDomain,
            message: '请输入IP或者域名',
        },
    ],
    publicPort: [
        {
            required: true,
            message: '请输入公网端口',
        },
        {
            pattern: Validator.regOnlyNumber,
            message: '请输入1-65535之间的正整数',
        },
    ],
    remoteHost: [
        {
            required: true,
            message: '请输入远程地址',
        },
        {
            pattern: Validator.regIp || Validator.regDomain,
            message: '请输入IP或者域名',
        },
    ],
    remotePort: [
        {
            required: true,
            message: '输入远程端口',
        },
        {
            pattern: Validator.regOnlyNumber,
            message: '请输入1-65535之间的正整数',
        },
    ],
    clientId: [
        {
            required: true,
            message: '请输入ClientId',
        },
        {
            max: 64,
            message: '最大可输入64个字符',
        },
    ],
    username: [
        {
            required: true,
            message: '请输入用户名',
        },
        {
            max: 64,
            message: '最大可输入64个字符',
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
        },
        {
            max: 64,
            message: '最大可输入64个字符',
        },
    ],
    topicPrefix: [
        {
            max: 64,
            message: '最大可输入64个字符',
        },
    ],
    maxMessageSize: [
        {
            required: true,
            message: '请输入最大消息长度',
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
            message: '请选择证书',
        },
    ],
    privateKeyAlias: [
        {
            required: true,
            message: '请输入私钥别名',
        },
        {
            max: 64,
            message: '最大可输入64个字符',
        },
    ],
    parserType: [
        {
            required: true,
            message: '请选择粘拆包规则',
        },
    ],
    delimited: [
        {
            required: true,
            message: '请输入分隔符',
        },
        {
            max: 64,
            message: '最大可输入64个字符',
        },
    ],
    lang: [
        {
            required: true,
            message: '请选择脚本语言',
        },
        {
            max: 64,
            message: '最大可输入64个字符',
        },
    ],
    script: [
        {
            required: true,
            message: '请输入脚本',
        },
    ],
    size: [
        {
            required: true,
            message: '请输入长度值',
        },
    ],
    length: [
        {
            required: true,
            message: '请选择长度',
        },
    ],
    offset: [
        {
            pattern: Validator.regOnlyNumber,
            message: '请输入0-65535之间的正整数',
        },
    ],
};
