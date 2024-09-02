export const columns = [
    {
      title: '标识',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      fixed: 'left',
      search: {
        type: 'string',
        componentProps: {
          placeholder: '请输入标识',
        },
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: {
        type: 'string',
        first: true,
        componentProps: {
          placeholder: '请输入名称',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      scopedSlots: true,
      search: {
        type: 'select',
        componentProps: {
          placeholder: '请选择状态',
        },
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      fixed: 'right',
      scopedSlots: true,
    },
  ]

  export const editColumns = [
    {
      title: '-',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      width: 220,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '说明',
      dataIndex: 'describe',
      key: 'describe',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 80,
      dataIndex: 'actions',
      key: 'actions',
    },
  ]

  export const defaultAction = [
    { action: 'query', name: '查询', describe: '查询' },
    { action: 'save', name: '保存', describe: '保存' },
    { action: 'delete', name: '删除', describe: '删除' },
  ]