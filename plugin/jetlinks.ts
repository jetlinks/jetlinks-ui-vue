import { AntdMatchComponents, kebabCase } from './antdv'

export interface IMatcher {
  pattern: RegExp
  styleDir: string
}

const matchComponents: IMatcher[] = [
  {
    pattern: /^Avatar/,
    styleDir: 'Avatar',
  },
  {
    pattern: /^AutoComplete/,
    styleDir: 'AutoComplete',
  },
  {
    pattern: /^Anchor/,
    styleDir: 'Anchor',
  },

  {
    pattern: /^Badge/,
    styleDir: 'Badge',
  },
  {
    pattern: /^Breadcrumb/,
    styleDir: 'Breadcrumb',
  },
  {
    pattern: /^Button/,
    styleDir: 'Button',
  },
  {
    pattern: /^Checkbox/,
    styleDir: 'Checkbox',
  },
  {
    pattern: /^Card/,
    styleDir: 'Card',
  },
  {
    pattern: /^Collapse/,
    styleDir: 'Collapse',
  },
  {
    pattern: /^Descriptions/,
    styleDir: 'Descriptions',
  },
  {
    pattern: /^RangePicker|^WeekPicker|^MonthPicker/,
    styleDir: 'DatePicker',
  },
  {
    pattern: /^Dropdown/,
    styleDir: 'Dropdown',
  },

  {
    pattern: /^Form/,
    styleDir: 'Form',
  },
  {
    pattern: /^InputNumber/,
    styleDir: 'InputNumber',
  },

  {
    pattern: /^Input|^Textarea/,
    styleDir: 'Input',
  },
  {
    pattern: /^Statistic/,
    styleDir: 'Statistic',
  },
  {
    pattern: /^CheckableTag/,
    styleDir: 'Tag',
  },
  {
    pattern: /^TimeRangePicker/,
    styleDir: 'TimePicker',
  },
  {
    pattern: /^Layout/,
    styleDir: 'Layout',
  },
  {
    pattern: /^Menu|^SubMenu/,
    styleDir: 'Menu',
  },

  {
    pattern: /^Table/,
    styleDir: 'Table',
  },
  {
    pattern: /^TimePicker|^TimeRangePicker/,
    styleDir: 'TimeTicker',
  },
  {
    pattern: /^Radio/,
    styleDir: 'Radio',
  },

  {
    pattern: /^Image/,
    styleDir: 'Image',
  },

  {
    pattern: /^List/,
    styleDir: 'List',
  },

  {
    pattern: /^Tab/,
    styleDir: 'Tabs',
  },
  {
    pattern: /^Mentions/,
    styleDir: 'Mentions',
  },

  {
    pattern: /^Step/,
    styleDir: 'Steps',
  },
  {
    pattern: /^Skeleton/,
    styleDir: 'Skeleton',
  },

  {
    pattern: /^Select/,
    styleDir: 'Select',
  },
  {
    pattern: /^TreeSelect/,
    styleDir: 'TreeSelect',
  },
  {
    pattern: /^Tree|^DirectoryTree/,
    styleDir: 'Tree',
  },
  {
    pattern: /^Typography/,
    styleDir: 'Typography',
  },
  {
    pattern: /^Timeline/,
    styleDir: 'Timeline',
  },
  {
    pattern: /^Upload/,
    styleDir: 'Upload',
  },
  {
    pattern: /^ProTable/,
    styleDir: 'ProTable',
  },
  {
    pattern: /^Search|^AdvancedSearch/,
    styleDir: 'Search',
  },
  {
    pattern: /^Ellipsis/,
    styleDir: 'Ellipsis',
  },
  {
    pattern: /^MonacoEditor/,
    styleDir: 'MonacoEditor',
  },
  {
    pattern: /^ProLayout/,
    styleDir: 'ProLayout',
  },
  {
    pattern: /^ScrollTable/,
    styleDir: 'ScrollTable',
  },
  {
    pattern: /^TableCard/,
    styleDir: 'TableCard',
  },
  {
    pattern: /^Scrollbar/,
    styleDir: 'Scrollbar',
  },
  {
    pattern: /^AIcon/,
    styleDir: 'AIcon',
  },
  {
    pattern: /^CardSelect/,
    styleDir: 'CardSelect',
  },
  {
    pattern: /^Tooltip/,
    styleDir: 'Tooltip',
  },
  {
    pattern: /^Empty/,
    styleDir: 'Empty',
  },
  {
    pattern: /^Popconfirm/,
    styleDir: 'Popconfirm',
  },
  {
    pattern: /^message/,
    styleDir: 'Message',
  },
  {
    pattern: /^Notification/,
    styleDir: 'Notification',
  },
]

export interface JetlinksVueResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string[]
  /**
   * import style along with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'
  /**
   * resolve `ant-design-vue' icons
   *
   * requires package `@ant-design/icons-vue`
   *
   * @default false
   */
  resolveIcons?: boolean

  /**
   * @deprecated use `importStyle: 'css'` instead
   */
  importCss?: boolean
  /**
   * @deprecated use `importStyle: 'less'` instead
   */
  importLess?: boolean

  /**
   * use commonjs build default false
   */
  cjs?: boolean
  packageName?: string
}

