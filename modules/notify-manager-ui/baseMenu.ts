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
