import fs from 'fs'
import * as path from 'path'

const rootPath = path.resolve(__dirname, '../../')
const modulesBasePath = 'src/modules'

function registerModulesAlias() {
  const modulesAlias = {}
  const pattern = path.resolve(rootPath, modulesBasePath)
  try {
    const folders = fs.readdirSync(pattern)
    folders?.map((name) => {
      try {
        if (fs.existsSync(path.resolve(rootPath, modulesBasePath, `${name}/config.json`))) {
          const result = fs.readFileSync(path.resolve(rootPath, modulesBasePath, `${name}/config.json`), 'utf-8')
          const content = JSON.parse(result)
          if (content.aliasName) {
            modulesAlias[content.aliasName] = path.resolve(modulesBasePath, name)
          }
        }
      } catch (error) {
        console.warn(`Failed to load ${modulesBasePath} configuration file!`)
      }
    })
  } catch (error) {
    console.warn(`Failed to load ${modulesBasePath} Folder`)
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
        if (fs.existsSync(path.resolve(rootPath, modulesBasePath, `${name}/vite-plugin.js`))) {
          const plugin = require(path.resolve(rootPath, modulesBasePath, `${name}/vite-plugin.js`))
          if (plugin.default) {
            modulesPlugins.push(...plugin.default)
          }
        }
      } catch (error) {
        console.warn(`Failed to load ${modulesBasePath} vite-plugin file!`)
      }
    })
  } catch (error) {
    console.warn(`Failed to load ${modulesBasePath} Folder`)
  }
  return modulesPlugins
}

export { registerModulesAlias, registerModulesLessVariable, loadViteModulesPlugins }
