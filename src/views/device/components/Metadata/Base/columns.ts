import { JColumnProps } from "@/components/Table";

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

const BaseColumns: JColumnProps[] = [
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

const EventColumns: JColumnProps[] = BaseColumns.concat([
  {
    title: '事件级别',
    dataIndex: 'level',
    scopedSlots: true,
  },
]);

const FunctionColumns: JColumnProps[] = BaseColumns.concat([
  {
    title: '是否异步',
    dataIndex: 'async',
    scopedSlots: true,
  },
  // {
  //   title: '读写类型',
  //   dataIndex: 'expands',
  //   render: (text: any) => (text?.type || []).map((item: string | number) => <Tag>{type[item]}</Tag>),
  // },
]);

const PropertyColumns: JColumnProps[] = BaseColumns.concat([
  {
    title: '数据类型',
    dataIndex: 'valueType',
    scopedSlots: true,
  },
  {
    title: '属性来源',
    dataIndex: 'source',
    scopedSlots: true,
  },
  {
    title: '读写类型',
    dataIndex: 'type',
    scopedSlots: true,
  },
]);

const TagColumns: JColumnProps[] = BaseColumns.concat([
  {
    title: '数据类型',
    dataIndex: 'valueType',
    scopedSlots: true,
  },
  {
    title: '读写类型',
    dataIndex: 'type',
    scopedSlots: true,
  },
]);

const MetadataMapping = new Map<string, JColumnProps[]>();
MetadataMapping.set('properties', PropertyColumns);
MetadataMapping.set('events', EventColumns);
MetadataMapping.set('tags', TagColumns);
MetadataMapping.set('functions', FunctionColumns);

export default MetadataMapping;