import fs from 'fs'
import * as path from 'path'

const rootPath = path.resolve(__dirname, "../../../")
const modulesBasePath = path.resolve(rootPath, 'modules')

function registerModulesAlias() {
  const modulesAlias = {}
  try {
    const folders = fs.readdirSync(modulesBasePath)
    folders?.map((name) => {
      try {

        if (fs.existsSync(path.resolve(rootPath, modulesBasePath, `${name}/package.json`))) {
          const result = fs.readFileSync(path.resolve(rootPath, modulesBasePath, `${name}/package.json`), 'utf-8')
          const content = JSON.parse(result)
          if (content.name) {
            const modulePath = path.resolve(rootPath, 'modules', name)
            // 同时配置精确别名和通配符别名，确保子路径能正确解析
            modulesAlias[`@${content.name}`] = modulePath
            modulesAlias[`@${content.name}/*`] = path.resolve(modulePath, '*')
          }
        }
      } catch (error) {
        console.warn(`[registerModulesAlias 2]: Failed to load ${modulesBasePath} configuration file!`)
      }
    })
  } catch (error) {
    console.warn(`[registerModulesAlias 1]: Failed to load ${modulesBasePath} Folder`)
  }

  return modulesAlias
}

function registerModulesLessVariable() {
  const pattern = path.resolve(rootPath, modulesBasePath)
  try {
    const folders = fs.readdirSync(pattern)
    return folders
      ?.filter((module) => fs.existsSync(path.resolve(`${pattern}/${module}/style/variable.less`)))
      .map((module) => `@import (reference) "${path.resolve(`${pattern}/${module}/style/variable.less`)}";`)
      .join('\n')
  } catch (error) {
    console.warn(`Failed to load ${modulesBasePath} style/variable.less`)
  }
}

function loadViteModulesPlugins() {
  const modulesPlugins = []
  const pattern = path.resolve(rootPath, modulesBasePath)
  try {
    const folders = fs.readdirSync(pattern)
    folders?.map((name) => {
      try {
        if (fs.existsSync(path.resolve(modulesBasePath, `${name}/vite-plugin.js`))) {
          const plugin = require(path.resolve(modulesBasePath, `${name}/vite-plugin.js`))
          if (plugin.default) {
            modulesPlugins.push(...plugin.default)
          }
        }
      } catch (error) {
        console.warn(`[loadViteModulesPlugins]: Failed to load ${modulesBasePath} vite-plugin file!`)
      }
    })
  } catch (error) {
    console.warn(`[loadViteModulesPlugins]: Failed to load ${modulesBasePath} Folder`)
  }
  return modulesPlugins
}

export { registerModulesAlias, registerModulesLessVariable, loadViteModulesPlugins }
