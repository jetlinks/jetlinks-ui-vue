import { ColumnProps } from "ant-design-vue/es/table";
import { DataType, Source, InputParams, OtherSetting, OutputParams, ConfigParams, TagsType } from './components'
import SelectColumn from './components/Events/SelectColumn.vue';
import AsyncSelect from './components/Function/AsyncSelect.vue';
import { EventLevel } from "@/views/device/data";
import {MetadataType} from "@/views/device/Product/typings";
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

export const useColumns = (type?: MetadataType, target?: 'device' | 'product', dataSource?: any[], noEditor?: any[]) => {

  const BaseColumns: DataTableColumnProps[] = [
    {
      title: '标识',
      dataIndex: 'id',
      type: 'text',
      form: {
        rules: [{
          validator(_:any,value: any) {
            const hasId = dataSource?.find?.((item) => item.id === value)
            if (value) {
              if (hasId) {
                return Promise.reject('标识重复')
              }
              return Promise.resolve()
            }
            return Promise.reject('请输入标识')
          }
        }]
      }
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
      type: 'text',
      form: {
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
      type: 'components',
      components: {
        name: ConfigParams,
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
      type: 'components',
      components: {
        name: InputParams,
      }
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
      width: 230
    },
    {
      title: '属性来源',
      dataIndex: 'expands',
      type: 'components',
      components: {
        name: Source
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

  const columns = computed(() => {
    switch(type) {
      case 'properties':
        return PropertyColumns;
      case 'events':
        return EventColumns
      case 'tags':
        return TagColumns
      case 'functions':
        return FunctionColumns
    }
  })
  return {columns}
}


// const MetadataMapping = new Map<string, DataTableColumnProps[]>();
// MetadataMapping.set('properties', PropertyColumns);
// MetadataMapping.set('events', EventColumns);
// MetadataMapping.set('tags', TagColumns);
// MetadataMapping.set('functions', FunctionColumns);
//
// export default MetadataMapping;