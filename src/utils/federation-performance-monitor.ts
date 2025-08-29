/**
 * Federation性能监控
 * 监控模块联邦的加载性能和运行状态
 */

// 性能指标接口
export interface PerformanceMetrics {
  /** 应用/组件名称 */
  name: string
  /** 开始时间 */
  startTime: number
  /** 结束时间 */
  endTime?: number
  /** 加载耗时(ms) */
  loadTime?: number
  /** 状态 */
  status: 'loading' | 'success' | 'error' | 'timeout'
  /** 错误信息 */
  error?: string
  /** 资源大小(bytes) */
  resourceSize?: number
  /** 网络时间(ms) */
  networkTime?: number
  /** 解析时间(ms) */
  parseTime?: number
}

// 性能统计
export interface PerformanceStats {
  /** 总请求数 */
  totalRequests: number
  /** 成功请求数 */
  successRequests: number
  /** 失败请求数 */
  failedRequests: number
  /** 平均加载时间(ms) */
  averageLoadTime: number
  /** 最大加载时间(ms) */
  maxLoadTime: number
  /** 最小加载时间(ms) */
  minLoadTime: number
  /** 成功率 */
  successRate: number
}

// 阈值配置
export interface ThresholdConfig {
  /** 警告阈值(ms) */
  warning: number
  /** 错误阈值(ms) */
  error: number
  /** 超时阈值(ms) */
  timeout: number
}

/**
 * Federation性能监控器
 */
export class FederationPerformanceMonitor {
  private static instance: FederationPerformanceMonitor
  private metrics = new Map<string, PerformanceMetrics>()
  private thresholds: ThresholdConfig = {
    warning: 3000,  // 3秒
    error: 5000,    // 5秒
    timeout: 10000  // 10秒
  }
  private observers: Array<(metrics: PerformanceMetrics) => void> = []

  private constructor() {}

  public static getInstance(): FederationPerformanceMonitor {
    if (!FederationPerformanceMonitor.instance) {
      FederationPerformanceMonitor.instance = new FederationPerformanceMonitor()
    }
    return FederationPerformanceMonitor.instance
  }

  /**
   * 开始监控加载
   */
  public startLoading(name: string): string {
    const id = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const metrics: PerformanceMetrics = {
      name,
      startTime: performance.now(),
      status: 'loading'
    }
    
    this.metrics.set(id, metrics)
    return id
  }

  /**
   * 结束监控加载(成功)
   */
  public endLoading(id: string, resourceSize?: number): void {
    const metrics = this.metrics.get(id)
    if (!metrics) return

    const endTime = performance.now()
    const loadTime = endTime - metrics.startTime

    const updatedMetrics: PerformanceMetrics = {
      ...metrics,
      endTime,
      loadTime,
      resourceSize,
      status: 'success'
    }

    this.metrics.set(id, updatedMetrics)
    this.analyzePerformance(updatedMetrics)
    this.notifyObservers(updatedMetrics)
  }

  /**
   * 结束监控加载(失败)
   */
  public endLoadingWithError(id: string, error: Error): void {
    const metrics = this.metrics.get(id)
    if (!metrics) return

    const endTime = performance.now()
    const loadTime = endTime - metrics.startTime

    const updatedMetrics: PerformanceMetrics = {
      ...metrics,
      endTime,
      loadTime,
      status: 'error',
      error: error.message
    }

    this.metrics.set(id, updatedMetrics)
    this.analyzePerformance(updatedMetrics)
    this.notifyObservers(updatedMetrics)
  }

  /**
   * 标记为超时
   */
  public markAsTimeout(id: string): void {
    const metrics = this.metrics.get(id)
    if (!metrics) return

    const endTime = performance.now()
    const loadTime = endTime - metrics.startTime

    const updatedMetrics: PerformanceMetrics = {
      ...metrics,
      endTime,
      loadTime,
      status: 'timeout'
    }

    this.metrics.set(id, updatedMetrics)
    this.analyzePerformance(updatedMetrics)
    this.notifyObservers(updatedMetrics)
  }

  /**
   * 分析性能指标
   */
  private analyzePerformance(metrics: PerformanceMetrics): void {
    if (!metrics.loadTime) return

    const { loadTime, name, status } = metrics
    
    // 检查性能阈值
    if (status === 'success') {
      if (loadTime > this.thresholds.error) {
        console.error(`🔴 Federation性能告警: ${name} 加载时间过长 ${loadTime.toFixed(2)}ms (>${this.thresholds.error}ms)`)
      } else if (loadTime > this.thresholds.warning) {
        console.warn(`🟡 Federation性能警告: ${name} 加载时间较长 ${loadTime.toFixed(2)}ms (>${this.thresholds.warning}ms)`)
      } else {
        console.log(`🟢 Federation加载成功: ${name} 耗时 ${loadTime.toFixed(2)}ms`)
      }
    } else if (status === 'error') {
      console.error(`🔴 Federation加载失败: ${name} 耗时 ${loadTime.toFixed(2)}ms, 错误: ${metrics.error}`)
    } else if (status === 'timeout') {
      console.error(`🔴 Federation加载超时: ${name} 耗时 ${loadTime.toFixed(2)}ms`)
    }
  }

