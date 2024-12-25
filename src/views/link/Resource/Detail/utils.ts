export const EventEmitter = {
    list: {},
    subscribe: function(events: string[], fn: Function) {
        const list = this.list
        events.forEach(event => {
            (list[event] || (list[event] = [])).push(fn)
        })
        return this
    },
    emit: function(events:string, data?: any) {
        const list = this.list
        const fns: Function[] = list[events] ? [...list[events]] : []

        if (!fns.length) return false;

        fns.forEach(fn => {
            fn(data)
        })

        return this
    },
    unSubscribe: function(events:string[], fn: Function) {
        const list = this.list
        events.forEach(key => {
            if (key in list) {
                const fns = list[key]
                for (let i = 0; i < fns.length; i++) {
                    if (fns[i] === fn) {
                        fns.splice(i, 1)
                        break;
                    }
                }
            }
        })
        return this
    }
}
export const sourceType = [
    {
        value: 'device',
        label: '设备',
    },
    {
        value: 'manual',
        label: '手动',
    },
    {
        value: 'rule',
        label: '规则',
    },
]

export const getSourceMap = () => {
    return sourceType.reduce((prev, next) => {
        prev[next.value] = next.label
        return prev
    }, {})
}

export const limitsMap = new Map<string, any>();
limitsMap.set('events-add', 'eventNotInsertable');
limitsMap.set('events-updata', 'eventNotModifiable');
limitsMap.set('properties-add', 'propertyNotInsertable');
limitsMap.set('properties-updata', 'propertyNotModifiable');

export const getMetadataItemByType = (type: string) => {
    let item = {
        id: undefined,
        name: undefined,
        expands: {}
    }
    if (type === 'properties') {
        item = Object.assign(item, {
            expands: {
                source: 'device',
                group: undefined
            },
            valueType: {
                type: undefined,
                expands: {}
            }
        })
    } else if (type === 'functions') {
        item = Object.assign(item, {
            async: false,
            inputs: [],
            output: {
                type: undefined
            }
        })
    } else if (type === 'events') {
        item = Object.assign(item, {
            async: false,
            valueType: {
                type: 'object',
                properties: []
            },
            expands: {
                level: 'ordinary',
                group: undefined
            }
        })
    } else if (type === 'tags') {
        item = Object.assign(item, {
            valueType: {
                type: undefined
            },
            expands: {
                type: undefined,
                group: undefined
            }
        })
    }

    return item
}

export const useStoreType = () => {
    const route = useRoute()
    const settingData = ref({})

    const getData = async () => {
        // const id = route.params.id;
        //
        // if (!id || !type) return;
        //
        // const params: any = {
        //     deviceId: id,
        //     metadata: {
        //         id: id,
        //         type: 'property',
        //         dataType: type,
        //     },
        // };

        // const resp =
        //     type === 'product'
        //         ? await getMetadataConfig(params)
        //         : await getMetadataDeviceConfig(params);
        // if (resp.success) {
        //
        //     if (resp.result.length) {
        //         resp.result.forEach((a) => {
        //             if (a.properties) {
        //                 a.properties.some(item => {
        //                     if (item.property === 'storageType') {
        //                         settingData.value = item.type.elements.reduce((prev, next) => {
        //                             prev[next.value] = next.text
        //                             return prev
        //                         }, {})
        //                     }
        //                 })
        //             }
        //         });
        //     }
        // }
    }

    getData()

    return {
        settingData
    }
}

