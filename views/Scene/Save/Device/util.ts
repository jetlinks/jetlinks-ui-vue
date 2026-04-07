import i18n from '@jetlinks-web-core/locales/index'
import { sceneImages } from "../../../../assets/index";

const $t = i18n.global.t
export const TypeName = {
  online: $t('Device.util.372528-0'),
  offline: $t('Device.util.372528-1'),
  reportEvent: $t('Device.util.372528-2'),
  reportProperty: $t('Device.util.372528-3'),
  readProperty: $t('Device.util.372528-4'),
  writeProperty: $t('Device.util.372528-5'),
  invokeFunction: $t('Device.util.372528-6'),
};

export const TypeEnum = {
  reportProperty: {
    label: $t('Device.util.372528-3'),
    value: 'reportProperty',
    img: sceneImages.reportProperty,
    disabled: true
  },
  reportEvent: {
    label: $t('Device.util.372528-2'),
    value: 'reportEvent',
    img: sceneImages.reportProperty,
    disabled: true
  },
  readProperty: {
    label: $t('Device.util.372528-4'),
    value: 'readProperty',
    img: sceneImages.readProperty,
    disabled: true
  },
  writeProperty: {
    label: $t('Device.util.372528-5'),
    value: 'writeProperty',
    img: sceneImages.writeProperty,
    disabled: true
  },
  invokeFunction: {
    label: $t('Device.util.372528-6'),
    value: 'invokeFunction',
    img: sceneImages.invokeFunction,
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
