export const colorMap = new Map();
colorMap.set('running', 'success');
colorMap.set('partialError', 'warning');
colorMap.set('failed', 'error');
colorMap.set('stopped', 'default');
colorMap.set('processing', '#cccccc');

export const getState = (record: any) => {
    const enabled = record?.state?.value === 'enabled';
    if (record) {
        return {
            value: enabled ? record?.runningState?.value : 'processing',
            text: enabled ? record?.runningState?.text : '禁用',
        };
    } else {
        return {};
    }
};

const regOnlyNumber = new RegExp(/^\d+$/);

export const checkProviderData = {
    int8: 1,
    int16: 2,
    int32: 4,
    int64: 8,
    ieee754_float: 4,
    ieee754_double: 8,
    hex: 1,
};

export const ModBusRules = {
    name: [
        {
            required: true,
            message: '请输入点位名称',
        },
        {
            max: 64,
            message: '最多可输入64个字符',
        },
    ],
    function: [
        {
            required: true,
            message: '请选择功能码',
        },
    ],
    pointKey: [
        {
            required: true,
            message: '请输入地址',
        },
        {
            pattern: regOnlyNumber,
            message: '请输入0-255之间的正整数',
        },
    ],
    quantity: [
        {
            required: true,
            message: '请输入寄存器数量',
        },
        {
            pattern: regOnlyNumber,
            message: '请输入1-255之间的正整数',
        },
    ],
    provider: [
        {
            required: true,
            message: '请选择数据类型',
        },
    ],
    scaleFactor: [
        {
            required: true,
            message: '请输入缩放因子',
        },
    ],
    accessModes: [
        {
            required: true,
            message: '请选择访问类型',
        },
    ],
    writeByteCount: [
        {
            required: true,
            message: '请选择是否写入数据区长度',
        },
    ],
    byteCount: [
        {
            required: true,
            message: '请输入自定义数据区长度（byte）',
        },
    ],
    interval: [
        {
            required: true,
            message: '请输入采集频率',
        },
    ],

    description: [{ max: 200, message: '最多可输入200个字符' }],
};

export const OPCUARules = {
    name: [
        {
            required: true,
            message: '请输入点位名称',
        },
        {
            max: 64,
            message: '最多可输入64个字符',
        },
    ],

    type: [
        {
            required: true,
            message: '请选择数据类型',
        },
    ],

    accessModes: [
        {
            required: true,
            message: '请选择访问类型',
        },
    ],

    interval: [
        {
            required: true,
            message: '请输入采集频率',
        },
    ],

    description: [{ max: 200, message: '最多可输入200个字符' }],
};
