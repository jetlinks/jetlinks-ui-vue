import type { Slots } from 'vue'
import { TOKEN_KEY } from '@/utils/variable'
import { message } from 'jetlinks-ui-components';
import {cloneDeep, isArray} from "lodash-es";

/**
 * 静态图片资源处理
 * @param path {String} 路径
 */
export const getImage = (path: string) => {
    return new URL('/images' + path, import.meta.url).href
}

export const LocalStore = {
  set(key: string, data: any) {
    localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data))
  },
  get(key: string) {
    const dataStr = localStorage.getItem(key)
    try {
      if (dataStr) {
        const data = JSON.parse(dataStr)
        return data && typeof data === 'object' ? data : dataStr
      } else {
        return dataStr
      }
    } catch (e) {
      return dataStr
    }
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
  removeAll() {
    localStorage.clear()
  }
}

export const getToken = () => {
  return LocalStore.get(TOKEN_KEY)
}

export const cleanToken = () => {
  LocalStore.remove(TOKEN_KEY)
}

/**
 * TreeSelect过滤
 * @param value 过滤值
 * @param treeNode
 * @param key
 */
export const filterTreeSelectNode = (value: string, treeNode: any, key: string = 'name'): boolean => {
  return treeNode[key]?.includes(value)
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

export function getSlot<T>(slots: Slots, props: Record<string, unknown>, prop = 'default'): T | false {
  if (props[prop] === false) {
    // force not render
    return false
  }
  return (props[prop] || slots[prop]) as T
}

export function getSlotVNode<T>(slots: Slots, props: Record<string, unknown>, prop = 'default'): T | false {
  if (props[prop] === false) {
    return false;
  }
  return (props[prop] || slots[prop]?.()) as T;
}


/**
 * 修改Select参数column的值
 * @param e // 查询参数 e
 * @param column {Object} {需要修改的值: 修改后的值}
 * {
        username: 'context.username',
    }
 */
export const modifySearchColumnValue = (e: any, column: object) => {
  e.terms.forEach((item: any) => {
      item.terms.forEach((t: any) => {
          if (column[t.column]) {
              t.column = column[t.column];
          }
      });
  });
  return e;
};

/**
 * 仅提示一次的message
 * @param msg 消息内容
 * @param type 消息类型
 */
export const onlyMessage = (msg: string, type: 'success' | 'error' | 'warning' = 'success', extra?: any) => {
  message[type]({
    content: msg,
    key: type,
    ...extra
  })
}

export interface SearchItemData {
  column: any;
  value: any;
  termType: string;
  type?: string;
}

export const handleParamsToString = (terms:SearchItemData[] = []) => {
  const _terms: any[] = [
    { terms: [null,null,null]},
    { terms: [null,null,null], type: 'and'}
  ]
  let termsIndex = 0
  let termsStar = 0
  terms.forEach((item, index) => {
    if (index > 2) {
      termsIndex = 1
      termsStar = 4
    }
    _terms[termsIndex].terms[index - termsStar ] = item
  })

  return JSON.stringify({ terms: _terms})
}

export const treeFilter = (data: any[], value: any, key: string = 'name'): any[] => {
  if (!data) return []

  return data.filter(item => {
    if (item.children && item.children.length) {
      item.children = treeFilter(item.children || [], value, key)
      return !!item.children.length
    } else {
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
  const cloneData = cloneDeep(data)
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

export const getBase64 = (img: File, callback: (base64Url: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);

  reader.onload = (result: any) => {
    console.log(result)
    callback(result.target.result)
  }
}

export const isFullScreen = () => {
  return !!(document.fullscreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen ||
      document.webkitFullScreen ||
      document.msFullScreen)
}
