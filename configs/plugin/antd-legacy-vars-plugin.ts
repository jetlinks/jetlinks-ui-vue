import type { Plugin } from 'vite'
import path from 'path'

// ant-design-vue 3.x 到 4.x 变量映射表
const LEGACY_VAR_MAPPING: Record<string, string> = {
  // CSS 变量到 Less 变量的映射
  'var(--ant-primary-color)': '@primary-color',
  'var(--ant-success-color)': '@success-color',
  'var(--ant-error-color)': '@error-color',
  'var(--ant-warning-color)': '@warning-color',
  'var(--ant-info-color)': '@info-color',
  'var(--ant-text-color)': '@text-color',
  'var(--ant-text-color-secondary)': '@text-color-secondary',
  'var(--ant-heading-color)': '@heading-color',
  'var(--ant-border-color-base)': '@border-color-base',
  'var(--ant-border-color-split)': '@border-color-split',
  'var(--ant-background-color-base)': '@background-color-base',
  'var(--ant-background-color-light)': '@background-color-light',
  'var(--ant-disabled-color)': '@disabled-color',
  'var(--ant-shadow-color)': '@shadow-color',
  'var(--ant-box-shadow-base)': '@box-shadow-base',
  'var(--ant-border-radius-base)': '@border-radius-base',
  'var(--ant-primary-1)': '@primary-1',
  'var(--ant-primary-2)': '@primary-2',
}

// 扩展映射表，支持更多变量
const EXTENDED_VAR_MAPPING: Record<string, string> = {
  ...LEGACY_VAR_MAPPING,
  // 组件特定变量
  'var(--ant-btn-primary-bg)': '@btn-primary-bg',
  'var(--ant-btn-primary-color)': '@btn-primary-color',
  'var(--ant-input-bg)': '@input-bg',
  'var(--ant-input-border-color)': '@input-border-color',
  'var(--ant-table-header-bg)': '@table-header-bg',
  'var(--ant-table-row-hover-bg)': '@table-row-hover-bg',
  // 尺寸变量
  'var(--ant-font-size-base)': '@font-size-base',
  'var(--ant-font-size-lg)': '@font-size-lg',
  'var(--ant-font-size-sm)': '@font-size-sm',
  'var(--ant-line-height-base)': '@line-height-base',
  'var(--ant-padding-lg)': '@padding-lg',
  'var(--ant-padding-md)': '@padding-md',
  'var(--ant-padding-sm)': '@padding-sm',
  'var(--ant-margin-lg)': '@margin-lg',
  'var(--ant-margin-md)': '@margin-md',
  'var(--ant-margin-sm)': '@margin-sm',
}

interface PluginOptions {
  // 是否启用详细日志
  verbose?: boolean
  // 自定义变量映射
  customMapping?: Record<string, string>
  // 是否只处理 .vue 文件
  vueOnly?: boolean
  // 排除的文件模式
  exclude?: RegExp[]
}

export function antdLegacyVarsPlugin(options: PluginOptions = {}): Plugin {
  const {
    verbose = false,
    customMapping = {},
    vueOnly = false,
    exclude = []
  } = options

  // 合并映射表
  const varMapping = {
    ...EXTENDED_VAR_MAPPING,
    ...customMapping
  }

  let transformCount = 0

  return {
    name: 'antd-legacy-vars',
    enforce: 'pre',

    transform(code: string, id: string) {
      // 检查文件类型
      const isVueFile = id.endsWith('.vue')
      const isLessFile = id.endsWith('.less')
      const isCssFile = id.endsWith('.css')

      // 如果设置了 vueOnly，只处理 .vue 文件
      if (vueOnly && !isVueFile) {
        return null
      }

      // 检查是否应该处理此文件
      if (!isVueFile && !isLessFile && !isCssFile) {
        return null
      }

      // 检查排除规则
      if (exclude.some(pattern => pattern.test(id))) {
        return null
      }

      let transformedCode = code
      let hasTransform = false

      // 执行变量替换
      Object.entries(varMapping).forEach(([cssVar, lessVar]) => {
        if (transformedCode.includes(cssVar)) {
          transformedCode = transformedCode.replace(
            new RegExp(escapeRegExp(cssVar), 'g'),
            lessVar
          )
          hasTransform = true

          if (verbose) {
            console.log(`[antd-legacy-vars] ${path.basename(id)}: ${cssVar} → ${lessVar}`)
          }
        }
      })

      if (hasTransform) {
        transformCount++

        if (verbose) {
          console.log(`[antd-legacy-vars] 已转换文件: ${path.relative(process.cwd(), id)}`)
        }

        return {
          code: transformedCode,
          map: null // 简单替换，不生成 source map
        }
      }

      return null
    },

    buildEnd() {
      if (verbose || transformCount > 0) {
        console.log(`[antd-legacy-vars] 总共转换了 ${transformCount} 个文件`)
      }
    }
  }
}

// 辅助函数：转义正则表达式特殊字符
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 导出映射表，供其他地方使用
export { LEGACY_VAR_MAPPING, EXTENDED_VAR_MAPPING }
