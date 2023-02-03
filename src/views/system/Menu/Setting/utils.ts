import { TreeProps } from "ant-design-vue";

/**
 * 根据权限过滤菜单
 */
export const filterMenu = (permissions: string[], menus: any[]) => {
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

// 在树形结构中对id进行匹配，通过callback对匹配id的对象进行操作
export const loop= (data: TreeProps['treeData'], id: string | number, callback: any) => {
    data?.forEach((item, index) => {
        if (item.id === id) {
            return callback(item, index, data);
        }
        if (item.children) {
            return loop(item.children, id, callback);
        }
    });
}
// 
export const getKeys = (data: any[]): (string | number)[] => {
    return data.reduce((pre: (string | number)[], next: any) => {
        const childrenKeys = next.children ? getKeys(next.children) : [];
        return [...pre, next.code, ...childrenKeys];
    }, []);
}