export const DataTypeList: { label: string; value: string }[] = [
    {
        value: 'int',
        label: 'int(整数型)',
    },
    {
        value: 'long',
        label: 'long(长整数型)',
    },
    {
        value: 'float',
        label: 'float(单精度浮点型)',
    },
    {
        value: 'double',
        label: 'double(双精度浮点数)',
    },
    {
        value: 'string',
        label: 'text(字符串)',
    },
    {
        value: 'boolean',
        label: 'boolean(布尔型)',
    },
    {
        value: 'date',
        label: 'date(时间型)',
    },
    {
        value: 'enum',
        label: 'enum(枚举)',
    },
    {
        value: 'array',
        label: 'array(数组)',
    },
    {
        value: 'object',
        label: 'object(结构体)',
    },
    {
        value: 'file',
        label: 'file(文件)',
    },
    {
        value: 'password',
        label: 'password(密码)',
    },
    {
        value: 'geoPoint',
        label: 'geoPoint(地理位置)',
    },
];

export const PropertySource: { label: string; value: string }[] = [
    {
        value: 'device',
        label: '设备',
    },
    {
        value: 'manual',
        label: '手动',
    },
    {
        value: 'rule',
        label: '规则',
    },
]


export const FileTypeList: { label: string; value: string }[] = [
    {
        label: 'URL(链接)',
        value: 'url',
    },
    {
        label: 'Base64(Base64编码)',
        value: 'base64',
    },
    {
        label: 'binary',
        value: 'Binary(二进制)',
    },
];

export const EventLevel: { label: string; value: string }[] = [
    {
        label: '普通',
        value: 'ordinary',
    },
    {
        label: '警告',
        value: 'warn',
    },
    {
        value: 'urgent',
        label: '紧急',
    },
];

export const getEventLevelMap = () => {
    return EventLevel.reduce((prev, next) => {
        prev[next.value] = next.label
        return prev
    }, {})
}

export const DateTypeList = [
    {
        label: 'yyyy-MM-dd',
        value: 'yyyy-MM-dd',
    },
    {
        label: 'yyyy-MM-DD HH:mm:ss',
        value: 'yyyy-MM-DD HH:mm:ss',
    },
];

export const ExpandsTypeList = [
    {
        label: '读',
        value: 'read',
    },
    {
        label: '写',
        value: 'write',
    },
    {
        label: '上报',
        value: 'report',
    },
]

export const getMetadataColumns = (type: string) => {
    const baseColumns: any[] = [
      {
        title: '标识',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      }
    ]
  
    if (type === 'properties') {
      baseColumns.push(...[
        {
          title: '数据类型',
          dataIndex: 'valueType',
          width: 260,
        },
        {
          title: '属性来源',
          dataIndex: 'expands',
          width: 220,
        },
        {
          title: '其它配置',
          dataIndex: 'other',
          width: 110,
        },
      ])
    }
  
    if (type === 'functions') {
      baseColumns.push(...[
        {
          title: '是否异步',
          dataIndex: 'async',
          width: 120,
        },
        {
          title: '输入参数',
          dataIndex: 'inputs',
          width: 110,
        },
        {
          title: '输出参数',
          dataIndex: 'output',
          width: 240,
        },
        {
          title: '其它配置',
          dataIndex: 'other',
          width: 120,
        },
      ])
    }
  
    if (type === 'events') {
      baseColumns.push(...[
        {
          title: '事件级别',
          dataIndex: 'expands',
          width: 150,
        },
        {
          title: '输出参数',
          dataIndex: 'valueType',
          width: 240,
        },
        {
          title: '其它配置',
          dataIndex: 'other',
          width: 120,
        },
      ])
    }
  
    if (type === 'tags') {
      baseColumns.push(...[
        {
          title: '数据类型',
          dataIndex: 'valueType',
          width: 240,
        },
        {
          title: '其它配置',
          dataIndex: 'other',
          width: 120,
        },
      ])
    }
  
    baseColumns.push({
      title: '说明',
      dataIndex: 'description',
    })
    return baseColumns
  }
  export const arrayToObj = (array: any[], fieldNames: Record<string, string>): Record<string, any> => {
    return array.reduce((prev, next) => {
      prev[next[fieldNames.key || 'key']] = next[fieldNames.value || 'value']
      return prev
    }, {})
  }