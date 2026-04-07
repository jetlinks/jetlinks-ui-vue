import path from 'path'
import fs from 'fs'

export function copyFile(modulesName: string) {
  if (!modulesName) {
    return { name: 'copy-module-files-noop' }
  }

  return {
    name: 'copy-module-files',
    closeBundle() {
      // process.cwd() 返回 jetlinks-web-core 目录，需要向上一级到达项目根目录
      const root = process.cwd()
      const projectRoot = path.resolve(root, '..')

      // 源文件路径
      const src = path.resolve(projectRoot, `modules/${modulesName}/baseMenu.json`)

      // 目标文件路径
      const dest = path.resolve(projectRoot, `modules/${modulesName}/dist/baseMenu.json`)

      // 确保源文件存在
      if (fs.existsSync(src)) {
        // 确保目标目录存在，如果不存在则创建
        const destDir = path.dirname(dest)
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }

        // 直接复制文件，无需 setTimeout
        fs.copyFileSync(src, dest)
        console.log(`✅ Copied ${src} to ${dest}`)
      } else {
        console.error(`❌ Source file not found: ${src}`)
      }
    }
  }
}
