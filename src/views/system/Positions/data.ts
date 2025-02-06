import { useI18n } from 'vue-i18n';
import {queryRole_api} from "@/api/system/user";
import {queryOrgThree} from "@/modules/device-manager-ui/api/product";

export const useColumns = (permission) => {
  const { t: $t } = useI18n();

  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      search: {
        type: 'string',
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: {
        type: 'string',
      },
    },
    {
      title: $t('User.index.673867-13'),
      dataIndex: 'roleList',
      key: 'roleList',
      search: {
        type: 'select',
        // rename:'id$in-dimension$role',
        options: () =>
          new Promise((resolve) => {
            queryRole_api({
              paging: false,
              sorts: [
                { name: 'createTime', order: 'desc' },
                { name: 'id', order: 'desc' },
              ],
            }).then((resp: any) => {
              resolve(
                resp.result.map((item: Record<string, string>) => ({
                  label: item.name,
                  value: item.id,
                })),
              );
            });
          }),
      },
      scopedSlots: true,
    },
    {
      title: '上级职位',
      dataIndex: 'parentId',
      key: 'parentId',
      ellipsis: true,
      search: {
        type: 'string',
      },
    },
    {
      dataIndex: 'id$dim-assets',
      title: $t('Instance.index.133466-16'),
      hideInTable: true,
      search: {
        type: 'treeSelect',
        termOptions: ['eq'],

        options: () =>
          new Promise((resolve) => {
            queryOrgThree({}).then((resp: any) => {
              const formatValue = (list: any[]) => {
                const _list: any[] = [];
                list.forEach((item) => {
                  if (item.children) {
                    item.children = formatValue(item.children);
                  }
                  _list.push({
                    ...item,
                    id: JSON.stringify({
                      assetType: 'positions',
                      targets: [
                        {
                          type: 'org',
                          id: item.id,
                        },
                      ],
                    }),
                  });
                });
                return _list;
              };
              resolve(formatValue(resp.result));
            });
          }),
      },
    },
    {
      title: $t('Save.index.551010-24'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      search: {
        type: 'string',
      },
    },
    {
      title: $t('User.index.673867-17'),
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 180,
      scopedSlots: true,
    },
  ]
}
