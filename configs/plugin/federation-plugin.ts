/**
 * 模块联邦主插件
 * 兼容vite7的模块联邦实现
 * 支持远程组件的发布和加载
 */

import type { Plugin } from 'vite'
import type { FederationPluginOptions } from './federation-types'
import { createFederationRemotePlugin, createFederationRemoteDevPlugin } from './federation-remote'
import { createFederationHostPlugin } from './federation-host'
import { initSharedScope } from './federation-utils'

/**
 * 创建模块联邦插件
 */
export function federation(options: FederationPluginOptions): Plugin[] {
  const {
    name,
    filename = 'remoteEntry.js',
    exposes = {},
    remotes = {},
    shared = {},
    devPort = 3000,
    buildTarget = 'esnext',
    cache = true
  } = options

  const plugins: Plugin[] = []

  // 初始化共享作用域
  if (typeof window !== 'undefined') {
    initSharedScope(shared)
  }

  // 如果配置了 exposes，添加远程发布插件
  if (Object.keys(exposes).length > 0) {
    plugins.push(
      createFederationRemotePlugin({
        name,
        filename,
        exposes,
        shared
      }),
      createFederationRemoteDevPlugin({
        name,
        filename,
        exposes,
        shared
      })
    )
  }

  // 如果配置了 remotes，添加宿主插件
  if (Object.keys(remotes).length > 0) {
    plugins.push(
      createFederationHostPlugin({
        name,
        remotes,
        shared
      })
    )
  }

  // 添加主配置插件
  plugins.push({
    name: 'federation-main',
    
    config(config, { command }) {
      // 开发模式配置
      if (command === 'serve') {
        config.server = config.server || {}
        config.server.port = config.server.port || devPort
        config.server.cors = true
        
        // 添加必要的依赖预构建排除项
        config.optimizeDeps = config.optimizeDeps || {}
        config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
        
        // 排除联邦相关模块的预构建
        Object.keys(remotes).forEach(remoteName => {
          config.optimizeDeps!.exclude!.push(`__federation_${remoteName}__`)
        })
      }
      
      // 构建模式配置
      if (command === 'build') {
        config.build = config.build || {}
        config.build.target = buildTarget
        config.build.rollupOptions = config.build.rollupOptions || {}
        
        // 配置外部依赖
        const external = config.build.rollupOptions.external || []
        const sharedKeys = Object.keys(shared)
        
        config.build.rollupOptions.external = [
          ...(Array.isArray(external) ? external : [external]),
          ...sharedKeys
        ].filter(Boolean)

        // 配置全局变量映射
        config.build.rollupOptions.output = config.build.rollupOptions.output || {}
        const output = config.build.rollupOptions.output
        
        if (!Array.isArray(output)) {
          output.globals = output.globals || {}
          sharedKeys.forEach(key => {
            output.globals![key] = key
          })
        }
      }
    },

    generateBundle(bundleOptions, bundle) {
      // 如果有共享依赖，需要修改 HTML 文件
      if (Object.keys(shared).length > 0) {
        const htmlFileName = 'index.html'
        const htmlAsset = bundle[htmlFileName]
        
        if (htmlAsset && htmlAsset.type === 'asset' && typeof htmlAsset.source === 'string') {
          // 注入共享依赖的脚本标签
          const sharedScripts = generateSharedScripts(shared)
          const injectedHtml = injectSharedScripts(htmlAsset.source, sharedScripts)
          
          // 更新HTML内容
          htmlAsset.source = injectedHtml
          
          console.log('已向 index.html 注入共享依赖脚本')
        }
      }
    },

    configResolved(resolvedConfig) {
      // 注入环境变量
      resolvedConfig.define = resolvedConfig.define || {}
      resolvedConfig.define['__FEDERATION_NAME__'] = JSON.stringify(name)
      resolvedConfig.define['__FEDERATION_REMOTES__'] = JSON.stringify(remotes)
      resolvedConfig.define['__FEDERATION_SHARED__'] = JSON.stringify(shared)
    },

    buildStart() {
      // 输出联邦配置信息
      console.log(`\n🚀 Federation Plugin Initialized:`)
      console.log(`   Name: ${name}`)
      
      if (Object.keys(exposes).length > 0) {
        console.log(`   Exposes: ${Object.keys(exposes).join(', ')}`)
      }
      
      if (Object.keys(remotes).length > 0) {
        console.log(`   Remotes: ${Object.keys(remotes).join(', ')}`)
      }
      
      if (Object.keys(shared).length > 0) {
        console.log(`   Shared: ${Object.keys(shared).join(', ')}`)
      }
      console.log('')
    }
  })

  return plugins
}