function getStyleDir(compName: string, _isAntd = false): string {
  let styleDir
  const components = _isAntd ? AntdMatchComponents : matchComponents
  const total = components.length
  console.log('getStyleDir', compName)
  for (let i = 0; i < total; i++) {
    const matcher = components[i]
    if (compName.match(matcher.pattern)) {
      styleDir = matcher.styleDir
      break
    }
  }
  if (!styleDir)
    styleDir = _isAntd ? kebabCase(compName) : compName

  return styleDir
}

function getSideEffects(compName: string, options: JetlinksVueResolverOptions, _isAntd= false): any {
  const {
    importStyle = true,
    importLess = false,
  } = options

  if (!importStyle)
    return
  const lib = options.cjs ? 'lib' : 'es'
  const packageName = options?.packageName || 'jetlinks-ui-components'

  if (importStyle === 'less' || importLess) {
    const styleDir = getStyleDir(compName, _isAntd)
    console.log('getSideEffects-style-path', `${packageName}/${lib}/${styleDir}/style`)
    return `${packageName}/${lib}/${styleDir}/style`
  }
  else {
    const styleDir = getStyleDir(compName, _isAntd)
    return `${packageName}/${lib}/${styleDir}/style/css`
  }
}

const filterName = [ 'message', 'Notification', 'AIcon']
const primitiveNames = ['Affix', 'Anchor', 'AnchorLink', 'message', 'Notification', 'AutoComplete', 'AutoCompleteOptGroup', 'AutoCompleteOption', 'Alert', 'Avatar', 'AvatarGroup', 'BackTop', 'Badge', 'BadgeRibbon', 'Breadcrumb', 'BreadcrumbItem', 'BreadcrumbSeparator', 'Button', 'ButtonGroup', 'Calendar', 'Card', 'CardGrid', 'CardMeta', 'Collapse', 'CollapsePanel', 'Carousel', 'Cascader', 'Checkbox', 'CheckboxGroup', 'Col', 'Comment', 'ConfigProvider', 'DatePicker', 'MonthPicker', 'WeekPicker', 'RangePicker', 'QuarterPicker', 'Descriptions', 'DescriptionsItem', 'Divider', 'Dropdown', 'DropdownButton', 'Drawer', 'Empty', 'Form', 'FormItem', 'FormItemRest', 'Grid', 'Input', 'InputGroup', 'InputPassword', 'InputSearch', 'Textarea', 'Image', 'ImagePreviewGroup', 'InputNumber', 'Layout', 'LayoutHeader', 'LayoutSider', 'LayoutFooter', 'LayoutContent', 'List', 'ListItem', 'ListItemMeta', 'Menu', 'MenuDivider', 'MenuItem', 'MenuItemGroup', 'SubMenu', 'Mentions', 'MentionsOption', 'Modal', 'Statistic', 'StatisticCountdown', 'PageHeader', 'Pagination', 'Popconfirm', 'Popover', 'Progress', 'Radio', 'RadioButton', 'RadioGroup', 'Rate', 'Result', 'Row', 'Select', 'SelectOptGroup', 'SelectOption', 'Skeleton', 'SkeletonButton', 'SkeletonAvatar', 'SkeletonInput', 'SkeletonImage', 'Slider', 'Space', 'Spin', 'Steps', 'Step', 'Switch', 'Table', 'TableColumn', 'TableColumnGroup', 'TableSummary', 'TableSummaryRow', 'TableSummaryCell', 'Transfer', 'Tree', 'TreeNode', 'DirectoryTree', 'TreeSelect', 'TreeSelectNode', 'Tabs', 'TabPane', 'Tag', 'CheckableTag', 'TimePicker', 'TimeRangePicker', 'Timeline', 'TimelineItem', 'Tooltip', 'Typography', 'TypographyLink', 'TypographyParagraph', 'TypographyText', 'TypographyTitle', 'Upload', 'UploadDragger', 'LocaleProvider', 'ProTable', 'Search', 'AdvancedSearch', 'Ellipsis', 'MonacoEditor', 'ProLayout', 'ScrollTable', 'TableCard', 'Scrollbar', 'CardSelect', 'ColorPicker']
const prefix = 'J'

let jetlinksNames: Set<string>

function genJetlinksNames(primitiveNames: string[]): void {
  jetlinksNames = new Set(primitiveNames.map(name =>  filterName.includes(name) ? name : `${prefix}${name}`))
}

let antdvNames: Set<string>

function genAntdNames(primitiveNames: string[]): void {
  antdvNames = new Set(primitiveNames.map(name => `A${name}`))
}

genAntdNames(primitiveNames.filter(key => !filterName.includes(key)))
genJetlinksNames(primitiveNames)

function isJetlinks(compName: string): boolean {
  return jetlinksNames.has(compName)
}

function isAntdv(compName: string): boolean {
  return antdvNames.has(compName)
}

export function JetlinksVueResolver(options: JetlinksVueResolverOptions = {

}): any {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (options.resolveIcons && name.match(/(Outlined|Filled|TwoTone)$/)) {
        return {
          name,
          from: '@ant-design/icons-vue',
        }
      }
      const _isJetlinks = isJetlinks(name)
      const _isAntd = isAntdv(name)
      if ((_isJetlinks || _isAntd) && !options?.exclude?.includes(name)) {
        const importName = filterName.includes(name) ? name : name.slice(1)
        options.packageName = _isJetlinks ? 'jetlinks-ui-components' : 'ant-design-vue'
        const path = `${options.packageName}/${options.cjs ? 'lib' : 'es'}`

        return {
          name: importName,
          from: path,
          sideEffects: getSideEffects(importName, options, _isAntd),
        }
      }
    },
  }
}