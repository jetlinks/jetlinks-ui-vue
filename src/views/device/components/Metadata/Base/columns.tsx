import { ColumnProps } from "ant-design-vue/es/table";
import { DataType, Source, InputParams, OtherSetting, OutputParams, ConfigParams, TagsType } from './components'
import SelectColumn from './components/Events/SelectColumn.vue';
import AsyncSelect from './components/Function/AsyncSelect.vue';
import { EventLevel } from "@/views/device/data";
import {MetadataType} from "@/views/device/Product/typings";
import rule from "components/Metadata/Rule";
import {Ref} from "vue";
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

export const handleTypeValue = (type:string, value: any = {}) => {
  let obj: any = {}
  switch (type) {
    case 'array':
      obj.elementType = value
      break;
    case 'object':
      obj.properties = value
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

export const useColumns = (type?: MetadataType, target?: 'device' | 'product', noEdit?: Ref<any>) => {

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
                return Promise.reject('该标识存在')
              }
              return Promise.resolve()
            }
            return Promise.reject('请输入标识')
          }
        }]
      },
      doubleClick(record) {
        const ids = (noEdit?.value?.id || []) as any[]
        return !ids.includes(record._sortIndex)
      }
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
      type: 'text',
      form: {
        required: true,
        rules: [{
          required: true,
          message: '请输入名称'
        }]
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
      }
    },
    {
      title: '输出参数',
      dataIndex: 'outInput',
    },
    {
      title: '配置参数',
      dataIndex: 'properties',
      width: 100
    },
    {
      title: '说明',
      dataIndex: 'description',
      type: 'text',
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
      }
    },
    {
      title: '输入参数',
      dataIndex: 'inputs',
      width: 120
    },
    {
      title: '输出参数',
      dataIndex: 'output',
      type: 'components',
      components: {
        name: OutputParams
      }
    },
    {
      title: '说明',
      dataIndex: 'description',
      type: 'text',
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
            console.log('validator',value)
            if (!value?.type) {
              return Promise.reject('请选择数据类型')
            }
            return Promise.resolve()
          }
        }]
      },
      width: 230
    },
    {
      title: '属性来源',
      dataIndex: 'expands',
      type: 'components',
      components: {
        name: Source,
        props: {
          noEdit: noEdit?.value?.source || []
        }
      },
      doubleClick(){
        return target !== 'device'
      },
      form: {
        required: true,
        rules: [
          {
            validator: async (_: Record<string, any>, value: any) => {
              if (value.source) {
                if(value.source !== 'rule') {
                  if(value.type?.length) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject('请选择读写类型');
                  }
                } else {
                  if(value.virtualRule?.rule?.script) {
                    return Promise.resolve();
                  }else {
                    return Promise.reject('请配置规则');
                  }
                }
              } else {
                return Promise.reject('请选择属性来源');
              }
            }
          },
        ]
      },
      width: 150
    },
    {
      title: '其它配置',
      dataIndex: 'other',
      width: 100,
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
      }
    },
    {
      title: '读写类型',
      dataIndex: 'readType',
      type: 'components',
      components: {
        name: TagsType
      }
    },
    {
      title: '说明',
      dataIndex: 'description',
      type: 'text',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120
    }
  ]);

  const columns = ref<any[]>([])

  watch(() => JSON.stringify(noEdit!.value), () => {
    console.log(noEdit!.value)
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


// const MetadataMapping = new Map<string, DataTableColumnProps[]>();
// MetadataMapping.set('properties', PropertyColumns);
// MetadataMapping.set('events', EventColumns);
// MetadataMapping.set('tags', TagColumns);
// MetadataMapping.set('functions', FunctionColumns);
//
// export default MetadataMapping;