/**
 * 创建联邦配置助手
 */
export function defineFederationConfig(config: FederationPluginOptions): FederationPluginOptions {
  return config
}

/**
 * 动态加载远程组件的工具函数
 */
export async function loadRemoteComponent(
  remoteName: string,
  componentPath: string,
  fallback?: any
): Promise<any> {
  try {
    const runtime = (window as any).__federation_runtime__
    if (!runtime) {
      throw new Error('Federation runtime not initialized')
    }
    
    const module = await runtime.loadRemote(remoteName, componentPath)
    return module.default || module
  } catch (error) {
    console.error(`Failed to load remote component ${remoteName}/${componentPath}:`, error)
    
    if (fallback) {
      return fallback
    }
    
    // 返回错误组件
    return {
      name: 'FederationError',
      template: `<div style="color: red; padding: 16px; border: 1px solid red; border-radius: 4px;">
        <h4>远程组件加载失败</h4>
        <p>组件: ${remoteName}/${componentPath}</p>
        <p>错误: ${error.message}</p>
      </div>`
    }
  }
}

/**
 * Vue 组合式 API 钩子
 */
export function useRemoteComponent(remoteName: string, componentPath: string) {
  if (typeof window === 'undefined') {
    throw new Error('useRemoteComponent can only be used in browser environment')
  }

  const { ref, onMounted } = require('vue')
  
  const component = ref(null)
  const loading = ref(true)
  const error = ref(null)

  onMounted(async () => {
    try {
      const remoteComponent = await loadRemoteComponent(remoteName, componentPath)
      component.value = remoteComponent
      loading.value = false
    } catch (err) {
      error.value = err
      loading.value = false
    }
  })

  return {
    component,
    loading,
    error
  }
}

/**
 * 预加载远程应用
 */
export async function preloadRemoteApp(remoteName: string): Promise<void> {
  const runtime = (window as any).__federation_runtime__
  if (!runtime) {
    throw new Error('Federation runtime not initialized')
  }
  
  await runtime.preloadRemote(remoteName)
}

/**
 * 生成共享依赖的脚本标签
 */
function generateSharedScripts(shared: Record<string, any>): string[] {
  const scripts: string[] = []
  
  // CDN 映射，用于从CDN加载共享依赖
  const cdnMap: Record<string, string> = {
    'vue': 'https://unpkg.com/vue@3/dist/vue.global.js',
    'vue-router': 'https://unpkg.com/vue-router@4/dist/vue-router.global.js',
    'ant-design-vue': 'https://unpkg.com/ant-design-vue@4/dist/antd.js',
    'pinia': 'https://unpkg.com/pinia@2/dist/pinia.iife.js'
  }
  
  Object.keys(shared).forEach(key => {
    if (cdnMap[key]) {
      scripts.push(`<script src="${cdnMap[key]}" crossorigin></script>`)
    }
  })
  
  // 添加共享作用域初始化脚本
  scripts.push(`
    <script>
      // 初始化模块联邦共享作用域
      window.__federation_shared__ = window.__federation_shared__ || {};
      ${Object.entries(shared).map(([key, config]) => {
        return `window.__federation_shared__['${key}'] = ${JSON.stringify(config)};`
      }).join('\n      ')}
    </script>
  `)
  
  return scripts
}

/**
 * 向HTML中注入共享脚本
 */
function injectSharedScripts(html: string, scripts: string[]): string {
  const headCloseIndex = html.indexOf('</head>')
  
  if (headCloseIndex === -1) {
    // 如果找不到</head>，在</body>前插入
    const bodyCloseIndex = html.indexOf('</body>')
    if (bodyCloseIndex !== -1) {
      return html.slice(0, bodyCloseIndex) + '\n' + scripts.join('\n') + '\n' + html.slice(bodyCloseIndex)
    }
    // 如果都找不到，直接追加到末尾
    return html + '\n' + scripts.join('\n')
  }
  
  // 在</head>前插入脚本
  return html.slice(0, headCloseIndex) + '\n' + scripts.join('\n') + '\n' + html.slice(headCloseIndex)
}