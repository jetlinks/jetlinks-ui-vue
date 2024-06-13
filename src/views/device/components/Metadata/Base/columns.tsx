import { ColumnProps } from "ant-design-vue/es/table";
import { DataType } from './components'
import {MetadataItem, MetadataType} from "@/views/device/Product/typings";
import { getUnit } from '@/api/device/instance';
import {Ref} from "vue";
import {omit, isObject } from "lodash-es";
import { onlyMessage } from "@/utils/comm";
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
  control?: (newValue: any, oldValue: any) => Boolean
}

const SourceMap = {
  device: '设备',
  manual: '手动',
  rule: '规则',
};

const type = {
  read: '读',
  write: '写',
  report: '上报',
};

const METADATA_UNIT = 'metadata-unit'

export const validatorConfig = (value: any, _isObject: boolean = false) => {

  if (!value) {
    return Promise.resolve()
  }

  if (value.type === 'enum' && !value.elements?.length) {
    return Promise.reject('请添加枚举项')
  }
  if (value.type === 'array' && !value.elementType?.type) {
    return Promise.reject('请选择元素类型')
  }

  if (_isObject && value.type === 'object' && !value.properties?.length) {
    return Promise.reject('请添加参数')
  }

  if (value.type === 'file' && (!value.bodyType || (isObject(value.bodyType) && !Object.keys(value.bodyType).length))) {
    return Promise.reject('请选择文件类型')
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
      obj.maxLength = JSON.stringify(value) === '{}' ? undefined : value
    case 'password':
      obj.maxLength = JSON.stringify(value) === '{}' ? undefined : value
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
      obj.maxLength = undefined
      break;
    case 'boolean':
      obj.trueText = '是'
      obj.trueValue = 'true'
      obj.falseText = '否'
      obj.falseValue = 'false'
      break;
  }
  return obj
}

const isExtendsProduct = (id: string, productKeys: string, type: string) => {
  if (!id) return false
  const vailKeys = productKeys[type] || []
  if (vailKeys.includes(id)) {
    onlyMessage('继承自产品物模型的数据不支持修改', 'warning')
    return true
  }
  return false
}

export const useColumns = (dataSource: Ref<MetadataItem[]>, type?: MetadataType, target?: 'device' | 'product', noEdit?: Ref<any>, productNoEdit?: Ref<any>) => {

  const BaseColumns: DataTableColumnProps[] = [
    {
      title: '标识',
      dataIndex: 'id',
      form: {
        required: true,
        rules: [{
          asyncValidator(rule:any,value: any, ...setting: any) {
            if (value) {
              const option = setting[2]

              if (dataSource.value.filter((item, index) => index !== option.index && item.id).some(item => item.id === value)) {
                return Promise.reject('该标识已存在')
              }
            }
              return Promise.resolve()
            // return Promise.reject('请输入标识')
          },
        },
          { max: 64, message: '最多可输入64个字符' },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '标识只能由数字、字母、下划线组成',
          },
        ]
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      form: {
        required: true,
        rules: [
          {
            asyncValidator(_: any, value: any) {

              if (!value) {
                return Promise.reject('请输入名称')
              } else if (value.length > 64) {
                return Promise.reject('最多可输入64个字符')
              }

              return Promise.resolve()
            }
          }
        ]
      },
    },
  ];

  const PropertyColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: '数据类型',
      dataIndex: 'valueType',
      type: 'components',
      components: {
        name: DataType
      },
      form: {
        rules: [{
          asyncValidator(_: any, value: any) {

            if (!value?.type) {
              return Promise.reject('请选择数据类型')
            }
            return validatorConfig(value, true)
          }
        }]
      },
      width: 260,
    },
    {
      title: '属性来源',
      dataIndex: 'expands',
      form: {
        rules: [
          {
            asyncValidator: async (rule: any, value: any) => {

              const source = value.source
              console.log(value)
              if (source) {
                if (source === 'device' && !value.type?.length) {
                  return Promise.reject('请选择读写类型');
                }

                return Promise.resolve()
              }

              return Promise.reject('请选择属性来源');
            }
          },
        ]
      },
      width: 220
    },
    // {
    //   title: '属性分组',
    //   dataIndex: 'group',
    //   width: 140,
    // },
    {
      title: '其它配置',
      dataIndex: 'other',
      width: 120,
    },
  ]);

  const FunctionColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: '是否异步',
      dataIndex: 'async',
      width: 120,
    },
    {
      title: '输入参数',
      dataIndex: 'inputs',
      width: 100,
    },
    {
      title: '输出参数',
      dataIndex: 'output',
      width: 240,
      form: {
        rules: [{
          asyncValidator: async (rule: any, value: any) => {
            return validatorConfig(value)
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
      title: '其它配置',
      dataIndex: 'other',
      width: 120,
    },
    {
      title: '说明',
      dataIndex: 'description',
      width: 220,
      form: {
        rules: [
          { max: 20, message: '最多可输入20个字符' },
      ]},
    },
  ]);

  const EventColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: '事件级别',
      dataIndex: 'expands',
      width: 150,
    },
    {
      title: '输出参数',
      dataIndex: 'valueType',
      width: 100,
      form: {
        rules: [{
          asyncValidator: async (rule: any, value: any) => {

            if (!value.properties?.length) {
              return Promise.reject('请添加配置参数')
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
      title: '其它配置',
      dataIndex: 'other',
      width: 120,
    },
    {
      title: '说明',
      dataIndex: 'description',
      width: 220,
      form: {
        rules: [
          { max: 20, message: '最多可输入20个字符' },
        ]},
    },
  ]);

  const TagColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: '数据类型',
      dataIndex: 'valueType',
      width: 240,
      form: {
        required: true,
        rules: [{
          asyncValidator: async (rule: any, value: any) => {

            if (!value?.type) {
              return Promise.reject('请选择数据类型')
            }
            return validatorConfig(value, true)
          }
        }]
      },
    },
    {
      title: '读写类型',
      dataIndex: 'expands',
      width: 190,
      form: {
        rules: [
          {
            asyncValidator: async (rule: any, value: any) => {
              if (!value?.type?.length) {
                return Promise.reject('请选择读写类型')
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
      title: '其它配置',
      dataIndex: 'other',
      width: 120,
    },
    {
      title: '说明',
      dataIndex: 'description',
      width: 200,
      form: {
        rules: [
          { max: 20, message: '最多可输入20个字符' },
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
  int: 'int(整数型)',
  long: 'long(长整数型)',
  float: 'float(单精度浮点型)',
  double: 'double(双精度浮点数)',
  string: 'text(字符串)',
  boolean: 'boolean(布尔型)',
  date: 'date(时间型)',
  enum: 'enum(枚举)',
  array: 'array(数组)',
  object: 'object(结构体)',
  file: 'file(文件)',
  password: 'password(密码)',
  geoPoint: 'geoPoint(地理位置)',
}

// const MetadataMapping = new Map<string, DataTableColumnProps[]>();
// MetadataMapping.set('properties', PropertyColumns);
// MetadataMapping.set('events', EventColumns);
// MetadataMapping.set('tags', TagColumns);
// MetadataMapping.set('functions', FunctionColumns);
//
// export default MetadataMapping;
