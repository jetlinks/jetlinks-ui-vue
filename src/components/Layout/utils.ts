import type { MenuDataItem } from 'components/Layout/typings'
import type { RouteRecord, RouteRecordRaw } from 'vue-router'

export function getMenuFirstChildren(menus: MenuDataItem[], key?: string) {
  return key === undefined ? [] : (menus[menus.findIndex((menu) => menu.path === key)] || {}).children || [];
}

export function clearMenuItem(menusData: RouteRecord[] | RouteRecordRaw[]): RouteRecordRaw[] {
  return menusData
    .map((item: RouteRecord | RouteRecordRaw) => {
      const finalItem = { ...item };
      if (finalItem.meta?.hideInMenu) {
        return null;
      }

      if (finalItem && finalItem?.children) {
        if (
          !finalItem.meta?.hideChildInMenu &&
          finalItem.children.some(
            (child: RouteRecord | RouteRecordRaw) => child && !child.meta?.hideInMenu
          )
        ) {
          return {
            ...item,
            children: clearMenuItem(finalItem.children),
          };
        }
        delete finalItem.children;
      }
      return finalItem;
    })
    .filter((item) => item) as RouteRecordRaw[];
}

export function flatMap(menusData: RouteRecord[]): MenuDataItem[] {
  return menusData
    .map((item) => {
      const finalItem = { ...item } as MenuDataItem;
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null;
      }
      if (finalItem.children) {
        delete finalItem.children;
      }
      return finalItem;
    })
    .filter((item) => item) as MenuDataItem[];
}
