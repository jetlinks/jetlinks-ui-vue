import { getImage } from '@/utils/comm'

export const TypeName = {
  online: '设备上线',
  offline: '设备离线',
  reportEvent: '事件上报',
  reportProperty: '属性上报',
  readProperty: '读取属性',
  writeProperty: '修改属性',
  invokeFunction: '功能调用',
};

export const TypeEnum = {
  reportProperty: {
    label: '属性上报',
    value: 'reportProperty',
    img: getImage('/scene/reportProperty.png'),
    disabled: true
  },
  reportEvent: {
    label: '事件上报',
    value: 'reportEvent',
    img: getImage('/scene/reportProperty.png'),
    disabled: true
  },
  readProperty: {
    label: '读取属性',
    value: 'readProperty',
    img: getImage('/scene/readProperty.png'),
    disabled: true
  },
  writeProperty: {
    label: '修改属性',
    value: 'writeProperty',
    img: getImage('/scene/writeProperty.png'),
    disabled: true
  },
  invokeFunction: {
    label: '功能调用',
    value: 'invokeFunction',
    img: getImage('/scene/invokeFunction.png'),
    disabled: true
  },
};

export const getExpandedRowById = (id: string, data: any[]): string[] => {
  const expandedKeys:string[] = []
  const dataMap = new Map()

  const flatMapData = (flatData: any[]) => {
    flatData.forEach(item => {
      dataMap.set(item.id, { pid: item.parentId })
      if (item.children && item.children.length) {
        flatMapData(item.children)
      }
    })
  }

  const getExp = (_id: string) => {
    const item = dataMap.get(_id)
    if (item) {
      expandedKeys.push(_id)
      if (dataMap.has(dataMap)) {
        getExp(item.pid)
      }
    }
  }

  flatMapData(data)

  getExp(id)

  return expandedKeys
}
