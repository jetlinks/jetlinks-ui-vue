# 前端开发规范

> 本项目的前端开发实践与约定。

---

## 概览

本目录规范基于仓库当前真实代码结构（`jetlinks-web-core` + `modules/*`）。
目标是让 AI 与人工开发代码风格保持一致，减少返工。

## 规范索引

| 规范 | 说明 | 状态 |
|------|------|------|
| [目录结构](./directory-structure.md) | 模块组织与文件布局 | 已完成 |
| [组件规范](./component-guidelines.md) | 组件模式、Props、组合方式 | 已完成 |
| [Hook 规范](./hook-guidelines.md) | 自定义 Hook 与请求模式 | 已完成 |
| [工具函数规范](./utils-guidelines.md) | `utils` 导出能力、分类与示例 | 已完成 |
| [@jetlinks-web 能力地图](./jetlinks-web-capabilities.md) | `@jetlinks-web/*` 组件与方法优先级 | 已完成 |
| [状态管理](./state-management.md) | 本地状态、全局状态、服务端状态 | 已完成 |
| [质量规范](./quality-guidelines.md) | 代码标准、禁用模式、评审检查 | 已完成 |
| [类型安全](./type-safety.md) | 类型定义与约束策略 | 已完成 |

---

## 技术栈快照

- Vue 3 + Vite
- Pinia + Vue Router + Vue I18n
- Ant Design Vue + `@jetlinks-web/*`
- 多模块架构（`modules/*`）

---

**文档语言**：中文（关键术语、路径、标识符保留英文）。
