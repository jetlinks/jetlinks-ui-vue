import { ColumnProps } from "ant-design-vue/es/table";
import { DataType, Source, InputParams, OutputParams, ConfigParams } from './components'
import SelectColumn from './components/Events/SelectColumn.vue';
import AsyncSelect from './components/Function/AsyncSelect.vue';
import { EventLevel } from "@/views/device/data";
interface DataTableColumnProps extends ColumnProps {
  type?: string,
  components?: {
    name: any
    [key: string]: any
  }
  form?: {
    rules: any[]
  }
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

const BaseColumns: DataTableColumnProps[] = [
  {
    title: '标识',
    dataIndex: 'id',
    width: 150,
    type: 'text'
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
    type: 'text'
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
    dataIndex: 'valueType',
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
    }
  },
  {
    title: '属性来源',
    dataIndex: 'expands',
    type: 'components',
    components: {
      name: Source
    },
    form: {
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
    }
  },
  {
    title: '读写类型',
    dataIndex: 'type',
  },
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
    dataIndex: 'type',
  },
  {
    title: '说明',
    dataIndex: 'description',
    type: 'text',
  }
]);

const MetadataMapping = new Map<string, DataTableColumnProps[]>();
MetadataMapping.set('properties', PropertyColumns);
MetadataMapping.set('events', EventColumns);
MetadataMapping.set('tags', TagColumns);
MetadataMapping.set('functions', FunctionColumns);

export default MetadataMapping;