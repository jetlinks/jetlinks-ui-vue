/**
 * 微前端桥接工具
 * 为微前端和模块联邦提供统一的通信和数据共享机制
 */

import { reactive, ref, computed } from 'vue'
import type { App } from 'vue'
import { microFrontendConfig } from '@/configs/micro-frontend-config'
import { performanceMonitor } from './federation-performance-monitor'

// 事件类型
export interface BridgeEvent {
  type: string
  source: string
  target?: string
  payload: any
  timestamp: number
}

// 共享数据
export interface SharedData {
  [key: string]: any
}

// 应用上下文
export interface AppContext {
  appId: string
  appName: string
  version?: string
  env?: string
  routes?: any[]
  store?: any
  [key: string]: any
}

/**
 * 微前端桥接器
 */
export class MicroFederationBridge {
  private static instance: MicroFederationBridge
  private eventBus = new Map<string, Array<(event: BridgeEvent) => void>>()
  private sharedData = reactive<SharedData>({})
  private appContexts = new Map<string, AppContext>()
  private globalApp?: App
  
  private constructor() {
    // 监听跨窗口通信
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleWindowMessage.bind(this))
    }
  }

  public static getInstance(): MicroFederationBridge {
    if (!MicroFederationBridge.instance) {
      MicroFederationBridge.instance = new MicroFederationBridge()
    }
    return MicroFederationBridge.instance
  }

  /**
   * 设置全局Vue应用实例
   */
  public setGlobalApp(app: App): void {
    this.globalApp = app
  }

  /**
   * 注册应用上下文
   */
  public registerAppContext(context: AppContext): void {
    this.appContexts.set(context.appId, context)
    
    // 发布应用注册事件
    this.emit('app:registered', 'system', {
      appId: context.appId,
      appName: context.appName,
      context
    })
  }

  /**
   * 获取应用上下文
   */
  public getAppContext(appId: string): AppContext | undefined {
    return this.appContexts.get(appId)
  }

  /**
   * 获取所有应用上下文
   */
  public getAllAppContexts(): Map<string, AppContext> {
    return new Map(this.appContexts)
  }

  /**
   * 事件发布
   */
  public emit(type: string, source: string, payload: any, target?: string): void {
    const event: BridgeEvent = {
      type,
      source,
      target,
      payload,
      timestamp: Date.now()
    }

    // 发送给本地监听器
    this.notifyLocalListeners(event)

    // 如果有目标，尝试跨窗口通信
    if (target && typeof window !== 'undefined') {
      this.sendToRemote(event)
    }
  }

  /**
   * 事件监听
   */
  public on(type: string, callback: (event: BridgeEvent) => void): () => void {
    if (!this.eventBus.has(type)) {
      this.eventBus.set(type, [])
    }
    
    this.eventBus.get(type)!.push(callback)
    
    // 返回取消监听的函数
    return () => this.off(type, callback)
  }

  /**
   * 移除事件监听
   */
  public off(type: string, callback?: (event: BridgeEvent) => void): void {
    const listeners = this.eventBus.get(type)
    if (!listeners) return

    if (callback) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    } else {
      // 移除所有监听器
      this.eventBus.set(type, [])
    }
  }

  /**
   * 一次性事件监听
   */
  public once(type: string, callback: (event: BridgeEvent) => void): () => void {
    const onceWrapper = (event: BridgeEvent) => {
      callback(event)
      this.off(type, onceWrapper)
    }
    
    return this.on(type, onceWrapper)
  }

  /**
   * 设置共享数据
   */
  public setSharedData(key: string, value: any): void {
    this.sharedData[key] = value
    
    // 发布数据变更事件
    this.emit('data:changed', 'system', {
      key,
      value,
      timestamp: Date.now()
    })
  }

  /**
   * 获取共享数据
   */
  public getSharedData(key: string): any {
    return this.sharedData[key]
  }

  /**
   * 批量设置共享数据
   */
  public setSharedDataBatch(data: Record<string, any>): void {
    Object.entries(data).forEach(([key, value]) => {
      this.sharedData[key] = value
    })
    
    // 发布批量数据变更事件
    this.emit('data:batch_changed', 'system', {
      keys: Object.keys(data),
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 创建响应式共享数据
   */
  public createSharedRef<T>(key: string, defaultValue: T) {
    // 初始化数据
    if (!(key in this.sharedData)) {
      this.setSharedData(key, defaultValue)
    }
    
    return computed({
      get: () => this.getSharedData(key),
      set: (value) => this.setSharedData(key, value)
    })
  }

  /**
   * 处理跨窗口消息
   */
  private handleWindowMessage(event: MessageEvent): void {
    if (event.data?.type === 'federation-bridge-event') {
      const bridgeEvent: BridgeEvent = event.data.payload
      this.notifyLocalListeners(bridgeEvent)
    }
  }

  /**
   * 发送到远程窗口
   */
  private sendToRemote(event: BridgeEvent): void {
    if (typeof window === 'undefined') return

    // 向所有子窗口发送
    window.postMessage({
      type: 'federation-bridge-event',
      payload: event
    }, '*')

    // 向父窗口发送
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'federation-bridge-event',
        payload: event
      }, '*')
    }
  }

  /**
   * 通知本地监听器
   */
  private notifyLocalListeners(event: BridgeEvent): void {
    const listeners = this.eventBus.get(event.type)
    if (!listeners) return

    listeners.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.error('桥接事件监听器错误:', error)
      }
    })
  }

  /**
   * 获取应用统计信息
   */
  public getAppStats() {
    const contexts = Array.from(this.appContexts.values())
    const microConfig = microFrontendConfig.getStats()
    
    return {
      registeredApps: contexts.length,
      appList: contexts.map(ctx => ({
        appId: ctx.appId,
        appName: ctx.appName,
        version: ctx.version
      })),
      microFrontend: microConfig,
      sharedDataKeys: Object.keys(this.sharedData),
      eventTypes: Array.from(this.eventBus.keys())
    }
  }

  /**
   * 清理资源
   */
  public destroy(): void {
    // 清理事件监听器
    this.eventBus.clear()
    
    // 清理共享数据
    Object.keys(this.sharedData).forEach(key => {
      delete this.sharedData[key]
    })
    
    // 清理应用上下文
    this.appContexts.clear()
    
    // 移除窗口事件监听
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this.handleWindowMessage.bind(this))
    }
  }
}

// 导出单例实例
export const federationBridge = MicroFederationBridge.getInstance()

// Vue插件安装函数
export function installFederationBridge(app: App): void {
  // 设置全局应用实例
  federationBridge.setGlobalApp(app)
  
  // 提供全局属性
  app.config.globalProperties.$bridge = federationBridge
  
  // 提供依赖注入
  app.provide('bridge', federationBridge)
  
  console.log('MicroFederationBridge 插件已安装')
}

// Vue组合式API hooks
export function useBridge() {
  return federationBridge
}

export function useSharedData<T>(key: string, defaultValue: T) {
  return federationBridge.createSharedRef(key, defaultValue)
}

export function useBridgeEvent(type: string, callback: (event: BridgeEvent) => void) {
  const unsubscribe = federationBridge.on(type, callback)
  
  // Vue 3 的生命周期钩子
  if (typeof window !== 'undefined' && (window as any).getCurrentInstance) {
    const { onUnmounted } = require('vue')
    onUnmounted(unsubscribe)
  }
  
  return unsubscribe
}

export default federationBridge