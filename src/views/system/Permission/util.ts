import i18n from "@/locales";
export const columns = [
    {
      title: i18n.global.t('Permission.util.968438-0'),
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      fixed: 'left',
      search: {
        type: 'string',
        componentProps: {
          placeholder: i18n.global.t('Permission.util.968438-1'),
        },
      },
    },
    {
      title: i18n.global.t('Permission.util.968438-2'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      scopedSlots: true,
      search: {
        type: 'string',
        first: true,
        componentProps: {
          placeholder: i18n.global.t('Permission.util.968438-3'),
        },
      },
    },
    {
      title: i18n.global.t('Permission.util.968438-4'),
      dataIndex: 'status',
      key: 'status',
      scopedSlots: true,
      search: {
        type: 'select',
        componentProps: {
          placeholder: i18n.global.t('Permission.util.968438-5'),
        },
        options: [
          { label: i18n.global.t('Permission.util.968438-6'), value: 1 },
          { label: i18n.global.t('Permission.util.968438-7'), value: 0 },
        ],
      },
    },
    {
      title: i18n.global.t('Permission.util.968438-8'),
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
      title: i18n.global.t('Permission.util.968438-9'),
      dataIndex: 'action',
      key: 'action',
      width: 220,
    },
    {
      title: i18n.global.t('Permission.util.968438-2'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: i18n.global.t('Permission.util.968438-10'),
      dataIndex: 'describe',
      key: 'describe',
      ellipsis: true,
    },
    {
      title: i18n.global.t('Permission.util.968438-8'),
      width: 80,
      dataIndex: 'actions',
      key: 'actions',
    },
  ]

  export const defaultAction = [
    { action: 'query', name: i18n.global.t('Permission.util.968438-11'), describe: i18n.global.t('Permission.util.968438-11') },
    { action: 'save', name: i18n.global.t('Permission.util.968438-12'), describe: i18n.global.t('Permission.util.968438-12') },
    { action: 'delete', name: i18n.global.t('Permission.util.968438-13'), describe: i18n.global.t('Permission.util.968438-13') },
  ]