  /**
   * 获取性能统计
   */
  public getStats(): PerformanceStats {
    const allMetrics = Array.from(this.metrics.values())
    const completedMetrics = allMetrics.filter(m => m.loadTime !== undefined)
    
    if (completedMetrics.length === 0) {
      return {
        totalRequests: 0,
        successRequests: 0,
        failedRequests: 0,
        averageLoadTime: 0,
        maxLoadTime: 0,
        minLoadTime: 0,
        successRate: 0
      }
    }

    const successMetrics = completedMetrics.filter(m => m.status === 'success')
    const loadTimes = completedMetrics.map(m => m.loadTime!).filter(t => t > 0)

    return {
      totalRequests: completedMetrics.length,
      successRequests: successMetrics.length,
      failedRequests: completedMetrics.length - successMetrics.length,
      averageLoadTime: loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0,
      maxLoadTime: loadTimes.length > 0 ? Math.max(...loadTimes) : 0,
      minLoadTime: loadTimes.length > 0 ? Math.min(...loadTimes) : 0,
      successRate: completedMetrics.length > 0 ? (successMetrics.length / completedMetrics.length) * 100 : 0
    }
  }

  /**
   * 获取指定应用的性能指标
   */
  public getMetricsByName(name: string): PerformanceMetrics[] {
    return Array.from(this.metrics.values()).filter(m => m.name === name)
  }

  /**
   * 获取所有性能指标
   */
  public getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
  }

  /**
   * 设置性能阈值
   */
  public setThresholds(thresholds: Partial<ThresholdConfig>): void {
    this.thresholds = { ...this.thresholds, ...thresholds }
  }

  /**
   * 添加性能观察者
   */
  public addObserver(callback: (metrics: PerformanceMetrics) => void): void {
    this.observers.push(callback)
  }

  /**
   * 移除性能观察者
   */
  public removeObserver(callback: (metrics: PerformanceMetrics) => void): void {
    const index = this.observers.indexOf(callback)
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  /**
   * 通知观察者
   */
  private notifyObservers(metrics: PerformanceMetrics): void {
    this.observers.forEach(callback => {
      try {
        callback(metrics)
      } catch (error) {
        console.error('性能监控观察者回调错误:', error)
      }
    })
  }

  /**
   * 清除历史数据
   */
  public clear(): void {
    this.metrics.clear()
  }

  /**
   * 清除过期数据
   */
  public clearExpired(maxAge: number = 300000): void { // 默认5分钟
    const now = performance.now()
    const expiredKeys: string[] = []
    
    this.metrics.forEach((metrics, key) => {
      if (now - metrics.startTime > maxAge) {
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => this.metrics.delete(key))
  }

  /**
   * 生成性能报告
   */
  public generateReport(): string {
    const stats = this.getStats()
    const allMetrics = this.getAllMetrics()
    
    const report = [
      '=== Federation性能报告 ===',
      `总请求数: ${stats.totalRequests}`,
      `成功请求数: ${stats.successRequests}`,
      `失败请求数: ${stats.failedRequests}`,
      `成功率: ${stats.successRate.toFixed(2)}%`,
      `平均加载时间: ${stats.averageLoadTime.toFixed(2)}ms`,
      `最大加载时间: ${stats.maxLoadTime.toFixed(2)}ms`,
      `最小加载时间: ${stats.minLoadTime.toFixed(2)}ms`,
      '',
      '=== 详细指标 ===',
      ...allMetrics.map(m => 
        `${m.name}: ${m.status} - ${m.loadTime?.toFixed(2) || 'N/A'}ms` +
        (m.error ? ` (${m.error})` : '')
      )
    ]
    
    return report.join('\n')
  }
}

// 导出单例实例
export const performanceMonitor = FederationPerformanceMonitor.getInstance()

// 装饰器：自动性能监控
export function monitorPerformance(name?: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const monitorName = name || `${target.constructor.name}.${propertyKey}`

    descriptor.value = async function(...args: any[]) {
      const id = performanceMonitor.startLoading(monitorName)
      
      try {
        const result = await originalMethod.apply(this, args)
        performanceMonitor.endLoading(id)
        return result
      } catch (error) {
        performanceMonitor.endLoadingWithError(id, error as Error)
        throw error
      }
    }

    return descriptor
  }
}

export default performanceMonitor