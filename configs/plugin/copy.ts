import path from "path";
import fs from "fs";

export function copyFile(modulesName:string) {

  if (!modulesName) {
    return { name: 'copy-module-files-noop' };
  }

  return {
    name: 'copy-module-files',
    closeBundle() {
      // __dirname 在 ESM 模块中不可用，使用 process.cwd() 获取项目根目录
      const root = process.cwd();

      // 源文件路径
      const src = path.resolve(root, `src/modules/${modulesName}/baseMenu.json`);

      // 目标文件路径 (在项目根目录的 dist 文件夹下)
      // 你可以根据需要调整目标路径，例如 path.resolve(root, `dist/${modulesName}/baseMenu.json`)
      const dest = path.resolve(root, `src/modules/${modulesName}/dist/baseMenu.json`);

      // 确保源文件存在
      if (fs.existsSync(src)) {
        // 确保目标目录存在，如果不存在则创建
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        // 直接复制文件，无需 setTimeout
        fs.copyFileSync(src, dest);
        console.log(`✅ Copied ${src} to ${dest}`);
      } else {
        console.error(`❌ Source file not found: ${src}`);
      }
    }
  }
}
