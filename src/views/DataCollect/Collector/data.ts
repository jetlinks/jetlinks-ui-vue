export const colorMap = new Map();
colorMap.set('running', 'success');
colorMap.set('partialError', 'warning');
colorMap.set('partError', 'warning'); // 部分错误
colorMap.set('failed', 'error');
colorMap.set('allError', 'error'); // 全部错误
colorMap.set('stopped', 'default');
colorMap.set('processing', '#cccccc');
colorMap.set('enabled', 'processing');
colorMap.set('disabled', 'error');

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

export const regOnlyNumber = new RegExp(/^\d+$/);

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
            message: '请输入0-999999之间的正整数',
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
            message: '请输入自定义数据区长度(byte)',
        },
    ],
    interval: [
        {
            required: true,
            message: '请输入采集频率',
        },
        {
            pattern: regOnlyNumber,
            message: '请输入0或者正整数',
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
        {
            pattern: regOnlyNumber,
            message: '请输入0或者正整数',
        },
    ],
    description: [{ max: 200, message: '最多可输入200个字符' }],
};

export const LeftTreeRules = {
    channelId: [{ required: true, message: '请选择所属通道', trigger: 'blur' }],
    name: [
        { required: true, message: '请输入采集器名称', trigger: 'blur' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    unitId: [
        { required: true, message: '请输入从机地址', trigger: 'blur' },
        {
            pattern: regOnlyNumber,
            message: '请输入0-255之间的正整数',
        },
    ],
    type: [{ required: true, message: '请选择处理方式', trigger: 'blur' }],
    endian: [
        { required: true, message: '请选择双字高低位切换', trigger: 'blur' },
    ],
    endianIn: [
        { required: true, message: '请选择单字高低位切换', trigger: 'blur' },
    ],
    requsetTimeout:[
        { pattern: /^\d+$/, message:'请输入2000-60000的正整数',trigger: 'change'}
    ]
};

export const FormTableColumns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 140,
        fixed: 'left',
    },
    {
        title: 'nodeId',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        ellipsis: true,
    },
    {
        title: '访问类型',
        dataIndex: 'accessModes',
        key: 'accessModes',
        width: 260,
    },
    {
        title: '采集频率',
        key: 'interval',
        dataIndex: 'interval',
        width: 200,
    },
    {
        title: '只推送变化的数据',
        key: 'features',
        dataIndex: 'features',
        width: 140,
    },
    {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
        width: 50,
    },
];
