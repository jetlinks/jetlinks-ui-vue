import { IDiagnoseItem } from '@/views/device/OfflineManage/typings';

export const columnsConf = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: false,
        search: {
            type: 'string',
        },
    },
    {
        title: '采集模型',
        dataIndex: 'model',
        key: 'model',
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                {
                    label: '年卡',
                    text: '年卡',
                    value: 'year',
                },
                {
                    label: '季卡',
                    text: '季卡',
                    value: 'season',
                },
                {
                    label: '月卡',
                    text: '月卡',
                    value: 'month',
                },
                {
                    label: '其他',
                    text: '其他',
                    value: 'other',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
        scopedSlots: true,
    },
    {
        title: '设备类型',
        dataIndex: 'deviceType',
        key: 'deviceType',
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                {
                    label: '直连设备',
                    // text: '直连设备',
                    value: 'device',
                },
                {
                    label: '网关设备',
                    // text: '季卡',
                    value: 'gateway',
                },
                {
                    label: '网关子设备',
                    // text: '月卡',
                    value: 'childrenDevice',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '离线时间',
        dataIndex: 'offlineTime',
        key: 'offlineTime',
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        // search: {
        //     type: 'select',
        //     options: [
        //         { label: '在线', text: '在线', value: 'online' },
        //         { label: '离线', text: '离线', value: 'offline' },
        //         { label: '异常', text: '异常', value: 'abnormal' },
        //     ],
        // },
        scopedSlots: true,
    },
    {
        title: '离线原因',
        dataIndex: 'offlineReason',
        key: 'offlineReason',
        ellipsis: true,
        search: {
            type: 'string',
        },
        scopedSlots: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 100,
        // fixed: 'right',
        scopedSlots: true,
    },
];

export const mockData = {
    status: 200,
    code: 200,
    message: 'success',
    result: {
        data: [
            {
                id: '2002000481',
                photoUrl:
                    'http://47.108.154.43:9100/images/device/instance/device-card.png',
                name: '2002000481',
                deviceType: {
                    text: '直连设备',
                    value: 'device',
                },
                productId: '1794397450438037504',
                productName: '企标',
                state: {
                    text: '离线',
                    value: 'offline',
                },
                creatorId: '1199596756811550720',
                creatorName: '超级管理员',
                createTime: 1721900849098,
                registryTime: 1721900850968,
                features: [],
                modifyTime: 1721901829975,
                modifierId: '1199596756811550720',
                modifierName: '超级管理员',
            },
            {
                id: '3030000022',
                name: '3030000022',
                deviceType: {
                    text: '直连设备',
                    value: 'device',
                },
                productId: 'unknowndevice',
                productName: '企标自注册设备',
                configuration: {},
                state: {
                    text: '在线',
                    value: 'online',
                },
                creatorId: '1199596756811550720',
                createTime: 1721376675088,
                registryTime: 1721376675084,
                features: [],
                modifyTime: 1721785089606,
                modifierId: '1199596756811550720',
                modifierName: '超级管理员',
            },
            {
                id: 'L54110400R43J1739',
                name: 'L54110400R43J1739',
                deviceType: {
                    text: '直连设备',
                    value: 'device',
                },
                productId: 'national_environmental_model',
                productName: '国标',
                configuration: {},
                state: {
                    text: '离线',
                    value: 'offline',
                },
                creatorId: '1199596756811550720',
                createTime: 1721108824084,
                registryTime: 1721108824079,
                features: [],
                modifyTime: 1721120676931,
                modifierId: '1199596756811550720',
                modifierName: '超级管理员',
            },
            {
                id: 'L54110400R43J1738',
                name: 'L54110400R43J1738',
                deviceType: {
                    text: '直连设备',
                    value: 'device',
                },
                productId: 'national_environmental_model',
                productName: '国标',
                configuration: {},
                state: {
                    text: '离线',
                    value: 'offline',
                },
                creatorId: '1199596756811550720',
                createTime: 1721108821796,
                registryTime: 1721108821789,
                features: [],
                modifyTime: 1721706996471,
                modifierId: '1199596756811550720',
                modifierName: '超级管理员',
            },
            {
                id: 'L54110400R43J1737',
                name: 'L54110400R43J1737',
                deviceType: {
                    text: '直连设备',
                    value: 'device',
                },
                productId: 'national_environmental_model',
                productName: '国标',
                configuration: {},
                state: {
                    text: '离线',
                    value: 'offline',
                },
                creatorId: '1199596756811550720',
                createTime: 1721108819946,
                registryTime: 1721108819940,
                features: [],
                modifyTime: 1721706773438,
                modifierId: '1199596756811550720',
                modifierName: '超级管理员',
            },
            {
                id: 'L54110400R43J1736',
                name: 'L54110400R43J1736',
                deviceType: {
                    text: '直连设备',
                    value: 'device',
                },
                productId: 'national_environmental_model',
                productName: '国标',
                configuration: {},
                state: {
                    text: '离线',
                    value: 'offline',
                },
                creatorId: '1199596756811550720',
                createTime: 1721108817684,
                registryTime: 1721108817678,
                features: [],
                modifyTime: 1721706767410,
                modifierId: '1199596756811550720',
                modifierName: '超级管理员',
            },
        ],
    },
};

interface Props {
    title: string;
    desc: string;
    additional: string[];
    status: 'loading' | 'pass' | 'fail' | 'unknown';
}

export const diagnoseList: Props[] = [
    {
        title: '产品状态',
        desc: '诊断产品状态是否已发布，未发布状态将导致连接失败',
        additional: [
            '产品未发布。请发布产品，尝试重新连接。/产品未发布。请联系管理员处理。',
        ],

        status: 'loading',
    },
    {
        title: '设备接入配置',
        desc: '诊断设备接入配置是否正确，配置错误将导致连接失败',
        additional: [
            '请检查设备接入配置是否已正确填写/请联系管理员检查设备接入配置/请进行人工检查设备接入配置是否已填写正确',
        ],
        status: 'loading',
    },
    {
        title: '设备接入状态',
        desc: '诊断设备状态是否正常，禁用状态将导致连接失败',
        additional: [
            '设备未启用。请启用设备，尝试重新连接。/设备未启用。请联系管理员处理。',
        ],
        status: 'loading',
    },
    {
        title: '实例信息配置',
        desc: '诊断设备实例信息配置是否正确，配置错误将导致连接失败',
        additional: [
            '请检查设备实例信息配置是否已正确填写/请联系管理员检查实例信息配置',
        ],
        status: 'loading',
    },
    {
        title: '设备接入网关状态',
        desc: '诊断设备接入网关配置状态是否正常，禁用状态将导致连接失败',
        additional: [
            '设备接入网关未启用。请启用设备接入网关，尝试重新连接。/设备接入网关未启用。请联系管理员处理。',
        ],
        status: 'loading',
    },
    {
        title: '网络信息',
        desc: '诊断网络组件配置是否正确，配置错误将导致连接失败',
        additional: [
            '网络组件未启用。请启用网络组件，尝试重新连接。/网络组件未启用。请联系管理员处理。',
            '请检查服务器端口是否开放，如未开放，请开放后，尝试重新连接。',
            '请检查服务器防火墙策略，如有开启防火墙，请关闭防火墙获调整防火墙策略后重试',
        ],
        status: 'loading',
    },
    {
        title: '其他可能异常',
        desc: '当以上诊断均无异常时，请检查以下内容',
        additional: [
            '产品-${MQTT认证配置}规则可能有加密处理，请认真查看设备接入配置中【消息协议】说明',
            '设备-${MQTT认证配置}规则可能有加密处理，请认真查看设备接入配置中【消息协议】说明',
            '请根据设备接入配置中${URL}信息，任意上报一条数据',
            '协议设备请检查电池电量是否充足',
            '其他设备请检查是否存在网络通信故障',
        ],
        status: 'loading',
    },
];

const diagnoseNetwork: IDiagnoseItem = {
    diagnoseType: 'network',
    title: '网络组件',
    desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
    additional: [],
    status: 'loading',
};

const diagnoseGateway: IDiagnoseItem = {
    diagnoseType: 'gateway',
    title: '设备接入网关',
    desc: '诊断设备接入网关配置状态是否正常，禁用状态将导致设备连接失败',
    additional: [],
    status: 'loading',
};

const diagnoseProduct: IDiagnoseItem = {
    diagnoseType: 'product',
    title: '物模型状态',
    desc: '诊断物模型状态是否正常，禁用状态将导致设备连接失败',
    additional: [],
    status: 'loading',
};

const diagnoseDevice: IDiagnoseItem = {
    diagnoseType: 'device',
    title: '设备状态',
    desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
    additional: [],
    status: 'loading',
};

const diagnoseProductAuth: IDiagnoseItem = {
    diagnoseType: 'product-auth',
    title: '物模型认证',
    desc: '诊断物模型认证配置是否正确，错误的配置将导致连接失败',
    additional: [],
    status: 'loading',
};

const diagnoseDeviceAuth: IDiagnoseItem = {
    diagnoseType: 'device-auth',
    title: '设备认证',
    desc: '诊断设备认证配置是否正确，错误的配置将导致连接失败',
    additional: [],
    status: 'loading',
};

const diagnoseParentDevice: IDiagnoseItem = {
    diagnoseType: 'parent-device',
    title: '网关父设备',
    desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
    additional: [],
    status: 'loading',
};

const diagnoseCTWing: IDiagnoseItem = {
    diagnoseType: 'ctwing',
    title: '设备-CTWing配置',
    desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
    additional: [],
    status: 'loading',
};

const diagnoseOnenet: IDiagnoseItem = {
    diagnoseType: 'onenet',
    title: '设备-OneNet配置',
    desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
    additional: [],
    status: 'loading',
};

export const diagnoseNetworkDevice = [
    diagnoseNetwork,
    diagnoseGateway,
    diagnoseProduct,
    diagnoseDevice,
    diagnoseProductAuth,
    diagnoseDeviceAuth,
];

export const diagnoseChildDevice = [
    diagnoseGateway,
    diagnoseParentDevice,
    diagnoseProduct,
    diagnoseDevice,
    diagnoseProductAuth,
    diagnoseDeviceAuth,
];

export const diagnoseMediaDevice = [
    diagnoseGateway,
    diagnoseProduct,
    diagnoseDevice,
];

export const diagnoseCloudDevice = [
    diagnoseGateway,
    diagnoseProduct,
    diagnoseDevice,
    diagnoseCTWing,
    diagnoseOnenet,
];
