import fs from 'fs';
import path from 'path';

// const fs = require('fs');
// const path = require('path');

const copyImage = () => {
  // 定义模块的源目录和图像的目标目录
  const modulesDir = path.resolve(__dirname, '../../src/modules');
  const distDir = path.resolve(__dirname, '../../dist/images');
  // 从给定子目录复制资产的函数
  function copyAssets(subDir, level = 0) {
    // 定义子目录中的资产目录
    const assetsDir = level ? subDir :  path.join(subDir, 'assets');

    // 检查资产目录是否存在
    if (fs.existsSync(assetsDir)) {
      // 读取资产目录中的所有文件和目录
      const files = fs.readdirSync(assetsDir);
      files.forEach(file => {
        const filePath = path.join(assetsDir, file);
        const stat = fs.statSync(filePath);

        // 如果项目是文件且不是 .js 或 .ts 文件，则复制它
        if (stat.isFile() && !file.endsWith('.js') && !file.endsWith('.ts')) {
          const destPath = path.join(distDir, filePath.includes('assets\\') ? filePath.split('assets\\')[1] : file);
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.copyFileSync(filePath, destPath);
          }
        } else if (stat.isDirectory()) {
          // 如果项目是目录，请确保目标目录存在
          const destDirPath = path.join(distDir, file);

          if (!fs.existsSync(destDirPath)) {
            fs.mkdirSync(destDirPath, { recursive: true });
          }

          // 递归处理目录的内容
          const subFiles = fs.readdirSync(filePath);
          subFiles.forEach(subFile => {
            const subFilePath = path.join(filePath, subFile);
            const subFileStat = fs.statSync(subFilePath);
            const subDestPath = path.join(destDirPath, subFile);
            // 如果目标中不存在文件，则复制文件
            if (subFileStat.isFile() && !subFile.endsWith('.js') && !subFile.endsWith('.ts')) {
              if (!fs.existsSync(subDestPath)) {
                fs.copyFileSync(subFilePath, subDestPath);
              }
            } else if (subFileStat.isDirectory()) {
              // 确保目标中存在子目录
              if (!fs.existsSync(subDestPath)) {
                fs.mkdirSync(subDestPath, { recursive: true });
              }

              // 递归复制子目录
              copyAssets(subFilePath, level + 1);
            }
          });
        }
      });
    }
  }

  // 读取模块目录中的所有子目录
  const subDirs = fs.readdirSync(modulesDir);
  subDirs.forEach(subDirName => {
    const subDirPath = path.join(modulesDir, subDirName);
    // 如果是目录，则处理每个子目录
    if (fs.statSync(subDirPath).isDirectory()) {
      copyAssets(subDirPath);
    }
  });
}

const copySrcAssetsImage = () => {
  // 定义模块的源目录和图像的目标目录
  const modulesDir = path.resolve(__dirname, '../../src/assets');
  const distDir = path.resolve(__dirname, '../../dist/images');

  // 读取模块目录中的所有子目录
  const subDirs = fs.readdirSync(modulesDir);
  subDirs.forEach(subDirName => {
    const subDirPath = path.join(modulesDir, subDirName);
    // 如果是目录，则处理每个子目录
    if (fs.statSync(subDirPath).isDirectory()) {
      const destDirPath = path.join(distDir, subDirName);

      if (!fs.existsSync(destDirPath)) {
        fs.mkdirSync(destDirPath, { recursive: true });
      }

      const subFiles = fs.readdirSync(subDirPath);

      subFiles.forEach(subFile => {
        const subFilePath = path.join(subDirPath, subFile);
        const subFileStat = fs.statSync(subFilePath);
        const subDestPath = path.join(destDirPath, subFile);

        if (subFileStat.isFile() && !subFile.endsWith('.js') && !subFile.endsWith('.ts')) {
          if (!fs.existsSync(subDestPath)) {
            fs.copyFileSync(subFilePath, subDestPath);
          }
        }
      })

    } else if (!subDirPath.endsWith('js') && !subDirPath.endsWith('ts')){
      const subDestPath = path.join(distDir, subDirName);
      fs.copyFileSync(subDirPath, subDestPath);
    }
  });
}

export function copyImagesPlugin() {
  return {
    name: 'copy-images-plugin',
    closeBundle() {
      copySrcAssetsImage()
      copyImage()
    }
  };
}
