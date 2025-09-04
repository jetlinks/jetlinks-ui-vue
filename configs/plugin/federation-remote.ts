/**
 * 远程组件发布功能
 * 支持将组件发布为可被其他应用消费的远程模块
 */

import type { Plugin } from 'vite'
import type { FederationConfig } from './federation-types'
import { generateRemoteEntry, initSharedScope } from './federation-utils'

/**
 * 创建远程组件发布插件
 */
export function createFederationRemotePlugin(config: FederationConfig): Plugin {
  const { name, filename = 'remoteEntry.js', exposes = {}, shared = {} } = config

  return {
    name: 'federation-remote',
    apply: 'build',
    
    configResolved(resolvedConfig) {
      // 确保输出格式适合模块联邦
      if (resolvedConfig.build?.rollupOptions?.output) {
        const output = resolvedConfig.build.rollupOptions.output
        if (Array.isArray(output)) {
          output.forEach(o => {
            o.format = 'system'
            o.entryFileNames = filename
          })
        } else {
          output.format = 'system'
          output.entryFileNames = filename
        }
      }
    },

    generateBundle(options, bundle) {
      // 查找编译后的文件名
      const compiledFileNames = new Map<string, string>()
      
      Object.entries(exposes).forEach(([key, value]) => {
        const fileName = value.split('/').pop()?.replace(/\.ts$/, '') || 'module'
        // 在bundle中查找对应的编译后文件
        for (const [bundleKey, bundleValue] of Object.entries(bundle)) {
          if (bundleValue.type === 'chunk' && 
              (bundleValue.facadeModuleId?.includes(fileName) || 
               bundleKey.includes(fileName))) {
            compiledFileNames.set(key, `./${bundleKey}`)
            break
          }
        }
        
        // 如果没有找到，使用默认路径
        if (!compiledFileNames.has(key)) {
          compiledFileNames.set(key, `./assets/${fileName}.js`)
        }
      })

      // 生成远程入口文件
      const remoteEntryCode = generateRemoteEntryCode(name, exposes, shared, compiledFileNames)
      
      this.emitFile({
        type: 'asset',
        fileName: filename,
        source: remoteEntryCode
      })

      // 为每个暴露的模块创建包装器
      Object.entries(exposes).forEach(([key, value]) => {
        const compiledPath = compiledFileNames.get(key) || `./assets/${key.replace(/^\.\//, '')}.js`
        const moduleCode = generateModuleWrapper(key, compiledPath)
        this.emitFile({
          type: 'asset',
          fileName: `${key.replace(/^\.\//, '')}.js`,
          source: moduleCode
        })
      })
    }
  }
}

/**
 * 生成远程入口代码
 */
function generateRemoteEntryCode(
  name: string,
  exposes: Record<string, string>,
  shared: Record<string, any>,
  compiledFileNames?: Map<string, string>
): string {
  const exposesEntries = Object.entries(exposes)
    .map(([key, value]) => `"${key}": () => import("./${key.replace(/^\.\//, '')}.js")`)
    .join(',\n    ')

  const sharedEntries = Object.entries(shared)
    .map(([key, config]) => {
      const configStr = typeof config === 'object' 
        ? JSON.stringify(config)
        : 'true'
      return `"${key}": ${configStr}`
    })
    .join(',\n    ')

  return `
(function() {
  const __federation_remote__ = {
    name: "${name}",
    exposes: {
      ${exposesEntries}
    },
    shared: {
      ${sharedEntries}
    }
  };

  // 初始化共享作用域
  if (window.__federation_shared__) {
    Object.keys(__federation_remote__.shared).forEach(key => {
      if (!window.__federation_shared__[key]) {
        window.__federation_shared__[key] = __federation_remote__.shared[key];
      }
    });
  }

  // 暴露远程容器到全局
  window.__federation_${name}__ = __federation_remote__;

  // 兼容SystemJS格式
  if (typeof System !== 'undefined') {
    System.register('${name}', [], function(exports) {
      return {
        execute: function() {
          exports('__federation_remote__', __federation_remote__);
        }
      };
    });
  }

  // AMD兼容
  if (typeof define === 'function' && define.amd) {
    define('${name}', [], function() {
      return __federation_remote__;
    });
  }

  // CommonJS兼容
  if (typeof module === 'object' && module.exports) {
    module.exports = __federation_remote__;
  }
})();
`
}

/**
 * 生成模块包装器代码
 */
function generateModuleWrapper(key: string, compiledPath: string): string {
  return `
(function() {
  const moduleFactory = () => import("${compiledPath}");
  
  // SystemJS格式
  if (typeof System !== 'undefined') {
    System.register('${key}', [], function(exports) {
      return {
        execute: function() {
          moduleFactory().then(module => {
            Object.keys(module).forEach(exportName => {
              exports(exportName, module[exportName]);
            });
          });
        }
      };
    });
  }
  
  // 直接暴露到全局（兼容性）
  window.__federation_module_${key.replace(/[^a-zA-Z0-9]/g, '_')}__ = moduleFactory;
})();
`
}

/**
 * 开发模式远程插件
 */
export function createFederationRemoteDevPlugin(config: FederationConfig): Plugin {
  const { name, exposes = {}, shared = {} } = config

  return {
    name: 'federation-remote-dev',
    apply: 'serve',
    
    configureServer(server) {
      // 在开发服务器中添加远程入口路由
      server.middlewares.use('/remoteEntry.js', (req, res) => {
        const code = generateRemoteEntryCode(name, exposes, shared)
        res.setHeader('Content-Type', 'application/javascript')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end(code)
      })

      // 为每个暴露的模块添加路由
      Object.entries(exposes).forEach(([key, value]) => {
        const route = `/${key.replace(/^\.\//, '')}.js`
        server.middlewares.use(route, async (req, res) => {
          try {
            // 在开发模式下直接转换模块
            const result = await server.ssrTransform(
              `export * from "${value}"`,
              null,
              value
            )
            res.setHeader('Content-Type', 'application/javascript')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.end(result.code)
          } catch (error) {
            res.statusCode = 500
            res.end(`Error loading module: ${error}`)
          }
        })
      })
    }
  }
}