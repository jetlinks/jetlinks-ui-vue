/**
 * 模块注册中心使用示例
 */

import { moduleRegistry } from '@/utils/module-registry';
import type { ModuleResource } from '@/types/module-registry.d';

// 示例1: 注册设备管理模块的资源
function registerDeviceModule() {
  // 注册API
  moduleRegistry.registerResource('device-manager', 'apis', {
    getDeviceList: async (params: any) => {
      // 模拟API调用
      console.log('获取设备列表', params);
      return { data: [] };
    },
    createDevice: async (device: any) => {
      console.log('创建设备', device);
      return { success: true };
    }
  });

  // 注册组件
  moduleRegistry.registerResource('device-manager', 'components', {
    DeviceTable: () => import('@/modules/device-manager-ui/components/DeviceTable.vue'),
    DeviceForm: () => import('@/modules/device-manager-ui/components/DeviceForm.vue')
  });

  // 注册工具函数
  moduleRegistry.registerResource('device-manager', 'utils', {
    formatDeviceStatus: (status: string) => {
      const statusMap: Record<string, string> = {
        'online': '在线',
        'offline': '离线',
        'unknown': '未知'
      };
      return statusMap[status] || '未知';
    },
    validateDeviceConfig: (config: any) => {
      // 验证逻辑
      return config && config.name && config.type;
    }
  });

  // 注册静态资源
  moduleRegistry.registerResource('device-manager', 'assets', {
    icons: {
      device: '/assets/device-icon.png',
      product: '/assets/product-icon.png'
    }
  });

  console.log('设备管理模块资源注册完成');
}

// 示例2: 注册数据收集模块
function registerDataCollectorModule() {
  const dataCollectorResource: Partial<ModuleResource> = {
    moduleId: 'data-collector',
    apis: {
      getChannels: async () => ({ data: [] }),
      createChannel: async (channel: any) => ({ success: true })
    },
    components: {
      ChannelTable: () => import('@/modules/data-collector-ui/components/ChannelTable.vue')
    },
    utils: {
      parseChannelData: (data: any) => {
        // 解析逻辑
        return data;
      }
    }
  };

  moduleRegistry.register('data-collector', dataCollectorResource);
  console.log('数据收集模块注册完成');
}

// 示例3: 获取和使用已注册的资源
async function useRegisteredResources() {
  // 获取设备管理模块的API
  const deviceApis = moduleRegistry.getResource('device-manager', 'apis');
  if (deviceApis?.getDeviceList) {
    const result = await deviceApis.getDeviceList({ page: 1, size: 10 });
    console.log('设备列表:', result);
  }

  // 获取特定的工具函数
  const formatStatus = moduleRegistry.getResourceItem('device-manager', 'utils', 'formatDeviceStatus');
  if (formatStatus) {
    console.log('格式化状态:', formatStatus('online')); // 输出: 在线
  }

  // 获取组件
  const DeviceTable = moduleRegistry.getResourceItem('device-manager', 'components', 'DeviceTable');
  if (DeviceTable) {
    // 在Vue组件中使用
    console.log('设备表格组件已获取');
  }

  // 检查模块是否存在
  if (moduleRegistry.hasModule('device-manager')) {
    console.log('设备管理模块已注册');
  }

  // 检查特定资源是否存在
  if (moduleRegistry.hasResourceItem('device-manager', 'apis', 'getDeviceList')) {
    console.log('getDeviceList API 已注册');
  }
}

// 示例4: 批量注册多个模块
function batchRegisterModules() {
  const modules = [
    {
      moduleId: 'authentication',
      resource: {
        apis: {
          login: async (credentials: any) => ({ token: 'mock-token' }),
          logout: async () => ({ success: true })
        },
        utils: {
          validateToken: (token: string) => !!token,
          parseUserInfo: (token: string) => ({ id: 1, name: 'user' })
        }
      }
    },
    {
      moduleId: 'notification',
      resource: {
        apis: {
          sendNotification: async (message: any) => ({ sent: true })
        },
        components: {
          NotificationCenter: () => import('@/modules/notify-manager-ui/components/NotificationCenter.vue')
        }
      }
    }
  ];

  moduleRegistry.batchRegister(modules, { allowPartialFailure: true });
  console.log('批量注册完成');
}

// 示例5: 搜索功能
function searchModuleResources() {
  // 搜索所有包含 apis 的模块
  const modulesWithApis = moduleRegistry.searchModules('apis');
  console.log('包含API的模块:', modulesWithApis);

  // 搜索包含特定API的模块
  const modulesWithLogin = moduleRegistry.searchModules('apis', 'login');
  console.log('包含login API的模块:', modulesWithLogin);

  // 获取所有已注册的模块
  const allModules = moduleRegistry.getAllModuleIds();
  console.log('所有已注册模块:', allModules);
}

// 示例6: 在Vue组件中使用
export const useDeviceModule = () => {
  // 获取设备模块的所有资源
  const deviceModule = moduleRegistry.getModule('device-manager');
  
  // 创建响应式的API调用函数
  const getDeviceList = async (params: any) => {
    const api = moduleRegistry.getResourceItem('device-manager', 'apis', 'getDeviceList');
    if (api) {
      return await api(params);
    }
    throw new Error('设备列表API未找到');
  };

  // 获取工具函数
  const formatStatus = moduleRegistry.getResourceItem('device-manager', 'utils', 'formatDeviceStatus');

  return {
    deviceModule,
    getDeviceList,
    formatStatus
  };
};

// 示例7: 错误处理
function handleRegistryErrors() {
  try {
    // 尝试注册空模块ID
    moduleRegistry.register('', {});
  } catch (error) {
    console.error('注册失败:', error);
  }

  try {
    // 尝试获取不存在的模块
    const nonExistent = moduleRegistry.getModule('non-existent-module');
    console.log('不存在的模块:', nonExistent); // undefined
  } catch (error) {
    console.error('获取失败:', error);
  }
}

// 导出示例函数
export {
  registerDeviceModule,
  registerDataCollectorModule,
  useRegisteredResources,
  batchRegisterModules,
  searchModuleResources,
  handleRegistryErrors
};

// 运行示例
export function runExamples() {
  console.log('=== 模块注册中心使用示例 ===');
  
  registerDeviceModule();
  registerDataCollectorModule();
  batchRegisterModules();
  
  useRegisteredResources();
  searchModuleResources();
  handleRegistryErrors();
  
  console.log('=== 示例运行完成 ===');
}