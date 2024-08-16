import i18n from '@/i18n'
const $t = i18n.global.t
import { testIpv4_6 } from '@/utils/validate';
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
            text: enabled ? record?.runningState?.text : $t('Collector.data.321710-0'),
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
            message: $t('Collector.data.321710-1'),
        },
        {
            max: 64,
            message: $t('Collector.data.321710-2'),
        },
    ],
    function: [
        {
            required: true,
            message: $t('Collector.data.321710-3'),
        },
    ],
    pointKey: [
        {
            required: true,
            message: $t('Collector.data.321710-4'),
        },
        {
            pattern: regOnlyNumber,
            message: $t('Collector.data.321710-5'),
        },
    ],
    quantity: [
        {
            required: true,
            message: $t('Collector.data.321710-6'),
        },
        {
            pattern: regOnlyNumber,
            message: $t('Collector.data.321710-7'),
        },
    ],
    provider: [
        {
            required: true,
            message: $t('Collector.data.321710-8'),
        },
    ],
    scaleFactor: [
        {
            required: true,
            message: $t('Collector.data.321710-9'),
        },
    ],
    accessModes: [
        {
            required: true,
            message: $t('Collector.data.321710-10'),
        },
    ],
    writeByteCount: [
        {
            required: true,
            message: $t('Collector.data.321710-11'),
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
            message: $t('Collector.data.321710-13'),
        },
        {
            pattern: regOnlyNumber,
            message: $t('Collector.data.321710-14'),
        },
    ],

    description: [{ max: 200, message: $t('Collector.data.321710-15') }],
};

export const OPCUARules = {
    name: [
        {
            required: true,
            message: $t('Collector.data.321710-1'),
        },
        {
            max: 64,
            message: $t('Collector.data.321710-2'),
        },
    ],
    type: [
        {
            required: true,
            message: $t('Collector.data.321710-8'),
        },
    ],
    accessModes: [
        {
            required: true,
            message: $t('Collector.data.321710-10'),
        },
    ],
    interval: [
        {
            required: true,
            message: $t('Collector.data.321710-13'),
        },
        {
            pattern: regOnlyNumber,
            message: $t('Collector.data.321710-14'),
        },
    ],
    description: [{ max: 200, message: $t('Collector.data.321710-15') }],
};

const validatorUrl = (rule:any, value:any, callback:any)  => {
    const reg = regular.DOMAIN_NAME
    const reg1 = regular.IP_URL
    if(value === undefined || value === '' || value === null) {
      return Promise.reject($t('Collector.data.321710-16'))
    } else {
      if(reg.test(value) === false && reg1.test(value) === false) {
        return Promise.reject($t('Collector.data.321710-17'))
      }
      return Promise.resolve()
    }
  }
  /**
 * 校验通道端口
 */
const validator1 = (rule:any, value:any, callback:any)  => {
    if(value === undefined || value === '' || value === null) {
      return Promise.reject($t('Collector.data.321710-18'))
    } else {
      if(value < 1 || value > 65535) {
        return Promise.reject($t('Collector.data.321710-19'))
      }
      return Promise.resolve()
    }
  }
  
  /**
   * 校验机架号
   */
  const validator2 = (rule:any, value:any, callback:any)  => {
    if(value === undefined || value === '' || value === null) {
      return Promise.reject($t('Collector.data.321710-20'))
    } else {
      if(value < 0 || value > 65535) {
        return Promise.reject($t('Collector.data.321710-21'))
      }
      return Promise.resolve()
    }
  }
  
  /**
   *  校验槽位
   */
  const validator3 = (rule:any, value:any, callback:any)  => {
    if(value === undefined || value === '' || value === null) {
      return Promise.reject($t('Collector.data.321710-22'))
    } else {
      if(value < 0 || value > 65535) {
        return Promise.reject($t('Collector.data.321710-21'))
      }
      return Promise.resolve()
    }
  }
  
  /**
   *  校验超时时间
   */
  const validator4 = (rule:any, value:any, callback:any)  => {
    if(value === undefined || value === '' || value === null) {
      return Promise.reject($t('Collector.data.321710-23'))
    } else {
      if(value < 0 || value > 65535) {
        return Promise.reject($t('Collector.data.321710-21'))
      }
      return Promise.resolve()
    }
  }
  /**
 * 校验官网地址
 */
