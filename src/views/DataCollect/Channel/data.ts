import { validateField } from '@/api/data-collect/channel';
import { FormDataType } from './type.d';
import type { Rule } from 'ant-design-vue/lib/form';

export const FormState: FormDataType = {
    name: '',
    provider: undefined,
    configuration: {
        host: '',
        port: '502',
        endpoint: '',
        securityPolicy: 'None',
        securityMode: undefined,
        certId: undefined,
        authType: 'anonymous',
        username: '',
        password: '',
        deviceId: undefined,
        deviceName: undefined,
        connect:false,
    },
    description: '',
};

export const StatusColorEnum = {
    running: 'success',
    disabled: 'error',
    partialError: 'processing',
    failed: 'warning',
    stopped: 'default',
};
export const updateStatus = {
    disabled: {
        state: 'enabled',
        runningState: 'running',
    },
    enabled: {
        state: 'disabled',
        runningState: 'stopped',
    },
};

export const regOnlyNumber = new RegExp(/^\d+$/);

export const regIP = new RegExp(
    /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
);
export const regIPv6 = new RegExp(
    /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
);
export const regDomain = new RegExp(
    /([0-9a-z-]{2,}\.[0-9a-z-]{2,3}\.[0-9a-z-]{2,3}|[0-9a-z-]{2,}\.[0-9a-z-]{2,3})$/i,
);
export const checkEndpoint = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if(!value) return resolve('');
        const res: any = await validateField(value);
        return res.result.passed ? resolve('') : reject(res.result.reason);
    });

export const checkHost = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if(!value) return resolve('');
        if(!(regIP.test(value) || regIPv6.test(value) || regDomain.test(value))) {
            return reject('请输入正确格式的Modbus主机IP地址')
        }
        return resolve('')
    });
export const FormValidate = {
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    provider: [{ required: true, message: '请选择通讯协议' }],
    host: [
        {
            required: true,
            message: '请输入Modbus主机IP',
        },
        {
            validator: checkHost,
            trigger: 'blur',
            // message: '请输入正确格式的Modbus主机IP地址',
        },
    ],
    port: [
        {
            required: true,
            message: '请输入端口',
        },
        {
            pattern: regOnlyNumber,
            message: '请输入0-65535之间的正整数',
        },
    ],

    endpoint: [
        {
            required: true,
            message: '请输入端点url',
        },
        {
            validator: checkEndpoint,
            trigger: 'blur',
        },
    ],

    securityPolicy: [
        {
            required: true,
            message: '请选择安全策略',
        },
    ],
    securityMode: [
        {
            required: true,
            message: '请选择安全模式',
        },
    ],
    certId: [
        {
            required: true,
            message: '请选择证书',
        },
    ],
    authType: [
        {
            required: true,
            message: '请选择权限认证',
        },
    ],
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { max: 64, message: '最多可输入64个字符' },
    ],

    description: [{ max: 200, message: '最多可输入200个字符' }],
};
export const columns = [
    {
        title: '通道名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '通讯协议',
        dataIndex: 'provider',
        key: 'provider',
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                { label: 'OPC_UA', value: 'OPC_UA' },
                { label: 'MODBUS_TCP', value: 'MODBUS_TCP' },
            ],
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '正常', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
            ],
        },
    },
    {
        title: '运行状态',
        dataIndex: 'runningState',
        key: 'runningState',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '运行中', value: 'running' },
                { label: '部分错误', value: 'partialError' },
                { label: '错误', value: 'failed' },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];
