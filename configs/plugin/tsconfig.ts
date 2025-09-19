// import path from "path";
// import fs from "fs";
const path = require('path');
const fs = require('fs');

const rootPath = path.resolve(__dirname, '../../')
const modulesBasePath = 'src/modules'
const tsJsonPath = './tsconfig.paths.json'

function generateTsconfigPaths() {
  // 读取 tsconfig.json
  const tsconfigPath = path.resolve(rootPath, tsJsonPath)
  const modulesDir = path.resolve(rootPath, modulesBasePath)
  let tsconfig = {}

  // 确保 compilerOptions 和 paths 存在
  // tsconfig.compilerOptions = tsconfig.compilerOptions || {};
  // tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};

  const newPaths = {
    '@/*': ['./src/*']
  };

  if (fs.existsSync(modulesDir)) {
    const moduleNames = fs.readdirSync(modulesDir);
    moduleNames.forEach(moduleName => {
      const modulePath = path.join(modulesDir, moduleName);
      const configPath = path.join(modulePath, 'package.json');
      if (fs.existsSync(configPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          if (config.name) {
            // 示例： "@my-module/*": ["src/modules/my-module/*"]
            newPaths[`@${config.name}/*`] = [`./src/modules/${moduleName}/*`];
            // 如果你还需要一个指向模块根目录的直接别名，可以添加：
            // newPaths[`@${config.alias}`] = [`src/modules/${moduleName}`];
          }
        } catch (e) {
          console.error(`Error parsing package.json in ${modulePath}:`, e);
        }
      }
    });
  }

  tsconfig = {
    compilerOptions: {
      baseUrl: "./",
      paths: newPaths
    }
  };

  if (Object.keys(newPaths).length > 0) {
  // 写回 tsconfig.json，保持格式美观
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf-8');
  }
  console.log('tsconfig.json paths updated successfully.');

}

generateTsconfigPaths()
