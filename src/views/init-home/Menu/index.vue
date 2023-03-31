<template>
    <div class="menu-style">
        <div class="menu-img">
            <img :src="getImage('/init-home/menu.png')" />
        </div>
        <div class="menu-info">
            <b>系统初始化{{ count }}个菜单</b>
            <div>初始化后的菜单可在“菜单管理”页面进行维护管理</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import BaseMenu, { MESSAGE_SUBSCRIBE_MENU_DATA, USER_CENTER_MENU_DATA } from '../data/baseMenu'
import { getSystemPermission, updateMenus } from '@/api/initHome';
/**
 * 获取菜单数据
 */
const menuDatas = reactive({
    count: 0,
    current: undefined,
});
/**
 * 获取当前系统权限信息
 */
const getSystemPermissionData = async () => {
    const resp = await getSystemPermission();
    if (resp.status === 200) {
        const newTree = filterMenu(
            resp.result.map((item: any) => JSON.parse(item).id),
            BaseMenu,
        );
        const _count = menuCount(newTree);
        menuDatas.current = newTree;
        menuDatas.count = _count;
    }
};
/**
 * 过滤菜单
 */
const filterMenu = (permissions: string[], menus: any[]) => {
    return menus.filter((item) => {
        let isShow = false;
        if (item.showPage && item.showPage.length) {
            isShow = item.showPage.every((pItem: any) => {
                return permissions.includes(pItem);
            });
        }
        if (item.children) {
            item.children = filterMenu(permissions, item.children);
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
        if (next.children) {
            _count = menuCount(next.children);
        }
        return pre + _count;
    }, 0);
};
/**
 * 初始化菜单
 */
const initMenu = async () => {
    return new Promise(async (resolve) => {
      //  用户中心
        const res = await updateMenus([...menuDatas.current!, USER_CENTER_MENU_DATA, MESSAGE_SUBSCRIBE_MENU_DATA]);
        if (res.status === 200) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
};
const { count } = toRefs(menuDatas);
getSystemPermissionData();
defineExpose({
    updataMenu: initMenu,
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