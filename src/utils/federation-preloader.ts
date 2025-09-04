/**
 * Federation预加载器
 * 智能预加载远程应用和组件，提升用户体验
 */

import { microFrontendConfig, MicroAppStatus } from '../../configs/micro-frontend-config'
import { federationStrategy } from '../../configs/federation-strategy'
import { performanceMonitor } from './federation-performance-monitor'
import { federationBridge } from './micro-federation-bridge'

// 预加载策略
export enum PreloadStrategy {
  /** 立即预加载 */
  IMMEDIATE = 'immediate',
  /** 空闲时预加载 */
  IDLE = 'idle',
  /** 可见时预加载 */
  VISIBLE = 'visible',
  /** 用户交互时预加载 */
  INTERACTION = 'interaction',
  /** 路由匹配时预加载 */
  ROUTE = 'route'
}

// 预加载配置
export interface PreloadConfig {
  /** 预加载策略 */
  strategy: PreloadStrategy
  /** 优先级 (1-10) */
  priority?: number
  /** 延迟时间(ms) */
  delay?: number
  /** 是否并发加载 */
  concurrent?: boolean
  /** 最大并发数 */
  maxConcurrency?: number
  /** 超时时间(ms) */
  timeout?: number
  /** 是否在网络空闲时预加载 */
  networkIdle?: boolean
  /** 网络条件限制 */
  networkCondition?: 'fast' | 'slow' | 'any'
}

// 预加载任务
export interface PreloadTask {
  id: string
  appId: string
  config: PreloadConfig
  status: 'pending' | 'loading' | 'completed' | 'failed'
  startTime?: number
  endTime?: number
  error?: Error
}

/**
 * Federation预加载器
 */
export class FederationPreloader {
  private static instance: FederationPreloader
  private tasks = new Map<string, PreloadTask>()
  private loadingTasks = new Set<string>()
  private completedTasks = new Set<string>()
  private concurrentCount = 0
  private observer?: IntersectionObserver

  // 默认配置
  private defaultConfig: PreloadConfig = {
    strategy: PreloadStrategy.IDLE,
    priority: 5,
    delay: 0,
    concurrent: true,
    maxConcurrency: 3,
    timeout: 30000,
    networkIdle: true,
    networkCondition: 'any'
  }

  private constructor() {
    this.initializeObserver()
    this.setupEventListeners()
  }

  public static getInstance(): FederationPreloader {
    if (!FederationPreloader.instance) {
      FederationPreloader.instance = new FederationPreloader()
    }
    return FederationPreloader.instance
  }

