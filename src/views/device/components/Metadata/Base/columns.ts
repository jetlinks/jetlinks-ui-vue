import { ColumnProps } from "ant-design-vue/es/table";

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

const BaseColumns: ColumnProps[] = [
  {
    title: '标识',
    dataIndex: 'id',
    ellipsis: true,
  },
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '说明',
    dataIndex: 'description',
    ellipsis: true,
  },
];

const EventColumns: ColumnProps[] = BaseColumns.concat([
  {
    title: '事件级别',
    dataIndex: 'level',
  },
]);

const FunctionColumns: ColumnProps[] = BaseColumns.concat([
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

const PropertyColumns: ColumnProps[] = BaseColumns.concat([
  {
    title: '数据类型',
    dataIndex: 'valueType',
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

const TagColumns: ColumnProps[] = BaseColumns.concat([
  {
    title: '数据类型',
    dataIndex: 'valueType',
  },
  {
    title: '读写类型',
    dataIndex: 'type',
  },
]);

const MetadataMapping = new Map<string, ColumnProps[]>();
MetadataMapping.set('properties', PropertyColumns);
MetadataMapping.set('events', EventColumns);
MetadataMapping.set('tags', TagColumns);
MetadataMapping.set('functions', FunctionColumns);

export default MetadataMapping;