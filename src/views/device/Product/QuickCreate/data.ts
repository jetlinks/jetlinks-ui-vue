const typeMap = new Map([
    ['int','int(整数型)'],
    ['long','long(长整型)'],
    ['float','float(单精度浮点型)'],
    ['double','double(双精度浮点数)'],
    ['string','text(字符串)'],
    ['boolean','boolean(布尔型)'],
    ['date','date(时间型)'],
    ['enum','enum(枚举)'],
    ['array','array(数组)'],
    ['object','object(结构体)'],
    ['file','file(文件)'],
    ['password','password(密码)'],
    ['geoPoint','geoPoint(地理位置)']
])

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
            return value ? reject('请输入正确的IP地址或者域名') : resolve('');
        }
    });
};

const sizeValidator = (_rule:any, value: number):Promise<any> =>{
    return new Promise(async(resolve,reject)=>{
        const posReg = /^[1-9]\d*$/;
        if(posReg.test(value.toString()) && value > 0 && value <=65535 ){
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
            message: '请输入名称',
        },
        {
            max: 64,
            message: '最多可输入64个字符',
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
    serverId: [
        {
            required: true,
            message: '请选择节点名称',
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
            validator: validateAddress,
            message: '请输入正确的IP地址或者域名',
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
            validator: validateAddress,
            message: '请输入正确格式的域名或ip',
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
            message: '最多可输入64个字符',
        },
    ],
    username: [
        {
            required: true,
            message: '请输入用户名',
        },
        {
            max: 64,
            message: '最多可输入64个字符',
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
        },
        {
            max: 64,
            message: '最多可输入64个字符',
        },
    ],
    topicPrefix: [
        {
            max: 64,
            message: '最多可输入64个字符',
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
            message: '最多可输入64个字符',
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
            message: '最多可输入64个字符',
        },
    ],
    lang: [
        {
            required: true,
            message: '请选择脚本语言',
        },
        {
            max: 64,
            message: '最多可输入64个字符',
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
        {
            validator:sizeValidator,
            message:'请输入0~65535之间的正整数',
            trigger:'change'
        }
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


export const ProvideTypeMap = new Map([
    ['fixed-media', 'media'],
    ['gb28181-2016', 'media'],
    ['onvif', 'media'],
    ['media-plugin', 'media'],
    // ['OneNet', 'cloud'],
    ['OneNet-platform', 'cloud'],
    ['Ctwing', 'cloud'],
    ['modbus-tcp', 'channel'],
    ['opc-ua', 'channel'],
    ['official-edge-gateway', 'edge'],
    ['edge-child-device', 'edge'],
    ['network', 'network'],
    ['agent-device-gateway','network'],
    ['agent-media-device-gateway','network']
]);

export const NetworkTypeMapping = new Map();
NetworkTypeMapping.set('websocket-server', 'WEB_SOCKET_SERVER');
NetworkTypeMapping.set('http-server-gateway', 'HTTP_SERVER');
NetworkTypeMapping.set('udp-device-gateway', 'UDP');
NetworkTypeMapping.set('coap-server-gateway', 'COAP_SERVER');
NetworkTypeMapping.set('mqtt-client-gateway', 'MQTT_CLIENT');
NetworkTypeMapping.set('mqtt-server-gateway', 'MQTT_SERVER');
NetworkTypeMapping.set('tcp-server-gateway', 'TCP_SERVER');
NetworkTypeMapping.set('official-edge-gateway', 'MQTT_SERVER');
NetworkTypeMapping.set('agent-device-gateway', 'MQTT_SERVER');
NetworkTypeMapping.set('agent-media-device-gateway', 'MQTT_SERVER');


export const gatewayType = new Map([
    ["mqtt-server-gateway","mqtt_server_gateway"],
    ["mqtt-client-gateway","mqtt_client_gateway"],
    ["coap-server-gateway","coap_server_gateway"],
    ["tcp-server-gateway","tcp_server_gateway"],
    ["udp-device-gateway","udp_device_gateway"],
    ["http-server-gateway","http_server_gateway"],
    ["websocket-server","websocket_server"],
    ["plugin_gateway","plugin_gateway"],
    ["child-device","child_device"],
    ["fixed-media","fixed_media"],
    ["onvif","onvif"],
    ["gb28181-2016","gb28181_2016"],
    ["media-plugin","media_plugin"],
    ["OneNet-platform","oneNet_platform"],
    ["Ctwing","ctwing"],
    ["collector-gateway","collector_gateway"],
    ["agent-device-gateway","agent_device_gateway"],
    ["agent-media-device-gateway","agent_media_device_gateway"],
]);


export default typeMap