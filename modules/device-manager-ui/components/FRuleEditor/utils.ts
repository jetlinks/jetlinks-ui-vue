/**
 场景
 树形数据过滤, 并保留原有树形结构不变, 即如果有子集被选中,父级同样保留。
 思路
 对数据进行处理，根据过滤标识对匹配的数据添加标识。如visible:true
 对有标识的子集的父级添加标识visible:true
 根据visible标识对数据进行递归过滤，得到最后的数据
 */

import { cloneDeep } from 'lodash-es';

export type TreeNode = {
    id: string;
    name: string;
    children: TreeNode[];
    visible?: boolean;
} & Record<string, any>;

/*
 *	对表格数据进行处理
 *	data 树形数据数组
 *	filter 过滤参数值
 *	filterType 过滤参数名
 */
export function treeFilter(data: TreeNode[], filter: string, filterType: string): TreeNode[] {
    const _data = cloneDeep(data);
    const traverse = (item: TreeNode[]) => {
        item.forEach((child) => {
            child.visible = filterMethod(filter, child, filterType);
            if (child.children) traverse(child.children);
            if (!child.visible && child.children?.length) {
                const visible = !child.children.some((c) => c.visible);
                child.visible = !visible;
            }
        });
    };
    traverse(_data);
    return filterDataByVisible(_data);
}

// 根据传入的值进行数据匹配, 并返回匹配结果
function filterMethod(val: string, data: TreeNode, filterType: string | number) {
    return data[filterType].includes(val);
}

// 递归过滤符合条件的数据
function filterDataByVisible(data: TreeNode[]) {
    return data.filter((item) => {
        if (item.children) {
            item.children = filterDataByVisible(item.children);
        }
        return item.visible;
    });
}

