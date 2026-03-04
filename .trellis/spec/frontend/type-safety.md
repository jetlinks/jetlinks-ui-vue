# 类型安全

> 本项目 TypeScript 类型实践。

---

## 概览

项目基于 TypeScript（`tsconfig.base.json` 开启 `strict: true`）。
考虑到历史模块，允许渐进式增强类型，而非一次性重构。

## 类型组织

- 环境类型：`env.d.ts`
- 组件/页面局部类型：同目录 `types.d.ts` / `typing.d.ts`
- 路由扩展类型：路由类型声明文件
- API 响应尽量复用已有共享类型

参考：

- `jetlinks-web-core/src/env.d.ts`
- `jetlinks-web-core/src/router/types.ts`
- `modules/authentication-manager-ui/views/system/Role/Detail/User/index.d.ts`

## 约束建议

- 新增功能尽量避免新增大范围 `any`
- 必须使用 `any` 时尽量缩小作用域
- 接口返回结构稳定时，应补齐显式类型

## 常见问题

- 通过 `as any` 直接绕过错误
- 表单/接口字段类型不一致
- 重复定义同一领域类型
