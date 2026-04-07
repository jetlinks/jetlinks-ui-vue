import dayjs from 'dayjs'
import { downloadFileByUrl, getImage, getToken, LocalStore } from '@jetlinks-web/utils'
import { getFileUrlById } from '@jetlinks-web-core/api/comm'
import { message } from 'ant-design-vue'
import { BASE_API, TOKEN_KEY } from '@jetlinks-web/constants'
import { isSubApp } from '@jetlinks-web-core/utils/consts'
import { isFunction, omit } from 'lodash-es'

export const downloadJson = (
  record: Record<string, any>,
  fileName: string,
  format?: string
) => {
  const _time = dayjs(new Date()).format(format || 'YYYY_MM_DD')
  const _download = `${fileName || record?.name}-${_time}`
  //字符串内容转成Blob地址
  const blob = new Blob([JSON.stringify(record)])
  const _url = URL.createObjectURL(blob)
  downloadFileByUrl(_url, _download, 'json')
}

/**
 * 修改Select参数column的值
 * @param e // 查询参数 e
 * @param column {Object} {需要修改的值: 修改后的值}
 * {
 username: 'context.username',
 }
 */
export const modifySearchColumnValue = (e: any, column: Record<string, any>) => {
  e.terms.forEach((item: any) => {
    item.terms.forEach((t: any) => {
      if (column[t.column]) {
        t.column = column[t.column]
      }
    })
  })
  return e
}

/**
 * 为了区分是本地的图片还是线上的图片
 * @param id
 */
export const getImageUrl = (id: string) => {
  if (id.includes('localhost')) {
    return getImage(id.replace('localhost', ''))
  }
  return getFileUrlById(id)
}

export const getAppId = () => {
  return LocalStore.get('app_id')
}

export const setAppId = (id: string) => {
  LocalStore.set('app_id', id)
}

/**
 * Select过滤
 * @param value 过滤值
 * @param option
 * @param key
 */
export const filterSelectNode = (
  value: string,
  option: any,
  key: string = 'label'
): boolean => {
  return option[key]?.includes(value)
}

/**
 * 仅提示一次的message
 * @param msg 消息内容
 * @param type 消息类型
 * @param extra 额外配置
 */
export const onlyMessage = (
  msg: string,
  type: 'success' | 'error' | 'warning' = 'success',
  extra?: any
) => {
  message[type]({
    content: msg,
    key: type,
    ...extra
  })
}

export const accessConfigTypeFilter = (data: any[]): any[] => {
  if (!data) return []
  return data.map((item) => ({ ...item, label: item.name, value: item.id }))
}

export const isFullScreen = () => {
  return !!(
    (document as any).fullscreen ||
    (document as any).mozFullScreen ||
    (document as any).webkitIsFullScreen ||
    (document as any).webkitFullScreen ||
    (document as any).msFullScreen
  )
}

export function isZhCN(name: string): boolean {
  return /-cn\/?$/.test(name)
}

export function mergeObjectArrays(a: any[], b: any[], key = 'key') {
  // 创建b的Map，基于key属性
  const bMap = new Map(b.map(item => [item[key], item]))

  // 过滤a中与b重复的元素，并用b的值覆盖
  const filteredA = a.filter(item => !bMap.has(item[key]))

  // 找出b中独有的元素
  const uniqueB = b.filter(bItem => !a.some(aItem => aItem[key] === bItem[key]))

  return [...uniqueB, ...filteredA]
}

export function getBaseApi() {
  if (isSubApp) {
    const global = (window as any).microApp.getGlobalData()
    return global.api?.getBaseApi() || BASE_API
  }

  return BASE_API
}

export const getUploadHeaders = () => ({
  [TOKEN_KEY]: getToken()
})

interface TransformTreeType<S>{
  filedNames?: {
    title?: string
    key?: string
    children?: string
    [key: string]: string
  },
  handleNode?: (item: S) => void
}
/**
 * 树结构处理器
 */
export const transformTree = <T extends Record<string, any>, S extends T>(data: T[], options?: TransformTreeType<S> = {}): {tree: S[], map: Map<string, S> } => {
  const nodeMap = new Map()
  const _options = Object.assign({filedNames: { title: 'name', children: 'children', key: 'id'} }, options)
  const filedNames = _options.filedNames
  const childrenKey = filedNames.children || 'children'
  const mapKey = filedNames.key || 'id'

  function walk(node: T, sourcePath: string[] = []): S {
    const key = node[mapKey]

    Object.keys(filedNames).forEach((targetKey: string) => {
      (node as Record<string, any>)[targetKey] = node[filedNames[targetKey]]
    })

    if (isFunction(_options.handleNode)) {
      _options.handleNode(node as S)
    }

    const children = node[childrenKey]
    if (children?.length) {
      (node[childrenKey] as S[]) = children.map((item: T) => walk(item, [...sourcePath, key ]))
    }

    node.__sourcePath__ = sourcePath

    if (key) {
      nodeMap.set(key, omit(node, ['children']))
    }

    return node as S
  }

  const tree = data.map(item => walk(item))

  return {
    tree: tree,
    map: nodeMap
  }
}
