import { ColumnProps } from "ant-design-vue/es/table";
import {MetadataItem, MetadataType} from "../../../Product/typings";
import { getUnit } from '../../../../../api/instance';
import {Ref} from "vue";
import {omit, isObject,} from "lodash-es";
import { onlyMessage } from "@jetlinks-web-core/utils/comm";
import i18n from "@jetlinks-web-core/locales";
interface DataTableColumnProps extends ColumnProps {
  type?: string,
  components?: {
    name?: any
    [key: string]: any
  }
  form?: {
    rules?: any[]
    [key: string]: any
  },
  options?: any[]
  doubleClick?: (record: any, index: number, dataIndex: string) => boolean
  control?: (newValue: any, oldValue: any) => boolean

  filter?: boolean
  sort?: Record<string, any>
}

const SourceMap = {
  device: i18n.global.t('Base.columns.448718-0'),
  manual: i18n.global.t('Base.columns.448718-1'),
  rule: i18n.global.t('Base.columns.448718-2'),
};

const type = {
  read: i18n.global.t('Base.columns.448718-3'),
  write: i18n.global.t('Base.columns.448718-4'),
  report: i18n.global.t('Base.columns.448718-5'),
};

const METADATA_UNIT = 'metadata-unit'

export const validatorConfig = (value: any, _isObject: boolean = false) => {

  if (!value) {
    return Promise.resolve()
  }

  if (value.type === 'enum' && !value.elements?.length) {
    return Promise.reject(i18n.global.t('Base.columns.448718-6'))
  }
  if (value.type === 'array' && !value.elementType?.type) {
    return Promise.reject(i18n.global.t('Base.columns.448718-7'))
  }

  if (_isObject && value.type === 'object' && !value.properties?.length) {
    return Promise.reject(i18n.global.t('Base.columns.448718-8'))
  }

  if (value.type === 'date' && !value.format) {
    return Promise.reject(i18n.global.t('Base.columns.448718-9'))
  }

  if (value.type === 'file' && (!value.bodyType || (isObject(value.bodyType) && !Object.keys(value.bodyType).length))) {
    return Promise.reject(i18n.global.t('Base.columns.448718-10'))
  }

  return Promise.resolve()
}

export const handleTypeValue = (type:string, value: any = {}) => {
  let obj: any = {}
  switch (type) {
    //bug#22609
    case 'array':
      if(value.type === 'array'){
      obj.elementType = {
          ...value,
          elementType:{
        type: 'object',
        properties: []
      }
        }
      }else{
        obj.elementType = value
      }
      break;
    case 'object':
      obj.properties = (value || []).map((item: any) => {
        return omit(item, ['config', 'action', '_sortIndex'])
      })
      break;
    case 'int':
    case 'long':
      obj.unit = value
      break;
    case 'file':
      obj.bodyType = value
      break;
    case 'date':
      obj.format = value
      break;
    case 'string':
    case 'password':
      obj.expands.maxLength = JSON.stringify(value) === '{}' ? undefined : value
      break;
    default:
      obj = value
      break;
  }
  return obj
}

export const typeSelectChange = (type: string) => {
  let obj: any = {}
  switch (type) {
    case 'array':
      obj.elementType = {}
      break;
    case 'object':
      obj.properties = []
      break;
    case 'enum':
      obj.elements = []
      break;
    case 'float':
    case 'double':
      obj.scale = 2
      obj.unit = undefined
      break;
    case 'int':
    case 'long':
      obj.unit = undefined
      break;
    case 'file':
      obj.bodyType = undefined
      break;
    case 'date':
      obj.format = undefined
      break;
    case 'string':
    case 'password':
      obj.expands.maxLength = undefined
      break;
    case 'boolean':
      obj.trueText = i18n.global.t('Base.columns.448718-11')
      obj.trueValue = 'true'
      obj.falseText = i18n.global.t('Base.columns.448718-12')
      obj.falseValue = 'false'
      break;
  }
  return obj
}

const isExtendsProduct = (id: string, productKeys: string, type: string) => {
  if (!id) return false
  const vailKeys = productKeys[type] || []
  if (vailKeys.includes(id)) {
    onlyMessage(i18n.global.t('Base.columns.448718-13'), 'warning')
    return true
  }
  return false
}

