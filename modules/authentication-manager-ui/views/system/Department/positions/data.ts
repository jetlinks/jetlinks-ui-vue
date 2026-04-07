import { useI18n } from 'vue-i18n';
import {queryRole_api} from "@authentication-manager-ui/api/system/user";
import {getTreeData_api} from "@authentication-manager-ui/api/system/department";
import {useRequest} from "@jetlinks-web/hooks";
import {queryPageNoPage, queryPositionDetailNoPage} from "@authentication-manager-ui/api/system/positions";
import {getDepartmentList_api} from "@jetlinks-web-core/api/system/user";

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
        options: () => queryPageNoPage({ paging: false, sorts: [{name: 'createTime', order: 'desc'}] }).then(resp => {
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
            getTreeData_api({
              paging: false,
              sorts: [{ name: 'sortIndex', order: 'asc' }, { name: 'name', order: 'asc' }]
            }).then((resp: any) => {
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

export const usePositionList = (params: any, onSuccess?: (result: Array<Record<string, any>>) => Array<Record<string, any>>) => {
  const { data } = useRequest(queryPositionDetailNoPage, {
    onSuccess(resp) {
      if (onSuccess) {
        return onSuccess(resp.result)
      }
      return resp.result.map((item: any) => ({ ...item, value: item.id, label: item.name }))
    },
    defaultParams: params
  })

  return { data }
}

const handleOrgData = (orgList = [], positionList = []): any[] => {
  return orgList.map((item: any) => {
    const _children = positionList.filter((pos: any) => pos.orgId === item.id).map((_pos: any) => {
      return {
        ..._pos,
        label: _pos.name,
        value: _pos.id
      }
    })
    return {
      ...item,
      disabled: true,
      label: item.name,
      value: item.id,
      children: [...handleOrgData(item.children || [], positionList), ..._children]
    }
  })
}

export const getPositionTree = async () => {
  const resp = await getDepartmentList_api({
    paging: false,
    sorts: [
      { name: "sortIndex", order: "asc" },
      { name: "createTime", order: "asc" },
    ]
  })
  const response = await queryPageNoPage({sorts: [{name: 'createTime', order: 'desc'}], paging: false})
  if(resp.success && response.success){
    return handleOrgData(resp.result, response.result)
  }
  return []
}
