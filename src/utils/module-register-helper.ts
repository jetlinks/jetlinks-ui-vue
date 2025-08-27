/**
 * 模块注册辅助工具
 * 提供便捷的方法帮助各个子模块注册资源
 */

import { moduleRegistry } from './module-registry';
import type { ModuleResource, RegisterOptions } from '@/types/module-registry';

/**
 * 模块注册构建器类
 * 提供链式调用的方式来构建和注册模块资源
 */
export class ModuleRegistryBuilder {
  private moduleId: string;
  private resource: Partial<ModuleResource> = {};
  private options: RegisterOptions = {};

  constructor(moduleId: string) {
    if (!moduleId) {
      throw new Error('模块ID不能为空');
    }
    this.moduleId = moduleId;
    this.resource.moduleId = moduleId;
  }

  /**
   * 添加API资源
   * @param apis API对象
   * @returns this
   */
  apis(apis: Record<string, any>): this {
    this.resource.apis = { ...this.resource.apis, ...apis };
    return this;
  }

  /**
   * 添加组件资源
   * @param components 组件对象
   * @returns this
   */
  components(components: Record<string, any>): this {
    this.resource.components = { ...this.resource.components, ...components };
    return this;
  }

  /**
   * 添加工具函数资源
   * @param utils 工具函数对象
   * @returns this
   */
  utils(utils: Record<string, any>): this {
    this.resource.utils = { ...this.resource.utils, ...utils };
    return this;
  }

  /**
   * 添加静态资源
   * @param assets 静态资源对象
   * @returns this
   */
  assets(assets: Record<string, any>): this {
    this.resource.assets = { ...this.resource.assets, ...assets };
    return this;
  }

  /**
   * 添加钩子函数资源
   * @param hooks 钩子函数对象
   * @returns this
   */
  hooks(hooks: Record<string, any>): this {
    this.resource.hooks = { ...this.resource.hooks, ...hooks };
    return this;
  }

  /**
   * 添加路由资源
   * @param routes 路由配置
   * @returns this
   */
  routes(routes: any): this {
    this.resource.routes = routes;
    return this;
  }

  /**
   * 添加国际化资源
   * @param locales 国际化对象
   * @returns this
   */
  locales(locales: Record<string, any>): this {
    this.resource.locales = { ...this.resource.locales, ...locales };
    return this;
  }

  /**
   * 添加状态管理资源
   * @param stores 状态管理对象
   * @returns this
   */
  stores(stores: Record<string, any>): this {
    this.resource.stores = { ...this.resource.stores, ...stores };
    return this;
  }

  /**
   * 添加自定义资源
   * @param key 资源键
   * @param value 资源值
   * @returns this
   */
  custom(key: string, value: any): this {
    this.resource[key] = value;
    return this;
  }

  /**
   * 设置注册选项
   * @param options 注册选项
   * @returns this
   */
  withOptions(options: RegisterOptions): this {
    this.options = { ...this.options, ...options };
    return this;
  }

  /**
   * 允许覆盖已存在的资源
   * @returns this
   */
  override(): this {
    this.options.override = true;
    return this;
  }

  /**
   * 允许部分注册失败
   * @returns this
   */
  allowPartialFailure(): this {
    this.options.allowPartialFailure = true;
    return this;
  }

  /**
   * 执行注册
   */
  register(): void {
    moduleRegistry.register(this.moduleId, this.resource, this.options);
  }

  /**
   * 获取构建的资源对象（不执行注册）
   * @returns 构建的模块资源
   */
  build(): Partial<ModuleResource> {
    return { ...this.resource };
  }
}

/**
 * 创建模块注册构建器
 * @param moduleId 模块ID
 * @returns ModuleRegistryBuilder实例
 */
export function createModuleBuilder(moduleId: string): ModuleRegistryBuilder {
  return new ModuleRegistryBuilder(moduleId);
}

/**
 * 自动注册模块函数
 * 根据模块目录结构自动发现和注册资源
 * @param moduleId 模块ID
 * @param modulePath 模块路径
 * @param options 注册选项
 */
