import { ColumnProps } from "ant-design-vue/es/table";
import { DataType, Source, InputParams, OtherSetting, OutputParams, ConfigParams, TagsType } from './components'
import SelectColumn from './components/Events/SelectColumn.vue';
import AsyncSelect from './components/Function/AsyncSelect.vue';
import { EventLevel } from "@/views/device/data";
import {MetadataType} from "@/views/device/Product/typings";
import { getUnit } from '@/api/device/instance';
import {Ref} from "vue";
import {omit, pick} from "lodash-es";
import { message } from 'jetlinks-ui-components'
import { onlyMessage } from "@/utils/comm";
import {cloneDeep} from "lodash";
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

export const validatorConfig = (value: any, isObject: boolean = false) => {

  console.log(value)

  if (!value) {
    return Promise.resolve()
  }

  if (value.type === 'enum' && !value.elements?.length) {
    return Promise.reject('请添加枚举项')
  }
  if (value.type === 'array' && !value.elementType?.type) {
    return Promise.reject('请选择元素类型')
  }

  if (isObject && value.type === 'object' && !value.properties?.length) {
    return Promise.reject('请添加参数')
  }

  if (value.type === 'file' && (!value.fileType || !Object.keys(value.fileType).length)) {
    return Promise.reject('请选择文件类型')
  }

  return Promise.resolve()
}

