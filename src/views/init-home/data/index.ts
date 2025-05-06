import proMenu from './baseMenu';

const menusModule = import.meta.glob('../../../modules/**/baseMenu.ts', {eager: true});
const modules = Object.values(menusModule);
const menus = modules.map((item) => item.default?.());

const baseModuleMenu = [...proMenu];


export const handleChildren = (trees: any[]) => {
  const nodeMap = new Map();

  function mergeNode(node: any) {
    const existing = nodeMap.get(node.code);
    if (existing) {
      // 合并 children（递归）
      const children = [...(existing.children || []), ...(node.children || [])];
      existing.children = handleChildren(children); // 递归合并 children
    } else {
      // 深拷贝避免污染原始数据
      nodeMap.set(node.code, {
        ...node,
        children: node.children ? handleChildren(node.children) : []
      });
    }
  }

  trees.forEach((tree: any) => mergeNode(tree));

  return Array.from(nodeMap.values());
}

export const handleBaseMenu = () => {
  return handleChildren(baseModuleMenu)
}

menus.forEach((item) => {
  baseModuleMenu.push(...item);
})

export default [
  ...baseModuleMenu,
]
