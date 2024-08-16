import i18n from '@/i18n'
const $t = i18n.global.t
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
        instanceNumber: undefined,
        overIp: {
            localBindAddress: '0.0.0.0',
            port: 47808
        }
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
            return reject($t('Channel.data.098165-0'))
        }
        return resolve('')
    });
export const FormValidate = {
    name: [
        { required: true, message: $t('Channel.data.098165-1'), trigger: 'blur' },
        { max: 64, message: $t('Channel.data.098165-2') },
    ],
    provider: [{ required: true, message: $t('Channel.data.098165-3') }],
    host: [
        {
            required: true,
            message: $t('Channel.data.098165-4'),
        },
        {
            validator: checkHost,
            trigger: 'blur',
            // message: $t('Channel.data.098165-0'),
        },
    ],
    port: [
        {
            required: true,
            message: $t('Channel.data.098165-5'),
        },
        {
            pattern: regOnlyNumber,
            message: $t('Channel.data.098165-6'),
        },
    ],

    endpoint: [
        {
            required: true,
            message: $t('Channel.data.098165-7'),
        },
        {
            validator: checkEndpoint,
            trigger: 'blur',
        },
    ],

    securityPolicy: [
        {
            required: true,
            message: $t('Channel.data.098165-8'),
        },
    ],
    securityMode: [
        {
            required: true,
            message: $t('Channel.data.098165-9'),
        },
    ],
    certId: [
        {
            required: true,
            message: $t('Channel.data.098165-10'),
        },
    ],
    authType: [
        {
            required: true,
            message: $t('Channel.data.098165-11'),
        },
    ],
    username: [
        { required: true, message: $t('Channel.data.098165-12'), trigger: 'blur' },
        { max: 64, message: $t('Channel.data.098165-2') },
    ],
    password: [
        { required: true, message: $t('Channel.data.098165-13'), trigger: 'blur' },
        { max: 64, message: $t('Channel.data.098165-2') },
    ],

    description: [{ max: 200, message: $t('Channel.data.098165-14') }],
};
export const columns = [
    {
        title: $t('Channel.data.098165-15'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Channel.data.098165-16'),
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
        title: $t('Channel.data.098165-17'),
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Channel.data.098165-18'), value: 'enabled' },
                { label: $t('Channel.data.098165-19'), value: 'disabled' },
            ],
        },
    },
    {
        title: $t('Channel.data.098165-20'),
        dataIndex: 'runningState',
        key: 'runningState',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Channel.data.098165-21'), value: 'running' },
                { label: $t('Channel.data.098165-22'), value: 'partialError' },
                { label: $t('Channel.data.098165-23'), value: 'failed' },
            ],
        },
    },
    {
        title: $t('Channel.data.098165-24'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: $t('Channel.data.098165-25'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];
