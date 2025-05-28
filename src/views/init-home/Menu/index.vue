<template>
  <div class="menu-style">
    <div class="menu-img">
      <img :src="getImage('/init-home/menu.png')" />
    </div>
    <div class="menu-info">
      <b>{{ $t("Menu.index.459633-0", [menusData.count]) }}</b>
      <div>{{ $t("Menu.index.459633-2") }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getImage } from "@jetlinks-web/utils";
import { USER_CENTER_MENU_DATA } from "../data/baseMenu";
import BaseMenuData, { mergeTrees, handleMenuOptions } from '../data'
import {
  updateMenus,
  systemVersion,
  queryModule,
  getSystemPermission,
} from "@/api/initHome";
import { OpenMicroApp } from "@/utils/consts";
import { BASE_API } from '@jetlinks-web/constants'
import { useApplication } from '@/store'

const app = useApplication()
/**
 * 获取菜单数据
 */
const menusData = reactive({
  count: 0,
  current: [],
});

/**
 * 查询支持的协议
 */
const getProvidersFn = async () => {
  let version = "";
  const req: any = await systemVersion();
  if (req.success && req.result) {
    version = req.result.edition;
  }

  if (version === "community") {
    return false;
  }

  try {
    const res = await queryModule();
    return res.success && res.result.length
  } catch (error) {
    return false;
  }
};

/**
 * 获取当前系统权限信息
 */
const getSystemPermissionData = async ( BaseMenu: any[] ) => {
  const hasProtocol = await getProvidersFn();
  const resp = await getSystemPermission();
  if (resp.success) {
    const newTree = filterMenu(
      resp.result.map((item: any) => JSON.parse(item).id),
      BaseMenu,
      hasProtocol,
    );
    const _count = menuCount(newTree);
    menusData.current = newTree;
    menusData.count = _count;
    console.log(newTree)
  }
};

/**
 * 过滤菜单
 */
const filterMenu = (
  permissions: string[],
  menus: any[],
  hasProtocol: boolean,
) => {
  return menus.filter((item) => {
    let isShow = false;
    if (item.showPage && item.showPage.length) {
      isShow = item.showPage.some((pItem: any) => {
        return permissions.includes(pItem);
      });
    }
    if (item.children) {
      item.children = filterMenu(permissions, item.children, hasProtocol);
    }
    if (!hasProtocol && item.options?.hasProtocol) {
      return false;
    }
    return isShow || !!item.children?.length;
  });
};

/**
 * 计算菜单数量
 */
const menuCount = (menus: any[]) => {
  return menus.reduce((pre, next) => {
    let _count = 1;

    if (next.children?.length) {
      _count = menuCount(next.children);
    }
    return pre + _count;
  }, 0);
};
/**
 * 添加options show用于控制菜单是否显示函数
 */
const dealMenu = (data: any) => {
  data.forEach((item: any) => {
    item.options = Object.assign(
      {
        show: true,
      },
      item?.options || {},
    );
    if (item.children) {
      dealMenu(item.children);
    }
  });
};
/**
 * 初始化菜单
 */
const initMenu = async () => {
  return new Promise(async (resolve) => {
    //  用户中心
    dealMenu(menusData.current);
    const res = await updateMenus([
      ...menusData.current!,
      USER_CENTER_MENU_DATA,
    ]);
    resolve(res.success)
  });
};

const getCloudMenu = async () => {
  let bseMenus = await BaseMenuData();

  if (app.appList.length > 0 && OpenMicroApp) {
    const appItems = app.appList.filter(item => !item.path.startsWith('http'))

    for (const item of appItems) {
      let _path = item.path.startsWith('/') ? item.path : '/' + item.path
      const url = `${window.location.protocol}//${document.location.host}${BASE_API}${_path}/baseMenu.json`
      const resp = await fetch(url)
      if (resp.ok) {
        const res = await resp.json()
        bseMenus = mergeTrees(bseMenus, handleMenuOptions(res, item))
      }
    }
  }

  getSystemPermissionData(bseMenus)
}

getCloudMenu()


defineExpose({
  updateMenu: initMenu,
});
</script>
<style lang="less" scoped>
.menu-style {
  display: flex;
  align-items: center;
  .menu-img {
    margin-right: 16px;
  }
}
</style>
