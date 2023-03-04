import type { Slots } from 'vue'
import { TOKEN_KEY } from '@/utils/variable'
import { message } from 'jetlinks-ui-components';

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
export const onlyMessage = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
  message[type]({
    content: msg,
    key: type
  })
}