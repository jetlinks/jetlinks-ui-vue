import {cloneDeep, isArray} from "lodash-es";
export const treeFilter = (data: any[], value: any, key: string = 'name'): any[] => {
    if (!data) return []

    return data.filter(item => {
      if (item.children && item.children.length) {
        item.children = treeFilter(item.children || [], value, key)
        return !!item.children.length
      } else {
        if (!item.hasOwnProperty('fullName')) {
          item.fullName = item.label || item.name
        }
        return item[key] === value
      }
    })
  }

  /**
 * 通过子节点获取上级相应数据
 * @param data 树形数据
 * @param search 搜索值
 * @param searchKey 搜索key
 * @param returnKey 返回key
 */
export const openKeysByTree = (data: any[], search: any, searchKey: string = 'id', returnKey: string = 'id'): any[] => {
  if (!data || (data && !isArray(data))) return []
    console.log('openKeysByTree',data)
  const cloneData = JSON.parse(JSON.stringify(data))
  const filterTree = treeFilter(cloneData, search, searchKey)
  const openKeys: any[] = []

  const findKey = (treeData: any[]) => {
    for (let i = 0; i < treeData.length; i++) {
      const item = treeData[i]
      openKeys.push(item[returnKey])
      if (item.children && item.children.length) {
        findKey(item.children)
      }
    }
  }

  findKey(filterTree)
  return openKeys
}

/**
 * Select过滤
 * @param value 过滤值
 * @param option
 * @param key
 */
export const filterSelectNode = (value: string, option: any, key: string = 'label'): boolean => {
  return option[key]?.includes(value)
}
