import type { IMatcher } from './jetlinks'


export function kebabCase(key: string) {
  const result = key.replace(/([A-Z])/g, ' $1').trim()
  return result.split(' ').join('-').toLowerCase()
}

export const AntdMatchComponents: IMatcher[] = [
  {
    pattern: /^Avatar/,
    styleDir: 'avatar',
  },
  {
    pattern: /^AutoComplete/,
    styleDir: 'auto-complete',
  },
  {
    pattern: /^Anchor/,
    styleDir: 'anchor',
  },

  {
    pattern: /^Badge/,
    styleDir: 'badge',
  },
  {
    pattern: /^Breadcrumb/,
    styleDir: 'breadcrumb',
  },
  {
    pattern: /^Button/,
    styleDir: 'button',
  },
  {
    pattern: /^Checkbox/,
    styleDir: 'checkbox',
  },
  {
    pattern: /^Card/,
    styleDir: 'card',
  },
  {
    pattern: /^Collapse/,
    styleDir: 'collapse',
  },
  {
    pattern: /^Descriptions/,
    styleDir: 'descriptions',
  },
  {
    pattern: /^RangePicker|^WeekPicker|^MonthPicker/,
    styleDir: 'date-picker',
  },
  {
    pattern: /^Dropdown/,
    styleDir: 'dropdown',
  },

  {
    pattern: /^Form/,
    styleDir: 'form',
  },
  {
    pattern: /^InputNumber/,
    styleDir: 'input-number',
  },

  {
    pattern: /^Input|^Textarea/,
    styleDir: 'input',
  },
  {
    pattern: /^Statistic/,
    styleDir: 'statistic',
  },
  {
    pattern: /^CheckableTag/,
    styleDir: 'tag',
  },
  {
    pattern: /^TimeRangePicker/,
    styleDir: 'time-picker',
  },
  {
    pattern: /^Layout/,
    styleDir: 'layout',
  },
  {
    pattern: /^Menu|^SubMenu/,
    styleDir: 'menu',
  },

  {
    pattern: /^Table/,
    styleDir: 'table',
  },
  {
    pattern: /^TimePicker|^TimeRangePicker/,
    styleDir: 'time-picker',
  },
  {
    pattern: /^Radio/,
    styleDir: 'radio',
  },

  {
    pattern: /^Image/,
    styleDir: 'image',
  },

  {
    pattern: /^List/,
    styleDir: 'list',
  },

  {
    pattern: /^Tab/,
    styleDir: 'tabs',
  },
  {
    pattern: /^Mentions/,
    styleDir: 'mentions',
  },

  {
    pattern: /^Step/,
    styleDir: 'steps',
  },
  {
    pattern: /^Skeleton/,
    styleDir: 'skeleton',
  },

  {
    pattern: /^Select/,
    styleDir: 'select',
  },
  {
    pattern: /^TreeSelect/,
    styleDir: 'tree-select',
  },
  {
    pattern: /^Tree|^DirectoryTree/,
    styleDir: 'tree',
  },
  {
    pattern: /^Typography/,
    styleDir: 'typography',
  },
  {
    pattern: /^Timeline/,
    styleDir: 'timeline',
  },
  {
    pattern: /^Upload/,
    styleDir: 'upload',
  },
]