export const handleTypeValue = (type:string, value: any = {}) => {
  let obj: any = {}
  switch (type) {
    case 'array':
      obj.elementType = value
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
      obj.fileType = value
      break;
    case 'date':
      obj.format = value
      break;
    case 'string':
    case 'password':
      obj.maxLength = value
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
      obj.fileType = undefined
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

export const useColumns = (type?: MetadataType, target?: 'device' | 'product', noEdit?: Ref<any>, productNoEdit?: Ref<any>) => {

  const BaseColumns: DataTableColumnProps[] = [
    {
      title: '标识',
      dataIndex: 'id',
      type: 'text',
      form: {
        required: true,
        rules: [{
          callback(rule:any,value: any, dataSource: any[]) {
            if (value) {
              const field = rule.field.split('.')
              const fieldIndex = Number(field[1])
              const hasId = dataSource.some((item, index) => item.id === value && fieldIndex !== index)
              if (hasId) {
                return Promise.reject('该标识已存在')
              }
              return Promise.resolve()
            }
            return Promise.reject('请输入标识')
          },
        },
          { max: 64, message: '最多可输入64个字符' },
          {
            pattern: /^[a-zA-Z0-9_\-]+$/,
            message: '标识只能由数字、字母、下划线、中划线组成',
          },
        ]
      },
      doubleClick(record) {
        if (isExtendsProduct(record.id, productNoEdit?.value, 'id')) {
          return false
        }
        const ids = (noEdit?.value?.id || []) as any[]
        return !ids.includes(record.id)
      }
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
      type: 'text',
      form: {
        required: true,
        rules: [
            {
            required: true,
            message: '请输入名称'
          },
          { max: 64, message: '最多可输入64个字符' },
        ]
        // rules:[{
        //   callback(rule:any,value: any, dataSource: any[]) {
        //     console.log(rule,value,dataSource,123)
        //     return value
        //   }
        // }]
      },
      doubleClick(record) {
        if (isExtendsProduct(record.id, productNoEdit?.value, 'name')) {
          return false
        }
        return true
      }
    },
  ];

  const EventColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: '事件级别',
      dataIndex: 'expands',
      type: 'components',
      components: {
        name: SelectColumn,
        props: {
          options: EventLevel
        }
      },
      doubleClick(record) {
        if (isExtendsProduct(record.id, productNoEdit?.value, 'expands')) {
          return false
        }
        return true
      },
      control(newValue, oldValue) {
        return newValue.expands.level !== oldValue?.expands?.level
      },
    },
    {
      title: '输出参数',
      dataIndex: 'outInput',
    },
    {
      title: '配置参数',
      dataIndex: 'properties',
      width: 100,
      form: {
        required: true,
        rules: [{
          callback(rule: any, value: any, dataSource: any[]) {
            const field = rule.field.split('.')
            const fieldIndex = Number(field[1])
            const record = dataSource.find((item, index) => index === fieldIndex)

            if (!record.valueType.properties.length) {
              return Promise.reject('请添加配置参数')
            }

            return Promise.resolve()
          }
        }]
      },
      control(newValue, oldValue) {
        if (newValue && !oldValue) {
          return true
        } else if (newValue && oldValue) {
          return JSON.stringify(newValue.valueType) !== JSON.stringify(oldValue.valueType)
        }
        return false
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      type: 'text',
      doubleClick(record) {
        if (isExtendsProduct(record.id, productNoEdit?.value, 'description')) {
          return false
        }
        return true
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120
    }
  ]);

  const FunctionColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: '是否异步',
      dataIndex: 'async',
      type: 'components',
      components: {
        name: AsyncSelect,
        props: {
          options: [
            { label: '是', value: true },
            { label: '否', value: false }
          ]
        }
      },
      doubleClick(record) {
        return !isExtendsProduct(record.id, productNoEdit?.value, 'async');

      },
      control(newValue, oldValue) {
        return newValue.async !== oldValue?.async
      },
    },
    {
      title: '输入参数',
      dataIndex: 'inputs',
      width: 120,
      // form: {
      //   required: true,
      //   rules: [{
      //     callback(rule:any,value: any, dataSource: any[]) {
      //       const field = rule.field.split('.')
      //       const fieldIndex = Number(field[1])
      //
      //       const values = dataSource.find((item, index) => index === fieldIndex)
      //
      //       return validatorConfig({
      //         type: 'object',
      //         properties: values.inputs
      //       }, true)
      //     }
      //   }]
      // },
      control(newValue, oldValue) {
        if (newValue && !oldValue) {
          return true
        } else if (newValue && oldValue) {
          return JSON.stringify(newValue.inputs) !== JSON.stringify(oldValue.inputs)
        }
        return false
      },
    },
    {
      title: '输出参数',
      dataIndex: 'output',
      type: 'components',
      components: {
        name: OutputParams
      },
      form: {
        rules: [{
          callback(rule:any,value: any, dataSource: any[]) {
            const field = rule.field.split('.')
            const fieldIndex = Number(field[1])
            const values = dataSource.find((item, index) => index === fieldIndex)
            return validatorConfig(values?.output)
          }
        }]
      },
      doubleClick(record) {
        return !isExtendsProduct(record.id, productNoEdit?.value, 'output');
      },
      control(newValue, oldValue) {
        if (newValue && !oldValue) {
          return true
        } else if (newValue && oldValue) {
          return JSON.stringify(newValue.output) !== JSON.stringify(oldValue.output)
        }
        return false
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      type: 'text',
      doubleClick(record) {
        if (isExtendsProduct(record.id, productNoEdit?.value, 'description')) {
          return false
        }
        return true
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120
    }
    // {
    //   title: '读写类型',
    //   dataIndex: 'expands',
    //   render: (text: any) => (text?.type || []).map((item: string | number) => <Tag>{type[item]}</Tag>),
    // },
  ]);

  const PropertyColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: '数据类型',
      dataIndex: 'valueType',
      type: 'components',
      components: {
        name: DataType
      },
      form: {
        required: true,
        rules: [{
          validator(_: any, value: any) {
            if (!value?.type) {
              return Promise.reject('请选择数据类型')
            }
            return validatorConfig(value, true)
          }
        }]
      },
      width: 230,
      doubleClick(record) {
        if (isExtendsProduct(record.id, productNoEdit?.value, 'valueType')) {
          return false
        }
        return true
      }
    },
    {
      title: '属性来源',
      dataIndex: 'expands',
      type: 'components',
      components: {
        name: Source,
        props: {
          noEdit: noEdit?.value?.source || [],
          target: target,
          productNoEdit: productNoEdit?.value
        }
      },
      doubleClick(record){
        if (record.expands.source === 'rule') {
          return true
        }
        return !isExtendsProduct(record.id, productNoEdit?.value, 'expands')
      },
      form: {
        required: true,
        rules: [
          {
            callback: async (rule: any, value: any, dataSource: any[]) => {
              const field = rule.field.split('.')
              const fieldIndex = Number(field[1])

              const values = dataSource.find((item, index) => index === fieldIndex)
              const virtualRule = values.expands?.virtualRule
              const source = value.source
              console.log(source, value)
              if (source) {
                if (source === 'device' && !value.type?.length) {
                  return Promise.reject('请选择读写类型');
                } else if( source === 'rule' && !virtualRule){
                  return Promise.reject('请配置规则');
                }

                return Promise.resolve()
              }

              return Promise.reject('请选择属性来源');
            }
          },
        ]
      },
      control(newValue, oldValue) {
        if (newValue && !oldValue) {
          return true
        } else if (newValue && oldValue) {
          const keys = ['source', 'type', 'virtualRule']
          const newObj = pick(cloneDeep(newValue.expands), keys)
          const oldObj = pick(cloneDeep(oldValue.expands), keys)
          return JSON.stringify(newObj) !== JSON.stringify(oldObj)
        }
        return false
      },
      width: 150
    },
    {
      title: '其它配置',
      dataIndex: 'other',
      width: 100,
      control(newValue, oldValue) {
        if (!oldValue) {
          return true
        } else if (newValue && oldValue) {
          // 仅留下存储和指标值
          const keys = ['source', 'type', 'virtualRule', 'required']
          const newObj = omit(cloneDeep(newValue.expands), keys)
          const oldObj = omit(cloneDeep(oldValue.expands), keys)
          return JSON.stringify(newObj) !== JSON.stringify(oldObj)
        }
        return false
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120
    }
  ]);

  const TagColumns: DataTableColumnProps[] = BaseColumns.concat([
    {
      title: '数据类型',
      dataIndex: 'valueType',
      type: 'components',
      components: {
        name: DataType,
      },
      form: {
        required: true,
        rules: [{
          validator(_: any, value: any) {
            if (!value?.type) {
              return Promise.reject('请选择数据类型')
            }
            return validatorConfig(value, true)
          }
        }]
      },
      doubleClick(record) {
        if (isExtendsProduct(record.id, productNoEdit?.value, 'valueType')) {
          return false
        }
        return true
      },
      control(newValue, oldValue) {
        if (newValue && !oldValue) {
          return true
        } else if (newValue && oldValue) {
          return JSON.stringify(newValue.valueType) !== JSON.stringify(oldValue.valueType)
        }
        return false
      },
    },
    {
      title: '读写类型',
      dataIndex: 'readType',
      type: 'components',
      components: {
        name: TagsType
      },
      doubleClick(record) {
        if (isExtendsProduct(record.id, productNoEdit?.value, 'readType')) {
          return false
        }
        return true
      },
      form: {
        required: true,
        rules: [
          {
          callback(rule:any,value: any, dataSource: any[]) {
            const field = rule.field.split('.')
            const fieldIndex = Number(field[1])
            const values = dataSource.find((item, index) => index === fieldIndex)
            if (!values?.expands?.type?.length) {
              return Promise.reject('请选择读写类型')
            }
            return Promise.resolve()
          }
        }]
      },
      control(newValue, oldValue) {
        if (newValue && !oldValue) {
          return true
        } else if (newValue && oldValue) {
          return JSON.stringify(newValue.expands) !== JSON.stringify(oldValue.expands)
        }
        return false
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      type: 'text',
      doubleClick(record) {
        if (isExtendsProduct(record.id, productNoEdit?.value, 'description')) {
          return false
        }
        return true
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120
    }
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