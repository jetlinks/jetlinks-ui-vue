export const moduleFilterPlugin = (targetModules: string[] | null) => {
  // 如果没有指定模块，或者列表为空，则不进行拦截
  if (!targetModules || targetModules.length === 0) return null

  return {
    name: 'module-filter-plugin',
    enforce: 'pre', // 在 Vite 核心插件之前运行
    load(id: string) {
      // 统一路径分隔符，防止 Windows 下路径匹配失败
      const normalizedId = id.replace(/\\/g, '/')

      // 1. 检查文件是否在 modules 目录下
      if (normalizedId.includes('/modules/')) {
        // 2. 提取模块名称 (兼容 Windows/Linux 路径)
        const match = normalizedId.match(/\/modules\/([^\/]+)\//)
        if (match) {
          const moduleName = match[1]

          // 3. 如果该模块 不在 目标白名单中
          if (!targetModules.includes(moduleName)) {

            // 4. 根据文件类型返回不同的“空内容”
            // 这一点很重要，因为你不能给 JSON 文件返回 'export default {}'，会报错

            if (normalizedId.endsWith('.json')) {
              return '{}' // 返回空 JSON 对象
            } else if (normalizedId.endsWith('.vue') || normalizedId.endsWith('.html')) {
              return '<template></template>' // 返回空 Vue 模板
            } else if (normalizedId.match(/\.(css|less|scss|sass|styl)$/)) {
              return '' // 返回空样式
            } else {
              // 默认 JS/TS 返回空导出
              return 'export default { filter: true }'
            }
          }
        }
      }
      return null // 返回 null 表示交给 Vite 默认处理
    }
  }
}
