# 子模块路由覆盖使用指南

## 概述

本指南说明如何在子模块中覆盖 `jetlinks-web-core` 的核心路由（如登录页、OAuth 授权页等）。

## 快速开始

### 1. 在子模块中实现 `getCoreRouteOverrides` 函数

在子模块的 `index.ts` 中导出 `getCoreRouteOverrides` 函数：

```typescript
// modules/custom-auth-ui/index.ts
import type { ModuleRouteOverride } from '@jetlinks-web-core/router/types'
import { RouteSecurityLevel } from '@jetlinks-web-core/router/types'

/**
 * 覆盖核心路由示例：自定义登录页
 */
const getCoreRouteOverrides = (): ModuleRouteOverride[] => {
  return [
    {
      path: '/login',
      name: 'Login',
      component: () => import('./views/custom-login/index.vue'),
      meta: {
        title: '企业统一登录',
        security: RouteSecurityLevel.PUBLIC // 必须标记为公开
      }
    }
  ]
}

export default {
  getCoreRouteOverrides,
  getAsyncRoutesMap: () => ({}),
  priority: 100 // 高优先级确保覆盖生效
}
```

### 2. 可覆盖的核心路由

以下路由可以被子模块覆盖：

| Key | 说明 | 默认路径 |
|-----|------|---------|
| `LOGIN_ROUTE` | 登录页面 | `/login` |
| `OAuth2` | OAuth2授权页 | `/oauth` |
| `AUTHORIZE_ROUTE` | 分享授权认证 | `/share/authorize` |
| `Demo` | Demo演示页 | `/demo` |
| `Scene` | 场景商城 | `/scene` |
| `RegisterRoute` | 注册页面 | `/register` |
| `AccountCenterBind` | 第三方账号绑定 | `/account/center/bind` |
| `IdentityResultRoute` | 身份验证结果页 | `/identity-result` |
| `OAuthWechat` | 微信OAuth授权 | `/oauth/wechat` |

⚠️ **注意**：`NOT_FIND_ROUTE` (404页面) 不允许被覆盖。

### 3. 安全级别说明

使用 `meta.security` 字段定义路由的安全级别：

```typescript
import { RouteSecurityLevel } from '@jetlinks-web-core/router/types'

// 公开路由，无需 token
security: RouteSecurityLevel.PUBLIC

// 需要 token，但无需菜单权限
security: RouteSecurityLevel.AUTHENTICATED

// 需要 token 和菜单权限（默认）
security: RouteSecurityLevel.AUTHORIZED
```

## 高级用法

### 删除路由

如果不需要某个路由，可以将 `component` 设置为 `undefined`：

```typescript
{
  name: 'RegisterRoute',
  component: undefined
}
// 等同于
{
  name: 'RegisterRoute'
}
```

### 调试信息

在开发环境下，控制台会输出路由覆盖信息：

```
[Route Override] 已应用 2 个路由覆盖:
  - LOGIN_ROUTE: 替换为企业统一认证登录页
  - RegisterRoute: [已移除]

[Router] 核心路由配置: {
  coreRoutes: ['LOGIN_ROUTE', 'OAuth2', ...],
  tokenFilterPaths: ['/login', '/oauth', ...],
  menuFilterPaths: ['/demo', '/scene', ...]
}
```

### 优先级控制

模块的 `priority` 值越大，优先级越高。后加载的高优先级模块会覆盖之前的配置：

```typescript
export default {
  getCoreRouteOverrides,
  priority: 100 // 高优先级
}
```

## 迁移指南

### 从旧的 `getFilterRoutes` 迁移

**旧方式**（已废弃）：

```typescript
const getFilterRoutes = () => {
  return ['/custom-route']
}
```

**新方式**（推荐）：

```typescript
const getDefaultRoutes = () => {
  return [{
    path: '/custom-route',
    name: 'CustomRoute',
    component: () => import('./views/custom/index.vue'),
    meta: {
      security: RouteSecurityLevel.PUBLIC // 使用 meta 配置
    }
  }]
}
```

## 常见问题

### Q: 为什么我的路由覆盖没有生效？

A: 检查以下几点：
1. `getCoreRouteOverrides` 是否正确导出
2. 模块的 `priority` 是否足够高
3. `key` 是否与核心路由注册表中的 key 一致
4. 查看控制台是否有警告信息

### Q: 如何确保自定义登录页不需要 token 验证？

A: 必须在 `meta` 中设置 `security: RouteSecurityLevel.PUBLIC`：

```typescript
meta: {
  security: RouteSecurityLevel.PUBLIC
}
```

### Q: 可以覆盖 404 页面吗？

A: 不可以。`NOT_FIND_ROUTE` 是受保护的路由，不允许被覆盖。尝试覆盖会在控制台输出错误信息。

## 技术原理

该机制基于以下设计：`

1. **核心路由注册表**：在 `coreRoutes.ts` 中集中管理所有可被覆盖的核心路由
2. **模块收集器**：在路由初始化前，收集所有子模块的覆盖配置
3. **安全验证**：通过白名单机制和 meta 配置，确保 token 验证不被绕过
4. **向后兼容**：保留旧的 `getFilterRoutes` API，但推荐使用新的 `meta.security` 方式