  /**
   * 添加预加载任务
   */
  public addTask(appId: string, config: Partial<PreloadConfig> = {}): string {
    const taskId = `${appId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const task: PreloadTask = {
      id: taskId,
      appId,
      config: { ...this.defaultConfig, ...config },
      status: 'pending'
    }

    this.tasks.set(taskId, task)

    // 根据策略执行预加载
    this.scheduleTask(task)

    return taskId
  }

  /**
   * 批量添加预加载任务
   */
  public addTasks(configs: Array<{ appId: string; config?: Partial<PreloadConfig> }>): string[] {
    return configs.map(({ appId, config }) => this.addTask(appId, config))
  }

  /**
   * 调度任务执行
   */
  private scheduleTask(task: PreloadTask): void {
    const { strategy, delay = 0 } = task.config

    const execute = () => {
      switch (strategy) {
        case PreloadStrategy.IMMEDIATE:
          this.executeTask(task)
          break

        case PreloadStrategy.IDLE:
          this.scheduleIdleTask(task)
          break

        case PreloadStrategy.VISIBLE:
          this.scheduleVisibleTask(task)
          break

        case PreloadStrategy.INTERACTION:
          this.scheduleInteractionTask(task)
          break

        case PreloadStrategy.ROUTE:
          this.scheduleRouteTask(task)
          break
      }
    }

    if (delay > 0) {
      setTimeout(execute, delay)
    } else {
      execute()
    }
  }

  /**
   * 空闲时执行任务
   */
  private scheduleIdleTask(task: PreloadTask): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        if (this.shouldExecuteTask(task)) {
          this.executeTask(task)
        }
      }, { timeout: 5000 })
    } else {
      // fallback
      setTimeout(() => {
        if (this.shouldExecuteTask(task)) {
          this.executeTask(task)
        }
      }, 100)
    }
  }

  /**
   * 可见时执行任务
   */
  private scheduleVisibleTask(task: PreloadTask): void {
    // 这里需要结合具体的DOM元素来实现
    // 暂时使用空闲策略作为fallback
    this.scheduleIdleTask(task)
  }

  /**
   * 用户交互时执行任务
   */
  private scheduleInteractionTask(task: PreloadTask): void {
    const events = ['mousedown', 'touchstart', 'keydown']

    const handler = () => {
      if (this.shouldExecuteTask(task)) {
        this.executeTask(task)
        events.forEach(event => {
          document.removeEventListener(event, handler, { passive: true })
        })
      }
    }

    events.forEach(event => {
      document.addEventListener(event, handler, { passive: true, once: true })
    })
  }

  /**
   * 路由匹配时执行任务
   */
  private scheduleRouteTask(task: PreloadTask): void {
    // 监听路由变化
    federationBridge.on('route:changed', (event) => {
      const { route } = event.payload
      if (this.matchesRoute(task.appId, route) && this.shouldExecuteTask(task)) {
        this.executeTask(task)
      }
    })
  }

  /**
   * 检查是否应该执行任务
   */
  private shouldExecuteTask(task: PreloadTask): boolean {
    // 检查任务状态
    if (task.status !== 'pending') return false

    // 检查并发限制
    if (!task.config.concurrent && this.concurrentCount > 0) return false
    if (this.concurrentCount >= (task.config.maxConcurrency || 3)) return false

    // 检查应用状态
    const appInfo = microFrontendConfig.getAppInfo(task.appId)
    if (appInfo && appInfo.status !== MicroAppStatus.IDLE) return false

    // 检查网络条件
    if (!this.checkNetworkCondition(task.config.networkCondition)) return false

    return true
  }

  /**
   * 执行预加载任务
   */
  private async executeTask(task: PreloadTask): Promise<void> {
    if (!this.shouldExecuteTask(task)) return

    task.status = 'loading'
    task.startTime = Date.now()
    this.loadingTasks.add(task.id)
    this.concurrentCount++

    const monitorId = performanceMonitor.startLoading(`preload_${task.appId}`)

    try {
      // 执行预加载
      await microFrontendConfig.preloadApp(task.appId)

      // 更新任务状态
      task.status = 'completed'
      task.endTime = Date.now()
      this.completedTasks.add(task.id)

      performanceMonitor.endLoading(monitorId)

      // 发布预加载完成事件
      federationBridge.emit('preload:completed', 'preloader', {
        appId: task.appId,
        taskId: task.id,
        loadTime: task.endTime - (task.startTime || 0)
      })

      console.log(`✅ 预加载完成: ${task.appId}`)

    } catch (error) {
      task.status = 'failed'
      task.endTime = Date.now()
      task.error = error as Error

      performanceMonitor.endLoadingWithError(monitorId, error as Error)

      // 发布预加载失败事件
      federationBridge.emit('preload:failed', 'preloader', {
        appId: task.appId,
        taskId: task.id,
        error: (error as Error).message
      })

      console.error(`❌ 预加载失败: ${task.appId}`, error)

    } finally {
      this.loadingTasks.delete(task.id)
      this.concurrentCount--

      // 尝试执行下一个任务
      this.executeNextPendingTask()
    }
  }

  /**
   * 执行下一个待处理任务
   */
  private executeNextPendingTask(): void {
    const pendingTasks = Array.from(this.tasks.values())
      .filter(task => task.status === 'pending')
      .sort((a, b) => (b.config.priority || 5) - (a.config.priority || 5))

    for (const task of pendingTasks) {
      if (this.shouldExecuteTask(task)) {
        this.executeTask(task)
        break
      }
    }
  }

  /**
   * 检查网络条件
   */
  private checkNetworkCondition(condition?: 'fast' | 'slow' | 'any'): boolean {
    if (!condition || condition === 'any') return true

    // 检查网络连接信息
    if ('connection' in navigator) {
      const conn = (navigator as any).connection
      if (conn) {
        const effectiveType = conn.effectiveType

        if (condition === 'fast') {
          return ['4g'].includes(effectiveType)
        } else if (condition === 'slow') {
          return ['slow-2g', '2g', '3g'].includes(effectiveType)
        }
      }
    }

    return true
  }

  /**
   * 检查路由匹配
   */
  private matchesRoute(appId: string, route: any): boolean {
    // 简单的路由匹配逻辑
    return route?.path?.includes(appId) || route?.name?.includes(appId)
  }

  /**
   * 初始化观察器
   */
  private initializeObserver(): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const appId = entry.target.getAttribute('data-preload-app')
            if (appId) {
              this.triggerVisiblePreload(appId)
            }
          }
        })
      })
    }
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // 页面可见性变化
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          // 页面变为可见时，处理待处理的任务
          this.executeNextPendingTask()
        }
      })
    }
  }

  /**
   * 触发可见预加载
   */
  private triggerVisiblePreload(appId: string): void {
    const task = Array.from(this.tasks.values()).find(
      t => t.appId === appId && t.config.strategy === PreloadStrategy.VISIBLE && t.status === 'pending'
    )

    if (task && this.shouldExecuteTask(task)) {
      this.executeTask(task)
    }
  }

  /**
   * 观察DOM元素进行预加载
   */
  public observeElement(element: Element, appId: string): void {
    if (this.observer && element) {
      element.setAttribute('data-preload-app', appId)
      this.observer.observe(element)
    }
  }

  /**
   * 停止观察DOM元素
   */
  public unobserveElement(element: Element): void {
    if (this.observer && element) {
      this.observer.unobserve(element)
    }
  }

  /**
   * 获取预加载统计
   */
  public getStats() {
    const allTasks = Array.from(this.tasks.values())

    return {
      totalTasks: allTasks.length,
      pendingTasks: allTasks.filter(t => t.status === 'pending').length,
      loadingTasks: allTasks.filter(t => t.status === 'loading').length,
      completedTasks: allTasks.filter(t => t.status === 'completed').length,
      failedTasks: allTasks.filter(t => t.status === 'failed').length,
      concurrentCount: this.concurrentCount,
      averageLoadTime: this.calculateAverageLoadTime(),
      successRate: this.calculateSuccessRate()
    }
  }

  /**
   * 计算平均加载时间
   */
  private calculateAverageLoadTime(): number {
    const completedTasks = Array.from(this.tasks.values())
      .filter(t => t.status === 'completed' && t.startTime && t.endTime)

    if (completedTasks.length === 0) return 0

    const totalTime = completedTasks.reduce((sum, task) =>
      sum + ((task.endTime || 0) - (task.startTime || 0)), 0
    )

    return totalTime / completedTasks.length
  }

  /**
   * 计算成功率
   */
  private calculateSuccessRate(): number {
    const finishedTasks = Array.from(this.tasks.values())
      .filter(t => t.status === 'completed' || t.status === 'failed')

    if (finishedTasks.length === 0) return 0

    const successTasks = finishedTasks.filter(t => t.status === 'completed').length
    return (successTasks / finishedTasks.length) * 100
  }

  /**
   * 清理已完成的任务
   */
  public clearCompletedTasks(): void {
    const completedTaskIds = Array.from(this.tasks.values())
      .filter(t => t.status === 'completed' || t.status === 'failed')
      .map(t => t.id)

    completedTaskIds.forEach(id => {
      this.tasks.delete(id)
      this.completedTasks.delete(id)
    })
  }

  /**
   * 清理所有任务
   */
  public clear(): void {
    this.tasks.clear()
    this.loadingTasks.clear()
    this.completedTasks.clear()
    this.concurrentCount = 0
  }
}

// 导出单例实例
export const preloader = FederationPreloader.getInstance()

export default preloader
