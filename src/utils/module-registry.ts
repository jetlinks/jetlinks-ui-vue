/**
 * 模块注册中心
 * 用于统一管理各个子模块的 API、组件、工具函数等资源
 * 支持微前端和模块联邦
 */

// 导入类型定义
import type { ModuleResource, RegisterOptions } from '@/types/module-registry.d'
import { federationBridge } from './micro-federation-bridge'
import { performanceMonitor } from './federation-performance-monitor'

// 注册表存储所有模块的资源
const moduleRegistryMap = new Map<string, ModuleResource>();

// 模块状态枚举
export enum ModuleStatus {
  IDLE = 'idle',
  LOADING = 'loading', 
  LOADED = 'loaded',
  REGISTERED = 'registered',
  ERROR = 'error'
}

// 模块元数据接口
export interface ModuleMetadata {
  moduleId: string
  status: ModuleStatus
  loadTime?: number
  registerTime?: number
  version?: string
  source: 'local' | 'federation' | 'micro-app'
  dependencies?: string[]
  error?: Error
}

export class ModuleRegistry {
  private static instance: ModuleRegistry;
  private registry = moduleRegistryMap;
  private metadata = new Map<string, ModuleMetadata>();
  private loadingPromises = new Map<string, Promise<void>>();

  private constructor() {
    this.setupEventListeners();
  }

