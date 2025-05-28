import proMenu from './baseMenu';
import {getModulesMenu} from '@/utils/modules'
/**
 * 合并菜单数据
 * @param tree1 基础菜单数据
 * @param tree2 云端菜单数据
 * @returns 合并后的菜单数据
 */
export const mergeTrees = (tree1: any[], tree2: any[]) => {
  const map = new Map();

  function addToMap(nodes: any[]) {
    for (const node of nodes) {
      if (!map.has(node.code)) {
        map.set(node.code, { ...node, children: [] });
      }
      const existing = map.get(node.code);
      existing.children = mergeTrees(existing.children || [], node.children || []);;
    }
  }

  addToMap(tree1);
  addToMap(tree2);

  return Array.from(map.values());
}

export const handleMenuOptions = (menus: any[], p: { id: string, name: string}): any[] => menus.map(item => ({
  ...item,
  children: item.children ? handleMenuOptions(item.children, p) : undefined,
  options: { appName: p.id || p.name, ...item.options }
}))

const BaseMenuFn = async () => {
  const modules = await getModulesMenu()
  let baseModuleMenu: any = [...proMenu]
  baseModuleMenu = mergeTrees(baseModuleMenu, modules)
  return baseModuleMenu
}

export default BaseMenuFn
