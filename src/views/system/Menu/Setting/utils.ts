import type {
    AntTreeNodeDropEvent,
    TreeProps,
    TreeDataItem,
} from 'ant-design-vue/es/tree';

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

/**
 * 合并Map菜单转成Arr菜单
 * @param baseMenuData baseMenu developArrToMap平铺后的数据
 * @param systemMenuData systemMenu developArrToMap平铺后的数据
 * @returns 合并后的菜单
 */
export const mergeMapToArr = (baseMenuData: any, systemMenuData: any) => {
    const updataArr = (r: any) => {
        for (let i = 0; i < r.length; i++) {
            let child = r[i].children;
            if (child) {
                updataArr(child);
            }
            r[i] = newMap.get(r[i].code);
            r[i]?.parentCode && delete r[i].parentCode;
        }
    };
    const root: any = [];
    const newMap = new Map([...baseMenuData?.arrMap, ...systemMenuData.arrMap]);
    const newRootArr = [
        ...new Set([...baseMenuData?.rootSet, ...systemMenuData.rootSet]),
    ];
    newRootArr.forEach((item: any) => {
        newMap.has(item) && root.push(newMap.get(item));
    });
    updataArr(root);
    return root;
};

/**
 * 平铺菜单
 * @param value 默认菜单以及查询系统菜单 baseMenu systemMenu
 * @param checked 查询系统菜单传true
 * @param save 保存时传true
 * @returns 平铺菜单Map、根菜单名、系统选中的keys
 */
export const developArrToMap = (Menu: any, checked = false, save = false) => {
    const rootSet = new Set();
    const arrMap = new Map();
    const checkedKeys: any = [];
    const getMap = (arr: any, parentCode = 'root') => {
        arr.forEach((item: any) => {
            item.title = item.code;
            item.key = item.code;
            if (save) {
                delete item.checked; //保存时删除 checked 字段
                checkedKeys.push(item.code);
            } else {
                if (checked || item?.checked) {
                    item.checked = item?.checked || checked;
                    checkedKeys.push(item.code);
                }
            }

            arrMap.set(item.code, item);
            if (parentCode === 'root') {
                rootSet.add(item.code); //处理根菜单
            }
            if (item?.children) {
                getMap(item?.children, item.code);
            }
        });
    };
    getMap(Menu);
    return { arrMap, rootSet, checkedKeys };
};

/**
 * 选择功能
 * @param selecteds onSelect事件默认参数
 * @param e onSelect事件默认参数
 * @returns 处理后的keys
 */
export const select = (selecteds: Array<string>, e: any) => {
    const { node } = e;
    const childKeys: Array<string> = [];
    const getChildKeys = (data: any) => {
        data.forEach((item: any) => {
            childKeys.push(item.code);
            if (item?.children) {
                getChildKeys(item?.children);
            }
        });
    };
    if (node?.children) {
        getChildKeys(node.children);
    }

    const Keys = new Set(selecteds);
    const selectedAllKeys = [...[node.key, ...childKeys]];
    selectedAllKeys.forEach((item: string) => {
        Keys[e.selected ? 'add' : 'delete'](item);
    });
    return [...Keys];
};

/**
 * 拖拽功能
 * @param info  drop事件默认参数
 * @param treeData 当前treeData值
 * @returns 拖拽后treeData值
 */
export const drop = (info: AntTreeNodeDropEvent, treeData: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (
        data: TreeProps['treeData'],
        key: string | number,
        callback: any,
    ) => {
        data.forEach((item, index) => {
            if (item.key === key) {
                return callback(item, index, data);
            }
            if (item.children) {
                return loop(item.children, key, callback);
            }
        });
    };
    const data = [...treeData];

    let dragObj: TreeDataItem;
    loop(
        data,
        dragKey,
        (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
            arr.splice(index, 1);
            dragObj = item;
        },
    );
    if (!info.dropToGap) {
        loop(data, dropKey, (item: TreeDataItem) => {
            item.children = item.children || [];
            item.children.unshift(dragObj);
        });
    } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
    ) {
        loop(data, dropKey, (item: TreeDataItem) => {
            item.children = item.children || [];
            item.children.unshift(dragObj);
        });
    } else {
        let ar: TreeProps['treeData'] = [];
        let i = 0;
        loop(
            data,
            dropKey,
            (
                _item: TreeDataItem,
                index: number,
                arr: TreeProps['treeData'],
            ) => {
                ar = arr;
                i = index;
            },
        );
        if (dropPosition === -1) {
            ar.splice(i, 0, dragObj);
        } else {
            ar.splice(i + 1, 0, dragObj);
        }
    }
    return data;
};

// 查找最深层级
export const getMaxDepth = (data: any) => {
    let maxDepth = 0;
    data.forEach((node: any) => {
        const depth = getNodeDepth(node);
        if (depth > maxDepth) {
            maxDepth = depth;
        }
    });
    return maxDepth;
};
export const getNodeDepth = (node: any) => {
    let depth = 1;
    if (node.children) {
        node.children.forEach((child: any) => {
            const childDepth = getNodeDepth(child) + 1;
            if (childDepth > depth) {
                depth = childDepth;
            }
        });
    }
    return depth;
};
