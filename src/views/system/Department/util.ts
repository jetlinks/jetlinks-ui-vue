import { TreeType } from "./typings"
import i18n from "@/locales"
import { queryPageNoPage } from '@/api/system/positions'
import {getUserList_api} from "@/api/system/user";
import { isNoCommunity } from "@/utils/utils";

export const ArrayToTree = (list: any[]): any[] => {
    const treeList: any[] = []
    // 所有项都使用对象存储起来
    const map = {}

    // 建立一个映射关系：通过id快速找到对应的元素
    list.forEach((item) => {
        if (!item.children) {
            item.children = []
        }
        map[item.id] = item
    })

    list.forEach((item) => {
        // 对于每一个元素来说，先找它的上级
        //    如果能找到，说明它有上级，则要把它添加到上级的children中去
        //    如果找不到，说明它没有上级，直接添加到 treeList
        const parent = map[item.parentId]
        // 如果存在则表示item不是最顶层的数据
        if (parent) {
            parent.children.push(item)
        } else {
            // 如果不存在 则是顶层数据
            treeList.push(item)
        }
    })
    // 返回出去
    return treeList
}

/**
 * 在给定的树中通过id匹配
 * @param node
 * @param id
 */
export const findItemById = (node: TreeType[], id: string): TreeType | null => {
    let result: any = null
    for (const item of node) {
        if (item.id === id) return item
        else if (item.children && item.children.length > 0) {
            result = findItemById(item.children, id)
            if (result) return result
        }
    }
    return null
}

/**
 * 将此树下的所有节点禁用
 * @param treeNode
 */
export const filterTree = (treeNode: TreeType[]) => {
    if (treeNode.length < 1) return
    treeNode.forEach((item) => {
        item.disabled = true
        item.children && item.children.length > 0 && filterTree(item.children)
    })
}

// 用户
export const useColumns = (departmentId: string) => {
    const arr = [
      {
        title: i18n.global.t('Department.util.780026-0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
            componentProps: {
                placeholder: i18n.global.t('Department.util.780026-1'),
            },
        },
      },
      {
          title: i18n.global.t('Department.util.780026-2'),
          dataIndex: 'username',
          key: 'username',
          ellipsis: true,
          search: {
              type: 'string',
              componentProps: {
                  placeholder: i18n.global.t('Department.util.780026-3'),
              },
          },
      },
      {
          title: i18n.global.t('Department.util.780026-4'),
          dataIndex: 'status',
          key: 'status',
          search: {
              type: 'select',
              // componentProps: {
              //     placeholder: i18n.global.t('Department.util.780026-5'),
              // },
              options: [
                  {
                      label: i18n.global.t('Department.util.780026-6'),
                      value: 1,
                  },
                  {
                      label: i18n.global.t('Department.util.780026-7'),
                      value: 0,
                  },
              ],
          },
          scopedSlots: true,
          width: 100
      },
      {
          title: i18n.global.t('Department.util.780026-8'),
          dataIndex: 'action',
          key: 'action',
          scopedSlots: true,
          width: 100
      },
    ]
    if(isNoCommunity) {
      arr.splice(2,1,{
        title: i18n.global.t('Department.util.780026-9'),
        dataIndex: 'positions',
        key: 'positions',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            termFilter: ['not', 'in', 'nin'],
            // componentProps: {
            //     placeholder: i18n.global.t('Department.util.780026-3'),
            // },
            options() {
                const params = departmentId ? {terms: [{column: 'orgId', value: departmentId}]} : {}
                return queryPageNoPage(params).then(resp => {
                    if (resp.success) {
                        return resp.result.map(item => {
                            return {
                                label: item.name,
                                value: item.id
                            }
                        })
                    }
                    return []
                })
            }
        },
      })
    }
    return arr
}

// 绑定用户
export const bindUserColumns = [
    {
        title: i18n.global.t('Department.util.780026-0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: i18n.global.t('Department.util.780026-1'),
            },
        },
    },
    {
        title: i18n.global.t('Department.util.780026-2'),
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: i18n.global.t('Department.util.780026-3'),
            },
        },
    },
]

// 请求数据
export const requestFun = async (parentId: string, oParams: any, defaultParams: any) => {
    console.log(parentId, oParams)
    if (parentId) {
        const params = {
            ...oParams,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                ...oParams.terms,
                ...defaultParams
            ],
        }
        return await getUserList_api(params)
    } else {
        return {
            code: 200,
            result: {
                data: [],
                pageIndex: 0,
                pageSize: 12,
                total: 0,
            },
            status: 200,
        }
    }
}
