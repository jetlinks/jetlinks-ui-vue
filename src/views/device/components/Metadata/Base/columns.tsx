import { ColumnProps } from "ant-design-vue/es/table";
import { DataType } from './components'
interface DataTableColumnProps extends ColumnProps {
  type?: string,
  components?: {
    name: any
    [key:string]: any
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
  },
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
    dataIndex: 'source',
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