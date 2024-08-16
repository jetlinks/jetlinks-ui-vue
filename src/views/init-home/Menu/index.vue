<template>
    <div class="menu-style">
        <div class="menu-img">
            <img :src="getImage('/init-home/menu.png')" />
        </div>
        <div class="menu-info">
            <b>{{ $t('Menu.index.633483-0',[count]) }}</b>
            <div>{{ $t('Menu.index.633483-1') }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import BaseMenu, { USER_CENTER_MENU_DATA } from '../data/baseMenu'
import { getSystemPermission, updateMenus } from '@/api/initHome';
import { protocolList } from '@/utils/consts';
import { getProviders } from '@/api/data-collect/channel';
import {
  systemVersion,
} from '@/api/login'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

/**
 * 获取菜单数据
 */
const menuDatas = reactive({
    count: 0,
    current: undefined,
});

/**
 * 查询支持的协议
 */
const getProvidersFn = async () => {
    let version = ''
    const req:any =await systemVersion()
    if(req.success && req.result){
        version = req.result.edition
    }
    if (version ==='community') {
        return undefined
    } else {
        try {
            const res: any = await getProviders();
            const ids = res.result?.map?.(item => item.id) || []
            return protocolList.some(item => ids.includes(item.value))
        } catch (error) {
            return false
        }

    }
}

/**
 * 获取当前系统权限信息
 */
const getSystemPermissionData = async () => {
    const hasProtocol = await getProvidersFn();
    const resp = await getSystemPermission();
    if (resp.status === 200) {
        const newTree = filterMenu(
            resp.result.map((item: any) => JSON.parse(item).id),
            BaseMenu,
            hasProtocol
        );
        const _count = menuCount(newTree);
        menuDatas.current = newTree;
        menuDatas.count = _count;
    }
};

/**
 * 过滤菜单
 */
const filterMenu = (permissions: string[], menus: any[], hasProtocol: boolean) => {
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
        if (!hasProtocol && item.code == 'link/DataCollect') {
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
        if (next.children) {
            _count = menuCount(next.children);
        }
        return pre + _count;
    }, 0);
};
/**
 * 添加options show用于控制菜单是否显示函数
 */
const dealMenu = (data:any) =>{
    data.forEach((item:any)=>{
        item.options = Object.assign({
          show: true
        }, item?.options || {})
        if(item.children){
            dealMenu(item.children)
        }
    })
}
/**
 * 初始化菜单
 */
const initMenu = async () => {
    return new Promise(async (resolve) => {
      //  用户中心
        dealMenu(menuDatas.current)
        // console.log([...menuDatas.current!, USER_CENTER_MENU_DATA]);
        const res = await updateMenus([...menuDatas.current!, USER_CENTER_MENU_DATA]);
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
