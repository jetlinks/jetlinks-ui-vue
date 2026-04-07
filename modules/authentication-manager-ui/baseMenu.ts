/**
 * @exmaple
 * export default [
 *  {
 *      "code": "page1" // 根据页面路径来截取，截取规则为/^\.\/views\/(.*)\/index\.vue$/,
 *      "url": "/page1" // 规则为 /【code】
 *      "i18nMessages": {
 *          name: {
 *              zh_CN: '产品管理',
 *              en_US: 'Product Management'
 *          }
 *      },
 *      "permissions": [ // 页面权限
 *          {
 *              "permission": "device/Product", // 后端接口权限标识
 *              "actions": ["query", "add", "update", "view"] // 权限的操作类型
 *          }
 *      ],
 *      "buttons": [ // 前端按钮权限
 *          {
 *              "id": 'add', // 权限标识
 *              "i18nMessage": { // 国际化文案
 *                  "zh_CN": "新增",
 *                  "en_US": "Add"
 *              },
 *              "permissions": [
 *                  {
 *                      "permission": "device/Product", // 后端接口权限标识
 *                      "actions": ["query", "add", "update", "view"] // 权限的操作类型
 *                  }
 *              ]
 *          }
 *      ],
 *  }
 * ]
 */
import baseMenu from './baseMenu.json'
import p from './package.json'

const handleMenu = (menus: any[]): any[] => menus.map(item => ({
  ...item,
  children: item.children ? handleMenu(item.children) : undefined,
  options: { appName: p.id || p.name, ...item.options }
}))

export default () => {
  return handleMenu(baseMenu)
}
