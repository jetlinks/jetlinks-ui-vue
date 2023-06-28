import { ColumnProps } from "ant-design-vue/es/table";
import { DataType, Source } from './components'
import { DataTableObject } from 'jetlinks-ui-components';
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
    dataIndex: 'level',
  },
]);

const FunctionColumns: DataTableColumnProps[] = BaseColumns.concat([
  {
    title: '是否异步',
    dataIndex: 'async',
    type: 'TypeSelect',
  },
  {
    title: '输入参数',
    dataIndex: 'inputs',
    type: 'components',
    components: {
      name: DataTableObject,
      props: {
        columns: [
          { title: '参数标识', dataIndex: 'id', type: 'text' },
          { title: '参数名称', dataIndex: 'name', type: 'text' },
          {
              title: '数据类型',
              type: 'components',
              dataIndex: ['valueType', 'type'],

          },
          {
            title: '其他配置',
            type: 'components',
            dataIndex: ['valueType'],

          },
          {
            title: '操作'
          }
        ]
      }
    }
  },
  {
    title: '输出参数',
    dataIndex: 'output',
    type: 'components',
    components: {
      name: DataType
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
  },
  {
    title: '读写类型',
    dataIndex: 'type',
  },
]);

const MetadataMapping = new Map<string, DataTableColumnProps[]>();
MetadataMapping.set('properties', PropertyColumns);
MetadataMapping.set('events', EventColumns);
MetadataMapping.set('tags', TagColumns);
MetadataMapping.set('functions', FunctionColumns);

export default MetadataMapping;