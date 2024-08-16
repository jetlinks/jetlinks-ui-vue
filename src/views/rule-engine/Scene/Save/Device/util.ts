import i18n from '@/i18n'

const $t = i18n.global.t
import { getImage } from '@/utils/comm'

export const TypeName = {
  online: $t('Device.util.5425839-0'),
  offline: $t('Device.util.5425839-1'),
  reportEvent: $t('Device.util.5425839-2'),
  reportProperty: $t('Device.util.5425839-3'),
  readProperty: $t('Device.util.5425839-4'),
  writeProperty: $t('Device.util.5425839-5'),
  invokeFunction: $t('Device.util.5425839-6'),
};

export const TypeEnum = {
  reportProperty: {
    label: $t('Device.util.5425839-3'),
    value: 'reportProperty',
    img: getImage('/scene/reportProperty.png'),
    disabled: true
  },
  reportEvent: {
    label: $t('Device.util.5425839-2'),
    value: 'reportEvent',
    img: getImage('/scene/reportProperty.png'),
    disabled: true
  },
  readProperty: {
    label: $t('Device.util.5425839-4'),
    value: 'readProperty',
    img: getImage('/scene/readProperty.png'),
    disabled: true
  },
  writeProperty: {
    label: $t('Device.util.5425839-5'),
    value: 'writeProperty',
    img: getImage('/scene/writeProperty.png'),
    disabled: true
  },
  invokeFunction: {
    label: $t('Device.util.5425839-6'),
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
