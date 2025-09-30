import type { Plugin } from 'vite'

export interface ExcludeModulesOptions {
  /**
   * 需要排除的模块名称列表
   */
  omit?: string[]
  /**
   * 需要包含的模块名称列表(优先级高于 omit)
   * 如果指定了 pick,则只包含 pick 中的模块
   */
  pick?: string[]
}

/**
 * 在构建时排除或指定包含的模块
 * 通过替换 import.meta.glob 表达式来实现过滤
 */
export function excludeModulesPlugin(options: ExcludeModulesOptions = {}): Plugin {
  const { omit = [], pick = [] } = options

  return {
    name: 'vite-plugin-exclude-modules',
    enforce: 'pre',

    transform(code: string, id: string) {
      // 处理 modules.ts 和 locales/index.ts 文件
      const isModulesFile = id.includes('src/utils/modules.ts') || id.includes('src\\utils\\modules.ts')
      const isLocalesFile = id.includes('src/locales/index.ts') || id.includes('src\\locales\\index.ts')

      if (!isModulesFile && !isLocalesFile) {
        return null
      }

      // 如果没有配置 omit 和 pick,则不做任何处理
      if (omit.length === 0 && pick.length === 0) {
        return null
      }

      let pattern: string

      // pick 优先级更高
      if (pick.length > 0) {
        // 只包含指定的模块: ../modules/(module-a|module-b)/index.ts
        pattern = `(${pick.join('|')})`
      } else {
        // 排除指定的模块: ../modules/!(module-a|module-b)/index.ts
        pattern = `!(${omit.join('|')})`
      }

      let transformedCode = code

      // 替换 modules.ts 中的 import.meta.glob
      if (isModulesFile) {
        transformedCode = transformedCode.replace(
          /import\.meta\.glob\(['"]\.\.\/modules\/\*\/(index|baseMenu)\.ts['"]/g,
          (match) => {
            // 提取文件名 (index.ts 或 baseMenu.ts)
            const fileName = match.includes('baseMenu') ? 'baseMenu' : 'index'
            return `import.meta.glob('../modules/${pattern}/${fileName}.ts'`
          }
        )
      }

      // 替换 locales/index.ts 中的 import.meta.glob
      if (isLocalesFile) {
        transformedCode = transformedCode.replace(
          /import\.meta\.glob\(['"]\.\.\/modules\/\*\/locales\/lang\/\*\.json['"]/g,
          `import.meta.glob('../modules/${pattern}/locales/lang/*.json'`
        )
      }

      // 如果代码有变化,返回转换后的代码
      if (transformedCode !== code) {
        return {
          code: transformedCode,
          map: null
        }
      }

      return null
    }
  }
}