export const useColumns = (dataSource: Ref<MetadataItem[]>, type?: MetadataType, target?: 'device' | 'product', noEdit?: Ref<any>, productNoEdit?: Ref<any>) => {

  // 存储 ID 到索引的 Map
  const idToIndicesMap = new Map<any, Set<number>>();


  // 构建/重建 Map 的函数
  const buildIdMap = (data: any[]) => {
    idToIndicesMap.clear(); // 每次重建前清空 Map
    data.forEach((item, index) => {
      if (item.id !== undefined && item.id !== null) { // 确保 id 存在且有效
        if (!idToIndicesMap.has(item.id)) {
          idToIndicesMap.set(item.id, new Set());
        }
        idToIndicesMap.get(item.id)!.add(index);
      }
    });
  };

  const BaseColumns: DataTableColumnProps[] = [
    {
      title: i18n.global.t('Base.columns.448718-14'),
      dataIndex: 'id',
      form: {
        required: true,
        rules: [{
          asyncValidator(rule:any,value: any, ...setting: any) {
            if (value) {
              const option = setting[2]
              const currentIndex = option.index;

              if (idToIndicesMap.has(value)) {
                const indicesWithThisId = idToIndicesMap.get(value)!;

                // 检查除了当前项之外，是否有其他项使用了相同的 ID
                const isDuplicate = Array.from(indicesWithThisId).some(idx => idx !== currentIndex);

                if (isDuplicate) {
                  return Promise.reject(i18n.global.t('Base.columns.448718-15'));
                }
              }
            }
              return Promise.resolve()
            // return Promise.reject('请输入{i18n.global.t('Base.columns.448718-14')}')
          },
        },
          { max: 64, message: i18n.global.t('Base.columns.448718-16') },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: i18n.global.t('Base.columns.448718-17'),
          },
        ]
      },
      filter: true
    },
    {
      title: i18n.global.t('Base.columns.448718-18'),
      dataIndex: 'name',
      form: {
        required: true,
        rules: [
          {
            asyncValidator(_: any, value: any) {

              if (!value) {
                return Promise.reject(i18n.global.t('Base.columns.448718-19'))
              } else if (value.length > 64) {
                return Promise.reject(i18n.global.t('Base.columns.448718-16'))
              }

              return Promise.resolve()
            }
          }
        ]
      },
      filter: true
    },
  ];

  const PropertyColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: i18n.global.t('Base.columns.448718-20'),
      dataIndex: 'valueType',
      form: {
        required: true,
        rules: [{
          asyncValidator(_: any, value: any) {

            if (!value?.type) {
              return Promise.reject(i18n.global.t('Base.columns.448718-21'))
            }
            return validatorConfig(value, true)
          }
        }]
      },
      // sort: {
      //   sortKey: ['valueType', 'type'],
      //   dataSource: () => {
      //     const group = groupBy(dataSource.value.filter(item => item.id && item.valueType.type), (e) => e.valueType.type)
      //     const typeMap = getTypeMap()
      //     return Object.keys(group).map((key, index) => {
      //       return {
      //         name: typeMap[key],
      //         key: key,
      //         total: group[key].length
      //       }
      //     })
      //   }
      // },
      width: 260,
    },
    {
      title: i18n.global.t('Base.columns.448718-22'),
      dataIndex: 'expands',
      form: {
        required: true,
        rules: [
          {
            asyncValidator: async (rule: any, value: any) => {

              const source = value?.source
              if (source) {
                if (source === 'device' && !value.type?.length) {
                  return Promise.reject(i18n.global.t('Base.columns.448718-23'));
                }

                return Promise.resolve()
              }

              return Promise.reject(i18n.global.t('Base.columns.448718-24'));
            }
          },
        ]
      },
      // sort: {
      //   sortKey: ['expands', 'source'],
      //   dataSource: () => {
      //     const group = groupBy(dataSource.value.filter(item => item.id), (e) => e.expands.source)
      //     const sourceMap = getSourceMap()
      //
      //     return Object.keys(group).map(key => {
      //       return {
      //         name: sourceMap[key],
      //         key: key,
      //         total: group[key].length
      //       }
      //     })
      //   }
      // },
      width: 220
    },
    // {
    //   title: '属性分组',
    //   dataIndex: 'group',
    //   width: 140,
    // },
    {
      title: i18n.global.t('Base.columns.448718-25'),
      dataIndex: 'other',
      width: i18n.global.locale === 'zh' ? 110 : 170,
    },
  ]);

  const FunctionColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: i18n.global.t('Base.columns.448718-26'),
      dataIndex: 'async',
      width: 120,
      // sort: {
      //   sortKey: ['async'],
      //   dataSource: () => {
      //     const group = groupBy(dataSource.value.filter(item => item.id), (e) => e.async)
      //
      //     return Object.keys(group).map(key => {
      //       return {
      //         name: key ? i18n.global.t('Base.columns.448718-11') : i18n.global.t('Base.columns.448718-12'),
      //         key: key,
      //         total: group[key].length
      //       }
      //     })
      //   }
      // },
    },
    {
      title: i18n.global.t('Base.columns.448718-27'),
      dataIndex: 'inputs',
      width: 120,
    },
    {
      title: i18n.global.t('Base.columns.448718-28'),
      dataIndex: 'output',
      width: 200,
      form: {
        rules: [{
          asyncValidator: async (rule: any, value: any) => {
            return validatorConfig(value)
          }
        }]
      },
      // sort: {
      //   sortKey: ['output', 'type'],
      //   dataSource: () => {
      //     const group = groupBy(dataSource.value.filter(item => item.id && item.output.type), (e) => e.output.type)
      //     const typeMap = getTypeMap()
      //     return Object.keys(group).map(key => {
      //       return {
      //         name: typeMap[key],
      //         key: key,
      //         total: group[key].length
      //       }
      //     })
      //   }
      // }
    },
    // {
    //   title: '属性分组',
    //   dataIndex: 'group',
    //   width: 140,
    // },
    {
      title: i18n.global.t('Base.columns.448718-25'),
      dataIndex: 'other',
      width: i18n.global.locale === 'zh' ? 120 : 170,
    },
    {
      title: i18n.global.t('Base.columns.448718-29'),
      dataIndex: 'description',
      width: 220,
      form: {
        rules: [
          { max: 20, message: i18n.global.t('Base.columns.448718-30') },
      ]},
    },
  ]);

  const EventColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: i18n.global.t('Base.columns.448718-31'),
      dataIndex: 'expands',
      width: 150,
      // sort: {
      //   sortKey: ['expands', 'level'],
      //   dataSource: () => {
      //     const group = groupBy(dataSource.value.filter(item => item.id), (e) => e.expands.level)
      //     const typeMap = getEventLevelMap()
      //     return Object.keys(group).map(key => {
      //       return {
      //         name: typeMap[key],
      //         key: key,
      //         total: group[key].length
      //       }
      //     })
      //   }
      // }
    },
    {
      title: i18n.global.t('Base.columns.448718-28'),
      dataIndex: 'valueType',
      width: i18n.global.locale === 'zh' ? 110 : 170,
      form: {
        required: true,
        rules: [{
          asyncValidator: async (rule: any, value: any) => {

            if (!value.properties?.length) {
              return Promise.reject(i18n.global.t('Base.columns.448718-32'))
            }

            return Promise.resolve()
          }
        }]
      },
    },
    // {
    //   title: '属性分组',
    //   dataIndex: 'group',
    //   width: 140,
    // },
    {
      title: i18n.global.t('Base.columns.448718-25'),
      dataIndex: 'other',
      width: i18n.global.locale === 'zh' ? 120 : 170,
    },
    {
      title: i18n.global.t('Base.columns.448718-29'),
      dataIndex: 'description',
      width: 220,
      form: {
        rules: [
          { max: 20, message: i18n.global.t('Base.columns.448718-30') },
        ]},
    },
  ]);

  const TagColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: i18n.global.t('Base.columns.448718-20'),
      dataIndex: 'valueType',
      width: 240,
      form: {
        required: true,
        rules: [{
          asyncValidator: async (rule: any, value: any) => {

            if (!value?.type) {
              return Promise.reject(i18n.global.t('Base.columns.448718-21'))
            }
            return validatorConfig(value, true)
          }
        }]
      },
      // sort: {
      //   sortKey: ['valueType', 'type'],
      //   dataSource: () => {
      //     const group = groupBy(dataSource.value.filter(item => item.id && item.valueType.type), (e) => e.valueType.type)
      //     const typeMap = getTypeMap()
      //     return Object.keys(group).map(key => {
      //       return {
      //         name: typeMap[key],
      //         key: key,
      //         total: group[key].length
      //       }
      //     })
      //   }
      // }
    },
    // {
    //   title: '{i18n.global.t('Base.columns.448718-3')}{i18n.global.t('Base.columns.448718-4')}类型',
    //   dataIndex: 'expands',
    //   width: 190,
    //   form: {
    //     rules: [
    //       {
    //         asyncValidator: async (rule: any, value: any) => {
    //           if (!value?.type?.length) {
    //             return Promise.reject(i18n.global.t('Base.columns.448718-23'))
    //           }
    //           return Promise.resolve()
    //       }
    //     }]
    //   },
    // },
    // {
    //   title: '属性分组',
    //   dataIndex: 'group',
    //   width: 140,
    // },
    {
      title: i18n.global.t('Base.columns.448718-25'),
      dataIndex: 'other',
      width: i18n.global.locale === 'zh' ? 110 : 170,
    },
    {
      title: i18n.global.t('Base.columns.448718-29'),
      dataIndex: 'description',
      width: 250,
      form: {
        rules: [
          { max: 20, message: i18n.global.t('Base.columns.448718-30') },
      ]},
    },
  ]);

  const columns = ref<any[]>([])

  watch(() => JSON.stringify(noEdit!.value), () => {
    switch(type) {
      case 'properties':
        columns.value = PropertyColumns
        break ;
      case 'events':
        columns.value = EventColumns
        break ;
      case 'tags':
        columns.value = TagColumns
        break ;
      case 'functions':
        columns.value = FunctionColumns
        break ;
    }
  }, { immediate: true })

  watch(() => JSON.stringify(dataSource.value), () => {
    buildIdMap(dataSource.value)
  },{ immediate: true})

  return {columns}
}

