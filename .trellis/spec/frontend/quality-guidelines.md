# 质量规范

> 本项目前端质量要求。

---

## 概览

质量保障重点：

- 结构一致性（主应用/子模块）
- 可维护性（复用 API、Hook、组件）
- 可验证性（构建、冒烟测试）

## 禁止模式

- 提交调试日志与无用代码
- 在组件内硬编码后端路径或重复请求逻辑
- 无明确理由新增不一致代码风格

## 必须遵守

- 优先使用别名导入（`@jetlinks-web-core/*`、`@<module>/*`）
- 请求统一落在 `api/*.ts`
- 页面复杂逻辑优先抽为 Hook/工具函数
- 遵循模块入口约定：`index.ts` + `register.ts`
- 新增页面/功能前先检索 `jetlinks-web-capabilities.md`，优先复用 `@jetlinks-web/*` 能力

## Vue Auto Import 约束

项目已启用 `unplugin-auto-import`（`vue`、`vue-router`）。

- 在 `.vue`（尤其 `script setup`）中，不要重复导入已自动注入的 API；
- 常见无需手动导入：`ref`、`reactive`、`computed`、`watch`、`onMounted`、`useRoute`、`useRouter` 等；
- `import type { ... } from 'vue'` 可以保留（类型导入不受此约束）；
- 若文件不在自动导入覆盖范围，或确需显式导入，需在 Code Review 说明原因。

### 错误与正确示例

```ts
// ❌ 不推荐（重复导入）
import { ref, computed } from 'vue'
```

```ts
// ✅ 推荐（直接使用自动导入）
const count = ref(0)
const double = computed(() => count.value * 2)
```

## 测试与验证

建议至少执行：

- `pnpm build`
- 模块构建：`pnpm -F jetlinks-web-core build -- --module-name <module-id>`
- 关键流程变更可执行 `pnpm test`

## Code Review 清单

- 目录结构是否符合模块约定
- CRUD 是否正确使用现有 API
- 状态变更后是否正确刷新视图
- 错误反馈是否使用统一消息机制
- 格式是否符合 `.prettierrc`
