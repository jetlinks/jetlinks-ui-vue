import proMenu from './baseMenu';

const menusModule = import.meta.glob('../../../modules/**/baseMenu.ts', {eager: true});
const modules = Object.values(menusModule);
const menus = modules.map((item) => item.default?.());

const baseModuleMenu = [...proMenu];

menus.forEach((item) => {
  baseModuleMenu.push(...item);
})

export default [
  ...baseModuleMenu,
]