export async function autoRegisterModule(
  moduleId: string,
  modulePath: string,
  options: RegisterOptions = {}
): Promise<void> {
  const builder = createModuleBuilder(moduleId).withOptions(options);

  try {
    // 尝试加载各种资源
    const promises: Promise<void>[] = [];

    // 加载API
    promises.push(loadModuleResource(modulePath + '/api', 'apis', builder));

    // 加载组件
    promises.push(loadModuleResource(modulePath + '/components', 'components', builder));

    // 加载工具函数
    promises.push(loadModuleResource(modulePath + '/utils', 'utils', builder));

    // 加载静态资源
    promises.push(loadModuleResource(modulePath + '/assets', 'assets', builder));

    // 加载钩子函数
    promises.push(loadModuleResource(modulePath + '/hooks', 'hooks', builder));

    // 加载路由配置
    promises.push(loadModuleRoutes(modulePath, builder));

    // 加载国际化资源
    promises.push(loadModuleResource(modulePath + '/locales', 'locales', builder));

    // 加载状态管理
    promises.push(loadModuleResource(modulePath + '/stores', 'stores', builder));

    // 等待所有资源加载完成
    await Promise.allSettled(promises);

    // 执行注册
    builder.register();

  } catch (error) {
    console.error(`自动注册模块 ${moduleId} 失败:`, error);
    if (!options.allowPartialFailure) {
      throw error;
    }
  }
}

/**
 * 加载模块资源的通用方法
 * @param resourcePath 资源路径
 * @param resourceType 资源类型
 * @param builder 构建器实例
 */
async function loadModuleResource(
  resourcePath: string,
  resourceType: keyof ModuleResource,
  builder: ModuleRegistryBuilder
): Promise<void> {
  try {
    // 这里可以根据实际项目的模块加载方式来实现
    // 例如使用 import.meta.glob 或者动态 import
    const modules = import.meta.glob(`${resourcePath}/**/*.{ts,js}`, { eager: false });
    const resources: Record<string, any> = {};

    for (const [path, loader] of Object.entries(modules)) {
      try {
        const module = await (loader as () => Promise<any>)();
        const resourceName = extractResourceName(path);
        
        if (module.default) {
          resources[resourceName] = module.default;
        } else {
          // 如果没有默认导出，将整个模块作为资源
          resources[resourceName] = module;
        }
      } catch (error) {
        console.warn(`加载资源失败: ${path}`, error);
      }
    }

    if (Object.keys(resources).length > 0) {
      (builder as any)[resourceType](resources);
    }

  } catch (error) {
    console.warn(`加载 ${resourceType} 资源失败:`, error);
  }
}

/**
 * 专门加载模块路由配置
 * @param modulePath 模块路径
 * @param builder 构建器实例
 */
async function loadModuleRoutes(
  modulePath: string,
  builder: ModuleRegistryBuilder
): Promise<void> {
  try {
    const indexFile = `${modulePath}/index.ts`;
    const routeModule = await import(indexFile);
    
    if (routeModule.default) {
      builder.routes(routeModule.default);
    }
  } catch (error) {
    console.warn('加载路由配置失败:', error);
  }
}

/**
 * 从文件路径提取资源名称
 * @param filePath 文件路径
 * @returns 资源名称
 */
function extractResourceName(filePath: string): string {
  // 提取文件名，去掉扩展名
  const fileName = filePath.split('/').pop()?.split('.')[0] || 'unnamed';
  
  // 如果是index文件，使用父目录名
  if (fileName === 'index') {
    const pathParts = filePath.split('/');
    return pathParts[pathParts.length - 2] || 'unnamed';
  }
  
  return fileName;
}

/**
 * 快速注册函数，提供简化的注册方式
 * @param moduleId 模块ID
 * @param resources 资源对象
 * @param options 注册选项
 */
export function quickRegister(
  moduleId: string,
  resources: {
    apis?: Record<string, any>;
    components?: Record<string, any>;
    utils?: Record<string, any>;
    assets?: Record<string, any>;
    hooks?: Record<string, any>;
    routes?: any;
    locales?: Record<string, any>;
    stores?: Record<string, any>;
    [key: string]: any;
  },
  options: RegisterOptions = {}
): void {
  const builder = createModuleBuilder(moduleId).withOptions(options);

  // 添加各种资源
  if (resources.apis) builder.apis(resources.apis);
  if (resources.components) builder.components(resources.components);
  if (resources.utils) builder.utils(resources.utils);
  if (resources.assets) builder.assets(resources.assets);
  if (resources.hooks) builder.hooks(resources.hooks);
  if (resources.routes) builder.routes(resources.routes);
  if (resources.locales) builder.locales(resources.locales);
  if (resources.stores) builder.stores(resources.stores);

  // 添加自定义资源
  Object.keys(resources).forEach(key => {
    if (!['apis', 'components', 'utils', 'assets', 'hooks', 'routes', 'locales', 'stores'].includes(key)) {
      builder.custom(key, resources[key]);
    }
  });

  builder.register();
}

// 导出便捷方法
export { moduleRegistry as registry };

// 默认导出
export default {
  createModuleBuilder,
  autoRegisterModule,
  quickRegister,
  ModuleRegistryBuilder,
  registry: moduleRegistry
};