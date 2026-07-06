# 页面交互方案目录（索引）

本页是 JetLinks 前端交互方案的**入口索引**，用于降低上下文体积：**按需打开子文件**，避免单次加载整本目录。

最终实现仍须回到 `jetlinks-web`，按当前 workspace 的 `jetlinks-web-core` 核验组件、hooks、utils 与相邻页面用法。

## 子文件（按阅读顺序）

| 文件 | 体量（约） | 何时读 |
| --- | --- | --- |
| [`style-catalog-core.md`](style-catalog-core.md) | core **入口表**（指向 base / detail-shell 两片） | 先读本行，再按任务打开子文件 |
| [`style-catalog-core-base.md`](style-catalog-core-base.md) | §1–§6：编辑梯度、首屏、状态、密度、文案、弹窗 | **几乎每次**都要读（~7KB） |
| [`style-catalog-core-detail-shell.md`](style-catalog-core-detail-shell.md) | §7+：详情头、编辑统一、详情 10 条、侧栏、PageHead、FAB | **详情 / 主从 / 配置态切换 / 侧栏壳**时读（~16KB） |
| [`style-catalog-routing.md`](style-catalog-routing.md) | 业务任务 → 方案路由表、方案统一字段、档案输出、推荐措辞 | **选方案时**必读（体量小，可整篇） |
| [`style-catalog-templates.md`](style-catalog-templates.md) | 13 个交互方案详述（ASCII、组件、不借鉴清单） | **用户选定或候选 narrowed 后**，只打开对应 `### N. …` 章节 |

## 推荐加载路径（防爆上下文）

1. **选型阶段**：先读 `style-catalog-routing.md`（整篇）+ `style-catalog-core-base.md`（整篇）。若候选含对象详情 / 主从 / 配置态-运行态 / 明显侧栏壳，追加 `style-catalog-core-detail-shell.md`。**不要**打开 `style-catalog-templates.md` 全文。
2. **候选列出后**：只读 `style-catalog-templates.md` 中与 2–4 个候选对应的 `###` 小节（例如只读 `### 2. 资产卡片台账页`）。
3. **实现阶段**：`style-catalog-core-base.md`（必带）+ 按需 `style-catalog-core-detail-shell.md` + `jetlinks-web/references/component-reuse-patterns.md` 场景矩阵；模版细节以已选方案那一节为准，无需重读全部 13 个方案。

## 维护约定

- 修改 §1–§6 → 编辑 `style-catalog-core-base.md`；修改 §7+、侧栏、PageHead、FAB → 编辑 `style-catalog-core-detail-shell.md`。`style-catalog-core.md` 仅保留入口表，不囤积正文。
- 修改路由表、统一字段、档案字段、推荐措辞 → 编辑 `style-catalog-routing.md`。
- 修改单个交互方案 → 编辑 `style-catalog-templates.md` 对应 `###` 节。
- **本索引文件**只保留入口、表格与加载策略，不囤积正文。
- `style-selection-rules.md` 中凡写「按 style-catalog.md …」处，语义上等同于「按本索引指向的子文件」。

## 13 个方案在 templates 文件中的锚点速查

打开 [`style-catalog-templates.md`](style-catalog-templates.md) 后检索：

1. 标准管理表格页  
2. 资产卡片台账页  
3. 筛选工作台页  
4. 多对象对比页  
5. 处置工作台  
6. 对象详情工作区  
7. 主从详情工作区  
8. 配置态-运行态切换页  
9. 配置向导 / 能力开通页  
10. 资源 / 能力选择器  
11. 监控感知页  
12. 分析钻取页  
13. 时间线 / 日志流页  
