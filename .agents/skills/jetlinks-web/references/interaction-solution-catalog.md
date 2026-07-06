# JetLinks Web 交互方案目录（薄索引）

本文件不存放模版正文。**加载策略**（防爆上下文）见 [`../../jetlinks-web-style/references/style-catalog.md`](../../jetlinks-web-style/references/style-catalog.md)。

## 事实源分片

| 文件 | 何时读 |
| --- | --- |
| [`style-catalog.md`](../../jetlinks-web-style/references/style-catalog.md) | 先看索引与推荐加载路径 |
| [`style-catalog-routing.md`](../../jetlinks-web-style/references/style-catalog-routing.md) | 业务任务 → 方案路由、方案统一字段、档案输出（**小文件，可整篇**） |
| [`style-catalog-core.md`](../../jetlinks-web-style/references/style-catalog-core.md) | 硬约束**入口表**（指向 base / detail-shell） |
| [`style-catalog-core-base.md`](../../jetlinks-web-style/references/style-catalog-core-base.md) | §1–§6（**~7KB**，通用硬约束） |
| [`style-catalog-core-detail-shell.md`](../../jetlinks-web-style/references/style-catalog-core-detail-shell.md) | §7+（**~16KB**，详情 / 侧栏 / FAB） |
| [`style-catalog-templates.md`](../../jetlinks-web-style/references/style-catalog-templates.md) | 13 个方案 ASCII 与组件清单（**只读推荐方案与替代方案的 `###` 小节，禁止整篇**） |

## 13 个方案名（详述在 templates 分片）

标准管理表格页 · 资产卡片台账页 · 筛选工作台页 · 多对象对比页 · 处置工作台 · 对象详情工作区 · 主从详情工作区 · 配置态-运行态切换页 · 配置向导 / 能力开通页 · 资源 / 能力选择器 · 监控感知页 · 分析钻取页 · 时间线 / 日志流页

## 使用约定

- 不要在本文件维护模版字段、骨架、组件清单或反例；更新请改 `style-catalog-*.md` 中对应分片。
- 需要建立交互方案档案时，加载 `../../jetlinks-web-style/SKILL.md`，并按 `style-catalog-routing.md` 路由表挑 1 个推荐方案和最多 3 个替代，`style-catalog-templates.md` 只取对应节；事实清楚时可默认采用推荐方案，结构不确定时再让用户选。
- 不要把本文件当作组件存在性证据；组件以当前 workspace 的 `jetlinks-web-core` 为准。
