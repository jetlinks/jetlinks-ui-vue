import proMenu from './baseMenu';

const menusModule = import.meta.glob('../../../modules/**/baseMenu.ts', {eager: true});
const modules = Object.values(menusModule);
const menus = modules.map((item) => item.default?.());

let baseModuleMenu = [...proMenu];

/**
 * 合并菜单数据
 * @param tree1 基础菜单数据
 * @param tree2 云端菜单数据
 * @returns 合并后的菜单数据
 */
const mergeTrees = (tree1: any[], tree2: any[]) => {
  const map = new Map();

  function addToMap(nodes: any[]) {
    for (const node of nodes) {
      if (!map.has(node.code)) {
        map.set(node.code, { ...node, children: [] });
      }
      const existing = map.get(node.code);
      existing.children = mergeTrees(existing.children || [], node.children || []);
    }
  }

  addToMap(tree1);
  addToMap(tree2);

  return Array.from(map.values());
}

menus.forEach((item) => {
  // baseModuleMenu.push(...item);
  if (item?.length) {
    baseModuleMenu = mergeTrees(baseModuleMenu, item)
  }
})

export default [
  ...baseModuleMenu,
]
