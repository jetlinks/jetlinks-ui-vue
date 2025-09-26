/**
 * 模块注册中心类型定义文件
 */

import { Component } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { moduleRegistry } from '@/utils/module-registry'

// 基础类型定义
export type ModuleResourceKey = string;
export type ResourceType = 'apis' | 'components' | 'utils' | 'assets' | 'hooks' | 'routes' | 'locales' | 'stores';

// API相关类型
export interface ApiFunction {
  (...args: any[]): Promise<any>;
}

export interface ApiModule {
  [key: string]: ApiFunction | ApiModule;
}

// 组件相关类型
export interface ComponentResource {
  [key: string]: Component;
}

// 工具函数相关类型
export interface UtilFunction {
  (...args: any[]): any;
}

export interface UtilModule {
  [key: string]: UtilFunction | UtilModule;
}

// 静态资源相关类型
export interface AssetResource {
  [key: string]: string | Record<string, string>;
}

// 钩子函数相关类型
export interface HookFunction {
  (...args: any[]): any;
}

export interface HookModule {
  [key: string]: HookFunction;
}

// 路由相关类型
export interface RouteModule {
  getAsyncRoutesMap?: () => Record<string, () => Promise<any>>;
  getExtraRoutesMap?: () => Record<string, any>;
  getComponents?: () => Record<string, any>;
  [key: string]: any;
}

// 国际化相关类型
export interface LocaleModule {
  [locale: string]: Record<string, string>;
}

// 状态管理相关类型
export interface StoreModule {
  [key: string]: any;
}

// 模块资源接口
export interface ModuleResource {
  /** 模块唯一标识 */
  moduleId: string;
  /** API接口集合 */
  apis?: Record<string, ApiFunction | ApiModule>;
  /** 组件集合 */
  components?: ComponentResource;
  /** 工具函数集合 */
  utils?: Record<string, UtilFunction | UtilModule>;
  /** 静态资源 */
  assets?: AssetResource;
  /** 钩子函数 */
  hooks?: HookModule;
  /** 路由配置 */
  routes?: RouteModule;
  /** 国际化资源 */
  locales?: LocaleModule;
  /** 状态管理 */
  stores?: Record<string, StoreModule>;
  /** 各种类型的事件 */
  events?: Record<string, UtilFunction>;
  /** 其他自定义资源 */
  [key: string]: any;
}

// 注册选项接口
export interface RegisterOptions {
  /** 是否覆盖已存在的资源，默认false */
  override?: boolean;
  /** 是否允许部分注册失败，默认false */
  allowPartialFailure?: boolean;
}

// 批量注册配置接口
export interface BatchRegisterConfig {
  moduleId: string;
  resource: Partial<ModuleResource>;
}

// 搜索选项接口
export interface SearchOptions {
  /** 是否精确匹配 */
  exact?: boolean;
  /** 是否区分大小写 */
  caseSensitive?: boolean;
}

// 模块注册中心类接口
export interface IModuleRegistry {
  /**
   * 注册模块资源
   */
  register(moduleId: string, resource: Partial<ModuleResource>, options?: RegisterOptions): void;

  /**
   * 注册模块的特定资源类型
   */
  registerResource<T = any>(
    moduleId: string,
    resourceType: keyof ModuleResource,
    resources: Record<string, T>,
    options?: RegisterOptions
  ): void;

  /**
   * 获取模块的完整资源
   */
  getModule(moduleId: string): ModuleResource | undefined;

  /**
   * 获取模块的特定资源类型
   */
  getResource<T = any>(moduleId: string, resourceType: keyof ModuleResource): Record<string, T> | undefined;

  /**
   * 获取模块的特定资源项
   */
  getResourceItem<T = any>(
    moduleId: string,
    resourceType: keyof ModuleResource,
    resourceName: string
  ): T | undefined;

  /**
   * 检查模块是否已注册
   */
  hasModule(moduleId: string): boolean;

  /**
   * 检查模块是否有特定资源类型
   */
  hasResource(moduleId: string, resourceType: keyof ModuleResource): boolean;

  /**
   * 检查模块是否有特定资源项
   */
  hasResourceItem(moduleId: string, resourceType: keyof ModuleResource, resourceName: string): boolean;

  /**
   * 移除模块
   */
  unregister(moduleId: string): boolean;

  /**
   * 移除模块的特定资源类型
   */
  unregisterResource(moduleId: string, resourceType: keyof ModuleResource): boolean;

  /**
   * 获取所有已注册的模块ID
   */
  getAllModuleIds(): string[];

  /**
   * 获取所有已注册的模块
   */
  getAllModules(): Map<string, ModuleResource>;

  /**
   * 清空所有注册的模块
   */
  clear(): void;

  /**
   * 批量注册多个模块
   */
  batchRegister(modules: BatchRegisterConfig[], options?: RegisterOptions): void;

  /**
   * 搜索包含特定资源的模块
   */
  searchModules(resourceType: keyof ModuleResource, resourceName?: string): string[];

  /**
   * 注册远程模块
   */
  loadRemoteModule(moduleId: string, path: string): Promise<void>

  /**
   * 注册单个远程组件
   */
  loadRemoteComponent(moduleId: string, path: string, componentName: string): Promise<void>
}

// 泛型助手类型
export type GetResourceType<T extends keyof ModuleResource> =
  T extends 'apis' ? Record<string, ApiFunction | ApiModule> :
  T extends 'components' ? ComponentResource :
  T extends 'utils' ? Record<string, UtilFunction | UtilModule> :
  T extends 'assets' ? AssetResource :
  T extends 'hooks' ? HookModule :
  T extends 'routes' ? RouteModule :
  T extends 'locales' ? LocaleModule :
  T extends 'stores' ? Record<string, StoreModule> :
  T extends 'events' ? Record<string, UtilFunction> :
  any;

// 辅助工具类型
export type ModuleId = string;
export type ResourceName = string;

// 模块配置类型（用于模块初始化）
export interface ModuleConfig {
  /** 模块ID */
  id: string;
  /** 模块名称 */
  name?: string;
  /** 模块版本 */
  version?: string;
  /** 模块描述 */
  description?: string;
  /** 模块依赖 */
  dependencies?: string[];
  /** 模块配置 */
  config?: Record<string, any>;
}

// 错误类型定义
export class ModuleRegistryError extends Error {
  constructor(
    message: string,
    public moduleId?: string,
    public resourceType?: keyof ModuleResource,
    public resourceName?: string
  ) {
    super(message);
    this.name = 'ModuleRegistryError';
  }
}

// 全局声明扩展
declare global {
  interface Window {
    __MODULE_REGISTRY__?: IModuleRegistry;
  }
}
