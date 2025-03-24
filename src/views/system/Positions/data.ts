import { useI18n } from 'vue-i18n';
import {queryRole_api} from "@/api/system/user";
import {getTreeData_api} from "@/api/system/department";
import {useRequest} from "@jetlinks-web/hooks";
import {queryPageNoPage} from "@/api/system/positions";

export const useColumns = () => {
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
      title: $t('components.Save.069696-2'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: {
        type: 'string',
      },
    },
    {
      title: $t('User.index.673867-13'),
      dataIndex: 'roles',
      key: 'roles',
      search: {
        type: 'select',
        termFilter: ['not', 'in', 'nin'],
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
      title: $t('positions.index.223804-1'),
      dataIndex: 'parentId',
      key: 'parentId',
      ellipsis: true,
      scopedSlots: true,
      search: {
        type: 'select',
        options: () => queryPageNoPage().then(resp => {
          return resp.result?.map((item: any) => ({
            ...item,
            label: item.name,
            value: item.id
          })) || []
        })
      },
    },
    {
      dataIndex: 'orgId',
      title: $t('Instance.index.133466-16'),
      // hideInTable: true,
      scopedSlots: true,
      search: {
        type: 'treeSelect',
        termOptions: ['eq'],
        options: () =>
          new Promise((resolve) => {
            getTreeData_api({}).then((resp: any) => {
              const formatValue = (list: any[]) => {
                const _list: any[] = [];
                list.forEach((item) => {
                  if (item.children) {
                    item.children = formatValue(item.children);
                  }
                  _list.push({
                    ...item,
                    label: item.name,
                    value: item.id
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
      width: 100,
      scopedSlots: true,
    },
  ]
}

export const usePositionList = (params: any) => {
  const { data } = useRequest(queryPageNoPage, {
    onSuccess(resp) {
      return resp.result.map((item: any) => ({ ...item, value: item.id, label: item.name }))
    },
    defaultParams: params
  })

  return { data }
}
