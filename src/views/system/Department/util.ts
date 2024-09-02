import { getBindUserList_api } from "@/api/system/department"
import { TreeType } from "./typings"

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
export const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入姓名',
            },
        },
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入用户名',
            },
        },
    },

    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'select',
            componentProps: {
                placeholder: '请选择',
            },
            options: [
                {
                    label: '正常',
                    value: 1,
                },
                {
                    label: '禁用',
                    value: 0,
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
        width: '200px',
    },
]

// 绑定用户
export const bindUserColumns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入姓名',
            },
        },
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
        search: {
            type: 'string',
            componentProps: {
                placeholder: '请输入用户名',
            },
        },
    },
]

// 请求数据
export const requestFun = async (parentId: string, oParams: any, defaultParams: any) => {
    if (parentId) {
        const params = {
            ...oParams,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                ...oParams.terms,
                ...defaultParams
            ],
        }
        return await getBindUserList_api(params)
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