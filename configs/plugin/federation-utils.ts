/**
 * 模块联邦工具函数
 */

import type { RemoteModuleInfo } from './federation-types'

/**
 * 生成远程入口脚本URL
 */
export function generateRemoteEntry(baseUrl: string, remoteName: string): string {
  const cleanUrl = baseUrl.replace(/\/$/, '')
  return `${cleanUrl}/remoteEntry.js`
}

/**
 * 动态导入远程模块
 */
export async function importRemoteModule(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = url
    
    script.onload = () => {
      resolve(window)
      document.head.removeChild(script)
    }
    
    script.onerror = () => {
      reject(new Error(`Failed to load remote module: ${url}`))
      document.head.removeChild(script)
    }
    
    document.head.appendChild(script)
  })
}

/**
 * 获取全局共享作用域
 */
export function getSharedScope(): any {
  if (!window.__federation_shared__) {
    window.__federation_shared__ = {}
  }
  return window.__federation_shared__
}

/**
 * 初始化共享作用域
 */
export function initSharedScope(shared: Record<string, any>): void {
  const sharedScope = getSharedScope()
  
  Object.keys(shared).forEach(key => {
    if (!sharedScope[key]) {
      sharedScope[key] = {}
    }
    
    const sharedConfig = shared[key]
    if (typeof sharedConfig === 'object' && sharedConfig !== null) {
      Object.assign(sharedScope[key], sharedConfig)
    }
  })
}

/**
 * 创建远程模块缓存键
 */
export function createCacheKey(remoteName: string, moduleName?: string): string {
  return moduleName ? `${remoteName}:${moduleName}` : remoteName
}

/**
 * 验证远程模块URL
 */
export function validateRemoteUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 解析远程模块名称
 */
export function parseRemoteName(remote: string): { name: string; url: string } {
  const parts = remote.split('@')
  if (parts.length === 2) {
    return { name: parts[0], url: parts[1] }
  }
  throw new Error(`Invalid remote format: ${remote}`)
}

/**
 * 创建模块代理
 */
export function createModuleProxy(remoteName: string, loadFn: () => Promise<any>): any {
  return new Proxy({}, {
    get(target, prop) {
      if (typeof prop === 'string') {
        return loadFn().then(module => module[prop])
      }
      return undefined
    }
  })
}

/**
 * 检查模块是否已加载
 */
export function isModuleLoaded(remoteName: string): boolean {
  return !!(window as any)[`__federation_${remoteName}__`]
}

/**
 * 获取运行时信息
 */
export function getRuntimeInfo(): any {
  return {
    version: '1.0.0',
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    modules: Object.keys((window as any)).filter(key => key.startsWith('__federation_'))
  }
}

/**
 * 错误处理包装器
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  fallback?: T
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args)
      if (result instanceof Promise) {
        return result.catch(error => {
          console.error('Federation error:', error)
          return fallback?.(...args) ?? Promise.reject(error)
        })
      }
      return result
    } catch (error) {
      console.error('Federation error:', error)
      return fallback?.(...args) ?? (() => { throw error })()
    }
  }) as T
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxAttempts - 1) {
        await delay(delayMs * Math.pow(2, i)) // 指数退避
      }
    }
  }
  
  throw lastError!
}

declare global {
  interface Window {
    __federation_shared__?: any
    [key: `__federation_${string}__`]: any
  }
}