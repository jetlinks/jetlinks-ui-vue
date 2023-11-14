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
export const regular = {
    // IPV4 IPV6 域名
    IP_Domain: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/,
    // IP地址
    IP_URL: /^((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))(\.((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))){3}$/,
    // 英文或者数字或者-或者_
    EN_NUMBER: /^[A-Za-z0-9_-]+$/,
    // 服务器地址
    HTTP_URL: /^http:|https:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
    // 域名
    DOMAIN_NAME: /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9-\.]){1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/,
    // 数字
    // NUMBER: /^[0-9]*[1-9][0-9]*$/,
    NUMBER: /^([1-9]\d*|[0]{1,1})$/,
    // 正数、负数、小数
    ASSIGNMENT: /^(\-)?\d+(\.\d+)?$/,
    //密码验证
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/,
    //IP子网掩码
    IP_MASK: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,2})?$/,
    CronRegEx: new RegExp('^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?)*))$',)
  }

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

const validatorUrl = (rule:any, value:any, callback:any)  => {
    const reg = regular.DOMAIN_NAME
    const reg1 = regular.IP_URL
    if(value === undefined || value === '' || value === null) {
      return Promise.reject("请输入通道Ip")
    } else {
      if(reg.test(value) === false && reg1.test(value) === false) {
        return Promise.reject("请输入正确的域名或ip地址")
      }
      return Promise.resolve()
    }
  }
  /**
 * 校验通道端口
 */
const validator1 = (rule:any, value:any, callback:any)  => {
    if(value === undefined || value === '' || value === null) {
      return Promise.reject("请输入通道端口")
    } else {
      if(value < 0 || value > 65535) {
        return Promise.reject("请输入0~65535的整数")
      }
      return Promise.resolve()
    }
  }
  
  /**
   * 校验机架号
   */
  const validator2 = (rule:any, value:any, callback:any)  => {
    if(value === undefined || value === '' || value === null) {
      return Promise.reject("请输入机架号")
    } else {
      if(value < 0 || value > 65535) {
        return Promise.reject("请输入0~65535的整数")
      }
      return Promise.resolve()
    }
  }
  
  /**
   *  校验槽位
   */
  const validator3 = (rule:any, value:any, callback:any)  => {
    if(value === undefined || value === '' || value === null) {
      return Promise.reject("请输入槽位")
    } else {
      if(value < 0 || value > 65535) {
        return Promise.reject("请输入0~65535的整数")
      }
      return Promise.resolve()
    }
  }
  
  /**
   *  校验超时时间
   */
  const validator4 = (rule:any, value:any, callback:any)  => {
    if(value === undefined || value === '' || value === null) {
      return Promise.reject("请输入超时时间")
    } else {
      if(value < 0 || value > 65535) {
        return Promise.reject("请输入0~65535的整数")
      }
      return Promise.resolve()
    }
  }
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
    // type: [{ required: true, message: '请选择处理方式', trigger: 'blur' }],
    endian: [
        { required: true, message: '请选择双字高低位切换', trigger: 'blur' },
    ],
    endianIn: [
        { required: true, message: '请选择单字高低位切换', trigger: 'blur' },
    ],
    requestTimeout:[
        { pattern: /^\d+$/, message:'请输入2000-60000的正整数',trigger: 'change'}
    ],
    host: [
        { required: true, trigger: 'blur', validator: validatorUrl, },
    ],
    port: [{ required: true, trigger: 'blur' , validator: validator1}],
    rack: [{ required: true, trigger: 'blur', validator: validator2 }],
    slot: [{ required: true, trigger: 'blur', validator: validator3 }],
    timeout: [{ required: true, trigger: 'blur', validator: validator4 }],
    type: [{required: true, trigger: 'change', message: '请选择型号'}],
    serializable: [{required: true, trigger: 'change', message: '请选择型号'}],
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


