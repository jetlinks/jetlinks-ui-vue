import { cloneDeep } from 'lodash-es';
import type {
    AntTreeNodeDropEvent,
    TreeProps,
    TreeDataItem,
} from 'ant-design-vue/es/tree';
import {messageSubscribe, USER_CENTER_MENU_CODE} from "@/utils/consts";

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
 * 合并数组(合并菜单)
 * @param oldData Array 默认菜单
 * @param newData Array 当前系统菜单
 * @returns Array 合并后的菜单
 */
export const mergeArr = (oldData: Array<any>, newData: Array<any>) => {
    const mergedData = [];

    const { checkedKeys } = initData(cloneDeep(newData));
    const filterCodeSet = new Set(checkedKeys); //记录系统选中
    const mergeItem: any = (oldItem: any, newItem: any) => {
        if (!oldItem) {
            return newItem;
        }

        if(oldItem && newItem){
            oldItem.sortIndex = newItem?.sortIndex
        }

        if (!oldItem.children && newItem.children) {
            oldItem.children = newItem.children;
            return oldItem;
        }

        // if (oldItem.children && !newItem.children) {
        //     return oldItem;
        // }

        if (oldItem.children && newItem.children) {
            const mergedChildren = [];
            const newChildren = [...newItem.children];
            for (const oldChild of oldItem.children) {
                const index = newChildren.findIndex(
                    (child) => child.code === oldChild.code,
                );
                if (index !== -1) {
                    mergedChildren.push(mergeItem(oldChild, newChildren[index]));
                    newChildren.splice(index, 1);
                } else {
                    //防止重复code，系统已经选中的code不能再从old中添加
                    if (!filterCodeSet.has(oldChild.code)) {
                        mergedChildren.push(oldChild);
                    }
                }
            }

            return {
                ...oldItem,
                children: mergedChildren.concat(newChildren),
            };
        }

        return oldItem
    };

    for (const newItem of newData) {
        const oldItem = oldData.find((item) => item.code === newItem.code);
        mergedData.push(mergeItem(oldItem, newItem));
    }
    for (const oldItem of oldData) {
        if (!filterCodeSet.has(oldItem.code)) {
            const newItem = newData.find((item) => item.code === oldItem.code);
            if (!newItem) {
                //防止重复code，系统已经选中的code不能再从old中添加
                if (!filterCodeSet.has(oldItem.code)) {
                    if (oldItem.children) {
                        oldItem.children = oldItem.children.filter(
                            (i: any) => !filterCodeSet.has(i.code),
                        );
                    }
                }

                mergedData.push(oldItem);
            }
        }
    }

    return mergedData
};

/**
 * 初始化菜单
 * @param value 默认菜单以及查询系统菜单 baseMenu systemMenu
 * @returns 系统选中的keys
 */
export const initData = (Menu: any) => {
    const checkedKeys: any = [];
    const getMap = (arr: any) => {
        arr.forEach((item: any) => {
            item.title = item.code;
            item.key = item.code; // treeData需要唯一key
            checkedKeys.push(item.code);
            if (item?.children) {
                getMap(item?.children);
            }
        });
    };
    getMap(Menu);
    return { checkedKeys };
};

/**通过options判断选中菜单 */
export const inItSelected = (Menu:any) =>{
    const checkedKeys: any = [];
    const getMap = (arr: any) => {
        arr.forEach((item: any) => {
            item.title = item.code;
            item.key = item.code; // treeData需要唯一key
            item?.options?.show === false ?  '' : checkedKeys.push(item.code);
            if (item.children) {
                getMap(item?.children);
            }
        });
    };
    getMap(Menu);
    return { checkedKeys };
}

/**
 * 查找父级、子级code
 * @param data 当前完整的菜单
 * @param code 当前点击的code
 * @returns result = {
        parents: [], //当前code的全部父级code
        children: [],//当前code的全部子级code
    };
 */

export const findAllParentsAndChildren = (data: any, code: any) => {
    const result = {
        parents: [],
        children: [],
    };

    function findParentsAndChildrenRecursive(node: any) {
        if (node.code === code) {
            if (node.children) {
                result.children = node.children.flatMap((child: any) => {
                    if (child.children) {
                        return [
                            child.code,
                            ...findChildrenRecursive(child.children),
                        ];
                    }
                    return [child.code];
                });
            }
            return true;
        }

        if (node.children) {
            for (let child of node.children) {
                if (findParentsAndChildrenRecursive(child)) {
                    result.parents.push(node.code);
                    return true;
                }
            }
        }
        return false;
    }

    function findChildrenRecursive(children: any) {
        return children.flatMap((child: any) => {
            if (child.children) {
                return [child.code, ...findChildrenRecursive(child.children)];
            }
            return [child.code];
        });
    }

    for (let node of data) {
        if (findParentsAndChildrenRecursive(node)) {
            break;
        }
    }

    return result;
};
/**
 * 选择功能
 * @param selecteds onSelect事件默认参数
 * @param e onSelect事件默认参数
 * @returns 处理后的keys
 */
export const select = (selecteds: Array<string>, e: any, treeData: any) => {
    const { node, selected } = e;
    const { parents, children } = findAllParentsAndChildren(
        treeData,
        node.code,
    );
    const Keys = new Set(selecteds);
    const selectedAllKeys = selected
        ? [...[...parents, ...children]]
        : [...children];
    selectedAllKeys.forEach((item: string) => {
        Keys[selected ? 'add' : 'delete'](item);
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


export const handleSorts = (node: any[]) => {
    if (!node) return []
    return node.map((item, index) => {
        if (item.index !== index) {
            item.sortIndex = index + 1
            if (item.children) {
                item.children = handleSorts(item.children).sort((a, b) => a.sortIndex - b.sortIndex)
            }
        }
        return item
    })
}

export const handleSortsArr = (node: any[]) => {
    if (!node) return []
    return node.sort((a, b) => a.sortIndex - b.sortIndex).map((item) => {
        if (item.children) {
            item.children = handleSortsArr(item.children)
        }
        return item
    })
}

export const handleMergeTree = (treeA: any[], treeB: any[]) => {
    const map = new Map();

    // 遍历并构建 Map（以 id 为 key）
    function addNodes(nodes) {
        for (const node of nodes) {
            if (!node || typeof node !== 'object') continue;

            const existing = map.get(node.id);
            if (existing) {
                // 合并当前节点的 children
                const childrenA = existing.children || [];
                const childrenB = node.children || [];
                existing.children = handleMergeTree(childrenA, childrenB);
            } else {
                // 深拷贝新节点并加入 Map
                map.set(node.id, {
                    ...node,
                    children: node.children ? handleMergeTree(node.children, []) : []
                });
            }
        }
    }

    addNodes(treeA);
    addNodes(treeB);

    return Array.from(map.values());
}

export const handleMenuFilterMessage = (menus: any[] = []) => {
    return menus.filter(item => ![USER_CENTER_MENU_CODE, messageSubscribe].includes(item.code))
}