export const useUnit = (type: Ref<string>) => {
  const unitOptions = ref<Array<{ label: string, value: any }>>([])

  watch(() => type.value, () => {
    if (['float', 'double', 'int', 'long'].includes(type.value) && !unitOptions.value.length) {
      getUnit().then((res) => {
        if (res.success) {
          unitOptions.value = res.result.map((item: any) => ({
                label: item.description,
                value: item.id,
          }));
        }
      });
    }
  }, { immediate: true })

  return { unitOptions }
}

export const useSaveUnit = () => {
  const unitOptions = ref<Array<{ label: string, value: any }>>([])

  provide(METADATA_UNIT, unitOptions)

  getUnit().then((res) => {
    if (res.success) {
      unitOptions.value = res.result.map((item: any) => ({
        label: item.description,
        value: item.id,
      }));
    }
  });

  return {
    unitOptions
  }
}

export const useGetUnit = () => inject(METADATA_UNIT)


export const TypeStringMap = {
  int: `int(${i18n.global.t('Base.columns.448718-33')})`,
  long: `long(${i18n.global.t('Base.columns.448718-34')})`,
  float: `float(${i18n.global.t('Base.columns.448718-35')})`,
  double: `double(${i18n.global.t('Base.columns.448718-36')})`,
  string: `text(${i18n.global.t('Base.columns.448718-37')})`,
  boolean: `boolean(${i18n.global.t('Base.columns.448718-38')})`,
  date: `date(${i18n.global.t('Base.columns.448718-39')})`,
  enum: `enum(${i18n.global.t('Base.columns.448718-40')})`,
  array: `array(${i18n.global.t('Base.columns.448718-41')})`,
  object: `object(${i18n.global.t('Base.columns.448718-42')})`,
  file: `file(${i18n.global.t('Base.columns.448718-43')})`,
  password: `password(${i18n.global.t('Base.columns.448718-44')})`,
  geoPoint: `geoPoint(${i18n.global.t('Base.columns.448718-45')})`,
}

// const MetadataMapping = new Map<string, DataTableColumnProps[]>();
// MetadataMapping.set('properties', PropertyColumns);
// MetadataMapping.set('events', EventColumns);
// MetadataMapping.set('tags', TagColumns);
// MetadataMapping.set('functions', FunctionColumns);
//
// export default MetadataMapping;