const validateUrl = async (_rule: any, value: string) => {
    if (!value) {
        return Promise.resolve();
    } else {
        if (!testIpv4_6(value)) {
            return Promise.reject($t('Collector.data.321710-24'));
        }
        return Promise.resolve();
    }
};
export const LeftTreeRules = {
    channelId: [{ required: true, message: $t('Collector.data.321710-25'), trigger: 'blur' }],
    name: [
        { required: true, message: $t('Collector.data.321710-26'), trigger: 'blur' },
        { max: 64, message: $t('Collector.data.321710-2') },
    ],
    unitId: [
        { required: true, message: $t('Collector.data.321710-27'), trigger: 'blur' },
        {
            pattern: regOnlyNumber,
            message: $t('Collector.data.321710-28'),
        },
    ],
    // type: [{ required: true, message: '请选择处理方式', trigger: 'blur' }],
    endian: [
        { required: true, message: $t('Collector.data.321710-29'), trigger: 'blur' },
    ],
    endianIn: [
        { required: true, message: $t('Collector.data.321710-30'), trigger: 'blur' },
    ],
    requestTimeout:[
        { pattern: /^\d+$/, message:$t('Collector.data.321710-31'),trigger: 'change'}
    ],
    host: [
        { required: true, trigger: 'blur', validator: validatorUrl, },
    ],
    port: [{ required: true, trigger: 'blur' , validator: validator1}],
    rack: [{ required: true, trigger: 'blur', validator: validator2 }],
    slot: [{ required: true, trigger: 'blur', validator: validator3 }],
    timeout: [{ required: true, trigger: 'blur', validator: validator4 }],
    type: [{required: true, trigger: 'change', message: $t('Collector.data.321710-32')}],
    serializable: [{required: true, trigger: 'change', message: $t('Collector.data.321710-32')}],
    terminnalAddress: [{required: true, trigger: 'blur', message: $t('Collector.data.321710-33')}],
    frameAmountMax: [{required: true, message: $t('Collector.data.321710-34'), trigger: 'blur'}],
    address: [{ trigger: 'blur',validator: validateUrl,message: $t('Collector.data.321710-35')}],
};

export const FormTableColumns = [
    {
        title: $t('Collector.data.321710-36'),
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
        title: $t('Collector.data.321710-37'),
        dataIndex: 'accessModes',
        key: 'accessModes',
        width: 260,
    },
    {
        title: $t('Collector.data.321710-38'),
        key: 'interval',
        dataIndex: 'interval',
        width: 200,
    },
    {
        title: $t('Collector.data.321710-39'),
        key: 'features',
        dataIndex: 'features',
        width: 140,
    },
    {
        title: $t('Collector.data.321710-40'),
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
        width: 50,
    },
];

export const BacnetFormTableColumns = [
    {
        title: $t('Collector.data.321710-36'),
        dataIndex: 'name',
        key: 'name',
        width: 140,
        fixed: 'left',
        form:{
            required: true
        }
    },
    {
        title: $t('Collector.data.321710-41'),
        dataIndex: 'type',
        key: 'type',
        form:{
            required: true
        }
    },
    {
        title: $t('Collector.data.321710-42'),
        dataIndex: 'instanceNumber',
        key: 'instanceNumber',
        form:{
            required: true
        }
    },
    {
        title: $t('Collector.data.321710-43'),
        dataIndex: 'propertyId',
        key: 'propertyId',
         form:{
            required: true
        },
        width: 200,
    },
    {
        title: $t('Collector.data.321710-44'),
        dataIndex: 'valueType',
        key: 'valueType',
        form:{
            required: true
        },
        width: 200,
    },
    {
        title: $t('Collector.data.321710-37'),
        dataIndex: 'accessModes',
        key: 'accessModes',
        form:{
            required: true
        },
        width: 260,
    },
    {
        title: $t('Collector.data.321710-38'),
        key: 'interval',
        dataIndex: 'interval',
        form:{
            required: true
        },
        width: 200,
    },
    {
        title: $t('Collector.data.321710-39'),
        key: 'features',
        dataIndex: 'features',
        form:{
            required: true
        },
        width: 150,
    },
    {
        title: $t('Collector.data.321710-40'),
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
        width: 70,
    },
]