  /**
   * 获取注册中心实例（单例）
   */
  public static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }

  /**
   * 注册模块资源
   * @param moduleId 模块唯一标识
   * @param resource 模块资源
   * @param options 注册选项
   */
  public register(
    moduleId: string, 
    resource: Partial<ModuleResource>, 
    options: RegisterOptions = {}
  ): void {
    if (!moduleId) {
      throw new Error('模块ID不能为空');
    }

    const { override = false } = options;
    
    // 检查模块是否已存在
    if (this.registry.has(moduleId) && !override) {
      console.warn(`模块 ${moduleId} 已存在，使用 override: true 来覆盖`);
      return;
    }

    const existingResource = this.registry.get(moduleId) || ({ moduleId } as ModuleResource);
    const mergedResource: ModuleResource = {
      ...existingResource,
      ...resource,
      moduleId
    };

    this.registry.set(moduleId, mergedResource);
    
    // 更新模块元数据
    this.updateMetadata(moduleId, {
      status: ModuleStatus.REGISTERED,
      registerTime: Date.now(),
      source: this.detectSource(resource)
    });
    
    // 发布模块注册事件
    federationBridge.emit('module:registered', 'module-registry', {
      moduleId,
      resource: mergedResource
    });
    
    console.log(`模块 ${moduleId} 注册成功`);
  }

  /**
   * 注册模块的特定资源类型
   * @param moduleId 模块ID
   * @param resourceType 资源类型
   * @param resources 资源对象
   * @param options 注册选项
   */
  public registerResource<T = any>(
    moduleId: string,
    resourceType: keyof ModuleResource,
    resources: Record<string, T>,
    options: RegisterOptions = {}
  ): void {
    if (!moduleId || !resourceType) {
      throw new Error('模块ID和资源类型不能为空');
    }

    const existingModule = this.registry.get(moduleId) || ({ moduleId } as ModuleResource);
    const existingResources = existingModule[resourceType] || {};
    
    const { override = false } = options;
    
    // 合并资源
    const mergedResources = override 
      ? { ...existingResources, ...resources }
      : { ...resources, ...existingResources };

    const updatedModule: ModuleResource = {
      ...existingModule,
      [resourceType]: mergedResources
    };

    this.registry.set(moduleId, updatedModule);
    
    console.log(`模块 ${moduleId} 的 ${String(resourceType)} 资源注册成功`);
  }

  /**
   * 获取模块的完整资源
   * @param moduleId 模块ID
   * @returns 模块资源或undefined
   */
  public getModule(moduleId: string): ModuleResource | undefined {
    return this.registry.get(moduleId);
  }

  /**
   * 获取模块的特定资源类型
   * @param moduleId 模块ID
   * @param resourceType 资源类型
   * @returns 资源对象或undefined
   */
  public getResource<T = any>(
    moduleId: string, 
    resourceType: keyof ModuleResource
  ): Record<string, T> | undefined {
    const module = this.registry.get(moduleId);
    const resource = module?.[resourceType];
    
    // 如果 resourceType 是 'routes'，则可能不是 Record 类型
    if (resourceType === 'routes') {
      return resource as any;
    }
    
    return resource as Record<string, T> | undefined;
  }

  /**
   * 获取模块的特定资源项
   * @param moduleId 模块ID
   * @param resourceType 资源类型
   * @param resourceName 资源名称
   * @returns 具体资源或undefined
   */
  public getResourceItem<T = any>(
    moduleId: string,
    resourceType: keyof ModuleResource,
    resourceName: string
  ): T | undefined {
    const resources = this.getResource<T>(moduleId, resourceType);
    return resources?.[resourceName];
  }

  /**
   * 检查模块是否已注册
   * @param moduleId 模块ID
   * @returns boolean
   */
  public hasModule(moduleId: string): boolean {
    return this.registry.has(moduleId);
  }

  /**
   * 检查模块是否有特定资源类型
   * @param moduleId 模块ID
   * @param resourceType 资源类型
   * @returns boolean
   */
  public hasResource(moduleId: string, resourceType: keyof ModuleResource): boolean {
    const module = this.registry.get(moduleId);
    return !!(module && module[resourceType]);
  }

  /**
   * 检查模块是否有特定资源项
   * @param moduleId 模块ID
   * @param resourceType 资源类型
   * @param resourceName 资源名称
   * @returns boolean
   */
  public hasResourceItem(
    moduleId: string, 
    resourceType: keyof ModuleResource, 
    resourceName: string
  ): boolean {
    const resources = this.getResource(moduleId, resourceType);
    return !!(resources && resources[resourceName]);
  }

  /**
   * 移除模块
   * @param moduleId 模块ID
   * @returns 是否移除成功
   */
  public unregister(moduleId: string): boolean {
    if (this.registry.has(moduleId)) {
      this.registry.delete(moduleId);
      console.log(`模块 ${moduleId} 已移除`);
      return true;
    }
    return false;
  }

  /**
   * 移除模块的特定资源类型
   * @param moduleId 模块ID
   * @param resourceType 资源类型
   * @returns boolean
   */
  public unregisterResource(moduleId: string, resourceType: keyof ModuleResource): boolean {
    const module = this.registry.get(moduleId);
    if (module && module[resourceType]) {
      delete module[resourceType];
      this.registry.set(moduleId, module);
      console.log(`模块 ${moduleId} 的 ${String(resourceType)} 资源已移除`);
      return true;
    }
    return false;
  }

  /**
   * 获取所有已注册的模块ID
   * @returns 模块ID数组
   */
  public getAllModuleIds(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * 获取所有已注册的模块
   * @returns 模块资源Map
   */
  public getAllModules(): Map<string, ModuleResource> {
    return new Map(this.registry);
  }

  /**
   * 清空所有注册的模块
   */
  public clear(): void {
    this.registry.clear();
    console.log('所有模块已清空');
  }

  /**
   * 批量注册多个模块
   * @param modules 模块配置数组
   * @param options 注册选项
   */
  public batchRegister(
    modules: Array<{ moduleId: string; resource: Partial<ModuleResource> }>,
    options: RegisterOptions = {}
  ): void {
    const { allowPartialFailure = false } = options;
    const failedModules: string[] = [];

    modules.forEach(({ moduleId, resource }) => {
      try {
        this.register(moduleId, resource, options);
      } catch (error) {
        failedModules.push(moduleId);
        console.error(`模块 ${moduleId} 注册失败:`, error);
        
        if (!allowPartialFailure) {
          throw new Error(`批量注册失败，模块 ${moduleId} 注册出错`);
        }
      }
    });

    if (failedModules.length > 0 && allowPartialFailure) {
      console.warn(`以下模块注册失败: ${failedModules.join(', ')}`);
    }
  }

  /**
   * 搜索包含特定资源的模块
   * @param resourceType 资源类型
   * @param resourceName 资源名称（可选）
   * @returns 包含该资源的模块ID数组
   */
  public searchModules(
    resourceType: keyof ModuleResource,
    resourceName?: string
  ): string[] {
    const matchingModules: string[] = [];

    this.registry.forEach((module, moduleId) => {
      const resources = module[resourceType];
      if (resources) {
        // 特殊处理 routes 类型
        if (resourceType === 'routes') {
          if (!resourceName || (typeof resources === 'object' && resources !== null && (resources as any)[resourceName])) {
            matchingModules.push(moduleId);
          }
        } else {
          // 其他类型按照 Record 处理
          const resourcesAsRecord = resources as Record<string, any>;
          if (!resourceName || resourcesAsRecord[resourceName]) {
            matchingModules.push(moduleId);
          }
        }
      }
    });

    return matchingModules;
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // 监听应用加载完成事件
    federationBridge.on('app:loaded', (event) => {
      const { appId } = event.payload;
      this.updateMetadata(appId, {
        status: ModuleStatus.LOADED,
        loadTime: Date.now()
      });
    });

    // 监听应用卸载事件
    federationBridge.on('app:unmounted', (event) => {
      const { appId } = event.payload;
      this.handleModuleUnload(appId);
    });
  }

  /**
   * 检测资源来源
   */
  private detectSource(resource: Partial<ModuleResource>): 'local' | 'federation' | 'micro-app' {
    // 简单的来源检测逻辑
    if ((resource as any).federation) return 'federation';
    if ((resource as any).microApp) return 'micro-app';
    return 'local';
  }

  /**
   * 更新模块元数据
   */
  public updateMetadata(moduleId: string, updates: Partial<ModuleMetadata>): void {
    const existing = this.metadata.get(moduleId) || {
      moduleId,
      status: ModuleStatus.IDLE,
      source: 'local'
    };
    
    const updated: ModuleMetadata = { ...existing, ...updates };
    this.metadata.set(moduleId, updated);
  }

  /**
   * 获取模块元数据
   */
  public getMetadata(moduleId: string): ModuleMetadata | undefined {
    return this.metadata.get(moduleId);
  }

  /**
   * 获取所有模块元数据
   */
  public getAllMetadata(): Map<string, ModuleMetadata> {
    return new Map(this.metadata);
  }

  /**
   * 动态加载联邦模块
   */
  public async loadFederationModule(
    moduleId: string, 
    remoteName: string, 
    exposedModule: string,
    entryUrl?: string
  ): Promise<ModuleResource | null> {
    // 避免重复加载
    if (this.loadingPromises.has(moduleId)) {
      await this.loadingPromises.get(moduleId);
      return this.getModule(moduleId) || null;
    }

    // 检查模块是否已加载
    if (this.hasModule(moduleId)) {
      return this.getModule(moduleId)!;
    }

    this.updateMetadata(moduleId, {
      status: ModuleStatus.LOADING
    });

    const monitorId = performanceMonitor.startLoading(`federation_module_${moduleId}`);
    
    const loadPromise = this.doLoadFederationModule(moduleId, remoteName, exposedModule, entryUrl);
    this.loadingPromises.set(moduleId, loadPromise);

    try {
      await loadPromise;
      
      const module = this.getModule(moduleId);
      
      performanceMonitor.endLoading(monitorId);
      
      // 发布加载完成事件
      federationBridge.emit('federation-module:loaded', 'module-registry', {
        moduleId,
        remoteName,
        exposedModule
      });

      return module || null;

    } catch (error) {
      this.updateMetadata(moduleId, {
        status: ModuleStatus.ERROR,
        error: error as Error
      });
      
      performanceMonitor.endLoadingWithError(monitorId, error as Error);
      
      // 发布加载失败事件
      federationBridge.emit('federation-module:load-failed', 'module-registry', {
        moduleId,
        remoteName,
        exposedModule,
        error: (error as Error).message
      });

      throw error;

    } finally {
      this.loadingPromises.delete(moduleId);
    }
  }

  /**
   * 执行联邦模块加载
   */
  private async doLoadFederationModule(
    moduleId: string,
    remoteName: string, 
    exposedModule: string,
    entryUrl?: string
  ): Promise<void> {
    try {
      // 动态导入federation loader
      const { loadComponent } = await import('./federation-loader');
      
      // 加载远程组件/模块
      const result = await loadComponent({
        remoteName,
        exposedModule,
        entryUrl,
        useCache: true
      });

      if (!result.success || !result.data) {
        throw new Error(`加载联邦模块失败: ${result.error?.message || '未知错误'}`);
      }

      // 处理加载的模块
      const moduleExports = result.data;
      
      // 如果模块导出了register函数，自动注册
      if (typeof moduleExports.register === 'function') {
        await moduleExports.register();
      } else if (moduleExports.default?.register) {
        await moduleExports.default.register();
      } else {
        // 手动注册模块资源
        this.register(moduleId, {
          components: moduleExports.components || {},
          apis: moduleExports.apis || {},
          utils: moduleExports.utils || {},
          stores: moduleExports.stores || {},
          routes: moduleExports.routes || [],
          federation: {
            remoteName,
            exposedModule,
            entryUrl,
            loaded: true
          }
        } as any);
      }

    } catch (error) {
      console.error(`联邦模块加载失败 ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * 处理模块卸载
   */
  public handleModuleUnload(moduleId: string): void {
    // 更新状态
    this.updateMetadata(moduleId, {
      status: ModuleStatus.IDLE
    });

    // 发布卸载事件
    federationBridge.emit('module:unloaded', 'module-registry', {
      moduleId
    });

    console.log(`模块 ${moduleId} 已卸载`);
  }

  /**
   * 批量加载联邦模块
   */
  public async batchLoadFederationModules(
    configs: Array<{
      moduleId: string;
      remoteName: string;
      exposedModule: string;
      entryUrl?: string;
    }>
  ): Promise<(ModuleResource | null)[]> {
    const promises = configs.map(config => 
      this.loadFederationModule(
        config.moduleId,
        config.remoteName, 
        config.exposedModule,
        config.entryUrl
      ).catch(() => null)
    );

    return Promise.all(promises);
  }

  /**
   * 获取模块统计信息
   */
  public getModuleStats() {
    const allMetadata = Array.from(this.metadata.values());
    
    return {
      totalModules: this.registry.size,
      registeredModules: allMetadata.filter(m => m.status === ModuleStatus.REGISTERED).length,
      loadingModules: allMetadata.filter(m => m.status === ModuleStatus.LOADING).length,
      errorModules: allMetadata.filter(m => m.status === ModuleStatus.ERROR).length,
      federationModules: allMetadata.filter(m => m.source === 'federation').length,
      microAppModules: allMetadata.filter(m => m.source === 'micro-app').length,
      localModules: allMetadata.filter(m => m.source === 'local').length,
      averageLoadTime: this.calculateAverageLoadTime(),
      modulesByStatus: this.groupModulesByStatus()
    };
  }

  /**
   * 计算平均加载时间
   */
  private calculateAverageLoadTime(): number {
    const loadedModules = Array.from(this.metadata.values())
      .filter(m => m.loadTime && m.registerTime);
    
    if (loadedModules.length === 0) return 0;
    
    const totalTime = loadedModules.reduce((sum, m) => 
      sum + ((m.registerTime || 0) - (m.loadTime || 0)), 0
    );
    
    return totalTime / loadedModules.length;
  }

  /**
   * 按状态分组模块
   */
  private groupModulesByStatus(): Record<ModuleStatus, string[]> {
    const result = {
      [ModuleStatus.IDLE]: [] as string[],
      [ModuleStatus.LOADING]: [] as string[],
      [ModuleStatus.LOADED]: [] as string[],
      [ModuleStatus.REGISTERED]: [] as string[],
      [ModuleStatus.ERROR]: [] as string[]
    };
    
    this.metadata.forEach((metadata, moduleId) => {
      result[metadata.status].push(moduleId);
    });
    
    return result;
  }

  /**
   * 重新加载模块
   */
  public async reloadModule(moduleId: string): Promise<void> {
    const metadata = this.metadata.get(moduleId);
    if (!metadata) {
      throw new Error(`模块 ${moduleId} 不存在`);
    }

    // 如果是联邦模块，重新加载
    if (metadata.source === 'federation') {
      const module = this.getModule(moduleId);
      if (module && (module as any).federation) {
        // 清除现有注册
        this.unregister(moduleId);
        
        // 重新加载
        await this.loadFederationModule(
          moduleId,
          (module as any).federation.remoteName,
          (module as any).federation.exposedModule,
          (module as any).federation.entryUrl
        );
      }
    }
  }
}

// 导出单例实例
export const moduleRegistry = ModuleRegistry.getInstance();

// 便捷方法导出
export const {
  register,
  registerResource,
  getModule,
  getResource,
  getResourceItem,
  hasModule,
  hasResource,
  hasResourceItem,
  unregister,
  unregisterResource,
  getAllModuleIds,
  getAllModules,
  clear,
  batchRegister,
  searchModules,
  // 新增的微前端和联邦模块支持方法
  updateMetadata,
  getMetadata,
  getAllMetadata,
  loadFederationModule,
  handleModuleUnload,
  batchLoadFederationModules,
  getModuleStats,
  reloadModule
} = moduleRegistry;

export default moduleRegistry;